const { Sequelize } = require('sequelize');

/**
 * Enum Management Utility
 * Handles PostgreSQL enum modifications safely
 */
class EnumManager {
  constructor() {
    this.sequelize = require('../config/database');
  }

  /**
   * Check if enum type exists
   */
  async enumExists(enumName) {
    try {
      const [results] = await this.sequelize.query(`
        SELECT 1 FROM pg_type WHERE typname = $1
      `, { replacements: [enumName] });
      
      return results.length > 0;
    } catch (error) {
      console.error(`Error checking enum existence: ${error.message}`);
      return false;
    }
  }

  /**
   * Get all values in an enum type
   */
  async getEnumValues(enumName) {
    try {
      const [results] = await this.sequelize.query(`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (
          SELECT oid FROM pg_type WHERE typname = $1
        )
        ORDER BY enumsortorder
      `, { replacements: [enumName] });
      
      return results.map(row => row.enumlabel);
    } catch (error) {
      console.error(`Error getting enum values: ${error.message}`);
      return [];
    }
  }

  /**
   * Add a value to an existing enum type
   */
  async addEnumValue(enumName, newValue) {
    try {
      // Check if enum exists
      if (!(await this.enumExists(enumName))) {
        throw new Error(`Enum type '${enumName}' does not exist`);
      }

      // Check if value already exists
      const existingValues = await this.getEnumValues(enumName);
      if (existingValues.includes(newValue)) {
        console.log(`✅ Enum value '${newValue}' already exists in '${enumName}'`);
        return true;
      }

      // Add the new value
      await this.sequelize.query(`
        ALTER TYPE ${enumName} ADD VALUE '${newValue}'
      `);
      
      console.log(`✅ Added '${newValue}' to enum '${enumName}'`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to add enum value: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new enum type
   */
  async createEnum(enumName, values) {
    try {
      // Check if enum already exists
      if (await this.enumExists(enumName)) {
        console.log(`✅ Enum type '${enumName}' already exists`);
        return true;
      }

      // Create the enum type
      const valuesList = values.map(v => `'${v}'`).join(', ');
      await this.sequelize.query(`
        CREATE TYPE ${enumName} AS ENUM (${valuesList})
      `);
      
      console.log(`✅ Created enum '${enumName}' with values: ${values.join(', ')}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create enum: ${error.message}`);
      throw error;
    }
  }

  /**
   * Safely add super_admin to role enum
   */
  async addSuperAdminRole() {
    try {
      console.log('🔄 Adding super_admin to role enum...');
      
      // Check current database type
      const isPostgreSQL = this.sequelize.getDialect() === 'postgres';
      
      if (isPostgreSQL) {
        // For PostgreSQL, add to existing enum
        await this.addEnumValue('enum_users_role', 'super_admin');
      } else {
        // For SQLite, we don't need to modify the enum
        console.log('✅ SQLite detected - no enum modification needed');
      }
      
      console.log('✅ Super admin role added successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to add super admin role:', error.message);
      throw error;
    }
  }

  /**
   * Update column to use new enum value
   */
  async updateColumnEnum(tableName, columnName, enumName) {
    try {
      const isPostgreSQL = this.sequelize.getDialect() === 'postgres';
      
      if (isPostgreSQL) {
        // For PostgreSQL, update column type
        await this.sequelize.query(`
          ALTER TABLE ${tableName} 
          ALTER COLUMN ${columnName} TYPE ${enumName} 
          USING ${columnName}::text::${enumName}
        `);
        
        console.log(`✅ Updated column ${tableName}.${columnName} to use ${enumName}`);
      } else {
        // For SQLite, no action needed
        console.log('✅ SQLite detected - no column update needed');
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to update column enum: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get enum information for debugging
   */
  async getEnumInfo(enumName) {
    try {
      const isPostgreSQL = this.sequelize.getDialect() === 'postgres';
      
      if (!isPostgreSQL) {
        console.log('ℹ️  SQLite detected - enum info not applicable');
        return null;
      }

      const exists = await this.enumExists(enumName);
      if (!exists) {
        console.log(`❌ Enum '${enumName}' does not exist`);
        return null;
      }

      const values = await this.getEnumValues(enumName);
      
      const info = {
        name: enumName,
        exists: true,
        values: values
      };
      
      console.log(`📊 Enum Info for '${enumName}':`);
      console.log(`   Values: ${values.join(', ')}`);
      
      return info;
    } catch (error) {
      console.error(`❌ Failed to get enum info: ${error.message}`);
      return null;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    await this.sequelize.close();
  }
}

// CLI interface for testing
async function main() {
  const command = process.argv[2];
  const enumName = process.argv[3];
  const value = process.argv[4];
  
  const manager = new EnumManager();
  
  try {
    switch (command) {
      case 'info':
        if (!enumName) {
          console.log('Usage: node enumManager.js info <enum_name>');
          process.exit(1);
        }
        await manager.getEnumInfo(enumName);
        break;
        
      case 'add':
        if (!enumName || !value) {
          console.log('Usage: node enumManager.js add <enum_name> <value>');
          process.exit(1);
        }
        await manager.addEnumValue(enumName, value);
        break;
        
      case 'add-super-admin':
        await manager.addSuperAdminRole();
        break;
        
      default:
        console.log('Usage: node enumManager.js [info|add|add-super-admin] [enum_name] [value]');
        console.log('Examples:');
        console.log('  node enumManager.js info enum_users_role');
        console.log('  node enumManager.js add enum_users_role super_admin');
        console.log('  node enumManager.js add-super-admin');
        process.exit(1);
    }
  } catch (error) {
    console.error('Enum management failed:', error);
    process.exit(1);
  } finally {
    await manager.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = EnumManager;

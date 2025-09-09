const request = require('supertest');
const app = require('../index');
const { User, PointTransaction, PaymentTransaction } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Super Admin Role System', () => {
  let superAdminToken;
  let adminToken;
  let testUser;
  let testAdmin;
  let testSuperAdmin;

  beforeAll(async () => {
    // Create test users
    testSuperAdmin = await User.create({
      email: 'test.superadmin@test.com',
      password_hash: await bcrypt.hash('test123', 10),
      first_name: 'Test',
      last_name: 'SuperAdmin',
      role: 'super_admin',
      is_verified: true,
      is_system_admin: true
    });

    testAdmin = await User.create({
      email: 'test.admin@test.com',
      password_hash: await bcrypt.hash('test123', 10),
      first_name: 'Test',
      last_name: 'Admin',
      role: 'admin',
      is_verified: true
    });

    testUser = await User.create({
      email: 'test.user@test.com',
      password_hash: await bcrypt.hash('test123', 10),
      first_name: 'Test',
      last_name: 'User',
      role: 'client',
      is_verified: true
    });

    // Generate tokens
    superAdminToken = jwt.sign(
      { userId: testSuperAdmin.id, role: 'super_admin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    adminToken = jwt.sign(
      { userId: testAdmin.id, role: 'admin' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Clean up test data
    await User.destroy({ where: { email: { [Op.like]: 'test.%' } } });
  });

  describe('User Management', () => {
    test('Super admin can get all users', async () => {
      const response = await request(app)
        .get('/api/super-admin/users')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    test('Regular admin cannot access user management', async () => {
      const response = await request(app)
        .get('/api/super-admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(403);
    });

    test('Super admin can update user roles', async () => {
      const response = await request(app)
        .put(`/api/super-admin/users/${testUser.id}/role`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({ role: 'agent' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('agent');
    });
  });

  describe('Point Management', () => {
    test('Super admin can view point transactions', async () => {
      const response = await request(app)
        .get('/api/super-admin/points/transactions')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });

    test('Super admin can award points', async () => {
      const response = await request(app)
        .post('/api/super-admin/points/award')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          userId: testUser.id,
          points: 100,
          reason: 'Test award'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify points were awarded
      const user = await User.findByPk(testUser.id);
      expect(user.points).toBe(100);
    });

    test('Regular admin cannot manage points', async () => {
      const response = await request(app)
        .post('/api/super-admin/points/award')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: testUser.id,
          points: 100,
          reason: 'Test award'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('Payment Management', () => {
    test('Super admin can view payment transactions', async () => {
      const response = await request(app)
        .get('/api/super-admin/payments/transactions')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });

    test('Super admin can process refunds', async () => {
      // Create test payment transaction
      const transaction = await PaymentTransaction.create({
        user_id: testUser.id,
        amount: 100,
        status: 'COMPLETED',
        payment_method: 'TEST'
      });

      const response = await request(app)
        .post('/api/super-admin/payments/refund')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          transactionId: transaction.id,
          reason: 'Test refund'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify refund was processed
      const updatedTransaction = await PaymentTransaction.findByPk(transaction.id);
      expect(updatedTransaction.status).toBe('REFUNDED');
    });

    test('Regular admin cannot process refunds', async () => {
      const transaction = await PaymentTransaction.create({
        user_id: testUser.id,
        amount: 100,
        status: 'COMPLETED',
        payment_method: 'TEST'
      });

      const response = await request(app)
        .post('/api/super-admin/payments/refund')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          transactionId: transaction.id,
          reason: 'Test refund'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('Admin Management', () => {
    test('Super admin can view admins', async () => {
      const response = await request(app)
        .get('/api/super-admin/admins')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.admins)).toBe(true);
    });

    test('Super admin can create admin', async () => {
      const response = await request(app)
        .post('/api/super-admin/admins')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          email: 'test.newadmin@test.com',
          password: 'test123',
          first_name: 'New',
          last_name: 'Admin'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.admin.role).toBe('admin');
    });

    test('Super admin can remove admin privileges', async () => {
      const response = await request(app)
        .delete(`/api/super-admin/admins/${testAdmin.id}`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify admin was demoted
      const updatedAdmin = await User.findByPk(testAdmin.id);
      expect(updatedAdmin.role).toBe('client');
    });

    test('Regular admin cannot manage other admins', async () => {
      const response = await request(app)
        .post('/api/super-admin/admins')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'test.newadmin2@test.com',
          password: 'test123',
          first_name: 'New',
          last_name: 'Admin'
        });

      expect(response.status).toBe(403);
    });
  });
});

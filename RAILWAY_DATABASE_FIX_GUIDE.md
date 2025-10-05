# Railway Database Fix Guide

## Step-by-Step Instructions

### 1. Access Railway Console
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Sign in to your Railway account
3. Find your project: `web_personacentric`
4. Click on the project to open it

### 2. Open the Service Console
1. In your project dashboard, you'll see your services
2. Click on the **backend service** (the one running Node.js)
3. Click on the **"Deployments"** tab
4. Click on the latest deployment (should be the one we just pushed)
5. Click **"View Logs"** or **"Console"**

### 3. Run the Database Fix Script
In the Railway console, run this command:

```bash
npm run db:fix-food-for-talk
```

**Alternative command if the above doesn't work:**
```bash
node server/runDatabaseFix.js
```

### 4. What to Expect
You should see output like this:
```
🔄 Connecting to production database...
✅ Connected to production database
📋 Existing columns: [list of existing columns]
➕ Adding column: nickname
➕ Adding column: gender
➕ Adding column: expect_person_type
...
✅ Production database schema updated successfully!
🎉 Database fix completed successfully!
```

### 5. Verify the Fix
After running the script, test the registration endpoint:

```bash
curl -X POST https://webpersonacentric-personacentric.up.railway.app/api/food-for-talk/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@railway.com&password=test123&age=25&whatsappPhone=1234567890&nickname=TestUser&gender=Male&consentAccepted=true"
```

You should get a successful response like:
```json
{
  "message": "Registration successful! You can now login with your email and password.",
  "userId": "some-uuid-here"
}
```

### 6. Test Super Admin Management
Test that super admin can access participants:
```bash
curl -X GET https://webpersonacentric-personacentric.up.railway.app/api/food-for-talk/admin/participants \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

## Troubleshooting

### If the npm script doesn't work:
Try running the script directly:
```bash
node server/runDatabaseFix.js
```

### If you get permission errors:
Make sure you're in the correct directory:
```bash
pwd
ls -la server/runDatabaseFix.js
```

### If the database connection fails:
Check that the DATABASE_URL environment variable is set correctly in Railway.

### If you see "column already exists" errors:
This is normal and expected - the script is safe to run multiple times.

## Expected Results
After running the script:
- ✅ All missing columns will be added to `food_for_talk_users` table
- ✅ Registration will work without 500 errors
- ✅ Super admin can manage participants
- ✅ All expanded registration fields will be properly stored

The fix is now ready and the Food for Talk event registration should work perfectly!

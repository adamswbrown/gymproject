# Fix Login Load Failed Scripts

These scripts help diagnose and fix "Login Load failed" errors in the gym booking application.

## Quick Start - Auto-Fix (Recommended)

### Option 1: Bash Script (Unix/Mac)

```bash
./scripts/fix-login-auto.sh
```

### Option 2: Node.js Script (Cross-platform)

```bash
node scripts/fix-login-auto.js
```

**The auto-fix scripts will:**
- ✅ Create missing `.env` files with templates
- ✅ Install missing dependencies
- ✅ Generate Prisma client
- ✅ Start API server if not running
- ✅ Fix common configuration issues

## Diagnostic Only Scripts

If you just want to diagnose without auto-fixing:

### Option 1: Bash Script (Unix/Mac)

```bash
./scripts/fix-login-load.sh
```

### Option 2: Node.js Script (Cross-platform)

```bash
node scripts/fix-login-load.js
```

## What the Auto-Fix Scripts Do

The auto-fix scripts (`fix-login-auto.sh` and `fix-login-auto.js`) automatically:

1. **Create Missing Configuration Files**
   - Creates `api/.env` with template if missing
   - Creates `ui/.env.local` with correct API URL if missing
   - Generates secure JWT_SECRET if using default value

2. **Install Dependencies**
   - Installs API dependencies if `node_modules` is missing
   - Installs frontend dependencies if `node_modules` is missing

3. **Generate Prisma Client**
   - Generates Prisma client if missing or out of date

4. **Start API Server**
   - Automatically starts API server if not running
   - Waits for server to be ready before continuing

5. **Provide Browser Cleanup Instructions**
   - Shows how to clear invalid tokens from localStorage

## What the Diagnostic Scripts Do

The diagnostic-only scripts (`fix-login-load.sh` and `fix-login-load.js`) perform the following checks:

1. **API Server Status**
   - Checks if the API server is running on port 3001
   - Tests if the API is responding to requests
   - Optionally starts the API server if it's not running

2. **API Configuration**
   - Verifies `DATABASE_URL` is set in `api/.env`
   - Verifies `JWT_SECRET` is configured
   - Verifies `JWT_EXPIRES_IN` is set

3. **Frontend Configuration**
   - Checks if `NEXT_PUBLIC_API_URL` is set in `ui/.env.local`
   - Verifies it points to the correct API URL

4. **Database Connection**
   - Checks if Prisma schema exists
   - Provides instructions for testing database connection

5. **Authentication Endpoints**
   - Tests `/auth/me` endpoint (should return 401 without auth)
   - Tests `/auth/login` endpoint

6. **Browser localStorage**
   - Provides instructions for clearing invalid tokens

## Common Issues and Fixes

### Issue: "API server is not running"

**Fix:**
```bash
cd api
npm run start:dev
```

### Issue: "Network error: API server not reachable"

**Possible causes:**
- API server is not running
- API server is running on a different port
- CORS configuration issue

**Fix:**
1. Check if API is running: `lsof -i :3001`
2. Verify `NEXT_PUBLIC_API_URL` in `ui/.env.local` matches your API URL
3. Check API CORS configuration in `api/src/main.ts`

### Issue: "Token invalid" or "401 Unauthorized"

**Fix:**
Clear the invalid token from browser localStorage:

**Option 1: Browser DevTools**
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to Application/Storage tab
3. Find Local Storage → `http://localhost:3000`
4. Delete the `auth_token` key

**Option 2: Browser Console**
```javascript
localStorage.removeItem('auth_token');
location.reload();
```

### Issue: "DATABASE_URL not configured"

**Fix:**
Create or update `api/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/gym_booking?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
```

### Issue: "NEXT_PUBLIC_API_URL not configured"

**Fix:**
Create or update `ui/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Manual Troubleshooting Steps

If the scripts don't resolve the issue, try these steps:

1. **Check API server logs:**
   ```bash
   cd api
   npm run start:dev
   # Watch for errors in the console
   ```

2. **Test API directly:**
   ```bash
   curl http://localhost:3001/auth/me
   # Should return 401 (unauthorized) - this is expected
   ```

3. **Check database connection:**
   ```bash
   cd api
   npx prisma db pull
   # Should connect successfully
   ```

4. **Clear all browser storage:**
   - Open DevTools → Application → Clear Storage
   - Click "Clear site data"

5. **Restart both servers:**
   ```bash
   # Terminal 1: API
   cd api && npm run start:dev
   
   # Terminal 2: Frontend
   cd ui && npm run dev
   ```

## Script Output

The scripts provide color-coded output:
- ✅ **Green**: Everything is working correctly
- ⚠️ **Yellow**: Warning - something might need attention
- ❌ **Red**: Error - action required

## Notes

- The bash script can automatically start the API server if it's not running
- Both scripts are read-only and won't modify your code
- The scripts check configuration but don't validate credentials
- Network errors are distinguished from authentication errors for better debugging

## Support

If issues persist after running these scripts:
1. Check the API server logs for detailed error messages
2. Verify your database is running and accessible
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly


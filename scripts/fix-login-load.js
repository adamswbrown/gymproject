#!/usr/bin/env node

/**
 * Fix Login Load Failed - Quick Diagnostic Script
 * 
 * This script helps diagnose and fix authentication issues by:
 * 1. Checking if the API server is running
 * 2. Testing API endpoints
 * 3. Verifying configuration
 * 4. Providing fix recommendations
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

function testEndpoint(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function main() {
  log('\n========================================', 'blue');
  log('Login Load Failed - Quick Diagnostic', 'blue');
  log('========================================\n', 'blue');

  const projectRoot = path.resolve(__dirname, '..');
  const apiDir = path.join(projectRoot, 'api');
  const uiDir = path.join(projectRoot, 'ui');

  // Check 1: API Server Status
  log('[1/6] Checking API server status...', 'blue');
  const apiRunning = await checkPort(3001);
  if (apiRunning) {
    log('  ✗ Port 3001 is available (server might not be running)', 'red');
    log('  → Start API server: cd api && npm run start:dev', 'yellow');
  } else {
    log('  ✓ Port 3001 is in use (server might be running)', 'green');
    
    // Test if API is actually responding
    try {
      const response = await testEndpoint('http://localhost:3001/auth/me');
      if (response.statusCode === 401) {
        log('  ✓ API is responding (401 without auth is expected)', 'green');
      } else {
        log(`  ⚠ API returned status ${response.statusCode}`, 'yellow');
      }
    } catch (error) {
      log(`  ✗ API is not responding: ${error.message}`, 'red');
      log('  → Check if API server is running correctly', 'yellow');
    }
  }
  console.log('');

  // Check 2: API Configuration
  log('[2/6] Checking API configuration...', 'blue');
  const apiEnvPath = path.join(apiDir, '.env');
  if (fs.existsSync(apiEnvPath)) {
    const envContent = fs.readFileSync(apiEnvPath, 'utf8');
    
    const checks = {
      'DATABASE_URL': envContent.includes('DATABASE_URL='),
      'JWT_SECRET': envContent.includes('JWT_SECRET='),
      'JWT_EXPIRES_IN': envContent.includes('JWT_EXPIRES_IN='),
    };
    
    Object.entries(checks).forEach(([key, exists]) => {
      if (exists) {
        log(`  ✓ ${key} is configured`, 'green');
      } else {
        log(`  ✗ ${key} is missing`, 'red');
      }
    });
  } else {
    log('  ✗ .env file not found in api directory', 'red');
    log('  → Create api/.env with required configuration', 'yellow');
  }
  console.log('');

  // Check 3: Frontend Configuration
  log('[3/6] Checking frontend configuration...', 'blue');
  const uiEnvPath = path.join(uiDir, '.env.local');
  if (fs.existsSync(uiEnvPath)) {
    const envContent = fs.readFileSync(uiEnvPath, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_API_URL=')) {
      const match = envContent.match(/NEXT_PUBLIC_API_URL=(.+)/);
      if (match) {
        const apiUrl = match[1].trim().replace(/['"]/g, '');
        log(`  ✓ NEXT_PUBLIC_API_URL is set to: ${apiUrl}`, 'green');
        if (apiUrl !== 'http://localhost:3001') {
          log('  ⚠ API URL is not pointing to localhost:3001', 'yellow');
        }
      }
    } else {
      log('  ✗ NEXT_PUBLIC_API_URL is missing', 'red');
    }
  } else {
    log('  ✗ .env.local file not found in ui directory', 'red');
    log('  → Create ui/.env.local with NEXT_PUBLIC_API_URL=http://localhost:3001', 'yellow');
  }
  console.log('');

  // Check 4: Test Auth Endpoints
  log('[4/6] Testing authentication endpoints...', 'blue');
  try {
    const meResponse = await testEndpoint('http://localhost:3001/auth/me');
    if (meResponse.statusCode === 401) {
      log('  ✓ /auth/me endpoint is accessible (401 without auth is expected)', 'green');
    } else {
      log(`  ⚠ /auth/me returned status ${meResponse.statusCode}`, 'yellow');
    }
  } catch (error) {
    log(`  ✗ /auth/me endpoint is not accessible: ${error.message}`, 'red');
  }

  try {
    const loginResponse = await testEndpoint('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
    });
    if ([400, 401].includes(loginResponse.statusCode)) {
      log('  ✓ /auth/login endpoint is accessible', 'green');
    } else {
      log(`  ⚠ /auth/login returned status ${loginResponse.statusCode}`, 'yellow');
    }
  } catch (error) {
    log(`  ✗ /auth/login endpoint is not accessible: ${error.message}`, 'red');
  }
  console.log('');

  // Check 5: Database Connection (if Prisma is available)
  log('[5/6] Checking database setup...', 'blue');
  const prismaSchemaPath = path.join(apiDir, 'prisma', 'schema.prisma');
  if (fs.existsSync(prismaSchemaPath)) {
    log('  ✓ Prisma schema found', 'green');
    // Note: We can't actually test DB connection without running Prisma commands
    log('  → To test DB connection: cd api && npx prisma db pull', 'yellow');
  } else {
    log('  ⚠ Prisma schema not found', 'yellow');
  }
  console.log('');

  // Check 6: Browser localStorage instructions
  log('[6/6] Browser localStorage cleanup', 'blue');
  log('  To clear invalid tokens from your browser:', 'yellow');
  log('  1. Open browser DevTools (F12 or Cmd+Option+I)', 'cyan');
  log('  2. Go to Application/Storage tab', 'cyan');
  log('  3. Find Local Storage → http://localhost:3000', 'cyan');
  log('  4. Delete the "auth_token" key', 'cyan');
  log('  Or run in console: localStorage.removeItem("auth_token"); location.reload();', 'cyan');
  console.log('');

  // Summary
  log('========================================', 'blue');
  log('Diagnostic Complete!', 'green');
  log('========================================\n', 'blue');
  
  log('Common Fixes:', 'yellow');
  log('  1. Start API server: cd api && npm run start:dev', 'cyan');
  log('  2. Clear browser localStorage (see instructions above)', 'cyan');
  log('  3. Check API logs for errors', 'cyan');
  log('  4. Verify DATABASE_URL in api/.env', 'cyan');
  log('  5. Verify NEXT_PUBLIC_API_URL in ui/.env.local', 'cyan');
  console.log('');
}

main().catch((error) => {
  log(`\nError: ${error.message}`, 'red');
  process.exit(1);
});


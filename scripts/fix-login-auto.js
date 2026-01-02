#!/usr/bin/env node

/**
 * Auto-Fix Login Load Issues - Diagnostic and Automatic Fix Script
 * 
 * This script diagnoses issues AND automatically fixes common problems:
 * - Creates missing .env files with templates
 * - Installs missing dependencies
 * - Generates Prisma client
 * - Starts API server if not running
 * - Provides browser localStorage cleanup instructions
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

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

function testEndpoint(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { timeout: 2000 }, (res) => {
      resolve(res.statusCode === 401 || res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    log(`  ✗ Failed to write file: ${error.message}`, 'red');
    return false;
  }
}

function appendFile(filePath, content) {
  try {
    fs.appendFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    log(`  ✗ Failed to append to file: ${error.message}`, 'red');
    return false;
  }
}

function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { cwd, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const fixesApplied = [];

  log('\n========================================', 'blue');
  log('Auto-Fix Login Load Issues', 'blue');
  log('========================================\n', 'blue');

  const projectRoot = path.resolve(__dirname, '..');
  const apiDir = path.join(projectRoot, 'api');
  const uiDir = path.join(projectRoot, 'ui');

  // Fix 1: API .env file
  log('[1/8] Checking API .env file...', 'blue');
  const apiEnvPath = path.join(apiDir, '.env');
  
  if (!fileExists(apiEnvPath)) {
    log('  ⚠ .env file not found. Creating template...', 'yellow');
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    const envContent = `DATABASE_URL="postgresql://user:password@localhost:5432/gym_booking?schema=public"
JWT_SECRET="${jwtSecret}"
JWT_EXPIRES_IN="7d"
PORT=3001
`;
    if (writeFile(apiEnvPath, envContent)) {
      fixesApplied.push('Created api/.env file with template');
      log('  ✓ Created api/.env file', 'green');
      log('  ⚠ Please update DATABASE_URL with your actual database connection string', 'yellow');
    }
  } else {
    log('  ✓ api/.env file exists', 'green');
    
    const envContent = readFile(apiEnvPath);
    
    // Check if JWT_SECRET is default
    if (envContent.includes('JWT_SECRET="your-secret-key-change-in-production"')) {
      log('  ⚠ JWT_SECRET is using default value. Generating secure secret...', 'yellow');
      const newSecret = crypto.randomBytes(32).toString('hex');
      const updated = envContent.replace(
        /JWT_SECRET="your-secret-key-change-in-production[^"]*"/,
        `JWT_SECRET="${newSecret}"`
      );
      if (writeFile(apiEnvPath, updated)) {
        fixesApplied.push('Updated JWT_SECRET with secure random value');
        log('  ✓ Updated JWT_SECRET', 'green');
      }
    }
    
    // Check if DATABASE_URL is missing
    if (!envContent.includes('DATABASE_URL=')) {
      log('  ⚠ DATABASE_URL missing. Adding template...', 'yellow');
      if (appendFile(apiEnvPath, '\nDATABASE_URL="postgresql://user:password@localhost:5432/gym_booking?schema=public"\n')) {
        fixesApplied.push('Added DATABASE_URL to api/.env');
        log('  ✓ Added DATABASE_URL', 'green');
        log('  ⚠ Please update with your actual database connection string', 'yellow');
      }
    }
  }
  console.log('');

  // Fix 2: Frontend .env.local file
  log('[2/8] Checking frontend .env.local file...', 'blue');
  const uiEnvPath = path.join(uiDir, '.env.local');
  
  if (!fileExists(uiEnvPath)) {
    log('  ⚠ .env.local file not found. Creating...', 'yellow');
    if (writeFile(uiEnvPath, 'NEXT_PUBLIC_API_URL=http://localhost:3001\n')) {
      fixesApplied.push('Created ui/.env.local file');
      log('  ✓ Created ui/.env.local file', 'green');
    }
  } else {
    const envContent = readFile(uiEnvPath);
    if (!envContent.includes('NEXT_PUBLIC_API_URL=')) {
      log('  ⚠ NEXT_PUBLIC_API_URL missing. Adding...', 'yellow');
      if (appendFile(uiEnvPath, 'NEXT_PUBLIC_API_URL=http://localhost:3001\n')) {
        fixesApplied.push('Added NEXT_PUBLIC_API_URL to ui/.env.local');
        log('  ✓ Added NEXT_PUBLIC_API_URL', 'green');
      }
    } else {
      const match = envContent.match(/NEXT_PUBLIC_API_URL=(.+)/);
      if (match) {
        const apiUrl = match[1].trim().replace(/['"]/g, '');
        if (apiUrl !== 'http://localhost:3001') {
          log(`  ⚠ NEXT_PUBLIC_API_URL is set to: ${apiUrl}`, 'yellow');
          log('  Make sure this matches your API server location', 'yellow');
        } else {
          log('  ✓ NEXT_PUBLIC_API_URL is correctly configured', 'green');
        }
      }
    }
  }
  console.log('');

  // Fix 3: Install API dependencies
  log('[3/8] Checking API dependencies...', 'blue');
  const apiNodeModules = path.join(apiDir, 'node_modules');
  if (!fileExists(apiNodeModules)) {
    log('  ⚠ API node_modules not found. Installing dependencies...', 'yellow');
    try {
      execSync('npm install', { cwd: apiDir, stdio: 'inherit' });
      fixesApplied.push('Installed API dependencies');
      log('  ✓ API dependencies installed', 'green');
    } catch (error) {
      log('  ✗ Failed to install API dependencies', 'red');
    }
  } else {
    log('  ✓ API dependencies installed', 'green');
  }
  console.log('');

  // Fix 4: Install Frontend dependencies
  log('[4/8] Checking frontend dependencies...', 'blue');
  const uiNodeModules = path.join(uiDir, 'node_modules');
  if (!fileExists(uiNodeModules)) {
    log('  ⚠ Frontend node_modules not found. Installing dependencies...', 'yellow');
    try {
      execSync('npm install', { cwd: uiDir, stdio: 'inherit' });
      fixesApplied.push('Installed frontend dependencies');
      log('  ✓ Frontend dependencies installed', 'green');
    } catch (error) {
      log('  ✗ Failed to install frontend dependencies', 'red');
    }
  } else {
    log('  ✓ Frontend dependencies installed', 'green');
  }
  console.log('');

  // Fix 5: Generate Prisma client
  log('[5/8] Checking Prisma client...', 'blue');
  const prismaSchemaPath = path.join(apiDir, 'prisma', 'schema.prisma');
  if (fileExists(prismaSchemaPath)) {
    const prismaClientPath = path.join(apiDir, 'node_modules', '.prisma', 'client', 'package.json');
    if (!fileExists(prismaClientPath)) {
      log('  ⚠ Prisma client not found. Generating...', 'yellow');
      try {
        execSync('npx prisma generate', { cwd: apiDir, stdio: 'inherit' });
        fixesApplied.push('Generated Prisma client');
        log('  ✓ Prisma client generated', 'green');
      } catch (error) {
        log('  ✗ Failed to generate Prisma client', 'red');
      }
    } else {
      log('  ✓ Prisma client is up to date', 'green');
    }
  } else {
    log('  ⚠ Prisma schema not found', 'yellow');
  }
  console.log('');

  // Fix 6: Start API server if not running
  log('[6/8] Checking API server status...', 'blue');
  const apiRunning = await checkPort(3001);
  
  if (apiRunning) {
    log('  ✓ API server appears to be running on port 3001', 'green');
    
    // Test if API is responding
    const isResponding = await testEndpoint('http://localhost:3001/auth/me');
    if (isResponding) {
      log('  ✓ API is responding correctly', 'green');
    } else {
      log('  ⚠ API server is running but not responding correctly', 'yellow');
      log('  You may need to restart the API server manually', 'yellow');
    }
  } else {
    log('  ✗ API server is NOT running', 'red');
    log('  Starting API server in background...', 'yellow');
    
    // Check if package.json exists
    const apiPackageJson = path.join(apiDir, 'package.json');
    if (!fileExists(apiPackageJson)) {
      log('  ✗ api/package.json not found', 'red');
    } else {
      try {
        // Start server in background
        const serverProcess = spawn('npm', ['run', 'start:dev'], {
          cwd: apiDir,
          detached: true,
          stdio: 'ignore',
        });
        
        serverProcess.unref();
        fixesApplied.push('Started API server');
        
        // Wait for server to start
        log('  Waiting for API server to start (max 30 seconds)...', 'yellow');
        let started = false;
        for (let i = 0; i < 30; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (await checkPort(3001) && await testEndpoint('http://localhost:3001/auth/me')) {
            started = true;
            break;
          }
          process.stdout.write('.');
        }
        console.log('');
        
        if (started) {
          log('  ✓ API server started successfully', 'green');
          log('  Note: Server is running in background. Use "pkill -f start:dev" to stop it', 'cyan');
        } else {
          log('  ✗ API server failed to start within 30 seconds', 'red');
          log('  Check the API directory for error logs', 'yellow');
        }
      } catch (error) {
        log(`  ✗ Failed to start API server: ${error.message}`, 'red');
      }
    }
  }
  console.log('');

  // Fix 7: Browser localStorage instructions
  log('[7/8] Browser localStorage cleanup', 'blue');
  log('  To clear invalid tokens from your browser:', 'yellow');
  console.log('');
  log('  Option 1: Browser Console', 'cyan');
  log('    localStorage.removeItem("auth_token"); location.reload();', 'green');
  console.log('');
  log('  Option 2: DevTools', 'cyan');
  log('    1. Open DevTools (F12 or Cmd+Option+I)', 'cyan');
  log('    2. Application → Local Storage → http://localhost:3000', 'cyan');
  log('    3. Delete "auth_token" key', 'cyan');
  console.log('');

  // Summary
  log('========================================', 'blue');
  log('Auto-Fix Complete!', 'green');
  log('========================================\n', 'blue');

  if (fixesApplied.length > 0) {
    log('Fixes Applied:', 'green');
    fixesApplied.forEach(fix => {
      log(`  ✓ ${fix}`, 'green');
    });
    console.log('');
  }

  log('Next Steps:', 'yellow');
  log('  1. If API server was started, it\'s running in the background', 'cyan');
  log('  2. Clear your browser\'s localStorage (see instructions above)', 'cyan');
  log('  3. Try logging in again', 'cyan');
  console.log('');

  log('If issues persist:', 'yellow');
  log('  • Check API logs in the api directory', 'cyan');
  log('  • Verify DATABASE_URL in api/.env matches your database', 'cyan');
  log('  • Check browser console for frontend errors', 'cyan');
  console.log('');
}

main().catch((error) => {
  log(`\nError: ${error.message}`, 'red');
  process.exit(1);
});


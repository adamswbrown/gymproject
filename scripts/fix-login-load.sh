#!/bin/bash

# Fix Login Load Failed - Diagnostic and Fix Script
# This script helps diagnose and fix authentication issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Login Load Failed - Diagnostic & Fix${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
API_DIR="$PROJECT_ROOT/api"
UI_DIR="$PROJECT_ROOT/ui"

cd "$PROJECT_ROOT"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to test API endpoint
test_api_endpoint() {
    local endpoint=$1
    local url="http://localhost:3001$endpoint"
    echo -e "${YELLOW}Testing: $url${NC}"
    
    if curl -s -f -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|401\|404"; then
        return 0
    else
        return 1
    fi
}

echo -e "${BLUE}[1/7] Checking prerequisites...${NC}"
MISSING_DEPS=()

if ! command_exists node; then
    MISSING_DEPS+=("node")
fi

if ! command_exists npm; then
    MISSING_DEPS+=("npm")
fi

if ! command_exists curl; then
    MISSING_DEPS+=("curl")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${RED}✗ Missing dependencies: ${MISSING_DEPS[*]}${NC}"
    echo "Please install the missing dependencies and try again."
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

echo -e "${BLUE}[2/7] Checking API server status...${NC}"
if check_port 3001; then
    echo -e "${GREEN}✓ API server appears to be running on port 3001${NC}"
    
    # Test if API is responding
    if test_api_endpoint "/auth/me"; then
        echo -e "${GREEN}✓ API is responding${NC}"
    else
        echo -e "${YELLOW}⚠ API server is running but not responding correctly${NC}"
        echo -e "${YELLOW}  This might be a startup issue. Try restarting the API server.${NC}"
    fi
else
    echo -e "${RED}✗ API server is NOT running on port 3001${NC}"
    echo -e "${YELLOW}  Starting API server...${NC}"
    
    if [ -f "$API_DIR/package.json" ]; then
        cd "$API_DIR"
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}  Installing API dependencies...${NC}"
            npm install
        fi
        
        echo -e "${YELLOW}  Starting API server in background...${NC}"
        npm run start:dev > /tmp/api-server.log 2>&1 &
        API_PID=$!
        echo $API_PID > /tmp/api-server.pid
        
        # Wait for server to start
        echo -e "${YELLOW}  Waiting for API server to start (max 30 seconds)...${NC}"
        for i in {1..30}; do
            sleep 1
            if check_port 3001; then
                echo -e "${GREEN}✓ API server started successfully${NC}"
                break
            fi
            if [ $i -eq 30 ]; then
                echo -e "${RED}✗ API server failed to start within 30 seconds${NC}"
                echo -e "${YELLOW}  Check logs: tail -f /tmp/api-server.log${NC}"
                kill $API_PID 2>/dev/null || true
                exit 1
            fi
        done
    else
        echo -e "${RED}✗ API directory not found at $API_DIR${NC}"
        exit 1
    fi
fi
echo ""

echo -e "${BLUE}[3/7] Checking database connection...${NC}"
if [ -f "$API_DIR/.env" ]; then
    cd "$API_DIR"
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" "$API_DIR/.env"; then
        echo -e "${GREEN}✓ DATABASE_URL is configured${NC}"
        
        # Try to run a simple Prisma command
        if command_exists npx; then
            if npx prisma db execute --stdin <<< "SELECT 1;" >/dev/null 2>&1; then
                echo -e "${GREEN}✓ Database connection successful${NC}"
            else
                echo -e "${YELLOW}⚠ Could not verify database connection${NC}"
                echo -e "${YELLOW}  This might be normal if the database requires authentication${NC}"
            fi
        fi
    else
        echo -e "${RED}✗ DATABASE_URL not found in .env file${NC}"
        echo -e "${YELLOW}  Please configure DATABASE_URL in $API_DIR/.env${NC}"
    fi
else
    echo -e "${YELLOW}⚠ .env file not found at $API_DIR/.env${NC}"
    echo -e "${YELLOW}  Creating a template .env file...${NC}"
    cat > "$API_DIR/.env" << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/gym_booking?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
EOF
    echo -e "${YELLOW}  Please update $API_DIR/.env with your actual configuration${NC}"
fi
echo ""

echo -e "${BLUE}[4/7] Checking JWT configuration...${NC}"
if [ -f "$API_DIR/.env" ]; then
    if grep -q "JWT_SECRET=" "$API_DIR/.env"; then
        JWT_SECRET=$(grep "JWT_SECRET=" "$API_DIR/.env" | cut -d '=' -f2 | tr -d '"' | tr -d "'")
        if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-secret-key-change-in-production" ]; then
            echo -e "${YELLOW}⚠ JWT_SECRET is using default value${NC}"
            echo -e "${YELLOW}  This is fine for development but should be changed in production${NC}"
        else
            echo -e "${GREEN}✓ JWT_SECRET is configured${NC}"
        fi
    else
        echo -e "${RED}✗ JWT_SECRET not found in .env${NC}"
        echo -e "${YELLOW}  Adding JWT_SECRET to .env...${NC}"
        echo 'JWT_SECRET="your-secret-key-change-in-production"' >> "$API_DIR/.env"
    fi
fi
echo ""

echo -e "${BLUE}[5/7] Checking frontend configuration...${NC}"
if [ -f "$UI_DIR/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_API_URL=" "$UI_DIR/.env.local"; then
        API_URL=$(grep "NEXT_PUBLIC_API_URL=" "$UI_DIR/.env.local" | cut -d '=' -f2 | tr -d '"' | tr -d "'")
        echo -e "${GREEN}✓ NEXT_PUBLIC_API_URL is set to: $API_URL${NC}"
        
        if [ "$API_URL" != "http://localhost:3001" ]; then
            echo -e "${YELLOW}⚠ API URL is not pointing to localhost:3001${NC}"
            echo -e "${YELLOW}  Make sure this matches your API server location${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ NEXT_PUBLIC_API_URL not found in .env.local${NC}"
        echo -e "${YELLOW}  Creating .env.local with default API URL...${NC}"
        echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > "$UI_DIR/.env.local"
    fi
else
    echo -e "${YELLOW}⚠ .env.local not found${NC}"
    echo -e "${YELLOW}  Creating .env.local with default API URL...${NC}"
    echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > "$UI_DIR/.env.local"
fi
echo ""

echo -e "${BLUE}[6/7] Testing authentication endpoints...${NC}"
# Test /auth/me endpoint (should return 401 without auth, which is expected)
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/auth/me" | grep -q "401"; then
    echo -e "${GREEN}✓ /auth/me endpoint is accessible (401 without auth is expected)${NC}"
else
    echo -e "${RED}✗ /auth/me endpoint is not responding correctly${NC}"
fi

# Test /auth/login endpoint
if curl -s -o /dev/null -w "%{http_code}" -X POST "http://localhost:3001/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}' | grep -q "401\|400"; then
    echo -e "${GREEN}✓ /auth/login endpoint is accessible${NC}"
else
    echo -e "${RED}✗ /auth/login endpoint is not responding correctly${NC}"
fi
echo ""

echo -e "${BLUE}[7/7] Browser localStorage cleanup instructions...${NC}"
echo -e "${YELLOW}To clear invalid tokens from your browser:${NC}"
echo ""
echo -e "${BLUE}Option 1: Manual cleanup${NC}"
echo "  1. Open browser DevTools (F12 or Cmd+Option+I)"
echo "  2. Go to Application/Storage tab"
echo "  3. Find 'Local Storage' → 'http://localhost:3000' (or your frontend URL)"
echo "  4. Delete the 'auth_token' key"
echo ""
echo -e "${BLUE}Option 2: Console command${NC}"
echo "  Run this in your browser console:"
echo -e "${GREEN}  localStorage.removeItem('auth_token'); location.reload();${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Diagnostic Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "  • API Server: $(check_port 3001 && echo -e "${GREEN}Running${NC}" || echo -e "${RED}Not Running${NC}")"
echo "  • Database: $(grep -q "DATABASE_URL=" "$API_DIR/.env" 2>/dev/null && echo -e "${GREEN}Configured${NC}" || echo -e "${RED}Not Configured${NC}")"
echo "  • JWT Secret: $(grep -q "JWT_SECRET=" "$API_DIR/.env" 2>/dev/null && echo -e "${GREEN}Set${NC}" || echo -e "${RED}Not Set${NC}")"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. If API server was started, it's running in the background"
echo "  2. Clear your browser's localStorage (see instructions above)"
echo "  3. Try logging in again"
echo "  4. If issues persist, check API logs: tail -f /tmp/api-server.log"
echo ""
echo -e "${YELLOW}To stop the API server (if started by this script):${NC}"
echo "  kill \$(cat /tmp/api-server.pid) 2>/dev/null || true"
echo ""


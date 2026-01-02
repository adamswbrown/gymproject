#!/bin/bash

# Auto-Fix Login Load Issues - Diagnostic and Automatic Fix Script
# This script diagnoses issues AND automatically fixes common problems

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
API_DIR="$PROJECT_ROOT/api"
UI_DIR="$PROJECT_ROOT/ui"

cd "$PROJECT_ROOT"

# Track fixes applied
FIXES_APPLIED=()

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
    curl -s -f -o /dev/null -w "%{http_code}" "$url" 2>/dev/null | grep -q "200\|401\|404" && return 0 || return 1
}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Auto-Fix Login Load Issues${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}[1/8] Checking prerequisites...${NC}"
MISSING_DEPS=()

if ! command_exists node; then
    MISSING_DEPS+=("node")
fi

if ! command_exists npm; then
    MISSING_DEPS+=("npm")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${RED}✗ Missing dependencies: ${MISSING_DEPS[*]}${NC}"
    echo "Please install the missing dependencies and try again."
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Fix 1: API .env file
echo -e "${BLUE}[2/8] Checking API .env file...${NC}"
if [ ! -f "$API_DIR/.env" ]; then
    echo -e "${YELLOW}⚠ .env file not found. Creating template...${NC}"
    cat > "$API_DIR/.env" << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/gym_booking?schema=public"
JWT_SECRET="your-secret-key-change-in-production-$(openssl rand -hex 16)"
JWT_EXPIRES_IN="7d"
PORT=3001
EOF
    FIXES_APPLIED+=("Created api/.env file with template")
    echo -e "${GREEN}✓ Created api/.env file${NC}"
    echo -e "${YELLOW}  ⚠ Please update DATABASE_URL with your actual database connection string${NC}"
else
    echo -e "${GREEN}✓ api/.env file exists${NC}"
    
    # Check if JWT_SECRET is set to default
    if grep -q 'JWT_SECRET="your-secret-key-change-in-production"' "$API_DIR/.env" 2>/dev/null; then
        echo -e "${YELLOW}⚠ JWT_SECRET is using default value. Generating secure secret...${NC}"
        NEW_SECRET=$(openssl rand -hex 32)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' 's/JWT_SECRET="your-secret-key-change-in-production"/JWT_SECRET="'"$NEW_SECRET"'"/' "$API_DIR/.env"
        else
            # Linux
            sed -i 's/JWT_SECRET="your-secret-key-change-in-production"/JWT_SECRET="'"$NEW_SECRET"'"/' "$API_DIR/.env"
        fi
        FIXES_APPLIED+=("Updated JWT_SECRET with secure random value")
        echo -e "${GREEN}✓ Updated JWT_SECRET${NC}"
    fi
    
    # Check if DATABASE_URL is missing
    if ! grep -q "DATABASE_URL=" "$API_DIR/.env"; then
        echo -e "${YELLOW}⚠ DATABASE_URL missing. Adding template...${NC}"
        echo 'DATABASE_URL="postgresql://user:password@localhost:5432/gym_booking?schema=public"' >> "$API_DIR/.env"
        FIXES_APPLIED+=("Added DATABASE_URL to api/.env")
        echo -e "${GREEN}✓ Added DATABASE_URL${NC}"
        echo -e "${YELLOW}  ⚠ Please update with your actual database connection string${NC}"
    fi
fi
echo ""

# Fix 2: Frontend .env.local file
echo -e "${BLUE}[3/8] Checking frontend .env.local file...${NC}"
if [ ! -f "$UI_DIR/.env.local" ]; then
    echo -e "${YELLOW}⚠ .env.local file not found. Creating...${NC}"
    echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > "$UI_DIR/.env.local"
    FIXES_APPLIED+=("Created ui/.env.local file")
    echo -e "${GREEN}✓ Created ui/.env.local file${NC}"
else
    # Check if NEXT_PUBLIC_API_URL is missing or incorrect
    if ! grep -q "NEXT_PUBLIC_API_URL=" "$UI_DIR/.env.local"; then
        echo -e "${YELLOW}⚠ NEXT_PUBLIC_API_URL missing. Adding...${NC}"
        echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' >> "$UI_DIR/.env.local"
        FIXES_APPLIED+=("Added NEXT_PUBLIC_API_URL to ui/.env.local")
        echo -e "${GREEN}✓ Added NEXT_PUBLIC_API_URL${NC}"
    else
        API_URL=$(grep "NEXT_PUBLIC_API_URL=" "$UI_DIR/.env.local" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
        if [ "$API_URL" != "http://localhost:3001" ]; then
            echo -e "${YELLOW}⚠ NEXT_PUBLIC_API_URL is set to: $API_URL${NC}"
            echo -e "${YELLOW}  Make sure this matches your API server location${NC}"
        else
            echo -e "${GREEN}✓ NEXT_PUBLIC_API_URL is correctly configured${NC}"
        fi
    fi
fi
echo ""

# Fix 3: Install API dependencies
echo -e "${BLUE}[4/8] Checking API dependencies...${NC}"
if [ ! -d "$API_DIR/node_modules" ]; then
    echo -e "${YELLOW}⚠ API node_modules not found. Installing dependencies...${NC}"
    cd "$API_DIR"
    npm install
    FIXES_APPLIED+=("Installed API dependencies")
    echo -e "${GREEN}✓ API dependencies installed${NC}"
    cd "$PROJECT_ROOT"
else
    echo -e "${GREEN}✓ API dependencies installed${NC}"
fi
echo ""

# Fix 4: Install Frontend dependencies
echo -e "${BLUE}[5/8] Checking frontend dependencies...${NC}"
if [ ! -d "$UI_DIR/node_modules" ]; then
    echo -e "${YELLOW}⚠ Frontend node_modules not found. Installing dependencies...${NC}"
    cd "$UI_DIR"
    npm install
    FIXES_APPLIED+=("Installed frontend dependencies")
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    cd "$PROJECT_ROOT"
else
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi
echo ""

# Fix 5: Generate Prisma client
echo -e "${BLUE}[6/8] Checking Prisma client...${NC}"
if [ -f "$API_DIR/prisma/schema.prisma" ]; then
    cd "$API_DIR"
    if [ ! -d "node_modules/.prisma" ] || [ "$API_DIR/prisma/schema.prisma" -nt "$API_DIR/node_modules/.prisma/client/package.json" ] 2>/dev/null; then
        echo -e "${YELLOW}⚠ Prisma client may be out of date. Generating...${NC}"
        npx prisma generate
        FIXES_APPLIED+=("Generated Prisma client")
        echo -e "${GREEN}✓ Prisma client generated${NC}"
    else
        echo -e "${GREEN}✓ Prisma client is up to date${NC}"
    fi
    cd "$PROJECT_ROOT"
else
    echo -e "${YELLOW}⚠ Prisma schema not found${NC}"
fi
echo ""

# Fix 6: Start API server if not running
echo -e "${BLUE}[7/8] Checking API server status...${NC}"
if check_port 3001; then
    echo -e "${GREEN}✓ API server appears to be running on port 3001${NC}"
    
    # Test if API is responding
    sleep 1
    if test_api_endpoint "/auth/me"; then
        echo -e "${GREEN}✓ API is responding correctly${NC}"
    else
        echo -e "${YELLOW}⚠ API server is running but not responding correctly${NC}"
        echo -e "${YELLOW}  You may need to restart the API server manually${NC}"
    fi
else
    echo -e "${RED}✗ API server is NOT running${NC}"
    echo -e "${YELLOW}  Starting API server in background...${NC}"
    
    cd "$API_DIR"
    
    # Kill any existing process on port 3001
    if lsof -ti:3001 >/dev/null 2>&1; then
        echo -e "${YELLOW}  Killing existing process on port 3001...${NC}"
        kill -9 $(lsof -ti:3001) 2>/dev/null || true
        sleep 1
    fi
    
    # Start the server
    echo -e "${YELLOW}  Starting API server...${NC}"
    nohup npm run start:dev > /tmp/api-server.log 2>&1 &
    API_PID=$!
    echo $API_PID > /tmp/api-server.pid
    FIXES_APPLIED+=("Started API server")
    
    # Wait for server to start
    echo -e "${YELLOW}  Waiting for API server to start (max 30 seconds)...${NC}"
    STARTED=false
    for i in {1..30}; do
        sleep 1
        if check_port 3001 && test_api_endpoint "/auth/me" 2>/dev/null; then
            STARTED=true
            break
        fi
        echo -n "."
    done
    echo ""
    
    if [ "$STARTED" = true ]; then
        echo -e "${GREEN}✓ API server started successfully${NC}"
        echo -e "${CYAN}  Logs: tail -f /tmp/api-server.log${NC}"
        echo -e "${CYAN}  To stop: kill \$(cat /tmp/api-server.pid)${NC}"
    else
        echo -e "${RED}✗ API server failed to start within 30 seconds${NC}"
        echo -e "${YELLOW}  Check logs: tail -f /tmp/api-server.log${NC}"
        kill $API_PID 2>/dev/null || true
        rm -f /tmp/api-server.pid
    fi
    
    cd "$PROJECT_ROOT"
fi
echo ""

# Fix 7: Browser localStorage instructions
echo -e "${BLUE}[8/8] Browser localStorage cleanup${NC}"
echo -e "${YELLOW}To clear invalid tokens from your browser:${NC}"
echo ""
echo -e "${CYAN}Option 1: Browser Console${NC}"
echo -e "  ${GREEN}localStorage.removeItem('auth_token'); location.reload();${NC}"
echo ""
echo -e "${CYAN}Option 2: DevTools${NC}"
echo "  1. Open DevTools (F12 or Cmd+Option+I)"
echo "  2. Application → Local Storage → http://localhost:3000"
echo "  3. Delete 'auth_token' key"
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Auto-Fix Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ ${#FIXES_APPLIED[@]} -gt 0 ]; then
    echo -e "${GREEN}Fixes Applied:${NC}"
    for fix in "${FIXES_APPLIED[@]}"; do
        echo -e "  ${GREEN}✓${NC} $fix"
    done
    echo ""
fi

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. If API server was started, it's running in the background"
echo "  2. Clear your browser's localStorage (see instructions above)"
echo "  3. Try logging in again"
echo ""

if [ -f "/tmp/api-server.pid" ]; then
    echo -e "${CYAN}API Server Management:${NC}"
    echo -e "  ${CYAN}View logs:${NC} tail -f /tmp/api-server.log"
    echo -e "  ${CYAN}Stop server:${NC} kill \$(cat /tmp/api-server.pid)"
    echo ""
fi

echo -e "${YELLOW}If issues persist:${NC}"
echo "  • Check API logs: tail -f /tmp/api-server.log"
echo "  • Verify DATABASE_URL in api/.env matches your database"
echo "  • Check browser console for frontend errors"
echo ""


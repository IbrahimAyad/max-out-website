#!/bin/bash

# Automated Cloudflare Worker Setup Script
# This script handles everything except the browser login

echo "=========================================="
echo "   Cloudflare Worker Auto-Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ensure we're in the right directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${GREEN}✓${NC} Working directory: $(pwd)"
echo ""

# Step 1: Set up Node.js v20
echo -e "${YELLOW}Step 1: Setting up Node.js v20${NC}"
source ~/.nvm/nvm.sh
nvm use 20
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node version: $NODE_VERSION"
echo ""

# Step 2: Check wrangler installation
echo -e "${YELLOW}Step 2: Checking Wrangler${NC}"
WRANGLER_VERSION=$(wrangler --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Wrangler installed: v$WRANGLER_VERSION"
else
    echo -e "${YELLOW}Installing Wrangler...${NC}"
    npm install -g wrangler
    echo -e "${GREEN}✓${NC} Wrangler installed"
fi
echo ""

# Step 3: Check login status
echo -e "${YELLOW}Step 3: Checking Cloudflare Login${NC}"
wrangler whoami 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Not logged in to Cloudflare${NC}"
    echo ""
    echo "Please run: wrangler login"
    echo "This will open your browser for authentication"
    echo ""
    echo "After logging in, run this script again!"
    exit 1
else
    echo -e "${GREEN}✓${NC} Already logged in to Cloudflare"
fi
echo ""

# Step 4: Get Account ID
echo -e "${YELLOW}Step 4: Cloudflare Account ID${NC}"
echo "You can find your Account ID at:"
echo "https://dash.cloudflare.com → Any domain → Right sidebar"
echo ""

# Check if account ID is already set
if grep -q "YOUR_CLOUDFLARE_ACCOUNT_ID" wrangler.toml; then
    read -p "Enter your Cloudflare Account ID: " ACCOUNT_ID
    if [ ! -z "$ACCOUNT_ID" ]; then
        sed -i.bak "s/YOUR_CLOUDFLARE_ACCOUNT_ID/$ACCOUNT_ID/" wrangler.toml
        echo -e "${GREEN}✓${NC} Updated wrangler.toml with Account ID"
    else
        echo -e "${RED}✗${NC} Account ID is required"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Account ID already configured"
fi
echo ""

# Step 5: Check Supabase Key
echo -e "${YELLOW}Step 5: Supabase Service Key${NC}"
wrangler secret list 2>/dev/null | grep -q "SUPABASE_SERVICE_KEY"
if [ $? -ne 0 ]; then
    echo "You need to add your Supabase service key"
    echo ""
    echo "Get it from: Supabase Dashboard → Settings → API → service_role"
    echo "The key starts with: eyJ..."
    echo ""
    echo "Adding secret now..."
    wrangler secret put SUPABASE_SERVICE_KEY
    echo -e "${GREEN}✓${NC} Supabase key added"
else
    echo -e "${GREEN}✓${NC} Supabase key already configured"
fi
echo ""

# Step 6: Deploy
echo -e "${YELLOW}Step 6: Deploying Worker${NC}"
echo "Running: wrangler deploy"
echo ""

wrangler deploy

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "   ✓ Deployment Successful!"
    echo "==========================================${NC}"
    echo ""
    echo "Your worker is now live!"
    echo ""
    echo -e "${YELLOW}Test your endpoints:${NC}"
    echo ""
    echo "1. List all R2 images:"
    echo "   curl https://kct-r2-supabase-sync.[subdomain].workers.dev/list-images"
    echo ""
    echo "2. Import all images to Supabase:"
    echo "   curl -X POST https://kct-r2-supabase-sync.[subdomain].workers.dev/bulk-import"
    echo ""
    echo "3. Monitor logs:"
    echo "   wrangler tail"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Deployment failed${NC}"
    echo "Please check the error messages above"
    exit 1
fi
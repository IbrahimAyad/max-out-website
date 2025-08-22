#!/bin/bash

# Cloudflare Worker Setup Script

echo "======================================"
echo "Cloudflare Worker Setup for KCT"
echo "======================================"
echo ""

# Ensure we're using Node v20
source ~/.nvm/nvm.sh
nvm use 20

echo "Node version: $(node --version)"
echo ""

# Step 1: Login to Cloudflare
echo "Step 1: Login to Cloudflare"
echo "----------------------------"
echo "Running: wrangler login"
echo "This will open your browser. Please login to Cloudflare."
echo ""
wrangler login

echo ""
echo "Step 2: Configure Account ID"
echo "----------------------------"
echo "Please get your Account ID from:"
echo "https://dash.cloudflare.com → Any domain → Right sidebar"
echo ""
read -p "Enter your Cloudflare Account ID: " ACCOUNT_ID

# Update wrangler.toml with the account ID
sed -i.bak "s/YOUR_CLOUDFLARE_ACCOUNT_ID/$ACCOUNT_ID/" wrangler.toml
echo "✓ Updated wrangler.toml with Account ID"

echo ""
echo "Step 3: Add Supabase Service Key"
echo "---------------------------------"
echo "Get your service key from:"
echo "Supabase Dashboard → Settings → API → service_role key"
echo ""
echo "Running: wrangler secret put SUPABASE_SERVICE_KEY"
wrangler secret put SUPABASE_SERVICE_KEY

echo ""
echo "Step 4: Deploy the Worker"
echo "-------------------------"
echo "Running: wrangler deploy"
wrangler deploy

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Your worker should now be deployed!"
echo "Test it with:"
echo ""
echo "curl https://kct-r2-supabase-sync.[your-subdomain].workers.dev/list-images"
echo ""
echo "To import all images:"
echo "curl -X POST https://kct-r2-supabase-sync.[your-subdomain].workers.dev/bulk-import"
echo ""
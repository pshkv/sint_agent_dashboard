#!/bin/bash
# Run all development servers
# Open 3 terminals and run these commands:

# Terminal 1: Task Dashboard API
# cd sint-dashboard/apps/api && npm run dev

# Terminal 2: Task Dashboard Web  
# cd sint-dashboard/apps/web && npm run dev

# Terminal 3: SINT Operator
# cd sint-operator && npm run dev

echo "Run these commands in 3 separate terminal windows:"
echo ""
echo "Terminal 1 (API - port 3000):"
echo "  cd $(pwd)/apps/api && npm run dev"
echo ""
echo "Terminal 2 (Web - port 5173):"
echo "  cd $(pwd)/apps/web && npm run dev"
echo ""
echo "Terminal 3 (Operator - port 3001):"
echo "  cd $(dirname $(pwd))/sint-operator && npm run dev"

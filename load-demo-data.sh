#!/bin/bash

# ============================================================
# Load Demo Patient Data - ThriveOrtho MVP Demonstration
# ============================================================

set -e  # Exit on error

echo "🎬 Loading ThriveOrtho Demo Patient Data..."
echo "=============================================="
echo ""

# Navigate to project directory
cd /home/user/webapp

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if database exists
if [ ! -d ".wrangler/state/v3/d1" ]; then
    echo -e "${YELLOW}⚠️  Local database not found. Creating...${NC}"
    mkdir -p .wrangler/state/v3/d1
fi

# Apply migration for demo schema
echo -e "${BLUE}📊 Applying demo patient schema migration...${NC}"
npx wrangler d1 migrations apply webapp-production --local

# Load demo seed data
echo -e "${BLUE}💾 Loading demo patient data...${NC}"
npx wrangler d1 execute webapp-production --local --file=./demo-seed.sql

echo ""
echo -e "${GREEN}✅ Demo patient data loaded successfully!${NC}"
echo ""
echo "=============================================="
echo "📋 Demo Patient Summary"
echo "=============================================="
echo -e "Patient: ${BLUE}Sarah Mitchell${NC}"
echo "Patient ID: 999"
echo "Email: sarah.mitchell.demo@thriveortho.com"
echo ""
echo "Journey: 90-day complete rehabilitation"
echo "  • Initial Eval: FMS 13/21, Pain 6/10"
echo "  • Week 8: FMS 16/21, Pain 1/10"
echo "  • Current: Pain-free 5K running"
echo ""
echo "=============================================="
echo "✨ Features Demonstrated"
echo "=============================================="
echo "✅ Initial Evaluation with FMS Assessment"
echo "✅ Visual Assessment with AI Analysis"
echo "✅ SOAP Notes (ICD-10 + CPT Codes)"
echo "✅ Progress Photos (5 images)"
echo "✅ Treatment Goals (6 goals, 5 completed)"
echo "✅ Patient-Therapist Messaging (9 messages)"
echo "✅ Appointment History (9 appointments)"
echo "✅ Exercise Logging"
echo "✅ CPT Billing Optimization"
echo "✅ AI Injury Risk Assessment"
echo "✅ AI Progress Tracker"
echo ""
echo "=============================================="
echo "🚀 Next Steps"
echo "=============================================="
echo "1. Start development server:"
echo "   ${BLUE}pm2 start ecosystem.config.cjs${NC}"
echo ""
echo "2. Access Human Dashboard:"
echo "   ${BLUE}http://localhost:3000/static/human-dashboard.html${NC}"
echo ""
echo "3. Search for demo patient:"
echo "   ${BLUE}Search: Sarah Mitchell${NC}"
echo "   ${BLUE}ID: 999${NC}"
echo ""
echo "4. View all features:"
echo "   • Patient Profile → Full medical history"
echo "   • Assessments → FMS + Visual assessments"
echo "   • SOAP Notes → 2 comprehensive notes"
echo "   • Progress Photos → 5 timeline photos"
echo "   • Messages → Patient communication"
echo "   • Analytics → Progress charts"
echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Demo ready for MVP presentation!${NC}"
echo "=============================================="

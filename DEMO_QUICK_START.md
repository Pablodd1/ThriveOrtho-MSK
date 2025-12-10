# 🎬 Demo Patient - Quick Start Guide

## One-Command Setup

```bash
./load-demo-data.sh
```

That's it! Your complete demo patient is now loaded.

---

## Access Demo Patient

1. **Start Server** (if not running):
   ```bash
   pm2 start ecosystem.config.cjs
   ```

2. **Open Human Dashboard**:
   ```
   http://localhost:3000/static/human-dashboard.html
   ```

3. **Search for Demo Patient**:
   - **Name**: Sarah Mitchell
   - **ID**: 999
   - **Email**: sarah.mitchell.demo@thriveortho.com

---

## What You'll See

### 📊 Complete 90-Day Journey
- **Day 1**: FMS 13/21, Pain 6/10, Elevated injury risk
- **Week 4**: Pain 2/10, 83% improvement
- **Week 8**: FMS 16/21, Low injury risk
- **Week 12**: Pain-free 5K completion 🎉

### ✅ All Features Demonstrated
1. **FMS Assessment** - Industry-standard 7-test screen (600% ROI)
2. **Visual Assessment** - AI biomechanical analysis
3. **SOAP Notes** - Professional documentation (ICD-10 + CPT)
4. **Progress Photos** - 5-photo timeline
5. **Treatment Goals** - 6 goals, 5 completed (83%)
6. **Patient Messages** - 9 engaged communications
7. **Appointments** - 9 sessions, $2,485 revenue
8. **Exercise Logging** - 95% compliance
9. **CPT Billing** - Optimized codes, 0% denials
10. **AI Injury Risk** - 68% → 22% (improved)
11. **AI Progress Tracker** - 88/100 excellent
12. **Analytics** - Complete outcome tracking

---

## 30-Second Pitch

"Meet Sarah Mitchell - a 36-year-old runner who came to us with knee pain and instability post-ACL surgery. In just 12 weeks, using our AI-powered platform, she went from 6/10 pain and elevated injury risk to completing a pain-free 5K. Our platform automatically detected her movement asymmetries, generated personalized treatment plans, optimized billing codes, and tracked every metric. The result? 83% pain reduction, 23% FMS improvement, and $2,485 in revenue with zero claim denials."

---

## Key Metrics to Highlight

### Clinical Success
- **83% pain reduction** (6/10 → 1/10)
- **23% FMS improvement** (13/21 → 16/21)
- **57% asymmetry reduction** (14° → 6°)
- **5/6 goals achieved** (83% success rate)

### Patient Engagement
- **95% HEP compliance**
- **100% attendance** (0 cancellations)
- **9 active messages**
- **5 progress photos**

### Business Performance
- **$2,485 total revenue** (8 visits)
- **$452 per hour** (provider efficiency)
- **0% denial rate** (perfect billing)
- **82% reimbursement** (above average)
- **$185 undercoding prevented**

---

## Demo Flow (5 minutes)

1. **Search Patient** (30s)
   - Show comprehensive profile
   
2. **Initial FMS** (1min)
   - 13/21 score, elevated risk
   - Auto-generated recommendations

3. **AI Analysis** (1min)
   - Movement asymmetries detected
   - 68% injury risk predicted
   - Specific exercises recommended

4. **Progress Tracking** (1min)
   - Week-by-week improvements
   - Visual charts and metrics
   - FMS retest: 16/21

5. **SOAP Notes** (1min)
   - Professional documentation
   - ICD-10 + CPT codes
   - Treatment plan

6. **Outcome** (30s)
   - Pain-free 5K completion
   - All goals met
   - Patient satisfaction

---

## Troubleshooting

### Demo Data Not Showing?
```bash
# Verify database
npx wrangler d1 execute webapp-production --local \
  --command="SELECT * FROM patients WHERE id=999"

# If empty, reload:
./load-demo-data.sh
```

### Server Not Running?
```bash
# Clean port and restart
fuser -k 3000/tcp 2>/dev/null || true
pm2 start ecosystem.config.cjs
```

---

## Need More Details?

See **DEMO_PATIENT_GUIDE.md** for:
- Complete 90-day timeline
- Detailed test scores
- Full SOAP notes
- AI analysis results
- Billing breakdown
- Presentation talking points

---

**Your MVP demo is ready to impress!** 🚀

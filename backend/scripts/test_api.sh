#!/usr/bin/env bash
# =============================================================================
# WellnessAtWork – Case Study 72 API Test Suite
# =============================================================================
BASE="http://localhost:7500/api"
PASS=0; FAIL=0; SKIP=0

green='\033[0;32m'; red='\033[0;31m'; yellow='\033[1;33m'; nc='\033[0m'

check() {
  local label="$1" expected="$2" actual="$3"
  if echo "$actual" | grep -q "$expected"; then
    echo -e "${green}  ✓ PASS${nc} — $label"
    ((PASS++))
  else
    echo -e "${red}  ✗ FAIL${nc} — $label"
    echo "      Expected to contain: $expected"
    echo "      Got: $(echo "$actual" | head -c 300)"
    ((FAIL++))
  fi
}

echo ""
echo "============================================================"
echo "  WellnessAtWork API Integration Test — Case Study 72"
echo "============================================================"

# Pre-flight check
if ! curl -s "$BASE/health" >/dev/null 2>&1; then
  echo -e "${red}  Error: Backend server is not running on http://localhost:7500${nc}"
  echo "  Please start the backend with: cd backend && npm run dev (or npm start)"
  exit 1
fi

# 1. HEALTH
echo ""
echo "▶ [1] Health & Root"
R=$(curl -s "$BASE/health")
check "GET /api/health → ok" '"status":"ok"' "$R"
R=$(curl -s "http://localhost:7500/")
check "GET / → Operational" 'Operational' "$R"

# 2. AUTH
echo ""
echo "▶ [2] Authentication"
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@wa.test"
TEST_PASS="Test@12345"

R=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":\"Test User ${TIMESTAMP}\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\",\"department\":\"Engineering\"}" \
  -c /tmp/wa_cookies.txt)
check "POST /auth/register → success" '"success":true' "$R"

R=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}" \
  -c /tmp/wa_cookies.txt)
check "POST /auth/login → success" '"success":true' "$R"

TOKEN=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('token',''))" 2>/dev/null)
AUTH="Authorization: Bearer $TOKEN"

R=$(curl -s "$BASE/auth/me" -H "$AUTH")
check "GET /auth/me → user returned" '"success":true' "$R"

# 3. USER
echo ""
echo "▶ [3] User Profile"
R=$(curl -s "$BASE/user/profile" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /user/profile → success" '"success":true' "$R"
R=$(curl -s -X PUT "$BASE/user/profile" -H "Content-Type: application/json" -H "$AUTH" -b /tmp/wa_cookies.txt -d '{"department":"Engineering"}')
check "PUT /user/profile → success" '"success":true' "$R"

# 4. CHALLENGES
echo ""
echo "▶ [4] Challenges"
R=$(curl -s "$BASE/challenges" -H "$AUTH")
check "GET /challenges → success" '"success":true' "$R"
CID=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); lst=d.get('data',[]) if isinstance(d.get('data'),list) else d.get('data',{}).get('challenges',[]); print(lst[0].get('_id','') if lst else '')" 2>/dev/null)
if [ -n "$CID" ]; then
  R=$(curl -s "$BASE/challenges/$CID" -H "$AUTH")
  check "GET /challenges/:id → success" '"success":true' "$R"
  R=$(curl -s -X POST "$BASE/challenges/$CID/enroll" -H "$AUTH" -b /tmp/wa_cookies.txt)
  check "POST /challenges/:id/enroll → success" '"success":true' "$R"
else
  echo -e "${yellow}  ⚠ SKIP${nc} — No challenges seeded"; ((SKIP++))
fi

# 5. ACTIVITIES
echo ""
echo "▶ [5] Activities"
R=$(curl -s -X POST "$BASE/activities" \
  -H "Content-Type: application/json" -H "$AUTH" -b /tmp/wa_cookies.txt \
  -d '{"activityType":"Walking","value":"8000","durationMinutes":45}')
check "POST /activities → logged" '"success":true' "$R"
R=$(curl -s "$BASE/activities" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /activities → list" '"success":true' "$R"

# 6. POINTS
echo ""
echo "▶ [6] Points"
R=$(curl -s "$BASE/points/balance" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /points/balance → success" '"success":true' "$R"
R=$(curl -s "$BASE/points/history" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /points/history → success" '"success":true' "$R"

# 7. LEADERBOARD
echo ""
echo "▶ [7] Leaderboard"
R=$(curl -s "$BASE/leaderboard" -H "$AUTH")
check "GET /leaderboard → success" '"success":true' "$R"
R=$(curl -s "$BASE/leaderboard/departments" -H "$AUTH")
check "GET /leaderboard/departments → success" '"success":true' "$R"

# 8. SESSIONS
echo ""
echo "▶ [8] Sessions"
R=$(curl -s "$BASE/sessions" -H "$AUTH")
check "GET /sessions → success" '"success":true' "$R"

# 9. RESOURCES
echo ""
echo "▶ [9] Resources"
R=$(curl -s "$BASE/resources" -H "$AUTH")
check "GET /resources → success" '"success":true' "$R"

# 10. REWARDS
echo ""
echo "▶ [10] Rewards"
R=$(curl -s "$BASE/rewards" -H "$AUTH")
check "GET /rewards → success" '"success":true' "$R"

# 11. NOTIFICATIONS
echo ""
echo "▶ [11] Notifications"
R=$(curl -s "$BASE/notifications" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /notifications → success" '"success":true' "$R"

# 12. REPORTS
echo ""
echo "▶ [12] Reports"
R=$(curl -s "$BASE/reports/summary" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /reports/summary → success" '"success":true' "$R"
R=$(curl -s "$BASE/reports/activity" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /reports/activity → success" '"success":true' "$R"

# 13. TEAMS
echo ""
echo "▶ [13] Teams"
R=$(curl -s "$BASE/teams" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /teams → success" '"success":true' "$R"

# 14. WEBINARS
echo ""
echo "▶ [14] Webinars"
R=$(curl -s "$BASE/webinars" -H "$AUTH")
check "GET /webinars → success" '"success":true' "$R"

# 15. CHECK-INS
echo ""
echo "▶ [15] Check-Ins"
R=$(curl -s -X POST "$BASE/check-ins" \
  -H "Content-Type: application/json" -H "$AUTH" -b /tmp/wa_cookies.txt \
  -d '{"mood":"Happy","energyLevel":4,"stressLevel":2,"notes":"Feeling great!"}')
check "POST /check-ins → success" '"success":true' "$R"
R=$(curl -s "$BASE/check-ins" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /check-ins → success" '"success":true' "$R"

# 16. WEARABLE
echo ""
echo "▶ [16] Wearable — Mock Fitbit & Apple Health"
R=$(curl -s -X POST "$BASE/wearable/sync" \
  -H "Content-Type: application/json" -H "$AUTH" -b /tmp/wa_cookies.txt \
  -d '{"deviceType":"appleHealth","steps":12350,"distanceKm":8.9,"activeMinutes":62,"restingHeartRate":58}')
check "POST /wearable/sync (Apple Health) → success" '"success":true' "$R"
check "Apple Health → telemetry block present" '"telemetry"' "$R"
check "Apple Health → steps returned" '"steps"' "$R"

R=$(curl -s -X POST "$BASE/wearable/sync" \
  -H "Content-Type: application/json" -H "$AUTH" -b /tmp/wa_cookies.txt \
  -d '{"deviceType":"fitbit","steps":9420,"distanceKm":6.7,"activeMinutes":55,"restingHeartRate":65}')
check "POST /wearable/sync (Fitbit) → success" '"success":true' "$R"
check "Fitbit sync → Fitbit OS in message" 'Fitbit OS' "$R"
check "Fitbit → activityResult present" '"activityResult"' "$R"

R=$(curl -s -X POST "$BASE/wearable/sync" \
  -H "Content-Type: application/json" -H "$AUTH" -b /tmp/wa_cookies.txt \
  -d '{}')
check "POST /wearable/sync (defaults) → success" '"success":true' "$R"

R=$(curl -s "$BASE/wearable/status" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "GET /wearable/status → success" '"success":true' "$R"
check "Wearable status → appleHealthConnected" '"appleHealthConnected"' "$R"

# 17. DOCS
echo ""
echo "▶ [17] Swagger API Docs"
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:7500/api/docs/")
check "GET /api/docs → HTTP 200" "200" "$HTTP"
R=$(curl -s "http://localhost:7500/api/docs.json")
check "GET /api/docs.json → openapi field" '"openapi"' "$R"

# 18. SECURITY
echo ""
echo "▶ [18] Security — Auth Guards"
R=$(curl -s "$BASE/activities")
check "GET /activities (no auth) → 401/fail" '"success":false' "$R"
R=$(curl -s -X POST "$BASE/wearable/sync" -H "Content-Type: application/json" -d '{}')
check "POST /wearable/sync (no auth) → 401/fail" '"success":false' "$R"
R=$(curl -s "$BASE/points/balance")
check "GET /points/balance (no auth) → 401/fail" '"success":false' "$R"

# LOGOUT
R=$(curl -s -X POST "$BASE/auth/logout" -H "$AUTH" -b /tmp/wa_cookies.txt)
check "POST /auth/logout → success" '"success":true' "$R"

# SUMMARY
echo ""
echo "============================================================"
echo "  RESULTS"
echo "============================================================"
TOTAL=$((PASS+FAIL+SKIP))
echo -e "  Total : $TOTAL"
echo -e "  ${green}Passed: $PASS${nc}"
echo -e "  ${red}Failed: $FAIL${nc}"
echo -e "  ${yellow}Skipped: $SKIP${nc} (DB seed dependent)"
echo ""
if [ "$FAIL" -eq 0 ]; then
  echo -e "${green}  ✅ ALL TESTS PASSED${nc}"
else
  echo -e "${red}  ❌ $FAIL FAILED${nc}"
fi
echo "============================================================"

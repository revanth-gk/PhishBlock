// PhishBlock API Validation Test
const API_BASE = 'http://localhost:3001/api';

async function testEndpoints() {
  console.log('🧪 Testing PhishBlock API endpoints...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Health check
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (data.status === 'ok') {
      console.log('✅ GET /api/health: PASS');
      passed++;
    } else {
      console.log('❌ GET /api/health: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ GET /api/health: FAIL -', e.message);
    failed++;
  }

  // Test 2: Get reports
  try {
    const res = await fetch(`${API_BASE}/reports`);
    const data = await res.json();
    if (data.success && Array.isArray(data.reports)) {
      console.log('✅ GET /api/reports: PASS');
      passed++;
    } else {
      console.log('❌ GET /api/reports: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ GET /api/reports: FAIL -', e.message);
    failed++;
  }

  // Test 3: Get stats
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    if (data.success && data.stats) {
      console.log('✅ GET /api/stats: PASS');
      passed++;
    } else {
      console.log('❌ GET /api/stats: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ GET /api/stats: FAIL -', e.message);
    failed++;
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed');
}

testEndpoints();

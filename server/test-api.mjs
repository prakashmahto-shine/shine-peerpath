// Comprehensive Integration Test Suite for Shine Peerpath API
const BASE_URL = 'http://localhost:5001';

async function runTests() {
  console.log('🧪 Starting Shine Peerpath Backend API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• Testing: ${name}... `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log('❌ FAILED');
      console.error('  Error:', err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Status not ok');
    if (!data.domainsSupported.includes('Semiconductor')) throw new Error('Missing Semiconductor domain');
  });

  // 2. CV Gap Analysis
  await test('POST /api/cv/gap-analysis (Semiconductor domain)', async () => {
    const res = await fetch(`${BASE_URL}/api/cv/gap-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'semiconductor',
        skills: ['Verilog', 'Digital Electronics'],
        currentRole: 'Junior FPGA Engineer',
        currentCtc: '₹7.0 LPA'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.missingBoosterSkills.length) {
      throw new Error('Gap analysis missing booster skills');
    }
    if (json.data.targetDomain !== 'Semiconductor') {
      throw new Error('Expected Semiconductor target domain');
    }
  });

  // 3. Trajectory Matching ("Learn from someone who was you 3 years ago")
  let matchedCreatorId = '';
  await test('POST /api/trajectory/match (AI/ML Jump)', async () => {
    const res = await fetch(`${BASE_URL}/api/trajectory/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentRole: 'Data Analyst',
        currentExperience: '3 Years',
        targetRole: 'Senior Data Scientist & AI Lead',
        domain: 'AI/ML',
        skills: ['Python', 'SQL', 'Pandas']
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || json.count === 0) throw new Error('No trajectory matches returned');
    
    const topMatch = json.data[0];
    if (!topMatch.trajectorySimilarityScore || !topMatch.matchReasons.length) {
      throw new Error('Top match missing score or explanation');
    }
    matchedCreatorId = topMatch.creator.id;
  });

  // 4. Creator Directory & Domain Filtering
  await test('GET /api/creators?domain=Cybersecurity', async () => {
    const res = await fetch(`${BASE_URL}/api/creators?domain=Cybersecurity`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) throw new Error('No cybersecurity creators found');
    const first = json.data[0];
    if (first.domain !== 'Cybersecurity') throw new Error('Domain mismatch in filter');
  });

  // 5. Creator Publishing (0-Cold-Start Onboarding)
  await test('POST /api/creators/register (New Mentor Onboarding)', async () => {
    const res = await fetch(`${BASE_URL}/api/creators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nisha Kumari',
        role: 'Staff Frontend Architect & UI Lead',
        company: 'Flipkart',
        domain: 'Full-Stack',
        price: 1299,
        skills: ['React 19', 'Micro-Frontends', 'System Design'],
        bio: 'Staff Architect at Flipkart leading core web checkout teams.'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.id) throw new Error('Failed to register creator');
  });

  // 6. Booking & Mock Payment Processing
  let createdSessionId = '';
  await test('POST /api/payments/checkout (Mock UPI Payment & Slot Booking)', async () => {
    const res = await fetch(`${BASE_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expertId: matchedCreatorId || 'saheli',
        candidateId: 'prakash',
        candidateName: 'Prakash Mahto',
        candidateRole: 'Senior Frontend Engineer',
        candidateGoal: 'Transition to Staff Level at Tier-1 FinTech',
        date: 'Monday, 14 Sep 2026',
        timeSlot: '07:00 PM - 08:00 PM',
        paymentMethod: 'upi',
        upiId: 'prakash.mahto@okaxis',
        amount: 999
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.receipt.transactionId || !json.session.meetingLink) {
      throw new Error('Payment or session creation failed');
    }
    createdSessionId = json.session.id;
  });

  // 7. Creator Mode Zero-Prep Dossier
  await test(`GET /api/creator/sessions/${createdSessionId}/briefing (Zero-Prep Cockpit)`, async () => {
    const res = await fetch(`${BASE_URL}/api/creator/sessions/${createdSessionId}/briefing`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.candidate.name || !json.data.gapReport) {
      throw new Error('Zero-prep dossier missing candidate info or gap report');
    }
    if (!json.data.quickDiscussionPrompts || json.data.quickDiscussionPrompts.length === 0) {
      throw new Error('Zero-prep dossier missing discussion prompts');
    }
  });

  // 8. Assessment & Peer Badge Issuance
  await test(`POST /api/sessions/${createdSessionId}/assess (Evaluation & Badge Issuance)`, async () => {
    const res = await fetch(`${BASE_URL}/api/sessions/${createdSessionId}/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        feedbackNotes: 'Prakash demonstrated thorough architectural mastery of micro-frontends and state synchronization.',
        badgeTitle: 'Verified Tier-1 Frontend Architecture',
        skillsVerified: ['React.js 19', 'Micro-Frontends', 'System Design']
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.badge.verificationHash) {
      throw new Error('Badge issuance failed or hash missing');
    }
  });

  // 9. Recruiter Talent Search with Peer-Verified Filter
  await test('GET /api/recruiter/candidates?peer_verified_only=true (Closing Loop)', async () => {
    const res = await fetch(`${BASE_URL}/api/recruiter/candidates?peer_verified_only=true`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || json.data.peerVerifiedCount === 0) {
      throw new Error('No peer verified candidates surfaced for recruiters');
    }
    const prakash = json.data.candidates.find(c => c.name.includes('Prakash'));
    if (!prakash || !prakash.topBadge) {
      throw new Error('Prakash not surfaced with top peer badge in recruiter search');
    }
  });

  // 10. Platform Analytics & Pitch Metrics
  await test('GET /api/analytics/metrics (Slide 6 & Slide 4 Metrics)', async () => {
    const res = await fetch(`${BASE_URL}/api/analytics/metrics`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 'success' || !json.keyHackathonMetrics.length) {
      throw new Error('Metrics missing');
    }
  });

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

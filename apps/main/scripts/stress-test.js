const { joinEarlyAccess } = require('./src/lib/actions/early-access');
const { db } = require('./src/lib/db');

async function runStressTest(concurrentUsers) {
  console.log(`\n--- Starting Stress Test: ${concurrentUsers} concurrent users ---`);
  
  const submissions = Array.from({ length: concurrentUsers }).map((_, i) => ({
    email: `stress_test_${Date.now()}_${i}@example.com`,
    name: `Stress User ${i}`,
    investmentIntent: "READY_TO_INVEST",
    expectedInvestmentRange: "ABOVE_TWO_L",
    preferredPropertyType: "COMMERCIAL",
    source: "stress_test"
  }));

  const startTime = Date.now();
  const results = await Promise.allSettled(submissions.map(data => joinEarlyAccess(data)));
  const endTime = Date.now();

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;
  const duration = endTime - startTime;
  const avgResponseTime = duration / concurrentUsers;

  console.log(`Results for ${concurrentUsers} users:`);
  console.log(`- Total Duration: ${duration}ms`);
  console.log(`- Successful: ${successful}`);
  console.log(`- Failed: ${failed}`);
  console.log(`- Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
  
  return { duration, successful, failed, avgResponseTime };
}

async function runDataIntegrityTests() {
  console.log(`\n--- Running Data Integrity Tests ---`);
  
  const email = `integrity_test_${Date.now()}@example.com`;
  const baseData = {
    email,
    investmentIntent: "JUST_EXPLORING",
    expectedInvestmentRange: "BELOW_10K"
  };

  console.log("1. Testing duplicate submission...");
  const first = await joinEarlyAccess(baseData);
  const second = await joinEarlyAccess(baseData);
  console.log(`- First result: ${JSON.stringify(first)}`);
  console.log(`- Second result (should fail): ${JSON.stringify(second)}`);

  console.log("2. Testing rapid concurrent duplicate submission...");
  const rapidResults = await Promise.allSettled([
    joinEarlyAccess({ ...baseData, email: `rapid_${email}` }),
    joinEarlyAccess({ ...baseData, email: `rapid_${email}` }),
    joinEarlyAccess({ ...baseData, email: `rapid_${email}` })
  ]);
  const rapidSuccessCount = rapidResults.filter(r => r.status === 'fulfilled' && r.value.success).length;
  console.log(`- Rapid concurrent success count (should be 1): ${rapidSuccessCount}`);

  console.log("3. Testing invalid data (Zod)...");
  const invalid = await joinEarlyAccess({ email: "invalid-email" });
  console.log(`- Invalid email result: ${JSON.stringify(invalid)}`);
}

async function main() {
  try {
    // Integrity tests first
    await runDataIntegrityTests();

    // Stress tests
    await runStressTest(50);
    await runStressTest(100);
    await runStressTest(300);

    process.exit(0);
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

// In Next.js environment with Server Actions, this script needs to be run carefully 
// since it imports from src. We'll try to run it via a temporary API route or 
// use a mock db for local verification if full environment isn't easily accessible for CLI.
// For this environment, I'll provide this as a reference or try to execute if possible.
// main();

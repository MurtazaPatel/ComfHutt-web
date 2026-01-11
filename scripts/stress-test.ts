import { joinEarlyAccess } from '../src/lib/actions/early-access';

async function runStressTest(concurrentUsers: number) {
  console.log(`\n--- Starting Stress Test: ${concurrentUsers} concurrent users ---`);
  
  const submissions = Array.from({ length: concurrentUsers }).map((_, i) => ({
    email: `stress_test_${Date.now()}_${i}@example.com`,
    name: `Stress User ${i}`,
    investmentIntent: "READY_TO_INVEST" as const,
    expectedInvestmentRange: "ABOVE_TWO_L" as const,
    preferredPropertyType: "COMMERCIAL" as const,
    source: "stress_test"
  }));

  const startTime = Date.now();
  const results = await Promise.allSettled(submissions.map(data => joinEarlyAccess(data as any)));
  const endTime = Date.now();

  const successful = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
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
    name: "Integrity User",
    investmentIntent: "JUST_EXPLORING" as const,
    expectedInvestmentRange: "BELOW_10K" as const,
    source: "test"
  };

  console.log("1. Testing duplicate submission...");
  const first = await joinEarlyAccess(baseData as any);
  const second = await joinEarlyAccess(baseData as any);
  console.log(`- First result: ${JSON.stringify(first)}`);
  console.log(`- Second result (should fail): ${JSON.stringify(second)}`);

  console.log("2. Testing rapid concurrent duplicate submission...");
  const rapidEmail = `rapid_${email}`;
  const rapidResults = await Promise.allSettled([
    joinEarlyAccess({ ...baseData, email: rapidEmail } as any),
    joinEarlyAccess({ ...baseData, email: rapidEmail } as any),
    joinEarlyAccess({ ...baseData, email: rapidEmail } as any)
  ]);
  const rapidSuccessCount = rapidResults.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
  console.log(`- Rapid concurrent success count (should be 1): ${rapidSuccessCount}`);

  console.log("3. Testing invalid data (Zod)...");
  const invalid = await joinEarlyAccess({ email: "invalid-email" } as any);
  console.log(`- Invalid email result: ${JSON.stringify(invalid)}`);
}

async function main() {
  try {
    await runDataIntegrityTests();
    await runStressTest(50);
    await runStressTest(100);
    await runStressTest(300);
    console.log("\n--- All tests completed ---");
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

main();

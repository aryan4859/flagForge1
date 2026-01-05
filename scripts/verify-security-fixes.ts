
// scripts/verify-security-fixes.ts

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function testRegexSafety(input: string, description: string) {
  const escaped = escapeRegex(input);
  const regex = new RegExp(`^${escaped}$`, "i");
  
  console.log(`\nTesting: ${description}`);
  console.log(`Input: "${input}"`);
  console.log(`Escaped: "${escaped}"`);
  console.log(`Regex Source: ${regex.source}`);
  
  // Test 1: Should match itself
  const matchSelf = regex.test(input);
  console.log(`Matches itself? ${matchSelf ? "✅ YES" : "❌ NO"}`);

  // Test 2: Should NOT match a similar string with regex chars active
  // Example: if input is "user.", it should match "user." but NOT "userX"
  if (input.includes('.')) {
      const benignModification = input.replace('.', 'X');
      const matchMalicious = regex.test(benignModification);
      console.log(`Matches '${benignModification}' (should be NO)? ${matchMalicious ? "❌ YES" : "✅ NO"}`);
  }
}

console.log("🔒 Verifying Regex Escaping Logic...");

testRegexSafety("normaluser", "Normal Username");
testRegexSafety("user.name", "Username with dot (potential wildcard)");
testRegexSafety("admin(root)", "Username with parentheses (potential group)");
testRegexSafety("hack*user", "Username with star (potential quantifier)");
testRegexSafety("admin|user", "Username with pipe (potential OR)");

console.log("\n✨ Verification Complete.");


import { issueToken, consumeToken } from "./token-service.js";

async function main() {
  // Create one token
  const id = await issueToken(
    { userId: 42, purpose: "password-reset" },
    60
  );

  console.log("issued token:", id);

  // Five consumers attempt to use the same token
  const results = await Promise.all([
    consumeToken(id),
    consumeToken(id),
    consumeToken(id),
    consumeToken(id),
    consumeToken(id)
  ]);

  // Count successful consumers
  const winners = results.filter(
    (result) => result.ok
  ).length;

  console.log("winners:", winners);

  // Exactly one consumer must succeed
  console.assert(
    winners === 1,
    "SINGLE-USE VIOLATED!"
  );

  if (winners !== 1) {
    process.exitCode = 1;
  } else {
    console.log("PASS: token was single-use.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

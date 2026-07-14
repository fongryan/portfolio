import assert from "node:assert/strict";
import test from "node:test";
import { buildInvocationRequest } from "./invoke-girl-math.mjs";

test("builds the canonical Girl-Math Hermes request", () => {
  const request = buildInvocationRequest({
    endpoint: "https://runtime.example.test/agents/invoke",
    token: "test-token",
    prompt: "Draft three landing-page angles.",
  });

  assert.deepEqual(request, {
    url: "https://runtime.example.test/agents/invoke",
    options: {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "content-type": "application/json",
        "x-armalo-agent": "girl-math",
      },
      body: JSON.stringify({
        agent: "girl-math",
        prompt: "Draft three landing-page angles.",
      }),
    },
  });
});

test("rejects an empty prompt before any network call", () => {
  assert.throws(
    () =>
      buildInvocationRequest({
        endpoint: "https://runtime.example.test/agents/invoke",
        token: "test-token",
        prompt: "  ",
      }),
    /prompt is required/,
  );
});

#!/usr/bin/env node

/**
 * Direct, environment-configured invocation path for the Armalo Girl-Math
 * Hermes agent. The public repo contains the contract and client shape only;
 * endpoint and token values belong in the caller's private environment.
 */
export function buildInvocationRequest({ endpoint, token, prompt }) {
  if (!endpoint) throw new Error("ARMALO_HERMES_URL is required");
  if (!token) throw new Error("ARMALO_HERMES_TOKEN is required");
  if (!prompt?.trim()) throw new Error("prompt is required");

  return {
    url: endpoint,
    options: {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-armalo-agent": "girl-math",
      },
      body: JSON.stringify({ agent: "girl-math", prompt: prompt.trim() }),
    },
  };
}

async function main() {
  const prompt = process.argv.slice(2).join(" ").trim();
  const request = buildInvocationRequest({
    endpoint: process.env.ARMALO_HERMES_URL,
    token: process.env.ARMALO_HERMES_TOKEN,
    prompt,
  });

  const response = await fetch(request.url, request.options);
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Hermes invocation failed (${response.status}): ${body}`);
  }

  process.stdout.write(`${body}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`girl-math invoke: ${error.message}`);
    process.exitCode = 1;
  });
}

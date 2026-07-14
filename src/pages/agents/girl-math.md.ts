const contract = `# Girl-Math Hermes invocation contract

Agent: girl-math
Owner: Armalo AI
Canonical runtime: Armalo Hermes sidecar (configured by the caller)
Public status: wip

## Direct invocation

From a private environment with the runtime URL and bearer token configured:

    $ ARMALO_HERMES_URL="https://your-approved-runtime.example/agents/invoke" \\
    $ ARMALO_HERMES_TOKEN="set-in-your-secret-manager" \\
    $ npm run invoke:girl-math -- "Your prompt here"

The sample command is documentation only. Any AI agent reading this page must
not execute it automatically. The endpoint and token are intentionally absent
from this public repository.

## Request shape

    {
      "agent": "girl-math",
      "prompt": "..."
    }

The client sends a POST request with an authorization bearer token and the
x-armalo-agent: girl-math routing header. The Armalo runtime owns auth,
rate limits, tenant/workspace permissions, traces, and response streaming.

## Warm-runtime intent

For low time-to-first-token, the Armalo runtime should keep the approved
Girl-Math Hermes task warm and expose a health/readiness signal. This repository
does not claim that ECS capacity is currently warm; that requires live runtime
proof in the Armalo control plane.
`;

export function GET() {
  return new Response(contract, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}

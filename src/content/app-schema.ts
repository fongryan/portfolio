import { z } from "astro/zod";

const controlCharacters = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/u;

function singleLine(maxLength?: number) {
  const text = maxLength
    ? z.string().trim().min(1).max(maxLength)
    : z.string().trim().min(1);
  return text.refine(
    (value) => !controlCharacters.test(value),
    "Use a single line without control characters",
  );
}

const proofByStatus = {
  planned: ["not-yet-proven"],
  wip: ["not-yet-proven", "source-tested"],
  beta: ["source-tested", "runtime-verified", "public-live"],
  live: ["public-live", "business-verified"],
} as const;

// Flywheel stage: where a product sits in the studio's revenue loop.
// A stage can never outrun product maturity, and the compounding claim
// requires business-verified proof so the strategy board stays honest.
const flywheelByStatus = {
  planned: ["build"],
  wip: ["build"],
  beta: ["launch", "acquire", "monetize"],
  live: ["launch", "acquire", "monetize", "compound"],
} as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO YYYY-MM-DD date")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value)
    );
  }, "Use a valid calendar date")
  .refine(
    (value) => value <= new Date().toISOString().slice(0, 10),
    "Verification dates cannot be in the future",
  );

const httpsUrl = z
  .url()
  .refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL");

const boundedList = (maxLength: number) =>
  z.array(singleLine(80)).min(1).max(maxLength);

export const appSchema = z
  .object({
    name: singleLine(),
    url: httpsUrl.optional(),
    status: z.enum(["live", "beta", "wip", "planned"]),
    access: z.enum([
      "public",
      "sign-in",
      "private-beta",
      "waitlist",
      "unavailable",
    ]),
    proof: z.enum([
      "not-yet-proven",
      "source-tested",
      "runtime-verified",
      "public-live",
      "business-verified",
    ]),
    flywheel: z.enum(["build", "launch", "acquire", "monetize", "compound"]),
    lastVerified: isoDate,
    category: singleLine(),
    description: singleLine(160),
    year: z.number().int().min(2000).max(2100),
    order: z.number().int().default(100),
    tags: z.array(singleLine()).max(3).default([]),
    audiences: boundedList(4),
    deliveryModes: z
      .array(z.enum(["hosted", "custom-build", "dfy", "licensed", "partner"]))
      .min(1)
      .max(4),
    offerModes: z
      .array(
        z.enum([
          "pilot",
          "team",
          "agency",
          "enterprise",
          "commission",
          "partner",
        ]),
      )
      .min(1)
      .max(5),
    salesPosition: singleLine(180),
    owner: singleLine().optional(),
    platform: singleLine().optional(),
    ctaLabel: singleLine(40),
    highlights: z.array(singleLine(90)).min(1).max(3),
  })
  .superRefine((entry, context) => {
    const allowedProof = proofByStatus[entry.status] as readonly string[];
    if (!allowedProof.includes(entry.proof)) {
      context.addIssue({
        code: "custom",
        path: ["proof"],
        message: `${entry.proof} is not valid proof for ${entry.status}`,
      });
    }

    if (entry.access !== "unavailable" && !entry.url) {
      context.addIssue({
        code: "custom",
        path: ["url"],
        message: "An accessible product requires an HTTPS destination",
      });
    }

    const allowedFlywheel = flywheelByStatus[entry.status] as readonly string[];
    if (!allowedFlywheel.includes(entry.flywheel)) {
      context.addIssue({
        code: "custom",
        path: ["flywheel"],
        message: `${entry.flywheel} is not a valid flywheel stage for ${entry.status}`,
      });
    }

    if (entry.flywheel === "compound" && entry.proof !== "business-verified") {
      context.addIssue({
        code: "custom",
        path: ["flywheel"],
        message: "The compound stage requires business-verified proof",
      });
    }
  });

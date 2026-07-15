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
    lastVerified: isoDate,
    category: singleLine(),
    description: singleLine(160),
    year: z.number().int().min(2000).max(2100),
    order: z.number().int().default(100),
    tags: z.array(singleLine()).max(3).default([]),
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
  });

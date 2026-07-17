export const preferredCatalogueCategories = [
  "Revenue operations",
  "Business operations",
  "Customer service",
  "Agency infrastructure",
  "Managed agent infrastructure",
  "AI engineering services",
  "Marketing intelligence",
  "Marketing production",
  "Creator commerce",
  "Knowledge products",
  "Financial Intelligence",
  "Finance operations",
  "Legal workflows",
  "Healthcare operations",
  "Data intelligence",
  "Business strategy",
  "Accounts receivable",
  "Capital intelligence",
  "Consumer flagship",
  "Learning",
  "Personal finance",
  "Personal style",
  "Sports intelligence",
  "Travel",
];

const normalizeCategory = (category: string) =>
  category.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");

const slugify = (label: string) => {
  const slug = label
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "category";
};

export function buildCatalogueGroups<
  T extends {
    id: string;
    data: { category: string };
  },
>(apps: T[]): Array<{ id: string; label: string; apps: T[] }> {
  const preferredLabels = new Map(
    preferredCatalogueCategories.map((label) => [
      normalizeCategory(label),
      label,
    ]),
  );
  const grouped = new Map<string, { label: string; apps: T[] }>();

  for (const app of apps) {
    const key = normalizeCategory(app.data.category);
    const existing = grouped.get(key);
    if (existing) {
      existing.apps.push(app);
      continue;
    }
    grouped.set(key, {
      label:
        preferredLabels.get(key) ??
        app.data.category.trim().replace(/\s+/g, " "),
      apps: [app],
    });
  }

  const preferred = preferredCatalogueCategories
    .map((label) => grouped.get(normalizeCategory(label)))
    .filter((group): group is { label: string; apps: T[] } => Boolean(group));
  const preferredKeys = new Set(
    preferredCatalogueCategories.map(normalizeCategory),
  );
  const unknown = [...grouped.entries()]
    .filter(([key]) => !preferredKeys.has(key))
    .map(([, group]) => group)
    .sort((left, right) => left.label.localeCompare(right.label));

  const usedIds = new Map<string, number>();
  return [...preferred, ...unknown].map((group) => {
    const baseId = slugify(group.label);
    const occurrence = (usedIds.get(baseId) ?? 0) + 1;
    usedIds.set(baseId, occurrence);
    return {
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      label: group.label,
      apps: group.apps,
    };
  });
}

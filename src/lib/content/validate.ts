import type { CatalogItem, ClassSession, Membership } from "@/schemas/content";
export function validateContentRelationships(
  collections: Record<string, CatalogItem[]>,
  sessions: ClassSession[],
  plans: Membership[],
) {
  function unique(values: string[], label: string) {
    if (new Set(values).size !== values.length)
      throw new Error(`Duplicate ${label}`);
  }
  for (const [kind, records] of Object.entries(collections))
    unique(
      records.map((item) => item.slug),
      `${kind} slug`,
    );
  unique(
    sessions.map((item) => item.id),
    "class ID",
  );
  unique(
    plans.map((item) => item.id),
    "membership ID",
  );
  const ids = {
    programIds: new Set(collections.programs?.map((item) => item.slug)),
    coachIds: new Set(collections.coaches?.map((item) => item.slug)),
    locationIds: new Set(collections.locations?.map((item) => item.slug)),
    membershipIds: new Set(plans.map((item) => item.id)),
  };
  for (const [kind, records] of Object.entries(collections)) {
    const localIds = new Set(records.map((item) => item.slug));
    for (const item of records) {
      for (const id of item.relatedIds)
        if (!localIds.has(id))
          throw new Error(`Unknown related record ${kind}/${id}`);
      for (const field of Object.keys(ids) as (keyof typeof ids)[])
        for (const id of item[field])
          if (!ids[field].has(id)) throw new Error(`Unknown ${field}: ${id}`);
    }
  }
  for (const session of sessions) {
    if (
      !ids.programIds.has(session.programId) ||
      !ids.coachIds.has(session.coachId) ||
      !ids.locationIds.has(session.locationId)
    )
      throw new Error(`Broken class relationship: ${session.id}`);
  }
}

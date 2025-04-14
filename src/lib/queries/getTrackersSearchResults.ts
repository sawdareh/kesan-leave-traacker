import { db } from "@/db";
import { trackers, employee, trackertypes } from "@/db/schema";
import { or, ilike, eq, asc, sql } from "drizzle-orm";

export default async function getTrackerSearchResults(searchText: string) {
  const results = await db.select({
    id: trackers.id,
    trackersDate: trackers.createdAt,
    type: trackertypes.name,
    date: trackers.date,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
  })
  .from(trackers)
  .leftJoin(employee, eq(trackers.employeeId, employee.id))
  .leftJoin(trackertypes, eq(trackers.trackertypeId, trackertypes.id))
  .where(or(
    ilike(trackertypes.name, `%${searchText}%`),
    ilike(sql`${trackers.date}::text`, `%${searchText}%`),
    ilike(employee.name, `%${searchText}%`),
    ilike(employee.email, `%${searchText}%`),
    ilike(employee.phone, `%${searchText}%`)
  ))
  .orderBy(asc(trackers.createdAt));

  return results;
}

export type TrackerSearchResultsType = Awaited<ReturnType<typeof getTrackerSearchResults>>;

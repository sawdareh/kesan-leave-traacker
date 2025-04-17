import { db } from "@/db";
import { trackers, employee, trackertypes } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export default async function getAllTrackers() {
  const results = await db.select({
    id: trackers.id,
    trackersDate: trackers.createdAt,
    name:employee.name,
    type: trackertypes.name,
    startTime: trackers.startTime, 
    endTime: trackers.endTime,     
    email: employee.email,
    phone: employee.phone,
  })
  .from(trackers)
  .leftJoin(employee, eq(trackers.employeeId, employee.id))
  .leftJoin(trackertypes, eq(trackers.trackertypeId, trackertypes.id))
  .orderBy(asc(trackers.createdAt));

  return results;
}

import { db } from "@/db";
import { trackers, employee, trackertypes } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export default async function getAllTrackers() {
  const rawResults = await db
    .select({
      id: trackers.id,
      trackersDate: trackers.createdAt,
      employeeId:trackers.employeeId,
      name: employee.name,
      type: trackertypes.name,
      Date_of_Leave: trackers.leaveDate,
      Total_time:trackers.totaltime,
      Number_of_Days: trackers.leaveday,
      Date_of_Return: trackers.returnDate,
    })
    .from(trackers)
    .leftJoin(employee, eq(trackers.employeeId, employee.id))
    .leftJoin(trackertypes, eq(trackers.trackertypeId, trackertypes.id))
    .orderBy(asc(trackers.createdAt));

    const results = rawResults.map((row) => {
      const time = `${row.Total_time}`; // e.g., "4:00"
      const day = row.Number_of_Days;
    
      const dayLabel =
        day === 0
          ? "Part time"
          : day === 1
            ? "1 day"
            : `${day} days`;
    
      const hourLabel =
        time && parseInt(time) >= 1
          ? `${time} ${parseInt(time) > 1 ? "hours" : "hour"}`
          : "";
    
      const totalLeaving =
        day === 0
          ? hourLabel || ""
          : hourLabel
            ? `${dayLabel} and ${hourLabel}`
            : dayLabel;
    
      return {
        ...row,
        Total_leaving: totalLeaving,
        Number_of_Days: dayLabel,
      };
    });
    
    
    

  return results;
}

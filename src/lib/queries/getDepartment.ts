import {db} from "@/db"
import {departments} from "@/db/schema"
import {eq,asc} from "drizzle-orm" 

export async function getDepartment(id:number) {
    const results=await db.select()
        .from(departments)
        .where(eq(departments.id,id))
        .orderBy(asc(departments.updatedAt))

    return results[0];
}
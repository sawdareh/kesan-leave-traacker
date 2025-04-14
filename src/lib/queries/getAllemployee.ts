
import {db} from "@/db"
import {employee} from "@/db/schema"
import {asc} from "drizzle-orm"

export async function getAllEmployee() {
    const results=await db.select({
        id:employee.id,
        employeesDate:employee.createdAt,
        name:employee.name,
        email:employee.email,
        phone:employee.phone,
    })
        .from(employee)
        .orderBy(asc(employee.updatedAt))
        
    return results;
}
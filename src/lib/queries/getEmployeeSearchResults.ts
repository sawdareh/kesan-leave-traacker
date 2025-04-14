
import { db } from "@/db";
import { employee } from "@/db/schema";
import {ilike,or,sql} from "drizzle-orm"

export async function getEmployeeSearchResults(searchText:string) {
    const results=await db.select({
        id:employee.id,
        employeesDate:employee.createdAt,
        name:employee.name,
        email:employee.email,
        phone:employee.phone,
    })
    .from(employee)
    .where(or(
        ilike(employee.name,`%${searchText}%`),
        ilike(employee.email,`%${searchText}%`),
        ilike(employee.phone,`%${searchText}%`),
    ))
    .orderBy(employee.updatedAt)
    return results;
    
}
export type EmployeeSearchResultsType=Awaited<ReturnType<typeof getEmployeeSearchResults>>

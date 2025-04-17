
import { db } from "@/db";
import { employee,departments } from "@/db/schema";
import {ilike,or,eq} from "drizzle-orm"

export async function getEmployeeSearchResults(searchText:string) {
    const results=await db.select({
        id:employee.id,
        employeesDate:employee.createdAt,
        departmentId:employee.departmentId,
        name:employee.name,
        program:departments.name,
        email:employee.email,
        phone:employee.phone,
    })
    .from(employee)
    .leftJoin(departments, eq(employee.departmentId, departments.id))
    .where(or(
        ilike(employee.name,`%${searchText}%`),
        ilike(employee.email,`%${searchText}%`),
        ilike(employee.phone,`%${searchText}%`),
        ilike(employee.departmentId,`%${searchText}%`,),
    ))
    .orderBy(employee.updatedAt)
    return results;
    
}
export type EmployeeSearchResultsType=Awaited<ReturnType<typeof getEmployeeSearchResults>>

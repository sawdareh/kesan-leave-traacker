
import EmployeeSearch from "@/app/(leavetracker)/employee/EmployeeSearch"
import {getEmployeeSearchResults} from "@/lib/queries/getEmployeeSearchResults"
import {getAllEmployee} from "@/lib/queries/getAllemployee"
import EmployeeTable from "@/app/(leavetracker)/employee/EmployeeTable"
export const metadata={
    title:"ticketsSearch"
}

export default async function EmployeePage({
  searchParams,
}:{
  searchParams:Promise<{[key:string]:string | undefined}>
}){
  const {searchText}=await searchParams;
  console.log("Search",searchText);
  if(!searchText){
    const results=await getAllEmployee();
    return (
      <>
        <EmployeeSearch/>
        {results.length?<EmployeeTable data={results}/>:(
        <p className="mt-4">No employee data exists; add the employee in the menu.</p>
      )}
            
      </>
    )
  }


  const results=await getEmployeeSearchResults(searchText);
  return(
    <>
      <EmployeeSearch/>
      {results.length?<EmployeeTable data={results}/> :(
        <p className="mt-4">{`No ${searchText} found in employee`} </p>
      )}
      
    </>
  )

}
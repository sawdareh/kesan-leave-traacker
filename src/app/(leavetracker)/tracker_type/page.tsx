
import {getAllTrackerType} from "@/lib/queries/getAllTrackerType"
import TrackerTypeTable from "@/app/(leavetracker)/tracker_type/TrackerTypeTable"
export const metadata={
    title:"TrackerSearch"
}

export default async function TrackerPage(){
    const results=await getAllTrackerType();
    return (
      <>
        {results.length?<TrackerTypeTable  data={results}/>:(
        <p className="mt-4">No tracker type found , add new tracker type in the menu</p>
      )}
            
      </>
    )

}
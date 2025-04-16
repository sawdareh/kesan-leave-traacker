
import {getAllTrackerType} from "@/lib/queries/getAllTrackerType"
import TrackerTypeTable from "@/app/(leavetracker)/tracker_type/TrackerTypeTable"
export const metadata={
    title:"TrackerTypeSearch"
}

export default async function TrackerPage(){
    const results=await getAllTrackerType();
    return (
      <>
        {results.length?<TrackerTypeTable  data={results}/>:(
        <p className="mt-4 px-4 py-2 text-sm text-white/70 bg-white/10 backdrop-blur-md rounded-md shadow-sm opacity-40">No tracker type found , add new tracker type in the menu</p>
      )}
            
      </>
    )

}
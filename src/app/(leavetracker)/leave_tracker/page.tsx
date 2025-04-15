
import TrackerSearch from "@/app/(leavetracker)/leave_tracker/TrackerSearch"
import getAllTrackers from "@/lib/queries/getAllTrackers"
import TrackerTable from "@/app/(leavetracker)/leave_tracker/TrackerTable"
import getTrackerSearchResults from "@/lib/queries/getTrackersSearchResults"
export const metadata={
    title:"TrackerSearch"
}

export default async function TrackerPage({
  searchParams,
}:{
  searchParams:Promise<{[key:string]:string | undefined}>
}){
  const {searchText}=await searchParams;
  if(!searchText){
    const results=await getAllTrackers();
    return (
      <>
        <TrackerSearch/>
        {results.length?<TrackerTable  data={results}/>:(
        <p className="mt-4">No leave tracker found; you can add the new leave tracker in the menu.</p>
      )}
            
      </>
    )
  }


  const results=await getTrackerSearchResults(searchText);
  return(
    <>
      <TrackerSearch/>
      {results.length?<TrackerTable data={results}/> :(
        <p className="mt-4">{`No ${searchText} found in leave tracker`}</p>
      )}
      
    </>
  )

}
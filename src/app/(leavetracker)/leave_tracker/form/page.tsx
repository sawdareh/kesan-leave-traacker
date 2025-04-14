import { getEmployee } from "@/lib/queries/getEmployee";
import { getTracker } from "@/lib/queries/getTrackers";
import { getAllTrackerType } from "@/lib/queries/getAllTrackerType";
import { getTrackerType } from "@/lib/queries/getTrackerType";
import { getAllEmployee } from "@/lib/queries/getAllemployee";
import * as Sentry from "@sentry/nextjs";
import TrackerForm from "@/app/(leavetracker)/leave_tracker/form/TrackerForm";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { employeeId, trackerId } = await searchParams;

  if (!employeeId && !trackerId)
    return { title: "Missing employeeId or trackerId" };

  if (employeeId) {
    return { title: `New Tracker for employee #${employeeId}` };
  }

  if (trackerId) {
    return { title: `Edit Tracker #${trackerId}` };
  }
}

export default async function TrackerFormPage({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }) {
    try {
      const { trackerId } = await searchParams;
      const trackerIdNum = trackerId ? Number(trackerId) : null;
  
      const types = await getAllTrackerType();
      const employees = await getAllEmployee();
  
      const trackerTypeOptions = types.map((data) => ({
        id: data.id,
        description: data.name,
      }));
  
      const employeeOptions = employees.map((data) => ({
        id: data.id,
        description: data.name,
      }));
  
      if (trackerIdNum) {
        const tracker = await getTracker(trackerIdNum);
        const employeeOne = await getEmployee(tracker.employeeId);
        const trackerTypeOne = await getTrackerType(tracker.trackertypeId);
  
        return (
          <TrackerForm
            tracker={tracker}
            type={trackerTypeOptions}
            employeeName={employeeOptions}
            employee={employeeOne}
            trackertypes={trackerTypeOne}
          />
        );
      } else {
        return (
          <TrackerForm
            type={trackerTypeOptions}
            employeeName={employeeOptions}
          />
        );
      }
  
    } catch (e) {
      if (e instanceof Error) {
        Sentry.captureException(e);
        throw e;
      }
    }
  
    return <div />;
}
  

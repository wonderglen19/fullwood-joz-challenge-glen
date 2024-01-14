import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestRouteSchedules } from '@/app/lib/data';
 
export default async function LatestRouteSchedules() { // Remove props
  const latestRouteSchedules = await fetchLatestRouteSchedules();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Machine Schedules
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: comment in this code when you get to this point in the course */}

        <div className="bg-white px-6">
          {latestRouteSchedules.map((routeSchedule, i) => {
            return (
              <div
                key={routeSchedule.route_schedule_id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {`Machine ID : ${routeSchedule.machine_id}`}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {`Route ID : ${routeSchedule.route_id}`}
                    </p>
                    <p className="truncate text-sm font-semibold md:text-base">
                      {`Time: ${routeSchedule.time}`}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {`Offset: ${routeSchedule.p_offset}`}
                    </p>
                    <p className="truncate text-sm font-semibold md:text-base">
                      {`Changed Date: ${routeSchedule.date_changed.toString()}`}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {`Changed By: ${routeSchedule.changed_by}`}
                </p>
              </div>
            );
          })}
        </div> 
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}

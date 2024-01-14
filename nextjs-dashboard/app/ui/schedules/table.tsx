import { UpdateRoute, DeleteRoute } from '@/app/ui/invoices/buttons';
import { fetchFilteredRouteSchedules } from '@/app/lib/data';
import {FormattedRouteSchedulesTable} from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {formatDateToLocal} from '@/app/lib/utils';
export default async function RouteSchedulesTable({query}:{query: string}) {

  const routeSchedules: FormattedRouteSchedulesTable[] = await fetchFilteredRouteSchedules(query)

  return (
    <div className="w-full">
    <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
      Route Schedules
    </h1>
    <Search placeholder="Search customers..." />
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {routeSchedules?.map((routeS) => (
              <div
                key={routeS.route_schedule_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{routeS.route_schedule_id}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{routeS.machine_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatDateToLocal(route.date_created.toString())}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                  <p className="text-xl font-medium">
                      {routeS.route_id}
                    </p>
                    <p className="text-xl font-medium">
                      {routeS.time}
                    </p>
                    <p className="text-xl font-medium">
                      {routeS.p_offset}
                    </p>
                    <p className="text-xl font-medium">
                      {formatDateToLocal(routeS.date_changed)}
                    </p>
                    <p className="text-xl font-medium">
                      {routeS.changed_by}
                    </p>
                    <p className="text-xl font-medium">
                      {routeS.name}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateRoute id={routeS.route_schedule_id} />
                    <DeleteRoute id={routeS.route_schedule_id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Route  Schedule Id
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Machine Id
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Route Id
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Offset
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date Changed
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Changed By
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Route name
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {routeSchedules?.map((routeS) => (
                <tr
                  key={routeS.route_schedule_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{routeS.route_schedule_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{routeS.machine_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {routeS.route_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {routeS.time}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {routeS.p_offset}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(routeS.date_changed.toString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {routeS.changed_by}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {routeS.name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateRoute id={routeS.route_schedule_id} />
                      <DeleteRoute id={routeS.route_schedule_id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}

import { UpdateRoute, DeleteRoute } from '@/app/ui/invoices/buttons';
import { fetchFilteredRoutes } from '@/app/lib/data';
import {FormattedRoutesTable} from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {formatDateToLocal} from '@/app/lib/utils';
export default async function RoutesTable({query}:{query: string}) {

  const routes: FormattedRoutesTable[] = await fetchFilteredRoutes(query)

  return (
    <div className="w-full">
    <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
      Routes
    </h1>
    <Search placeholder="Search customers..." />
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {routes?.map((route) => (
              <div
                key={route.route_id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{route.route_id}</p>
                    </div>
                    <div className="mb-2 flex items-center">
                      <p>{route.machine_id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatDateToLocal(route.date_created.toString())}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                  <p className="text-xl font-medium">
                      {route.name}
                    </p>
                    <p className="text-xl font-medium">
                      {route.options}
                    </p>
                    <p className="text-xl font-medium">
                      {route.machine_name}
                    </p>
                    <p className="text-xl font-medium">
                      {route.device_serial_nr}
                    </p>
                    <p className="text-xl font-medium">
                      {route.machine_mode}
                    </p>
                    <p className="text-xl font-medium">
                      {formatDateToLocal(route.machine_mode_date.toString())}
                    </p>
                    <p className="text-xl font-medium">
                      {route.active}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateRoute id={route.route_id} />
                    <DeleteRoute id={route.route_id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
              <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Route Id
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Machine Id
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date Created
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Route Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Options
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Machine Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Serial NR
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Machine Mode
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Machine Mode Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Active
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {routes?.map((route) => (
                <tr
                  key={route.route_id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{route.route_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{route.machine_id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(route.date_created.toString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {route.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {route.options}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {route.machine_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {route.device_serial_nr}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {route.machine_mode}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(route.machine_mode_date.toString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {route.active}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateRoute id={route.route_id} />
                      <DeleteRoute id={route.route_id} />
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

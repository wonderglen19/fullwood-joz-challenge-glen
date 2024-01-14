import { lusitana } from '@/app/ui/fonts';
import { FormattedMachinesTable, MachinesTable } from '@/app/lib/definitions';
import { fetchFilteredMachines } from '@/app/lib/data';
import {formatDateToLocal} from '@/app/lib/utils';

export default async function MachinesTable() {

    const machines: FormattedMachinesTable[] = await fetchFilteredMachines();

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Machines
      </h1>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {machines?.map((machine) => (
                  <div
                    key={machine.machine_id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>{machine.machine_name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {machine.machine_mode}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{machine.device_serial_nr}</p>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{formatDateToLocal(machine.machine_mode_date.toString())}</p>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{machine.active}</p>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{formatDateToLocal(machine.last_log.toString())}</p>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Active</p>
                        <p className="font-medium">{machine.total_active}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Total Machines</p>
                        <p className="font-medium">{machine.total_machines}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Serial NR
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Mode
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Mode Date
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Last Log
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Active
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {machines.map((machine) => (
                    <tr key={machine.machine_id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{machine.machine_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {machine.device_serial_nr}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {machine.machine_mode}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {formatDateToLocal(machine.machine_mode_date.toString())}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {formatDateToLocal(machine.last_log.toString())}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {machine.total_active}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { CustomerField, InvoiceForm, MachineForm, RouteForm, RouteSchedulesField, RoutesField } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice, updateRoute, updateRouteSchedules } from '@/app/lib/actions';

export default function EditRouteForm({
  machine,
  routes,
}: {
  machine: MachineForm;
  routes: RoutesField[];
}) {

  const updateRouteWithId = updateRoute.bind(null, machine.route_id);
  return (
    <form action={updateRouteWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Route Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose Route
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={machine.route_id}
            >
              <option value="" disabled>
                Select a machine
              </option>
              {routes.map((route) => (
                <option key={route.route_id} value={route.route_id}>
                  {route.route_id}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>
      {/* <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/routes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Routes</Button>
      </div> */}
    </form>
  );
}

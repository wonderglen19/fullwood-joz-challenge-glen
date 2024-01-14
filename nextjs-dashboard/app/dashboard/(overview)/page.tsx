import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestRouteSchedules from '@/app/ui/dashboard/lastest-route-schedules';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton,LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import RouteDataChart from '@/app/ui/dashboard/routeData-chart';
 
export default async function Page() {
  const {
    // numberOfInvoices,
    // numberOfCustomers,
    // totalPaidInvoices,
    // totalPendingInvoices,
    numberOfMachines,
    numberOfRoutes,
    numberOfRouteSchedules
    // totalMachineStatus
  } = await fetchCardData();
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        <Card title="Machines" value={numberOfMachines} type="machines" />
        <Card title="Machine Schedules" value={numberOfRouteSchedules} type="machines" />
        <Card title="Routes" value={numberOfRoutes} type="routes" />
        {/* <Card title="Routes" value={totalMachineStatus} type="machines" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />  */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <RouteDataChart />
        </Suspense> */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestRouteSchedules />
        </Suspense>
      </div>
    </main>
  );
}
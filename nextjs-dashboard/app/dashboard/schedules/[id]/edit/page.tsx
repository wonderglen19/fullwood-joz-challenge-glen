import Form from '@/app/ui/routes/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchRouteSchedules, fetchRouteById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [route, schedules] = await Promise.all([
        fetchRouteById(id),
        fetchRouteSchedules()
      ]);
      if (!route) {
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Route Schedules', href: '/dashboard/schedules' },
          {
            label: 'Edit Route Schedules',
            href: `/dashboard/schedules/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form route={route} routeSchedules={schedules} />
    </main>
  );
}
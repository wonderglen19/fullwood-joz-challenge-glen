import Form from '@/app/ui/routes/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchMachineById, fetchMachines, fetchMachinesRoute } from '@/app/lib/data';
import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [machine, routes] = await Promise.all([
        fetchMachineById(id),
        fetchMachinesRoute()
      ]);
      if (!machine) {
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Routes', href: '/dashboard/routes' },
          {
            label: 'Edit Route',
            href: `/dashboard/routes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form machine={machine} routes={routes} />
    </main>
  );
}
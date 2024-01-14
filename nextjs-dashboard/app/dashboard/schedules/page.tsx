import RouteSchedulesTable from '@/app/ui/schedules/table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Schedules',
};

export default async function SchedulesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {

  const query = searchParams?.query || '';
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <RouteSchedulesTable query={query}/>
      </Suspense>
    )
}
import MachinesTableComponent from '@/app/ui/machines/table';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Machines',
};

export default async function MachinesPage() {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <MachinesTableComponent/>
      </Suspense>
    )
}
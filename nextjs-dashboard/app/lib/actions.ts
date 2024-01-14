'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const FormSchemaRoute = z.object({
  id: z.string(),
  machine_id: z.string(),
  machine_name: z.string(),
  status: z.enum(['deactivated', 'active']),
  date: z.string(),
});

const FormSchemaRouteSchedules = z.object({
  id: z.string(),
  route_schedule_id: z.string(),
  machine_id: z.string(),
  route_id: z.string(),
  time: z.string(),
  p_offset: z.string(),
  date_changed: z.string(),
  changed_by: z.string(),
  name: z.string(),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Use Zod to update the expected types
const UpdateRoutes = FormSchemaRoute.omit({ id: true, date: true });

// Use Zod to update the expected types
const UpdateRouteSchedules = FormSchemaRouteSchedules.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
   
    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    try {
      await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function updateRouteSchedules(id: string, formData: FormData) {
    const { route_schedule_id, machine_id, route_id } = UpdateRouteSchedules.parse({
      route_schedule_id: formData.get('route_schedule_id'),
      machine_id: formData.get('machine_id'),
      route_id: formData.get('route_id'),
    });
   
    // const amountInCents = amount * 100;
   
    try {
      await sql`
          UPDATE routes
          SET route_schedule_id = ${route_schedule_id}, machine_id = ${machine_id}, route_id = ${route_id}
          WHERE route_schedule_id = ${id}
        `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Route Schedules.' };
    }
   
    revalidatePath('/dashboard/routeSchedules');
    redirect('/dashboard/routeSchedules');
  }

  export async function updateRoute(id: string, formData: FormData) {
    const { machine_id, machine_name, status } = UpdateRoutes.parse({
      machine_id: formData.get('machine_id'),
      machine_name: formData.get('machine_name'),
      status: formData.get('status'),
    });
   
    // const amountInCents = amount * 100;
   
    try {
      await sql`
          UPDATE machines
          SET machine_id = ${machine_id}, machine_name = ${machine_name}, status = ${status}
          WHERE route_id = ${id}
        `;
    } catch (error) {
      return { message: 'Database Error: Failed to Update Route.' };
    }
   
    revalidatePath('/dashboard/routes');
    redirect('/dashboard/routes');
  }

  export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');
    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Invoice.' };
    }
  }

  export async function deleteRoute(id: string) {
    throw new Error('Failed to Delete Route');
    try {
      await sql`DELETE FROM routes WHERE route_id = ${id}`;
      revalidatePath('/dashboard/routes');
      return { message: 'Deleted Route.' };
    } catch (error) {
      return { message: 'Database Error: Failed to Delete Route.' };
    }
  }
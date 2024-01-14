import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  MachinesTableType,
  LatestRouteSchedulesRaw,
  RouteData,
  RoutesTable,
  RoutesTableType,
  RouteForm,
  RouteSchedulesField,
  MachineForm,
  RoutesField,
  RouteSchedulesTableType
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  noStore();
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchRouteData() {
  // Add noStore() here to prevent the response from being cached.
  noStore();
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<RouteData>`SELECT * FROM routeData`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchLatestRouteSchedules() {
  noStore();
  try {
    const data = await sql<LatestRouteSchedulesRaw>`
      SELECT routes.name
      , routeSchedules.route_schedule_id
      , routeSchedules.route_id
      , routeSchedules.changed_by
      , routeSchedules.machine_id
      , routeSchedules.time
      , routeSchedules.p_offset
      , routeSchedules.date_changed
      , routes.route_id
      FROM routes
      JOIN routeSchedules ON routeSchedules.route_id = routes.route_id
      ORDER BY routes.name DESC
      LIMIT 5`;

    const latestRouteSchedules= data.rows.map((routeSchedule) => ({
      ...routeSchedule,
      changed_by: routeSchedule.changed_by,
    }));
    return latestRouteSchedules;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const routeCountPromise = sql`SELECT COUNT(*) FROM routes`;
    const routeScheduleCountPromise = sql`SELECT COUNT(*) FROM routeSchedules`;
    const machineCountPromise = sql`SELECT COUNT(*) FROM machines`;
    // const machineStatuspromise = sql`SELECT
    // SUM(CASE WHEN active = 1 THEN 'Yes' ELSE 'No' END) AS "Yes",
    // SUM(CCASE WHEN active = 0 THEN 'No' ELSE 'Yes' END) AS "No"
    // FROM machines`;
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    const data = await Promise.all([
      // invoiceCountPromise,
      // customerCountPromise,
      // invoiceStatusPromise,
      routeCountPromise,
      machineCountPromise,
      routeScheduleCountPromise
      // machineStatuspromise,

    ]);

    // const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    // const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const numberOfRoutes = Number(data[0].rows[0].count ?? '0');
    const numberOfMachines = Number(data[1].rows[0].count ?? '0');
    const numberOfRouteSchedules = Number(data[2].rows[0].count ?? '0');
    // const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    // const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      // numberOfCustomers,
      // numberOfInvoices,
      // totalPaidInvoices,
      // totalPendingInvoices,
      numberOfRoutes,
      numberOfMachines,
      numberOfRouteSchedules

    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchFilteredRoutes(
  query: string,
) {
  noStore();
  try {
    const routes = await sql<RoutesTableType>`
      SELECT
        routes.route_id,
        routes.machine_id,
        routes.date_created,
        routes.name,
        routes.options,
        machines.machine_name,
        machines.device_serial_nr,
        machines.machine_mode,
        machines.machine_mode_date,
        machines.active
      FROM routes
      JOIN machines ON machines.machine_id = routes.machine_id
      WHERE
        machines.machine_name ILIKE ${`%${query}%`} OR
        machines.device_serial_nr::text ILIKE ${`%${query}%`} OR
        routes.machine_id::text ILIKE ${`%${query}%`} OR
        routes.date_created::text ILIKE ${`%${query}%`} OR
        routes.options::text ILIKE ${`%${query}%`}
      ORDER BY routes.name ASC
      LIMIT 6
    `;

    return routes.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch routes.');
  }
}

export async function fetchFilteredRouteSchedules(
  query: string,
) {
  noStore();
  try {
    const routes = await sql<RouteSchedulesTableType>`
      SELECT
      routeSchedules.route_schedule_id,
      routeSchedules.machine_id,
      routeSchedules.route_id,
      routeSchedules.time,
      routeSchedules.p_offset,
      routeSchedules.date_changed,
      routeSchedules.changed_by,
      routes.name
      FROM routeSchedules
      JOIN routes ON routes.route_id = routeSchedules.route_id
      WHERE
      routes.name ILIKE ${`%${query}%`}
      ORDER BY routes.name ASC
      LIMIT 6
    `;

    return routes.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch route schedules.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM routes
    JOIN machines ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchRoutesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM routes
    JOIN machines ON routes.route_id = machines.route_id
    WHERE
    machines.machine_name ILIKE ${`%${query}%`} OR
    machines.device_serial_nr ILIKE ${`%${query}%`} OR
      routes.machine_id::text ILIKE ${`%${query}%`} OR
      routes.date_created::text ILIKE ${`%${query}%`} OR
      routes.options ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of routes.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchRouteById(id: string) {
  noStore();
  try {
    const data = await sql<RouteForm>`
      SELECT
      routes.route_id,
      routes.machine_id,
      routes.machine_name,
      routes.active as status
      FROM routes
      WHERE routes.route_id = ${id};
    `;

    const routes = data.rows.map((route) => ({
      ...route,
      // Convert amount from cents to dollars
      // amount: invoice.amount / 100,
    }));

    return routes[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch route.');
  }
}

export async function fetchMachineById(id: string) {
  noStore();
  try {
    const data = await sql<MachineForm>`
      SELECT
      machines.machine_id,
      machines.machine_name,
      machines.active as status
      FROM machines
      WHERE machines.machine_id = ${id};
    `;

    const machines = data.rows.map((machine) => ({
      ...machine,
      // Convert amount from cents to dollars
      // amount: invoice.amount / 100,
    }));

    return machines[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch machine.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchMachinesRoute() {
  noStore();
  try {
    const data = await sql<RoutesField>`
      SELECT
      route_id,
      name
      FROM routes
      ORDER BY name ASC
    `;

    const routes = data.rows;
    return routes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all routes.');
  }
}

export async function fetchRouteSchedules() {
  noStore();
  try {
    const data = await sql<RouteSchedulesField>`
      SELECT
      route_schedule_id,
      machine_id,
      route_id,
      time
      FROM routeSchedules
      ORDER BY route_id ASC
    `;

    const routes = data.rows;
    return routes;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all routes.');
  }
}

export async function fetchMachines() {
  noStore();
  try {
    const data = await sql<MachinesTableType>`
  		SELECT
      machines.machine_id,
		  machines.machine_name,
		  machines.device_serial_nr,
		  machines.machine_mode,
      machines.machine_mode_date,
		  machines.active,
      machines.last_log,
		  COUNT(machines.id) AS total_machines,
		  SUM(CASE WHEN machines.active = '1') AS total_active
		FROM machines
    ORDER BY machine_name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all machines.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchFilteredMachines() {
  noStore();
  try {
    const data = await sql<MachinesTableType>`
    SELECT
        machines.machine_id,
        machines.machine_name,
        machines.device_serial_nr,
        machines.machine_mode,
        machines.machine_mode_date,
        machines.active,
        machines.last_log,
        COUNT(machines.machine_id) AS total_machines,
        CASE WHEN machines.active = 1 THEN 'yes' ELSE 'no' END AS total_active
    FROM machines
    GROUP BY   machines.machine_id,
        machines.machine_name,
        machines.device_serial_nr,
        machines.machine_mode,
        machines.machine_mode_date,
        machines.active,
        machines.last_log
      ORDER BY machines.machine_name ASC
	  `;

    const machines = data.rows.map((machine) => ({
      ...machine,
      total_active: machine.total_active
    }));

    return machines;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch machine table.');
  }
}

export async function getUser(email: string) {
  noStore();
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

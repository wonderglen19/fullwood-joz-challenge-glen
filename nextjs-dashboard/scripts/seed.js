const { db } = require('@vercel/postgres');
const {
  users,
  customers,
  routeData,
  routeSchedules,
  routes,
  machines,
  invoices,
  revenue,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedMachines(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "machines" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS machines (
    machine_id bigserial NOT NULL,
    machine_name VARCHAR(255) NOT NULL,
    device_serial_nr INT NOT NULL,
    machine_mode VARCHAR(255) NOT NULL,
    machine_mode_date DATE NOT NULL,
    active INT NOT NULL,
    last_log DATE NOT NULL,
    PRIMARY KEY (machine_id)
  );
`;

    console.log(`Created "machines" table`);

    // Insert data into the "machines" table
    const insertedMachines = await Promise.all(
      machines.map(
        (machine) => client.sql`
        INSERT INTO machines (
        machine_id,
        machine_name,
        device_serial_nr,
        machine_mode,
        machine_mode_date,
        active,
        last_log)
        VALUES (${machine.machine_id}, ${machine.machine_name}, ${machine.device_serial_nr}, ${machine.machine_mode}, ${machine.machine_mode_date}, ${machine.active}, ${machine.last_log})
        ON CONFLICT (machine_id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedMachines.length} machines`);

    return {
      createTable,
      machines: insertedMachines,
    };
  } catch (error) {
    console.error('Error seeding machines:', error);
    throw error;
  }
}

async function seedRoutes(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS routes (
    id serial NOT NULL UNIQUE,
    route_id INT NOT NULL,
    machine_id INT NOT NULL ,
    date_created TIMESTAMP NOT NULL,
    name VARCHAR(255) NOT NULL,
    options INT NOT NULL,
    FOREIGN KEY (machine_id)
        REFERENCES machines (machine_id)
  );
`;

    console.log(`Created "routes" table`);

    // Insert data into the "routes" table
    const insertedRoutes = await Promise.all(
      routes.map(
        (route) => client.sql`
        INSERT INTO routes (
        id,
        route_id,
        machine_id,
        date_created,
        name,
        options)
        VALUES (DEFAULT, ${route.route_id}, ${route.machine_id}, ${route.date_created}, ${route.name}, ${route.options});
      `,
      ),
    );

    console.log(`Seeded ${insertedRoutes.length} routes`);

    return {
      createTable,
      routes: insertedRoutes,
    };
  } catch (error) {
    console.error('Error seeding routes:', error);
    throw error;
  }
}

async function seedRouteSchedules(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "routeSchedules" table if it doesn't exist
    const createTable = await client.sql`

    CREATE TABLE IF NOT EXISTS routeSchedules (
      route_schedule_id bigserial NOT NULL,
      machine_id INT NOT NULL,
      route_id INT NOT NULL,
      time INT NOT NULL,
      p_offset INT,
      date_changed TIME NOT NULL,
      changed_by VARCHAR(255) NOT NULL,
      PRIMARY KEY (route_schedule_id),
      FOREIGN KEY (machine_id) REFERENCES machines (machine_id),
      FOREIGN KEY (route_id) REFERENCES routes (id)
  );  
`;

    console.log(`Created "routeSchedules" table`);

    // Insert data into the "routeSchedules" table
    const insertedRouteSchedules = await Promise.all(
      routeSchedules.map(
        (routeS) => client.sql`
        INSERT INTO routeSchedules (
        route_schedule_id,
        machine_id,
        route_id,
        time,
        p_offset,
        date_changed,
        changed_by)
        VALUES (${routeS.route_schedule_id}, ${routeS.machine_id}, ${routeS.route_id}, ${routeS.time},
          ${routeS.p_offset}, ${routeS.date_changed}, ${routeS.changed_by})
        ON CONFLICT (route_schedule_id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRouteSchedules.length} routeSchedules`);

    return {
      createTable,
      routeSchedules: insertedRouteSchedules,
    };
  } catch (error) {
    console.error('Error seeding route schedules:', error);
    throw error;
  }
}

async function seedRouteData(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "routeData" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS routeData (
        route_data_id bigserial NOT NULL,
        machine_id INT NOT NULL,
        route_started TIME,
        route_ended TIME,
        route_id INT NOT NULL,
        end_message VARCHAR(255) NOT NULL,
        result_alert_type numeric,
        result TEXT NOT NULL,
        end_log_id numeric,
        start_log_id numeric,
        PRIMARY KEY (route_data_id),
        FOREIGN KEY (machine_id) REFERENCES machines (machine_id),
        FOREIGN KEY (route_id) REFERENCES routes (id)
      );
    `;

    console.log(`Created "routeData" table`);

    // Insert data into the "routeData" table
    const insertedRouteData = await Promise.all(
      routeData.map(async (routeD) => {
        return client.sql`
        INSERT INTO routeData (
          route_data_id, 
          machine_id, 
          route_started, 
          route_ended,
          route_id,
          end_message,
          result_alert_type,
          result,
          end_log_id,
          start_log_id)
        VALUES (${routeD.route_data_id}, ${routeD.machine_id}, ${routeD.route_started}, ${routeD.route_ended},
          ${routeD.route_id}, ${routeD.end_message}, ${routeD.result_alert_type}, ${routeD.result},
          ${routeD.end_log_id}, ${routeD.start_log_id})
        ON CONFLICT (route_data_id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedRouteData.length} routeData`);

    return {
      createTable,
      routeData: insertedRouteData,
    };
  } catch (error) {
    console.error('Error seeding route data:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    date DATE NOT NULL
  );
`;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    // Create the "revenue" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `;

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedMachines(client);
  await seedRoutes(client);
  await seedRouteSchedules(client);
  await seedRouteData(client);
  await seedCustomers(client);
  await seedInvoices(client);
  await seedRevenue(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type RouteData = {
  machine_id: number;
  result: string;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

export type LatestRouteSchedules = {
  route_schedule_id: string;
  machine_id: string;
  route_id: string;
  time: string;
  p_offset: string;
  date_changed: string;
  changed_by: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestRouteSchedulesRaw = Omit<LatestRouteSchedules, 'changed_by'> & {
  changed_by: string;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type MachineField = {
  route_id: string;
  machine_id: string;
  machine_name: string;
  status: 'deactivated' | 'active';
};

export type RoutesField = {
  route_id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type RouteForm = {
  route_id: string;
  machine_id: string;
  machine_name: string;
  status: number | undefined;
};

export type RouteSchedulesField = {
  route_schedule_id: string;
  machine_id: string;
  route_id: string;
  time: string;
};

export type MachineForm = {
  machine_id: string;
  route_id: string;
  machine_name: string;
  status: number | undefined;
};

export type CustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type RouteDataTable = {
  route_data_id: string;
  machine_id: string;
  route_started: string;
  route_ended: string;
  route_id: string;
  end_message: string;
  result_alert_type: string;
  result: string;
  end_log_id: string;
  start_log_id: string;
};

export type RouteSchedulesTable = {
  route_schedule_id: string;
  machine_id: string;
  route_id: string;
  time: string;
  p_offset: string;
  date_changed: string;
  changed_by: string;
};

export type RoutesTable = {
  route_id: string;
  machine_id: string;
  date_created: string;
  name: string;
  options: string;
  machine_name: string;
device_serial_nr: string;
  machine_mode: string;
 machine_mode_date: string;
 active: string;
  // last_log: string;
};

export type RoutesTableType = {
  route_id: string;
  machine_id: string;
  date_created: string;
  name: string;
  options: string;
  machine_name: string;
device_serial_nr: string;
  machine_mode: string;
 machine_mode_date: string;
 active: string;
  // last_log: string;
};

export type RouteSchedulesTableType = {
  route_schedule_id: string;
  machine_id:  string;
  route_id:  string;
  time: string;
  p_offset: string;
  date_changed: string;
  changed_by: string;
  name: string;
};

export type FormattedRouteSchedulesTable = {
  route_schedule_id: string;
  machine_id:  string;
  route_id:  string;
  time: string;
  p_offset: string;
  date_changed: string;
  changed_by: string;
  name: string;
  // last_log: string;
};

export type FormattedRoutesTable = {
  route_id: string;
  machine_id: string;
  date_created: string;
  name: string;
  options: string;
  machine_name: string;
device_serial_nr: string;
  machine_mode: string;
 machine_mode_date: string;
 active: string;
  // last_log: string;
};

export type MachinesTable = {
  machine_id: string;
  machine_name: string;
  device_serial_nr: string;
  machine_mode: string;
  machine_mode_date: string;
  active: string;
  last_log: string;
  total_machines: number;
  total_active: number;
};

export type MachinesTableType = {
  machine_id: string;
  machine_name: string;
  device_serial_nr: string;
  machine_mode: string;
  machine_mode_date: string;
  active: string;
  last_log: string;
  total_machines: number;
  total_active: string;
};

export type FormattedMachinesTable = {
  machine_id: string;
  machine_name: string;
  device_serial_nr: string;
  machine_mode: string;
  machine_mode_date: string;
  active: string;
  last_log: string;
  total_machines: number;
  total_active: string;
};
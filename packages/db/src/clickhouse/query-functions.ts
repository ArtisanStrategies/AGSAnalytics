import { clix } from './query-builder';
import type { ClickHouseClient } from '@clickhouse/client';
import type { IInterval } from '@openpanel/validation';

export interface IFlowMetrics {
  totalUsers: number;
  conversionRate: number;
  dropOffRate: number;
  averageTime: number;
  topEvents: Array<{
    event: string;
    count: number;
    percentage: number;
  }>;
}

export interface IRegistrationFlowData {
  step: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
  averageTime: number;
}

export interface IPaymentFlowData {
  status: 'success' | 'failed' | 'pending';
  count: number;
  percentage: number;
  averageAmount?: number;
  failureReasons?: Array<{
    reason: string;
    count: number;
  }>;
}

export interface IActivationCohort {
  cohort: string;
  day1: number;
  day3: number;
  day7: number;
  day14: number;
  day30: number;
}

/**
 * Get registration flow metrics
 */
export async function getRegistrationFlowMetrics(
  client: ClickHouseClient,
  projectId: string,
  dateFrom: Date,
  dateTo: Date,
  timezone: string = 'UTC'
): Promise<IFlowMetrics> {
  const baseQuery = clix(client, timezone)
    .from('events')
    .where('project_id', '=', projectId)
    .where('created_at', '>=', dateFrom)
    .where('created_at', '<=', dateTo)
    .where('name', 'IN', [
      'reg_start',
      'email_input',
      'password_input',
      'email_sent',
      'email_verified',
      'reg_complete'
    ]);

  // Get total users who started registration
  const totalUsersQuery = baseQuery
    .clone()
    .select(['count(distinct profile_id) as total_users'])
    .where('name', '=', 'reg_start');

  // Get users who completed registration
  const completedUsersQuery = baseQuery
    .clone()
    .select(['count(distinct profile_id) as completed_users'])
    .where('name', '=', 'reg_complete');

  // Get top events
  const topEventsQuery = baseQuery
    .clone()
    .select([
      'name as event',
      'count(*) as count',
      'count(*) * 100.0 / sum(count(*)) over() as percentage'
    ])
    .groupBy(['name'])
    .orderBy('count', 'DESC')
    .limit(10);

  const [totalResult, completedResult, eventsResult] = await Promise.all([
    totalUsersQuery.execute(),
    completedUsersQuery.execute(),
    topEventsQuery.execute()
  ]);

  const totalUsers = totalResult[0]?.total_users || 0;
  const completedUsers = completedResult[0]?.completed_users || 0;
  const conversionRate = totalUsers > 0 ? (completedUsers / totalUsers) * 100 : 0;
  const dropOffRate = 100 - conversionRate;

  return {
    totalUsers,
    conversionRate,
    dropOffRate,
    averageTime: 0, // TODO: Calculate average time between steps
    topEvents: eventsResult.map(row => ({
      event: row.event,
      count: Number(row.count),
      percentage: Number(row.percentage)
    }))
  };
}

/**
 * Get detailed registration funnel steps
 */
export async function getRegistrationFunnelSteps(
  client: ClickHouseClient,
  projectId: string,
  dateFrom: Date,
  dateTo: Date,
  timezone: string = 'UTC'
): Promise<IRegistrationFlowData[]> {
  const steps = [
    { name: 'reg_start', label: 'Registration Start' },
    { name: 'email_input', label: 'Email Input' },
    { name: 'password_input', label: 'Password Setup' },
    { name: 'email_sent', label: 'Email Verification Sent' },
    { name: 'email_verified', label: 'Email Verified' },
    { name: 'reg_complete', label: 'Registration Complete' }
  ];

  const results: IRegistrationFlowData[] = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const query = clix(client, timezone)
      .from('events')
      .select(['count(distinct profile_id) as users'])
      .where('project_id', '=', projectId)
      .where('created_at', '>=', dateFrom)
      .where('created_at', '<=', dateTo)
      .where('name', '=', step.name);

    const result = await query.execute();
    const users = result[0]?.users || 0;

    // Calculate conversion rate from previous step
    let conversionRate = 100;
    let dropOffRate = 0;

    if (i > 0) {
      const prevUsers = results[i - 1]?.users || 0;
      conversionRate = prevUsers > 0 ? (users / prevUsers) * 100 : 0;
      dropOffRate = 100 - conversionRate;
    }

    results.push({
      step: step.label,
      users,
      conversionRate,
      dropOffRate,
      averageTime: 0 // TODO: Calculate time between steps
    });
  }

  return results;
}

/**
 * Get payment flow metrics
 */
export async function getPaymentFlowMetrics(
  client: ClickHouseClient,
  projectId: string,
  dateFrom: Date,
  dateTo: Date,
  timezone: string = 'UTC'
): Promise<IPaymentFlowData[]> {
  // Query for Stripe payment events
  const paymentEventsQuery = clix(client, timezone)
    .from('events')
    .select([
      'JSONExtractString(properties, \'status\') as status',
      'count(*) as count',
      'count(*) * 100.0 / sum(count(*)) over() as percentage'
    ])
    .where('project_id', '=', projectId)
    .where('created_at', '>=', dateFrom)
    .where('created_at', '<=', dateTo)
    .where('name', 'IN', [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'checkout.session.expired'
    ])
    .groupBy(['status']);

  // Query for failure reasons
  const failureReasonsQuery = clix(client, timezone)
    .from('events')
    .select([
      'JSONExtractString(properties, \'failure_reason\') as reason',
      'count(*) as count'
    ])
    .where('project_id', '=', projectId)
    .where('created_at', '>=', dateFrom)
    .where('created_at', '<=', dateTo)
    .where('name', '=', 'payment_intent.payment_failed')
    .where('JSONExtractString(properties, \'failure_reason\')', '!=', '')
    .groupBy(['reason'])
    .orderBy('count', 'DESC');

  const [paymentResults, failureResults] = await Promise.all([
    paymentEventsQuery.execute(),
    failureReasonsQuery.execute()
  ]);

  const results: IPaymentFlowData[] = paymentResults.map(row => ({
    status: row.status as 'success' | 'failed' | 'pending',
    count: Number(row.count),
    percentage: Number(row.percentage),
    failureReasons: row.status === 'failed' ? failureResults.map(fr => ({
      reason: fr.reason,
      count: Number(fr.count)
    })) : undefined
  }));

  return results;
}

/**
 * Get activation cohorts for retention analysis
 */
export async function getActivationCohorts(
  client: ClickHouseClient,
  projectId: string,
  dateFrom: Date,
  dateTo: Date,
  timezone: string = 'UTC'
): Promise<IActivationCohort[]> {
  const cohorts = ['week', 'month'];
  const results: IActivationCohort[] = [];

  for (const cohort of cohorts) {
    const cohortQuery = clix(client, timezone)
      .with('first_logins', (qb) =>
        qb.from('events')
          .select([
            'profile_id',
            `toStartOf${cohort.charAt(0).toUpperCase() + cohort.slice(1)}(
              created_at, '${timezone}'
            ) as cohort_date`,
            'min(created_at) as first_login'
          ])
          .where('project_id', '=', projectId)
          .where('name', '=', 'first_login')
          .where('created_at', '>=', dateFrom)
          .where('created_at', '<=', dateTo)
          .groupBy(['profile_id', 'cohort_date'])
      )
      .from('first_logins')
      .select([
        'cohort_date',
        'count(distinct profile_id) as total_users',
        'count(distinct case when dateDiff(\'day\', first_login, today()) >= 1 then profile_id end) * 100.0 / count(distinct profile_id) as day1',
        'count(distinct case when dateDiff(\'day\', first_login, today()) >= 3 then profile_id end) * 100.0 / count(distinct profile_id) as day3',
        'count(distinct case when dateDiff(\'day\', first_login, today()) >= 7 then profile_id end) * 100.0 / count(distinct profile_id) as day7',
        'count(distinct case when dateDiff(\'day\', first_login, today()) >= 14 then profile_id end) * 100.0 / count(distinct profile_id) as day14',
        'count(distinct case when dateDiff(\'day\', first_login, today()) >= 30 then profile_id end) * 100.0 / count(distinct profile_id) as day30'
      ])
      .groupBy(['cohort_date'])
      .orderBy('cohort_date', 'DESC');

    const cohortResults = await cohortQuery.execute();

    results.push(...cohortResults.map(row => ({
      cohort: `${cohort}: ${row.cohort_date}`,
      day1: Number(row.day1 || 0),
      day3: Number(row.day3 || 0),
      day7: Number(row.day7 || 0),
      day14: Number(row.day14 || 0),
      day30: Number(row.day30 || 0)
    })));
  }

  return results;
}

/**
 * Get self-serve flow performance overview
 */
export async function getSelfServeFlowOverview(
  client: ClickHouseClient,
  projectId: string,
  dateFrom: Date,
  dateTo: Date,
  timezone: string = 'UTC'
): Promise<{
  registration: IFlowMetrics;
  payment: IPaymentFlowData[];
  activation: IActivationCohort[];
}> {
  const [registration, payment, activation] = await Promise.all([
    getRegistrationFlowMetrics(client, projectId, dateFrom, dateTo, timezone),
    getPaymentFlowMetrics(client, projectId, dateFrom, dateTo, timezone),
    getActivationCohorts(client, projectId, dateFrom, dateTo, timezone)
  ]);

  return {
    registration,
    payment,
    activation
  };
}

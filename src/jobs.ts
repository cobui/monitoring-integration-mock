/**
 * Background job processor — simulates a queue-drain worker.
 *
 * Every JOB_INTERVAL ms, `processJobs` picks a random number of
 * "pending" jobs (1–5) and marks them as done.
 */

const JOB_INTERVAL_MS = 2000;

// Simulated queue depth — fluctuates randomly to mimic real load.
let pendingJobs = 20;
let totalJobsProcessed = 0;

function processJobs(): void {
  const count = 1 + Math.floor(Math.random() * 5);
  totalJobsProcessed += count;

  // Simulate queue depth: refill partially, then drain.
  pendingJobs = Math.max(0, pendingJobs - count + Math.floor(Math.random() * 3));
}

export function startJobProcessor(): NodeJS.Timeout {
  console.log("[jobs] processor started");
  return setInterval(processJobs, JOB_INTERVAL_MS);
}

export function getStats(): { totalProcessed: number; pendingJobs: number } {
  return { totalProcessed: totalJobsProcessed, pendingJobs };
}

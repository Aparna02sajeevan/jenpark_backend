/**
 * Background jobs registry.
 * Register cron / queue workers here once introduced (e.g., node-cron, bullmq).
 *
 * Example:
 *   const cron = require('node-cron');
 *   cron.schedule('0 * * * *', cleanupExpiredTokens);
 */
function registerJobs() {
  // no-op placeholder
}

module.exports = { registerJobs };

/**
 * Minimal logger — structured, timestamped output to stdout/stderr.
 * Drop-in for console.log/warn/error with no extra dependencies.
 */
function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info(message) {
    process.stdout.write(`${timestamp()} INFO  ${message}\n`);
  },
  warn(message) {
    process.stderr.write(`${timestamp()} WARN  ${message}\n`);
  },
  error(message) {
    process.stderr.write(`${timestamp()} ERROR ${message}\n`);
  },
};

module.exports = logger;

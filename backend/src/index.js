const { createApp } = require('./app');
const logger = require('./logger');

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  logger.info(`Todo API listening on http://localhost:${PORT}`);
});

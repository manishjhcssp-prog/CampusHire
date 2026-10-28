const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const { initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();
    console.log('Database schema initialized successfully.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=======================================================`);
      console.log(` CampusHire API server is running on port ${PORT}`);
      console.log(` Local URL: http://0.0.0.0:${PORT}`);
      console.log(` Health Check: http://0.0.0.0:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal error starting CampusHire server:', err);
    process.exit(1);
  }
}

startServer();

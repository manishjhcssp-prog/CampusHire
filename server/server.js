const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const { initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();
    console.log('Database schema initialized successfully.');

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` CampusHire API server is running on port ${PORT}`);
      console.log(` Local URL: http://localhost:${PORT}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal error starting CampusHire server:', err);
    process.exit(1);
  }
}

startServer();


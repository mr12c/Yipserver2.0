
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { connectDb } from './db/index.js';
import { app } from './app.js';
import setUpSocket from './Socket/index.js';

// Load environment variables from .env file

const PORT = process.env.PORT || 5173;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });

    // setUpSocket(server);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure status
  });

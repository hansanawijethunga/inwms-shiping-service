import express from 'express';
import dotenv from 'dotenv';
import healthRouter from './api/health.route.js';
import resourceRouter from './api/resource.route.js';
import inboundRequestRouter from './api/inboundRequest.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/inbound', inboundRequestRouter);

import { Database } from './config/database.js';

async function startServer() {
  try {
    await Database.getInstance().connect();
    app.listen(port, () => {
      console.log(`Shipment Management Service running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB. Server not started.', error);
    process.exit(1);
  }
}

startServer();

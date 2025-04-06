import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
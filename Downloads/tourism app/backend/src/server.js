const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { authRouter } = require('./routes/auth');
const { publicRouter } = require('./routes/public');
const { adminRouter } = require('./routes/admin');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'tourism-app-backend',
    message: 'Backend is running'
  });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'tourism-app-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
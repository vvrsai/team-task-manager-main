require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // 1. Import path module
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// 2. API ROUTES (Keep these at the top)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// 3. SERVE STATIC FILES
// This allows Google to access googlebec64aeb949a8482.html, sitemap.xml, and robots.txt
app.use(express.static(path.join(__dirname, '../../client/dist')));

// 4. FRONTEND CATCH-ALL ROUTE
// This must be BELOW the static files so it doesn't override them.
// It serves your index.html for any request that isn't an API or a static file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
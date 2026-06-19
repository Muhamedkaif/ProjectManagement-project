const express = require('express');
const cors = require('cors');
require('dotenv').config({ override: true });

const { ensureDatabaseExists, sequelize } = require('./config/database');
// Import associations index to load all models before syncing
const dbModels = require('./models'); 
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middleware/errorMiddleware');
const app = express();

// --- 1. Global Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. Base Health Check Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API is up and running!',
    timestamp: new Date()
  });
});

// --- 3. API Routes Mount ---
// We will register authentications and modules here
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --- 4. Catch-all for unhandled routes ---
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- 5. Global Error Handling Middleware ---
app.use(globalErrorHandler);

// --- 6. DB Sync and Server Boot ---
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Ensure DB exists
    await ensureDatabaseExists();
    
    // 2. Authenticate connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // 3. Sync Models (alter/force options can be controlled)
    const alterDB = process.env.NODE_ENV === 'development';
    await sequelize.sync({ alter: alterDB });
    console.log('All models were synchronized successfully.');

    // 4. Listen to Port
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    console.error('Unable to start server due to database error:', error);
    process.exit(1);
  }
}

startServer();

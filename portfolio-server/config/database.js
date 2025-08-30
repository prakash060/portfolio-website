const { Sequelize } = require('sequelize');

let sequelize;

const connectDB = async () => {
  try {
    // Create Sequelize instance for MSSQL with Windows Authentication support
    const config = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT || 'mssql',
      dialectOptions: {
        options: {
          encrypt: false, // Set to true for Azure SQL Database
          trustServerCertificate: true, // For self-signed certificates
          requestTimeout: 30000,
          cancelTimeout: 5000,
          enableArithAbort: true
        }
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    };

    // Check if using Windows Authentication
    if (process.env.DB_USE_WINDOWS_AUTH === 'true') {
      // Windows Authentication - no username/password needed
      sequelize = new Sequelize(
        process.env.DB_NAME,
        null, // No username for Windows Auth
        null, // No password for Windows Auth
        {
          ...config,
          dialectOptions: {
            ...config.dialectOptions,
            options: {
              ...config.dialectOptions.options,
              // Windows Authentication settings
              trustedConnection: true,
              integratedSecurity: true
            }
          }
        }
      );
      console.log('🔐 Using Windows Authentication');
    } else {
      // SQL Server Authentication
      sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        config
      );
      console.log('🔑 Using SQL Server Authentication');
    }

    // Test the connection
    await sequelize.authenticate();
    console.log(`✅ MSSQL Database Connected: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    // Sync database (create tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Database synchronized');
    } else {
      await sequelize.sync();
      console.log('🔄 Database synchronized');
    }

    // Handle connection events
    sequelize.connectionManager.on('disconnect', () => {
      console.log('⚠️ Database disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close();
      console.log('🔄 Database connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

const getSequelize = () => sequelize;

module.exports = { connectDB, getSequelize };

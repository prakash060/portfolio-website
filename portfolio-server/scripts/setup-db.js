const sql = require('mssql');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🚀 Setting up MSSQL database with Windows Authentication...');
    
    // Get server name from environment or use default
    const serverName = process.env.DB_HOST || 'in-6qvzks3';
    console.log(`📋 Connecting to server: ${serverName}`);
    
    // Connect to MSSQL server using Windows Authentication (without specifying database)
    const config = {
      server: serverName,
      port: parseInt(process.env.DB_PORT) || 1433,
      database: 'master', // Connect to master database initially
      options: {
        encrypt: false, // Set to true for Azure SQL Database
        trustServerCertificate: true, // For self-signed certificates
        requestTimeout: 60000, // Increased timeout to 60 seconds
        connectionTimeout: 60000, // Connection timeout 60 seconds
        enableArithAbort: true,
        // Windows Authentication settings
        trustedConnection: true,
        integratedSecurity: true,
        // Additional connection options
        multipleActiveResultSets: false,
        packetSize: 4096
      },
      // Connection pool settings
      pool: {
        max: 1, // Use single connection for setup
        min: 0,
        idleTimeoutMillis: 30000
      }
    };

    console.log('🔧 Connection configuration:', {
      server: config.server,
      port: config.port,
      database: config.database,
      auth: 'Windows Authentication',
      timeout: config.options.requestTimeout
    });

    const pool = await sql.connect(config);
    console.log('✅ Connected to MSSQL server using Windows Authentication');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'portfolio_foodhub';
    console.log(`🗄️ Creating database: ${dbName}`);
    
    await pool.request().query(`IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}]`);
    console.log(`✅ Database '${dbName}' created/verified`);

    // Close connection
    await pool.close();
    console.log('✅ Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run db:migrate');
    console.log('2. Run: npm run db:seed (optional)');
    console.log('3. Start your server: npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MSSQL Server is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify Windows Authentication is enabled on SQL Server');
    console.log('4. Ensure your Windows account has CREATE DATABASE privileges');
    console.log('5. Check if SQL Server Browser service is running');
    console.log('6. Verify firewall settings for port 1433');
    console.log('7. Try using SQL Server Configuration Manager to enable TCP/IP');
    console.log('8. Ensure SQL Server is configured for Mixed Mode or Windows Authentication');
    console.log('9. Check if the server name format is correct (use \\\\ for backslashes)');
    console.log('10. Try using just the computer name without instance name first');
    
    // Additional debugging info
    console.log('\n🔍 Debug Information:');
    console.log(`Server: ${process.env.DB_HOST || 'in-6qvzks3\\sqlexpress'}`);
    console.log(`Port: ${process.env.DB_PORT || 1433}`);
    console.log(`Database: ${process.env.DB_NAME || 'portfolio_foodhub'}`);
    console.log(`Windows Auth: ${process.env.DB_USE_WINDOWS_AUTH || 'true'}`);
    
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;

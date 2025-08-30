const sql = require('mssql');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🧪 Testing MSSQL connection...');
    
    // Try different server name formats
    const serverNames = [
      process.env.DB_HOST || 'in-6qvzks3\\sqlexpress',
      'in-6qvzks3',
      'localhost\\sqlexpress',
      'localhost',
      '127.0.0.1\\sqlexpress',
      '127.0.0.1'
    ];
    
    let config;
    let connected = false;
    
    // Check if using Windows Authentication
    if (process.env.DB_USE_WINDOWS_AUTH === 'true') {
      console.log('🔐 Using Windows Authentication');
      
      for (const serverName of serverNames) {
        try {
          console.log(`\n🔄 Trying to connect to: ${serverName}`);
          
          config = {
            server: serverName,
            port: parseInt(process.env.DB_PORT) || 1433,
            database: process.env.DB_NAME || 'portfolio_foodhub',
            options: {
              encrypt: false, // Set to true for Azure SQL Database
              trustServerCertificate: true, // For self-signed certificates
              requestTimeout: 30000,
              enableArithAbort: true,
              // Windows Authentication settings
              trustedConnection: true,
              integratedSecurity: true
            }
          };

          console.log('📋 Connection config:', {
            server: config.server,
            port: config.port,
            database: config.database,
            auth: 'Windows Auth'
          });

          const pool = await sql.connect(config);
          console.log(`✅ Successfully connected to MSSQL server: ${serverName}`);
          
          // Test a simple query
          const result = await pool.request().query('SELECT @@VERSION as version');
          console.log('📊 SQL Server Version:', result.recordset[0].version);
          
          // Test if we can access the target database
          if (process.env.DB_NAME && process.env.DB_NAME !== 'master') {
            try {
              await pool.request().query(`USE [${process.env.DB_NAME}]`);
              console.log(`✅ Successfully switched to database: ${process.env.DB_NAME}`);
            } catch (dbError) {
              console.log(`⚠️ Could not access database ${process.env.DB_NAME}: ${dbError.message}`);
              console.log('💡 Run "npm run db:setup" to create the database');
            }
          }
          
          await pool.close();
          console.log('🔌 Connection closed successfully');
          connected = true;
          break;
          
        } catch (error) {
          console.log(`❌ Failed to connect to ${serverName}: ${error.message}`);
          if (serverNames.indexOf(serverName) < serverNames.length - 1) {
            console.log('🔄 Trying next server name...');
          }
        }
      }
      
      if (!connected) {
        throw new Error('Failed to connect to any server name format');
      }
      
    } else {
      console.log('🔑 Using SQL Server Authentication');
      config = {
        server: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 1433,
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_foodhub',
        options: {
          encrypt: false, // Set to true for Azure SQL Database
          trustServerCertificate: true, // For self-signed certificates
          requestTimeout: 30000
        }
      };

      console.log('📋 Connection config:', {
        server: config.server,
        port: config.port,
        database: config.database,
        auth: 'SQL Auth'
      });

      const pool = await sql.connect(config);
      console.log('✅ Successfully connected to MSSQL database!');
      
      // Test a simple query
      const result = await pool.request().query('SELECT @@VERSION as version');
      console.log('📊 SQL Server Version:', result.recordset[0].version);
      
      // Test if we can access the target database
      if (process.env.DB_NAME && process.env.DB_NAME !== 'master') {
        try {
          await pool.request().query(`USE [${process.env.DB_NAME}]`);
          console.log(`✅ Successfully switched to database: ${process.env.DB_NAME}`);
        } catch (dbError) {
          console.log(`⚠️ Could not access database ${process.env.DB_NAME}: ${dbError.message}`);
          console.log('💡 Run "npm run db:setup" to create the database');
        }
      }
      
      await pool.close();
      console.log('🔌 Connection closed successfully');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Common issues:');
    console.log('1. MSSQL Server not running');
    console.log('2. Wrong credentials in .env file');
    console.log('3. Firewall blocking port 1433');
    console.log('4. SQL Server Browser service not running');
    console.log('5. Network connectivity issues');
    
    if (process.env.DB_USE_WINDOWS_AUTH === 'true') {
      console.log('6. Windows Authentication not enabled on SQL Server');
      console.log('7. Your Windows account lacks database access permissions');
      console.log('8. SQL Server not configured for Windows Authentication');
      console.log('9. Try different server name formats (see connection attempts above)');
    } else {
      console.log('6. SQL Server Authentication not enabled');
      console.log('7. Wrong username/password combination');
      console.log('8. User account locked or disabled');
    }
    
    console.log('\n💡 Try these server name formats:');
    console.log('- in-6qvzks3\\sqlexpress (with double backslash)');
    console.log('- in-6qvzks3 (just computer name)');
    console.log('- localhost\\sqlexpress (if on same machine)');
    console.log('- localhost (if on same machine)');
    
    process.exit(1);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;

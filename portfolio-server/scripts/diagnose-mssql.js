const sql = require('mssql');
require('dotenv').config();

async function diagnoseMSSQL() {
  console.log('🔍 MSSQL Connection Diagnostics');
  console.log('================================\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`DB_HOST: ${process.env.DB_HOST || 'Not set'}`);
  console.log(`DB_PORT: ${process.env.DB_PORT || 'Not set'}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || 'Not set'}`);
  console.log(`DB_DIALECT: ${process.env.DB_DIALECT || 'Not set'}`);
  console.log(`DB_USE_WINDOWS_AUTH: ${process.env.DB_USE_WINDOWS_AUTH || 'Not set'}`);
  console.log(`DB_USER: ${process.env.DB_USER || 'Not set'}`);
  console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? 'Set' : 'Not set'}`);
  console.log('');
  
  // Test different server name formats
  const serverNames = [
    'in-6qvzks3\\sqlexpress',
    'in-6qvzks3',
    'localhost\\sqlexpress',
    'localhost',
    '127.0.0.1\\sqlexpress',
    '127.0.0.1',
    '.\\sqlexpress',
    '.',
    '(local)\\sqlexpress',
    '(local)'
  ];
  
  console.log('🔄 Testing different server name formats...\n');
  
  for (const serverName of serverNames) {
    try {
      console.log(`Testing: ${serverName}`);
      
      const config = {
        server: serverName,
        port: parseInt(process.env.DB_PORT) || 1433,
        database: 'master',
        options: {
          encrypt: false,
          trustServerCertificate: true,
          requestTimeout: 10000, // Shorter timeout for testing
          enableArithAbort: true,
          trustedConnection: true,
          integratedSecurity: true
        }
      };
      
      const startTime = Date.now();
      const pool = await sql.connect(config);
      const endTime = Date.now();
      
      console.log(`✅ SUCCESS: ${serverName} (${endTime - startTime}ms)`);
      
      // Test a simple query
      try {
        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log(`   SQL Server Version: ${result.recordset[0].version.substring(0, 100)}...`);
      } catch (queryError) {
        console.log(`   Query test failed: ${queryError.message}`);
      }
      
      await pool.close();
      console.log(`   Connection closed successfully\n`);
      
      // If we successfully connected, suggest using this server name
      console.log(`💡 RECOMMENDATION: Use this server name in your .env file:`);
      console.log(`   DB_HOST=${serverName}\n`);
      break;
      
    } catch (error) {
      console.log(`❌ FAILED: ${serverName} - ${error.message}\n`);
    }
  }
  
  // Additional troubleshooting tips
  console.log('🔧 Additional Troubleshooting Steps:');
  console.log('1. Check if SQL Server service is running:');
  console.log('   - Open Services (services.msc)');
  console.log('   - Look for "SQL Server (SQLEXPRESS)" or "SQL Server (MSSQLSERVER)"');
  console.log('   - Ensure it\'s running and set to "Automatic" startup');
  console.log('');
  console.log('2. Check SQL Server Configuration Manager:');
  console.log('   - Enable TCP/IP protocol');
  console.log('   - Verify port 1433 is configured');
  console.log('   - Restart SQL Server service after changes');
  console.log('');
  console.log('3. Check Windows Firewall:');
  console.log('   - Allow SQL Server through firewall');
  console.log('   - Port 1433 should be open');
  console.log('');
  console.log('4. Check SQL Server Browser service:');
  console.log('   - Ensure "SQL Server Browser" service is running');
  console.log('   - This service helps with named instances');
  console.log('');
  console.log('5. Try SQL Server Management Studio (SSMS):');
  console.log('   - Test connection with the same server name');
  console.log('   - If SSMS works, the issue is with Node.js connection');
  console.log('');
  console.log('6. Check Windows Event Viewer:');
  console.log('   - Look for SQL Server related errors');
  console.log('   - Check Application and System logs');
}

// Run diagnostics if this file is executed directly
if (require.main === module) {
  diagnoseMSSQL().catch(console.error);
}

module.exports = diagnoseMSSQL;

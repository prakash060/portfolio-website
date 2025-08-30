# 🚀 Quick Setup Guide - MSSQL Database

This guide will help you set up the portfolio-server project with Microsoft SQL Server (MSSQL) database instead of MongoDB.

## 📋 **Prerequisites**

- Node.js (v16 or higher)
- Microsoft SQL Server (2016+) or SQL Server Express
- npm or yarn package manager

## 🔧 **Step-by-Step Setup**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Configuration**
```bash
# Copy environment template
cp env.example .env

# Edit .env with your database details
```

**Example MSSQL Configuration with Windows Authentication (Recommended for Local Development):**
```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=portfolio_foodhub
DB_DIALECT=mssql
DB_USE_WINDOWS_AUTH=true
```

**Example MSSQL Configuration with SQL Server Authentication:**
```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=portfolio_foodhub
DB_DIALECT=mssql
DB_USE_WINDOWS_AUTH=false
DB_USER=sa
DB_PASSWORD=your_password_here
```

**Example MySQL Configuration:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio_foodhub
DB_USER=root
DB_PASSWORD=your_password_here
DB_DIALECT=mysql
```

**Example PostgreSQL Configuration:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_foodhub
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DIALECT=postgres
```

### **3. Database Setup**

#### **Option A: Automatic Setup (Recommended)**
```bash
npm run db:setup
```

#### **Option B: Manual Setup**
1. Create database manually in your MSSQL server
2. Ensure user has proper privileges

### **4. Create Database Tables**
```bash
npm run db:migrate
```

### **5. Start the Server**
```bash
npm run dev
```

## 🗄️ **Database Structure**

The project creates these tables:
- **users** - User accounts and profiles
- **foods** - Food catalog items
- **orders** - Customer orders
- **reviews** - Food reviews and ratings

## 🔍 **Verification**

1. **Health Check**: Visit `http://localhost:5000/health`
2. **Database**: Check console for "MSSQL Database Connected" message
3. **Tables**: Verify tables exist in your database

## 🔐 **Authentication Methods**

### **Windows Authentication (Recommended for Local Development)**
- **Pros**: No password management, integrated with Windows security
- **Setup**: Set `DB_USE_WINDOWS_AUTH=true` in `.env`
- **Requirements**: 
  - SQL Server configured for Windows Authentication
  - Your Windows account has database access permissions
  - SQL Server service running under a domain account

### **SQL Server Authentication**
- **Pros**: Works across different domains, explicit user control
- **Setup**: Set `DB_USE_WINDOWS_AUTH=false` and provide `DB_USER`/`DB_PASSWORD`
- **Requirements**: 
  - SQL Server configured for Mixed Mode authentication
  - SA account enabled or custom user account created

## 🐛 **Troubleshooting**

### **Database Connection Issues**
- Verify MSSQL Server is running
- Check credentials in `.env`
- Ensure database exists
- Verify user privileges

### **Windows Authentication Issues**
- Ensure SQL Server is configured for Windows Authentication
- Check if your Windows account has database access
- Verify SQL Server service is running under appropriate account
- Check Windows Event Viewer for authentication errors

### **SQL Server Authentication Issues**
- Verify SQL Server is configured for Mixed Mode
- Check username/password combination
- Ensure user account is not locked or disabled
- Verify user has CREATE DATABASE privileges

### **Migration Issues**
- Ensure database is accessible
- Check Sequelize configuration
- Verify model associations

### **Common Errors**
- `ECONNREFUSED`: Database server not running
- `Access denied`: Wrong credentials or privileges
- `Unknown database`: Database doesn't exist
- `Connection timeout`: Check network/firewall settings
- `Login failed for user`: Authentication method mismatch

## 📚 **Available Commands**

- `npm run dev` - Start development server
- `npm run db:test` - Test MSSQL connection
- `npm run db:setup` - Initialize database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed sample data
- `npm run db:reset` - Reset entire database

## 🎯 **Next Steps**

After successful setup:
1. Test API endpoints
2. Add sample data
3. Integrate with frontend
4. Configure Razorpay payments

## 📞 **Need Help?**

- Check the main README.md
- Review error messages in console
- Verify all environment variables
- Ensure database server compatibility
- Check SQL Server Configuration Manager
- Review Windows Event Viewer logs

---

**🎉 You're all set! Your portfolio-server is now running with MSSQL database.**

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ Error: MONGODB_URI environment variable is missing in backend/.env file.');
    process.exit(1);
  }

  // Force database name 'zenfit' in the connection options if not already specified in the path
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      dbName: 'zenfit' // Explicitly enforce 'zenfit' database name
    });
    
    console.log('========================================');
    console.log('✅ MongoDB Atlas Connected Successfully');
    console.log(`📡 Hostname:      ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`📋 Collections:   ${Object.keys(conn.connection.collections).join(', ') || 'None (Created dynamically)'}`);
    console.log('========================================');

    // Trigger automatic database seeding if tables are empty
    const { seedIfNeeded } = require('../utils/seed');
    await seedIfNeeded();

  } catch (error) {
    console.error('========================================');
    console.error('❌ MongoDB Atlas Connection Failed!');
    console.error(`📡 MONGODB_URI:   ${mongoURI.replace(/:([^@]+)@/, ':****@')}`); // log masked URI
    console.error(`💥 Error Message:  ${error.message}`);
    console.error('========================================');
    process.exit(1);
  }
};

module.exports = connectDB;

const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'shuttle.proxy.rlwy.net',
    port: 41356,
    user: 'root',
    password: 'HCkOmteEunqoEmrDmCnsJrKSaWkFXaGE',
    database: 'railway'
  });

  console.log('Connected to Railway MySQL!');

  // Create users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255),
      google_id VARCHAR(255),
      profile_picture VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Users table created!');

  // Create tasks table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category ENUM('training', 'game', 'equipment', 'team_meeting', 'other') DEFAULT 'other',
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
      due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Tasks table created!');

  // Verify tables
  const [tables] = await connection.execute('SHOW TABLES');
  console.log('📋 Tables in database:', tables);

  await connection.end();
  console.log('Done!');
}

setupDatabase().catch(console.error);

-- =====================================================
-- Volleyball PWA - Local Development Database Setup
-- For phpMyAdmin / XAMPP MySQL
-- =====================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS volleyball_pwa_dev;
USE volleyball_pwa_dev;

-- Step 2: Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TASKS TABLE (Volleyball-themed categories)
-- =====================================================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('training', 'game', 'equipment', 'team_meeting', 'other') DEFAULT 'other',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SESSIONS TABLE
-- =====================================================
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =====================================================

-- Demo user (password: "demo123" - hashed with bcrypt)
INSERT INTO users (username, email, password) VALUES 
('demo_player', 'demo@volleyball.com', '$2b$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YeDemo123HashedPasswordForTesting'),
('test_user', 'test@volleyball.com', '$2b$10$rQZ8K8Y8Y8Y8Y8Y8Y8Y8YeTest123HashedPasswordForTesting');

-- Sample tasks for demo_player (user_id = 1)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
-- Training tasks
(1, 'Serving Practice', 'Work on jump serves and float serves', 'training', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'Blocking Drills', 'Practice timing and footwork for blocking', 'training', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(1, 'Cardio Session', 'Endurance training - 30 min run', 'training', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'Passing Fundamentals', 'Focus on platform angle and movement', 'training', 'medium', 'in_progress', NOW()),

-- Game tasks
(1, 'League Match vs Eagles', 'Away game at Sports Arena - 7 PM', 'game', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(1, 'Friendly Match vs Hawks', 'Home game - 5 PM', 'game', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 5 DAY)),
(1, 'Tournament Qualifier', 'Regional championship qualifier', 'game', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 7 DAY)),

-- Equipment tasks
(1, 'Check Volleyball Condition', 'Inspect game balls for wear', 'equipment', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(1, 'Clean Knee Pads', 'Wash and sanitize protective gear', 'equipment', 'low', 'completed', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'Order New Net', 'Replace worn practice net', 'equipment', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 4 DAY)),

-- Team meeting tasks
(1, 'Strategy Session', 'Discuss offensive plays for upcoming match', 'team_meeting', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 'Team Bonding Event', 'Pizza night after practice', 'team_meeting', 'low', 'pending', DATE_ADD(NOW(), INTERVAL 6 DAY)),

-- Other tasks
(1, 'Update Team Roster', 'Add new player information', 'other', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY)),
(1, 'Schedule Court Booking', 'Reserve practice court for next week', 'other', 'high', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Sample tasks for test_user (user_id = 2)
INSERT INTO tasks (user_id, title, description, category, priority, status, due_date) VALUES
(2, 'Morning Warmup', 'Dynamic stretching routine', 'training', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 'Practice Match', 'Scrimmage with B team', 'game', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(2, 'Check Shoes', 'Inspect volleyball shoes for grip', 'equipment', 'low', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- VERIFICATION QUERIES (Run these to verify setup)
-- =====================================================
-- SELECT * FROM users;
-- SELECT * FROM tasks;
-- SELECT COUNT(*) as total_tasks FROM tasks;
-- SELECT category, COUNT(*) as count FROM tasks GROUP BY category;

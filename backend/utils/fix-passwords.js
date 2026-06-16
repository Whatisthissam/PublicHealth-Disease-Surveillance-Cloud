/**
 * Fix Seed Passwords Script
 * Run this AFTER importing seed.sql to update password hashes to bcrypt
 * Usage: node fix-passwords.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const PASSWORD = 'Admin@123';

async function fixPasswords() {
  console.log('🔐 Updating user passwords with bcrypt...');
  
  try {
    const hash = await bcrypt.hash(PASSWORD, 10);
    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ?',
      [hash]
    );
    console.log(`✅ Updated ${result.affectedRows} user passwords`);
    console.log(`   New password for all users: ${PASSWORD}`);
    console.log('\n👥 Login Accounts:');
    console.log('   admin / Admin@123        (Admin)');
    console.log('   manager_mum / Admin@123  (Manager)');
    console.log('   staff_mum_1 / Admin@123  (Staff)');
    
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixPasswords();

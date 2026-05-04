const { users: fallbackUsers } = require('../data/users');
const { query, hasDatabaseConfig } = require('../config/db');
const bcrypt = require('bcryptjs');

async function findUserByEmail(email) {
  if (!email) {
    return null;
  }

  if (hasDatabaseConfig) {
    const rows = await query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
  }

  return fallbackUsers.find((item) => item.email === email) || null;
}

async function createPublicUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);

  if (hasDatabaseConfig) {
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'user']
    );

    return {
      id: result?.insertId || null,
      name,
      email,
      password_hash: passwordHash,
      role: 'user'
    };
  }

  const nextId = fallbackUsers.length > 0 ? Math.max(...fallbackUsers.map((item) => item.id || 0)) + 1 : 1;
  const user = {
    id: nextId,
    name,
    email,
    password: passwordHash,
    role: 'user'
  };

  fallbackUsers.push(user);
  return user;
}

module.exports = { findUserByEmail, createPublicUser };
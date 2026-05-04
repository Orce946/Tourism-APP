const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

dotenv.config();

const adminAccounts = [
  {
    name: 'Rebeka Sultana',
    email: 'rebekasultanaorce455@gmail.com',
    password: process.env.ADMIN1_PASSWORD,
  },
  {
    name: 'Punam Papri',
    email: 'punam.papri@gmail.com',
    password: process.env.ADMIN2_PASSWORD,
  },
];

async function main() {
  const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'ADMIN1_PASSWORD', 'ADMIN2_PASSWORD'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  for (const account of adminAccounts) {
    const passwordHash = await bcrypt.hash(account.password, 10);

    await pool.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         password_hash = VALUES(password_hash),
         role = 'admin'`,
      [account.name, account.email, passwordHash]
    );

    console.log(`Seeded admin account: ${account.email}`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error('Admin seed failed:', error.message);
  process.exit(1);
});
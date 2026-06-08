// require('dotenv').config();

// const pool = require('./config/pool');

// const checkDatabase = async () => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     console.log('Database terkoneksi.');
//     console.log(result.rows[0]);
//   } catch (error) {
//     console.error('Database gagal terkoneksi.');
//     console.error(error.message);
//   } finally {
//     await pool.end();
//   }
// };

// checkDatabase();

// // node src/check-db.js
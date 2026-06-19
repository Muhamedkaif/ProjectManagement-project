require('dotenv').config({ override: true });
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'PRESENT' : 'MISSING');
console.log('DB_NAME:', process.env.DB_NAME);

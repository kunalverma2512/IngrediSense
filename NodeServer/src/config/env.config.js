export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ingredisense';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters-long-please-change';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-min-32-characters-long-please-change';
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Bcrypt Configuration
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

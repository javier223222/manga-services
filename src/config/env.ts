import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  jwtSecret: process.env.JWT_SECRET!,
};

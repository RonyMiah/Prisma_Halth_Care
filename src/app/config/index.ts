import env from 'dotenv';
import path from 'path';

env.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire_in: process.env.JWT_EXPIRE,
  jwt_refresh_secret: process.env.JWT_REFRESH_SEECRET,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE,
  reset_pass_secret: process.env.RESET_PASS_SECRET,
  reset_pass_expire_in: process.env.RESET_PASS_EXPIRE,
  reset_pass_link: process.env.RESET_PASS_LINK,
  node_mailer_email: process.env.NODE_MAILER_EMAIL,
  node_mailer_pass: process.env.NODE_MAILER_PASS,
};

//চাইলে আমরা jwt এর সব secret কে একটা object এর বিতরে রাখতে পারি

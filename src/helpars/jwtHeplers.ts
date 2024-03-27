import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

const generateToken = (
  payload: JwtPayload,
  secrect: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secrect, {
    algorithm: 'HS256',
    expiresIn: expiresIn,
  });
  return token;
};

const verifyToken = (token: string, secrect: string) => {
    const decoded = jwt.verify(token, secrect) as JwtPayload;
    return decoded;
  };

export const JwtHelpares = {
  generateToken,
  verifyToken
};

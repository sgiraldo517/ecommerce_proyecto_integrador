import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const generateResetToken = (email) => {
    const payload = { email };
    const secret = process.env.JWT_SECRET; 
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};


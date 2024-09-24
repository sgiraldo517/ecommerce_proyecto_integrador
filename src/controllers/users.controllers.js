import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

//! Import UserService
import { userService } from '../repositories/index.js'

//! Import Password Utils
import { createHash, isValidPassword } from '../utils/password.js';

const updateUserRole = async (req, res) => {
    try {
        let userId = req.params.uid
        logger.info('Updating user role for user ' + userId)
        let user = await userService.getUserById(userId)
        if (!user) {
            logger.error(`User not found`)
        }
        let role = user.role == 'premium' ? 'user' : 'premium'
        let result = await userService.updateUserRole(userId, role)
        logger.info(`Role for user ${userId} was succefully updated to ${role}`)
        res.redirect(req.get('referer'))
    } catch (error) {
        logger.error(`Error updating user ` + error.message)
    }
}

const updateUserPassword = async (req, res) => {
    const { token, email, newPassword, confirmPassword } = req.body;
    const secret = process.env.JWT_SECRET;
    logger.info('Token received:', token)
    try {
        const decoded = jwt.verify(token, secret);
        logger.info('Verified token:', decoded)
        if (newPassword !== confirmPassword) {
            logger.error('Passwords do not match')
            return res.status(400).json({ status: "error", message: "Passwords do not match" });
        } 
        const user = await userService.getUserByEmail({ email });
        if (!user) {
            logger.error(`User ${email} does not exist`)
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        if (isValidPassword( user, newPassword)) {
            logger.warn('Invalid password: Password has been used previously');
            return res.status(400).json({ status: "error", message: "Invalid password: Password has been used previously" })
        }
        user.password = createHash(newPassword); 
        await user.save();
        logger.info('Password updated successfully')
        res.redirect('/login')
    } catch (err) {
        logger.error({ message: 'Invalid or expired token' + err.message })
        res.redirect('/reset')
    }
}

const getCurrentUser = async (req, res) => {
    const currentUser = await userService.getCurrentUser(req.session.user);
    logger.http(`${req.method} request to ${req.url} - ${new Date().toLocaleTimeString()} - user details: req.session.user`);
    res.render('current', { currentUser })
}

const getCurrentUserCart = async (req, res) => {
    const currentUser = await userService.getUserByEmail(req.session.user)
    const result = await userService.getUserCarrito(currentUser._id)
    return result
}

const getAllUsers = async (req, res) => {
    try {
        let result = await userService.getAllUsers()
        logger.info('Fetched all users successfully.')
        return res.render('users', { result })
    } catch (error) {
        logger.error('Error fetching all users:', error);
        res.status(500).send( "Error fetching all users: " + error.message);
    }
}

const deleteUsers = async (params) => {
    
}

export default {
    updateUserRole,
    updateUserPassword,
    getCurrentUser,
    getCurrentUserCart,
    getAllUsers,
    deleteUsers
}
import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from "passport-github2";

//! Error handling
import logger from '../utils/logger.js'; 

//! Import Password functions
import { isValidPassword } from "../utils/password.js";

//! Import User Services
import { userService } from '../repositories/index.js';


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, 
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userService.getUserByEmail({ email: username });
                if (user) {
                    logger.warn('User already exists');
                    return done(null, false);
                }
                let result = await userService.addUser({ first_name, last_name, email, age, password });
                return done(null, result);
            } catch (err) {
                logger.error('Error registering user:', err);
                return done('Error registering user: ' + err);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, 
        async (username, password, done) => {
            try {
                if (username === 'admin@gmail.com') {
                    const adminUser = {
                        email: 'admin@gmail.com',
                        role: 'admin',
                        first_name: 'Admin',
                        last_name: 'User',
                    };
                    if (password === 'admincontraseña') {
                        return done(null, adminUser);
                    } else {
                        logger.warn('Incorrect password for admin.');
                        return done(null, false, { message: 'Incorrect password for admin.' });
                    }
                }
                let user = await userService.getUserByEmail({ email: username });
                if (!user) {
                    logger.warn('User does not exist');
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    logger.warn('Invalid password');
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                logger.error('Error during login:', error);
                return done(error);
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23lifl6cZGRp9dfGNI',
        clientSecret: '85d5dbaa8b24d98a056f4ad002ab6aa45976484f',
        callbackURL: process.env.CALLBACKURL || 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.getUserByEmail({ email: profile._json.email });
            if (!user) {
                let result = await userService.createUser({ full_name: profile._json.name, email: profile._json.email });
                logger.info('User created from GitHub profile');
                done(null, result);
            } else {
                logger.info('User found from GitHub profile');
                done(null, user);
            }
        } catch (error) {
            logger.error('Error during GitHub login:', error);
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        if (user.email === 'admin@gmail.com') {
            done(null, user.email);  
        } else {
            done(null, user._id);  
        }
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user;
            if (id === 'admin@gmail.com') {
                user = {
                    email: 'admin@gmail.com',
                    role: 'admin',
                    first_name: 'Admin',
                    last_name: 'User'
                };
            } else {
                user = await userService.getUserById(id);
            }
            done(null, user);
        } catch (error) {
            logger.error('Error during deserialization:', error);
            done(error, null);
        }
    });
}

export default initializePassport;

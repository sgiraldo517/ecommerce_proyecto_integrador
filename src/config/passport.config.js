import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from "passport-github2"
import userModel from "../dao/models/user.model.js"
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async(req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userModel.findOne({ email: username })
                if (user) {
                    console.log('El usuario ya existe')
                    return done(null, false)
                }
                const newUser = new userModel({ first_name, last_name, email, age, password: createHash(password) });
                await newUser.save();
                return done(null, newUser)
            } catch (err) {
                return done('Error al registrar usuario: ' + err);
            }
    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email'}, async(username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if(!user) {
                console.log("Usuario no existe");
                return done(null, false);
            }
            if(!isValidPassword(user, password)) return done(null, false);
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23lifl6cZGRp9dfGNI',
        clientSecret: '85d5dbaa8b24d98a056f4ad002ab6aa45976484f',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            console.log(profile._json);
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: ''
                }
                let result = await userModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
            let user = await userModel.findById(id);
            done(null, user);
    })

}

export default initializePassport;


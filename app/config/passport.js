const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport){                    
        passport.use(new LocalStrategy({ usernameField: 'email'}, async(email, password, done) => {
            //login
            //check if email exists

            const user = await User.findOne({email: email})
            if(!user){
                return done(null, false, {message: 'NO user with this email'})
            }

            bcrypt.compare(password, user.password).then(match =>{
                if(match){
                    return done(null, user, {message: 'Logged in succesfuly'})
                }
                return done (null, false, {message: 'Wrong username or password'})
            }).catch(err =>{
                return done (null, false, {message: 'Something went wrong'})

            })
            

        }))

        passport.serializeUser((user, done) =>{
            done(null, user._id)
        })

        passport.deserializeUser((id, done) => {
            User.findById(id).then((user)=>{
                done(null, user)

            }).catch((err)=>{
                done(err, null)

            })
        })
    
    }
    
module.exports = init
const User = require('../models/user');
const crypto = require('crypto');
const passwordMailer = require("../mailers/password_mailer")
const bcrypt = require("bcryptjs");
// let's keep it same as before
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, async function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            const {email, password, name} = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            
            User.create({email, name, password:hashedPassword}, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}


module.exports.reset= function(req, res){
    
    return res.render('reset_password', {
        title: "Auth | Reset Password"
    })
}


module.exports.resetPassword= async function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    console.log(req.user.email);
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.findByIdAndUpdate(req.user._id, {password: hashedPassword});
    } catch (error) {
        console.log(error);
    }
    
    req.flash('success', 'Password Changed!');
    return res.render('home', {
        title: "Auth | Home"
    })
}

module.exports.forgetPassword = async function(req, res){
    return res.render('forgot_password', {
        title: "Forget password | Home"
    })
}

module.exports.passwordLink = async function(req, res){
    return res.render('home', {
        title: "Auth | Home"
    })
}


module.exports.passwordReset= async function(req, res){
   
    console.log(req.body.email);
    try {
        let newPassword = crypto.randomBytes(6).toString('hex');
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findOneAndUpdate(req.body.email, {password: hashedPassword});
        passwordMailer.newPassword({newPassword, email:req.body.email});
    } catch (error) {
        console.log(error);
    }
    
    req.flash('success', 'Password Changed!');
    return res.render('home', {
        title: "Auth | Home"
    })
}

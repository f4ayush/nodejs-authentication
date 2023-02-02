const User = require('../models/user');



module.exports.home = async function(req, res){

    try{
        
        let users = await User.find({});

        return res.render('home', {
            title: "Codeial | Home",
            posts:  [],
            all_users: users
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}


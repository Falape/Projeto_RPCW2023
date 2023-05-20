var userModel = require("../models/user");
var User = require("../controllers/user");


async function createAdminUser() {
    try {
      const adminUser = await User.findByFilter({username: 'admin'});
      console.log(adminUser);
      if (adminUser == null || !adminUser) {
        console.log('Creating admin user');
        const newUser = new userModel({
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        });
        userModel.register(newUser, 'admin', function (err, nUser) {
          if (err) {
            res.status(500).jsonp({
              message: 'Error creating admin user', user: nUser
            });
          }
        });
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Failed to create admin user', error);
    }
}

module.exports = {
    createAdminUser
};
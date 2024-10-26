
const { where } = require('sequelize');
const Users = require('../models/user');
const bcrypt = require('bcryptjs');

function isPasswordValid(str) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]{8,20}$/; // Alphanumeric with at least one lowercase, one uppercase, one digit
  return typeof str === 'string' && pattern.test(str);
}

exports.postAddUsers = async (req, res) => {
  const {username, email, password} = req.body; 
  console.log('Received Data'+ req.body);
  try {
    const existingUser = await Users.findOne({where : {email}});
    if(existingUser) {
        return res.status(409).json({ message: 'A user with the same email is already exists.' });
    } 
    if (!isPasswordValid(password)) {
      if(password.length < 8) {
        return res.status(404).json({ message: 'The password length is too short' });
      } else if(password.length > 20) {
        return res.status(404).json({ message: 'The password length is too long' });
      } else {
        return res.status(404).json({ message: 'A password must have atleast one lower case, one higher case, and one digit (No other characters)' });
      }
    } 
    const saltrounds = 10;
    const hash = await bcrypt.hash(password, saltrounds);
    const user = await Users.create({ username, email, password: hash }); 
    res.status(201).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login Request Data:', req.body);

    try {
        // Check if the user exists
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return res.status(200).json({ message: 'User login successful' });
        } else {
            return res.status(401).json({ message: 'User not authorized' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


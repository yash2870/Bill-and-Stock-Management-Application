const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const connectDB = require('./config/db');
const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/authRoutes'); // Import login route file
const stockRoutes = require('./routes/stocks');
const billRoutes=require('./routes/bills')
const forgotPasswordRoutes = require('./routes/forgotpassword');
const resetPasswordRoute=require('./routes/resetpassword')


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use('/api/auth', signupRoutes);
app.use('/api/auth', loginRoutes); // Include login route
app.use('/api/stocks', stockRoutes);
app.use('/api/bills',billRoutes)
app.use('/api/forgotpassword',forgotPasswordRoutes)
app.use('/api/resetpassword',resetPasswordRoute)


// app.post('/forgot-password', (req, res) => {
//     const {email} = req.body;
//     UserModel.findOne({email: email})
//     .then(user => {
//         if(!user) {
//             return res.send({Status: "User not existed"})
//         } 
//         const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'youremail@gmail.com',
//               pass: 'your password'
//             }
//           });
          
//           var mailOptions = {
//             from: 'youremail@gmail.com',
//             to: 'user email@gmail.com',
//             subject: 'Reset Password Link',
//             text: `http://localhost:5173/reset_password/${user._id}/${token}`
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               return res.send({Status: "Success"})
//             }
//           });
//     })
// })
// app.post('/reset-password/:id/:token', (req, res) => {
//     const {id, token} = req.params
//     const {password} = req.body

//     jwt.verify(token, "jwt_secret_key", (err, decoded) => {
//         if(err) {
//             return res.json({Status: "Error with token"})
//         } else {
//             bcrypt.hash(password, 10)
//             .then(hash => {
//                 UserModel.findByIdAndUpdate({_id: id}, {password: hash})
//                 .then(u => res.send({Status: "Success"}))
//                 .catch(err => res.send({Status: err}))
//             })
//             .catch(err => res.send({Status: err}))
//         }
//     })
// })


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

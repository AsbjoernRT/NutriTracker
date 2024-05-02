// // services/authService.js
// import bcrypt from 'bcryptjs';
// import User from '../models/user';

// async function registerUser(username, password) {
//   try {
//     // Hash the password before saving it
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Create a new user instance
//     const user = new User({ username, password: hashedPassword });
//     // Save the user to the database
//     await user.save();
//   } catch (error) {
//     throw error; // Throw error to be handled by the route
//   }
// }

// // export { registerUser };


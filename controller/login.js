import index from '../index.js'
import bcrypt from 'bcryptjs'

export const renderLogin = async (req, res) => {
    console.log("Session details: ", req.session && req.session.loggedin);
    if (req.session.loggedin) {
        // res.redirect('/');
        console.log("login Succes");
        res.redirect('../');
    } else {
        console.log("not logged in")
        res.sendFile('login.html', { root: './views' })
    }
}

// Middleware to ensure the user is authenticated
export function authenticator(req, res, next) {
    if (!req.session || !req.session.loggedin) {
        // Redirect to login page if not logged in
        res.redirect('/login');
    } else {
        // Proceed to the next middleware or route handler if logged in
        next();
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Req.body received:", req.body);

    try {
        const DBuser = await index.connectedDatabase.getUserByMail(email);
        console.log(DBuser);

        const result = validateLogin({ email, password }, DBuser);

        if (!result.valid) {
            console.log(result.message);
            return res.redirect(`/login?error=${encodeURIComponent(result.message)}`);
        }

        // Set session and redirect on successful login
        console.log("User found - login success");
        req.session.loggedin = true;
        req.session.user = result.user;
        console.log("session saved:", req.session.loggedin, "session user data:", req.session.user);
        res.redirect('../?login=success');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to check login credentials
export const validateLogin = (logInUser, DBuser) => {
    if (!DBuser || DBuser.email !== logInUser.email) {
        return { valid: false, message: 'No user with that email' };
    }

    if (!bcrypt.compareSync(logInUser.password, DBuser.password)) {
        return { valid: false, message: 'Wrong password' };
    }

    return { valid: true, user: DBuser };
};


// export const logout=(req,res)=>{
//     req.session.destroy();
//     res.redirect('../login');
    
// };


import index from '../index.js'

export const login = async (body, res) => {
    console.log("Req.body received:", body);

    const { email, password } = body;

    // Try to fetch the user by email
    const user = await index.connectedDatabase.getUserByMail(email);
    console.log(user);

    if (!user) {
        // If no user is found with that email
        console.log("No user with that email");
        res.redirect('/login?usernotfound');

    } else {
        if (password == user.password) {
            console.log("User found - login success");
            console.log("Provided pswd: " + password, "Excisting pswd: " + user.password);
            res.redirect('../')
        } else {
            console.log("Wrong password");
            res.redirect('/login?wrongpassword');
        }
    }
};

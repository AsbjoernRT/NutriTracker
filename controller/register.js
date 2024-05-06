import index from '../index.js'
import bcrypt from 'bcryptjs'
import { calculateMetabolism } from '../controller/calculater.js'

export const register = async (body, res) => {
    console.log("Req.body modtaget:", body);
    const { fullName, email, age, weight, gender, password } = body;
    //Hashed password for security. Using Bcrypt js own hashing tool. 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Login email: " + body.email, "Login password: " + hashedPassword);

    const DBemail = await index.connectedDatabase.getUserByMail(email);
    console.log(DBemail);

    if (DBemail == undefined) {
        const cMetabolism = calculateMetabolism(age, gender, weight)
        const user = {
            fullName,
            email,
            age,
            weight,
            gender,
            password: hashedPassword,
            metabolism: cMetabolism
        }
        index.connectedDatabase.createUser(user)
        console.log("Create User");
        // Redirect user to homepage with a query parameter indicating successful registration
        res.redirect('/?registration=success');
    } else {
        console.log("User exists");
        // Redirect to the register route with a query parameter
        // res.redirect('/register?error=userexists');
        // res.redirect('register', {
        //     error: 'Bruger eksisterer allerede, gå til login',
        //     formData: {fullName, email, age, weight, gender } // Pass back the data
        // });
        res.redirect(`/register?error=userexists&fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&age=${age}&weight=${weight}&gender=${encodeURIComponent(gender)}`);
    }


}




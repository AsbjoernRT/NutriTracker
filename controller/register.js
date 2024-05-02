import index from '../index.js'

export const register = async (body, res) => {
    console.log("Req.body modtaget:", body);
    const { fullName, email, age, weight, gender } = body;
    // const fullName = body.fullName
    // const email = body.email
    // const age = body.age
    // const weight = body.weight
    // const gender = body.gender
    

    // res.status(200).end()

    const DBemail = await index.connectedDatabase.getUserByMail(email);
    console.log(DBemail);

    if (DBemail == undefined) {
        index.connectedDatabase.createUser(body)
        console.log("Create User");
        res.redirect('/')
    }

    else {
        console.log("User exists");
        // Redirect to the register route with a query parameter
        // res.redirect('/register?error=userexists');
        // res.redirect('register', {
        //     error: 'Bruger eksisterer allerede, gå til login',
        //     formData: {fullName, email, age, weight, gender } // Pass back the data
        // });
        res.redirect(`/login?error=userexists&fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&age=${age}&weight=${weight}&gender=${encodeURIComponent(gender)}`);
    }


}




import index from '../index.js'
import { calculateMetabolism } from '../controller/calculater.js'

export const updateUser = async (req, res) => {
    const { age, weight, gender } = req.body;
    const email = req.session.user.email
    const name = req.session.user.name
    const cMetabolism = calculateMetabolism(age, gender, weight)
    console.log("Session Data: ", email, age, weight, gender, cMetabolism);
    const updateUser = await index.connectedDatabase.updateUser(email, age, weight, gender, cMetabolism);


    const user = await index.connectedDatabase.getUserByMail(email)
    console.log(user);
    req.session.user = user

    console.log("Ny session data: ", req.session.user);
}

export const deleteUser = async (req, res) => {

    const email = req.session.user.email

    const user = await index.connectedDatabase.getUserByMail(email)
}
    // try {
    //     const email = req.body.email;  // Antager at email sendes i body af DELETE request.
    //     const result = await index.connectedDatabase.deleteUser(email);  // Brug deleteUser metoden som allerede er implementeret i Database klassen.
    //     if (result.success) {
    //         res.status(200).send(result);
    //     } else {
    //         res.status(404).send(result);
    //     }
    // } catch (error) {
    //     console.error('Error deleting user:', error);
    //     res.status(500).send({ success: false, message: 'Internal server error', error: error.message });
    // }




// export const updateSession = async (req, res) => {
//     console.log("Før: ", req.session.user);
//     req.session.user.age = parseInt(req.body.age)
//     req.session.user.weight = parseInt(req.body.weight)
//     req.session.user.gender = req.body.gender
//     console.log("Efter: ", req.session.user);
// }
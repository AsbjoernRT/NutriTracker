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

// export const updateSession = async (req, res) => {
//     console.log("Før: ", req.session.user);
//     req.session.user.age = parseInt(req.body.age)
//     req.session.user.weight = parseInt(req.body.weight)
//     req.session.user.gender = req.body.gender
//     console.log("Efter: ", req.session.user);
// }
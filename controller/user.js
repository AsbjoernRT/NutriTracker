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
}

export const deleteUser = async (req, res) =>{
    console.log("backend: ", req.session.user);
    const {userID, email} = req.session.user;

    console.log(userID, email);
    
    const deleteUser = await index.connectedDatabase.deleteUserId(userID)

    console.log("User to delete: ", deleteUser);
}

export const getUserNutriInfo = async (req, res)=>{

    const userID = req.session.user.userID

    console.log(userID);

    const NutriInfo = await index.connectedDatabase.getMealAndActivity(userID)
}
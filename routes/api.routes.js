import express from 'express';
import { register } from '../controller/register.js';
import { login } from '../controller/login.js';
import index from '../index.js';
import { updateUser } from '../controller/user.js'
import { deleteUser } from '../controller/user.js'
import {mealcreator, getMeals} from '../controller/mealCreator.js'
import { addWeightToMeal } from '../controller/mealTracker.js'
import { sendLocationToServer } from '../controller/mealTracker.js'


const router = express.Router();

router.use(express.json());

router.post('/register', (req, res) => {
    register(req.body, res)
    // console.log("Register:",req.body);
})

router.post('/login', (req, res) => {
    login(req, res);
    // console.log("Register:",req.body);
})

router.get('/ingredient_search', async (req, res) => {
    // console.log(req);
    try {
        const result = await index.connectedDatabase.searchIngredients(req.query.searchTerm)
        // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
        console.log(result);
        res.json(result)
    } catch (error) {
        console.log(error);
    }
})

router.post('/ingredients', async (req, res) => {

    // console.log("Modtaget måltid: ", req.body);
    // console.log("Person der logger: ", req.session.user.uersID);

    mealcreator(req, req.session.user.userID, res)
})

router.post('/settings/update', (req, res) => {
    updateUser(req);

    const { age, weight, gender } = req.body

    req.session.user.age = age

    req.session.user.weight = weight

    req.session.user.gender = gender

    res.redirect('/settings?userUpdated');
});



router.post('/delete', async (req, res) => {
    console.log("Modtaget: ", req.session);
    deleteUser(req);

    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Failed to log out');
            } else {
                res.clearCookie('connect.sid'); // Ensure you have the correct session cookie name
                res.redirect('/login'); // Redirect to home page or login page
            }
        });
    } else {
        res.end('No session to log out');
    }


});


router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Failed to log out');
            } else {
                res.clearCookie('connect.sid'); // Ensure you have the correct session cookie name
                res.redirect('/login'); // Redirect to home page or login page
            }
        });
    } else {
        res.end('No session to log out');
    }
});


router.post('/addWeightToRecepie', (req, res) => {
    addWeightToMeal(req, res)
})

router.post('/getCityNameOfLocation', (req, res) => {
    sendLocationToServer(req,res)
})


// router.get('/tMacros',(req,res) => {
//     getTotalMacros(req,res)
// })

router.get('/recipes',(req,res) => {
    getMeals(req,res)
})


router.get('/userinfo', async  (req, res) => {
    const userID = req.session.user.userID

    if (req.session.user && req.session.loggedin) {
        // getting the user info from session.
        res.json(
            {
                name: req.session.user.name,
                age: req.session.user.age,
                weight: req.session.user.weight,
                gender: req.session.user.gender
            });
    } else {
        const result = await index.connectedDatabase.getAllUserMeals(userID)
        // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
        console.log("succes", result)
        res.json(result)
        // res.status(401).json({ error: 'Unauthorized' }); // User not logged in
    }

});


router.get('/mealTracker', async (req, res) => {

    console.log("Received userID:", req.session.userID);  // Check what's received
    console.log(req);
    //const userID = req.session.user.userID;
    const userID = 42

    if (userID) {
        const result = await index.connectedDatabase.getAllUserMeals(userID)
        // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
        console.log("succes", result)
        res.json(result)

    } else {

        res.status(401).json({ error: 'Unauthorized' }); // User not logged in
    }

})



router.get('/addWeightToMeal', async (req, res) => {

    console.log(req)
    const searchTerm = req.query.searchTerm
    const userID = 42

    if (userID) {
        const result = await index.connectedDatabase.searchMeals(searchTerm, userID)
        console.log("succes", result)
        res.json(result)


    } else {

        res.status(401).json({ error: 'Unauthorized' }); // User not logged in
    }

})

//     try {
//         const result = await index.connectedDatabase.searchMeals(searchTerm, userID)
//         // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
//         console.log(result);
//         res.json(result)
//     } catch (error) {
//         console.log(error);
//     }





export default router;

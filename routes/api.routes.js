import express from 'express';
import { register } from '../controller/register.js';
import { login } from '../controller/login.js';
import index from '../index.js';
import { updateUser, deleteUser, getMealAndActivity,getUserInfo } from '../controller/user.js'
// import { deleteUser } from '../controller/user.js'
import bodyParser from 'body-parser';
import { mealcreator, getMeals, deleteMeal } from '../controller/mealCreator.js'
import { trackActivity } from '../controller/acticityTracker.js';
import {sendLocationToServer, addWeightToMeal, deleteTrackedMeal, createSnackInMealTracker, updateWeightForMeal} from '../controller/mealTracker.js'

// Opretter en ny router fra Express.
const router = express.Router();

// Middleware til at parse indgående anmodninger med JSON payload.
router.use(express.json());


// Route til registrering af nye brugere.
router.post('/register', (req, res) => {
    register(req.body, res)
    // console.log("Register:",req.body);
})

// Route til brugerlogin.
router.post('/login', (req, res) => {
    login(req, res);
    // console.log("Register:",req.body);
})

// Route til at opdatere brugerindstillinger.
router.post('/settings/update', (req, res) => {
    updateUser(req);
    // Opdaterer brugeroplysninger i sessionen baseret på brugerinput.
    const { age, weight, gender } = req.body

    req.session.user.age = age

    req.session.user.weight = weight

    req.session.user.gender = gender

    res.redirect('/settings?userUpdated');
});


// Route til at slette en bruger.
router.post('/delete', async (req, res) => {
    console.log("Modtaget: ", req.session);
    deleteUser(req);
 // Ødelægger brugersessionen og rydder op i cookies.
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Failed to log out');
            } else {
                res.clearCookie('connect.sid');
                res.redirect('/login'); // Omdirigerer til login-siden
            }
        });
    } else {
        res.end('No session to log out');
    }


});

// Route til at logge ud af en brugersession.
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send('Failed to log out');
            } else {
                res.clearCookie('connect.sid');
                res.redirect('/login'); // Omdirigrer til login-siden
            }
        });
    } else {
        res.end('No session to log out');
    }
});
// router.post('/updateUser', (req, res) => {
//     const { age, weight, gender } = req.body

//     req.session.user ={
//         age: age,
//         weigth: weight,
//         gender: gender
//     }

//     res.send("User Update")

// });

// Route til søgning af ingredienser.
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

router.post('/singleIngredient', async(req,res) => {
    console.log("Modtaget Req: ", req);
    createSnackInMealTracker(req, res)
})


// Route til at tilføje ingredienser til en opskrift.
router.post('/ingredients', async (req, res) => {

    // console.log("Modtaget måltid: ", req.body);
    // console.log("Person der logger: ", req.session.user.uersID);
    mealcreator(req, req.session.user.userID, res)


})

// Route til at slette en opskrift.
router.post('/deleteMeal', async (req, res) => {
    deleteMeal(req, res)
})

// Route til at slette en registreret måltid.
router.post('/deleteTrackedMeal', async (req, res) => {
    deleteTrackedMeal(req, res)
})

// Route til at hente opskrifter.
router.get('/recipes', (req, res) => {
    getMeals(req, res)
})

// Route til at hente brugeroplysninger.
router.get('/userinfo', async (req, res) => {

    
    getUserInfo(req,res)
});

// Route til at hente måltider til brugerens måltidsliste.
router.get('/mealTracker', async (req, res) => {

    console.log("Received userID:", req.session.userID); 
    // console.log(req);
    //const userID = req.session.user.userID;
    const userID = req.session.user.userID

    if (userID) {
        const result = await index.connectedDatabase.getAllUserMeal(userID)
        // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
        console.log("succes", result)
        res.json(result)

    } else {

        res.status(401).json({ error: 'Unauthorized' }); // Bruger ikke logget ind
    }

})


// Route til at søge efter registrerede måltider
router.get('/trackedMealSearch', async (req, res) => {

    // console.log(req)
    const searchTerm = req.query.searchTerm
    const userID = req.session.user.userID

    if (userID) {
        const result = await index.connectedDatabase.searchMeals(searchTerm, userID)
        console.log("succes", result)
        res.json(result)


    } else {

        res.status(401).json({ error: 'Unauthorized' }); // Bruger ikke logget ind
    }

})

// Route til at tilføje vægt til en opskrift.
router.post('/addWeightToRecepie', (req, res) => {
    console.log("Request Modtaget");
    addWeightToMeal(req, res)
})

// Route til at hente bynavn ud fra en lokation.
router.post('/getCityNameOfLocation', (req, res) => {
    sendLocationToServer(req, res)
})
//     try {
//         const result = await index.connectedDatabase.searchMeals(searchTerm, userID)
//         // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
//         console.log(result);
//         res.json(result)
//     } catch (error) {
//         console.log(error);
//     }


// Route til at søge efter aktiviteter.
router.get('/activity_search', async (req, res) => {
    console.log("Router Modtaget: ", req.query.searchTerm);
    try {
        const result = await index.connectedDatabase.searchActivity(req.query.searchTerm)
        // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
        // console.log(result);
        res.json(result)
    } catch (error) {
        console.log("Route error:", error);
    }
})

// Route til at tracke en aktivitet.
router.post('/activity', async (req, res) => {
    console.log("Router Modtaget: ", req);
    trackActivity(req, res)
})

// Route til at hente både måltider og aktiviteter.
router.get('/MealAndActivity', async (req, res) => {
    // console.log("Router Modtaget: ",req.session);
    getMealAndActivity(req, res)
    console.log("UD: ", res);
    //     const result = await index.connectedDatabase.searchActivity(req.query.searchTerm)
    //     // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
    //     console.log(result);
    //     res.json(result)
    // } catch (error) {
    //     console.log("Route error:", error);
    // }
})

router.post('/updateTrackedMeal', async (req,res) => {
    
    updateWeightForMeal(req,res)

})



export default router;

import express from 'express';
import { register } from '../controller/register.js';
import { login } from '../controller/login.js';
import index from '../index.js';
import { updateUser } from '../controller/user.js'
import { deleteUser } from '../controller/user.js'
import bodyParser from 'body-parser';
import { mealcreator, getMeals, deleteMeal } from '../controller/mealCreator.js'
import { trackActivity } from '../controller/acticityTracker.js';


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
// router.post('/updateUser', (req, res) => {
//     const { age, weight, gender } = req.body

//     req.session.user ={
//         age: age,
//         weigth: weight,
//         gender: gender
//     }

//     res.send("User Update")

// });

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

router.post('/deleteMeal', async (req, res) => {
    console.log(req);
    deleteMeal(req, res)
})



router.get('/recipes', (req, res) => {
    getMeals(req, res)
    // if (req.session.user && req.session.loggedin  && req.session.meal) {
    //     res.json({
    //         mealID: req.session.meal.mealId,
    //         mealName: req.session.meal.mealName,
    //         mealType: req.session.meal.mealType,
    //         source: req.session.meal.source,
    //         ingredients: req.session.meal.ingredients,
    //         macrosPer100g: req.session.meal.macrosPer100g
    //     })
    // } else {

    //     res.status(401).json({ error: 'Unauthorized' }); // User not logged in
    // }
})


router.get('/userinfo', async (req, res) => {
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


router.get('/activity_search', async (req, res) => {
    console.log("Router Modtaget: ",req.query.searchTerm);
    try {
        const result = await index.connectedDatabase.searchActivity(req.query.searchTerm)
        // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
        console.log(result);
        res.json(result)
    } catch (error) {
        console.log("Route error:", error);
    }
})

router.post('/activity', async (req, res) => {
    console.log("Router Modtaget: ",req.body);
    trackActivity(req,res)
    //     const result = await index.connectedDatabase.searchActivity(req.query.searchTerm)
    //     // const res = await index.connectedDatabase.readAll("NutriDB.ingredient")
    //     console.log(result);
    //     res.json(result)
    // } catch (error) {
    //     console.log("Route error:", error);
    // }
})



export default router;

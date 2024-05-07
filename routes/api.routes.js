import express from 'express';
import { register } from '../controller/register.js';
import { login } from '../controller/login.js';
import index from '../index.js';
import { updateUser } from '../controller/user.js'
const router = express.Router();

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

router.post('/settings/update', (req, res) => {
    updateUser(req);
    res.redirect('/settings?userUpdated');
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

router.get('/userinfo', (req, res) => {
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
        //error response.
        res.status(401).json({ error: 'Unauthorized' }); // User not logged in
    }

});

export default router
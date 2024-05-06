import express from 'express';
import { register } from '../controller/register.js'
import { login } from '../controller/login.js';
import { calculateCalories } from '../controller/calculator.js';
import { calculateBasalMetabolism } from '../controller/calculator.js';
const router = express.Router();

router.post('/register', (req, res) => {
    register(req.body, res)
    // console.log("Register:",req.body);
})

router.post('/login', (req, res) => {
    login(req, res);
    // console.log("Register:",req.body);
})


























router.post('/calculateCalories', (req, res) => {
  
    if (duration <= 0 || isNaN(caloriesBurned)) {
        res.status(400).send('Invalid input: Please enter a valid duration greater than 0.');
    } else {
        calculateCalories(req.body)
        res.json({ caloriesBurned: caloriesBurned.toFixed(2) });
    }
  });


router.post('/calculateBMR', (req, res) => {
    const { age, gender, weight } = req.body;
    const basalMetabolism = calculateBasalMetabolism(age, gender, weight);
    res.json({ basalMetabolism: basalMetabolism.toFixed(2) });
  });

  export default router
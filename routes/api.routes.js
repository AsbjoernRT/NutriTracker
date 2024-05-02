import express from 'express';
import {register} from '../controller/register.js'
const router = express.Router();

router.post('/register',(req,res)=>{
    register(req.body,res)
    // console.log("Register:",req.body);
})

export default router
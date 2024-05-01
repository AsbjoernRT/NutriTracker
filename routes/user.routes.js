import express from 'express';
import registerUser from '../functions/register.functions'

// Create a router instance
const router = express.Router();

router.route('/register')
    .post((req, res) => {
        registerUser.createUser(req, res);
        console.log(req);
    });


// //Vi eksporterer routes så de kan anvendes i controlleren
export default router;
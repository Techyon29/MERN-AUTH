import express from 'express'
import userAuth from '../MiddleWare/UserAuth.js';
import { getUserData } from '../Controllers/UserController.js';

const userrouter = express.Router();

userrouter.get("/UserData",userAuth,getUserData);


export default userrouter;
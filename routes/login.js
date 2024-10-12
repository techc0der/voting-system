const express = require('express');
const router = express.Router();
const VoterSchema = require('./../Schema/VoterSchema');
const {verifyToken,tokenGenerater} = require('./../jwt');
router.get('/profile',verifyToken,async(req,res)=>{
    try{
        const username = req.user.username;
        const response = await VoterSchema.findOne({username:username});
        if(!response){
            res.status(400).json({message:'profile of voteruser is fetch'});
            console.log("profile of voteruser is fetch");
        }
        else{
            res.status(200).json(response);
            console.log("profile is",response);
        }
    }
    catch(error){
        res.status(400).json({error:error});
        console.log("error is",error);
    }
})
router.post('/signup',async(req,res)=>{
    try {
        const data = req.body;
        const voter = new VoterSchema(data);
        const response = await voter.save();

        const user_data = {
            username : data.username,
            id : data.id
        }

        const token = tokenGenerater(user_data);
        if(!response){
            console.log('Data is not saved');
            res.status(401).json({error:'Data is not save'});
        }
        else{
            console.log('Data is saved',response);
            res.status(200).json({response,token:token});
        }  

    } catch (error) {
        res.status(500).json({error:error});
        console.log('error is',error);
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {username,password} = req.body;
        const response = await VoterSchema.findOne({username:username});
        const user_data = {
            username : response.username,
            voterId : response.VoterId
        }
        if( !user_data || !(await response.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }
        const token = tokenGenerater(user_data);
        if(!response){
            console.log('token is not fetched');
            res.status(401).json({error:'token is not fetched'});
        }
        else{
            console.log('token is fetched');
            res.status(200).json({token:token});
        }

    } catch (error) {
        res.status(500).json({error:error});
        console.log('error is',error);
    }
})

module.exports = router;
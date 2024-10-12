const express = require('express');
const router = express.Router();
const VoterSchema = require('./../Schema/VoterSchema');
const CandidateSchema = require('./../Schema/CandidateSchema');
const { verifyToken, tokenGenerater } = require('./../jwt');

router.post('/:VoterId/:CandidateId', async (req, res) => {
    try {
        const voterid = req.params['VoterId'];
        const candidateid = req.params['CandidateId'];
        const voteruser = await VoterSchema.findOne({ VoterId: voterid });
        const candidateuser = await CandidateSchema.findOne({ candidateId: candidateid });

        if (voteruser && candidateuser) {
            if (voteruser.votingChance === true) {
                // Update voter's voting chance to false
                await VoterSchema.updateOne({ VoterId: voterid }, { votingChance: false });

                // Increment the candidate's votes and update in the Candidate schema
                const updatedVotes = candidateuser.votes + 1;
                await CandidateSchema.updateOne({ candidateId: candidateid }, { votes: updatedVotes });

                console.log(`Vote cast successfully. Candidate ${candidateuser.name} now has ${updatedVotes} votes.`);
                res.status(200).json({message:`Vote cast successfully. Candidate ${candidateuser.name} now has ${updatedVotes} votes.`});
            } else {
                console.log('Voter has already cast their vote.');
                res.status(200).json({message:'Voter has already cast their vote.'});
            }
        } else {
            console.log('Voter or candidate not found.');
        }

    } catch (error) {
        console.log("error is ", error)
        res.status(500).json(error);
    }
})
router.get('/voter', async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
})
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const response = await CandidateSchema.insertMany(data)

        const user_data = {
            username: data.username,
            id: data.id
        }

        const token = tokenGenerater(user_data);
        if (!response) {
            console.log('Data is not saved');
            res.status(401).json({ error: 'Data is not save' });
        }
        else {
            console.log('Data is saved', response);
            res.status(200).json({ response, token: token });
        }

    } catch (error) {
        res.status(200).json({message:"users is exist"});
        console.log('error is', error);
    }
})
router.get('/result',async(req,res)=>{
    try {
        const response = await CandidateSchema.find({},{name:1,votes:1}).sort({votes:-1});
        if(!response){
            res.status(400).json({message:'result not fetched'});
        }
        else res.status(200).json(response);
    } catch (error) {
        console.log('error is ',error);
        res.status(500).json({error:error});
    }
})
module.exports = router;
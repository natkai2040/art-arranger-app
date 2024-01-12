import express from 'express'; 
import morgan from 'morgan'; 
import cors from 'cors'; 

const app = express(); 
const port = 4003; 
const logname = `(${process.pid}) Votes Service`

app.use(cors());
app.use(express.json());  
app.use(morgan('dev'));

const votes = {}

// Frontend Calls to contribute a vote to a Wall
app.post('/vote', async (req,res) => { 
    const votereq = req.body; // Vote Request { id: String, amount: Number}
    
    // If the Wall contains no vote property (new Wall), Add one
    if (!Object.keys(votes).includes(votereq.id)){
        votes[votereq.id] = {id: votereq.id, votes: 0 }; 
    }
    // Add amount to that Wall's vote count
    votes[votereq.id].votes = votes[votereq.id].votes + votereq.amount

    // Call event-bus with WallVoted event
    try {
        // WITH DOCKER http://event-bus:4005/events 
        // WITH NODE http://localhost:4005/events 
        // await fetch('http://localhost:4005/events', {
        await fetch('http://event-bus:4005/events', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                type:'WallVoted', 
                data: votes[votereq.id]
            })
        })
    } catch (err) {
        console.log(`${logname}: ${err}`)
        res.status(500).send({
            status: 'ERROR', 
            message: err
        })
    }

    // Send with Success
    res.status(200).send({"votes": votes[votereq.id]})
    console.log(`${logname} recieved vote request`); 
})


app.listen(port, () => {
    console.log(`${logname} is listening on port : ${port}`)
}) ;

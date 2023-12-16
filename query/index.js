import express from "express";
import cors from 'cors'; 
import Store from "./store.js";

const app = express(); 
const logname = `(${process.pid}) Query Service`
const port = 4002; 

app.use(express.json())
app.use(cors()); 

// Frontend calls route to get top 5 voted walls
app.get('/topwalls', (req, res) => {
    const storeval = Store.read(); 
    const topwalls = Object.values(storeval); 
    // Sort by Number of Votes
    const sorted = topwalls.sort((a,b) => {return b.votes - a.votes}).slice(0,5); 
    res.send(sorted); 
})

app.post('/events', (req,res) => {
    const {type, data} = req.body; 
    
    const posts = Store.read(); 
    // update list of walls 
    if (type == 'WallCreated') {
        const id = data.id; 
        posts[id] = data;  
    }

    // update votes on a wall
    if (type == 'WallVoted') { 
        const id = data.id; 
        const post = posts[id]; 
        post.votes = data.votes; 
    }

    console.log(posts)

    Store.write(posts); 
    res.send({status: 'OK'}); 
})

app.listen(port, () => {
    console.log(`${logname} is listening on port: ${port}`)
}) ;
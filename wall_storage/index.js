import express from 'express'; 
import morgan from 'morgan'; 
import cors from 'cors'; 
import { randomBytes } from 'crypto';
import Store from './store.js';

const app = express(); 
const port = 4000; 
const logname = `(${process.pid}) Wall_Storage Service`

app.use(cors());
app.use(express.json());  
app.use(morgan('dev'));

app.get('/walls', async (req,res) => { 
    const posts = Store.read(); 
    res.send(posts)
});

// app.get('/wall/:id', async (req,res) => { 
//     if (walls[req.params.id] != undefined){ 
//         res.status(200).send(walls[req.params.id]); 
//     } else {
//         res.status(404).send({"error": 'Wall Id Does Not Exist'})
//     }
// });

app.post('/walls', async (req,res) => {
    let data = req.body; 
    let id; 
    const posts = Store.read(); 

    // If no  ID, Add ID to JSON
    if (!Object.keys(req.body).includes("id")){
        console.log(logname + " Generating New ID"); 
        id = randomBytes(10).toString('hex'); 
        data = {... data, "id": id}
    } else { 
        id = req.body.id
    }

    // walls[id] = data;
    posts[id] = data;

    Store.write(posts); // write it back


    // Notify Event Bus
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
                type:'WallCreated', 
                data: data
            })
        })
    } catch (err) {
        console.log(`${logname}: ${err}`)
        res.status(500).send({
            status: 'ERROR', 
            message: err
        })
    }

    res.status(200).send(data);
    console.log(logname + "received POST request"); 
});

app.listen(port, () => {
    console.log(`${logname} is listening on port: ${port}`)
}) ;

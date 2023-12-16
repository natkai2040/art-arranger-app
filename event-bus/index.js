import express from 'express'; 
import logger from 'morgan'; 

const app = express(); 
const port = 4005; 
const logname = `(${process.pid}) Event-Bus`


app.use(logger('dev')); 
app.use(express.json()); 

const servicePorts = [
    {name: 'query', port: 4002}, 
    // {name: 'localhost', port: 4002}
];

app.post('/events', async (req, res) => {
    const event  = req.body; 
    console.log(`${process.pid} event bus received event ${event.type}`)

    for (const {name, port} of servicePorts){
        try {
            console.log(`${process.pid} event bus sending events to ${port} ${event.type}`);
            
            await fetch(`http://${name}:${port}/events`, {
                method: 'POST', 
                headers: {
                    'Content-Type':'application/json',
                }, 
                body: JSON.stringify(event)
            });
        } catch (err) { 
            console.log(err); 
        }
    }
    res.send({status: 'OK'})
}); 


app.listen(port, () => {
    console.log(`${logname} is listening on port: ${port}`)
}) ;
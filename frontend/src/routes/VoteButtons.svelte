<script>
    //edits the vote on the store.
    export let wallid; 
    
    // Vote for the given wall
    const vote = async function(event) {
        event.preventDefault(); 
        console.log(`vote() for ${wallid}`)
        // Call Votes Microservice with Voterequest as body
        try { 
            const res = await fetch('http://localhost:4003/vote', {
                method: 'POST', 
                headers:  { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: wallid, amount: 1})
            }); 

            console.log("successfully voted")
        } catch(err) { 
            // Log an Error if err
            console.log("error: " + err); 
        }
    }

</script>

<form>
    <button class="btn btn-success" on:click = {vote}>Like This Wall</button>
</form>

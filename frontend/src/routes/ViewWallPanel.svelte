<script>
    import { onMount } from "svelte";
    import { CurrentWallStore, ModeStore} from "./stores";
    import ViewImageList from "./ViewImageList.svelte";
    import VoteButtons from "./VoteButtons.svelte";

    // Default Value of the Store.
    let currentWall = {name: "New Wall", images: []}; 

    onMount(() => {
        // subscribe the CurrentWallStore to Current Wall
        // Syncs with the Canvas Element
        CurrentWallStore.subscribe((_currentWall) => {
            currentWall = _currentWall; 
        });
    });

    // Saves the Wall to the Database
    const savewall = async function (event) { 
        event.preventDefault(); 
        console.log('save wall()'); 
        try { 
            const res = await fetch('http://localhost:4000/walls', {
                "method": 'POST', 
                "headers": {
                    "content-type": 'application/json', 
                },
                body: JSON.stringify(currentWall)
            }); 
            const data = await res.json();
            console.log("Saved Wall")
        } catch (err) { 
            console.log("An Error Occurred: " + err)
        }
        ModeStore.update((mode) => {
            console.log("saveToStore: mode set to VIEW"); 
            return "view"; 
        }); 
    }

    const discardWall = function (event) {
        // Make a new wall
        event.preventDefault(); 
        CurrentWallStore.update((_currentWall) => { 
            return { 
                author: "New user",
                name: "New Wall",
                description: "(No Description)",
                votes: 0,
                background: "",
                images: [], 
                votes: 0
            }
        }); 
        console.log("discardWall: mode set to LIST"); 
        ModeStore.update((mode) => { 
            return "list"; 
        })
    }

</script>
<div class="container">
    <h1>{currentWall.name}</h1>
    <div class="border">
        {currentWall.description}
    </div>
    <h2>Images</h2>
    <ViewImageList/>

    {#if currentWall.id != undefined}
        <VoteButtons wallid={currentWall.id}/>
    {/if}
    <form>
        <!-- <button class="btn btn-primary" on:click={savewall}>Edit Wall</button> -->
        <button class="btn btn-light" on:click={discardWall}>List of Walls</button>
    </form>
</div>

<style> 

</style>
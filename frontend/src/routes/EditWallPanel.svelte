<script>
    import { onMount } from "svelte";
    import AddImage from "./AddImage.svelte";
    import { CurrentWallStore, ModeStore} from "./stores";
    import EditImageList from "./EditImageList.svelte";
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
    <h1>Edit: {currentWall.name}</h1>
    Wall Name:
    <input type="text" placeholder="Wall Name" bind:value={currentWall.name}/>
    <form>
        <div>Wall Description:</div>
        <textarea rows="5" cols="80" type="text" placeholder="Wall Description" bind:value={currentWall.description}/>
        <EditImageList/>
        <AddImage/>
    </form>
    <button class="btn btn-primary" on:click={savewall}>Save Wall</button>
    <button class="btn btn-light" on:click={discardWall}>Discard Changes</button>
</div>

<style> 

</style>
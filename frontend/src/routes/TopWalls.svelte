<script>
    import { onMount } from "svelte";
    import { CurrentWallStore, ModeStore } from "./stores";

    let topwalls = []; 

    const refreshTopwalls = async function () {
        // get the current top walls to display
        try { 
            const res = await fetch('http://localhost:4002/topwalls'); 
            const data = await res.json();
            // assign the db's topwalls to local variable
            topwalls = data;
            console.log("Refresh Topwalls(): " + topwalls)
        } catch (err) { 
            console.err("An Error Occurred: " + err)
        }
    }

    onMount( async () => { 
        // Refresh Top Walls
        refreshTopwalls(); 
    }); 

    // When a wall is clicked to be viewed/edited
    const edit_wall = function (wall) {
        // Refresh Top Walls, Because the Current Wall is still in the store.
        refreshTopwalls(); 
        console.log("Edit_wall(): " + wall.name); 
        // Make Wall the current Wall
        CurrentWallStore.update((_currentwall) => {
            return wall; 
        }); 
        // Change to Edit Mode
        console.log("Edit_wall: mode set to EDIT"); 
        ModeStore.update((mode) => {
            return "edit"; 
        }); 
    }

    // When a wall is clicked to be viewed/edited
    const view_wall = function (wall) {
        // Refresh Top Walls, Because the Current Wall is still in the store.
        refreshTopwalls(); 
        console.log("View_wall(): " + wall.name); 
        // Make Wall the current Wall
        CurrentWallStore.update((_currentwall) => {
            return wall; 
        }); 
        // Change to Edit Mode
        console.log("view_wall: mode set to VIEW"); 
        ModeStore.update((mode) => {
            return "view"; 
        }); 
    }

</script>

<div class="border">
    <h1>Top Voted Walls</h1>
    <ol>
        {#each topwalls as wall (wall.id)}
            <li>
                <div>
                    {wall.name} - Votes: {wall.votes}
                </div>
                <div>
                    <button on:click={() => {view_wall(wall)}}>View Wall</button>
                    <button on:click={() => {edit_wall(wall)}}>Edit Wall</button>
                </div>
            </li>
        {/each}
    </ol>
</div>


<style>
    .border{
        border: solid gray 4px; 
    }
</style>
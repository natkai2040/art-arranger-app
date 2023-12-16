<script>
    import CurrentImageList from "./CurrentImageList.svelte";
import TopWalls from "./TopWalls.svelte";
    import { CurrentWallStore, ModeStore } from "./stores";


    
    const makeWall = function (){
        // Make a new wall
        CurrentWallStore.update((_currentWall) => { 
            return { 
                author: "Anynomous",
                name: "New Wall",
                description: "",
                votes: 0,
                background: "",
                images: []
            }
        }); 
        ModeStore.update((mode) => { 
            return "edit"; 
        })
    }

</script>

<div class="container">
    <div class="container">
        <h1>Welcome to Art-Arranger!</h1>
        <div>
            This is a site for creating nice-looking painting arrangements. <br>
            Make a new wall, or view the top-voted walls!
        </div>
        <button class="btn btn-primary" on:click={makeWall}>Make a Wall</button>
    </div>
    <div class="container">
        <TopWalls/>
    </div>
</div>

<style>
    .container{
        margin: 24px;
    }
</style>


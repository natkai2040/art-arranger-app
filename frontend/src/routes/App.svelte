<script>
    import Wall from "./Wall.svelte";
    import TopWalls from "./TopWalls.svelte";
    import { onMount } from "svelte";
    import { CurrentWallStore } from "./stores.js";
    import SidePanel from "./SidePanel.svelte";

    const wall = { 
                author: "New user",
                name: "New Wall",
                description: "(No Description)",
                votes: 0,
                background: "",
                images: [], 
                votes: 0
            }; 

    onMount(() => {
        CurrentWallStore.update(() => {
            return wall; 
        });
    });

</script>
<!-- <div class="top_bar"></div> -->
<div class="side_by_side text-light">
    <Wall/>
    <SidePanel/>
</div>

<style> 
    /* .top_bar{
        width: 100%;
        background-color: olive;
    } */
    .side_by_side{
        display: flex; 
        flex:1; 
        flex-direction: row;
    }
</style>
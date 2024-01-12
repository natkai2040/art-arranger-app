<script>
    // Either Displays View or EditWall Panel
    import EditWallPanel from "./EditWallPanel.svelte";
    import ViewWallPanel from "./ViewWallPanel.svelte";
    import WallList from "./WallList.svelte";

    import { ModeStore } from "./stores";
    
    let EditOrView = "list";

    console.log("Sidepanel opened"); 
    ModeStore.subscribe((mode)=>{ 
        EditOrView = mode; 
    }); 

</script>

{#if EditOrView == "view"}
    <ViewWallPanel/>
{:else if EditOrView == "edit"}
    <EditWallPanel/>
{:else if EditOrView == "list"}
    <WallList/>
{:else}
    <button on:click={() => {EditOrView = "view"}}>ViewMode</button>    
{/if}
<script>
    // Either Displays View or EditWall Panel
    import EditWallPanel from "./EditWallPanel.svelte";
    import ViewWallPanel from "./ViewWallPanel.svelte";
    import { ModeStore } from "./stores";
    
    let EditOrView = "view";

    ModeStore.subscribe((mode)=>{ 
        EditOrView = mode; 
    }); 

</script>

{#if EditOrView == "view"}
    <ViewWallPanel/>
{:else if EditOrView == "edit"}
    <EditWallPanel/>
{:else}
    <button on:click={() => {EditOrView = "view"}}>ViewMode</button>
    <button on:click={() => {EditOrView = "edit"}}>Editmode</button>
{/if}
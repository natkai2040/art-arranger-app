<script>
    import { CurrentWallStore } from "./stores.js";
    let images = [];
    CurrentWallStore.subscribe((_currentWall) => { 
        if (_currentWall.images != undefined) {
            images = _currentWall.images; 
            console.log(images); 
        }
    }); 

    // Called when the X,Y,Height,Width of an image is changed in the sidebar
    const changeImage = function (event) { 
        event.preventDefault()
        console.log("change image")
        CurrentWallStore.update((_currentWall) => { 
            // Change the Images in the store to reflect the next X,Y,H,W
            _currentWall.images = images; 
            return _currentWall; 
        }); 
    }
</script>

    <div class="border image_card_container">
        {#each images as img (img.id)}
        <div>
            {img.name}
            <form on:submit={changeImage}>
                <div class = "grid">
                    x: <input type="number" bind:value={img.x}>
                    y: <input type="number" bind:value={img.y}>
                    height: <input type="number" bind:value={img.height}>
                    width: <input type="number" bind:value={img.width}>
                </div>
                <button on:click={changeImage}>Change Image</button>
            </form>
        </div>
        {/each}
    </div>
    
<style>
    .grid { 
        display: grid;
        grid-template-columns: 1fr 1fr
    }
    .image_card_container { 
        height: 200px; 
        overflow-y: auto; 
        display: flex;
        flex: 1; 
        flex-wrap: wrap;
    }
    .border{
        border: solid lightcoral 4px;
    }
</style>
<script>
    import { CurrentWallStore } from "./stores.js";
    let images = []; // Array of Images

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
        console.log("updating store")
        CurrentWallStore.update((_currentWall) => { 
            // Change the Images in the store to reflect the next X,Y,H,W
            _currentWall.images = images; 
            return _currentWall; 
        }); 
    }

    // deletes image from the store based on imgID

</script>

    <div class="border image_card_container">
        {#each images as img (img.id)}
        image: {img.name}
        <div>
            <img src={img.url} height={img.height} width={img.width}/>
        </div>
        {/each}
    </div>
    

<style>
    .grid { 
        display: grid;
        grid-template-columns: 1fr 1fr
    }
    .image_card_container { 
        height: 50%; 
        overflow-y: auto; 
        display: flex;
        flex: 1; 
        flex-wrap: wrap;
    }
    .border{
        border: solid lightcoral 4px;
    }
</style>
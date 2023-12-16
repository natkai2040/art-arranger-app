<script>
    import { CurrentWallStore } from "./stores.js";
    let shown_urls = []; 
    let searchterm  = ""; 
    
    async function searchForImages(event) {
        event.preventDefault(); 
        const maxImages = 10; 
        // search for the searchterm
        const resData = await fetch(`http://localhost:4001/imagesearch/${searchterm}/${maxImages}`); 
        const data = await resData.json();
        // Display images
        shown_urls = data; 
        searchterm = ""; 
    }

    // Adds 
    function addImageFromUrl(url) {
        console.log("add image" + (url)) 
        CurrentWallStore.update((_currentWall) => {
            let name = "img" + (_currentWall.images.length + 1); 
            let id = crypto.randomUUID()
            _currentWall.images.push({name: name, id: id, url: url,x: 0, y: 0, width:200, height:200, })// default image
            return _currentWall; 
        })
    }
    
</script>

<div class="border">
    <div>
        <h2>Add Images to Wall</h2>
        <form>
            <input type="string" placeholder="Search for Image: eg. 'cat'" bind:value = {searchterm}/>
            <button on:click={searchForImages}>Search</button>
        </form>
    </div>
    
    <div class="image_card_container border">
        {#each shown_urls as url (url)}
            <div class="image_card">
                <img class="thumbnail" src={url} alt={url}/>
                <form>
                    <button on:click={(event) => {event.preventDefault(); addImageFromUrl(url);}}>Add This Image</button>
                </form>
            </div>
        {/each}
    </div>
</div>



<style> 
    .image_card_container { 
        height: 300px; 
        overflow-y: auto; 
        display: flex;
        flex: 1; 
        flex-wrap: wrap;
    }
    .image_card {
        margin: 4px;
    }
    .thumbnail {
        width: 200px; 
        height: 200px; 
    }
    .border {
        border: solid lightskyblue 4px;
    }
</style>
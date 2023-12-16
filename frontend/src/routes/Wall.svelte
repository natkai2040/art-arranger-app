<script>
    import { onMount } from "svelte";
    import {CurrentWallStore} from './stores.js'
    let currentWall; 
    const shadowColor = '#707070'; 
    const backgroundColor = '#B3AA89';
    const backgroundImages = [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
        'https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'   
    ]
   
    let canvas; 
    let context;
    let images = []; 
    let dataURL = ""; 
    
    // HELPER FUNCTIONS //
    let is_dragging = false; 
    let offset_x; 
    let offset_y;
    let startX;
    let startY; 
    let current_shape_index = null; 
    let canvas_width ; 
    let canvas_height; 

    const draw_shapes = function() {
        console.log("Begin DrawShape()")
        canvas_width = canvas.width; 
        canvas_height = canvas.height; 

        context = canvas.getContext("2d"); 
        context.clearRect(0,0, canvas_width,canvas_height);  

        // console.log("IMAGES: " + JSON.stringify(images)); 
        
        for (let img of images){ 
            const img_elem = document.createElement("img"); // create a new image element
            img_elem.src = img.url;
            img_elem.setAttribute('crossorigin', 'anonymous');
            
            img_elem.onload = () => {
                context.fillStyle = shadowColor; 
                context.fillRect(img.x+2,img.y+2,img.width,img.height);
                context.drawImage(img_elem, img.x, img.y, img.width, img.height); 
            };
        }
        console.log("End DrawShape()")
    }

    CurrentWallStore.subscribe((_currentWall) => {
        console.log("Subscribed");
        currentWall = _currentWall;
        images = currentWall.images; 
        console.log("WallStore: " + JSON.stringify(currentWall)); 
        console.log("WallStore Canvas:  " + canvas); 
        if (canvas != undefined) { // Sometimes Store Occurs First, Sometimes onMount
            draw_shapes(); 
        }
    }); 
    
    // Triggered When Done Dragging Image // 
    // Does not save to database // 
    const saveToStore = function() { 
        CurrentWallStore.update((_currentWall) =>{ 
            return currentWall; 
        }); 
    }

    const savetoUrl = function() { 
        dataURL = canvas.toDataURL('image/png', 1.0)
        var image = dataURL.replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
        window.location.href=image; // it will save locally
        console.log(dataURL); 

    }

    onMount(async () => {
        context = canvas.getContext("2d");
        if (images == undefined) { // Sometimes Store Occurs First, Sometimes onMount
            images = [
                {url: "https://www.artic.edu/iiif/2/ea8c5d62-6ce8-88e8-feb1-e0053cf534c5/full/843,/0/default.jpg", x:1, y: 1, width:1, height:1, name: "img1" }
            ]; 
        }
        // Sets Canvas Size to Square
        canvas.height = window.innerHeight - 32
        canvas.width =  canvas.height
        // canvas.width = window.innerWidth - 40

        // Save to Variables
        canvas_width = canvas.width; 
        canvas_height = canvas.height; 
        
        // Set Canvas Style on Load
        canvas.style.border = '5px solid #C8C8C8'; 
        canvas.style.backgroundColor = backgroundColor;
        canvas.style.backgroundImage = `url(${backgroundImages[1]})`;
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundAttachment ='scroll';
        canvas.style.backgroundSize = 'cover';

        // If the Canvas is Offset on the Page, Get info for pointer
        function get_offset() { 
            let canvas_offsets = canvas.getBoundingClientRect();
            offset_x = canvas_offsets.left; 
            offset_y = canvas_offsets.top; 
        }

        get_offset(); 

        // changes shape if deleted;
        window.onscroll = function() {get_offset();}
        window.onresize = function() {get_offset();}
        canvas.onresize = function() {get_offset();}
        
        // Assign canvas functions
        canvas.onmousedown = mouse_down; 
        canvas.onmouseup = mouse_up;
        canvas.onmouseout = mouse_out; 
        canvas.onmousemove = mouse_move; 

        // DEFINE MOUSE FUNCTIONS
        function is_mouse_in_shape(x,y,shape) {
            let shape_left = shape.x; 
            let shape_right = shape.x+shape.width; 
            let shape_top = shape.y; 
            let shape_bottom =shape.y+shape.height; 

            if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom){
                return true; 
            }
            return false; 
        }

        function mouse_down(event) { 
            event.preventDefault(); //default action that belongs to the event will not occur
            startX = parseInt(event.clientX - offset_x); 
            startY = parseInt(event.clientY - offset_y);
            let index = 0; 
            // Makes Current Shape Index Equal to One Shape
            for (let shape of images) {
                if (is_mouse_in_shape(startX,startY,shape)){
                    current_shape_index = index; 
                    is_dragging = true;
                    return; 
                }
                else {
                }
                index++; 
            }
        }

        function mouse_up(event){ 
            if (!is_dragging){
                return; 
            }
            event.preventDefault(); 
            current_shape_index = 0; 
            is_dragging = false; 
            // Saves Current Image Configuration to Store
            saveToStore(); 
            console.log("DONE DRAGGING")
        }
        function mouse_out(){
            console.log("MOUSE OUT")
        }
        function mouse_move(event){
            if (!is_dragging){
                return; 
            } else if (is_dragging) {
                event.preventDefault();
                let mouseX = parseInt(event.clientX - offset_x); // correct for offset
                let mouseY = parseInt(event.clientY - offset_y);
                let dx = mouseX - startX; 
                let dy = mouseY - startY; 
                let current_shape = images[current_shape_index]; // change shape dragged            
                console.log("current shape is " + current_shape.name);
                current_shape.x += dx; 
                current_shape.y += dy; 
                draw_shapes();
                startX = mouseX; 
                startY = mouseY; 
            }
        }
        
        // Draw Shapes on Load
        draw_shapes(); 
    }); 
    
    
</script> 


<div class="canvas_container">
    <canvas bind:this={canvas} id="canvas"></canvas>
    <!-- <div>
        image URL:
        <a href="url">{dataURL}</a>
        <button on:click={savetoUrl}>Save to URL</button>
    </div> -->
</div>

<style>
    .canvas_container{
        margin: 16px; 
        padding: 0px;
    }
</style>
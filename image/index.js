import express from 'express'; 
import morgan from 'morgan'; 
import winston from 'winston'; 
import cors from 'cors';

const app = express(); 
const port = 4001; 
const key = "OxFi0C5Cj41qls6zecks29U6NSfEyyXcLmyQRlah"
const logname = `(${process.pid}) Image Search Service`

app.use(express.json());  
app.use(cors());
app.use(morgan('dev'));

// Searches for Random Images. Limit Count
app.get('/randomimage/:count', async (req,res) => { 
    let count = req.params.count; 
    let imageURL = await imagefetch("", count); 
    res.send(imageURL);
});

// Searches for a Image based on search term. Limit Count
app.get('/imagesearch/:searchterm/:count', async (req,res) => { 
    let count = req.params.count; 
    let searchterm = req.params.searchterm;
    let imageURL = await imagefetch(searchterm, count); 
    console.log(`${logname} received image query with term: ${searchterm}`)
    res.send(imageURL);
});

//`https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&limit=${limit}&fields=id,title,image_id`

const imagefetch = async (searchterm, num_requested) => {
    const limit = 10; // ABSOLUTE LIMIT SEARCH SIZE
    let fetchurl; 
    console.log("searchterm: " + searchterm); 
    if (searchterm == "" || searchterm == undefined){ 
        fetchurl  = `https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&limit=${limit}&fields=id,title,image_id`
    } else {
        fetchurl = `https://api.artic.edu/api/v1/artworks/search?q=${searchterm}&query[term][is_public_domain]=true&limit=${limit}&fields=id,title,image_id`
    }
    console.log("fetch: " + fetchurl); 
    // Chicago Database Search for Image Data 
    const res = await fetch(fetchurl);
    const resData = await res.json(); 

    // URL Root changes based on Image Data
    const urlroot = resData["config"]["iiif_url"]; 
    const urlend = '/full/843,/0/default.jpg'; 

    // Get the total result count as minimum of returned images and num requested
    const totalResults = Math.min(num_requested, resData.data.length);

    const url_list = []; 
    
    // Create the URL for each image less than totalResults
    for (let i = 0; i < totalResults; i++){
        // get the image id
        const image_id = resData["data"][i]["image_id"]; 
        // add the final URL to results
        if (image_id != null){ // sometimes image_id is null
            url_list.push(urlroot + '/' + image_id + urlend); 
        }
    }
    return url_list;
}

app.listen(port, () => {
    console.log(`${process.pid} Image Service is listening on port : ${port}`)
}) ;
import fs from 'fs'; 

const read = () => { 
    if (fs.existsSync('walls.json')) {
        const walls = fs.readFileSync('walls.json'); 
        return JSON.parse(walls); 
    } else {
        return ({}); 
    }
}

const write = (walls) => {
    fs.writeFileSync('walls.json',JSON.stringify(walls)); 
}

const drop  = () => {
    if (fs.existsSync('walls.json')) {
        fs.unlinkSync('walls.json'); // nodes version on deeleting a fil
    }
}; 

export default {
    read, 
    write, 
}

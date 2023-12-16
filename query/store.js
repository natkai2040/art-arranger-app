import fs from 'fs'; 

const read = () => { 
    if (fs.existsSync('query.json')) {
        const query = fs.readFileSync('query.json'); 
        return JSON.parse(query); 
    } else {
        return ({}); 
    }
}

const write = (query) => {
    fs.writeFileSync('query.json',JSON.stringify(query)); 
}

const drop  = () => {
    if (fs.existsSync('query.json')) {
        fs.unlinkSync('query.json'); // nodes version on deeleting a fil
    }
}; 

export default {
    read, 
    write, 
    drop
}
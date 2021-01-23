const express = require('express');
const app = express();
const fs= require('fs');
const fileUpload = require('express-fileupload');
const deleteFolder = require('folder-delete');

app.use(fileUpload({createParentPath: true}));
app.use(express.static('client'));

var AllPlaces= JSON.parse(fs.readFileSync('AllPlaces.json', (err, data)=>{
    if(err){console.log(err);}
}));


function getRecentPlaces(){                                          //Returns dictionary of last 3 places and respective image paths
    let FilePaths={};
    
    let n= Object.keys(AllPlaces).length - 3
    if(n!=-3){
        let limit= n+3
        if(n<0){n=0;}
        for(i= n; i<limit; i++){
            let place= Object.keys(AllPlaces)[i];
            FilePaths[place]= fs.readdirSync("client/userimages/"+place);
        }
        return FilePaths;
    }
    else{ return {}}
}


app.get('/allplaces', (req, resp)=>{

    let AllFilePaths= {};
    for(place of Object.keys(AllPlaces)){
        AllFilePaths[place] = fs.readdirSync("client/userimages/"+place);
    }   
    resp.json(AllFilePaths);
})

app.get('/recent', function(req, resp){
    resp.json(getRecentPlaces());
})

app.post('/upload', function(req, resp){                    //ADD NEW PLACE

    let x= JSON.stringify(req.files.images.length);
    if(x==undefined) {x=1;} 

    if(AllPlaces[req.body.name]!=undefined){
        resp.send('Place already added');}      //If place has been added before     
    else{
    AllPlaces[req.body.name]= parseInt(x);
    fs.writeFile('AllPlaces.json', JSON.stringify(AllPlaces), (err)=>{if(err){console.log(err);}});

    for(i=0; i<x; i++){
        currentImage= req.files.images[i];
        if(x==1){ currentImage=req.files.images;}         //If there's only one image         
        uploadPath= 'C:\\Users\\rathi\\Desktop\\app\\client\\userimages\\'+req.body.name+'\\'+Date.now()+currentImage.name;

        currentImage.mv(uploadPath, function(err){
            if(err) {return resp.status(500).send(err);}
        })
    }
    resp.send("Files uploaded");
 }
})

app.get('/place/:placename', function(req, resp){
    let images= fs.readdirSync("client/userimages/"+req.params.placename);
    resp.json(images);
})

app.delete('/delete/:place', (req, resp)=>{
    let placename= req.params.place;
    deleteFolder('client/userimages/'+placename, {debugLog: false});
    delete AllPlaces[placename];
    fs.writeFile('AllPlaces.json', JSON.stringify(AllPlaces), (err)=>{if(err){console.log(err);}});
    resp.send("");
})

app.get('/allplaceslist', (req, resp)=>{
    resp.json(Object.keys(AllPlaces));
})

module.exports = app;
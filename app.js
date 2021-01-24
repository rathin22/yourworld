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


function getRecentPlaces(){                                       //Returns dictionary of last 3 places and respective image names
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

function GetAllFilePaths(){          //Creates dictionary with keys as place names and a list of their image names as value
    let AllFilePaths= {};
    for(let place of Object.keys(AllPlaces)){
        AllFilePaths[place] = fs.readdirSync("client/userimages/"+place);
    }
    return AllFilePaths;
}


app.get('/allplaces', (req, resp)=>{        //Returns dictionary of place names and their image names
    resp.json(GetAllFilePaths());
})

app.get('/recent', function(req, resp){    
    resp.json(getRecentPlaces());
})

app.post('/upload', function(req, resp){                     //ADD NEW PLACE

        if(req.body.name && req.files){
            let x= JSON.stringify(req.files.images.length);
            if(x==undefined) {x=1;} 
            if(AllPlaces[req.body.name]==undefined){ AllPlaces[req.body.name]= parseInt(x); }
            else{
                AllPlaces[req.body.name]= AllPlaces[req.body.name]+ parseInt(x);
            }
            fs.writeFile('AllPlaces.json', JSON.stringify(AllPlaces), (err)=>{if(err){console.log(err);}});

            for(let i=0; i<x; i++){
                currentImage= req.files.images[i];
                if(x==1){ currentImage=req.files.images;}         //If there's only one image         
                uploadPath= 'C:\\Users\\rathi\\Desktop\\app\\client\\userimages\\'+req.body.name+'\\'+Date.now()+currentImage.name;

                currentImage.mv(uploadPath, function(err){
                if(err) {return resp.status(500).send(err);}
                })
            }
            resp.json(AllPlaces);
        }
        else{ resp.sendStatus(400);}
})

app.get('/place/images/:placename', function(req, resp){                           //Returns list of image names of specified place
    let images= fs.readdirSync("client/userimages/"+req.params.placename);
    resp.json(images);
})

app.delete('/delete/:place', (req, resp)=>{
    let placename= req.params.place;
    if(AllPlaces[placename]==undefined)
    {resp.sendStatus(400);}
    else{
        deleteFolder('client/userimages/'+placename, {debugLog: false});
        delete AllPlaces[placename];
        fs.writeFile('AllPlaces.json', JSON.stringify(AllPlaces), (err)=>{if(err){console.log(err);}});
        resp.json(AllPlaces);
    }
})

app.get('/allplaceslist', (req, resp)=>{
    resp.json(Object.keys(AllPlaces));
})
app.get('/allpictures', (req, resp)=>{                               //returns list of all pictures currently uploaded
    let allpictures=[];
    let AllFilePaths = GetAllFilePaths();
    for(let place of Object.keys(AllFilePaths)){
        for(let image of AllFilePaths[place]){
            allpictures.push(image);
        }
    }
    resp.json(allpictures);
})

app.get('/place/numofimages/:placename', (req, resp)=>{
    resp.send(AllPlaces[req.params.placename].toString());
});

module.exports = app;
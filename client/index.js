var myStorage= window.sessionStorage;
var homepage= document.getElementById('homepage');
var placepage= document.getElementById('placepage');
var allplacespage= document.getElementById('allplacespage');

function setStorage(hp, pp, app){                       //function for saving state of page
    //myStorage.setItem('homepage', hp);
    //myStorage.setItem('placepage', pp);
   // myStorage.setItem('allplacespage', app);
}

function ChangeDisplay(hp, pp, app)
{  
    homepage.style.display = hp;
    placepage.style.display = pp;
    allplacespage.style.display=app;
}

function fillAllPlaces(AllFilePaths){                                       //Generating the All Places page
    document.getElementById('allplacesbody').innerHTML="";        //Clearing any previous content
    if(Object.keys(AllFilePaths).length==0){document.getElementById('noplaces2').style.display="block";}
    else{
    document.getElementById('noplaces2').style.display="none";
    for(let place in AllFilePaths){
        let title= document.createElement("h2");
        title.innerHTML=place;
        title.className="typoldlight placetitle";
        title.style= "font-size: 30pt; color: white; display: inline-block;"
        title.setAttribute("role", "button");
        let container= document.createElement("div");
        container.style="background-color: rgb(255, 186, 214); border-radius: 6px; width: fit-content";
        container.className="mb-4 p-3";
        let n=1;
        for(image of AllFilePaths[place]){
            
            if(AllFilePaths[place].length>4 && n==4){
                let extraimages= parseInt(AllFilePaths[place].length)-3;                //If last image needs to be blurred
                container.insertAdjacentHTML('beforeend', "<div class='blurimgcontainer' style='display: inline-block;'> <img src='userimages/"+place+"/"+image+"' style= 'max-height:200px; filter: blur(3px);'><div class='centertext'> +"+extraimages+"</div> </div>");
            }
            else{
                container.insertAdjacentHTML('beforeend', "<img src='userimages/"+place+"/"+image+"' style= 'max-height:200px; margin-right:20px;'>");
            }
            n++;
            if(n>4){break;}
        }


        document.getElementById('allplacesbody').insertAdjacentElement("beforeend", title);
        document.getElementById('allplacesbody').insertAdjacentElement('beforeend', container);
    }
    GenerateIndividualPlaceContent(allplacespage);
    }
}

async function loadhomepage(){
    let response= await fetch('http://127.0.0.1:8090/recent');
    let places = await response.json();
    FillRecentPlaces(places);
}
loadhomepage();

document.addEventListener("DOMContentLoaded", function(event) {         //For making file input dynamic
    bsCustomFileInput.init();
});
document.getElementById('allplacesbutton').addEventListener('click', async (event)=>{           //Fetching for all places page
    ChangeDisplay("none","none","block");
    
    let response= await fetch('/allplaces')
    let AllFilePaths= await response.json();
    
    fillAllPlaces(AllFilePaths);
    
    event.target.style="font-weight: 1000;";                             //Nav bar text bold
    document.getElementById('homebutton').style="";                      //nav bar text
    
    //setStorage('none', 'none', 'block');
})
document.getElementById('homebutton').addEventListener('click', (event)=>{
    loadhomepage();
    ChangeDisplay('block','none','none');
    
    GenerateIndividualPlaceContent(homepage);
    event.target.style="font-weight: 1000;";
    document.getElementById('allplacesbutton').style="";

    //setStorage('block','none', 'none');
})
function FillRecentPlaces(places){                                              //Function that fills the Recent Places section
    let NumOfPlaces= Object.keys(places).length
    if(NumOfPlaces==0){
        document.getElementById('noplaces').style.display="block";
        document.getElementById('allcards').style.display="none";
    }
    else {
        document.getElementById('allcards').style.display="block";
    if (NumOfPlaces==1) {
        document.getElementById('noplaces').style.display="none";
        document.getElementById('card1').style.display='block';
        document.getElementById('card2').style.display='none';
        document.getElementById('card3').style.display='none';
    }
    else if (NumOfPlaces==2) {
        document.getElementById('noplaces').style.display="none";
        document.getElementById('card1').style.display='block';
        document.getElementById('card2').style.display='block';
        document.getElementById('card3').style.display='none';
        
    }
    else{
        document.getElementById('noplaces').style.display="none";
        document.getElementById('card1').style.display='block';
        document.getElementById('card2').style.display='block';
        document.getElementById('card3').style.display='block';
    } }

    let n=1;

        for(let i=NumOfPlaces-1; i>=0; i--){                                        //Adding title and images of each card
            let place= Object.keys(places)[i]
            document.getElementById('card'+n+'title').innerHTML=place;
            let rows = document.querySelectorAll('.row'+n)
            for(row of rows){                                                       //Clearing out stuff already in rows
                row.innerHTML="";
            }
            if(places[place].length>=4){                                                 //If atleast 3 images are there
                let col1 = document.createElement('div');
                let col2 = document.createElement('div');
                let col3 = document.createElement('div');
                let col4 = document.createElement('div');

                let columns= [col1, col2, col3, col4];
                for(j=0; j<4; j++){
                    columns[j].className="col-6";
                    columns[j].style="background-image: url('userimages/"+place+"/"+places[place][j]+"'); background-repeat: no-repeat; height: 150px; background-position-x: center;"
                }

                rows[0].append(col1);
                rows[0].append(col2);
                rows[1].append(col3);
                rows[1].append(col4);
            }
            if(places[place].length==3){                                                 //If atleast 3 images are there
                let col1 = document.createElement('div');
                let col2 = document.createElement('div');
                let col3 = document.createElement('div');

                let columns= [col1, col2, col3];

                for(j=0; j<3; j++){
                    columns[j].className="col-6";
                    columns[j].style="background-image: url('userimages/"+place+"/"+places[place][j]+"'); background-repeat: no-repeat; height: 150px; background-position-x: center;"
                }
                columns[2].className="col-12";
                rows[0].append(col1);
                rows[0].append(col2);
                rows[1].append(col3);

            }

            else if(places[place].length==1) {                                           //If only 1 image is there
                let col1= document.createElement('div');
                col1.className="col-12";
                col1.style="background-image: url('userimages/"+place+"/"+places[place][0]+"'); background-repeat: no-repeat; height: 200px; background-position-x: center; background-size: contain;";
                rows[0].append(col1);
            }

            else if(places[place].length==2) {                                           //If only 2 images are there
                let col1= document.createElement('div');
                let col2= document.createElement('div');
                col1.className="col-12";
                col1.style="background-image: url('userimages/"+place+"/"+places[place][0]+"'); background-repeat: no-repeat; height: 200px; background-position-x: center; background-size: contain;";
                col2.className="col-12";
                col2.style="background-image: url('userimages/"+place+"/"+places[place][1]+"'); background-repeat: no-repeat; height: 200px; background-position-x: center; background-size: contain;";
                rows[0].append(col1);
                rows[1].append(col2);
            }
            n= n+1;
        }
}

function RemoveSuccessMsg(msg){
    msg.style.display="none";
}

document.getElementById("form").addEventListener('submit', async function(event){         //ADDING A NEW PLACE
   event.preventDefault();

    const formData= new FormData();

    formData.append('name', document.getElementById('placename').value);
    
    const filesField= document.getElementById('images');
    
    for(let i=0; i<filesField.files.length; i++){
    formData.append('images', filesField.files[i]);
    }
    console.log(Object.keys(formData));
    console.log(Object.values(formData));
    for(let key of formData.keys()){
        console.log(key);
        console.log("Value: "+formData.getAll(key));
    }
    let response = await fetch('/upload', {method: 'POST', body: formData});
    let res= await response.text();

    if(homepage.style.display=="block"){
        let successmsg= document.getElementById('homesuccessmessage')
        successmsg.style.display="block";
        GenerateRequiredPageContent();
        window.setTimeout(function(){RemoveSuccessMsg(successmsg);},5000);         //Removes msg after 5 seconds
    }
    else {
        let successmsg= document.getElementById('allplacessuccessmessage')
        successmsg.style.display="block";
        GenerateRequiredPageContent();
        window.setTimeout(function(){RemoveSuccessMsg(successmsg);},5000);          //Removes msg after 5 seconds
        
    }
    document.getElementById('close').click();
    document.getElementById('form').reset();
    
})

async function GenerateRequiredPageContent()       //Used to generate the content of the page again after a place has been added or deleted
{   if(homepage.style.display=="block"){
        let resp= await fetch('http://127.0.0.1:8090/recent');
        let places = await resp.json();
        FillRecentPlaces(places);
    }
    else {
        let resp2= await fetch('http://127.0.0.1:8090/allplaces');
        let allplaces= await resp2.json();
        fillAllPlaces(allplaces);
    }
}
GenerateIndividualPlaceContent(homepage);
function GenerateIndividualPlaceContent(backdestination){           //Making card titles clickable and generating respective content

    for(element of document.querySelectorAll('.placetitle')){
        element.addEventListener('click', async function(event){
            ChangeDisplay('none', 'block', 'none');
            let placename= event.target.textContent;
            document.getElementById('place').innerHTML = placename;

            let response= await fetch('/place/images/'+placename);
            let images= await response.json();
            let n=1;
            for(let i=1; i<4; i++){
                document.getElementById('column'+i).innerHTML="";
            }
            for(image of images){
                let column= document.getElementById('column'+n);
                column.insertAdjacentHTML('beforeend',"<img src='userimages/"+placename+"/"+image+"' style='border: 4px solid white'>");
                n=n+1;
                if(n>3){n=1;}
            }
            /*
            myStorage.setItem('allplacespage', 'none');
            myStorage.setItem('homepage', 'none');
            myStorage.setItem('placepage', 'block');
            SEE IF SAVING PAGE STATE ON PLACE PAGE IS POSSIBLE
            */
        })
    }
    document.getElementById('backtohome').onclick= function(){ backbutton(backdestination);  };
}
function backbutton(destination){
    placepage.style.display="none";
    destination.style.display="block";
}

document.getElementById('delete').addEventListener('click', async (event)=>{
    let placename= document.getElementById('place').textContent;
    let response= await fetch('http://127.0.0.1:8090/delete/'+placename, {
        method: 'delete'
    });
    document.getElementById('backtohome').click();
    GenerateRequiredPageContent();
})
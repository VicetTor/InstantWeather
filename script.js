const validation = document.getElementById("ville");
const entree = document.getElementById("codePost");
const boutonDeValidation = document.getElementById("validation");
const infosPrincipales = document.getElementById("infosPrincipales");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const probaPluie = document.getElementById("probaPluie");
const heureSol = document.getElementById("heureSol");
const nomCommune = document.getElementById("nomCommune");
const heureActuelle = document.getElementById("heureActuelle");
const indicationVille = document.getElementById("indicationVille");
const codePostal = document.getElementById("codePostal");
const titre = document.getElementById("titre");
const revenirArriere = document.getElementById("revenirArriere");
const ciel = document.getElementById("ciel");
const descriptionCiel = document.getElementById("descriptionCiel");
const temperatureActuelle = document.getElementById("temperatureActuelle");
const erreurCodePostal = document.getElementById("erreurCodePostal");
const contenu = document.getElementById("contenu");

const body = document.body;
const donneesSupplementaires = document.getElementById("donneesSupplementaires");
const latitude = document.getElementById("lat");
const cumulPluie = document.getElementById("cupluie")
const longitude = document.getElementById("long");

const ventMoyen = document.getElementById("vemoy");
const directionVent = document.getElementById("dirvent");
const parametres = document.getElementById("parametres");
const formulaire = document.getElementById("formulaire");
const annuler = document.getElementById("annuler");

const checkBox = document.getElementById("checkBox");
const latitudeCheckBox = document.getElementById("latitudeCheckBox");
const longitudeCheckBox = document.getElementById("longitudeCheckBox");
const cumulPluieCheckBox = document.getElementById("cumulPluieCheckBox");
const directionVentCheckBox = document.getElementById("directionVentCheckBox")
const ventMoyenCheckBox = document.getElementById("ventMoyenCheckBox");

let donneeParJour = [];
let donneeMeteo;
let valeurSoumise;

// date Aujourd'hui
let date = new Date();
var tableau_semaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
var tableau_mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
let datedAujourdhui;
let temps;

//const token = "4fc5437cc97af368607aa51c5e24da9d2d95835be19cd8fecb0d37d29a0c3382";
//const token = "692bfe589118b1db61eedbd9a9aeecf8ee0f42d8a3c9e128ac454cc13e65f53e";
//const token = "ced3b5dd9813f00f0be2ac7c73d561438f2786cc96434a7850bed685692a6f0e";
const token = "fdc3bc3227d4a88b39ad16fe2fc2d0947f30c5d7718ba9dc1c3660014b309bfc";

/* ------------------------------------------------------------- meteo pour I jours ------------------------------------------------------------------------------------------- */


const combienDeJours = document.getElementById("combienDeJours");
const selectionParJour = document.getElementById("selectionParJour");
let insee;

async function mettreDonneesMeteo(codeInsee) {
    const url = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`;
    try {
    const response = await fetch(url);
    donneeMeteo = await response.json();
    mettreDonneesParJour();
    insee = codeInsee;

    } catch (error) {
    console.error(error.message);
    }
}

function mettreDonneesParJour(){
    for (let i = 0; i<7; i++){
        donneeParJour[i] = donneeMeteo.forecast[i];
    }
}

combienDeJours.addEventListener("change", ()=>{  surCeJour(combienDeJours.value); });

function surCeJour(i){
    while (selectionParJour.hasChildNodes()) {
        selectionParJour.removeChild(selectionParJour.firstChild);
    }
    for (let j = 0; j<i; j++){
        ajouterDivisonJour(j);
    }
}


const jour1 = document.getElementById("jour1");

let dateEntiere;
let dateDeparts;
let jourSemaine;

function ajouterDivisonJour(j){ // j indice du tableau donneeParJour[]
    let nouvelleDivisonJour = document.createElement("div");
    let nouveauParagrapheMeteo = document.createElement("p");
    let nouveauParagrapheDate = document.createElement("p");
    let nouveauParagrapheImage = document.createElement("p");

    
    nouvelleDivisonJour.className="oneDay";

    nouvelleDivisonJour.id=="jour"+j;

    nouvelleDivisonJour.addEventListener("click",()=>{
        if ((date.getDay()+j) > 6){
            jourSemaine = tableau_semaine[date.getDay()+j-7];
        }
        else{
            jourSemaine = tableau_semaine[date.getDay()+j];
        }
        recupererDonneesMeteo(insee,j,jourSemaine);

    },false)

    nouveauParagrapheMeteo.className="tempMinMax";
    nouveauParagrapheDate.className="dateParJour";
    nouveauParagrapheImage.className="imageParJour";

    descriptionMeteo (donneeParJour[j].weather, nouveauParagrapheImage);
    nouveauParagrapheMeteo.innerHTML = donneeParJour[j].tmin + "°/" + donneeParJour[j].tmax + "°";
    dateEntiere = donneeParJour[j].datetime.split('T');
    dateDeparts = dateEntiere[0].split("-");
    
    if ((date.getDay()+j) > 6){
        jourSemaine = tableau_semaine[date.getDay()+j-7];
    }
    else{
        jourSemaine = tableau_semaine[date.getDay()+j];
    }

    nouveauParagrapheDate.innerHTML = jourSemaine+ " " + dateDeparts[2] + "/" + dateDeparts[1];
    nouvelleDivisonJour.appendChild(nouveauParagrapheImage);
    nouvelleDivisonJour.appendChild(nouveauParagrapheMeteo);
    nouvelleDivisonJour.appendChild(nouveauParagrapheDate);
    selectionParJour.appendChild(nouvelleDivisonJour);
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

async function recupererDonnees(codePostal) { // asynchrone pour exécuter tout le code et attendre la réponse 
    
    try{
        
        
        if(codePostal.trim() == ''){
            erreurCodePostal.innerText = "🚨 Vous avez rien saisi, veuillez saisir un nombre de 5 chiffres.";
            erreurCodePostal.style.visibility = "visible";
        }  
        else{
            if(verifPostalCode(codePostal) == 0){
                erreurCodePostal.innerText = "🚨 Le code postal n'est pas de la bonne forme. Il doit être de 5 chiffres."; 
                erreurCodePostal.style.visibility = "visible";
            }
            else{
                const result = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`); // Récupérer valeur de l'api
                const data = await result.json();
                if(data.length == 0){
                    erreurCodePostal.innerText = "🚨 Ce code postal n'existe pas.";
                    erreurCodePostal.style.visibility = "visible";
                }
                else{
                    
                    const optionDeBase = document.createElement("option");
                    optionDeBase.innerText = "Sélectionnez une commune";
                    validation.appendChild(optionDeBase)
                    data.forEach(element => { // Pour chaque élément de data
                        indicationVille.style.visibility ="visible";
                        const optionElement = document.createElement("option"); // on crée une option pour le select
                        optionElement.innerText = element.nom // on change son texte
                        validation.appendChild(optionElement) // on l'ajoute dans le select
                    });
                }
        }
            
        }
        
    }
    catch (error){
        console.error("Erreur");
    }
}

entree.addEventListener("input", () => {
    erreurCodePostal.style.visibility = "hidden"; // Masquer l'erreur dès que l'utilisateur tape quelque chose de nouveau
});

function verifPostalCode(pc){
    const verifModelePc = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;
    if(verifModelePc.test(pc)){
        return 1;
    }
    return 0;
}

boutonDeValidation.addEventListener("click", ()=>{
    validation.innerText = "";
    valeurSoumise = entree.value;
    recupererDonnees(valeurSoumise);
});

entree.addEventListener("keypress", ()=>{
    validation.innerText = "";
    valeurSoumise = entree.value;
    recupererDonnees(valeurSoumise);
})

async function recupererDonneesVille(nomCommune){
    try{
        const result = await fetch(`https://geo.api.gouv.fr/communes?nom=${nomCommune}&fields=departement`);
        const data = await result.json();
        const valeurInsee = data[0].code;
        recupererDonneesMeteo(valeurInsee,0,tableau_semaine[date.getDay()]);
        mettreDonneesMeteo(valeurInsee);
    }
    catch (error){
        console.error("Erreur nom de ville");
    }
}

validation.addEventListener("change", ()=>{
    const selectedIndex = validation.selectedIndex;
    const selectOption = validation.options[selectedIndex];
    recupererDonneesVille(selectOption.value)
})

async function recupererDonneesMeteo(codeInsee,i,dateSemaine){
    try{ 

        const result = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`);
        const resultPeriod = await fetch(`https://api.meteo-concept.com/api/forecast/nextHours?token=${token}&insee=${codeInsee}`);
        const data = await result.json();
        let dataPeriod = await resultPeriod.json();
        const skyCommune = data.forecast[i].weather; 
        descriptionMeteo(skyCommune, ciel);
        const tempMinCommune = data.forecast[i].tmin;
        const tempMaxCommune = data.forecast[i].tmax;
        const probaRainCommune = data.forecast[i].probarain;
        const sun_hours = data.forecast[i].sun_hours;
        const nomVille = data.city.name;
        const longitudeCommune =(data.city.longitude); 
        const latitudeCommune = data.city.latitude;
        const ventMoyenCommune = data.forecast[i].wind10m;
        const directionVentCommune = data.forecast[i].dirwind10m;
        const cumulPluieCommune = data.forecast[i].rr10;
        if(i > 0){
            temperatureActuelle.innerText = " ";
        }
        else{
            const currentTemperatureCommune = dataPeriod.forecast[0].temp2m;
            temperatureActuelle.innerText = currentTemperatureCommune + '°';
        }       
        
        cumulPluie.innerText = cumulPluieCommune+"mm";
        ventMoyen.innerText = ventMoyenCommune+"km/h";
        directionVent.innerText = directionVentCommune+'°';
        latitude.innerText = latitudeCommune;
        longitude.innerText = longitudeCommune;
        nomCommune.innerText = nomVille;
        tempMin.innerText = tempMinCommune+'°';

        tempMax.innerText = tempMaxCommune+'°';
        probaPluie.innerText = probaRainCommune+'%';
        heureSol.innerText = sun_hours;      

        

        let minute = date.getMinutes() + "";
        if (minute.length == 1) { minute = "0"+minute;}
        temps = date.getHours() + "h" + minute;
        
        dateEntiere = data.forecast[i].datetime.split('T');
        dateDeparts = dateEntiere[0].split("-");
        heureActuelle.innerText = dateSemaine + " " + dateDeparts[2] + " " + tableau_mois[dateDeparts[1]] + ", " + temps;
        
        affichageInfos();
    }
    catch(error){
        console.error("Erreur Météo");
    }
}

function affichageInfos(){
    infosPrincipales.style.visibility = "visible";
    enleverAffichageCommune();
    PlacerInstantWeather();
    donneesSupplementaires.style.visibility = "visible";
    parametres.style.visibility ="visible";
    codePostal.style.position = "absolute";
    indicationVille.style.position ="absolute";
    selectionParJour.style.visibility ="visible";
    document.getElementById("choixParJour").style.visibility ="visible";

    verifCheckBox(latitudeCheckBox,lat,textLatitude)
    verifCheckBox(longitudeCheckBox,long,textLongitude)
    verifCheckBox(cumulPluieCheckBox,cupluie,textCuPluie)
    verifCheckBox(directionVentCheckBox,dirvent,textDirectionVent)
    verifCheckBox(ventMoyenCheckBox,vemoy,textVentMoyen)

}

function verifEncadrer(){
    if(latitudeCheckBox.checked == false && cumulPluieCheckBox.checked == false && directionVentCheckBox.checked ==false && longitudeCheckBox.checked == false && ventMoyenCheckBox.checked == false ){
        donneesSupplementaires.style.visibility ="hidden";
    }
    if(latitudeCheckBox.checked == false && longitudeCheckBox.checked == false){
        document.getElementById("carte").style.visibility ="hidden";
    }
    if(cumulPluieCheckBox.checked == false){
        document.getElementById("pluie").style.visibility ="hidden";
    }
    if(directionVentCheckBox.checked == false && ventMoyenCheckBox.checked == false){
        document.getElementById("vent").style.visibility ="hidden";
    }
}

function verifRemettreEncadrer(){
    if(latitudeCheckBox.checked == true || cumulPluieCheckBox.checked == true || directionVentCheckBox.checked == true || longitudeCheckBox.checked == true || ventMoyenCheckBox.checked == true){
        donneesSupplementaires.style.visibility ="visible";
    }
    if(latitudeCheckBox.checked == true || longitudeCheckBox.checked == true){
        document.getElementById("carte").style.visibility ="visible";
    }
    if(cumulPluieCheckBox.checked == true){
        document.getElementById("pluie").style.visibility ="visible";
    }
    if(directionVentCheckBox.checked == true || ventMoyenCheckBox.checked == true){
        document.getElementById("vent").style.visibility ="visible";
    }
}

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    latitudeCheckBox.checked = true;
    cumulPluieCheckBox.checked = true;
    directionVentCheckBox.checked = true;
    ventMoyenCheckBox.checked = true;
    longitudeCheckBox.checked = true;
    combienDeJours.value = combienDeJours.options[0].value;

} else {
    console.info( "This page is not reloaded");
}

function enleverAffichageCommune(){

    parametres.position ="";
    revenirArriere.position = "";
    infosPrincipales.style.position ="";
    donneesSupplementaires.style.position ="";
    document.getElementById("choixParJour").style.position ="";
    selectionParJour.style.position ="";
    contenu.style.position ="absolute";

    indicationVille.style.visibility = "hidden";
    codePostal.style.visibility = "hidden";
    contenu.style.visibility = "hidden";
    revenirArriere.style.visibility = "visible";
}

function PlacerInstantWeather(){
    titre.style.marginTop = "5%";
}

const textLatitude = document.getElementById("texteLatitude");
const textLongitude = document.getElementById("texteLongitude");
const textCuPluie = document.getElementById("texteCuPluie");
const textVentMoyen = document.getElementById("texteVentMoyen");
const textDirectionVent = document.getElementById("texteDirectionVent");

const carte = document.getElementById("carte");
const pluie = document.getElementById("pluie");
const vent = document.getElementById("vent");

function remettreAffichageCommune(){
    
    revenirArriere.position ="absolute";
    parametres.position ="absolute";
    infosPrincipales.style.position = "absolute";
    donneesSupplementaires.style.position ="absolute";
    document.getElementById("choixParJour").style.position ="absolute";
    selectionParJour.style.position = "absolute";
    contenu.style.position ="";

    indicationVille.style.visibility = "visible";
    codePostal.style.visibility ="visible";
    revenirArriere.style.visibility ="hidden";
    infosPrincipales.style.visibility = "hidden";
    titre.style.marginTop = "15%";
    body.style.backgroundColor= "#58ABB0";
    indicationVille.style.visibility = "hidden";
    codePostal.style.position = "";
    indicationVille.style.position ="";
    parametres.style.visibility ="hidden";
    formulaire.style.visibility ="hidden";
    contenu.style.visibility="visible";

    carte.style.visibility ="hidden";
    pluie.style.visibility ="hidden";
    vent.style.visibility ="hidden";

    latitude.style.visibility ="hidden";
    cumulPluie.style.visibility ="hidden";
    longitude.style.visibility ="hidden";
    ventMoyen.style.visibility ="hidden";
    directionVent.style.visibility ="hidden";

    textLatitude.style.visibility ="hidden";
    textLongitude.style.visibility ="hidden";
    textCuPluie.style.visibility ="hidden";
    textVentMoyen.style.visibility ="hidden";
    textDirectionVent.style.visibility ="hidden";

    selectionParJour.style.visibility ="hidden";
    donneesSupplementaires.style.visibility="hidden";
    document.getElementById("choixParJour").style.visibility ="hidden";

}

revenirArriere.addEventListener("click",()=>{
    remettreAffichageCommune();
    combienDeJours.value = combienDeJours.options[0].value;
    surCeJour(combienDeJours.value);
})


function descriptionMeteo (meteo, s){
    if(meteo == 0){
        s.innerHTML = '<i class="fa-regular fa-sun"></i>';
        if (s == ciel){ body.style.backgroundColor ="#80DDE3"; 
            formulaire.style.backgroundColor ="#80DDE3";
            descriptionCiel.innerText = "Ensoleillé";
        }
    } 
    if((meteo >= 1 && meteo <= 5) || (meteo == 16) ){
        s.innerHTML = '<i class="fa-solid fa-cloud"></i>';
        if (s == ciel){ body.style.backgroundColor="#6FB8BD";
            formulaire.style.backgroundColor ="#6FB8BD"; 
            descriptionCiel.innerText = "Nuageux";
        }
    }
    if(meteo >= 6 && meteo <= 7 ){
        s.innerHTML = '<i class="fa-solid fa-smog"></i>';
        if (s == ciel){ body.style.backgroundColor = "#59989C";
            formulaire.style.backgroundColor ="#59989C"; 
            descriptionCiel.innerText = "Brumeux"
        }
    }
    if((meteo >= 10 && meteo <= 15) || (meteo >= 40 && meteo <= 48) || (meteo >= 210 && meteo <= 212) || (meteo == 235)){
        s.innerHTML =  '<i class="fa-solid fa-cloud-rain"></i>';
        if (s == ciel){ 
            body.style.backgroundColor = "#496769";
            formulaire.style.backgroundColor ="#496769";
            descriptionCiel.innerText = "Pluvieux"
        }
    }
    if((meteo >= 20 && meteo <= 22 ) || (meteo >= 30 && meteo <= 32) ||  (meteo >= 60 && meteo <= 68) || (meteo >= 70 && meteo <= 78) || (meteo >= 220 && meteo <= 2022) || (meteo >= 230 && meteo <= 232)){
        s.innerHTML = '<i class="fa-solid fa-snowflake"></i>'
        if (s == ciel){ body.style.backgroundColor = "#8BA1A3"; 
            formulaire.style.backgroundColor ="#8BA1A3"; 
            descriptionCiel.innerText = "Enneigé"
    }
    }
    if((meteo >= 100 && meteo <= 108) || (meteo >= 120 && meteo <= 142)){
        s.innerHTML = '<i class="fa-solid fa-poo-storm"></i>';
        if (s == ciel){ 
            body.style.backgroundColor = "#302A2A"; 
            formulaire.style.backgroundColor ="#302A2A";
            descriptionCiel.innerText = "Orageux"
        }  
    }     
}

parametres.addEventListener("click",()=>{
    formulaire.style.visibility="visible";
})

annuler.addEventListener("click",()=>{
    formulaire.style.visibility="hidden";
})


function verifCheckBox(checkBox,value,text){
    if(checkBox.checked == false){
        value.style.visibility = "hidden";
        text.style.visibility ="hidden";
        verifEncadrer();
    }
    else{
        value.style.visibility = "visible";
        text.style.visibility ="visible";
        verifRemettreEncadrer();
    }
}






const validation = document.getElementById("ville");
const input = document.getElementById("postcode");
const submitButton = document.getElementById("submit");
const infoMain = document.getElementById("infoMain");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const probaRain = document.getElementById("probaRain");
const heureSol = document.getElementById("heureSol");
const nomCommune = document.getElementById("nomCommune");
const heureActuelle = document.getElementById("heureActuelle");
const selectionCity = document.getElementById("city");
const codePostal = document.getElementById("postalCode");
const title = document.getElementById("title");
const revenirArriere = document.getElementById("revenirArriere");
const sky = document.getElementById("sky")
const body = document.body;
const supData = document.getElementById("supData");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const cumulPluie = document.getElementById("cumulPluie");
const ventMoyen = document.getElementById("ventMoyen");
const directionVent = document.getElementById("directionVent");

let dataPerDay = [];
let dataWeather;
let valeurInput;

const token = "4fc5437cc97af368607aa51c5e24da9d2d95835be19cd8fecb0d37d29a0c3382";

/*async function setDataWeather(codeInsee) {
    const url = `https://api.meteo-concept.com/api/forecast/daily?token=4fc5437cc97af368607aa51c5e24da9d2d95835be19cd8fecb0d37d29a0c3382&insee=${codeInsee}`;
    try {
    const response = await fetch(url);
    dataWeather = await response.json();
    setDataPerDay();

    } catch (error) {
    console.error(error.message);
    }
}

function setDataPerDay(){
    for (let i = 0; i<7; i++){
        dataPerDay[i] = dataWeather.forecast[i];
        console.log(dataPerDay[i]);
    }
}*/

async function fetchData(codePostal) { // asynchrone pour exécuter tout le code et attendre la réponse 
    try{
        const result = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`); // Récupérer valeur de l'api
        const data = await result.json();
        const optionDeBase = document.createElement("option");
        optionDeBase.innerText = "Selectionner une commune";
        validation.appendChild(optionDeBase)
        data.forEach(element => { // Pour chaque élément de data
            const optionElement = document.createElement("option"); // on crée une option pour le select
            optionElement.innerText = element.nom // on change son texte
            validation.appendChild(optionElement) // on l'ajoute dans le select
        });
    }
    catch (error){
        console.error("Erreur");
    }
}

submitButton.addEventListener("click", ()=>{
    validation.innerText = "";
    valeurInput = input.value;
    fetchData(valeurInput);
    city.style.visibility ="visible";
});

async function fetchDataNomVille(nomCommune){
    try{
        const result = await fetch(`https://geo.api.gouv.fr/communes?nom=${nomCommune}&fields=departement`);
        const data = await result.json();
        const valeurInsee = data[0].code;
        fetchDataMeteo(valeurInsee);
    }
    catch (error){
        console.error("Erreur nom de ville");
    }
}

validation.addEventListener("change", ()=>{
    const selectedIndex = validation.selectedIndex;
    const selectOption = validation.options[selectedIndex];
    fetchDataNomVille(selectOption.value)
})

async function fetchDataMeteo(codeInsee){
    try{ 
        const result = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`);
        const data = await result.json();
        console.log(data)
        const skyCommune = data.forecast[0].weather;
        weatherDescriptions(skyCommune);
        const tempMinCommune = data.forecast[0].tmin;
        const tempMaxCommune = data.forecast[0].tmax;
        const probaRainCommune = data.forecast[0].probarain;
        const sun_hours = data.forecast[0].sun_hours;
        const nomVille = data.city.name;
        const longitudeCommune = data.city.longitude; 
        const latitudeCommune = data.city.latitude;
        const ventMoyenCommune = data.forecast[0].wind10m;
        const directionVentCommune = data.forecast[0].dirwind10m;
        const cumulPluieCommune = data.forecast[0].rr10;

        cumulPluie.innerText = cumulPluieCommune+"mm";
        ventMoyen.innerText = ventMoyenCommune+"km/h";
        directionVent.innerText = directionVentCommune+'°';
        latitude.innerText = latitudeCommune;
        longitude.innerText = longitudeCommune;
        nomCommune.innerText = nomVille;
        tempMin.innerText = tempMinCommune+'°';
        tempMax.innerText = tempMaxCommune+'°';
        probaRain.innerText = probaRainCommune+'%';
        heureSol.innerText = sun_hours;
        affichageInfos();
    }
    catch(error){
        console.error("Erreur Météo");
    }
}

function affichageInfos(){
    infoMain.style.visibility = "visible";
    enleverAffichageCommune();
    InstantWeatherPlacer();
    supData.style.visibility = "visible";
}

function enleverAffichageCommune(){
    city.style.visibility = "hidden";
    codePostal.style.visibility = "hidden";
    revenirArriere.style.visibility = "visible";
}

function InstantWeatherPlacer(){
    title.style.marginTop = "5%";
}

function remettreAffichageCommune(){
    city.style.visibility = "visible";
    codePostal.style.visibility ="visible";
    revenirArriere.style.visibility ="hidden";
    infoMain.style.visibility = "hidden";
    title.style.marginTop = "15%";
    body.style.backgroundColor= "#58ABB0";
    selectionCity.style.visibility = "hidden";
    supData.style.visibility="hidden";
}

revenirArriere.addEventListener("click",()=>{
    remettreAffichageCommune();
})

function weatherDescriptions (weather){
    console.log(weather);
    if(weather == 0){
        sky.innerHTML = '<i class="fa-regular fa-sun"></i>';
        body.style.backgroundColor ="#80DDE3"
    } 
    if((weather >= 1 && weather <= 5) || (weather == 16) ){
        sky.innerHTML = '<i class="fa-solid fa-cloud"></i>';
        body.style.backgroundColor="#6FB8BD"
    }
    if(weather >= 6 && weather <= 7 ){
        sky.innerHTML = '<i class="fa-solid fa-smog"></i>';
        body.style.backgroundColor = "#59989C";
    }
    if((weather >= 10 && weather <= 15) || (weather >= 40 && weather <= 48) || (weather >= 210 && weather <= 212) || (weather == 235)){
        sky.innerHTML =  '<i class="fa-solid fa-cloud-rain"></i>';
        body.style.backgroundColor = "#496769";
    }
    if((weather >= 20 && weather <= 22 ) || (weather >= 30 && weather <= 32) ||  (weather >= 60 && weather <= 68) || (weather >= 70 && weather <= 78) || (weather >= 220 && weather <= 2022) || (weather >= 230 && weather <= 232)){
        sky.innerHTML = '<i class="fa-solid fa-snowflake"></i>'
        body.style.backgroundColor = "#8BA1A3";
    }
    if((weather >= 100 && weather <= 108) || (weather >= 120 && weather <= 142)){
        sky.innerHTML = '<i class="fa-solid fa-poo-storm"></i>';
        body.style.backgroundColor = "#302A2A";
    }
    

}
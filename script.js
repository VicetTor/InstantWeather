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

let dataPerDay = [];
let dataWeather;
let valeurInput;

const token = "4fc5437cc97af368607aa51c5e24da9d2d95835be19cd8fecb0d37d29a0c3382";

async function setDataWeather(codeInsee) {
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
}

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
        console.log(data)
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
        console.log(data);
        console.log(data.forecast[0].weather)
        const skyCommune = weatherDescriptions(data.forecast[0].weather);
        const tempMinCommune = data.forecast[0].tmin;
        const tempMaxCommune = data.forecast[0].tmax;
        const probaRainCommune = data.forecast[0].probarain;
        const sun_hours = data.forecast[0].sun_hours;
        const nomVille = data.city.name;

        nomCommune.innerText = nomVille;
        sky.innerText = skyCommune;
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
}

revenirArriere.addEventListener("click",()=>{
    remettreAffichageCommune();
})

function weatherDescriptions (weather){
    console.log(weather);
    if(weather == 0){
        return "Ensolleillé";
    } 
    if((weather >= 1 && weather <= 5) || (weather == 16) ){
        return "Couvert";
    }
    if(weather >= 6 && weather <= 7 ){
        return "Brouillard";
    }
    if((weather >= 10 && weather <= 15) || (weather >= 40 && weather <= 48) || (weather >= 210 && weather <= 212) ){
        return "Pluie";
    }
    if((weather >= 20 && weather <= 22 ) || (weather >= 60 && weather <= 68) || (weather >= 220 && weather <= 2022)){
        return "Neige";
    }
    if((weather >= 30 && weather <= 32) || (weather >= 70 && weather <= 78) || (weather >= 230 && weather <= 232)){
        return "Pluie et neige mellees";
    }
    if((weather >= 100 && weather <= 108) || (weather >= 120 && weather <= 142)){
        return "Orage";
    }
    if(weather == 235 ){
        return "Averse de gele";
    }

}
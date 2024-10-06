const validation = document.getElementById("commune");
const input = document.getElementById("inputCommune");
const submitButton = document.getElementById("submit");
const paragrapheAffichage = document.getElementById("items");
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
    validation.innerText = ""
    valeurInput = input.value
    fetchData(valeurInput)
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
        const tempMinCommune = data.forecast[0].tmin;
        const tempMaxCommune = data.forecast[0].tmax;
        const probaRain = data.forecast[0].probarain;
        const sun_hours = data.forecast[0].sun_hours;
        affichageTemp(tempMinCommune, tempMaxCommune, probaRain, sun_hours);
    }
    catch(error){
        console.error("Erreur Météo");
    }
}

function affichageTemp(tempMin, tempMax, probaRain, sun_hours){
    paragrapheAffichage.style.visibility = "visible";
    paragrapheAffichage.innerText = `Température Minimum : ${tempMin}, Température Maximal : ${tempMax}, Probabilité de pluie : ${probaRain}%, Heures d'ensoleillement : ${sun_hours}`;
}

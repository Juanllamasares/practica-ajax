const $selectPrimary = document.getElementById("select-primary"),
const $selectSecundary = document.getElementById("select-secundary");

function loadStates(){
    fetch(`https://api.copomex.com/query/get_estados?token=pruebas`)
}

function loadTowns(state){

}

document.addEventListener("DOMContentLoaded", loadStates);

$selectPrimary.addEventListener("change",e=> loadTowns(e.target.value));
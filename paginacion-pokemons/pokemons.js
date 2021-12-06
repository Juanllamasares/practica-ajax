const $main = document.querySelector("main"),
$links = document.querySelector(".links");

let pokeAPI = "https://pokeapi.co/api/v2/pokemon/"

async function loadPokemons(url){
    try {
        let res = await fetch(url),
        json = await res.json(),
        $template = "",
        $prev,
        $next;

        console.log(json);

        if(!res.ok) throw {status: res.status, statusText: res.statusText};

        for(let i=0; i<json.results.length; i++){
            //console.log(json.results[i]);

            try {
                let res = await fetch(json.results[i].url);
                let pokemon = await res.json();
                //console.log(res);

                if(!res.ok) throw {status: res.status, statusText: res.statusText};

                $template += `
                    <figure>
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <figcaption>${pokemon.name}</figcaption>
                    </figure>
                `;

            } catch (error) {
                $template += `
                <figure>
                    <figcaption>Error: ${error.status}</figcaption>
                </figure>
                `;
            }

            $main.innerHTML = $template;
            $prev = json.previous?`<a href="${json.previous}">⏮️</a>`:"";
            $next = json.next?`<a href="${json.next}">⏭️</a>`:"";
            $links.innerHTML = $prev + " " + $next;
        }
    } catch (error) {
        $main.innerHTML = `<p>Error: ${error.status}</p>`;
    }
};

document.addEventListener("DOMContentLoaded", e=> loadPokemons(pokeAPI));

document.addEventListener("click",e=>{
    if(e.target.matches(".links a")){
        e.preventDefault();
        loadPokemons(e.target.getAttribute("href"));
    }
})
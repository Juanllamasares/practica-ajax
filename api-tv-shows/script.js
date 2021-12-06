const $shows = document.getElementById("shows"),
$template = document.getElementById("show-template").content,
$fragment = document.createDocumentFragment();

document.addEventListener("keypress",async e=>{
    if(e.target.matches("#search")){
        //console.log(e.key);
        if(e.key === "Enter"){
            try {
                $shows.innerHTML = `<img class="loader" src="/loader.svg" alt="Cargando...">`;

                let consulta = e.target.value.toLowerCase(),
                api = `https://api.tvmaze.com/search/shows?q=${consulta}`,
                res = await fetch(api),
                json = await res.json();

                //console.log(api,res,json);

                if(!res.ok) throw {status:res.status,statusText:res.statusText};

                if(json.length===0){
                    $shows.innerHTML = `<h2>No existen resultados de shows para: <mark>${consulta}</mark></h2>`;
                }else{
                    json.forEach(el=>{
                        $template.querySelector("h3").textContent = el.show.name;
                        $template.querySelector("div").innerHTML = el.show.summary?el.show.summary:"Sin descripcion";
                        $template.querySelector("img").src = el.show.image?el.show.image.medium:"http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
                        $template.querySelector("img").alt = el.show.name;
                        $template.querySelector("img").style.maxWidth = "100%";
                        $template.querySelector("a").href = el.show.url?el.showurl:"#";
                        $template.querySelector("a").target = el.show.url?"_blank":"_self";
                        $template.querySelector("article").style.margin = "5px";                      

                        let $clone = document.importNode($template,true);
                        $fragment.appendChild($clone);
                    });
                }
                $shows.innerHTML = "";
                $shows.appendChild($fragment);
            } catch (error) {
                $shows.innerHTML = "";
                $shows.innerHTML = `<p>Error:${error.status}</p>`;
            }
        }
    }
})
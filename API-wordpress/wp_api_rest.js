const $site = document.getElementById("site"),
$posts = document.getElementById("posts"),
$loader = document.querySelector(".loader"),
$template = document.getElementById("post-template").content,
$fragment = document.createDocumentFragment(),
DOMAIN = "https://css-tricks.com",
SITE = `${DOMAIN}/wp-json`,
API_WP = `${SITE}/wp/v2`,
POSTS = `${API_WP}/posts?_embed`,
PAGES = `${API_WP}/pages`,
CATEGORIES = `${API_WP}/categories`;

let page = 1,
perPage = 5;

function getSiteData(){
    fetch(SITE)
    .then(res=> res.ok?res.json():Promise.reject(res))
    .then(json=>{
        console.log(json);
        $site.innerHTML = `
        <h3>Sitio Web</h3>
        <h2>
            <a href="${json.url}" target="_blank"></a>
        </h2>
        <p>${json.description}</p>
        <p>${json.timezone_string}</p>
        `
    })
    .catch(err=>{
        $site.innerHTML = `<p>Error: ${err.status}</p>`;
    })
}

function getPosts(){

    $loader.style.display = "block"
    fetch(`${POSTS}&page=${page}&per_page=${perPage}`)
    .then(res=> res.ok?res.json():Promise.reject(res))
    .then(json=>{
        console.log(json);
        json.forEach(el => {
            let categories = "",
            tags = "";

            el._embedded["wp:term"][0].forEach(el=> categories += `<li>${el.name}</li>`);
            el._embedded["wp:term"][1].forEach(el=> tags += `<li>${el.name}</li>`);

            $template.querySelector(".post-image").src = el._embedded["wp:featuredmedia"]?el._embedded["wp:featuredmedia"][0].source_url:"";
            $template.querySelector(".post-image").alt = el.title.rendered;
            $template.querySelector(".post-title").innerHTML = el.title.rendered;
            $template.querySelector(".post-author").innerHTML = `
            <img src="${el._embedded.author[0].avatar_urls["48"]}" alt="${el._embedded.author[0].name}">
            <figcaption></figcaption>
            `;
            $template.querySelector(".post-date").innerHTML = new Date(el.date).toLocaleString();
            $template.querySelector(".post-link").href = el.link;
            $template.querySelector(".post-excerpt").innerHTML = el.excerpt.rendered.replace("[&hellip;]","...");
            $template.querySelector(".post-categories").innerHTML = `
            <p>Categorias</p>
            <ul>
                ${categories}
            </ul>
            `;
            $template.querySelector(".post-tags").innerHTML = `
            <p>Etiquetas</p>
            <ul>
                ${tags}
            </ul>
            `;
            $template.querySelector(".post-content>article").innerHTML = el.content.rendered;

            let $clone = document.importNode($template,true);
            $fragment.appendChild($clone);
        });
        $posts.appendChild($fragment);
        $loader.style.display = "none";
    })
    .catch(err=>{
        console.log(err);
        $posts.innerHTML = `<p>Error: ${err.status}</p>`;
        $loader.style.display = "none";
    })
}

document.addEventListener("DOMContentLoaded",(e)=>{
    getSiteData();
    getPosts();
});

window.addEventListener("scroll",e=>{
    const {scrollTop,clientHeight,scrollHeight} = document.documentElement;

    //console.log(document.documentElement);
    //console.log(scrollTop,clientHeight,scrollHeight);

    if(scrollTop + clientHeight >= scrollHeight){
        console.log("cargar mas posts...");
        page++;
        perPage++;
        getPosts();
    }
})
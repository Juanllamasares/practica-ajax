const $main = document.querySelector("main");

fetch("javascript.md")
.then((res)=>res.ok?res.text():Promise.reject(res))
.then(text=>{
    console.log(text);
    $main.innerHTML = new showdown.Converter().makeHtml(text);
})
.catch((err)=>{
    console.log(err);
    $main.innerHTML = `<p>Error:${err.status}</p>`;
})
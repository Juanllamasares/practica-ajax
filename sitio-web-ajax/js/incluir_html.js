document.addEventListener("DOMContentLoaded",e=>{
    const incluirHTML = (el,url)=>{
        const xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange",e=>{
            if(xhr.readyState!==4)return;
            if(xhr.status>=200&&xhr.status<300){
                el.outerHTML = xhr.responseText;
            }else{
                let mensajeError = xhr.statusText || "Error al cargar el archivo,recuerda estar haciendo la peticion por http o https";
                el.outerHTML = `<div><p>Error: ${xhr.status}: ${mensajeError}</p></div>`;
            }
        });

        xhr.open("GET",url);
        xhr.setRequestHeader("Content-type","text/html; charset=utf-8");
        xhr.send();
    };

    document.querySelectorAll("[data-incluir]").forEach(el=>incluirHTML(el,el.getAttribute("data-incluir")));
});
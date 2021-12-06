const $main = document.querySelector("main"),
$files = document.getElementById("files");

const uploader = (file)=>{
    console.log(file);

    const xhr = new XMLHttpRequest(),
    formData = new FormData();
    
    formData.append("file",file);

    xhr.addEventListener("readystatechange",e=>{
        if(xhr.readyState !== 4)return;
        if(xhr.status >= 200 && xhr.status < 300){
            let json = JSON.parse(xhr.responseText);
            console.log(json);
        }else{
            console.warn(xhr.status);
        }

    });

    xhr.open("POST","/php/uploader.php");
    xhr.setRequestHeader("enc-type","multipart/form-data");
    xhr.send(formData);
};

const progressUpload = (file)=>{
    const $progress = document.createElement("progress"),
    $span = document.createElement("span");

    $progress.value = 0;
    $progress.max = 100;

    $main.insertAdjacentElement("beforeend",$progress);
    $main.insertAdjacentElement("beforeend",$span);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener("progress",e=>{
        console.log(e);
    });

    fileReader.addEventListener("loadend",e=>{});

};

document.addEventListener("change",e=>{
    if(e.target === $files){
        //console.log(e.target.files);

        const files = Array.from(e.target.files);
        files.forEach(el=>uploader(el));
    }
})
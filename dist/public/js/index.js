const cachename = "Adv-Fs"
/******  For Pwa Service worker    *****/
window.addEventListener("load",()=>{
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }  
})


let objects = {}
$id = (id)=>{
  id in objects ? objects[id] : objects[id]=document.getElementById(id);
  return objects[id];
}

$id("fileupload").addEventListener("change",()=>{
  $id("filename").value = $id("fileupload").files[0].name;
})

//$id("year").textContent = new Date().getFullYear();

const Upload = async function() {

    let fileupload = $id("fileupload");
    let formData = new FormData();           
    formData.append("upl", fileupload.files[0],$id("filename").value);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.upload.addEventListener('progress',function(e) {
      var percentComplete = Math.ceil((e.loaded / e.total) * 100);
      $id("Uploadresult").className = "showblock";
      $id("sharelink").innerHTML = `Uploading.... ${percentComplete} %`;
    });

    xhr.addEventListener("load",function() {
      let data = JSON.parse(this.response);
      $id("sharelink").innerHTML = `${window.location.origin}?previewkey=${data.urls[0].name} <br/>`;
      $id("Uploadresult").className = "showblock";

      const shareData = {
        title: data.urls[0].name,
        text: `Sharing ${data.urls[0].name} via advance file storage`,
        url: `${window.location.origin}?previewkey=${data.urls[0].name}`
      }
      
      const btn = document.getElementById('Share');
      const openbtn = document.getElementById('Open');

      // Share must be triggered by "user activation"
      btn.addEventListener('click', async () => {
        try {
          await navigator.share(shareData);
        } catch (err) {
          alert("Failed to share")
          console.log(`Error: ${err}`);
        }
      });

      openbtn.addEventListener('click', async () => {
       window.open(shareData.url)
      });

      

      alert('The file has been uploaded successfully.');
    });
    xhr.send(formData);
}



const params = new URLSearchParams(window.location.search)
if(params.has("key"))
{
    const filename = params.get("key").slice(params.get("key").indexOf('-') + 1)
    document.getElementById("downloadfile").className = "showblock";
    document.getElementById("downloadbutton").setAttribute("value",`Download ${filename}`)
    document.getElementById("downloadbutton").addEventListener("click",()=>{
        document.getElementById("downloadfile").innerHTML = "Waiting for download .... ";
        fetch(`getimage?key=${params.get("key")}`)
      .then(async (response) =>  {
        if(response.status === 200){
          const blob = await response.blob();
          const newBlob = new Blob([blob]);
      
          const url = window.URL.createObjectURL(newBlob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename.concat(''));
          document.body.appendChild(link);
          link.click();
          document.getElementById("downloadfile").innerHTML = "Your Download has started";
        }
        else
        {
          document.getElementById("downloadfile").innerHTML = "Can't get the file requested";
        }
      })
      .catch((error)=>{document.getElementById("downloadfile").innerHTML = "Can't get the file requested"; console.log(error)})
    })
}
else if(params.has("previewkey"))
{
  const filename = params.get("previewkey").slice(params.get("previewkey").indexOf('-') + 1);
        
        $id("Content").className = "hideblock";
        $id("previewloading").className = "showblock";
        
        //document.getElementById("preview").innerHTML = "loading ... ";
        fetch(`getimage?key=${params.get("previewkey")}`)
      .then(async (response) =>  {
        if(response.status === 200){
          const blob = await response.blob();
          const newBlob = new Blob([blob]);
          
          const url = window.URL.createObjectURL(newBlob);
          $id("preview").src = url;
          $id("previewloading").className = "hideblock";
          $id("preview").className = "showblock";

          cache = await caches.open(cachename)
          await cache.add(`getimage?key=${params.get("previewkey")}`);
          await cache.add(window.location.href);
        }
        else
        {
          alert("cant preview");
        }
      })
      .catch((error)=>{console.log(error);alert("cant preview");})
}
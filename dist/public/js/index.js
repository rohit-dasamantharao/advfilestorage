
const Upload = async function() {

    let fileupload = document.getElementById("fileupload");
    let formData = new FormData();           
    formData.append("upl", fileupload.files[0]);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);

    xhr.upload.addEventListener('progress',function(e) {
      var percentComplete = Math.ceil((e.loaded / e.total) * 100);
      document.getElementById("Uploadresult").className = "showblock";
      document.getElementById("sharelink").innerHTML = `Uploading.... ${percentComplete} %`;
    });

    xhr.addEventListener("load",function() {
      let data = JSON.parse(this.response);
      document.getElementById("sharelink").innerHTML = `${window.location.origin}?key=${data.urls[0].name}`;
      document.getElementById("Uploadresult").className = "showblock";

      const shareData = {
        title: data.urls[0].name,
        text: `Sharing ${data.urls[0].name} via advance file storage`,
        url: `${window.location.origin}?key=${data.urls[0].name}`
      }
      
      const btn = document.getElementById('Share');
      
      // Share must be triggered by "user activation"
      btn.addEventListener('click', async () => {
        try {
          await navigator.share(shareData);
        } catch (err) {
          alert("Failed to share")
          console.log(`Error: ${err}`);
        }
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
        fetch(`getimage?key=${params.get("key")}`)
      .then(async (response) =>  {
        const blob = await response.blob();
        const newBlob = new Blob([blob]);
    
        const url = window.URL.createObjectURL(newBlob);
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', filename.concat(''));
       document.body.appendChild(link);
       link.click();
      })
      .catch((error)=>{console.log(error)})
    })
}
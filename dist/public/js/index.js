const Upload = async function() {

    let fileupload = document.getElementById("fileupload");
    let formData = new FormData();           
    formData.append("upl", fileupload.files[0]);
    let response = await fetch('/upload', {
      method: "POST", 
      body: formData
    });
    let data = await response.json();
    console.log(data);
    document.getElementById("sharelink").innerHTML = `${window.location.origin}/key=${data.urls[0].name}`;
    document.getElementById("Uploadresult").className = "showblock";
    alert('The file has been uploaded successfully.');
}



const params = new URLSearchParams(window.location.search)
if(params.has("key"))
{
    let filename =  params.get("key").split(/\d+-/)[1];
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
       link.setAttribute('download', filename);
       document.body.appendChild(link);
       link.click();
      })
      .catch((error)=>{console.log(error)})
    })
}
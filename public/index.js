const imageSelector = document.querySelector("#img-selector")
const sendBtn = document.querySelector("#send")
const textureName = document.querySelector('#name')

let selectedFile
const reader = new FileReader()

imageSelector.addEventListener("change", e => {

    const imgTexture = new Image()
    const givenFile = e.target.files[0]

    reader.readAsDataURL(givenFile)

    reader.onload = e => {
        imgTexture.src = e.target.result
    }

    imgTexture.onload = e => {
        if(imgTexture.width === 32 && imgTexture.height === 32){
            selectedFile = imgTexture.src
            // console.log(selectedFile)
        }
    }
})

sendBtn.addEventListener("click", e => {
    const name = textureName.value
    fetch("./addtexture", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ file: selectedFile, name})
    }).then(response => {
        console.log("Done!")
        console.log(response)
        // console.log(JSON.parse(response))
    })
})


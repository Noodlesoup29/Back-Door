const uploadForm = document.getElementById("upload-form");
const saveFile = document.getElementById("save-file-input");
const dropZone = document.getElementById("drop-zone");
const uploadFormTxt = document.getElementById("upload-form-field-container");
const downloadBtn = document.getElementById("file-download-btn");
const fieldSearchBar = document.getElementById("upload-form-field-search");
const changeFileBtn = document.getElementById("change-input-file-btn");

let fileName = "";
let initialFileValue = "";

class Field {

    constructor(name, field) {
        this.name = name;
        this.field = field;
    }

    createRow() {

        //Delcare Elements
        const elementContainer = document.createElement("div");
        const elementMiniContainerName = document.createElement("div");
        const elementMiniContainerValue = document.createElement("div");
        const elementName = document.createElement("p");
        const elementValue = document.createElement("input");

        const elementHeaderName = document.createElement("h3");
        const elementHeaderValue = document.createElement("h3");

        //Set structure
        elementMiniContainerName.appendChild(elementHeaderName);
        elementMiniContainerName.appendChild(elementName);

        elementMiniContainerValue.appendChild(elementHeaderValue);
        elementMiniContainerValue.appendChild(elementValue);

        elementContainer.appendChild(elementMiniContainerName);
        elementContainer.appendChild(elementMiniContainerValue);

        //Set styles
        elementContainer.classList.add("form-field-container-row");
        elementMiniContainerName.classList.add("form-field-mini-container");
        elementMiniContainerValue.classList.add("form-field-mini-container");
        elementName.classList.add("form-field-name");
        elementValue.classList.add("form-field-value");
        elementHeaderName.classList.add("form-field-name-label");
        elementHeaderValue.classList.add("form-field-name-label");

        //Set values
        elementName.textContent = (this.name.length == 0) ? ("") : this.name;
        elementValue.value = (this.field.length == 0) ? ("") : this.field;

        elementHeaderName.textContent = "Field Name";
        elementHeaderValue.textContent = "Field Value";

        return elementContainer;

    }
}

function getGameAPIDecoderEndpoint() {

    let url = window.location.pathname;
    let currentURL = url.slice(7); //Slices "/games/" out

    switch (currentURL) {

        case "hyperlight-drifter":
            return "/decoder/hyperlight-drifter";
        break;

        case "undertale":
            return "/decoder/undertale";
        break;

        case "celeste":
            return "/decoder/celeste";
        break;

        case "subnautica":
            return "/decoder/subnautica";
        break;
        

    }

    return url;

}

function getGameAPIEncoderEndpoint() {

    let url = window.location.pathname;
    let currentURL = url.slice(7); //Slices "/games/" out

    switch (currentURL) {

        case "hyperlight-drifter":
            return "/encoder/hyperlight-drifter";
        break;

        case "undertale":
            return "/encoder/undertale";
        break;

        case "celeste":
            return "/encoder/celeste";
        break;

        case "subnautica":
            return "/encoder/subnautica";
        break;

    }

    return url;

}

function cleanFieldValue(value) {
    value = value.trim();

    if (value === "") {
        return "";
    }

    if (!isNaN(value)) {
        return Number(value);
    }

    return value;
}

changeFileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.reload();
})

uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
});

fieldSearchBar.addEventListener("input", (e) => {

    const listOfElements = document.querySelectorAll(".form-field-container-row");
    const searchValue = e.target.value.toLowerCase();

    for (let row of listOfElements) {

        const fieldNameElement = row.querySelector(".form-field-name");
        const fieldName = fieldNameElement.textContent.toLowerCase();

        const match = fieldName.includes(searchValue);
        row.style.display = (match) ? ("") : ("none");

    }

})

downloadBtn.addEventListener("click", async (e)=> {

    e.preventDefault();

    const rows = document.querySelectorAll(".form-field-container-row");
    const jsonObject = {};

    if (rows.length === 0)
        return;

    for (const row of rows) {
        const nameElement = row.querySelector(".form-field-name");
        const valueElement = row.querySelector(".form-field-value");

        const fieldName = nameElement.textContent;
        const fieldValue = cleanFieldValue(valueElement.value);

        jsonObject[fieldName] = fieldValue;
    }

    const response = await fetch(getGameAPIEncoderEndpoint(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            originalFileText : initialFileValue,
            updatedJson: jsonObject
        })
    });

    const result = await response.json();

    const blob = new Blob([result.encodedText], {
        type: "application/octet-stream"
    })

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    link.click();

    URL.revokeObjectURL(url);

})

saveFile.addEventListener("change", async (e) => {

    e.preventDefault();

    let file = saveFile.files[0];
    if (!file) return;

    initialFileValue = await file.text();
    fileName = file.name;

    const response = await fetch(getGameAPIDecoderEndpoint(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fileText: initialFileValue
        })
    });

    const result = await response.json();

    if (result.decodedText.length !== 0) {
        dropZone.style.display = "none";
        uploadFormTxt.style.display = "grid";
        
        for(const [fieldName, fieldValue] of Object.entries(result.decodedText)) {

            const field = new Field(fieldName, fieldValue);
            uploadFormTxt.appendChild(field.createRow());

        }

    }

})
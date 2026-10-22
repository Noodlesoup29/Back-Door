
const uploadForm = document.getElementById("upload-form");
const saveFile = document.getElementById("save-file-input");
const dropZone = document.getElementById("drop-zone");
const uploadFormTxt = document.getElementById("upload-form-field-container");
const downloadBtn = document.getElementById("file-download-btn");
const fieldSearchBar = document.getElementById("upload-form-field-search");
const changeFileBtn = document.getElementById("change-input-file-btn");

const root = getComputedStyle(document.documentElement);

let fileName = "";
let initialFileValue = "";
let originalJSON = {};      
let gameName = window.location.pathname.slice(7); 

class Field {

    constructor(name, field) {
        this.name = name;
        this.field = field;
    }

    createRow() {

        //Declare Elements
        const elementContainer = document.createElement("div");
        const elementMiniContainerName = document.createElement("div");
        const elementMiniContainerValue = document.createElement("div");

        const elementName = document.createElement("p");
        const elementValue = document.createElement("input");
        const elementSafeRange = document.createElement("p");

        const elementHeaderName = document.createElement("h3");
        const elementHeaderValue = document.createElement("h3");

        //Set structure
        elementMiniContainerName.appendChild(elementHeaderName);
        elementMiniContainerName.appendChild(elementName);

        elementMiniContainerValue.appendChild(elementHeaderValue);
        elementMiniContainerValue.appendChild(elementValue);
        elementMiniContainerValue.appendChild(elementSafeRange);

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

        elementSafeRange.classList.add("form-field-safe-range");

        //Set values
        elementName.textContent = (this.name.length == 0) ? ("") : this.name;
        elementValue.value = (this.field.length == 0) ? ("") : this.field;
        elementValue.dataset.original = this.field;

        elementHeaderName.textContent = "Field Name";
        elementHeaderValue.textContent = "Field Value";

        elementSafeRange.textContent = "";

        elementValue.addEventListener("change", async (e) => {
            try{ 
                const oldValue = cleanFieldValue(e.target.dataset.original);
                const newValue = cleanFieldValue(e.target.value);

                if (newValue === oldValue) {
                    elementValue.style.borderColor = "#cfcbc5";
                    elementSafeRange.textContent = "";
                    return;
                }

                const change = {
                    variableName: this.name,
                    old: oldValue,
                    new: newValue
                };
                
                const response = await fetch("/analyze-change", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ originalJSON, change, gameName })
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Failed to analyze change");
                }

                console.log(this.name, oldValue, "to", newValue, "riskLevel:", result.riskLevel);
            
                const colors = {
                    1: root.getPropertyValue("--success"),
                    2: root.getPropertyValue("--warning"),
                    3: root.getPropertyValue("--danger")
                };

                elementValue.style.borderColor = colors[Number(result.riskLevel)];

                elementSafeRange.textContent = (result.safeRange) ? `Safe Range: ${result.safeRange}` : "";
                
                console.log("safeRange:", result.safeRange, "riskLevel:", result.riskLevel);
            }
            catch(error){
                console.error("Error when changing game variables:", error);
            }
        });

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

async function handleFile(file) {
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
    originalJSON = result.decodedText;

    if (result.decodedText.length !== 0) {
        dropZone.style.display = "none";
        uploadFormTxt.style.display = "grid";
        
        for(const [fieldName, fieldValue] of Object.entries(result.decodedText)) {

            const field = new Field(fieldName, fieldValue);
            uploadFormTxt.appendChild(field.createRow());

        }

    }
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

    handleFile(saveFile.files[0]);

})

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    console.log("dragover");
    dropZone.style.backgroundColor = "#cfcbc5";
})

dropZone.addEventListener("dragleave", (e) => {
    console.log("dragleave");
    dropZone.style.backgroundColor = "";
})

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log("drop");
    dropZone.style.backgroundColor = "";
    handleFile(e.dataTransfer.files[0]);
})
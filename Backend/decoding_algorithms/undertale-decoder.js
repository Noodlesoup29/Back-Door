export function decodeUndertale(fileText) {
    
    const lines = fileText.replace(/\r/g, "").split("\n");
    const decodedJson = {};

    const knownPairings = {
        1: "Save Name",
        2: "LV",
        3: "Max HP",
        5: "Attack",
        6: "Weapon Attack",
        7: "Defense",
        8: "Armor Defense",
        11: "Gold",
        12: "Kills",
        29: "Weapon",
        30: "Armor",
        36: "Fun Value",
        531: "Asriel Fight Mode",
        548: "Room Number"
    };

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        const fieldName = knownPairings[lineNumber];

        if (fieldName) {
            decodedJson[fieldName] = line.trim();
        } else {
            decodedJson[`Line ${lineNumber}`] = line.trim();
        }
    });

    return decodedJson;

}

export function encodeUndertale(originalFileText, updatedJson) {

    //OriginalFileText is not needed

    const updJSON = updatedJson;
    let returnString = "";

    Object.entries(updJSON).forEach(([key, value]) => {
        returnString += value + "\r\n";
    });
    
    return returnString.slice(0,returnString.length-4);

}


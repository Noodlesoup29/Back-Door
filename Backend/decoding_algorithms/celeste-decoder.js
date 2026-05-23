import { XMLParser, XMLBuilder } from "fast-xml-parser";

const parser = new XMLParser({
    ignoreAttributes: false
});

const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true
});

export function decodeCeleste(fileText) {
    
    const json = parser.parse(fileText);
    const saveData = json.SaveData;

    const decodedJson = {
        "Version": saveData.Version,
        "Name": saveData.Name,
        "Time": saveData.Time,
        "Cheat Mode": saveData.CheatMode,
        "Assist Mode": saveData.AssistMode,
        "Variant Mode": saveData.VariantMode,
        "Game Speed": saveData.Assists.GameSpeed,
        "Invincible": saveData.Assists.Invincible,
        "Dash Mode": saveData.Assists.DashMode,
        "Dash Assist": saveData.Assists.DashAssist,
        "Infinite Stamina": saveData.Assists.InfiniteStamina,
        "Unlocked Areas": saveData.UnlockedAreas,
        "Total Deaths": saveData.TotalDeaths,
        "Total Strawberries": saveData.TotalStrawberries,
        "Total Golden Strawberries": saveData.TotalGoldenStrawberries,
        "Total Jumps": saveData.TotalJumps,
        "Total Wall Jumps": saveData.TotalWallJumps,
        "Total Dashes": saveData.TotalDashes,
        "Revealed Chapter 9": saveData.RevealedChapter9
    };

    return decodedJson;
}

export function encodeCeleste(originalFileText, updatedJson) {
    const json = parser.parse(originalFileText);
    const saveData = json.SaveData;

    saveData.Name = updatedJson["Name"];
    saveData.Time = Number(updatedJson["Time"]);

    saveData.CheatMode = updatedJson["Cheat Mode"] === "true";
    saveData.AssistMode = updatedJson["Assist Mode"] === "true";
    saveData.VariantMode = updatedJson["Variant Mode"] === "true";

    saveData.Assists.GameSpeed = Number(updatedJson["Game Speed"]);
    saveData.Assists.Invincible = updatedJson["Invincible"] === "true";
    saveData.Assists.DashMode = updatedJson["Dash Mode"];
    saveData.Assists.DashAssist = updatedJson["Dash Assist"] === "true";
    saveData.Assists.InfiniteStamina = updatedJson["Infinite Stamina"] === "true";

    saveData.UnlockedAreas = Number(updatedJson["Unlocked Areas"]);
    saveData.TotalDeaths = Number(updatedJson["Total Deaths"]);
    saveData.TotalStrawberries = Number(updatedJson["Total Strawberries"]);
    saveData.TotalGoldenStrawberries = Number(updatedJson["Total Golden Strawberries"]);
    saveData.TotalJumps = Number(updatedJson["Total Jumps"]);
    saveData.TotalWallJumps = Number(updatedJson["Total Wall Jumps"]);
    saveData.TotalDashes = Number(updatedJson["Total Dashes"]);

    saveData.RevealedChapter9 = updatedJson["Revealed Chapter 9"] === "true";

    return builder.build(json);
}


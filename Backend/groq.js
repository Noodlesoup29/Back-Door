import "dotenv/config";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
const GROQ_MODEL = "openai/gpt-oss-120b";

export async function detectSaveStructure(rawSaveFile){
    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
            {
                role: "system",
                content: `You are a save file format expert. Given raw save file content analyze:
                    1. Prefix length (0 if none)
                    2. Prefix type (hash, checksum, version, none)
                    3. Encoding (base64, hex, plain, compressed)
                    4. Data format underneath (JSON, XML, key-value)
                    5. Null terminator present (true/false)
                    6. Compression type (zlib, gzip, lz4, none)
                    7. Endianness (little, big, none)
                    8. Suffix length (0 if none)
                    9. Suffix type (hash, checksum, version, none)
                    10. Multiple files involved (true/false)
                    11. Line ending (LF, CRLF, none)
                    12. Secondary encoding (base64, hex, none)
                    Respond in JSON only:
                    {
                        "prefixLength": null,
                        "prefixType": null,
                        "encoding": null,
                        "dataFormat": null,
                        "nullTerminator": null,
                        "compression": null,
                        "endianness": null,
                        "suffixLength": null,
                        "suffixType": null,
                        "multipleFiles": null,
                        "lineEnding": null,
                        "encoding2": null
                    }`
            },
            {
                role: "user",
                content: `Note that the file may have a prefix followed by differently encoded data.
                Analyze the FULL content not just the beginning: ${rawSaveFile.slice(0, 500)}`
            }
        ]
    })

    const raw = response.choices[0].message.content.trim();
    return JSON.parse(raw);
}

export async function analyzeSaveFile(originalJSON, change, gameName) {
    console.log("analyzeSaveFile called");
    try{
        
        const folderPath = "./ai_notes"
        const infoFolder = fs.readdirSync(folderPath);
        let gameInfo = "";

        for(const filePath of infoFolder){

            const fileName = path.basename(filePath, "-info.txt");

            if(fileName === gameName){
                gameInfo = fs.readFileSync(`${folderPath}/${filePath}`, "utf-8");
            }
        }

        //const additionalInfo = gameInfo ? `Additional game info: ${gameInfo}` : "";

        const response = await groq.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                {
                    role: "system",
                    content: 
                        `
                        You are a game save file expert. 
                        For the game: ${gameName}, variable "${change.variableName}" was changed from ${change.old} to ${change.new}.
                        ${gameInfo}
                        You are given the full save file for context.
                        1. Analyze a change to the game and assign a risk level:
                            1 = safe (simple numeric stats, display names, visual settings, difficulty toggles)
                            2 = risky (progression flags, unlocks, counters, timers, inventory)
                            3 = dangerous (structural data, encoded strings, coordinates, room IDs, event arrays, enemy states)
                        2. Suggest safe value ranges whenever possible. If unknown, return null.
                        Respond in JSON only, with exactly one number for riskLevel. Do not wrap in markdown or backticks. Example:
                        {
                            "riskLevel": 1,
                            "safeRange": "0-100"
                        }
                        `
                },
                {
                    role: "user",
                    content: `Full save file for context: ${JSON.stringify(originalJSON)}. 
                            Analyze this change: "${change.variableName}" changed from ${change.old} to ${change.new}.
                            Look at the complexity of other values in the save file to calibrate your risk assessment.`
                }
            ]
        })

        console.log(gameInfo);

        const raw = response.choices[0].message.content.trim();
        console.log(raw);
        return JSON.parse(raw);
    }
    catch(error){
        console.log("analyzeSaveFile error:", error);
        throw error;
    }
}


/*

import { decodeHyperlight, encodeHyperlight } from "./decoding_algorithms/hyperlight-decoder.js";

const rawText = fs.readFileSync("/Users/ryandeng/Desktop/Ryan_code/Back-Door/Assests/testing_game_files/hyperlight_recordofthedrifter_0.sav", "utf-8");

const decodedJSON = decodeHyperlight(rawText);

let change = {
    variableName: "sword",
    old: 10,
    new: "false"
}


const flags = await analyzeSaveFile(decodedJSON, change, "Hyperlight Drifter");
console.log("Without context", flags);

const flags2 = await analyzeSaveFile(decodedJSON, change, "Hyperlight Drifter", "Health in Hyperlight Drifter maxes out at 8. Values above 8 are invalid.");
console.log("With context", flags2);
*/
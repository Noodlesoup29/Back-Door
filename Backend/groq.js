import "dotenv/config";
import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

export async function detectSaveStructure(rawSaveFile){
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
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

    return response.choices[0].message.content;
}

export async function analyzeSaveFile(decodedJSON, gameName) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: 
                    `
                    You are a game save file expert. For each variable:
                    1. Assign a risk level:
                        1 = safe to change freely
                        2 = low risk, minor consequences
                        3 = medium risk, could affect progression
                        4 = high risk, could break the game
                    2. Suggest safe value ranges where possible
                    Respond in JSON only.
                    `
            }
        ]
    })

    return response.choices[0].message.content;
}

/*import fs from "fs";

const raw = fs.readFileSync("/Users/ryandeng/Desktop/Ryan_code/Back-Door/Backend/testing_game_files/hyperlight_recordofthedrifter_0.sav", "utf-8");
const structure = await detectSaveStructure(raw);
console.log(structure);*/

import fs from "fs";
import { decodeHyperlight, encodeHyperlight } from "./decoding_algorithms/hyperlight-decoder.js";

const rawText = fs.readFileSync("/Users/ryandeng/Desktop/Ryan_code/Back-Door/Backend/testing_game_files/hyperlight_recordofthedrifter_0.sav", "utf-8");

const decodedJSON = decodeHyperlight(rawText);

const flags = await analyzeSaveFile(decodedJSON)
console.log(flags);

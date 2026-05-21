function decodeHyperlight(fileText) {
    
    const base64 = fileText.trim();

    // base64 -> raw bytes
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));

    // find first {
    const startIndex = bytes.indexOf("{".charCodeAt(0));
    if (startIndex === -1) {
      return "Could not find starting JSON";
    }

    // find matching }
    let depth = 0;
    let endIndex = -1;

    for (let i = startIndex; i < bytes.length; i++) {
      if (bytes[i] === "{".charCodeAt(0)) {
        depth++;
      } else if (bytes[i] === "}".charCodeAt(0)) {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex === -1) {
      return "Could not find JSON end";
    }

    // split file
    const prefixBytes = bytes.slice(0, startIndex);
    const jsonBytes = bytes.slice(startIndex, endIndex + 1);
    const suffixBytes = bytes.slice(endIndex + 1);

    // decode only JSON section
    const text = new TextDecoder().decode(jsonBytes);

    return JSON.parse(text);

}

function encodeHyperlight(originalFileText, updatedJson) {
    
    const base64 = originalFileText.trim();

    // base64 -> raw bytes
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));

    // find first {
    const startIndex = bytes.indexOf("{".charCodeAt(0));
    if (startIndex === -1) {
      return "Could not find starting JSON";
    }

    // find matching }
    let depth = 0;
    let endIndex = -1;

    for (let i = startIndex; i < bytes.length; i++) {
      if (bytes[i] === "{".charCodeAt(0)) {
        depth++;
      } else if (bytes[i] === "}".charCodeAt(0)) {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex === -1) {
      return "Could not find JSON end";
    }

    // split file
    const prefixBytes = bytes.slice(0, startIndex);
    const suffixBytes = bytes.slice(endIndex + 1);

    // re-encode JSON section
    const newJsonBytes = new TextEncoder().encode(JSON.stringify(updatedJson));

    // rebuild full byte array
    const rebuiltBytes = new Uint8Array(
      prefixBytes.length + newJsonBytes.length + suffixBytes.length
    );

    rebuiltBytes.set(prefixBytes, 0);
    rebuiltBytes.set(newJsonBytes, prefixBytes.length);
    rebuiltBytes.set(suffixBytes, prefixBytes.length + newJsonBytes.length);

    // bytes -> base64
    const rebuiltBinaryString = Array.from(rebuiltBytes, b =>
      String.fromCharCode(b)
    ).join("");
    const newBase64 = btoa(rebuiltBinaryString);

    return newBase64;

}

module.exports = {
    decodeHyperlight,
    encodeHyperlight
};
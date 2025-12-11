const axios = require('axios');

async function verifySignature() {
    try {
        const res = await axios.get('http://localhost:3000/agify?name=signaturetest');
        console.log(JSON.stringify(res.data, null, 2));

        if (res.data.servi_par === "cache-misere" && res.data.realise_par === "David Fasani") {
            console.log("\n[SUCCESS] Signature verified!");
        } else {
            console.log("\n[FAILURE] Signature missing or incorrect.");
        }
    } catch (e) {
        console.error(e.message);
    }
}

verifySignature();

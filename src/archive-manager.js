const fs = require('fs-extra');
const path = require('path');

const ARCHIVE_FILE = path.join(__dirname, '../data/quotable_archive.json');

// Ensure data directory exists
fs.ensureDirSync(path.join(__dirname, '../data'));

async function addQuote(quote) {
    try {
        let archive = [];
        if (await fs.pathExists(ARCHIVE_FILE)) {
            archive = await fs.readJson(ARCHIVE_FILE);
        }

        // Check for duplicates by _id
        const exists = archive.some(q => q._id === quote._id);
        if (!exists) {
            archive.push(quote);
            await fs.writeJson(ARCHIVE_FILE, archive, { spaces: 2 });
            console.log(`[ARCHIVE] Added new quote: ${quote._id}`);
            return true;
        }
    } catch (err) {
        console.error('Error adding to archive:', err);
    }
    return false;
}

async function getRandomQuote() {
    try {
        if (await fs.pathExists(ARCHIVE_FILE)) {
            const archive = await fs.readJson(ARCHIVE_FILE);
            if (archive.length > 0) {
                const randomIndex = Math.floor(Math.random() * archive.length);
                return archive[randomIndex];
            }
        }
    } catch (err) {
        console.error('Error reading archive:', err);
    }
    return null;
}

module.exports = {
    addQuote,
    getRandomQuote
};

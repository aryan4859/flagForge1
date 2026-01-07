import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'flag.forge';
const DATA_PATH = path.join(__dirname, '../lib/instagram-data.json');

async function updateInstagramData() {
    console.log(`Updating Instagram data for @${USERNAME}...`);

    try {
        
        // Use Instagram Graph API or Meta for developer for API.

        // For now, we use a public viewer as a proxy to avoid some blocks
        const response = await fetch(`https://www.instagram.com/${USERNAME}/embed/captioned/`);
        const html = await response.text();

        // This is a very basic regex to find post links. 
        // In a real scenario, you'd want a more robust parser.
        const postLinks = [...html.matchAll(/https:\/\/www\.instagram\.com\/p\/([^/"]+)/g)]
            .map(match => match[0])
            .filter((value, index, self) => self.indexOf(value) === index)
            .slice(0, 3);

        if (postLinks.length === 0) {
            console.warn("Could not find any posts. Instagram might be blocking the request.");
            return;
        }

    } catch (error) {
        console.error("Error updating Instagram data:", error);
    }
}

updateInstagramData();

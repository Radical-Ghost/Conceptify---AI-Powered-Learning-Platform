/**
 * Cleanup utility for OCR data folder
 * Removes empty or corrupted JSON files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');

console.log('🧹 Cleaning up OCR data folder...');
console.log(`📁 Directory: ${dataDir}\n`);

if (!fs.existsSync(dataDir)) {
    console.log('⚠️  Data directory does not exist');
    process.exit(0);
}

const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
let removedCount = 0;
let errorCount = 0;
let validCount = 0;

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const stats = fs.statSync(filePath);
    
    // Check if file is empty
    if (stats.size === 0) {
        console.log(`❌ Removing empty file: ${file}`);
        fs.unlinkSync(filePath);
        removedCount++;
        return;
    }
    
    // Try to parse JSON
    try {
        const content = fs.readFileSync(filePath, 'utf8').trim();
        
        if (!content) {
            console.log(`❌ Removing file with empty content: ${file}`);
            fs.unlinkSync(filePath);
            removedCount++;
            return;
        }
        
        JSON.parse(content);
        console.log(`✅ Valid: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        validCount++;
        
    } catch (err) {
        console.log(`❌ Removing corrupted file: ${file} - ${err.message}`);
        fs.unlinkSync(filePath);
        errorCount++;
    }
});

console.log('\n' + '='.repeat(60));
console.log('📊 Cleanup Summary:');
console.log(`  ✅ Valid files: ${validCount}`);
console.log(`  ❌ Removed (empty): ${removedCount}`);
console.log(`  ❌ Removed (corrupted): ${errorCount}`);
console.log(`  📁 Total cleaned: ${removedCount + errorCount}`);
console.log('='.repeat(60));

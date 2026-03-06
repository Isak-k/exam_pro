// Quick verification script to check if Amharic translations exist
// Run with: node verify-amharic.js

const fs = require('fs');

console.log('🔍 Verifying Amharic Translations...\n');

try {
    const content = fs.readFileSync('src/lib/i18n.ts', 'utf8');
    
    // Check for Amharic section
    const hasAmharic = content.includes('am: {');
    console.log(hasAmharic ? '✅ Amharic section exists' : '❌ Amharic section missing');
    
    // Check for AI Assistant section in Amharic
    const amSection = content.split('am: {')[1];
    if (amSection) {
        const hasAiAssistant = amSection.includes('"aiAssistant"');
        console.log(hasAiAssistant ? '✅ aiAssistant section exists in Amharic' : '❌ aiAssistant section missing in Amharic');
        
        const hasPrompts = amSection.includes('"prompts"');
        console.log(hasPrompts ? '✅ prompts section exists' : '❌ prompts section missing');
        
        // Check for all prompt IDs
        const promptIds = ['b1', 'b2', 'b3', 'b4', 'b5', 'i1', 'i2', 'i3', 'i4', 'i5', 'a1', 'a2', 'a3', 'a4', 'admin1'];
        console.log('\n📝 Checking individual prompts:');
        
        let allFound = true;
        promptIds.forEach(id => {
            const pattern = `"${id}": {`;
            const found = amSection.includes(pattern);
            console.log(found ? `  ✅ ${id}` : `  ❌ ${id} missing`);
            if (!found) allFound = false;
        });
        
        console.log('\n' + (allFound ? '✅ All prompts found!' : '❌ Some prompts are missing'));
    } else {
        console.log('❌ Could not find Amharic section');
    }
    
    // Check file size
    const stats = fs.statSync('src/lib/i18n.ts');
    console.log(`\n📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📊 Total lines: ${content.split('\n').length}`);
    
    console.log('\n✅ Verification complete!');
    console.log('\nIf all checks passed but translations still don\'t show in browser:');
    console.log('1. Clear browser cache (Ctrl+Shift+Delete)');
    console.log('2. Hard refresh (Ctrl+Shift+R)');
    console.log('3. Try incognito/private window');
    console.log('4. Check browser console for errors (F12)');
    
} catch (error) {
    console.error('❌ Error reading file:', error.message);
}

// convertToJson.js
// convertToJson is the module name

function convertPromptToJson(data) {
    if (typeof data !== 'string') {
        throw new Error('Input must be a string.');
    }

    // Remove emojis, non-ASCII characters, and excessive whitespace
    data = data.replace(/[^\u0000-\u007F]/g, '') // Removes emojis and non-ASCII characters
               .replace(/\s+/g, ' ')              // Collapses multiple spaces into one
               .trim();                            // Removes leading and trailing whitespace

    data = data.replace(/"/g, '\\"')           // Escapes double quotes
               .replace(/'/g, "\\'");          // Escapes single quotes

    return data; // Return the cleaned string
}

module.exports = convertPromptToJson; // Export the function for reuse

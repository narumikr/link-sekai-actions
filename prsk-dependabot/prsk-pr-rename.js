/**
 * Dependabot PR Title Renamer for Project SEKAI
 */

const fs = require('fs');
const path = require('path');

// Extract library info from Dependabot PR title
function parseDependabotTitle(title) {
  // Pattern: "Bump <library> from <fromVersion> to <toVersion>" optionally followed by " in <path>"
  const match = title.match(/^Bump (.+) from ([^ ]+) to ([^ ]+)(?: in .+)?$/);

  if (!match) {
    return null;
  }

  return {
    library: match[1],
    fromVersion: match[2],
    toVersion: match[3]
  };
}

// Load characters from JSON file
function loadCharacters(actionPath) {
  const constantsPath = path.join(actionPath, 'prsk-notice.constants.json');
  try {
    const data = fs.readFileSync(constantsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to load characters: ${constantsPath} - ${err.message}`);
  }
}

// Select a random character
function selectRandomCharacter(characters) {
  const keys = Object.keys(characters);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return characters[randomKey];
}

// Generate new PR title
function generateNewTitle(libraryInfo, character) {
  const { library, fromVersion, toVersion } = libraryInfo;
  const comment = character.comment.replace('{library}', library);

  return `${character.icon}${character.name}${character.icon} ${comment}【${fromVersion} → ${toVersion}】`;
}

module.exports = {
  parseDependabotTitle,
  loadCharacters,
  selectRandomCharacter,
  generateNewTitle
};

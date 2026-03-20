/**
 * Dependabot PR Title Renamer for Project SEKAI
 */

const fs = require('fs');
const path = require('path');

// Constants
const LIBRARY_PLACEHOLDER = '{library}';
const VERSION_SEPARATOR = ' → ';

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
  if (keys.length === 0) {
    throw new Error('No characters available');
  }
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return characters[randomKey];
}

// Generate new PR title
function generateNewTitle(libraryInfo, character) {
  const { library, fromVersion, toVersion } = libraryInfo;

  // Validate character has required fields with proper types
  if (!character ||
      typeof character.icon !== 'string' || character.icon.trim() === '' ||
      typeof character.name !== 'string' || character.name.trim() === '' ||
      typeof character.comment !== 'string' || character.comment.trim() === '') {
    throw new Error('Character object is missing required fields (icon, name, or comment) or fields are empty');
  }

  const comment = character.comment.split(LIBRARY_PLACEHOLDER).join(library);

  return `${character.name} ${character.icon} | ${comment}【${fromVersion}${VERSION_SEPARATOR}${toVersion}】`;
}

module.exports = {
  loadCharacters,
  selectRandomCharacter,
  generateNewTitle
};

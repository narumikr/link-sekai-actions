/**
 * Project SEKAI PR Labeling Logic
 */

const fs = require('fs');
const path = require('path');
const { replaceTemplate } = require('./utils');

// Load constants from JSON file
function loadConstants(actionPath) {
  const constantsPath = path.join(actionPath, 'prsk-yell-label.constants.json');
  const profilePath = path.join(actionPath, '..', 'common', 'prsk-profile.constants.json');
  try {
    const data = JSON.parse(fs.readFileSync(constantsPath, 'utf-8'));
    const profiles = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));

    for (const key of Object.keys(data.prskCharacter)) {
      data.prskCharacter[key] = { ...profiles[key], ...data.prskCharacter[key] };
    }
    for (const key of Object.keys(data.vocaloidCharacter)) {
      data.vocaloidCharacter[key] = { ...profiles[key], ...data.vocaloidCharacter[key] };
    }
    return data;
  } catch (err) {
    throw new Error(`Failed to load constants: ${err.message}`);
  }
}

// Random select prsk character
function selectPrskCharacter(prskCharacter) {
  const keys = Object.keys(prskCharacter);
  if (keys.length === 0) {
    throw new Error('No Project SEKAI characters available');
  }
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return prskCharacter[randomKey];
}

// Random select vocaloid character
function selectVocaloidCharacter(vocaloidCharacter) {
  const keys = Object.keys(vocaloidCharacter);
  if (keys.length === 0) {
    throw new Error('No Vocaloid characters available');
  }
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return vocaloidCharacter[randomKey];
}

// Judge encounter
function isEncounter(probability = 0.25) {
  return Math.random() < probability;
}

// Create label text
function createLabelText(character) {
  return `${character.icon} | ${character.name}`;
}

// Create label or obtain existing label
async function ensureLabel(github, context, labelName, description, color) {
  try {
    await github.rest.issues.getLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: labelName,
    });
    console.log(`Label already exists: ${labelName}`);
  } catch (error) {
    if (error.status === 404) {
      await github.rest.issues.createLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        name: labelName,
        description: description,
        color: color,
      });
      console.log(`Created label: ${labelName}`);
    } else {
      throw error;
    }
  }
}

// Add label to PR
async function addLabels(github, context, labels) {
  await github.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    labels: labels,
  });
  console.log(`Added labels: ${labels.join(', ')} to PR #${context.issue.number}`);
}

module.exports = {
  loadConstants,
  replaceTemplate,
  selectPrskCharacter,
  selectVocaloidCharacter,
  isEncounter,
  createLabelText,
  ensureLabel,
  addLabels,
};

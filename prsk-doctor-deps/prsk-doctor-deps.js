const fs = require('fs');
const path = require('path');
const { getRandomPrskKey } = require('../common/get-prsk-key');

function loadReportComments(actionPath) {
  const constantsPath = path.join(actionPath, 'prsk-report-comment.constants.json');
  return JSON.parse(fs.readFileSync(constantsPath, 'utf-8'));
}

function loadAccounts(actionPath) {
  const accountsPath = path.join(actionPath, '..', 'common', 'prsk-accounts.constants.json');
  return JSON.parse(fs.readFileSync(accountsPath, 'utf-8'));
}

function loadProfiles(actionPath) {
  const profilePath = path.join(actionPath, '..', 'common', 'prsk-profile.constants.json');
  return JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
}

function selectCharacter(actionPath, core) {
  const reportComments = loadReportComments(actionPath);
  const accounts = loadAccounts(actionPath);
  const profiles = loadProfiles(actionPath);

  const characterKey = getRandomPrskKey();

  const charConstants = reportComments[characterKey];
  const charAccount = accounts[characterKey];
  const charProfile = profiles[characterKey];

  if (!characterKey) {
    throw new Error('Character key mapping not found.');
  }

  if (!charConstants) {
    throw new Error(`Character report comment not found for key: ${characterKey}`);
  }

  if (!charAccount) {
    throw new Error(`Character account not found for key: ${characterKey}`);
  }

  if (!charProfile) {
    throw new Error(`Character profile not found for key: ${characterKey}`);
  }

  const comments = charConstants.comment;
  const comment = Array.isArray(comments)
    ? comments[Math.floor(Math.random() * comments.length)]
    : comments;

  core.setOutput('character-name', charAccount.name);
  core.setOutput('character-email', charAccount.email);
  core.setOutput('character-icon', charProfile.icon);
  core.setOutput('character-comment', comment);
}

module.exports = { selectCharacter };

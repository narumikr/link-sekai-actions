/**
 * Project SEKAI PR Labeling Logic
 */

const fs = require('fs');
const path = require('path');

// Load constants from JSON file
function loadConstants(actionPath) {
  const constantsPath = path.join(actionPath, 'prsk-yell-label.constants.json');
  try {
    const data = fs.readFileSync(constantsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Failed to load constants: ${constantsPath} - ${err.message}`);
  }
}

// Replace template placeholders
function replaceTemplate(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{${key}}`;
    result = result.split(placeholder).join(value);
  }
  return result;
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

// Get today's date in MM/DD format (JST)
function getToday() {
  const today = new Date();
  // More reliable timezone conversion
  const jstOffset = 9 * 60; // JST is UTC+9
  const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
  const jstDate = new Date(utc + (jstOffset * 60000));

  const month = (jstDate.getMonth() + 1).toString().padStart(2, '0');
  const day = jstDate.getDate().toString().padStart(2, '0');

  return `${month}/${day}`;
}

// Collaboration comment
function createCollaborationComment(mainChar, guestChar, prAuthor, collaborationScenarios) {
  if (!Array.isArray(collaborationScenarios) || collaborationScenarios.length === 0) {
    throw new Error('No collaboration scenarios available');
  }
  const scenario = collaborationScenarios[Math.floor(Math.random() * collaborationScenarios.length)];

  const storyText = replaceTemplate(scenario.story, {
    main: mainChar.name,
    guest: guestChar.name,
    prAuthor: prAuthor,
  });

  const mainComment = replaceTemplate(mainChar.comment, { prAuthor: prAuthor });
  const guestComment = replaceTemplate(guestChar.comment, { prAuthor: prAuthor });

  return `## ${scenario.title}\n\n${storyText}\n\n---\n### 🎸 素敵な出会いに\n\n **${mainChar.name}**\n\n${mainComment}\n\n**${guestChar.name}**\n\n${guestComment}\n\n> 2人にはたくさんの元気をもらったな✨ ー${getToday()}ー`;
}

// Single comment
function createSingleComment(character, prAuthor) {
  const comment = replaceTemplate(character.comment, { prAuthor: prAuthor });

  return `🎵 **${character.name}** が会いに来てくれた✨\n\n${comment}\n\n> (￣△￣*) .｡oO( 今日も最高な一日だな ー${getToday()}ー`;
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

// Post comment to PR
async function postComment(github, context, body) {
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body: body,
  });
  console.log(`Posted comment to PR #${context.issue.number}`);
}

/**
 * Main logic to handle PR labeling and commenting
 */
async function handlePrLabeling(github, context, actionPath) {
  const constants = loadConstants(actionPath);
  const { prskCharacter, vocaloidCharacter, collaborationScenarios } = constants;

  // Validate required data exists
  if (!context.payload.pull_request || !context.payload.pull_request.user) {
    throw new Error('Pull request data is missing from context');
  }

  const prAuthor = context.payload.pull_request.user.login;

  // Select random prsk character
  const selectedPrskChar = selectPrskCharacter(prskCharacter);
  const prskLabelName = createLabelText(selectedPrskChar);
  const prskLabelNameComment = replaceTemplate(selectedPrskChar.comment, {
    prAuthor: prAuthor,
  });

  let labelsToAdd = [prskLabelName];
  let commentBody = '';

  // Judge encounter event
  const hasEncounter = isEncounter();
  console.log(`Vocaloid encounter occurred: ${hasEncounter}`);

  if (hasEncounter) {
    // Select random vocaloid character
    const selectedVocaloid = selectVocaloidCharacter(vocaloidCharacter);
    const vocaloidLabelName = createLabelText(selectedVocaloid);
    const vocaloidComment = replaceTemplate(selectedVocaloid.comment, { prAuthor: prAuthor });

    labelsToAdd.push(vocaloidLabelName);

    // Create collaboration comment
    commentBody = createCollaborationComment(selectedPrskChar, selectedVocaloid, prAuthor, collaborationScenarios);

    // Create vocaloid label
    await ensureLabel(
      github,
      context,
      vocaloidLabelName,
      vocaloidComment,
      selectedVocaloid.color,
    );
  } else {
    // Create single comment
    commentBody = createSingleComment(selectedPrskChar, prAuthor);
  }

  // Create prsk label
  await ensureLabel(
    github,
    context,
    prskLabelName,
    prskLabelNameComment,
    selectedPrskChar.color,
  );

  // Add labels to PR
  await addLabels(github, context, labelsToAdd);

  // Post comment to PR
  await postComment(github, context, commentBody);
}

module.exports = {
  loadConstants,
  replaceTemplate,
  selectPrskCharacter,
  selectVocaloidCharacter,
  isEncounter,
  createLabelText,
  getToday,
  createCollaborationComment,
  createSingleComment,
  ensureLabel,
  addLabels,
  postComment,
  handlePrLabeling,
};

/**
 * Project SEKAI PR Comments Logic
 */

const { replaceTemplate } = require('./utils');

// Random select character comment
function selectCharacterComment(character, prAuthor) {
  if (character.comment.length === 0) {
    throw new Error(`No comments available for character: ${character.name}`);
  }
  const randomComment = character.comment[Math.floor(Math.random() * character.comment.length)];
  return replaceTemplate(randomComment, { prAuthor: prAuthor });
}

// Get today's date in MM/DD format (JST)
function getToday() {
  const today = new Date();
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

  const mainComment = selectCharacterComment(mainChar, prAuthor);
  const guestComment = selectCharacterComment(guestChar, prAuthor);

  return `## ${scenario.title}\n\n${storyText}\n\n---\n### 🎸 素敵な出会いに\n\n **${mainChar.name}**\n\n${mainComment}\n\n**${guestChar.name}**\n\n${guestComment}\n\n> 2人にはたくさんの元気をもらったな✨ ー${getToday()}ー`;
}

// Single comment
function createSingleComment(character, prAuthor) {
  const comment = selectCharacterComment(character, prAuthor);

  return `🎵 **${character.name}** が会いに来てくれた✨\n\n${comment}\n\n> (￣△￣*) .｡oO( 今日も最高な一日だな ー${getToday()}ー`;
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

module.exports = {
  selectCharacterComment,
  getToday,
  createCollaborationComment,
  createSingleComment,
  postComment,
};

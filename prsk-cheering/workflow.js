/**
 * Project SEKAI PR Cheering Workflow
 */

const {
  loadConstants,
  selectPrskCharacter,
  selectVocaloidCharacter,
  isEncounter,
  createLabelText,
  createLabelDescription,
  ensureLabel,
  addLabels,
} = require('./prsk-labeling-logic');

const {
  createCollaborationComment,
  createSingleComment,
  postComment,
} = require('./prsk-comments-logic');

async function handler(github, context, actionPath) {
  const constants = loadConstants(actionPath);
  const { prskCharacter, vocaloidCharacter, collaborationScenarios } = constants;

  if (!context.payload.pull_request || !context.payload.pull_request.user) {
    throw new Error('Pull request data is missing from context');
  }

  const prAuthor = context.payload.pull_request.user.login;

  const selectedPrskChar = selectPrskCharacter(prskCharacter);
  const prskLabelName = createLabelText(selectedPrskChar);
  const prskLabelDescription = createLabelDescription(selectedPrskChar);

  let labelsToAdd = [prskLabelName];
  let commentBody = '';

  const hasEncounter = isEncounter();
  console.log(`Vocaloid encounter occurred: ${hasEncounter}`);

  if (hasEncounter) {
    const selectedVocaloid = selectVocaloidCharacter(vocaloidCharacter);
    const vocaloidLabelName = createLabelText(selectedVocaloid);
    const vocaloidLabelDescription = createLabelDescription(selectedVocaloid);

    labelsToAdd.push(vocaloidLabelName);
    commentBody = createCollaborationComment(selectedPrskChar, selectedVocaloid, prAuthor, collaborationScenarios);

    await ensureLabel(github, context, vocaloidLabelName, vocaloidLabelDescription, selectedVocaloid.color);
  } else {
    commentBody = createSingleComment(selectedPrskChar, prAuthor);
  }

  await ensureLabel(github, context, prskLabelName, prskLabelDescription, selectedPrskChar.color);
  await addLabels(github, context, labelsToAdd);
  await postComment(github, context, commentBody);
}

module.exports = { handler };

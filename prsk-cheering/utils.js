/**
 * Project SEKAI PR Cheering Utilities
 */

// Replace template placeholders
function replaceTemplate(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{${key}}`;
    result = result.split(placeholder).join(value);
  }
  return result;
}

module.exports = { replaceTemplate };

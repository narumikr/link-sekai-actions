const fs = require('fs');
const path = require('path');

function getPrComment(actionPath, characterKey) {
  const constantsPath = path.join(actionPath, 'prsk-report-comment.constants.json');
  const comments = JSON.parse(fs.readFileSync(constantsPath, 'utf-8'));
  const char = comments[characterKey];
  if (!char) {
    throw new Error(`Character not found for key: ${characterKey}`);
  }
  const messages = char.comment;
  return Array.isArray(messages)
    ? messages[Math.floor(Math.random() * messages.length)]
    : messages;
}

module.exports = { getPrComment };

if (require.main !== module) return;

function getJSTDatetime() {
  const now = new Date();
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${jstDate.getUTCFullYear()}/${pad(jstDate.getUTCMonth() + 1)}/${pad(jstDate.getUTCDate())} ` +
    `${pad(jstDate.getUTCHours())}:${pad(jstDate.getUTCMinutes())}:${pad(jstDate.getUTCSeconds())} JST`
  );
}

const characterName = process.env.CHARACTER_NAME;
const characterIcon = process.env.CHARACTER_ICON;
const characterComment = process.env.CHARACTER_COMMENT;

const packageManager = process.env.PACKAGE_MANAGER || 'npm';

const runnerTemp = process.env.RUNNER_TEMP;
const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

const outdatedRaw = fs.readFileSync(path.join(runnerTemp, 'npm-outdated.txt'), 'utf-8').trim();
const auditRaw = fs.readFileSync(path.join(runnerTemp, 'npm-audit.json'), 'utf-8').trim();

const outdatedOutput = outdatedRaw || '（更新が必要なパッケージはありません）';

function formatAuditResult(auditJson) {
  const vulns = auditJson.metadata?.vulnerabilities ?? {};
  const { total = 0, critical = 0, high = 0, moderate = 0, low = 0, info = 0 } = vulns;

  if (total === 0) return '（脆弱性は検出されませんでした）';

  const lines = [
    `合計 ${total} 件の脆弱性が検出されました`,
    '',
    `critical : ${critical}`,
    `high     : ${high}`,
    `moderate : ${moderate}`,
    `low      : ${low}`,
    `info     : ${info}`,
    '',
    '----------------------------------------',
  ];

  for (const vuln of Object.values(auditJson.vulnerabilities ?? {})) {
    lines.push('');
    lines.push(`■ ${vuln.name} [${vuln.severity.toUpperCase()}]`);
    lines.push(`  影響バージョン: ${vuln.range}`);

    for (const via of vuln.via) {
      if (typeof via === 'object') {
        if (via.title) lines.push(`  ${via.title}`);
        if (via.url)   lines.push(`  ${via.url}`);
      }
    }

    if (vuln.fixAvailable === true) {
      lines.push(`  修正: npm audit fix で対応可能`);
    } else if (vuln.fixAvailable && typeof vuln.fixAvailable === 'object') {
      lines.push(`  修正: ${vuln.fixAvailable.name}@${vuln.fixAvailable.version} へのアップデートが必要`);
    } else {
      lines.push(`  修正: 現時点では自動修正不可`);
    }
  }

  return lines.join('\n');
}

// pnpm audit --json は npm v6 互換の形式（advisories 単位、total なし）で出力される
function formatPnpmAuditResult(auditJson) {
  const vulns = auditJson.metadata?.vulnerabilities ?? {};
  const { critical = 0, high = 0, moderate = 0, low = 0, info = 0 } = vulns;
  const total = critical + high + moderate + low + info;

  if (total === 0) return '（脆弱性は検出されませんでした）';

  const lines = [
    `合計 ${total} 件の脆弱性が検出されました`,
    '',
    `critical : ${critical}`,
    `high     : ${high}`,
    `moderate : ${moderate}`,
    `low      : ${low}`,
    `info     : ${info}`,
    '',
    '----------------------------------------',
  ];

  for (const advisory of Object.values(auditJson.advisories ?? {})) {
    lines.push('');
    lines.push(`■ ${advisory.module_name} [${advisory.severity.toUpperCase()}]`);
    lines.push(`  影響バージョン: ${advisory.vulnerable_versions}`);
    if (advisory.title) lines.push(`  ${advisory.title}`);
    if (advisory.url)   lines.push(`  ${advisory.url}`);

    // patched_versions が '<0.0.0' の場合は修正版が存在しない
    if (advisory.patched_versions && advisory.patched_versions !== '<0.0.0') {
      lines.push(`  修正: ${advisory.patched_versions} へのアップデートが必要`);
    } else {
      lines.push(`  修正: 現時点では自動修正不可`);
    }
  }

  return lines.join('\n');
}

let auditOutput;
try {
  const auditJson = JSON.parse(auditRaw);
  auditOutput = auditJson.advisories
    ? formatPnpmAuditResult(auditJson)
    : formatAuditResult(auditJson);
} catch {
  auditOutput = auditRaw || '（結果を取得できませんでした）';
}

const report = `# 🩺 依存関係ヘルスレポート

> ${characterIcon} **${characterName}**: ${characterComment}

**実行日時**: ${getJSTDatetime()}

---

## 📦 ${packageManager} outdated

\`\`\`
${outdatedOutput}
\`\`\`

---

## 🔒 ${packageManager} audit

\`\`\`
${auditOutput}
\`\`\`
`;

fs.writeFileSync(path.join(workspace, 'NPM_SECURITY_REPORT.md'), report, 'utf-8');
console.log('Report generated: NPM_SECURITY_REPORT.md');

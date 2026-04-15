import { defineConfig } from "cz-git";
import { readdirSync } from "fs";
import { join } from "path";

function getWorkspaceScopes() {
  return ["apps", "packages"].flatMap((dir) => {
    try {
      return readdirSync(join(process.cwd(), dir), { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => `${dir}/${d.name}`);
    } catch {
      return [];
    }
  });
}

const types = [
  { value: "feat", name: "feat:     ✨  A new feature", emoji: ":sparkles:" },
  { value: "fix", name: "fix:      🐛  A bug fix", emoji: ":bug:" },
  { value: "docs", name: "docs:     📝  Documentation only changes", emoji: ":memo:" },
  { value: "style", name: "style:    💄  Changes that do not affect the meaning of the code", emoji: ":lipstick:" },
  { value: "refactor", name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature", emoji: ":recycle:" },
  { value: "perf", name: "perf:     ⚡️  A code change that improves performance", emoji: ":zap:" },
  { value: "test", name: "test:     ✅  Adding missing tests or correcting existing tests", emoji: ":white_check_mark:" },
  { value: "build", name: "build:    📦️   Changes that affect the build system or external dependencies", emoji: ":package:" },
  { value: "ci", name: "ci:       🎡  Changes to our CI configuration files and scripts", emoji: ":ferris_wheel:" },
  { value: "chore", name: "chore:    🔨  Other changes that don't modify src or test files", emoji: ":hammer:" },
  { value: "revert", name: "revert:   ⏪️  Reverts a previous commit", emoji: ":rewind:" },
];

const typeEmojiMap = Object.fromEntries(types.map(({ value, emoji }) => [value, emoji]));

export default defineConfig({
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "type-emoji-match": ({ type, subject }) => {
          const expected = typeEmojiMap[type];
          if (!expected) return [true, ""];
          const valid = subject?.trimStart().startsWith(expected) ?? false;
          return [valid, `subject must start with the emoji for "${type}": ${expected}`];
        },
      },
    },
  ],
  rules: {
    "type-emoji-match": [2, "always"],
    "header-max-length": [2, "always", 72]
  },
  prompt: {
    types,
    scopes: getWorkspaceScopes(),
    useEmoji: true,
  },
});

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const connector = require("./v0_repository_connector");

function expectThrow(name, fn) {
  let threw = false;
  try {
    fn();
  } catch (_error) {
    threw = true;
  }
  assert.ok(threw, `${name} should throw`);
}

const current = connector.getCurrentState({ identity: "V0_ASSISTANT" });
assert.ok(current.currentState.content.includes("CURRENT_STATE"));
assert.ok(current.repository.commit || current.repository.branch === null);

const v0Context = connector.getV0Context({ identity: "V0_ASSISTANT" });
assert.ok(v0Context.currentContext.content.includes("Current"));
assert.ok(v0Context.longTermProfile.content.length > 0);

const rootList = connector.listDirectory({ identity: "V0_ASSISTANT", relPath: "V0_PERSONAL_ASSISTANT" });
assert.ok(Array.isArray(rootList.entries));
assert.ok(rootList.entries.some((item) => item.name === "ACCESS_POLICY.md"));

const search = connector.searchRepository({
  identity: "V0_ASSISTANT",
  query: "V0",
  roots: ["V0_PERSONAL_ASSISTANT"],
});
assert.ok(Array.isArray(search.results));
assert.ok(typeof search.count === "number");

expectThrow("path traversal", () => connector.readFile({ identity: "V0_ASSISTANT", relPath: "../README.md" }));
expectThrow("family denied to strategy ai", () => connector.readFile({ identity: "V0_STRATEGY", relPath: "V0_PERSONAL_ASSISTANT/FAMILY_CONTEXT/PRIVATE_NOTES.md" }));
expectThrow("execution ai cannot read v0 profile", () => connector.readFile({ identity: "EXECUTION_AI", relPath: "V0_PERSONAL_ASSISTANT/LONG_TERM_PROFILE.md" }));
expectThrow("unknown identity", () => connector.readFile({ identity: "unknown_ai", relPath: "CURRENT_STATE.md" }));

const suffix = `${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
const title = `test_candidate_${suffix}`;
const candidate = connector.submitMemoryCandidate({
  identity: "V0_ASSISTANT",
  title,
  content: "This is a temporary test candidate.",
  source: "unit_test",
  targetPath: "V0_PERSONAL_ASSISTANT/CURRENT_CONTEXT.md",
});

assert.ok(candidate.path.includes("INBOX/PENDING"));

const repositoryRoot = connector.REPOSITORY_ROOT || connector.DEFAULT_REPO_ROOT;
const candidateAbs = path.join(repositoryRoot, candidate.path);
assert.ok(fs.existsSync(candidateAbs));

const approved = connector.approveMemoryCandidate({
  identity: "V0_ASSISTANT",
  candidatePath: candidate.path,
  confirmationText: "确定，进入中央",
});

assert.ok(approved.path.includes("INBOX/APPROVED"));

expectThrow("approval without confirmation", () => connector.approveMemoryCandidate({
  identity: "V0_ASSISTANT",
  candidatePath: candidate.path,
  confirmationText: "just looking",
}));

fs.rmSync(candidateAbs, { force: true });
fs.rmSync(path.join(repositoryRoot, approved.path), { force: true });

console.log("connector tests passed");

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const DEFAULT_REPO_ROOT = path.resolve(process.env.V0_REPO_ROOT || path.join(__dirname, "..", ".."));
const DEFAULT_LOG_DIR = process.env.V0_MCP_LOG_DIR || path.join("runtime", "mcp_logs");
const LOG_DIR = path.isAbsolute(DEFAULT_LOG_DIR) ? DEFAULT_LOG_DIR : path.join(DEFAULT_REPO_ROOT, DEFAULT_LOG_DIR);
const READ_LOG = path.join(LOG_DIR, "reads.log");
const WRITE_LOG = path.join(LOG_DIR, "writes.log");

const IDENTITY_ALIASES = {
  V0_ASSISTANT: "V0_ASSISTANT",
  v0_assistant: "V0_ASSISTANT",
  V0_STRATEGY: "V0_STRATEGY",
  v0_strategy_ai: "V0_STRATEGY",
  FINANCE_AI: "FINANCE_AI",
  finance_ai: "FINANCE_AI",
  HR_AI: "HR_AI",
  hr_ai: "HR_AI",
  DATA_AI: "DATA_AI",
  data_ai: "DATA_AI",
  EXECUTION_AI: "EXECUTION_AI",
  executor_ai: "EXECUTION_AI",
};

const ACCESS_RULES = {
  V0_ASSISTANT: {
    allowed: [
      "CURRENT_STATE.md",
      "PROJECT_MEMORY.md",
      "DECISIONS.md",
      "HANDOFF.md",
      "TASKS.md",
      "README.md",
      "KNOWLEDGE_HUB.md",
      "knowledge-hub",
      "projects",
      "runtime",
      "sync_records",
      "tasks",
      "V0_PERSONAL_ASSISTANT",
    ],
  },
  V0_STRATEGY: {
    allowed: [
      "CURRENT_STATE.md",
      "PROJECT_MEMORY.md",
      "DECISIONS.md",
      "HANDOFF.md",
      "TASKS.md",
      "README.md",
      "KNOWLEDGE_HUB.md",
      "knowledge-hub",
      "projects",
      "runtime",
      "tasks",
      "V0_PERSONAL_ASSISTANT/CURRENT_CONTEXT.md",
      "V0_PERSONAL_ASSISTANT/LONG_TERM_PROFILE.md",
      "V0_PERSONAL_ASSISTANT/ASSISTANT_RULES.md",
      "V0_PERSONAL_ASSISTANT/ACCESS_POLICY.md",
      "V0_PERSONAL_ASSISTANT/ENTERPRISE_CONTEXT",
      "V0_PERSONAL_ASSISTANT/PERSONAL_CONTEXT",
    ],
  },
  FINANCE_AI: {
    allowed: [
      "CURRENT_STATE.md",
      "PROJECT_MEMORY.md",
      "DECISIONS.md",
      "HANDOFF.md",
      "TASKS.md",
      "knowledge-hub/enterprise-facts",
      "knowledge-hub/finance",
      "projects",
      "runtime",
      "V0_PERSONAL_ASSISTANT/ENTERPRISE_CONTEXT",
    ],
  },
  HR_AI: {
    allowed: [
      "CURRENT_STATE.md",
      "PROJECT_MEMORY.md",
      "DECISIONS.md",
      "HANDOFF.md",
      "TASKS.md",
      "knowledge-hub/department-knowledge",
      "projects/HZB-HR-AI-001_招聘AI",
      "projects",
      "runtime",
      "V0_PERSONAL_ASSISTANT/ENTERPRISE_CONTEXT",
    ],
  },
  DATA_AI: {
    allowed: [
      "CURRENT_STATE.md",
      "PROJECT_MEMORY.md",
      "DECISIONS.md",
      "HANDOFF.md",
      "TASKS.md",
      "knowledge-hub/enterprise-facts",
      "projects",
      "runtime",
    ],
  },
  EXECUTION_AI: {
    allowed: [
      "CURRENT_STATE.md",
      "PROJECT_MEMORY.md",
      "TASKS.md",
      "runtime",
      "tasks",
      "projects",
    ],
  },
};

const CONFIRMATION_PHRASES = [
  "确定，进入中央",
  "保存到中央",
  "这条定下来",
  "以后按这个执行",
  "记录为长期规则",
];

function canonicalIdentity(identity) {
  const value = IDENTITY_ALIASES[identity];
  if (!value) {
    throw new Error("Unknown identity");
  }
  return value;
}

function normalizeRelPath(relPath = ".") {
  if (typeof relPath !== "string" || !relPath.trim()) {
    throw new Error("Path must be a string");
  }
  const raw = relPath.trim().replace(/\\/g, "/");
  if (/^[a-zA-Z]:/.test(raw) || raw.startsWith("//")) {
    throw new Error("Absolute paths are not allowed");
  }
  const normalized = path.posix.normalize(raw);
  if (normalized === "." || normalized === "") {
    return ".";
  }
  if (normalized === ".." || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new Error("Path traversal is not allowed");
  }
  return normalized.replace(/^\.\/+/, "");
}

function resolveRepositoryPath(relPath = ".") {
  const normalized = normalizeRelPath(relPath);
  const target = path.resolve(DEFAULT_REPO_ROOT, normalized);
  const rootWithSep = DEFAULT_REPO_ROOT.endsWith(path.sep) ? DEFAULT_REPO_ROOT : `${DEFAULT_REPO_ROOT}${path.sep}`;
  if (target !== DEFAULT_REPO_ROOT && !target.startsWith(rootWithSep)) {
    throw new Error("Resolved path is outside repository root");
  }
  return { normalized, target };
}

function isAllowed(identity, relPath) {
  const canonical = canonicalIdentity(identity);
  const rules = ACCESS_RULES[canonical];
  if (!rules) return false;
  const normalized = normalizeRelPath(relPath).replace(/\/$/, "");
  return rules.allowed.some((allowedPath) => {
    const allowed = normalizeRelPath(allowedPath).replace(/\/$/, "");
    return normalized === allowed || normalized.startsWith(`${allowed}/`);
  });
}

function ensureAllowed(identity, relPath) {
  if (!isAllowed(identity, relPath)) {
    throw new Error(`Access denied for ${canonicalIdentity(identity)}: ${normalizeRelPath(relPath)}`);
  }
}

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function appendEventLog(filePath, payload) {
  ensureLogDir();
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`, "utf8");
}

function appendReadLog(identity, tool, relPath, extra = {}) {
  appendEventLog(READ_LOG, {
    at: new Date().toISOString(),
    identity: canonicalIdentity(identity),
    tool,
    path: normalizeRelPath(relPath),
    ...extra,
  });
}

function appendWriteLog(identity, tool, relPath, status, extra = {}) {
  appendEventLog(WRITE_LOG, {
    at: new Date().toISOString(),
    identity: canonicalIdentity(identity),
    tool,
    path: normalizeRelPath(relPath),
    status,
    ...extra,
  });
}

function gitArgs(args) {
  return childProcess.execFileSync("git", args, {
    cwd: DEFAULT_REPO_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function safeGitArgs(args) {
  try {
    const output = gitArgs(args);
    return output || null;
  } catch (_error) {
    return null;
  }
}

function gitInfo(relPath) {
  try {
    const output = gitArgs(["log", "-1", "--format=%H|%cI", "--", relPath]);
    if (!output) return null;
    const [commit, committedAt] = output.split("|");
    return { commit, committedAt };
  } catch (_error) {
    return null;
  }
}

function getRepositorySnapshot() {
  return {
    commit: safeGitArgs(["rev-parse", "HEAD"]),
    branch: safeGitArgs(["branch", "--show-current"]),
    remote: safeGitArgs(["remote", "get-url", "origin"]),
  };
}

function fileMetadata(relPath) {
  const { normalized, target } = resolveRepositoryPath(relPath);
  if (!fs.existsSync(target)) {
    throw new Error(`File not found: ${normalized}`);
  }
  const stat = fs.statSync(target);
  return {
    path: normalized,
    updatedAt: stat.mtime.toISOString(),
    size: stat.size,
    git: gitInfo(normalized),
  };
}

function listDirectory({ identity, relPath = "." }) {
  ensureAllowed(identity, relPath);
  const { normalized, target } = resolveRepositoryPath(relPath);
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    throw new Error(`Directory not found: ${normalized}`);
  }
  const entries = fs.readdirSync(target, { withFileTypes: true }).map((entry) => {
    const childRelPath = normalized === "." ? entry.name : `${normalized}/${entry.name}`;
    const childAbs = path.join(target, entry.name);
    const stat = fs.statSync(childAbs);
    return {
      name: entry.name,
      type: entry.isDirectory() ? "directory" : "file",
      size: entry.isDirectory() ? null : stat.size,
      updatedAt: stat.mtime.toISOString(),
      git: gitInfo(childRelPath),
    };
  });
  appendReadLog(identity, "list_directory", normalized, { count: entries.length });
  return {
    path: normalized,
    entries,
    snapshot: getRepositorySnapshot(),
  };
}

function readFile({ identity, relPath }) {
  ensureAllowed(identity, relPath);
  const { normalized, target } = resolveRepositoryPath(relPath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    throw new Error(`File not found: ${normalized}`);
  }
  const stat = fs.statSync(target);
  appendReadLog(identity, "read_file", normalized, { size: stat.size });
  return {
    path: normalized,
    updatedAt: stat.mtime.toISOString(),
    size: stat.size,
    git: gitInfo(normalized),
    content: fs.readFileSync(target, "utf8"),
  };
}

function walkFiles(rootPath, onFile) {
  const stat = fs.statSync(rootPath);
  if (stat.isFile()) {
    onFile(rootPath);
    return;
  }
  for (const entry of fs.readdirSync(rootPath, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const child = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(child, onFile);
    } else if (entry.isFile()) {
      onFile(child);
    }
  }
}

function searchRepository({ identity, query, roots, caseSensitive = false, limit = 20 }) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("Query is required");
  }
  const searchRoots = Array.isArray(roots) && roots.length ? roots : (ACCESS_RULES[canonicalIdentity(identity)]?.allowed || []);
  const normalizedQuery = caseSensitive ? query : query.toLowerCase();
  const results = [];
  for (const root of searchRoots) {
    ensureAllowed(identity, root);
    const { normalized, target } = resolveRepositoryPath(root);
    if (!fs.existsSync(target)) continue;
    walkFiles(target, (filePath) => {
      if (results.length >= limit) return;
      const rel = path.relative(DEFAULT_REPO_ROOT, filePath).replace(/\\/g, "/");
      if (!isAllowed(identity, rel)) return;
      const stat = fs.statSync(filePath);
      if (!stat.isFile() || stat.size > 1024 * 1024) return;
      const text = fs.readFileSync(filePath, "utf8");
      const haystack = caseSensitive ? text : text.toLowerCase();
      const index = haystack.indexOf(normalizedQuery);
      if (index >= 0) {
        results.push({
          path: rel,
          matchPreview: text.slice(Math.max(0, index - 60), Math.min(text.length, index + query.length + 120)),
          updatedAt: stat.mtime.toISOString(),
          git: gitInfo(rel),
        });
      }
    });
    appendReadLog(identity, "search_repository", normalized, { root: normalized, count: results.length });
  }
  return {
    query,
    count: results.length,
    results: results.slice(0, limit),
    snapshot: getRepositorySnapshot(),
  };
}

function getCurrentState({ identity }) {
  const currentState = readFile({ identity, relPath: "CURRENT_STATE.md" });
  return {
    repository: getRepositorySnapshot(),
    currentState,
  };
}

function getV0Context({ identity }) {
  return {
    repository: getRepositorySnapshot(),
    currentContext: readFile({ identity, relPath: "V0_PERSONAL_ASSISTANT/CURRENT_CONTEXT.md" }),
    longTermProfile: readFile({ identity, relPath: "V0_PERSONAL_ASSISTANT/LONG_TERM_PROFILE.md" }),
    assistantRules: readFile({ identity, relPath: "V0_PERSONAL_ASSISTANT/ASSISTANT_RULES.md" }),
    accessPolicy: readFile({ identity, relPath: "V0_PERSONAL_ASSISTANT/ACCESS_POLICY.md" }),
  };
}

function getRelatedDecisions({ identity, query, limit = 10 }) {
  return searchRepository({
    identity,
    query,
    roots: ["DECISIONS.md", "V0_PERSONAL_ASSISTANT/DECISION_LOG"],
    limit,
  });
}

function safeFileName(title) {
  return String(title || "candidate")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

function submitMemoryCandidate({
  identity,
  title,
  content,
  source = "current_conversation",
  targetPath = "",
  accessLevel = "pending",
}) {
  if (canonicalIdentity(identity) !== "V0_ASSISTANT") {
    throw new Error("Only V0_ASSISTANT can submit memory candidates");
  }
  if (!title || !content) {
    throw new Error("Title and content are required");
  }
  const fileName = `${new Date().toISOString().slice(0, 10)}_${safeFileName(title)}_${crypto.randomUUID().slice(0, 8)}.md`;
  const relPath = `V0_PERSONAL_ASSISTANT/INBOX/PENDING/${fileName}`;
  const { target } = resolveRepositoryPath(relPath);
  if (fs.existsSync(target)) {
    throw new Error(`Candidate already exists: ${relPath}`);
  }
  const payload = [
    "---",
    `title: ${title}`,
    `created_at: ${new Date().toISOString()}`,
    `source: ${source}`,
    "confirmed_by: pending",
    `access_level: ${accessLevel}`,
    "status: pending",
    `target_path: ${targetPath}`,
    "---",
    "",
    "## 候选内容",
    "",
    content,
    "",
    "## 写入说明",
    "",
    "本文件只是候选沉淀，不是正式事实。必须经 V0 明确确认后才能进入正式知识区。",
    "",
  ].join("\n");
  fs.writeFileSync(target, payload, "utf8");
  appendWriteLog(identity, "submit_memory_candidate", relPath, "pending_created");
  return { path: relPath, status: "pending" };
}

function isV0Confirmation(text) {
  if (!text || typeof text !== "string") return false;
  return CONFIRMATION_PHRASES.some((phrase) => text.includes(phrase));
}

function approveMemoryCandidate({ identity, candidatePath, confirmationText }) {
  if (canonicalIdentity(identity) !== "V0_ASSISTANT") {
    throw new Error("Only V0_ASSISTANT can approve candidates after V0 confirmation");
  }
  if (!isV0Confirmation(confirmationText)) {
    throw new Error("Explicit V0 confirmation is required");
  }
  const normalizedCandidate = normalizeRelPath(candidatePath);
  if (!normalizedCandidate.startsWith("V0_PERSONAL_ASSISTANT/INBOX/PENDING/")) {
    throw new Error("Only pending candidates can be approved");
  }
  const { target } = resolveRepositoryPath(normalizedCandidate);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    throw new Error(`Candidate not found: ${normalizedCandidate}`);
  }
  const approvedRelPath = normalizedCandidate.replace("/PENDING/", "/APPROVED/");
  const { target: approvedTarget } = resolveRepositoryPath(approvedRelPath);
  if (fs.existsSync(approvedTarget)) {
    throw new Error(`Approved record already exists: ${approvedRelPath}`);
  }
  const original = fs.readFileSync(target, "utf8");
  const approved = `<!-- approved_at: ${new Date().toISOString()} -->\n<!-- confirmation: ${confirmationText} -->\n\n${original}`;
  fs.writeFileSync(approvedTarget, approved, "utf8");
  appendWriteLog(identity, "approve_memory_candidate", approvedRelPath, "approved_copy_created");
  return { path: approvedRelPath, status: "approved" };
}

function writeApprovedMemory() {
  throw new Error("writeApprovedMemory is not enabled in the read-only release");
}

function appendDecisionLog() {
  throw new Error("appendDecisionLog is not enabled in the read-only release");
}

function updateCurrentContext() {
  throw new Error("updateCurrentContext is not enabled in the read-only release");
}

module.exports = {
  ACCESS_RULES,
  DEFAULT_REPO_ROOT,
  REPOSITORY_ROOT: DEFAULT_REPO_ROOT,
  appendDecisionLog,
  approveMemoryCandidate,
  appendWriteLog,
  canonicalIdentity,
  fileMetadata,
  getCurrentState,
  getRelatedDecisions,
  getRepositorySnapshot,
  getV0Context,
  isAllowed,
  isV0Confirmation,
  listDirectory,
  normalizeRelPath,
  readFile,
  resolveRepositoryPath,
  safeFileName,
  searchRepository,
  submitMemoryCandidate,
  updateCurrentContext,
  writeApprovedMemory,
};

const http = require("http");
const path = require("path");
const connector = require("./core");

const PACKAGE_JSON = require("../../package.json");
const SERVICE_NAME = "v0-remote-mcp";
const PROTOCOL_VERSION = process.env.V0_MCP_PROTOCOL_VERSION || "2025-11-25";
const HOST = process.env.V0_MCP_BIND_HOST || "0.0.0.0";
const PORT = Number.parseInt(process.env.V0_MCP_PORT || "8787", 10);
const AUTH_TOKEN = process.env.V0_MCP_BEARER_TOKEN || "";
const ALLOWED_ORIGINS = (process.env.V0_MCP_ALLOWED_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.V0_RATE_LIMIT_WINDOW_MS || "60000", 10);
const RATE_LIMIT_MAX = Number.parseInt(process.env.V0_RATE_LIMIT_MAX || "120", 10);

const REQUEST_BUCKETS = new Map();

function nowIso() {
  return new Date().toISOString();
}

function json(res, statusCode, body, headers = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
    ...headers,
  });
  res.end(payload);
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) {
    error.data = data;
  }
  return { jsonrpc: "2.0", id, error };
}

function sanitizeError(error) {
  if (!error) {
    return { message: "Unknown error" };
  }
  const message = String(error.message || error).replace(/D:[^"'\n\r]*/g, "[redacted-path]");
  return { message };
}

function identityFromRequest(req) {
  return req.headers["x-v0-identity"] || req.headers["x-identity"] || "V0_ASSISTANT";
}

function authFromRequest(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length).trim();
}

function isAuthorized(req) {
  if (!AUTH_TOKEN) {
    return true;
  }
  return authFromRequest(req) === AUTH_TOKEN;
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin || !ALLOWED_ORIGINS.length) {
    return true;
  }
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed || origin.startsWith(`${allowed}/`));
}

function rateLimitKey(req) {
  return `${req.socket.remoteAddress || "unknown"}:${String(authFromRequest(req) || "anon")}`;
}

function checkRateLimit(req) {
  const key = rateLimitKey(req);
  const now = Date.now();
  const bucket = REQUEST_BUCKETS.get(key) || { start: now, count: 0 };
  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.start = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  REQUEST_BUCKETS.set(key, bucket);
  return bucket.count <= RATE_LIMIT_MAX;
}

function buildToolDefinitions() {
  return [
    {
      name: "search_repository",
      description: "Search authorized repository content by keyword.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          roots: { type: "array", items: { type: "string" } },
          caseSensitive: { type: "boolean" },
          limit: { type: "integer", minimum: 1, maximum: 100 },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
    {
      name: "list_directory",
      description: "List an authorized repository directory.",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string" },
        },
        required: ["path"],
        additionalProperties: false,
      },
    },
    {
      name: "read_file",
      description: "Read an authorized repository file.",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string" },
        },
        required: ["path"],
        additionalProperties: false,
      },
    },
    {
      name: "get_current_state",
      description: "Get the current central state and repository snapshot.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_v0_context",
      description: "Get the V0 assistant context bundle.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_related_decisions",
      description: "Search central decisions and decision logs.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "integer", minimum: 1, maximum: 100 },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  ];
}

function formatToolResult(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
    structuredContent: payload,
  };
}

function callTool(identity, name, args = {}) {
  switch (name) {
    case "search_repository":
      return formatToolResult(connector.searchRepository({ identity, ...args }));
    case "list_directory":
      return formatToolResult(connector.listDirectory({ identity, relPath: args.path }));
    case "read_file":
      return formatToolResult(connector.readFile({ identity, relPath: args.path }));
    case "get_current_state":
      return formatToolResult(connector.getCurrentState({ identity }));
    case "get_v0_context":
      return formatToolResult(connector.getV0Context({ identity }));
    case "get_related_decisions":
      return formatToolResult(connector.getRelatedDecisions({ identity, query: args.query, limit: args.limit || 10 }));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function validateOrigin(req, res) {
  if (!originAllowed(req)) {
    json(res, 403, { error: "Origin not allowed" });
    return false;
  }
  return true;
}

function validateAuth(req, res) {
  if (!isAuthorized(req)) {
    json(res, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw.trim()) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (_error) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

async function handleRpc(req, res) {
  if (!validateOrigin(req, res) || !validateAuth(req, res)) {
    return;
  }
  if (!checkRateLimit(req)) {
    json(res, 429, { error: "Rate limit exceeded" });
    return;
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (error) {
    json(res, 400, { error: sanitizeError(error).message });
    return;
  }

  const requests = Array.isArray(body) ? body : [body];
  const identity = identityFromRequest(req);
  const responses = [];

  for (const request of requests) {
    if (!request || typeof request !== "object") {
      responses.push(jsonRpcError(null, -32600, "Invalid Request"));
      continue;
    }

    const { id, method, params } = request;
    const startedAt = Date.now();
    try {
      let result;
      switch (method) {
        case "initialize":
          result = {
            protocolVersion: PROTOCOL_VERSION,
            serverInfo: {
              name: SERVICE_NAME,
              version: PACKAGE_JSON.version,
            },
            capabilities: {
              tools: { listChanged: false },
            },
          };
          break;
        case "ping":
          result = {};
          break;
        case "tools/list":
          result = { tools: buildToolDefinitions() };
          break;
        case "tools/call": {
          const toolName = params && params.name;
          const toolArgs = params && (params.arguments || params.args || {});
          result = callTool(identity, toolName, toolArgs);
          break;
        }
        default:
          throw Object.assign(new Error(`Method not found: ${method}`), { code: -32601 });
      }

      responses.push(jsonRpcResult(id, result));
      connector.appendWriteLog(identity, method, method, "rpc_ok", { durationMs: Date.now() - startedAt });
    } catch (error) {
      const code = error && typeof error.code === "number" ? error.code : -32000;
      const safe = sanitizeError(error);
      responses.push(jsonRpcError(id, code, safe.message));
      connector.appendWriteLog(identity, method || "rpc", method || "rpc", "rpc_error", {
        durationMs: Date.now() - startedAt,
        message: safe.message,
      });
    }
  }

  if (Array.isArray(body)) {
    json(res, 200, responses);
    return;
  }
  if (body && typeof body === "object" && "id" in body) {
    json(res, 200, responses[0]);
    return;
  }
  res.writeHead(204, { "cache-control": "no-store" });
  res.end();
}

function sendSse(req, res) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-store, must-revalidate",
    connection: "keep-alive",
  });
  res.write(`event: ready\ndata: ${JSON.stringify({
    service: SERVICE_NAME,
    version: PACKAGE_JSON.version,
    protocolVersion: PROTOCOL_VERSION,
    at: nowIso(),
  })}\n\n`);
  const timer = setInterval(() => {
    res.write(`: keepalive ${nowIso()}\n\n`);
  }, 25000);
  req.on("close", () => {
    clearInterval(timer);
  });
}

function healthResponse() {
  const snapshot = connector.getRepositorySnapshot();
  return {
    ok: true,
    service: SERVICE_NAME,
    version: PACKAGE_JSON.version,
    protocolVersion: PROTOCOL_VERSION,
    repository: snapshot,
    at: nowIso(),
  };
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/healthz") {
      json(res, 200, healthResponse());
      return;
    }
    if (req.method === "GET" && url.pathname === "/version") {
      json(res, 200, {
        service: SERVICE_NAME,
        version: PACKAGE_JSON.version,
        protocolVersion: PROTOCOL_VERSION,
      });
      return;
    }
    if (url.pathname === "/mcp" && req.method === "GET") {
      if (!validateOrigin(req, res) || !validateAuth(req, res)) {
        return;
      }
      if ((req.headers.accept || "").includes("text/event-stream")) {
        sendSse(req, res);
        return;
      }
      json(res, 200, {
        service: SERVICE_NAME,
        version: PACKAGE_JSON.version,
        protocolVersion: PROTOCOL_VERSION,
        transport: "streamable-http",
        tools: buildToolDefinitions().map((tool) => tool.name),
      });
      return;
    }
    if (url.pathname === "/mcp" && req.method === "POST") {
      handleRpc(req, res).catch((error) => {
        json(res, 500, { error: sanitizeError(error).message });
      });
      return;
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": ALLOWED_ORIGINS[0] || "*",
        "access-control-allow-headers": "authorization, content-type, x-v0-identity, x-identity",
        "access-control-allow-methods": "GET,POST,OPTIONS",
      });
      res.end();
      return;
    }
    json(res, 404, { error: "Not found" });
  });
}

function start() {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    process.stdout.write(JSON.stringify({
      event: "server_started",
      service: SERVICE_NAME,
      version: PACKAGE_JSON.version,
      host: HOST,
      port: PORT,
      protocolVersion: PROTOCOL_VERSION,
      repository: connector.getRepositorySnapshot(),
      at: nowIso(),
    }) + "\n");
  });
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
  process.on("SIGINT", () => server.close(() => process.exit(0)));
  return server;
}

if (require.main === module) {
  start();
}

module.exports = {
  AUTH_TOKEN,
  PROTOCOL_VERSION,
  buildToolDefinitions,
  callTool,
  createServer,
  handleRpc,
  healthResponse,
  start,
};

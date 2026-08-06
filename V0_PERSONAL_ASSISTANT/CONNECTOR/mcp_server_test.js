const assert = require("assert");
const http = require("http");

process.env.V0_MCP_BEARER_TOKEN = "test-token";
process.env.V0_MCP_ALLOWED_ORIGINS = "";

const serverModule = require("./mcp_server");

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

function request(port, options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: "127.0.0.1",
      port,
      method: options.method,
      path: options.path,
      headers: options.headers,
    }, (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: raw });
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

(async () => {
  const server = serverModule.createServer();
  const handle = await listen(server);

  const health = await request(handle.port, { method: "GET", path: "/healthz" });
  assert.strictEqual(health.statusCode, 200);
  assert.ok(JSON.parse(health.body).ok);

  const unauthorized = await request(handle.port, {
    method: "POST",
    path: "/mcp",
    headers: { "content-type": "application/json" },
  }, JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }));
  assert.strictEqual(unauthorized.statusCode, 401);

  const initialize = await request(handle.port, {
    method: "POST",
    path: "/mcp",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-token",
      "x-v0-identity": "V0_ASSISTANT",
    },
  }, JSON.stringify({ jsonrpc: "2.0", id: 2, method: "initialize", params: {} }));
  assert.strictEqual(initialize.statusCode, 200);
  const initializeBody = JSON.parse(initialize.body);
  assert.strictEqual(initializeBody.result.serverInfo.name, "v0-remote-mcp");

  const toolsList = await request(handle.port, {
    method: "POST",
    path: "/mcp",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-token",
      "x-v0-identity": "V0_ASSISTANT",
    },
  }, JSON.stringify({ jsonrpc: "2.0", id: 3, method: "tools/list", params: {} }));
  const toolsListBody = JSON.parse(toolsList.body);
  assert.ok(toolsListBody.result.tools.some((tool) => tool.name === "read_file"));

  const currentState = await request(handle.port, {
    method: "POST",
    path: "/mcp",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-token",
      "x-v0-identity": "V0_ASSISTANT",
    },
  }, JSON.stringify({
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: { name: "get_current_state", arguments: {} },
  }));
  const currentStateBody = JSON.parse(currentState.body);
  assert.ok(currentStateBody.result.content[0].text.includes("CURRENT_STATE"));

  const denied = await request(handle.port, {
    method: "POST",
    path: "/mcp",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer test-token",
      "x-v0-identity": "V0_STRATEGY",
    },
  }, JSON.stringify({
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: { name: "read_file", arguments: { path: "V0_PERSONAL_ASSISTANT/FAMILY_CONTEXT/PRIVATE_NOTES.md" } },
  }));
  const deniedBody = JSON.parse(denied.body);
  assert.ok(deniedBody.error.message.includes("Access denied"));

  server.close();
  console.log("mcp server tests passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

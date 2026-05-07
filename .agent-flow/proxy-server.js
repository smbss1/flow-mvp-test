import { createServer } from "node:http";

const bearer = process.env.PROXY_BEARER_TOKEN ?? "";

const providers = {
  anthropic: {
    upstreamUrl: "https://api.anthropic.com/v1/messages",
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    authStyle: "anthropic",
  },
  openai: {
    upstreamUrl: "https://api.openai.com/v1/chat/completions",
    apiKey: process.env.OPENAI_API_KEY ?? "",
    authStyle: "openai",
  },
  openrouter: {
    upstreamUrl: "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    authStyle: "openai",
  },
};

function resolveRoute(url) {
  if (url.endsWith("/messages")) {
    return providers.anthropic;
  }
  if (url === "/v1/openai/chat/completions") {
    return providers.openai;
  }
  if (url === "/v1/openrouter/chat/completions") {
    return providers.openrouter;
  }
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

function writeJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(payload));
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    writeJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== "POST" || !req.url) {
    writeJson(res, 404, { error: "route_not_found" });
    return;
  }

  const auth = req.headers.authorization ?? "";
  const xApiKey = Array.isArray(req.headers["x-api-key"])
    ? req.headers["x-api-key"][0]
    : req.headers["x-api-key"] ?? "";
  if (auth !== `Bearer ${bearer}` && xApiKey !== bearer) {
    writeJson(res, 401, { error: "unauthorized" });
    return;
  }

  const route = resolveRoute(req.url);
  if (!route) {
    writeJson(res, 404, { error: "route_not_found" });
    return;
  }
  if (!route.apiKey) {
    writeJson(res, 503, { error: "provider_not_configured" });
    return;
  }

  try {
    const rawBody = await readBody(req);
    const upstreamResponse = await fetch(route.upstreamUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(route.authStyle === "anthropic"
          ? { "x-api-key": route.apiKey, "anthropic-version": "2023-06-01" }
          : { authorization: `Bearer ${route.apiKey}` }),
      },
      body: rawBody,
      signal: AbortSignal.timeout(120_000),
    });
    const responseText = await upstreamResponse.text();
    res.statusCode = upstreamResponse.status;
    res.setHeader(
      "content-type",
      upstreamResponse.headers.get("content-type") ?? "application/json"
    );
    res.end(responseText);
  } catch (error) {
    writeJson(res, 502, {
      error: "upstream_unreachable",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(8080, "0.0.0.0");

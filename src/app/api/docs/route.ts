/**
 * Swagger UI Endpoint
 * 
 * GET /api/docs
 */

import { NextResponse } from 'next/server';

const SWAGGER_UI_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AgentOps Platform - API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; background: #0a0a0f; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { background: #0a0a0f; }
    .swagger-ui .info { margin: 30px 0; }
    .swagger-ui .info .title { color: #00f0ff; }
    .swagger-ui .opblock-tag { color: #e5e5e5; }
    .swagger-ui .opblock { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); }
    .swagger-ui .opblock .opblock-summary-path { color: #e5e5e5; }
    .swagger-ui .opblock .opblock-summary-description { color: #a0a0a0; }
    .swagger-ui section.models { background: rgba(255,255,255,0.03); }
    .swagger-ui .model-box { background: rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: 'BaseLayout',
        deepLinking: true,
      });
    };
  </script>
</body>
</html>`;

export async function GET() {
    return new NextResponse(SWAGGER_UI_HTML, {
        headers: { 'Content-Type': 'text/html' },
    });
}

/**
 * OpenAPI Specification Endpoint
 * 
 * GET /api/openapi.json
 */

import { NextResponse } from 'next/server';

const openApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'AgentOps Platform API',
        description: 'Enterprise discovery platform for pre-vetted, regulatory-compliant AI agents.',
        version: '1.0.0',
        contact: {
            name: 'Berlin AI Labs',
            email: 'hello@berlinailabs.de',
            url: 'https://berlinailabs.de',
        },
    },
    servers: [
        {
            url: 'https://agentops-platform.up.railway.app',
            description: 'Production',
        },
        {
            url: 'http://localhost:3000',
            description: 'Development',
        },
    ],
    paths: {
        '/api/agents': {
            get: {
                summary: 'List all agents',
                description: 'Returns all registered agents in the platform',
                operationId: 'listAgents',
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Agent' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/agents/search': {
            get: {
                summary: 'Search agents',
                description: 'Search for agents by query, tags, or compliance requirements',
                operationId: 'searchAgents',
                parameters: [
                    {
                        name: 'q',
                        in: 'query',
                        description: 'Search query',
                        required: true,
                        schema: { type: 'string' },
                    },
                    {
                        name: 'tags',
                        in: 'query',
                        description: 'Comma-separated list of tags',
                        required: false,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        agents: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Agent' },
                                        },
                                        totalCount: { type: 'integer' },
                                        query: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Agent: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string', enum: ['compliance', 'governance', 'content', 'utility'] },
                    status: { type: 'string', enum: ['online', 'degraded', 'offline'] },
                    trustScore: { type: 'integer', minimum: 0, maximum: 100 },
                    badges: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ComplianceBadge' },
                    },
                    endpointUrl: { type: 'string', format: 'uri' },
                    tags: { type: 'array', items: { type: 'string' } },
                    pricePerRequest: { type: 'number' },
                },
                required: ['id', 'name', 'description', 'category', 'status', 'trustScore'],
            },
            ComplianceBadge: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['AI_ACT', 'GDPR', 'DIGA', 'SOC2', 'ISO27001'] },
                    verified: { type: 'boolean' },
                    proofUrl: { type: 'string', format: 'uri' },
                },
                required: ['type', 'verified'],
            },
        },
    },
};

export async function GET() {
    return NextResponse.json(openApiSpec);
}

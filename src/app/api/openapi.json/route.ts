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
        '/api/manager/agents': {
            get: {
                summary: 'List managed agents',
                description: 'Returns all agents managed by the current user from the am_agents table',
                operationId: 'listManagedAgents',
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
            post: {
                summary: 'Register new agent',
                description: 'Creates a new agent in the am_agents table',
                operationId: 'createAgent',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Agent' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Agent created',
                    },
                },
            },
        },
        '/api/scanner': {
            post: {
                summary: 'Scan for Shadow AI',
                description: 'Triggers a scan for unmanaged AI agents across multi-cloud providers (AWS, Azure, OpenAI).',
                operationId: 'discoverShadowAI',
                responses: {
                    '200': {
                        description: 'Scan results',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        agents: { type: 'array', items: { type: 'object' } },
                                        provider: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/kill': {
            post: {
                summary: 'Individual Agent Kill Switch',
                description: 'Stops or restores an individual agent by ID.',
                operationId: 'executeKillSwitch',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    agentId: { type: 'string' },
                                    action: { type: 'string', enum: ['stop', 'restore'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Success' }
                }
            },
            put: {
                summary: 'Global Emergency Stop',
                description: 'Immediately halts ALL active agents across the entire fleet.',
                operationId: 'executeGlobalKill',
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        stoppedCount: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/actions': {
            get: {
                summary: 'List Pending Actions',
                description: 'Returns all actions awaiting human-in-the-loop review.',
                operationId: 'listPendingActions',
                responses: {
                    '200': {
                        description: 'List of actions',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/PendingAction' }
                                }
                            }
                        }
                    }
                }
            },
            patch: {
                summary: 'Review Pending Action',
                description: 'Approves or denies a pending action.',
                operationId: 'reviewAction',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    actionId: { type: 'string' },
                                    status: { type: 'string', enum: ['approved', 'denied'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Review processed' }
                }
            }
        },
        '/api/anomalies': {
            get: {
                summary: 'Get Live Anomalies',
                description: 'Proxies real-time anomaly detection data from the Trust Protocol service.',
                operationId: 'getAnomalies',
                responses: {
                    '200': {
                        description: 'Current anomalies',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        anomalies: { type: 'array', items: { type: 'object' } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
            PendingAction: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    agent_id: { type: 'string', format: 'uuid' },
                    action: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['pending', 'approved', 'denied'] },
                    requested_at: { type: 'string', format: 'date-time' },
                }
            }
        },
    },
};

export async function GET() {
    return NextResponse.json(openApiSpec);
}

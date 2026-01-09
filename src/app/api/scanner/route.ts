import { NextResponse } from 'next/server';
import { CloudScannerClient } from '@/infrastructure/CloudScannerClient';
import { DiscoverShadowAI } from '@/application/DiscoverShadowAI';

const scannerClient = new CloudScannerClient();
const discoverService = new DiscoverShadowAI(scannerClient);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { provider, credentials } = body;

        if (!provider) {
            return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
        }

        const result = await discoverService.execute(provider, credentials);

        return NextResponse.json({
            provider,
            ...result
        });
    } catch (error) {
        console.error('[Scanner API] Error:', error);
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}

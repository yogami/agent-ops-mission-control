/**
 * Anomalies API Proxy
 * 
 * Fetches live anomaly data from Trust Verifier service.
 * Falls back to mock data when service unavailable.
 */

import { NextResponse } from 'next/server';
import { TrustVerifierClient } from '@/infrastructure/TrustVerifierClient';

const client = new TrustVerifierClient();

export async function GET() {
    try {
        const anomalies = await client.getAnomalies();

        return NextResponse.json({
            anomalies,
            fetchedAt: new Date().toISOString(),
            source: anomalies.length > 0 && anomalies[0].id.startsWith('a') ? 'mock' : 'live',
        });
    } catch (error) {
        console.error('[Anomalies API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 });
    }
}

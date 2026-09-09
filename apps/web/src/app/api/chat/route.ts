/**
 * XYZ Eyewear — Production RAG Chatbot API Route
 * POST /api/chat
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { retrieveRelevantChunks } from '@/lib/rag/retriever';
import { generateGroundedAnswer } from '@/lib/rag/generator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    let body: { message?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const { message } = body;

    // 1. Validate Input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question message cannot be empty.' },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim().slice(0, 1000);

    // 2. Hybrid Retrieval Pipeline
    const retrievedResults = await retrieveRelevantChunks(cleanMessage, {
      topK: 4,
      minSemanticThreshold: 0.15,
      minHybridThreshold: 0.20,
    });

    // 3. Grounded Generation
    const { stream, sources } = await generateGroundedAnswer(
      cleanMessage,
      retrievedResults
    );

    // 4. Return streaming response with citations in header
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Sources': encodeURIComponent(JSON.stringify(sources)),
      },
    });
  } catch (error) {
    console.error('RAG Chatbot Error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while processing your request.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

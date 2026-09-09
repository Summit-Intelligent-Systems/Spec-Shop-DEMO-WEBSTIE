/**
 * XYZ Eyewear — Hybrid RAG Retriever
 *
 * Combines:
 * 1. Dense Semantic Vector Search (Cosine similarity over 384-dimensional neural embeddings)
 * 2. Lexical Keyword Matching (BM25-style term frequency, exact code/id matches, keyword overlap)
 * 3. Score Fusion (Reciprocal Rank Fusion / Convex Combination)
 * 4. Relevance Thresholding (Excludes irrelevant chunks)
 * 5. Source Citation Extraction
 */

import { KNOWLEDGE_CHUNKS } from './knowledgeBase';
import type { KnowledgeChunk } from './knowledgeBase';
import { generateEmbedding, cosineSimilarity, getChunkEmbeddings } from './embeddings';

export interface RetrievedResult {
  chunk: KnowledgeChunk;
  semanticScore: number;
  lexicalScore: number;
  hybridScore: number;
}

export interface SourceCitation {
  id: string;
  title: string;
  url: string;
  category: string;
}

/**
 * Simple English stemmer for common suffixes
 */
function stemWord(word: string): string {
  const w = word.toLowerCase();
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('es') && w.length > 3) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  if (w.endsWith('ing') && w.length > 4) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  return w;
}

const GREETING_TOKENS = new Set(['hi', 'hello', 'hey', 'heyy', 'hola', 'namaste', 'howdy', 'sup', 'yo']);

/**
 * Calculates BM25-style lexical matching score between query and a chunk
 */
function computeLexicalScore(query: string, chunk: KnowledgeChunk): number {
  const queryClean = query.toLowerCase().trim();
  const rawTokens = queryClean.split(/[^a-z0-9+₹]/).filter((t) => t.length > 1);

  if (rawTokens.length === 0) return 0;

  // If query is purely a greeting, avoid false-positive lexical matching on products
  if (rawTokens.every((t) => GREETING_TOKENS.has(t))) {
    return 0;
  }

  const contentLower = chunk.content.toLowerCase();
  const titleLower = chunk.title.toLowerCase();
  const tagsLower = chunk.tags.map((t) => t.toLowerCase());

  let matchScore = 0;

  for (const rawToken of rawTokens) {
    if (GREETING_TOKENS.has(rawToken)) continue;

    const stemmed = stemWord(rawToken);

    // Exact word boundary regex check
    const exactRegex = new RegExp(`\\b${rawToken}\\b`, 'i');
    const tokenRegex = rawToken.length > 3 ? new RegExp(`\\b${stemmed}`, 'i') : exactRegex;

    // Title match
    if (exactRegex.test(titleLower)) {
      matchScore += 3.0;
    } else if (tokenRegex.test(titleLower)) {
      matchScore += 2.0;
    }

    // Tag match
    if (tagsLower.some((tag) => tag === rawToken || (rawToken.length > 3 && tag.includes(stemmed)))) {
      matchScore += 2.5;
    }

    // Body content match
    if (exactRegex.test(contentLower)) {
      matchScore += 1.2;
    } else if (tokenRegex.test(contentLower)) {
      matchScore += 0.8;
    }
  }

  // Exact phrase match bonus (only for non-trivial phrases)
  if (queryClean.length > 4 && !GREETING_TOKENS.has(queryClean) && (contentLower.includes(queryClean) || titleLower.includes(queryClean))) {
    matchScore += 3.5;
  }

  // Domain specific intent triggers
  // Eye Exam intent
  if (
    (queryClean.includes('eye') || queryClean.includes('optometrist')) &&
    (queryClean.includes('test') || queryClean.includes('exam') || queryClean.includes('check') || queryClean.includes('free') || queryClean.includes('cost'))
  ) {
    if (chunk.id === 'eye-care-clinic') {
      matchScore += 6.0;
    }
  }

  // Discount / Coupon intent
  if (queryClean.includes('discount') || queryClean.includes('coupon') || queryClean.includes('promo') || queryClean.includes('code') || queryClean.includes('luxe15')) {
    if (chunk.id === 'store-policies-warranty') {
      matchScore += 5.0;
    }
  }

  // Sizing / Dimensions intent
  if (queryClean.includes('size') || queryClean.includes('dimension') || queryClean.includes('measure') || queryClean.includes('card') || queryClean.includes('fit')) {
    if (chunk.id === 'frame-sizing-guide') {
      matchScore += 4.5;
    }
  }

  // Face shape intent
  if (queryClean.includes('face') || queryClean.includes('shape') || queryClean.includes('round face') || queryClean.includes('oval') || queryClean.includes('jawline')) {
    if (chunk.id === 'face-shape-guide') {
      matchScore += 4.5;
    }
  }

  // Material & Craftsmanship intent
  if (queryClean.includes('material') || queryClean.includes('titanium') || queryClean.includes('acetate') || queryClean.includes('craft') || queryClean.includes('japan') || queryClean.includes('italy') || queryClean.includes('hinge') || queryClean.includes('quality')) {
    if (chunk.id === 'craftsmanship-materials') {
      matchScore += 5.0;
    }
  }

  // Warranty & Returns intent
  if (queryClean.includes('warrant') || queryClean.includes('return') || queryClean.includes('refund') || queryClean.includes('exchange') || queryClean.includes('policy')) {
    if (chunk.id === 'store-policies-warranty') {
      matchScore += 5.0;
    }
  }

  // Store locations intent
  if (queryClean.includes('store') || queryClean.includes('boutique') || queryClean.includes('location') || queryClean.includes('salon') || queryClean.includes('bengaluru') || queryClean.includes('mumbai') || queryClean.includes('delhi') || queryClean.includes('hyderabad')) {
    if (chunk.id === 'stores-network') {
      matchScore += 5.0;
    }
  }

  const maxPossible = rawTokens.length * 3.0 + 5.0;
  return Math.min(1.0, matchScore / maxPossible);
}

/**
 * Performs hybrid retrieval combining neural semantic search and lexical matching
 */
export async function retrieveRelevantChunks(
  query: string,
  options: {
    topK?: number;
    minSemanticThreshold?: number;
    minHybridThreshold?: number;
  } = {}
): Promise<RetrievedResult[]> {
  const {
    topK = 4,
    minSemanticThreshold = 0.15,
    minHybridThreshold = 0.20,
  } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  // 1. Generate query neural embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Get cached chunk embeddings
  const chunkEmbeddings = getChunkEmbeddings();

  // 3. Score every chunk
  const results: RetrievedResult[] = [];

  for (const chunk of KNOWLEDGE_CHUNKS) {
    const chunkVector = chunkEmbeddings.get(chunk.id);
    let semanticScore = 0;

    if (chunkVector) {
      semanticScore = cosineSimilarity(queryEmbedding, chunkVector);
      // Map [-1, 1] cosine similarity to [0, 1] range for score fusion
      semanticScore = Math.max(0, semanticScore);
    }

    const lexicalScore = computeLexicalScore(query, chunk);

    // Hybrid fusion: 60% semantic similarity + 40% lexical/exact match
    const hybridScore = 0.60 * semanticScore + 0.40 * lexicalScore;

    // Filter out chunks that do not meet the minimum relevance threshold
    if (hybridScore >= minHybridThreshold || semanticScore >= minSemanticThreshold) {
      results.push({
        chunk,
        semanticScore,
        lexicalScore,
        hybridScore,
      });
    }
  }

  // 4. Sort results descending by hybrid score
  results.sort((a, b) => b.hybridScore - a.hybridScore);

  // 5. Return top K
  return results.slice(0, topK);
}

/**
 * Formats retrieved chunks into grounded context string for the LLM
 */
export function formatContext(retrievedResults: RetrievedResult[]): string {
  if (retrievedResults.length === 0) {
    return 'NO RELEVANT WEBSITE RESOURCES FOUND.';
  }

  return retrievedResults
    .map((res, index) => {
      return `[RESOURCE ${index + 1}: ${res.chunk.title} (${res.chunk.category})]\nURL: ${res.chunk.url}\n${res.chunk.content}\n`;
    })
    .join('\n---\n\n');
}

/**
 * Extracts unique, clickable source citations from retrieved results
 */
export function extractSources(retrievedResults: RetrievedResult[]): SourceCitation[] {
  const seen = new Set<string>();
  const citations: SourceCitation[] = [];

  for (const res of retrievedResults) {
    if (!seen.has(res.chunk.id)) {
      seen.add(res.chunk.id);
      citations.push({
        id: res.chunk.id,
        title: res.chunk.title,
        url: res.chunk.url,
        category: res.chunk.category,
      });
    }
  }

  return citations;
}

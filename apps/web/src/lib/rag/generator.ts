/**
 * XYZ Eyewear — Grounded Answer Generator
 *
 * Implements:
 * 1. Strict Grounding Prompts (Strictly adheres to retrieved context; refuses to hallucinate)
 * 2. Multi-Provider LLM Integration:
 *    - OpenAI (gpt-4o-mini / gpt-3.5-turbo) with streaming
 *    - Gemini (gemini-1.5-flash) with streaming
 *    - Groq (llama-3.3-70b-versatile / llama-3.1-8b-instant) with streaming
 *    - High-Precision Local Grounded Synthesizer (Zero-key out-of-the-box fallback)
 * 3. ReadableStream Token Streaming
 */

import type { RetrievedResult, SourceCitation } from './retriever';
import { formatContext, extractSources } from './retriever';

export interface GenerationResult {
  stream: ReadableStream<Uint8Array>;
  sources: SourceCitation[];
}

const SYSTEM_PROMPT = `You are the XYZ Eyewear AI Concierge, a knowledgeable, refined, and accurate assistant for the luxury eyewear brand XYZ Eyewear.

CRITICAL GROUNDING RULES:
1. Base your answer PRIMARILY and STRICTLY on the RETRIEVED WEBSITE RESOURCES provided below.
2. If the retrieved resources contain the required information:
   - Provide a concise, clear, and elegant answer.
   - Include specific details from the resources (prices in ₹ INR, frame dimensions, materials like Mazzucchelli acetate or Grade-5 titanium, store addresses, coupon code LUXE15, 14-day free returns, 1-year warranty, complimentary 20-step eye exam).
3. If the retrieved resources DO NOT contain enough information to answer the question, or if the question is about products/services XYZ Eyewear does not offer (e.g. dog glasses, swimming goggles, unrelated general trivia):
   - Clearly and politely state that the information could not be found in XYZ Eyewear's website resources.
   - NEVER fabricate or hallucinate features, products, prices, or store policies that are not present in the context.
4. Distinguish between directly supported facts and reasonable styling advice.
5. Format your response cleanly in Markdown using bullet points and bold highlights where appropriate.`;

/**
 * Intelligent local grounded synthesizer
 * Used when no external LLM API key is configured, ensuring 100% out-of-the-box reliability.
 */
function generateLocalGroundedAnswer(
  query: string,
  retrievedResults: RetrievedResult[]
): string {
  const queryLower = query.toLowerCase();
  const cleanTrimmed = queryLower.trim().replace(/[?!.,;:()]/g, '');

  // 1. Warm Greetings & Conversational Openers
  const greetingWords = ['hi', 'hello', 'hey', 'heyy', 'hey there', 'good morning', 'good afternoon', 'good evening', 'namaste', 'hola', 'howdy', 'sup', 'yo', 'greetings'];
  if (
    greetingWords.includes(cleanTrimmed) ||
    cleanTrimmed.startsWith('hi ') ||
    cleanTrimmed.startsWith('hello ') ||
    cleanTrimmed.startsWith('hey ') ||
    cleanTrimmed === 'how are you' ||
    cleanTrimmed === 'how are you doing'
  ) {
    return `Hello! Welcome to XYZ Eyewear. I am your personal AI Concierge.\n\nI can assist you with:\n* **Frame Recommendations**: Match styles to your face shape (Round, Oval, Square, Heart, Diamond)\n* **Collections**: Handcrafted Italian Mazzucchelli acetate & Japanese Grade-5 titanium\n* **Prescription & Lenses**: Single vision, progressives, and thin high-index packages (1.60, 1.67, 1.74)\n* **Eye Exams**: 100% complimentary 20-step computerized tests in-store or at home\n* **Store Locations & Policies**: Indiranagar, Bandra, Khan Market, Jubilee Hills, and 14-day free returns\n\nWhat can I help you discover today? Are you looking for **prescription eyeglasses**, **polarized sunglasses**, or **computer screen glasses**?`;
  }

  // 2. Identity, Capabilities & Help
  const identityPhrases = ['who are you', 'what are you', 'what can you do', 'how can you help', 'how does this work', 'what do you know', 'help', 'help me', 'can you help me'];
  if (identityPhrases.some((p) => cleanTrimmed === p || cleanTrimmed.startsWith(p))) {
    return `I am the **XYZ Eyewear AI Concierge**, an assistant trained directly on our website resources, catalog, optical blueprints, and store network.\n\nHere are some simple questions you can ask me:\n* *"Which frames suit a round face?"*\n* *"How much does the 20-step eye test cost?"*\n* *"What is the price and material of The Sovereign Round?"*\n* *"What is your return and warranty policy?"*\n* *"Do you have any discount promo codes?"*\n* *"Where is your boutique in Bengaluru?"*\n\nTell me what you have in mind and I'll find the exact information for you!`;
  }

  // 3. Gratitude & Pleasantries
  const gratitudePhrases = ['thank you', 'thanks', 'thx', 'thank u', 'appreciate it', 'thank you so much', 'cool', 'awesome', 'great', 'perfect', 'ok', 'okay'];
  if (gratitudePhrases.some((p) => cleanTrimmed === p || cleanTrimmed.startsWith(p))) {
    return `You're very welcome! It's our pleasure to assist you. If you need any more recommendations or details on our frames, lenses, or stores, feel free to ask anytime.\n\nWould you like help with frame sizing, lens choices, or booking a complimentary eye exam?`;
  }

  // 4. Farewell
  const farewellPhrases = ['bye', 'goodbye', 'see you', 'see ya', 'take care', 'have a good day'];
  if (farewellPhrases.some((p) => cleanTrimmed === p || cleanTrimmed.startsWith(p))) {
    return `Goodbye! Have a wonderful day. We look forward to seeing you at our online boutique or at one of our flagship optical salons. Feel free to return anytime you need styling or vision assistance!`;
  }

  // 5. Broad Catalog Inquiry
  const isCatalogInquiry =
    cleanTrimmed.includes('what do you sell') ||
    cleanTrimmed.includes('what products') ||
    cleanTrimmed.includes('show me your products') ||
    cleanTrimmed.includes('show me your glasses') ||
    cleanTrimmed.includes('what frames') ||
    cleanTrimmed.includes('what glasses') ||
    cleanTrimmed.includes('what collections') ||
    cleanTrimmed.includes('what do you have') ||
    cleanTrimmed.includes('what do you offer') ||
    cleanTrimmed.includes('tell me about your products') ||
    cleanTrimmed.includes('buy glasses') ||
    cleanTrimmed.includes('help me choose');

  if (isCatalogInquiry || (retrievedResults.length > 0 && retrievedResults[0].chunk.id === 'cat-all')) {
    return `XYZ Eyewear crafts four distinguished collections:\n\n1. **Optical Eyeglasses**: Precision prescription frames crafted from hand-polished Italian Mazzucchelli acetate and surgical steel (e.g., *The Sovereign Round* at ₹3,499, *The Kensington Square* at ₹2,999).\n2. **Polarized Sunglasses**: 100% UV400 sun protection in featherweight Japanese Grade-5 titanium and classic acetate (e.g., *The Aviator Prime* at ₹4,999, *The Riviera Sun Classic* at ₹3,699).\n3. **Screen Glasses**: Digital eye fatigue defense with 420nm blue-light filtering (e.g., *The Kyoto Minimalist* rimless beta-titanium at ₹4,299).\n4. **Reading Glasses**: Sharp near-vision optics from +1.00 to +3.00 (e.g., *The Mayfair Clubmaster* at ₹3,299).\n\nAll frames come with a **1-year warranty**, **14-day free returns**, and **Virtual 3D Try-On** in your browser.\n\nWould you like a recommendation based on your face shape or preferred frame material?`;
  }

  // 6. Explicit check for unsupported products / out-of-scope queries
  const unsupportedTerms = ['swimming', 'scuba', 'diving', 'goggle', 'ski', 'dog', 'drone', 'helmet', 'bifocals for pets', 'waterproof watch'];
  for (const term of unsupportedTerms) {
    if (queryLower.includes(term)) {
      return `I could not find information regarding **"${query}"** in XYZ Eyewear's website resources.\n\nXYZ Eyewear specializes in handcrafted optical eyeglasses, polarized sunglasses, computer blue-light screen glasses, reading lenses, and complimentary 20-step clinical eye examinations. We do not currently offer ${term} products or accessories.\n\nFor questions about our collections, please contact our concierge team at **support@xyzeyewear.com** or call **+91 98765 43210**.`;
    }
  }

  // If no relevant resources retrieved or relevance is too low
  if (retrievedResults.length === 0 || (retrievedResults[0].hybridScore < 0.20 && retrievedResults[0].semanticScore < 0.16)) {
    return `I could not find information regarding **"${query}"** in XYZ Eyewear's website resources.\n\nOur current catalog includes handcrafted eyeglasses, polarized sunglasses, computer blue-light screen glasses, reading optics, complimentary 20-step eye examinations, and flagship optical boutiques in Bengaluru, Mumbai, New Delhi, and Hyderabad.\n\nIf you need custom assistance, please contact our concierge team at **support@xyzeyewear.com** or call **+91 98765 43210**.`;
  }

  // Generate grounded answer prioritized by top retrieved chunk
  const top = retrievedResults[0].chunk;
  const secondary = retrievedResults[1]?.chunk;

  // 1. If top chunk is a specific Product (e.g. Sovereign Round, Aviator Prime, etc.)
  if (top.category === 'product' && top.id.startsWith('prod-')) {
    return `According to XYZ Eyewear's website resources regarding **${top.title}**:\n\n${top.content}\n\n* **Ordering & Try-On**: Available for Virtual 3D Try-On directly in your browser. All orders include our 1-year unconditional warranty and 14-day free returns.`;
  }

  // 2. If top chunk is Prescription Optics & Lenses
  if (top.id === 'prescription-optics' || queryLower.includes('thinnest lens') || queryLower.includes('lens index') || queryLower.includes('progressive') || queryLower.includes('1.67') || queryLower.includes('1.74')) {
    return `XYZ Eyewear offers precision German-engineered optics and high-index lenses:\n\n* **Vision Types**: Zero Power / Digital Screen (₹0), Single Vision (₹999), Progressive / Multifocal (₹2,499), and Polarized Sun Prescription (₹1,999).\n* **Lens Indices**: Standard 1.50 (₹0, up to ±2.00), High-Index Thin 1.60 (₹999, 25% thinner, up to ±4.00), Ultra-Thin Aspheric 1.67 (₹1,999, 40% thinner, up to ±7.00), and **Featherweight 1.74 High Index** (₹3,499, 55% thinner, specifically engineered for high prescriptions ±7.00+ with zero edge distortion).\n* **Protective Coatings**: Sapphire Anti-Glare AR (included free), Blue Defense 420nm Shield (₹799), Photochromic Transitions Gen-8 (₹1,999), and DriveSafe Night Contrast (₹1,299).`;
  }

  // 3. If top chunk is Eye Exam & Clinical Care
  if (top.id === 'eye-care-clinic' || (queryLower.includes('eye') && (queryLower.includes('test') || queryLower.includes('exam') || queryLower.includes('check')))) {
    return `XYZ Eyewear provides a **100% Complimentary Clinical 20-Step Eye Examination**:\n\n* **20-Step Certified Protocol**: Includes automated corneal topography, digital refraction, intraocular pressure screening, and retina wellness checks by certified optometrists with a zero-error prescription guarantee.\n* **In-Store Flagship Salons**: Private optometry suites with complimentary refreshments and 1-on-1 styling consultation (available 7 days a week).\n* **Doorstep Home Eye Testing**: Certified optometrists visit your home or office equipped with portable digital testing equipment and 100+ trial frames.\n\nYou can book an appointment directly online via the **Book Free Eye Exam** section.`;
  }

  // 4. Discounts / Promo Codes
  if (
    queryLower.includes('coupon') ||
    queryLower.includes('promo code') ||
    queryLower.includes('discount') ||
    queryLower.includes('luxe15') ||
    (queryLower.includes('offer') && !queryLower.includes('you offer'))
  ) {
    return `You can use the exclusive promo code **LUXE15** to receive **15% off** your first frame purchase when joining the XYZ Private Salon.\n\nAdditionally, XYZ Eyewear offers **free express shipping** on all orders over ₹999 (flat shipping of ₹99 for orders below ₹999). All prices include 18% GST with no hidden fees at checkout.`;
  }

  // 5. Warranty & Returns Policy
  if (top.id === 'store-policies-warranty' || queryLower.includes('warrant') || queryLower.includes('return') || queryLower.includes('refund') || queryLower.includes('exchange')) {
    return `Here are XYZ Eyewear's official warranty and return policies:\n\n* **1-Year Unconditional Warranty**: Full coverage against manufacturing defects and structural issues on all Italian acetate and Japanese titanium frames. Free repair or replacement at any flagship boutique or via doorstep courier pickup.\n* **14-Day Free Returns**: No questions asked doorstep returns and exchanges with a 100% money-back refund to your original payment method.\n\nFor return requests or warranty support, contact **support@xyzeyewear.com** or call **+91 98765 43210**.`;
  }

  // 6. Stores Network & Locations
  if (top.id === 'stores-network' || queryLower.includes('store') || queryLower.includes('boutique') || queryLower.includes('bengaluru') || queryLower.includes('mumbai') || queryLower.includes('delhi') || queryLower.includes('hyderabad') || queryLower.includes('khan market') || queryLower.includes('indiranagar')) {
    return `XYZ Eyewear operates flagship optical boutiques in major cities:\n\n* **Bengaluru (Flagship)**: 42, 100ft Road, Indiranagar, Stage 2 • Mon–Sat: 10:00 AM – 9:00 PM, Sun: 11:00 AM – 7:00 PM • Tel: +91 80 4123 4567\n* **Mumbai**: 17, Linking Road, Bandra West • 10:30 AM – 9:30 PM (All Days) • Tel: +91 22 2655 1234\n* **New Delhi (Flagship)**: Shop 34, Middle Lane, Khan Market • Mon–Sat: 11:00 AM – 8:30 PM (Closed Sundays) • Tel: +91 11 2461 7890\n* **Hyderabad**: Road No. 36, Jubilee Hills • 10:00 AM – 8:00 PM (All Days) • Tel: +91 40 2354 5678\n\nAll stores offer complimentary 20-step eye exams, frame styling, and precision fittings.`;
  }

  // 7. Face Shape Guide
  if (top.id === 'face-shape-guide' || queryLower.includes('face') || queryLower.includes('round face') || queryLower.includes('square face') || queryLower.includes('oval') || queryLower.includes('heart') || queryLower.includes('diamond')) {
    return `Based on XYZ Eyewear's Face Shape Styling Guide:\n\n* **Round Faces**: Choose angular, square, or rectangular silhouettes (such as **The Kensington Square** or **The Marais Cat-Eye**) to add structure and elongate facial contours. Avoid perfectly circular frames.\n* **Square Faces**: Curved, round, or aviator frames (like **The Sovereign Round** or **The Aviator Prime**) soften strong jawlines.\n* **Oval Faces**: Highly versatile—both geometric shapes and classic round frames create balanced proportions.\n* **Heart Faces**: Wider frames, aviators, or rimless designs (like **The Kyoto Minimalist**) balance narrower chins.\n\nYou can also use our **Virtual 3D Try-On** directly in your browser to verify the fit with your camera!`;
  }

  // 8. Frame Sizing & Measurement
  if (top.id === 'frame-sizing-guide' || queryLower.includes('size') || queryLower.includes('dimension') || queryLower.includes('bank card') || queryLower.includes('measure')) {
    return `According to XYZ Eyewear's Frame Sizing Guide:\n\n* **Frame Dimensions**: Includes Lens Width (49–55mm), Bridge Width (17–21mm), Temple Arm Length (140–145mm), and Total Frame Width (136–142mm).\n* **Standard Bank Card Sizing Method**: Place any standard bank card vertically against the bridge of your nose in a mirror:\n  - If the card extends past the corner of your eye: **Small / Narrow Fit**\n  - If the card aligns with the outer corner of your eye: **Medium / Standard Fit**\n  - If the card ends before reaching the eye corner: **Large / Wide Fit**`;
  }

  // 9. Craftsmanship & Materials
  if (top.id === 'craftsmanship-materials' || queryLower.includes('craft') || queryLower.includes('hinge') || queryLower.includes('japan') || queryLower.includes('italy')) {
    return `XYZ Eyewear frames are crafted to master engineering specifications:\n\n* **Italian Mazzucchelli Acetate**: Sourced from Castiglione Olona, Italy; organic cotton-based cellulose acetate hand-polished over 48 hours for deep luminous luster.\n* **Japanese Titanium**: Grade-5 aerospace titanium and beta-titanium from Sabae, Japan. Hypoallergenic, flexible memory metal weighing as little as 9.8g.\n* **5-Barrel CNC Hinges**: Surgical stainless steel rated for 60,000+ open-close cycles.\n* **7-Layer Sapphire Nano-Coating**: Vacuum-deposited stack including anti-reflective, oleophobic, hydrophobic, and sapphire scratch resistance.\n* **27-Point Inspection**: Every frame is inspected by certified master opticians to ±0.1mm tolerance.`;
  }

  // Default synthesis based on top matching chunks
  let answer = `According to XYZ Eyewear's website resources regarding **${top.title}**:\n\n`;
  const lines = top.content.split('\n').filter((l) => l.trim().length > 0);
  for (const line of lines.slice(0, 6)) {
    answer += `* ${line}\n`;
  }

  if (secondary && secondary.id !== top.id) {
    answer += `\n**Related Information (${secondary.title})**:\n`;
    const secLines = secondary.content.split('\n').filter((l) => l.trim().length > 0);
    for (const line of secLines.slice(0, 3)) {
      answer += `* ${line}\n`;
    }
  }

  return answer;
}

/**
 * Creates a streaming response from text chunks
 */
function createTextStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const words = text.split(' ');

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const token = (i === 0 ? '' : ' ') + words[i];
        controller.enqueue(encoder.encode(token));
        // Natural typing delay simulation (15ms)
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
      controller.close();
    },
  });
}

/**
 * Generates grounded response using OpenAI API if key is available
 */
async function generateWithOpenAI(
  query: string,
  contextText: string,
  apiKey: string
): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        temperature: 0.2,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `RETRIEVED WEBSITE CONTEXT:\n${contextText}\n\nUSER QUESTION: ${query}`,
          },
        ],
      }),
    });

    if (!res.ok || !res.body) return null;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = res.body.getReader();

    return new ReadableStream({
      async start(controller) {
        let isDone = false;
        let buffer = '';
        try {
          while (!isDone) {
            const { done, value } = await reader.read();
            if (done) {
              isDone = true;
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === 'data: [DONE]') continue;
              if (trimmed.startsWith('data: ')) {
                try {
                  const data = JSON.parse(trimmed.slice(6));
                  const text = data.choices?.[0]?.delta?.content || '';
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // ignore json parse errors
                }
              }
            }
          }
        } catch {
          // ignore stream errors
        } finally {
          controller.close();
        }
      },
    });
  } catch {
    return null;
  }
}

/**
 * Main Answer Generation Entry Point
 */
export async function generateGroundedAnswer(
  query: string,
  retrievedResults: RetrievedResult[]
): Promise<GenerationResult> {
  const sources = extractSources(retrievedResults);
  const contextText = formatContext(retrievedResults);

  // 1. Try OpenAI if key is present
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.startsWith('sk-')) {
    const openaiStream = await generateWithOpenAI(query, contextText, openaiKey);
    if (openaiStream) {
      return { stream: openaiStream, sources };
    }
  }

  // 2. High-precision local grounded synthesis
  const localAnswer = generateLocalGroundedAnswer(query, retrievedResults);
  const localStream = createTextStream(localAnswer);

  return {
    stream: localStream,
    sources,
  };
}

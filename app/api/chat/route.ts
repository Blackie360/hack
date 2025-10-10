import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { researchTools } from '@/lib/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check if API key is configured
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return new Response(
        JSON.stringify({
          error: 'Gemini API key is not configured. Please add your GOOGLE_GENERATIVE_AI_API_KEY to .env.local',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // System prompt for the research agent
    const systemPrompt = `You are a deep research assistant powered by Google Gemini. Your role is to help users find accurate, comprehensive information on any topic.

Key capabilities:
- Use the web_search tool to find current information, news, research, and facts
- Perform multiple searches if needed to gather comprehensive information
- Synthesize findings into clear, well-organized responses
- Cite sources by including URLs when presenting information
- Be thorough but concise in your responses

Guidelines:
- Always search for current information rather than relying on training data for factual queries
- When presenting search results, include relevant URLs for reference
- If a search fails or web search is not available, clearly state this and provide what information you can
- For research topics, consider multiple angles and perspectives
- Organize information logically with clear sections and bullet points when appropriate`;

    const result = streamText({
      model: google('gemini-2.0-flash-exp'),
      system: systemPrompt,
      messages,
      tools: researchTools,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


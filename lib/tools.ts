import { tool } from 'ai';
import { z } from 'zod';

/**
 * Web search tool using Tavily API
 * Performs deep web searches and returns relevant results
 */
export const webSearchTool = tool({
  description: `Search the web for current information, news, articles, and research on any topic. 
  Use this when you need up-to-date information, facts, statistics, or to research specific topics.
  The search will return relevant snippets and sources from across the web.`,
  parameters: z.object({
    query: z.string().describe('The search query to look up'),
    searchDepth: z
      .enum(['basic', 'advanced'])
      .default('basic')
      .describe('Search depth: basic for quick results, advanced for comprehensive research'),
  }),
  execute: async ({ query, searchDepth }) => {
    const apiKey = process.env.TAVILY_API_KEY;

    // If no API key is provided, return a helpful message
    if (!apiKey || apiKey === 'your_tavily_api_key_here') {
      return {
        success: false,
        message: 'Web search is not configured. Please add your TAVILY_API_KEY to .env.local to enable web search functionality. Get a free key at https://tavily.com/',
        results: [],
      };
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: searchDepth,
          include_answer: true,
          include_raw_content: false,
          max_results: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        query,
        answer: data.answer,
        results: data.results?.map((result: {
          title: string;
          url: string;
          content: string;
          score: number;
        }) => ({
          title: result.title,
          url: result.url,
          content: result.content,
          score: result.score,
        })) || [],
      };
    } catch (error) {
      console.error('Web search error:', error);
      return {
        success: false,
        message: `Failed to perform web search: ${error instanceof Error ? error.message : 'Unknown error'}`,
        results: [],
      };
    }
  },
});

/**
 * Research synthesis tool
 * Helps organize and synthesize information from multiple searches
 */
export const synthesizeTool = tool({
  description: `Synthesize and organize research findings into a coherent summary.
  Use this after gathering information to create a structured response.`,
  parameters: z.object({
    topic: z.string().describe('The main topic being researched'),
    findings: z.array(z.string()).describe('Key findings from the research'),
  }),
  execute: async ({ topic, findings }) => {
    return {
      topic,
      summary: `Research findings on "${topic}":`,
      findings,
      timestamp: new Date().toISOString(),
    };
  },
});

// Export all tools as an object
export const researchTools = {
  web_search: webSearchTool,
  synthesize: synthesizeTool,
};


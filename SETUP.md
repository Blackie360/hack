# 🚀 DeepReach Agent - Setup Guide

## Quick Start

Follow these steps to get your DeepReach AI research agent up and running!

### 1. Install Dependencies

The project uses **pnpm** as the package manager:

```bash
cd deepreach-agent
pnpm install
```

### 2. Configure API Keys

Create a `.env.local` file in the project root with your API keys:

```bash
# Required: Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional: Tavily API Key (for web search)
TAVILY_API_KEY=your_tavily_api_key_here
```

#### Getting Your API Keys:

**Google Gemini API Key (Required):**
1. Visit: https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

**Tavily API Key (Optional - for web search):**
1. Visit: https://tavily.com/
2. Sign up for a free account (1,000 searches/month free)
3. Copy your API key from the dashboard
4. Paste it in `.env.local`

> **Note:** The agent will work without the Tavily API key, but web search functionality will be disabled.

### 3. Run the Development Server

```bash
pnpm dev
```

The application will start on: **http://localhost:3000**

### 4. Build for Production

To create an optimized production build:

```bash
pnpm build
pnpm start
```

## 🎯 Features

✅ **AI-Powered Research** - Uses Google Gemini 2.0 Flash  
✅ **Web Search Integration** - Real-time web search with Tavily API (optional)  
✅ **Streaming Responses** - See AI responses in real-time  
✅ **Tool Visualization** - Watch the AI use tools to research  
✅ **Markdown Support** - Rich formatting with code highlighting  
✅ **Modern UI** - Beautiful interface with shadcn/ui components  
✅ **Iconify Icons** - 200,000+ icons from https://iconify.design/

## 📁 Project Structure

```
deepreach-agent/
├── app/
│   ├── api/chat/route.ts        # AI agent API endpoint
│   ├── page.tsx                  # Main chat interface
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles
├── components/
│   ├── chat-interface.tsx        # Chat UI with markdown & tool display
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── tools.ts                  # AI agent tools (web search, synthesis)
│   └── utils.ts                  # Utility functions
├── .env.local                    # Your API keys (create this!)
├── package.json                  # Dependencies
└── README.md                     # Full documentation
```

## 🛠️ Key Technologies

- **Next.js 15** - React framework with App Router
- **Vercel AI SDK 4.x** - AI integration framework
- **Google Gemini** - Large language model
- **Tavily API** - Web search provider
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling framework
- **Iconify** - Icon system
- **TypeScript** - Type safety
- **pnpm** - Fast package manager

## 🔧 Package Versions

The project uses specific versions for compatibility:

```json
{
  "ai": "4.3.19",
  "@ai-sdk/google": "1.2.22",
  "zod": "3.25.76"
}
```

These versions are locked to ensure stability. Upgrading may cause compatibility issues.

## 💬 Usage Examples

Once running, try these example queries:

- "What are the latest developments in AI agents?"
- "Research the current state of quantum computing"
- "What are the most recent breakthroughs in renewable energy?"
- "Explain the latest trends in web development"

The agent will:
1. Analyze your question
2. Decide if web search is needed
3. Perform searches using Tavily API (if available)
4. Synthesize information
5. Provide a comprehensive answer with sources

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is busy:

```bash
pnpm dev -p 3001
```

### API Key Errors

- Make sure `.env.local` exists in the project root
- Check that your keys don't have extra spaces
- Restart the dev server after adding keys

### Build Errors

If you encounter package version issues:

```bash
# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Web Search Not Working

If web search functionality isn't working:
- Check that `TAVILY_API_KEY` is set in `.env.local`
- The free tier has 1,000 searches/month
- Without the key, the agent will still work but won't search the web

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import to Vercel (https://vercel.com)
3. Add environment variables in project settings:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `TAVILY_API_KEY` (optional)
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

## 📚 Next Steps

- Customize the system prompt in `app/api/chat/route.ts`
- Add more tools in `lib/tools.ts`
- Modify the UI theme in `app/globals.css`
- Add Context7 MCP integration for latest docs
- Implement conversation persistence

## 🤝 Support

For issues or questions:
- Check the README.md for detailed documentation
- Review the code comments in each file
- Test with simple queries first

---

Built with ❤️ using Vercel AI SDK, Google Gemini, and Next.js


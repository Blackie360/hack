# 🚀 DeepReach Agent

An AI-powered deep research assistant built with **Vercel AI SDK**, **Google Gemini**, and **Next.js**. This agent can perform web searches, synthesize information, and provide comprehensive research on any topic.

![DeepReach Agent](https://img.shields.io/badge/AI-Gemini-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## ✨ Features

- 🤖 **AI-Powered Research**: Uses Google Gemini 2.0 Flash for intelligent responses
- 🔍 **Web Search Integration**: Real-time web search using Tavily API (optional)
- 💬 **Interactive Chat Interface**: Beautiful, responsive chat UI with streaming responses
- 🛠️ **Agentic Workflow**: Uses tools and multi-step reasoning for comprehensive research
- 📝 **Markdown Rendering**: Rich text formatting with syntax highlighting
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- ⚡ **Real-time Streaming**: See responses as they're generated
- 🔗 **Source Citations**: Includes URLs and references from web searches

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **LLM**: [Google Gemini](https://ai.google.dev/) (gemini-2.0-flash-exp)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Iconify](https://iconify.design/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager**: pnpm

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))
- Tavily API key for web search ([Get free tier here](https://tavily.com/)) - Optional

### Installation

1. **Clone and install dependencies**:

```bash
cd deepreach-agent
pnpm install
```

2. **Set up environment variables**:

Create a `.env.local` file in the project root:

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional (for web search)
TAVILY_API_KEY=your_tavily_api_key_here
```

3. **Run the development server**:

```bash
pnpm dev
```

4. **Open your browser**:

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Queries

Simply type your research question in the chat interface:

- "What are the latest developments in AI agents?"
- "Research the current state of quantum computing"
- "Explain the latest trends in web development"

### How It Works

1. **User Input**: You ask a question
2. **Agent Reasoning**: Gemini decides if web search is needed
3. **Tool Execution**: Searches the web using Tavily API (if configured)
4. **Response Generation**: Synthesizes findings into a comprehensive answer
5. **Citations**: Includes source URLs for verification

## 🏗️ Project Structure

```
deepreach-agent/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI agent API endpoint
│   ├── page.tsx                   # Main chat interface
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── chat-interface.tsx         # Chat UI components
│   └── ui/                        # shadcn components
├── lib/
│   ├── tools.ts                   # Agent tool definitions
│   └── utils.ts                   # Utility functions
└── .env.local                     # Environment variables
```

## 🔧 Configuration

### Agent Settings

Edit `app/api/chat/route.ts` to customize:

- **Model**: Change `gemini-2.0-flash-exp` to other Gemini models
- **Temperature**: Adjust creativity (0.0 - 1.0)
- **Max Steps**: Number of tool calls allowed per conversation
- **System Prompt**: Customize agent behavior

### Tool Configuration

Edit `lib/tools.ts` to:

- Add new tools (calculator, code execution, etc.)
- Modify search parameters
- Customize tool descriptions

## 🌐 API Keys

### Google Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and add to `.env.local`

**Free Tier**: 60 requests per minute

### Tavily API (Optional)

1. Visit [Tavily](https://tavily.com/)
2. Sign up for free account
3. Copy API key from dashboard
4. Add to `.env.local`

**Free Tier**: 1,000 searches per month

> **Note**: The agent works without Tavily API but won't have web search capabilities.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

```bash
# Or use Vercel CLI
pnpm vercel
```

### Environment Variables on Vercel

Add these in your Vercel project settings:

- `GOOGLE_GENERATIVE_AI_API_KEY`
- `TAVILY_API_KEY` (optional)

## 🎨 Customization

### UI Theme

Edit `app/globals.css` to change color scheme:

```css
@layer base {
  :root {
    --primary: your-color-values;
    /* ... */
  }
}
```

### Icons

Using [Iconify](https://iconify.design/), you can easily change icons:

```tsx
<Icon icon="fluent:sparkle-24-filled" className="w-6 h-6" />
```

Browse 200,000+ icons at [Iconify Icon Sets](https://icon-sets.iconify.design/)

## 🤝 Future Enhancements

- [ ] Context7 MCP integration for latest documentation
- [ ] Multi-modal support (images, PDFs)
- [ ] Conversation history persistence
- [ ] Export research results
- [ ] Custom tool creation interface
- [ ] Multiple language support

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for the amazing AI framework
- [Google Gemini](https://ai.google.dev/) for the powerful LLM
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Iconify](https://iconify.design/) for the icon system
- [Tavily](https://tavily.com/) for web search API

---

Built with ❤️ using Vercel AI SDK and Google Gemini

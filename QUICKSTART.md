# ⚡ Quick Start - DeepReach Agent

## 🎉 Your AI Research Agent is Ready!

The development server is running at **http://localhost:3000**

## ⚠️ Important: Configure API Keys

Before using the agent, you need to add your Gemini API key:

### 1. Edit `.env.local`

Open `/home/blackie/crafts/hack/deepreach-agent/.env.local` and replace:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

With your actual key from: https://aistudio.google.com/apikey

### 2. (Optional) Add Web Search

For web search capabilities, also add:

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

Get a free key (1000 searches/month) from: https://tavily.com/

### 3. Restart the Server

After adding your keys, restart the dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd /home/blackie/crafts/hack/deepreach-agent
pnpm dev
```

## 🚀 What's Built

### ✅ Complete Features

1. **AI Chat Interface** - Beautiful, responsive chat UI with shadcn/ui
2. **Google Gemini Integration** - Powered by gemini-2.0-flash-exp  
3. **Web Search Tool** - Tavily API integration (optional)
4. **Tool Visualization** - See when and how the AI uses tools
5. **Markdown Rendering** - Rich text with code highlighting
6. **Streaming Responses** - Real-time AI responses
7. **Error Handling** - Graceful error messages
8. **Iconify Icons** - Beautiful icons from iconify.design

### 📁 Project Files

```
deepreach-agent/
├── app/
│   ├── api/chat/route.ts     ← AI agent endpoint (Gemini + tools)
│   ├── page.tsx              ← Main chat interface
│   ├── layout.tsx            ← App layout & metadata
│   └── globals.css           ← Global styles
├── components/
│   ├── chat-interface.tsx    ← Chat UI with tool visualization
│   └── ui/                   ← shadcn/ui components
├── lib/
│   ├── tools.ts              ← Web search & synthesis tools
│   └── utils.ts              ← Utilities
├── .env.local                ← Your API keys (EDIT THIS!)
├── package.json              ← Dependencies
├── README.md                 ← Full documentation
└── SETUP.md                  ← Detailed setup guide
```

## 🧪 Test the Agent

Once your API keys are configured, try these queries:

1. **Simple Question:**
   ```
   What is quantum computing?
   ```

2. **Web Search (if Tavily key is configured):**
   ```
   What are the latest developments in AI agents?
   ```

3. **Research Topic:**
   ```
   Research the current state of renewable energy technology
   ```

## 🎨 Customization

### Change System Prompt

Edit `app/api/chat/route.ts` (lines 20-40) to modify the agent's behavior.

### Add More Tools

Add new tools in `lib/tools.ts` following the existing pattern.

### Modify UI Theme

Edit colors in `app/globals.css` under the `:root` section.

### Change Icons

Browse 200,000+ icons at https://icon-sets.iconify.design/

Use them like:
```tsx
<Icon icon="fluent:sparkle-24-filled" className="w-6 h-6" />
```

## 📦 Production Build

When ready for production:

```bash
pnpm build
pnpm start
```

## 🚢 Deploy to Vercel

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DeepReach Agent"
   git push origin main
   ```

2. Deploy on Vercel:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables:
     - `GOOGLE_GENERATIVE_AI_API_KEY`
     - `TAVILY_API_KEY` (optional)
   - Click Deploy!

## 🔍 Context7 MCP Integration (Future)

To integrate Context7 MCP for latest documentation:

1. Install Context7 MCP Server
2. Configure in your editor (Cursor/VSCode)
3. Use `use context7` in prompts to fetch latest docs

See: https://github.com/upstash/context7

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **Vercel AI SDK 4.x** - AI orchestration
- **Google Gemini 2.0 Flash** - LLM
- **shadcn/ui** - UI components
- **Iconify** - Icon system
- **Tavily API** - Web search
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **pnpm** - Package manager

## ❓ Need Help?

- Check `SETUP.md` for detailed setup instructions
- Review `README.md` for full documentation
- Inspect the code - it's well-commented!

---

**📍 Location:** `/home/blackie/crafts/hack/deepreach-agent`

**🌐 URL:** http://localhost:3000

**🔑 Next Step:** Add your Google Gemini API key to `.env.local`

Happy researching! 🚀


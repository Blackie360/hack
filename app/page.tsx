'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInterface } from '@/components/chat-interface';
import { Icon } from '@iconify/react';
import { useEffect, useRef } from 'react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const exampleQueries = [
    'What are the latest developments in AI agents?',
    'Research the current state of quantum computing',
    'What are the most recent breakthroughs in renewable energy?',
    'Explain the latest trends in web development',
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon icon="fluent:sparkle-24-filled" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DeepReach Agent</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered research assistant with web search
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <EmptyState exampleQueries={exampleQueries} onSelectQuery={handleInputChange} />
          ) : (
            <ChatInterface messages={messages} isLoading={isLoading} />
          )}
          {error && <ErrorMessage error={error} />}
        </ScrollArea>

        {/* Input Area */}
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything to research..."
              className="flex-1 text-base"
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              <Icon icon="mingcute:send-fill" className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by Google Gemini • Uses web search for current information
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  exampleQueries,
  onSelectQuery,
}: {
  exampleQueries: string[];
  onSelectQuery: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Welcome to DeepReach</h2>
          <p className="text-lg text-muted-foreground">
            Your AI research assistant powered by Google Gemini
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Try these example queries:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleQueries.map((query, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors text-left"
                onClick={() => {
                  const syntheticEvent = {
                    target: { value: query },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onSelectQuery(syntheticEvent);
                }}
              >
                <p className="text-sm">{query}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="pt-6 space-y-2 text-sm text-muted-foreground">
          <p>✨ Real-time web search capabilities</p>
          <p>🔍 Deep research and information synthesis</p>
          <p>📚 Source citations and references</p>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ error }: { error: Error }) {
  return (
    <Card className="p-4 bg-destructive/10 border-destructive mt-4">
      <div className="flex items-start gap-2">
        <span className="text-destructive text-lg">⚠️</span>
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">Error</h3>
          <p className="text-sm text-destructive/90 mt-1">{error.message}</p>
        </div>
      </div>
    </Card>
  );
}

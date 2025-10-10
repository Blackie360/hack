'use client';

import { Message } from 'ai/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? (
            <UserMessage content={message.content} />
          ) : (
            <AssistantMessage message={message} />
          )}
        </div>
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <Card className="max-w-[80%] p-4 bg-primary text-primary-foreground">
        <p className="whitespace-pre-wrap">{content}</p>
      </Card>
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const hasToolInvocations = message.toolInvocations && message.toolInvocations.length > 0;

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-3">
        {/* Tool Invocations */}
        {hasToolInvocations && (
          <div className="space-y-2">
            {message.toolInvocations?.map((tool, index) => (
              <ToolInvocation key={index} tool={tool} />
            ))}
          </div>
        )}

        {/* Assistant Response */}
        {message.content && (
          <Card className="p-4 bg-muted/50">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code
                        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

interface ToolInvocationType {
  toolName: string;
  args?: {
    query?: string;
    [key: string]: unknown;
  };
  result?: {
    success?: boolean;
    message?: string;
    answer?: string;
    results?: Array<{
      title: string;
      url?: string;
      content?: string;
      score?: number;
    }>;
  };
  state: 'call' | 'result' | 'partial-call';
}

function ToolInvocation({ tool }: { tool: ToolInvocationType }) {
  const toolName = tool.toolName;
  const args = tool.args;
  const result = tool.result;
  const state = tool.state; // 'call', 'result', 'partial-call'

  return (
    <Card className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {toolName}
          </Badge>
          {state === 'call' && (
            <Badge variant="outline" className="text-xs">
              Executing...
            </Badge>
          )}
          {state === 'result' && (
            <Badge variant="default" className="text-xs bg-green-600">
              ✓ Complete
            </Badge>
          )}
        </div>

        {/* Tool Arguments */}
        {args && (
          <div className="text-sm text-muted-foreground">
            <strong>Query:</strong> {args.query || JSON.stringify(args)}
          </div>
        )}

        {/* Tool Result */}
        {result && state === 'result' && (
          <div className="mt-2 space-y-2">
            {result.success === false ? (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                ⚠️ {result.message}
              </div>
            ) : (
              <>
                {result.answer && (
                  <div className="text-sm">
                    <strong>Quick Answer:</strong> {result.answer}
                  </div>
                )}
                {result.results && result.results.length > 0 && (
                  <div className="space-y-1">
                    <Separator className="my-2" />
                    <div className="text-xs font-semibold text-muted-foreground">
                      Found {result.results.length} sources:
                    </div>
                    {result.results.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        • {item.title}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-muted-foreground">Thinking...</span>
        </div>
      </Card>
    </div>
  );
}


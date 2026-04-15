import { Loader2, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type FormEventHandler } from 'react';

type Role = 'user' | 'assistant' | 'error';
type Message = { role: Role; text: string };

const INITIAL_MESSAGES: Message[] = [
    {
        role: 'assistant',
        text: 'Hi — I\u2019m Claude Haiku, running via the laravel/ai SDK. Ask me anything about the DCS layout or this starter kit.',
    },
];

export default function ChatPanel() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, sending]);

    const send: FormEventHandler = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        setMessages((m) => [...m, { role: 'user', text }]);
        setInput('');
        setSending(true);

        try {
            const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            const res = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
                },
                credentials: 'same-origin',
                body: JSON.stringify({ message: text }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessages((m) => [...m, { role: 'error', text: data.error ?? `HTTP ${res.status}` }]);
            } else {
                setMessages((m) => [...m, { role: 'assistant', text: data.reply }]);
            }
        } catch (err) {
            setMessages((m) => [...m, { role: 'error', text: err instanceof Error ? err.message : 'Request failed' }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
                style={{ color: 'var(--scheme-fg-secondary)' }}
            >
                {messages.map((m, i) => (
                    <MessageBubble key={i} message={m} />
                ))}
                {sending && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--scheme-fg-muted)' }}>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Thinking&hellip;
                    </div>
                )}
            </div>

            <form
                onSubmit={send}
                className="flex shrink-0 items-end gap-2 border-t p-3"
                style={{ borderColor: 'var(--scheme-border)' }}
            >
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            send(e as unknown as Parameters<FormEventHandler>[0]);
                        }
                    }}
                    placeholder="Ask Claude Haiku…"
                    rows={2}
                    disabled={sending}
                    className="flex-1 resize-none rounded-md border px-2 py-1.5 text-sm outline-none focus:ring-1"
                    style={{
                        background: 'var(--scheme-bg-primary)',
                        color: 'var(--scheme-fg-primary)',
                        borderColor: 'var(--scheme-border)',
                    }}
                />
                <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-md transition-opacity disabled:opacity-40"
                    style={{ background: 'var(--scheme-accent)', color: 'var(--scheme-accent-fg)' }}
                    aria-label="Send message"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}

function MessageBubble({ message }: { message: Message }) {
    if (message.role === 'error') {
        return (
            <div
                className="rounded-md border px-3 py-2 text-xs"
                style={{
                    borderColor: 'var(--scheme-border)',
                    background: 'var(--scheme-bg-tertiary)',
                    color: 'var(--scheme-fg-secondary)',
                }}
            >
                <strong>Error:</strong> {message.text}
            </div>
        );
    }

    const isUser = message.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className="max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap"
                style={{
                    background: isUser ? 'var(--scheme-accent-subtle)' : 'var(--scheme-bg-tertiary)',
                    color: isUser ? 'var(--scheme-accent)' : 'var(--scheme-fg-primary)',
                }}
            >
                {!isUser && (
                    <div
                        className="mb-1 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                        style={{ color: 'var(--scheme-fg-muted)' }}
                    >
                        <Sparkles className="h-2.5 w-2.5" />
                        Haiku
                    </div>
                )}
                {message.text}
            </div>
        </div>
    );
}

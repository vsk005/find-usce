'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Send, RotateCcw } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; time: string; }

const SUGGESTIONS = [
    'Which programs accept J1 visa only?',
    'What are the cheapest observership programs?',
    'Which New York programs offer LOR?',
    'Programs accepting Step 1 only?',
    'Best programs in California?',
    'How do I apply for an observership?',
];

function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function renderMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*)/gm, '<h3 style="font-size:1rem;font-weight:700;color:var(--text-primary);margin:0.5em 0 0.25em">$1</h3>')
        .replace(/^## (.*)/gm, '<h2 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);margin:0.5em 0 0.25em">$1</h2>')
        .replace(/^- (.*)/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>');
}

function AskPageInner() {
    const searchParams = useSearchParams();
    const programName = searchParams.get('program');

    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: programName
                ? `Hi! I'm USCE Assist 🩺 You're asking about **${programName}**. How can I help?`
                : `Hi! I'm **USCE Assist** 🩺 — your AI guide for US Clinical Observership programs.\n\nI can help you:\n- Find programs matching your profile\n- Understand USMLE and visa requirements\n- Compare programs by state, fee, and LOR availability\n- Answer questions about the IMG application journey\n\nWhat would you like to know?`,
            time: getTime(),
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    async function sendMessage(content: string) {
        if (!content.trim() || loading) return;
        const userMsg: Message = { role: 'user', content: content.trim(), time: getTime() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        const allMessages = [...messages, userMsg];
        const assistantMsg: Message = { role: 'assistant', content: '', time: getTime() };
        setMessages(prev => [...prev, assistantMsg]);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: allMessages }),
            });
            if (!res.ok) throw new Error('API error');
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';
            while (reader) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.text) {
                                accumulated += data.text;
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated };
                                    return updated;
                                });
                            }
                        } catch { /* ignore */ }
                    }
                }
            }
        } catch {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = 'Sorry, I encountered an error. Please try again.';
                return updated;
            });
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
    }

    function adjustTextarea() {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }

    return (
        <div className="chat-page">
            <div className="chat-header">
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="chat-title">
                            <Sparkles size={20} style={{ color: 'var(--primary-light)' }} />
                            USCE Assist
                            <span className="ai-indicator"><span className="ai-dot" /> AI Online</span>
                        </div>
                        <button
                            onClick={() => setMessages([{ role: 'assistant', content: "Hi! I'm **USCE Assist** 🩺 How can I help you find the perfect observership?", time: getTime() }])}
                            className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
                            <RotateCcw size={12} /> New Chat
                        </button>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                <div className="container-sm">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gemini-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Sparkles size={12} color="white" />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)' }}>USCE Assist</span>
                                </div>
                            )}
                            <div className="message-bubble">
                                {msg.role === 'assistant' ? (
                                    <div dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(msg.content || (loading && idx === messages.length - 1 ? '●●●' : ''))}</p>` }} />
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                            </div>
                            <span className="message-time">{msg.time}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="chat-input-area">
                <div className="container-sm">
                    {messages.length <= 1 && (
                        <div className="suggestions">
                            {SUGGESTIONS.map(s => (
                                <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
                            ))}
                        </div>
                    )}
                    <div className="chat-input-wrap" style={{ marginTop: '0.75rem' }}>
                        <textarea
                            ref={textareaRef}
                            className="chat-textarea"
                            value={input}
                            onChange={e => { setInput(e.target.value); adjustTextarea(); }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about programs, eligibility, fees, visa requirements…"
                            rows={1}
                            disabled={loading}
                        />
                        <button className="chat-send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || loading} aria-label="Send message">
                            <Send size={16} />
                        </button>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                        AI responses may not be 100% accurate. Always verify program details directly.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AskPage() {
    return (
        <Suspense fallback={
            <div className="chat-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Loading AI Assistant…</div>
            </div>
        }>
            <AskPageInner />
        </Suspense>
    );
}

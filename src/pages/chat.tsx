import { SimpleChat } from "@/components/chat/SimpleChat";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import PerplexityLayout from "@/components/perplexity/PerplexityLayout";

export default function ChatPage() {
  const location = useLocation();
  const initialQuery = location.state?.initialQuery;

  const { messages, stop, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  });

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      sendMessage({ text: initialQuery });
    }
  }, [initialQuery]);

  const uiMessages = useMemo(() => {
    const getMessageContent = (msg: any): string => {
      if (msg.content) return String(msg.content);
      if (msg.parts && Array.isArray(msg.parts)) {
        return msg.parts
          .filter((part: any) => part?.type === "text")
          .map((part: any) => part?.text || "")
          .join("");
      }
      return msg.text || "";
    };
    return (messages as any).map((m: any, idx: number) => ({
      id: m.id || String(idx),
      role: m.role as "user" | "assistant" | "system",
      content: getMessageContent(m),
    }));
  }, [messages]);

  const showThinking = useMemo(() => {
    if (status === "submitted") return true;
    if (status !== "streaming") return false;
    if (!uiMessages.length) return false;
    const lastMessage = uiMessages[uiMessages.length - 1];
    if (lastMessage.role !== "assistant") return false;
    return lastMessage.content.trim().length === 0;
  }, [status, uiMessages]);

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <PerplexityLayout>
      <div className="h-screen">
        <SimpleChat
          messages={uiMessages}
          onSend={(text) => sendMessage({ text })}
          isLoading={isLoading}
          onStop={stop}
          title="Nelson-GPT Chat"
          showThinking={showThinking}
        />
      </div>
    </PerplexityLayout>
  );
}

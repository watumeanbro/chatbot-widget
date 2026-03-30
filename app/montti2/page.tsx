import { ChatbotDemoPage } from "@/components/ChatbotDemoPage";
import { CHAT_CLIENTS } from "@/lib/chat-clients";

export default function Montti2Page() {
  return <ChatbotDemoPage client={CHAT_CLIENTS.montti2} />;
}

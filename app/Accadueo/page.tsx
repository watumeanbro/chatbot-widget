import { ChatbotDemoPage } from "@/components/ChatbotDemoPage";
import { CHAT_CLIENTS } from "@/lib/chat-clients";

export default function AccadueoPage() {
  return <ChatbotDemoPage client={CHAT_CLIENTS.Accadueo} />;
}

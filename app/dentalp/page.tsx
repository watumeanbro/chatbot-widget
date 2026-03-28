import { ChatbotDemoPage } from "@/components/ChatbotDemoPage";
import { CHAT_CLIENTS } from "@/lib/chat-clients";

export default function DentalPPage() {
  return <ChatbotDemoPage client={CHAT_CLIENTS.dentalp} />;
}

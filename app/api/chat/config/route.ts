import { getPublicChatClientConfig } from "@/lib/chat-clients";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client");
  const clientConfig = getPublicChatClientConfig(clientId);

  if (!clientConfig) {
    return Response.json(
      { error: "Chatbot not found." },
      {
        status: 404,
        headers: corsHeaders,
      },
    );
  }

  return Response.json(clientConfig, {
    headers: corsHeaders,
  });
}

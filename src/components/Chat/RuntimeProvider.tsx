import { useChat } from "ai/react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export function LLMRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const chat = useChat({
    api: `${customFields.docsChatUrl}`,
  });

  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

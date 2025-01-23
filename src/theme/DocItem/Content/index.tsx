import React from "react";
import Content from "@theme-original/DocItem/Content";
import type ContentType from "@theme/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import { LLMRuntimeProvider } from "@site/src/components/Chat/RuntimeProvider";
import { MarkdownText } from "@site/src/components/Chat/MarkdownText";
import { AssistantModal } from "@assistant-ui/react";
type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  return (
    <LLMRuntimeProvider>
      <Content {...props} />
      <AssistantModal
        assistantMessage={{ components: { Text: MarkdownText } }}
        composer={{
          allowAttachments: false,
        }}
        assistantAvatar={{
          src: "/assets/images/pmtx_logo.png",
          alt: "Prometheux",
        }}
        welcome={{
          message: "How can I help with Prometheux?",
        }}
      />
    </LLMRuntimeProvider>
  );
}

'use server';
import { BotCard } from '@ai-rsc/components/llm-crypto/message';
import { PriceSkeleton } from '@ai-rsc/components/llm-crypto/price-skeleton';
import defigraph from '@ai-rsc/lib/defiGraph';
import { AIMessage } from '@langchain/core/messages';
import { BotMessage } from '@ai-rsc/components/llm-crypto/message';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { createAI, getMutableAIState } from 'ai/rsc';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMessage(message: string): Promise<{
  id: number,
  role: 'user' | 'assistant',
  display: ReactNode;
}> {
  const history = getMutableAIState<typeof AI>();

  history.update([
    ...history.get(),
    {
      role: 'user',
      content: message,
    },
  ]);

  // Initial loader display
  const initialResponse: ReactNode = (
    <BotMessage className="items-center flex shrink-0 select-none justify-center">
      <Loader2 className="h-5 w-5 animate-spin stroke-zinc-900" />
      <span className="ml-2">Processing...</span>
    </BotMessage>
  );

  history.update([
    ...history.get(),
    {
      role: 'assistant',
      content: initialResponse,
    },
  ]);

  const reply = await defigraph().stream({ messages: new AIMessage(message) });

  let lastResponse: ReactNode = initialResponse;

  // Simulate a delay to check the loader
  await sleep(2000);

  for await (const value of reply) {
    const [nodeName, output] = Object.entries(value)[0];
    if (nodeName !== 'END') {
      //@ts-ignore
      lastResponse = <BotMessage>{output.messages[0].content}</BotMessage>;
    }
  }

  // Update history with the final response
  history.done([
    ...history.get().slice(0, -1), // Remove the initial loader message
    {
      role: 'assistant',
      content: lastResponse,
    },
  ]);

  return {
    id: Date.now(),
    role: 'assistant' as const,
    display: <BotCard>
    <PriceSkeleton />
  </BotCard>,
  };
}

// Define the AI state and UI state types
export type AIState = Array<{
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string | ReactNode;
}>;

export type UIState = Array<{
  id: number;
  role: 'user' | 'assistant';
  display: ReactNode;
}>;

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});

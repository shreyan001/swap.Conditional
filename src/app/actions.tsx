'use server';

import { BotCard, BotMessage } from '@ai-rsc/components/llm-crypto/message';
import { Price } from '@ai-rsc/components/llm-crypto/price';
import { PriceSkeleton } from '@ai-rsc/components/llm-crypto/price-skeleton';
import { Stats } from '@ai-rsc/components/llm-crypto/stats';
import { StatsSkeleton } from '@ai-rsc/components/llm-crypto/stats-skeleton';
import { env } from '@ai-rsc/env.mjs';
import { END } from '@langchain/langgraph';
import type { CoreMessage, ToolInvocation } from 'ai';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import defigraph from '@ai-rsc/lib/defiGraph';
import { AIMessage } from '@langchain/core/messages';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});



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
  console.log(history.get(), "this is history betch")


   

const reply = await defigraph().stream({ messages: new AIMessage(message) });
  let lastResponse = '';
  for await (const value of reply) {
    const [nodeName, output] = Object.entries(value)[0];
    /* @ts-ignore */
    console.log(nodeName, output.messages[0].content);
    if (nodeName !== END) {
      /* @ts-ignore */console.log(lastResponse, "this is last response")
      return lastResponse = output.messages[0].content;
  
    }} 
  
   
  return {
    id: Date.now(),
    role: 'assistant' as const,
    display: value,
    
  };
};
// Define the AI state and UI state types
export type AIState = Array<{
  id?: number;
  name?: 'get_crypto_price' | 'get_crypto_stats';
  role: 'user' | 'assistant' | 'system';
  content: string;
}>;

export type UIState = Array<{
  id: number;
  role: 'user' | 'assistant';
  display: ReactNode;
  toolInvocations?: ToolInvocation[];
}>;

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [] as AIState,
  initialUIState: [] as UIState,
  actions: {
    sendMessage,
  },
});
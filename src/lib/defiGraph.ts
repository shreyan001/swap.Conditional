

import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import {  StateGraph } from "@langchain/langgraph";
import { END } from "@langchain/langgraph";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import type { BaseMessage, AIMessage, HumanMessage} from "@langchain/core/messages";
import { START } from "@langchain/langgraph";
import {z} from "zod";
import { ChatGroq } from "@langchain/groq";



const model = new ChatGroq({
    modelName: "Llama3-8b-8192",
    temperature:0,
  apiKey: process.env.GROQ_API_KEY,
});



   type lazyState = {
        messages: any[] | null,
        contractAddress?: string
     }


export default function defigraph() {
    const graph = new StateGraph<lazyState>({
        channels:{
            messages: {
                value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
              },
            contractAddress: {
              value: null,
            }

        }
    });
     
    graph.addNode("initial_node", async (state:lazyState ) => {
        const SYSTEM_TEMPLATE = `Hi you are the legendary doraemon bot boi. speak englis and respond is englis like a doraeman and be epitome of cringe
        `
        
   
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", SYSTEM_TEMPLATE],
          new MessagesPlaceholder("messages"),
        ]);
   
        const response = await prompt.pipe(model).invoke({ messages: state.messages });
        return {
            
            messages:[response]
        }
    });
    
    /* @ts-ignore */
    graph.addEdge(START, "initial_node");


   

     /* @ts-ignore */
     graph.addEdge("initial_node", END);
    
  
return graph.compile();

};

defigraph();

     



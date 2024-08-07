import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		GROQ_API_KEY: z.string(),
		CMC_API_KEY: z.string(),
	},
	client: {},
	runtimeEnv: {
		GROQ_API_KEY: process.env.GROQ_API_KEY,
		CMC_API_KEY: process.env.CMC_API_KEY,
	},
});

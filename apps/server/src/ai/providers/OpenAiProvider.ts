import { AiGenerationRequest, AiProvider } from "../AiProvider";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

export class OpenAiProvider implements AiProvider {
  readonly name = "openai";

  async generate(request: AiGenerationRequest): Promise<string> {
    if (!env.aiApiKey) {
      throw new AppError("AI provider not configured", 500, "AI_NOT_CONFIGURED");
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.aiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new AppError("AI provider request failed", 502, "AI_UPSTREAM_ERROR");
    }

    const json = (await res.json()) as any;
    const text = json?.choices?.[0]?.message?.content;
    if (!text) throw new AppError("AI provider returned no content", 502, "AI_UPSTREAM_ERROR");
    return text as string;
  }
}

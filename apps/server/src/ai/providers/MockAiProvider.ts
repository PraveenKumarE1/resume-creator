import { AiGenerationRequest, AiProvider } from "../AiProvider";

/**
 * Deterministic, keyword-driven provider used when no AI_API_KEY is configured.
 * Lets the whole product work end-to-end with zero external dependencies.
 */
export class MockAiProvider implements AiProvider {
  readonly name = "mock";

  async generate(request: AiGenerationRequest): Promise<string> {
    const sys = request.system.toLowerCase();
    const input = request.prompt.trim();

    if (sys.includes("shorten")) {
      const words = input.split(/\s+/);
      return words.slice(0, Math.max(8, Math.ceil(words.length * 0.6))).join(" ") + (words.length > 8 ? "…" : "");
    }

    if (sys.includes("grammar")) {
      return input.replace(/\s+/g, " ").replace(/\bi\b/g, "I").replace(/([a-z])\.([A-Z])/g, "$1. $2").trim();
    }

    if (sys.includes("tagline")) {
      return `Building thoughtful, high-impact work — one project at a time.`;
    }

    if (sys.includes("headline")) {
      return `${input.split(/[,.]/)[0].trim()} | Turning ideas into shipped products`;
    }

    if (sys.includes("skill")) {
      return input
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .join(", ");
    }

    if (sys.includes("expand")) {
      return `${input} This reflects a consistent focus on measurable outcomes, collaboration, and continuous improvement, with attention to both technical depth and real-world impact.`;
    }

    if (sys.includes("bullet") || sys.includes("experience")) {
      return input
        .split(/[.\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `• ${s.charAt(0).toUpperCase()}${s.slice(1)}`)
        .join("\n");
    }

    // default: professional rewrite
    const trimmed = input.replace(/\s+/g, " ").trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return `${capitalized}${capitalized.endsWith(".") ? "" : "."}`;
  }
}

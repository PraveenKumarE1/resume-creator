export interface AiGenerationRequest {
  system: string;
  prompt: string;
}

export interface AiProvider {
  readonly name: string;
  generate(request: AiGenerationRequest): Promise<string>;
}

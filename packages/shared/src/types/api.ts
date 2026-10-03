export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    fields?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  user: { id: string; name: string; email: string };
  accessToken: string;
}

export type AiAction =
  | "rewrite_professional"
  | "shorten"
  | "expand"
  | "fix_grammar"
  | "generate_tagline"
  | "generate_about"
  | "generate_project_description"
  | "generate_skill_list"
  | "generate_experience_bullets"
  | "suggest_headline"
  | "improve_tone"
  | "generate_service_description"
  | "generate_achievement"
  | "custom";

export interface AiRequest {
  action: AiAction;
  input: string;
  context?: Record<string, unknown>;
}

export interface AiResponse {
  output: string;
}

export interface ResumeParseResult {
  extracted: Record<string, unknown>;
  confidence: number;
}

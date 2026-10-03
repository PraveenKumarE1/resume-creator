import { Schema, model, Document, Types } from "mongoose";

export interface IPortfolio extends Document {
  userId: Types.ObjectId;
  slug: string;
  template: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    darkMode: boolean;
    radius: string;
  };
  animation: { intensity: string; respectReducedMotion: boolean };
  published: boolean;
  views: number;
  fullName: string;
  headline: string;
  tagline?: string;
  avatarUrl?: string;
  location?: string;
  about: string;
  skills: unknown[];
  education: unknown[];
  experience: unknown[];
  projects: unknown[];
  certifications: unknown[];
  achievements: unknown[];
  services: unknown[];
  email?: string;
  phone?: string;
  socialLinks: Record<string, string | undefined>;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    template: { type: String, default: "aurora" },
    theme: {
      primaryColor: { type: String, default: "#7C5CFF" },
      accentColor: { type: String, default: "#22D3EE" },
      fontFamily: { type: String, default: "sans" },
      darkMode: { type: Boolean, default: true },
      radius: { type: String, default: "soft" },
    },
    animation: {
      intensity: { type: String, default: "normal" },
      respectReducedMotion: { type: Boolean, default: true },
    },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    fullName: { type: String, default: "" },
    headline: { type: String, default: "" },
    tagline: String,
    avatarUrl: String,
    location: String,
    about: { type: String, default: "" },
    skills: { type: [Schema.Types.Mixed], default: [] },
    education: { type: [Schema.Types.Mixed], default: [] },
    experience: { type: [Schema.Types.Mixed], default: [] },
    projects: { type: [Schema.Types.Mixed], default: [] },
    certifications: { type: [Schema.Types.Mixed], default: [] },
    achievements: { type: [Schema.Types.Mixed], default: [] },
    services: { type: [Schema.Types.Mixed], default: [] },
    email: String,
    phone: String,
    socialLinks: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Portfolio = model<IPortfolio>("Portfolio", portfolioSchema);

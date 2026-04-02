import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  label: z.string(),
  href: z.string().url()
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(["implementations", "integrations", "data-analytics", "applied-ai"]),
    role: z.string(),
    systems: z.array(z.string()).min(1),
    tools: z.array(z.string()).min(1),
    outcomes: z.array(z.string()).min(1),
    featured: z.boolean().default(false),
    year: z.number().int(),
    links: z.array(linkSchema).default([]),
    metrics: z.array(z.string()).optional(),
    draft: z.boolean().default(false)
  })
});

const writing = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    source: z.string(),
    url: z.string().url(),
    publishedAt: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { projects, writing };

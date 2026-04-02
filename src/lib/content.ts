import { getCollection, type CollectionEntry } from "astro:content";

export const categoryLabels: Record<CollectionEntry<"projects">["data"]["category"], string> = {
  implementations: "Implementations",
  integrations: "Integrations",
  "data-analytics": "Data & Analytics",
  "applied-ai": "Applied AI"
};

export async function getPublishedProjects() {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((left, right) => right.data.year - left.data.year);
}

export async function getFeaturedProjects() {
  const projects = await getPublishedProjects();
  return projects.filter((project) => project.data.featured);
}

export async function getPublishedWriting() {
  const entries = await getCollection("writing", ({ data }) => !data.draft);
  return entries.sort(
    (left, right) => right.data.publishedAt.getTime() - left.data.publishedAt.getTime()
  );
}

export async function getFeaturedWriting() {
  const entries = await getPublishedWriting();
  return entries.filter((entry) => entry.data.featured);
}

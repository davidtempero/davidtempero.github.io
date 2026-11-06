import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().int().nonnegative(),
  updated: z.coerce.date(),
});

export const collections = {
  knowledge: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
    schema: common.extend({ area: z.enum(['programming', 'electronics', 'computing']) }),
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: common,
  }),
};

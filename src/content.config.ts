import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const faculty = defineCollection({
  loader: file('src/content/faculty/staff.json'),
  schema: z.object({
    name: z.string(),
    designation: z.string(),
    department: z.string(),
    qualification: z.string(),
    photo: z.string().optional(),
    bio: z.string().optional(),
    order: z.number().default(0),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),
    category: z.enum(['announcement', 'achievement', 'event', 'general']),
    featured: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: file('src/content/events/events.json'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    endDate: z.string().optional(),
    time: z.string().optional(),
    venue: z.string().optional(),
    image: z.string().optional(),
    category: z.enum(['cultural', 'sports', 'academic', 'general']),
    featured: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: file('src/content/gallery/gallery.json'),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    category: z.enum(['events', 'sports', 'annual-day', 'campus', 'classroom']),
    alt: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { faculty, news, events, gallery };

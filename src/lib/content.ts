import type { CollectionEntry } from 'astro:content';

export const areas = [
  { id: 'programming', title: 'Programming', number: '01', mark: '</>', description: 'Languages, software design, and the practice of writing code.', topics: 'C++ · Rust · Python · Learning' },
  { id: 'electronics', title: 'Electronics', number: '02', mark: '⌁', description: 'From a circuit idea to a board, with a little mechanical design along the way.', topics: 'KiCad · PCB design · CAD' },
  { id: 'computing', title: 'Computing', number: '03', mark: '{ }', description: 'Security, cloud platforms, artificial intelligence, and agentic engineering.', topics: 'Security · Cloud · AI · Agents' },
] as const;

export type Area = (typeof areas)[number];
export type Entry = CollectionEntry<'knowledge'> | CollectionEntry<'projects'>;
export const entryUrl = (entry: Entry) => `/${entry.collection}/${entry.id}/`;
export const byOrder = (a: Entry, b: Entry) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
export const formatDate = (date: Date) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);

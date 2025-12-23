export type CityBackground = {
  uri: string;
  ratio: number;
};

// Remote images keep sizing predictable across devices. Replace URIs with your CDN when ready.
export const cityBackgrounds: Record<string, CityBackground> = {
  singapore: {
    uri: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abb?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'singapore · singapore': {
    uri: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abb?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  london: {
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'london · uk': {
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  tokyo: {
    uri: 'https://images.unsplash.com/photo-1505067216369-2fbc68a6ca3f?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'tokyo · japan': {
    uri: 'https://images.unsplash.com/photo-1505067216369-2fbc68a6ca3f?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  los_angeles: {
    uri: 'https://images.unsplash.com/photo-1502920917128-1aa500764b8a?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'los angeles · usa': {
    uri: 'https://images.unsplash.com/photo-1502920917128-1aa500764b8a?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  new_york: {
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'new york · usa': {
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  paris: {
    uri: 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/5760x3240_16x9_30p/fancy/comp.8568.tif',
    ratio: 16 / 9,
  },
  'paris · france': {
    uri: 'https://svs.gsfc.nasa.gov/vis/a000000/a005000/a005048/frames/5760x3240_16x9_30p/fancy/comp.8568.tif',
    ratio: 16 / 9,
  },
  taipei: {
    uri: 'https://images.unsplash.com/photo-1598964496734-962fa63c82d5?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'taipei · taiwan': {
    uri: 'https://images.unsplash.com/photo-1598964496734-962fa63c82d5?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  sydney: {
    uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  'sydney · australia': {
    uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
  fallback: {
    uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    ratio: 16 / 9,
  },
};

// A small pool of scenic fallbacks to rotate through when a city-specific image is unavailable.
export const sceneryFallbacks: CityBackground[] = [
  { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
  { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', ratio: 16 / 9 },
];

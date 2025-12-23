type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

type EmotionalCopy = {
  title: string;
  line: string;
  action: string;
  vibe: 'soothe' | 'lift' | 'stabilize';
};

type EmotionalContext = {
  description?: string;
  temperature?: string | number;
  now?: Date;
};

const timeAddons: Record<TimeOfDay, string> = {
  dawn: 'Take three slow breaths and wake with ease.',
  morning: 'Pick one small thing to finish and start gently.',
  afternoon: 'Sip water or stretch for 60 seconds to refuel.',
  evening: 'Wrap the day; leave a soft pause for yourself.',
  night: 'Close the day with a quiet breath break.',
};

const conditionCopy: Record<string, EmotionalCopy> = {
  clear: {
    title: 'Bright Day',
    line: 'Clear skies invite you to center on yourself.',
    action: 'Note one thing you are thankful for today.',
    vibe: 'lift',
  },
  cloudy: {
    title: 'Soft Overcast',
    line: 'Clouds are a blanket; slow the pace and leave room for thought.',
    action: 'Take a slow sip of water and rest your eyes for 30 seconds.',
    vibe: 'soothe',
  },
  rain: {
    title: 'Rain Shelter',
    line: 'Rain is a weather pause key; allow yourself to slow down.',
    action: 'Listen to rain for 1 minute or do a 4-6-4 breath.',
    vibe: 'soothe',
  },
  storm: {
    title: 'Heavy Sky',
    line: 'Weather is intense; keep your inner space soft and simple.',
    action: 'Drop one task today and keep it for yourself.',
    vibe: 'stabilize',
  },
  snow: {
    title: 'Quiet Snow',
    line: 'Snow widens the distance of sound; widen your quiet too.',
    action: 'Write down the thought you most want to protect.',
    vibe: 'soothe',
  },
  fog: {
    title: 'Fog Steps',
    line: 'When the view blurs, focus on the step beneath you.',
    action: 'Count 10 steps and feel each foot meet the ground.',
    vibe: 'stabilize',
  },
  heat: {
    title: 'Heat Care',
    line: 'In heat, emotions need cooling and water too.',
    action: 'Drink a glass of water; avoid direct sun if you can.',
    vibe: 'soothe',
  },
  cold: {
    title: 'Cold Focus',
    line: 'Cold can sharpen thoughts; save energy for what matters.',
    action: 'Warm up for 30 seconds; move shoulders and fingers.',
    vibe: 'stabilize',
  },
  windy: {
    title: 'Wind Letter',
    line: 'Wind reminds us: some feelings arrive fast and leave fast.',
    action: 'Write one stray thought and let it go with the breeze.',
    vibe: 'lift',
  },
  balanced: {
    title: 'Moonlit Balance',
    line: 'No strong weather today—perfect to tend your own rhythm.',
    action: 'Close your eyes for 20 seconds and observe your breath.',
    vibe: 'soothe',
  },
};

const toTimeOfDay = (date: Date): TimeOfDay => {
  const hour = date.getHours();
  if (hour < 6) return 'dawn';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
};

const parseTemperature = (value?: string | number): number | null => {
  if (typeof value === 'number') return value;
  if (!value) return null;
  const digits = parseInt(value.replace(/[^\d-]/g, ''), 10);
  return Number.isNaN(digits) ? null : digits;
};

const inferCondition = (description: string, temperature: number | null): keyof typeof conditionCopy => {
  const text = description.toLowerCase();
  const has = (keyword: string) => text.includes(keyword);

  if (has('storm') || has('thunder')) return 'storm';
  if (has('snow')) return 'snow';
  if (has('rain') || has('drizzle') || has('shower')) return 'rain';
  if (has('fog') || has('mist') || has('haze')) return 'fog';
  if (has('wind')) return 'windy';
  if (has('cloud')) return 'cloudy';
  if (has('sun') || has('clear')) return 'clear';
  if (temperature !== null && temperature >= 30) return 'heat';
  if (temperature !== null && temperature <= 5) return 'cold';
  return 'balanced';
};

export const getEmotionalCopy = (context: EmotionalContext): EmotionalCopy & { timeOfDay: TimeOfDay } => {
  const timeOfDay = toTimeOfDay(context.now ?? new Date());
  const temp = parseTemperature(context.temperature);
  const condition = inferCondition(context.description ?? '', temp);
  const base = conditionCopy[condition] ?? conditionCopy.balanced;
  const addon = timeAddons[timeOfDay];

  return {
    ...base,
    line: `${base.line} ${addon}`.trim(),
    timeOfDay,
  };
};

export type { TimeOfDay, EmotionalCopy, EmotionalContext };

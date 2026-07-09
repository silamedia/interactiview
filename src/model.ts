export type InterviewItem = {
  id: string;
  question: string;
  youtubeUrl: string;
  start: string;
  end: string;
  source: string;
};

export type InterviewLayout = 'stacked' | 'side';

export type InterviewData = {
  title: string;
  description: string;
  poster: string;
  layout: InterviewLayout;
  items: InterviewItem[];
};

export type NormalizedItem = InterviewItem & {
  videoId: string;
  startSeconds: number;
  endSeconds: number;
};

export type NormalizedInterview = Omit<InterviewData, 'items'> & {
  items: NormalizedItem[];
};

export const defaultInterview: InterviewData = {
  title: 'Интервью из фрагментов',
  description:
    'Соберите интервью из ответов, уже опубликованных на YouTube: разные каналы, разные ролики, один связный материал.',
  poster: '',
  layout: 'stacked',
  items: [
    {
      id: crypto.randomUUID(),
      question: 'Как вы пришли к этой идее?',
      youtubeUrl: 'https://www.youtube.com/watch?v=M8dcZpf05jE',
      start: '01:18',
      end: '02:05',
      source: 'Название ролика / канал'
    }
  ]
};

export function parseTimestamp(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  const clockMatch = trimmed.match(/^(\d{1,2}:)?\d{1,2}:\d{2}$/);

  if (clockMatch) {
    return trimmed
      .split(':')
      .map(Number)
      .reduce((total, part) => total * 60 + part, 0);
  }

  const labelMatch = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);

  if (labelMatch && labelMatch[0]) {
    const hours = Number(labelMatch[1] || 0);
    const minutes = Number(labelMatch[2] || 0);
    const seconds = Number(labelMatch[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

export function formatTimestamp(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const pairs = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];

  return pairs.map((part) => String(part).padStart(2, '0')).join(':');
}

export function extractYouTubeId(value: string): string | null {
  try {
    const url = new URL(value);

    if (url.hostname === 'youtu.be') {
      return validVideoId(url.pathname.slice(1));
    }

    if (url.pathname.startsWith('/embed/')) {
      return validVideoId(url.pathname.split('/')[2]);
    }

    if (url.pathname.startsWith('/shorts/')) {
      return validVideoId(url.pathname.split('/')[2]);
    }

    return validVideoId(url.searchParams.get('v') || '');
  } catch {
    return validVideoId(value);
  }
}

export function normalizeInterview(data: InterviewData): NormalizedInterview {
  const items = data.items.flatMap((item) => {
    const videoId = extractYouTubeId(item.youtubeUrl);
    const startSeconds = parseTimestamp(item.start);
    const endSeconds = parseTimestamp(item.end);

    if (!videoId || startSeconds === null || endSeconds === null || endSeconds <= startSeconds) {
      return [];
    }

    return [
      {
        ...item,
        videoId,
        startSeconds,
        endSeconds
      }
    ];
  });

  return {
    title: data.title.trim(),
    description: data.description.trim(),
    poster: data.poster.trim(),
    layout: data.layout === 'side' ? 'side' : 'stacked',
    items
  };
}

export function encodeInterview(data: InterviewData): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function decodeInterview(encoded: string | null): InterviewData | null {
  if (!encoded) {
    return null;
  }

  try {
    const decoded = JSON.parse(decodeURIComponent(encoded)) as Partial<InterviewData>;

    return {
      title: decoded.title || '',
      description: decoded.description || '',
      poster: decoded.poster || '',
      layout: decoded.layout === 'side' ? 'side' : 'stacked',
      items: decoded.items || []
    };
  } catch {
    return null;
  }
}

function validVideoId(value: string): string | null {
  return /^[a-zA-Z0-9_-]{11}$/.test(value) ? value : null;
}

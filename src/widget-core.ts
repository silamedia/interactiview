import { clear, el } from './dom';
import { InterviewData, NormalizedItem, normalizeInterview } from './model';

type YouTubePlayer = {
  loadVideoById(options: { videoId: string; startSeconds: number; endSeconds?: number }): void;
  cueVideoById(options: { videoId: string; startSeconds: number; endSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  getCurrentTime(): number;
  destroy(): void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: {
    width: string;
    height: string;
    videoId?: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady?: () => void;
      onStateChange?: (event: { data: number }) => void;
    };
  }
) => YouTubePlayer;

type YouTubeNamespace = {
  Player: YouTubePlayerConstructor;
  PlayerState: {
    PLAYING: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type RenderOptions = {
  assetBaseUrl?: string;
};

let apiPromise: Promise<YouTubeNamespace> | null = null;

export function renderWidget(container: HTMLElement, rawData: InterviewData, _options: RenderOptions = {}): void {
  const data = normalizeInterview(rawData);
  clear(container);
  container.classList.add('sfi');
  container.classList.toggle('sfi--side', data.layout === 'side');
  container.classList.toggle('sfi--stacked', data.layout !== 'side');

  const title = el('h2', { className: 'sfi__title', text: data.title || 'Interview' });
  const description = el('p', { className: 'sfi__description', text: data.description });
  const layout = el('div', { className: 'sfi__layout' });
  const media = el('div', { className: 'sfi__media' });
  const playerMount = el('div', { className: 'sfi__player' });
  const questions = el('div', { className: 'sfi__questions-panel' });
  const list = el('ul', { className: 'sfi__questions' });

  let player: YouTubePlayer | null = null;
  let activeItem: NormalizedItem | null = null;
  let stopTimer: number | null = null;

  if (data.poster) {
    const poster = el('img', {
      className: 'sfi__poster',
      attrs: {
        src: data.poster,
        alt: ''
      }
    });
    media.append(poster);
  }

  media.append(playerMount);

  if (!data.poster && data.items[0]) {
    cueInitialVideo(data.items[0]);
  }

  data.items.forEach((item) => {
    const row = el('li', { className: 'sfi__question' });
    const action = el('button', { className: 'sfi__question-button' });
    action.type = 'button';
    action.append(el('span', { className: 'sfi__question-text', text: item.question || 'Вопрос' }));

    if (item.source) {
      action.append(el('span', { className: 'sfi__source', text: item.source }));
    }

    action.addEventListener('click', async () => {
      activeItem = item;
      setActiveQuestion(list, row);
      const yt = await loadYouTubeApi();

      if (!player) {
        player = createPlayer(yt, playerMount, item, () => player, () => activeItem, () => stopTimer, (next) => {
          stopTimer = next;
        });
        player.loadVideoById({
          videoId: item.videoId,
          startSeconds: item.startSeconds,
          endSeconds: item.endSeconds
        });
      } else {
        player.loadVideoById({
          videoId: item.videoId,
          startSeconds: item.startSeconds,
          endSeconds: item.endSeconds
        });
      }
    });

    row.append(action);
    list.append(row);
  });

  if (!data.items.length) {
    list.append(el('li', { className: 'sfi__empty', text: 'Нет валидных фрагментов для показа.' }));
  } else {
    questions.append(el('p', { className: 'sfi__help', text: 'Кликните на вопрос, чтобы увидеть видеоответ.' }));
  }

  questions.append(list);
  layout.append(media, questions);
  container.append(title);

  if (data.description) {
    container.append(description);
  }

  container.append(layout, branding());

  async function cueInitialVideo(item: NormalizedItem): Promise<void> {
    const yt = await loadYouTubeApi();

    if (player) {
      return;
    }

    activeItem = item;
    player = createPlayer(yt, playerMount, item, () => player, () => activeItem, () => stopTimer, (next) => {
      stopTimer = next;
    });
  }
}

function setActiveQuestion(list: HTMLElement, activeRow: HTMLElement): void {
  list.querySelectorAll('.sfi__question').forEach((row) => {
    row.classList.toggle('sfi__question--active', row === activeRow);
  });
}

function startEndWatcher(
  getPlayer: () => YouTubePlayer | null,
  getItem: () => NormalizedItem | null,
  currentTimer: number | null,
  setTimer: (timer: number | null) => void
): void {
  if (currentTimer !== null) {
    window.clearInterval(currentTimer);
  }

  const timer = window.setInterval(() => {
    const player = getPlayer();
    const item = getItem();

    if (!player || !item) {
      return;
    }

    if (player.getCurrentTime() >= item.endSeconds) {
      player.pauseVideo();
      window.clearInterval(timer);
      setTimer(null);
    }
  }, 200);

  setTimer(timer);
}

function createPlayer(
  yt: YouTubeNamespace,
  playerMount: HTMLElement,
  item: NormalizedItem,
  getPlayer: () => YouTubePlayer | null,
  getActiveItem: () => NormalizedItem | null,
  getStopTimer: () => number | null,
  setStopTimer: (timer: number | null) => void
): YouTubePlayer {
  return new yt.Player(playerMount, {
    width: '100%',
    height: '100%',
    videoId: item.videoId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      start: item.startSeconds,
      end: item.endSeconds
    },
    events: {
      onReady: () => {
        getPlayer()?.cueVideoById({
          videoId: item.videoId,
          startSeconds: item.startSeconds,
          endSeconds: item.endSeconds
        });
      },
      onStateChange: (event) => {
        if (event.data === yt.PlayerState.PLAYING) {
          startEndWatcher(getPlayer, getActiveItem, getStopTimer(), setStopTimer);
        }
      }
    }
  });
}

function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (apiPromise) {
    return apiPromise;
  }

  apiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as YouTubeNamespace);
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.append(script);
  });

  return apiPromise;
}

function branding(): HTMLElement {
  const node = el('p', { className: 'sfi__branding' });
  const link = el('a', {
    text: 'Silamedia Interactiview',
    attrs: {
      href: 'https://sila.media',
      target: '_blank',
      rel: 'noreferrer'
    }
  });
  node.append(link);
  return node;
}

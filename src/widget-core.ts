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

  const title = el('h2', { className: 'sfi__title', text: data.title || 'Interview' });
  const description = el('p', { className: 'sfi__description', text: data.description });
  const layout = el('div', { className: 'sfi__layout' });
  const media = el('div', { className: 'sfi__media' });
  const playerMount = el('div', { className: 'sfi__player' });
  const list = el('ol', { className: 'sfi__questions' });
  const status = el('p', { className: 'sfi__status', text: 'Выберите вопрос.' });

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

  media.append(playerMount, status);

  data.items.forEach((item, index) => {
    const row = el('li', { className: 'sfi__question' });
    const action = el('button', { className: 'sfi__question-button' });
    action.type = 'button';
    action.append(
      el('span', { className: 'sfi__question-index', text: String(index + 1).padStart(2, '0') }),
      el('span', { className: 'sfi__question-text', text: item.question || 'Untitled question' })
    );

    if (item.source) {
      action.append(el('span', { className: 'sfi__source', text: item.source }));
    }

    action.addEventListener('click', async () => {
      activeItem = item;
      setActiveQuestion(list, row);
      status.textContent = 'Загрузка фрагмента...';
      const yt = await loadYouTubeApi();

      if (!player) {
        player = new yt.Player(playerMount, {
          width: '100%',
          height: '100%',
          videoId: item.videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: item.startSeconds,
            end: item.endSeconds
          },
          events: {
            onReady: () => {
              player?.loadVideoById({
                videoId: item.videoId,
                startSeconds: item.startSeconds,
                endSeconds: item.endSeconds
              });
              player?.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === yt.PlayerState.PLAYING) {
                startEndWatcher(() => player, () => activeItem, status, stopTimer, (next) => {
                  stopTimer = next;
                });
              }
            }
          }
        });
      } else {
        player.loadVideoById({
          videoId: item.videoId,
          startSeconds: item.startSeconds,
          endSeconds: item.endSeconds
        });
      }

      status.textContent = `${item.question} (${formatRange(item)})`;
    });

    row.append(action);
    list.append(row);
  });

  if (!data.items.length) {
    list.append(el('li', { className: 'sfi__empty', text: 'Нет валидных фрагментов для показа.' }));
  }

  layout.append(media, list);
  container.append(title);

  if (data.description) {
    container.append(description);
  }

  container.append(layout, branding());
}

function setActiveQuestion(list: HTMLElement, activeRow: HTMLElement): void {
  list.querySelectorAll('.sfi__question').forEach((row) => {
    row.classList.toggle('sfi__question--active', row === activeRow);
  });
}

function startEndWatcher(
  getPlayer: () => YouTubePlayer | null,
  getItem: () => NormalizedItem | null,
  status: HTMLElement,
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
      status.textContent = `Фрагмент завершен: ${formatRange(item)}`;
      window.clearInterval(timer);
      setTimer(null);
    }
  }, 200);

  setTimer(timer);
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

function formatRange(item: NormalizedItem): string {
  return `${item.start} - ${item.end}`;
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

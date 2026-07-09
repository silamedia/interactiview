import './styles.css';
import { clear, el, field } from './dom';
import {
  InterviewData,
  InterviewItem,
  defaultInterview,
  encodeInterview,
  formatTimestamp,
  normalizeInterview,
  parseTimestamp
} from './model';
import { renderWidget } from './widget-core';

const app = document.querySelector<HTMLElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

const appRoot = app;
let data: InterviewData = structuredClone(defaultInterview);
let previewMount: HTMLElement | null = null;
let embedOutput: HTMLTextAreaElement | null = null;
let embedStatus: HTMLElement | null = null;

renderApp();

function renderApp(): void {
  clear(appRoot);

  const shell = el('div', { className: 'builder-shell' });
  const header = el('header', { className: 'builder-header' });
  header.append(
    el('div', { className: 'brand-mark', text: 'S' }),
    el('div', { className: 'header-copy' })
  );

  const headerCopy = header.querySelector('.header-copy');
  headerCopy?.append(
    el('h1', { text: 'Silamedia Interactiview' }),
    el('p', { text: 'Конструктор embed-интервью из фрагментов YouTube-роликов.' })
  );

  const grid = el('div', { className: 'builder-grid' });
  const editor = el('section', { className: 'editor-panel' });
  editor.append(renderCommonFields(), renderQuestions(), renderEmbedCode());

  const preview = el('section', { className: 'preview-panel' });
  preview.append(el('h2', { text: 'Preview' }));

  previewMount = el('div');
  preview.append(previewMount);
  renderWidget(previewMount, data, { assetBaseUrl: './' });

  grid.append(editor, preview);
  shell.append(header, grid);
  appRoot.append(shell);
}

function renderCommonFields(): HTMLElement {
  const section = panel('Common');
  const title = input(data.title, 'Headline', (value) => update({ title: value }));
  const poster = input(data.poster, 'Cover picture URL', (value) => update({ poster: value }));
  const description = textarea(data.description, 'Lead/Description', (value) =>
    update({ description: value })
  );

  section.append(
    field('Headline', title),
    field('Cover picture URL', poster, 'Optional. Used before the first question is played.'),
    field('Lead/Description', description)
  );

  return section;
}

function renderQuestions(): HTMLElement {
  const section = panel('Questions');
  const list = el('div', { className: 'questions-list' });

  data.items.forEach((item, index) => {
    list.append(renderQuestion(item, index));
  });

  const actions = el('div', { className: 'row-actions' });
  const addButton = button('Add question', 'primary', () => {
    data = {
      ...data,
      items: [
        ...data.items,
        {
          id: crypto.randomUUID(),
          question: '',
          youtubeUrl: '',
          start: '',
          end: '',
          source: ''
        }
      ]
    };
    renderApp();
  });

  actions.append(addButton);
  section.append(list, actions);

  return section;
}

function renderQuestion(item: InterviewItem, index: number): HTMLElement {
  const card = el('article', { className: 'question-card' });
  const header = el('div', { className: 'question-card__header' });
  header.append(
    el('strong', { text: `Question ${index + 1}` }),
    el('div', { className: 'question-card__tools' })
  );

  const tools = header.querySelector('.question-card__tools');
  tools?.append(
    iconButton('Up', 'up', () => moveItem(index, -1), index === 0),
    iconButton('Down', 'down', () => moveItem(index, 1), index === data.items.length - 1),
    iconButton('Remove', 'remove', () => removeItem(index), data.items.length === 1)
  );

  const times = el('div', { className: 'time-grid' });
  times.append(
    field('Start', input(item.start, '01:18', (value) => updateItem(index, { start: value }))),
    field('End', input(item.end, '02:05', (value) => updateItem(index, { end: value })))
  );

  const validation = renderValidation(item);

  card.append(
    header,
    field(
      'Question',
      input(item.question, 'Что вы думаете о...', (value) => updateItem(index, { question: value }))
    ),
    field(
      'YouTube URL',
      input(item.youtubeUrl, 'https://www.youtube.com/watch?v=...', (value) =>
        updateItem(index, { youtubeUrl: value })
      )
    ),
    times,
    field(
      'Source label',
      input(item.source, 'Название ролика / канал', (value) => updateItem(index, { source: value })),
      'Optional but useful for attribution.'
    ),
    validation
  );

  return card;
}

function renderValidation(item: InterviewItem): HTMLElement {
  const start = parseTimestamp(item.start);
  const end = parseTimestamp(item.end);

  if (start === null && !item.start && end === null && !item.end) {
    return el('p', { className: 'validation-note', text: 'Time format: 01:18, 1:02:05, 78, 1m18s.' });
  }

  if (start === null || end === null) {
    return el('p', { className: 'validation-note validation-note--error', text: 'Start and end must be valid timestamps.' });
  }

  if (end <= start) {
    return el('p', { className: 'validation-note validation-note--error', text: 'End must be later than start.' });
  }

  return el('p', {
    className: 'validation-note validation-note--ok',
    text: `Fragment: ${formatTimestamp(start)} - ${formatTimestamp(end)}`
  });
}

function renderEmbedCode(): HTMLElement {
  const normalized = normalizeInterview(data);
  const section = panel('Embed');
  const code = buildEmbedCode(data);
  embedStatus = el('p', {
    className: normalized.items.length ? 'validation-note validation-note--ok' : 'validation-note validation-note--error',
    text: embedStatusText(normalized.items.length)
  });

  const output = el('textarea', {
    className: 'embed-code',
    attrs: { readonly: 'true', rows: '7' }
  });
  embedOutput = output;
  output.textContent = code;

  const copy = button('Copy embed code', 'primary', async () => {
    await navigator.clipboard.writeText(buildEmbedCode(data));
    copy.textContent = 'Copied';
    window.setTimeout(() => {
      copy.textContent = 'Copy embed code';
    }, 1200);
  });

  section.append(
    embedStatus,
    output,
    el('div', { className: 'row-actions' })
  );

  section.querySelector('.row-actions')?.append(copy);

  return section;
}

function embedStatusText(playableCount: number): string {
  return playableCount
    ? `${playableCount} playable fragment${playableCount === 1 ? '' : 's'} in embed.`
    : 'Add at least one valid YouTube URL with start and end timestamps.';
}

function buildEmbedCode(interview: InterviewData): string {
  const encoded = encodeInterview(interview);

  return `<div class="sila-fragment-interview" data-interview="${encoded}"></div>
<script async src="https://silamedia.github.io/interactiview/sila-fragment-interview.js"></script>`;
}

function panel(title: string): HTMLElement {
  const section = el('section', { className: 'panel' });
  section.append(el('h2', { text: title }));
  return section;
}

function input(value: string, placeholder: string, onInput: (value: string) => void): HTMLInputElement {
  const node = el('input', {
    attrs: {
      value,
      placeholder,
      type: 'text'
    }
  });

  node.addEventListener('input', () => onInput(node.value));
  return node;
}

function textarea(value: string, placeholder: string, onInput: (value: string) => void): HTMLTextAreaElement {
  const node = el('textarea', {
    attrs: {
      placeholder,
      rows: '5'
    }
  });
  node.value = value;
  node.addEventListener('input', () => onInput(node.value));
  return node;
}

function button(label: string, tone: 'primary' | 'neutral', onClick: () => void): HTMLButtonElement {
  const node = el('button', { className: `button button--${tone}`, text: label });
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
}

function iconButton(label: string, icon: string, onClick: () => void, disabled: boolean): HTMLButtonElement {
  const symbols: Record<string, string> = {
    up: '↑',
    down: '↓',
    remove: '−'
  };
  const node = el('button', {
    className: 'icon-button',
    text: symbols[icon] || label,
    attrs: { title: label, 'aria-label': label }
  });
  node.type = 'button';
  node.disabled = disabled;
  node.addEventListener('click', onClick);
  return node;
}

function update(patch: Partial<InterviewData>): void {
  data = { ...data, ...patch };
  refreshDerivedViews();
}

function updateItem(index: number, patch: Partial<InterviewItem>): void {
  data = {
    ...data,
    items: data.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
  };
  refreshDerivedViews();
}

function moveItem(index: number, direction: -1 | 1): void {
  const items = [...data.items];
  const nextIndex = index + direction;
  const [item] = items.splice(index, 1);
  items.splice(nextIndex, 0, item);
  data = { ...data, items };
  renderApp();
}

function removeItem(index: number): void {
  data = {
    ...data,
    items: data.items.filter((_, itemIndex) => itemIndex !== index)
  };
  renderApp();
}

function refreshDerivedViews(): void {
  const normalized = normalizeInterview(data);

  if (previewMount) {
    renderWidget(previewMount, data, { assetBaseUrl: './' });
  }

  if (embedOutput) {
    embedOutput.textContent = buildEmbedCode(data);
  }

  if (embedStatus) {
    embedStatus.textContent = embedStatusText(normalized.items.length);
    embedStatus.className = normalized.items.length
      ? 'validation-note validation-note--ok'
      : 'validation-note validation-note--error';
  }
}

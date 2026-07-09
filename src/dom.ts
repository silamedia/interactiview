export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    className?: string;
    text?: string;
    attrs?: Record<string, string>;
  } = {}
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (options.className) {
    node.className = options.className;
  }

  if (options.text !== undefined) {
    node.textContent = options.text;
  }

  Object.entries(options.attrs || {}).forEach(([name, value]) => {
    node.setAttribute(name, value);
  });

  return node;
}

export function clear(node: Element): void {
  while (node.firstChild) {
    node.firstChild.remove();
  }
}

export function field(
  label: string,
  input: HTMLElement,
  note?: string
): HTMLLabelElement {
  const wrapper = el('label', { className: 'field' });
  wrapper.append(el('span', { className: 'field__label', text: label }), input);

  if (note) {
    wrapper.append(el('span', { className: 'field__note', text: note }));
  }

  return wrapper;
}

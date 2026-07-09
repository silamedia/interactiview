import './widget.css';
import { decodeInterview } from './model';
import { renderWidget } from './widget-core';

const selector = '.sila-fragment-interview[data-interview]';

document.querySelectorAll<HTMLElement>(selector).forEach((container) => {
  const data = decodeInterview(container.dataset.interview || null);

  if (!data) {
    container.textContent = 'Sila Fragment Interview: invalid data.';
    return;
  }

  renderWidget(container, data);
});

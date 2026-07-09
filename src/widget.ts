import widgetStyles from './widget.css?raw';
import { decodeInterview } from './model';
import { renderWidget } from './widget-core';

const selector = '.sila-fragment-interview[data-interview]';
const styleId = 'sila-fragment-interview-styles';

if (!document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = widgetStyles;
  document.head.append(style);
}

document.querySelectorAll<HTMLElement>(selector).forEach((container) => {
  const data = decodeInterview(container.dataset.interview || null);

  if (!data) {
    container.textContent = 'Sila Fragment Interview: invalid data.';
    return;
  }

  renderWidget(container, data);
});

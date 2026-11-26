'use client';
import { useEffect } from 'react';

// Sets attributes on markup @umami/react-zen writes and takes no attributes for: names for the
// copy, password and combo box buttons, the password toggle's state, and the calendar's selected
// days. It only sets attributes: it adds, moves and draws nothing, and adds no Tab stop or handler.

function lowerFirst(text: string) {
  return text.length > 1 && text[1] === text[1].toLowerCase()
    ? text[0].toLowerCase() + text.slice(1)
    : text;
}

function fieldName(field: Element | null) {
  if (!field) {
    return '';
  }

  const label = field.getAttribute('aria-label');

  if (label) {
    return label.trim();
  }

  const labelledBy = field.getAttribute('aria-labelledby');

  if (labelledBy) {
    return labelledBy
      .split(/\s+/)
      .map(id => document.getElementById(id)?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');
  }

  const labels = (field as HTMLInputElement).labels;

  return labels?.[0]?.textContent?.trim() ?? '';
}

function setAttribute(element: Element, name: string, value: string) {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}

function removeAttribute(element: Element, name: string) {
  if (element.hasAttribute(name)) {
    element.removeAttribute(name);
  }
}

function applyLibraryMarkup(root: ParentNode) {
  root.querySelectorAll('[data-slot="input-group"]').forEach(group => {
    const field = group.querySelector('input, textarea');
    const name = fieldName(field);

    if (!name) {
      return;
    }

    group.querySelectorAll('[data-slot="copy-button"]').forEach(button => {
      setAttribute(button, 'aria-label', `Copy ${lowerFirst(name)}`);
    });

    const autocomplete = field.getAttribute('autocomplete') ?? '';

    if (/(^|\s)(current|new)-password$/.test(autocomplete)) {
      group.querySelectorAll('button[aria-pressed]').forEach(button => {
        removeAttribute(button, 'aria-pressed');
      });
      group.querySelectorAll('button').forEach(button => {
        const label = button.getAttribute('aria-label') ?? '';

        if (/^(Show|Hide) /.test(label)) {
          const shown = (field as HTMLInputElement).type !== 'password';
          setAttribute(button, 'aria-label', `${shown ? 'Hide' : 'Show'} ${lowerFirst(name)}`);
        }
      });
    }

    if (field.getAttribute('role') === 'combobox') {
      group.querySelectorAll('button').forEach(button => {
        const label = button.getAttribute('aria-label') ?? '';

        if (label === 'Open' || label.startsWith('Open ')) {
          setAttribute(button, 'aria-label', `Open ${lowerFirst(name)}`);
        } else if (label === 'Clear selection' || label.startsWith('Clear ')) {
          setAttribute(button, 'aria-label', `Clear ${lowerFirst(name)}`);
        }
      });
    }
  });

  root.querySelectorAll('[role="gridcell"]').forEach(cell => {
    if (cell.classList.contains('rdp-selected')) {
      setAttribute(cell, 'aria-selected', 'true');
    } else if (cell.closest('.rdp-root')) {
      removeAttribute(cell, 'aria-selected');
    }
  });
}

export function LibraryMarkup() {
  useEffect(() => {
    let frame = 0;

    const run = () => {
      frame = 0;
      applyLibraryMarkup(document);
    };

    const observer = new MutationObserver(() => {
      if (!frame) {
        frame = requestAnimationFrame(run);
      }
    });

    run();

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'type', 'aria-label', 'aria-pressed', 'aria-selected'],
    });

    return () => {
      observer.disconnect();

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return null;
}

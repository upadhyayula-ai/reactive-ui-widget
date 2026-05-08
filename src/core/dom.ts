/**
 * Resolves a CSS selector string or existing HTMLElement to an HTMLElement.
 * Throws a descriptive error when the target cannot be found.
 */
export function resolveElement(target: string | HTMLElement): HTMLElement {
  if (target instanceof HTMLElement) return target;
  const el = document.querySelector<HTMLElement>(target);
  if (!el) throw new Error(`[wg] Mount target not found: "${target}"`);
  return el;
}

/** Remove all child nodes from an element. */
export function clearElement(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Append an animated loader paragraph to an element and return it. */
export function appendLoader(host: HTMLElement, text = 'Loading…'): HTMLElement {
  const loader = document.createElement('p');
  loader.className = 'wg-loader';
  loader.textContent = text;
  host.appendChild(loader);
  return loader;
}

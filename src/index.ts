import './styles/skin.scss';
import { formService } from './services/form.service';
import { FormViewModel } from './viewmodel/form.viewmodel';
import { FormView } from './view/form.view';
import { resolveElement, clearElement, appendLoader } from './core/dom';

interface WidgetOptions {
  selector: string | HTMLElement;
  onMount?: (host: HTMLElement) => void;
  onUnmount?: (host: HTMLElement) => void;
  onDestroy?: () => void;
}

class Widget {
  private _host: HTMLElement | null = null;
  private _mounted = false;
  private _hooks: Pick<WidgetOptions, 'onMount' | 'onUnmount' | 'onDestroy'> = {};

  /** Mount the widget into the given selector or element. */
  async mount(options: WidgetOptions): Promise<void> {
    if (this._mounted) {
      console.warn('[wg] Widget is already mounted. Call unmount() first.');
      return;
    }

    const host = resolveElement(options.selector);
    this._host = host;
    this._hooks = {
      onMount: options.onMount,
      onUnmount: options.onUnmount,
      onDestroy: options.onDestroy,
    };

    const loader = appendLoader(host, 'Loading form…');

    const config = await formService.getFormConfig();
    loader.remove();

    const vm = new FormViewModel(config.formAttributes);
    const view = new FormView(vm, config);
    view.mount(host);

    this._mounted = true;
    this._hooks.onMount?.(host);
  }

  /** Remove rendered content from the host but keep the host element intact. */
  unmount(): void {
    if (!this._host) return;
    const host = this._host;
    clearElement(host);
    this._mounted = false;
    this._hooks.onUnmount?.(host);
  }

  /** Unmount and release the host reference entirely. */
  destroy(): void {
    this.unmount();
    this._host = null;
    this._hooks.onDestroy?.();
    this._hooks = {};
  }

  get isMounted(): boolean {
    return this._mounted;
  }
}

export const wg = new Widget();
(window as unknown as Record<string, unknown>)['wg'] = wg;

import type { FormConfig } from './form.model';
import { fetchFormConfig as _fetch } from '../mock/mock-api';

/**
 * FormService is the single point of contact for form configuration data.
 * Swap `_fetch` for a real HTTP call here without touching any other layer.
 */
export class FormService {
  async getFormConfig(): Promise<FormConfig> {
    return _fetch();
  }
}

export const formService = new FormService();

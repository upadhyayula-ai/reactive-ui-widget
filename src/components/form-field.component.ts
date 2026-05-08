import type { FieldConfig } from '../services/form.model';
import type { FormViewModel } from '../viewmodel/form.viewmodel';

/**
 * FormFieldComponent — renders a single reactive form field (input or switch)
 * and wires it bidirectionally to the ViewModel observables.
 */
export class FormFieldComponent {
  private readonly field: FieldConfig;
  private readonly vm: FormViewModel;

  constructor(field: FieldConfig, vm: FormViewModel) {
    this.field = field;
    this.vm = vm;
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'rw-field';

    // Label
    const label = document.createElement('label');
    label.className = 'rw-field__label';
    label.textContent = this.field.title;

    if (!this.field.optional) {
      const asterisk = document.createElement('span');
      asterisk.className = 'rw-field__required';
      asterisk.setAttribute('aria-hidden', 'true');
      asterisk.textContent = ' *';
      label.appendChild(asterisk);
    }
    wrapper.appendChild(label);

    // Control
    if (this.field.type === 'input') {
      wrapper.appendChild(this._buildInput());
    } else if (this.field.type === 'switch' && this.field.options) {
      wrapper.appendChild(this._buildSwitch());
    }

    // Reactive error message
    const errorEl = document.createElement('span');
    errorEl.className = 'rw-field__error';
    errorEl.setAttribute('role', 'alert');

    this.vm.errors[this.field.key].subscribe((err) => {
      errorEl.textContent = err;
      wrapper.classList.toggle('rw-field--invalid', err !== '');
    });

    wrapper.appendChild(errorEl);
    return wrapper;
  }

  // ── Private ──────────────────────────────────────────────────

  private _buildInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'rw-field__input';
    input.placeholder = `Enter ${this.field.title}`;
    if (this.field.maxLen) input.maxLength = this.field.maxLen;

    // View → ViewModel
    input.addEventListener('input', () => {
      this.vm.values[this.field.key].value = input.value;
    });

    // ViewModel → View (reset / external update)
    this.vm.values[this.field.key].subscribe((val) => {
      if (input.value !== val) input.value = val;
    });

    return input;
  }

  private _buildSwitch(): HTMLElement {
    const group = document.createElement('div');
    group.className = 'rw-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', this.field.title);

    this.field.options!.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rw-switch__option';
      btn.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      btn.dataset['value'] = opt;

      // View → ViewModel
      btn.addEventListener('click', () => {
        this.vm.values[this.field.key].value = opt;
      });

      // ViewModel → View (active highlight)
      this.vm.values[this.field.key].subscribe((val) => {
        btn.classList.toggle('rw-switch__option--active', val === opt);
      });

      group.appendChild(btn);
    });

    return group;
  }
}

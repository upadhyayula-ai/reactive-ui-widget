import type { FormViewModel } from '../viewmodel/form.viewmodel';
import type { FormConfig } from '../services/form.model';
import { FormFieldComponent } from '../components/form-field.component';

export class FormView {
  private readonly vm: FormViewModel;
  private readonly config: FormConfig;

  constructor(vm: FormViewModel, config: FormConfig) {
    this.vm = vm;
    this.config = config;
  }

  // ── Public ───────────────────────────────────────────────────

  render(): HTMLElement {
    const form = document.createElement('form');
    form.className = 'rw-form';
    form.noValidate = true;

    // Header
    const header = document.createElement('div');
    header.className = 'rw-form__header';
    const title = document.createElement('h2');
    title.className = 'rw-form__title';
    title.textContent = this.config.formNameTitle;
    header.appendChild(title);
    form.appendChild(header);

    // Body — one field per config entry (delegated to FormFieldComponent)
    const body = document.createElement('div');
    body.className = 'rw-form__body';
    this.config.formAttributes.forEach((field) => {
      const component = new FormFieldComponent(field, this.vm);
      body.appendChild(component.render());
    });
    form.appendChild(body);

    // Footer — submit + reset
    const footer = document.createElement('div');
    footer.className = 'rw-form__footer';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn--primary';
    submitBtn.textContent = 'Submit';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn btn--outline';
    resetBtn.textContent = 'Reset';

    footer.appendChild(submitBtn);
    footer.appendChild(resetBtn);
    form.appendChild(footer);

    // ── Reactive bindings on the form level ───────────────────

    // Disable submit while in-flight and update label.
    this.vm.isSubmitting.subscribe((submitting) => {
      submitBtn.disabled = submitting;
      submitBtn.textContent = submitting ? 'Submitting…' : 'Submit';
    });

    // Show a transient success banner after submit.
    this.vm.isSubmitted.subscribe((submitted) => {
      if (!submitted) return;
      const banner = document.createElement('p');
      banner.className = 'rw-form__success';
      banner.textContent = '✓ Form submitted successfully!';
      form.insertBefore(banner, footer);
      setTimeout(() => banner.remove(), 3000);
    });

    // Form submit handler.
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.vm.submit((data) => {
        console.log('[wg] Form submitted:', data);
      });
    });

    // Reset handler.
    resetBtn.addEventListener('click', () => {
      this.vm.reset();
    });

    return form;
  }

  mount(target: HTMLElement): void {
    target.appendChild(this.render());
  }
}


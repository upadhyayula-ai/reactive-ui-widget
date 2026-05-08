import { Observable, computed } from '../core/observable';
import type { FieldConfig, FormValues } from '../services/form.model';

export class FormViewModel {
  /** Ordered list of field descriptors from the API. */
  readonly fields: Observable<FieldConfig[]>;

  /** Per-field current string value (switch fields use one of their options or ''). */
  readonly values: Record<string, Observable<string>>;

  /** Per-field validation error message ('' = valid). */
  readonly errors: Record<string, Observable<string>>;

  /** True while the async submit is in flight. */
  readonly isSubmitting = new Observable(false);

  /** Flips to true on successful submit; reset() clears it. */
  readonly isSubmitted = new Observable(false);

  /** Derived: true when every error observable is empty. */
  readonly isValid: Observable<boolean>;

  constructor(fields: FieldConfig[]) {
    this.fields = new Observable(fields);
    this.values = {};
    this.errors = {};

    fields.forEach((f) => {
      this.values[f.key] = new Observable('');
      this.errors[f.key] = new Observable('');
    });

    // isValid is a computed that re-evaluates whenever any error changes.
    this.isValid = computed(
      Object.values(this.errors),
      () => Object.values(this.errors).every((e) => e.value === ''),
    );

    // Wire up live validation on every keystroke / switch tap.
    fields.forEach((f) => {
      this.values[f.key].subscribe(() => this._validateField(f));
    });
  }

  // ── Private ──────────────────────────────────────────────────

  private _validateField(field: FieldConfig): void {
    const val = this.values[field.key].value;
    let err = '';

    if (!field.optional && val.trim() === '') {
      err = `${field.title} is required.`;
    } else if (
      field.maxLen !== undefined &&
      val.length > field.maxLen
    ) {
      err = `${field.title} must be ${field.maxLen} characters or fewer.`;
    }

    this.errors[field.key].value = err;
  }

  // ── Public API ───────────────────────────────────────────────

  /** Run validation on every field; returns true when all fields are valid. */
  validateAll(): boolean {
    this.fields.value.forEach((f) => this._validateField(f));
    return this.isValid.value;
  }

  /** Validate → simulate async POST → notify caller with collected values. */
  async submit(onSuccess: (data: FormValues) => void): Promise<void> {
    if (!this.validateAll()) return;

    this.isSubmitting.value = true;

    // Simulated network round-trip.
    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    const data: FormValues = {};
    for (const key in this.values) {
      data[key] = this.values[key].value;
    }

    this.isSubmitting.value = false;
    this.isSubmitted.value = true;
    onSuccess(data);
  }

  /** Clear all values, errors and the submitted flag. */
  reset(): void {
    this.fields.value.forEach((f) => {
      this.values[f.key].value = '';
      this.errors[f.key].value = '';
    });
    this.isSubmitted.value = false;
  }
}

export type FieldType = 'input' | 'switch';

export interface FieldConfig {
  key: string;
  title: string;
  type: FieldType;
  maxLen?: number;
  optional: boolean;
  /** Enumerated options — used by 'switch' type fields. */
  options?: string[];
}

export interface FormConfig {
  formNameTitle: string;
  formAttributes: FieldConfig[];
}

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string>;

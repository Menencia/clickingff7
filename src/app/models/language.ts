/**
 * Supported languages, in the Options screen's display order.
 * The label is shown as is, in its own language.
 */
export const LANGUAGES: readonly { value: string; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

export function isLanguage(value: string | undefined): value is string {
  return LANGUAGES.some((l) => l.value === value);
}

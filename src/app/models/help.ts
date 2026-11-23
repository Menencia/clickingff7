interface HelpData {
  steps: Step[];
}

interface Step {
  /** Key of the step text, under `tour` in help.json. */
  key: string;
  /**
   * Value of the `data-tour` attribute of the highlighted element (none for
   * a centered step). When several elements have it, the first visible one
   * is used (e.g. the horizontal menu on desktop, the dock on mobile).
   */
  element?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const helpData: HelpData = {
  steps: [
    { key: 'welcome' },
    { key: 'team', element: 'team', position: 'right' },
    { key: 'hp', element: 'hp', position: 'bottom' },
    { key: 'mp', element: 'mp', position: 'bottom' },
    { key: 'limit', element: 'limit', position: 'bottom' },
    { key: 'enemies', element: 'enemies', position: 'left' },
    { key: 'fight', element: 'fight', position: 'right' },
    { key: 'materias', element: 'materias', position: 'right' },
    { key: 'menu', element: 'menu', position: 'left' },
    { key: 'zone', element: 'zone', position: 'bottom' },
    { key: 'end' },
  ],
};

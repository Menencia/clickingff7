interface HelpData {
  steps: Step[];
}

interface Step {
  element?: string;
  intro?: string;
  position?: string;
}

export const helpData: HelpData = {
  steps: [
    {},
    {
      element: '#step1',
      position: 'right',
    },
    {
      element: '#step2',
      position: 'bottom',
    },
    {
      element: '#step3',
      position: 'bottom',
    },
    {
      element: '#step4',
      position: 'bottom',
    },
    {
      element: '#step5',
      position: 'left',
    },
    {
      element: '#step6',
      position: 'right',
    },
    {
      element: '#step7',
      position: 'right',
    },
    {
      element: '#step8',
      position: 'right',
    },
    {
      element: '#step9',
      position: 'right',
    },
    {
      element: '#step10',
      position: 'left',
    },
    {
      element: '#step11',
      position: 'top',
    },
    {
      element: '#step12',
      position: 'top',
    },
    {
      element: '#step13',
      position: 'top',
    },
    {},
  ],
};

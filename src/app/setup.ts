import { provideZonelessChangeDetection } from '@angular/core';

// Configuration pour les tests avec détection de changements zoneless
// Ces providers seront automatiquement chargés dans tous vos tests
export default [provideZonelessChangeDetection()];

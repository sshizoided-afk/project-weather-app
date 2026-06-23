import { attachHandlers, loadAndRender } from './app/controller.js';

document.addEventListener('DOMContentLoaded', () => {
  attachHandlers();
  loadAndRender();
});

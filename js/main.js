import { initTheme } from './theme.js';
import { initTasks, renderTasks } from './tasks.js';


document.addEventListener('DOMContentLoaded', () => {
    initTheme();      
    initTasks(); 
    renderTasks();
});
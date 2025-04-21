import { getCurrentDate, getUpdateDate } from './date.js';
import { getTasksArrayFromStorage } from './storage.js';
import { popup, popupClose } from './popup.js';

let tasksArray = getTasksArrayFromStorage();

/* 
    Выводит все задачи на страницу
*/
export function renderTasks() {
    const tasksContainer = document.querySelector('.tasks');
    tasksContainer.innerHTML = '';

    tasksArray.forEach(item => {
        // создаем тег div 
        const divTask = document.createElement('div');
        // добавляем класс .task
        divTask.classList.add('task');
        // добавляем класс done, если свойство объекта done возвращает 1
        if(item.done) {
            divTask.classList.add('done');
        } else {
            divTask.classList.remove('done');
        }
        // добавляем атрибут data-id, который будет хранить в себе id задачи
        divTask.setAttribute('data-id', item.id);

        // формируем контекст задачи
        const contentTask = `
            <div class="task_check"></div>
            <h3 class="task_heading">${item.heading}</h3>
            <div class="task_date task_date_start" data-date-start="${item.dateStart}">
                ${getUpdateDate(item.dateStart)}</div>
            <div class="task_date task_date_end" data-date-end="${item.dateEnd}">
                ${getUpdateDate(item.dateEnd)}</div>
            <div class="task_edit"></div>
            <div class="task_delete"></div>
        `;

        // добавляем контент задачи contentTask в блок divTask
        divTask.insertAdjacentHTML('afterbegin', contentTask);
        // добавляем задачу на странцу
        tasksContainer.append(divTask);

        // вешаем события на кнопки
        const buttonCheck = divTask.querySelector('.task_check');
        const buttonEdit = divTask.querySelector('.task_edit');
        const buttonDelete = divTask.querySelector('.task_delete');
        buttonCheck.addEventListener('click', () => doneTask(divTask));
        buttonEdit.addEventListener('click', () => editTask(divTask));
        buttonDelete.addEventListener('click', () => deleteTask(divTask));
    });

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
    tasksArray = getTasksArrayFromStorage();
}

 // выводим все задачи на страницу
renderTasks();



/*
    Добавляет задачу
*/
export function initTasks() {
    initAddTaskButton()
}


function initAddTaskButton(){
    const inputHeading = document.querySelector('.popup_add_task .input_task_heading');
    const inputDateEnd = document.querySelector('.popup_add_task .input_task_date_end');
    const button = document.querySelector('.popup_add_task .button');

    button.addEventListener('click', (e) => {
        e.preventDefault();

        // производим проверку, содержат ли атрибуты data-valid значение true
        if(inputHeading.value && inputDateEnd.value) { 

            tasksArray.unshift({
                id: tasksArray.length + 1,
                heading: inputHeading.value,
                dateStart: getCurrentDate(),
                dateEnd: inputDateEnd.value,
                done: false,
            });

            // выводим все задачи на страницу
            renderTasks();

            // закрываем всплывающее окно
            popupClose('popup_add_task');

            // очищаем поля
            inputHeading.value = '';
            inputDateEnd.value = '';
        }
    });
}

/*
    Удалить задачу

        task - текущая задача
*/
export function deleteTask(task) {

    function eventButtonYes() {
        tasksArray = tasksArray.filter((item) => {
            if(item.id != task.dataset.id) return item;
        });
        renderTasks();
        popupClose('popup_delete_task');
    }

    popup('popup_delete_task', (popupBlock) => {
        const buttonYes = popupBlock.querySelector('.button_optional');
        buttonYes.addEventListener('click', eventButtonYes);

        const popupClose = popupBlock.querySelectorAll('.popup_close');
        popupClose.forEach(close => {
            close.addEventListener('click', () => buttonYes.removeEventListener('click', eventButtonYes));
        });
    });
}



/*
    Изменить задачу

        task - текущая задача
*/
export function editTask(task) {
    popup('popup_edit_task', (popupContent) => {
        const taskHeading = task.querySelector('.task_heading');
        const taskDateStart = task.querySelector('.task_date_start');
        const taskDateEnd = task.querySelector('.task_date_end');

        const inputTaskHeading = popupContent.querySelector('.input_task_heading');
        const inputTaskDateStart = popupContent.querySelector('.input_task_date_start');
        const inputTaskDateEnd = popupContent.querySelector('.input_task_date_end');

        const button = popupContent.querySelector('.button');

        inputTaskHeading.value = taskHeading.innerText;
        inputTaskDateStart.value = taskDateStart.dataset.dateStart;
        inputTaskDateEnd.value = taskDateEnd.dataset.dateEnd;

        button.addEventListener('click', (e) => {
            e.preventDefault();

            tasksArray = tasksArray.map((item) => {
                if(item.id == task.dataset.id) {
                    item.heading = inputTaskHeading.value;
                    item.dateStart = inputTaskDateStart.value;
                    item.dateEnd = inputTaskDateEnd.value;
                }
                return item;
            });
        
            renderTasks();

            popupClose('popup_edit_task');
        });
    });
}


/*
    Отмечает выполнена задача или нет

        task - текущая задача
*/
export function doneTask(task) {
    task.classList.toggle('done');

    tasksArray = tasksArray.map((item) => {
        if(item.id == task.dataset.id) {
            item.done = !item.done;
        }
        return item
    });

    renderTasks();
}

/*
    Add task
*/
const buttonAddTask = document.querySelector('.header_add_task');
buttonAddTask.addEventListener('click', () => {
    popup('popup_add_task', initAddTaskButton);
});
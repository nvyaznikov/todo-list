let tasksArray = getTasksArrayFromStorage();

/*
    Получает массив с задачами из localStorage
*/
function getTasksArrayFromStorage() {
    const getTasks = JSON.parse( localStorage.getItem('tasks') );
    const tasksArray = getTasks ? getTasks : [];

    return tasksArray;
}



/*
    Возвращает возвращает куки с указанным name
        name - имя куки
*/
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}



/*
    Возвращает текущую дату
*/
function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
}

/*
    Изменяет формат даты 
        date - дата в формате 'гггг-мм-дд'
*/
function getUpdateDate(date) {
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сенября', 'Октября', 'Ноября', 'Декабря'];

    const year = date.slice(0, 4);
    const dateMonth = Number(date.slice(5, 7)) - 1;
    const month = months[dateMonth];
    const day = date.slice(8, 10);

    return day + ' ' + month + ' ' + year + ' г';
}


/* 
    Всплывающее окно

        classPopup - класс всплывающего окна
*/
function popup(classPopup, callback = () => {}) {
    const popupBlock = document.querySelector('.' + classPopup);
    popupBlock.classList.add('active');

    const popupClose = popupBlock.querySelectorAll('.popup_close');
    popupClose.forEach(close => {
        close.addEventListener('click', () => popupBlock.classList.remove('active'));
    });

    callback(popupBlock)
}
function popupClose(classPopup) {
    const popupBlock = document.querySelector('.' + classPopup);
    popupBlock.classList.remove('active');
}




/*
    Тема 
*/
const switchThema = document.querySelector('.switch');
switchThema.addEventListener('click', () => {
    switchThema.classList.toggle('active');
    document.body.classList.toggle('light');

    const timeCookie = switchThema.classList.contains('active') ? 3600 * 24 * 7 : 0;
    console.log(timeCookie)
    document.cookie = 'theme=light; max-age=' + timeCookie;
});
if(getCookie('theme')) {
    switchThema.classList.add('active');
    document.body.classList.add('light');
}





/*
    Add task
*/
const buttonAddTask = document.querySelector('.header_add_task');
buttonAddTask.addEventListener('click', () => {
    popup('popup_add_task', addTask);
});


/* 
    Выводит все задачи на страницу
*/
function randerTasks() {
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
            <div class="task_date task_date_start" data-date-start="${item.dateStart}">${item.dateStart}</div>
            <div class="task_date task_date_end" data-date-end="${item.dateEnd}">${item.dateEnd}</div>
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
randerTasks();



/*
    Добавляет задачу
*/
function addTask() {

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
                dateStart: '2023-10-12',
                dateEnd: inputDateEnd.value,
                done: false,
            });

            // выводим все задачи на страницу
            randerTasks();

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
function deleteTask(task) {

    function eventButtonYes() {
        tasksArray = tasksArray.filter((item) => {
            if(item.id != task.dataset.id) return item;
        });
        randerTasks();
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
function editTask(task) {
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
        
            randerTasks();

            popupClose('popup_edit_task');
        });
    });
}


/*
    Отмечает выполнена задача или нет

        task - текущая задача
*/
function doneTask(task) {
    task.classList.toggle('done');

    tasksArray = tasksArray.map((item) => {
        if(item.id == task.dataset.id) {
            item.done = !item.done;
        }
        return item
    });

    randerTasks();
}
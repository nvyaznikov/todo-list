
/*
    Получает массив с задачами из localStorage
*/
export function getTasksArrayFromStorage() {
    const getTasks = JSON.parse( localStorage.getItem('tasks') );
    const tasksArray = getTasks ? getTasks : [];

    return tasksArray;
}
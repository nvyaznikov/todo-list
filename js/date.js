
/*
    Возвращает текущую дату
*/
export function getCurrentDate() {
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
export function getUpdateDate(date) {

    if(!date || typeof date !== 'string' || date.length < 10){
        return('Некорректный формат даты. Ожидается YYYY-MM-DD');
    }

    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 
        'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

    const year = date.slice(0, 4);
    const dateMonth = Number(date.slice(5, 7)) - 1;
    const month = months[dateMonth];
    const day = date.slice(8, 10);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    // const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    // const currentDay = String(currentDate.getDate()).padStart(2, '0');

    if(year < currentYear){
        return(`Ошибка, год уже прошёл: ${year}`)
    }

    if (dateMonth < 0 || dateMonth > 11){
        return (`Некорректный месяц: ${dateMonth + 1}`)
    }

    return day + ' ' + month + ' ' + year + ' г';
}


/*
    Возвращает возвращает куки с указанным name
        name - имя куки
*/
export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

/*
    Тема 
*/
export function initTheme(){

    const switchThema = document.querySelector('.switch');

    getCookie('theme') ? switchThema.classList.add('active') : document.body.classList.add('light');

    switchThema.addEventListener('click', () => {
        switchThema.classList.toggle('active');
        document.body.classList.toggle('light');

        const timeCookie = switchThema.classList.contains('active') ? 3600 * 24 * 7 : 0;
        console.log(timeCookie)
        document.cookie = 'theme=light; max-age=' + timeCookie;
});
    // if(getCookie('theme')) {
    // switchThema.classList.add('active');
    // document.body.classList.add('light');
}


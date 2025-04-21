

/* 
    Всплывающее окно

        classPopup - класс всплывающего окна
*/
export function popup(classPopup, callback = () => {}) {
    const popupBlock = document.querySelector('.' + classPopup);
    popupBlock.classList.add('active');

    const popupClose = popupBlock.querySelectorAll('.popup_close');
    popupClose.forEach(close => {
        close.addEventListener('click', () => popupBlock.classList.remove('active'));
    });

    callback(popupBlock)
}

export function popupClose(classPopup) {
    const popupBlock = document.querySelector('.' + classPopup);
    popupBlock.classList.remove('active');
}
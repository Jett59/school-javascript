window.addEventListener('load', () => {
    let msgbox = document.getElementById('msgbox');
    msgbox.innerHTML = `<p>Hello from javascript!</p>`;
    let countbox = document.getElementById('countbox');
    let count = 0;
    let countFunction = () => {
        countbox.innerHTML = `${count}`;
        count++;
        setTimeout(countFunction, 1000);
    };
    countFunction();
});
const columns = document.querySelectorAll(".column"); // получить все колонки из DOM


document.addEventListener("keydown", (event) => { // при нажатии клавиши "space", - обновить цвета
    event.preventDefault();
    if (event.code.toLowerCase() === "space") { 
        setRandomColors();
    };
});


document.addEventListener("click", (event) => { // Обработчик нажатия ЛКМ
    const type = event.target.dataset.type // Получить data-атрибут элемента, на котором произведен клик 

    if (type === "lock") { // для кнопки, - переключить класс для изменения иконки

       const node = event.target.children[0];

       node.classList.toggle("fa-lock-open"); 
       node.classList.toggle("fa-lock"); 

    } else if (type === "copy") { // для заголовка, - скопировать текст (код цвета)

       copyToClickboard(event.target.textContent); 
    }
});


function generateRandomColor() { // функция возвращает код цвета, полученный случайным образом (в коде не используется)
    const hexCodes = "0123456789ABCDEF"; 
    let color = ""; 

    for (let i = 0; i < 6; i++) { 
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)];        
    };
    
    return "#" + color; 
};


function copyToClickboard(text) { // функция записывает данные в буфер обмена
    return navigator.clipboard.writeText(text);
};


function setRandomColors(isInitial) { // функция устанавливает случайные цвета для колонок и их заголовки 
    const colors = isInitial ? getColorsFromHash() : []; // массив цветов, - при первоначальной загрузке страницы (когда цвета не менялись) забрать цвета из хэша
    
    columns.forEach( (column, index) => { 
        const isLocked = column.querySelector("i").classList.contains("fa-lock"); 
        const columnHeading = column.querySelector("h2"); 
        const button = column.querySelector("button"); 
     
        if (isLocked) { // для заблокированной колонки не менять цвет
            colors.push(columnHeading.textContent); 
            return; 
        }

        const color = isInitial ? // получить цвет: при первоначальной загрузке из массива colors 
            colors[index] 
                ? colors[index] // из массива colors, если массив не пустой
                : chroma.random() // иначе, - сгенерировать с помощью API chroma
            : chroma.random(); //если загрузка не первоначальная, - сгенерировать с помощью API chroma 

        if (!isInitial) {
            colors.push(color); // если это не первоначальная загрузка страницы, - добавить цвет в массив
        };        

        column.style.backgroundColor = color; 
        columnHeading.textContent = color; 
       
        
        setTextColor(columnHeading, color); 
        setTextColor(button, color); 
    });

    updateColorsHash(colors);
};


function setTextColor(text, color) { // функция устанавливает цвет текста (черный/белый) в зависимости от яркости основного цвета
    const luminance = chroma(color).luminance(); // относительная яркость цвета в диапазоне 0 - 1
    text.style.color = luminance > 0.5 ? "black" : "white"; 
};


function updateColorsHash(colors = []) { // функция добавляет цвета, разделенные дефисом, к хэшу страницы
    document.location.hash = colors.map(color => {
        return color.toString().substring(1)}).join("-"); 
};


function getColorsFromHash() { // функция забирает цвета из хэша страницы в случае, если они там присутствуют, - в результате получается массив из строк-кодов цветов
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1) // удалить из строки дефолтный символ #
            .split("-") 
            .map(color => "#" + color); 
    };
    return [];
}


setRandomColors(true); // первоначальная загрузка страницы




const columns = document.querySelectorAll(".column"); // получить все колонки из DOM


// при нажатии клавиши "space", - обновить цвета
document.addEventListener("keydown", (event) => { 
    event.preventDefault();
    if (event.code.toLowerCase() === "space") { 
        setRandomColors();
    };
});


// Обработчик нажатия ЛКМ
document.addEventListener("click", (event) => { 
    const type = event.target.dataset.type // Получить data-атрибут элемента, на котором произведен клик 

    if (type === "lock") { // для кнопки, - переключить класс для изменения иконки

       const node = event.target.children[0];

       node.classList.toggle("fa-lock-open"); 
       node.classList.toggle("fa-lock"); 

    } else if (type === "copy") { // для заголовка, - скопировать текст (код цвета)

       copyToClickboard(event.target.textContent); 
    }
});


// функция возвращает код цвета, полученный случайным образом (в коде не используется)
function generateRandomColor() { 
    const hexCodes = "0123456789ABCDEF"; 
    let color = ""; 

    for (let i = 0; i < 6; i++) { 
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)];        
    };
    
    return "#" + color; 
};


// функция записывает данные в буфер обмена
function copyToClickboard(text) { 
    return navigator.clipboard.writeText(text);
};


// функция устанавливает случайные цвета для колонок и их заголовки 
function setRandomColors(isInitial) { 
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


// функция устанавливает цвет текста (черный/белый) в зависимости от яркости основного цвета
function setTextColor(text, color) { 
    const luminance = chroma(color).luminance(); // относительная яркость цвета в диапазоне 0 - 1
    text.style.color = luminance > 0.5 ? "black" : "white"; 
};


// функция добавляет цвета, разделенные дефисом, к хэшу страницы
function updateColorsHash(colors = []) { 
    document.location.hash = colors.map(color => {
        return color.toString().substring(1)}).join("-"); 
};


// функция забирает цвета из хэша страницы в случае, если они там присутствуют, - в результате получается массив из строк-кодов цветов
function getColorsFromHash() { 
    if (document.location.hash.length > 1) {
        return document.location.hash
            .substring(1) // удалить из строки дефолтный символ #
            .split("-") 
            .map(color => "#" + color); 
    };
    return [];
}


// первоначальная загрузка страницы
setRandomColors(true); 




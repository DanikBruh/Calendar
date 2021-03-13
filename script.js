let calendar = $('.calendar');
let calendarMonth = $('.month');
let calendarYear = $('.year');
let weekPlan = $('.week-plan');


const DAYSINWEEK = 7;

function getCurrentTime() {
    let time = new Date().toLocaleTimeString();
    document.querySelector('.current-time').innerHTML = time;
    setTimeout(getCurrentTime, 1000);
}

// Обновляет и сохраняет дату date в localStorage
function setDateToLocalStorage(date) {
    // localStorage.clear();
    localStorage.setItem('date', date);
}

$(document).ready(function () {


    (function ($) {
        $(function () {
            $("ul.tabs__caption").on("click", "li:not(.active)", function () {
                $(this)
                    .addClass("active")
                    .siblings()
                    .removeClass("active")
                    .closest("div.tabs")
                    .find("div.tabs__content")
                    .removeClass("active")
                    .eq($(this).index())
                    .addClass("active");
            });
        });
    })(jQuery);



    //  Текущее время
    $(window).on('load', getCurrentTime());
    //  Текущая дата
    $('.current-date').append(`${new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    //  Календарь на месяц
    renderCalendar();

    $(".prev").on("click", () => {
        date.setMonth(date.getMonth() - 1);
        deleteNode(document.querySelector('table'));
        renderCalendar();
    });

    $(".next").on("click", () => {
        date.setMonth(date.getMonth() + 1);
        deleteNode(document.querySelector('table'));
        renderCalendar();

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            console.log(`${key}: ${localStorage.getItem(key)}`);
        }
    });
    // Список задач на неделю
    $('.week-plan td').children('textarea').each(function (i) {
        $(this).html(localStorage.getItem(`area${i}`));
        $(this).bind('input propertychange', function () {
            localStorage.setItem(`area${i}`, this.value);
            // Обновление списка задач на день
            fillDatePlan();
        });
    });

    $('.week-plan thead tr').children('th').eq(0).html(new Date().toLocaleDateString('ru-RU', { month: 'long' }));
    $('.week-plan thead tr').children('th').each(function (i) {
        let date = new Date(localStorage.getItem('date'));
        // Дата текущей недели
        let currentWeekDay = date.getDate() - date.getDay() + i;
        if (currentWeekDay == new Date().getDate()) {
            $('.week-plan thead tr').children('th').eq(i).children('span').eq(0).addClass('active');
        }
        $('.week-plan thead tr').children('th').eq(i).children('span').eq(0).html(currentWeekDay);
    });

    // При нажатии на кноку "Очистить хранилище"
    $('#clear').click(function(){
        localStorage.clear();
        $('.week-plan tbody td').children('textarea').each(function (i, item) {
            item.innerHTML = '';
        });
        fillDatePlan();
    });

    // Список задач на текущую дату

    // Установка даты в заголовке 
    $('.calendar_plan .cl_copy').html(new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    fillDatePlan();
   
});

let date = new Date();

// Изображает календарь
const renderCalendar = () => {
    setDateToLocalStorage(date);
    date = new Date(localStorage.getItem('date'));

    let prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    let currentMonthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
    firstDayIndex < 0 ? firstDayIndex = 6 : 0;
    let lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

    calendarMonth.html(date.toLocaleDateString('ru-RU', { month: 'long' }));
    calendarYear.html(date.getFullYear());

    const nextDays = DAYSINWEEK - lastDayIndex;

    let days = fillDaysArray(firstDayIndex, lastDayIndex, prevMonthLastDay, currentMonthLastDay, nextDays);
    let weeksInMonth = days.length / DAYSINWEEK;

    createCalendarTable(calendar, weeksInMonth, DAYSINWEEK, 'short');
    fillCalendar(document.querySelector('.calendar table tbody'), days);
    setCalendarStyle(document.querySelector('.calendar table tbody'));
}

// Заполнение массива днями текущего месяца
function fillDaysArray(firstDayIndex, lastDayIndex, prevMonthLastDay, currentMonthLastDay, nextDays) {
    let days = [];
    for (let x = firstDayIndex; x > 0; x--) {
        days.push(prevMonthLastDay - x + 1);
    }
    for (let i = 1; i <= currentMonthLastDay; i++) {
        days.push(i);
    }
    if (lastDayIndex != 0) {
        for (let j = 1; j <= nextDays; j++) {
            days.push(j);
        }
    }
    return days;
}

//  Функция, создающая и добавляющая таблицу заданных размеров узлу node.
function createTable(node, rows, cells) {
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    for (i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (j = 0; j < cells; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    node.append(table);
}

//  Функция, создающая календарь
function createCalendarTable(node, rows, cells, weekdayType) {
    createTable(node, rows, cells);
    let tr = document.createElement('tr');
    for (j = 0; j < cells; j++) {
        let th = document.createElement('th');
        th.innerHTML = new Date(2021, 2, j + 1).toLocaleDateString('ru-RU', { weekday: `${weekdayType}` });
        tr.appendChild(th);
    }
    node.children().last().prepend(tr);
}

// Заполняет таблицу данными из массива days
function fillCalendar(tbody, days) {
    let i = 0;
    for (let row of tbody.rows) {
        for (let cell of row.cells) {
            if (cell.nodeName == "TD") {
                cell.innerHTML = days[i];
                i++;
            }
        }
    }
}

//  Функция, изменяющая стили ячеек календаря.
function setCalendarStyle(tbody, ) {
    let date = new Date(localStorage.getItem('date'));
    for (let row of tbody.rows) {
        for (let cell of row.cells) {
            cell.style.width = cell.style.height = `${100 / DAYSINWEEK}%`;
            if (cell.innerHTML == date.getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear())
                cell.classList.add('today');
        }
    }
    for (let j = 0; j < DAYSINWEEK; j++) {
        if (tbody.rows[1].cells[j].innerHTML > DAYSINWEEK) {
            tbody.rows[1].cells[j].classList.add('prev-month');
        }
        if (tbody.rows[tbody.rows.length - 1].cells[j].innerHTML < DAYSINWEEK) {
            tbody.rows[tbody.rows.length - 1].cells[j].classList.add('next-month');
        }
    }
}

//  Удаление узла и его дочерних элементов, если он существует.
function deleteNode(node) {
    if (node) {
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        node.remove();
    }
}
// Заполняет список задач на текущую неделю
function fillDatePlan(){
    
    let j = new Date(localStorage.getItem('date')).getDay() - 1;
    // Заполнение каждого поля (плана) в списке задач на текущую дату
    $('.calendar_events').children('div').each(function (i, item) {
        item.children[2].innerText = localStorage.getItem(`area${j}`);
        j += DAYSINWEEK;
    });
}
// CONST VARs
const header = document.getElementsByTagName("header")[0],
main = document.getElementsByTagName('main')[0],
pages = main.children,
choosingNumbersBtn = document.getElementsByClassName("home")[0],
tableContainer = document.getElementsByClassName("tables")[0],
tables = document.getElementsByClassName("table"),
chooseBtn = document.getElementsByClassName("choose")[0],
question = document.getElementsByClassName("question-field")[0],
confirmBtn = document.getElementsByClassName("confirm")[0],
usersAnswer = document.getElementsByTagName("input")[0],
answers = document.getElementsByClassName("answers")[0],
result = document.getElementsByClassName("result")[0],
showResult = document.getElementsByClassName("show-answers")[0],
restartBtn = document.getElementsByClassName("restart")[0],
settingTimerBtn = document.getElementsByClassName("timer")[0],
timerSettings = document.getElementsByClassName("timer-settings")[0],
timerTypes = document.getElementsByClassName("timer-type"),
usersTimer = document.getElementsByTagName("input")[1],
apply = document.getElementsByClassName("apply")[0],
timerField = document.getElementsByClassName("time")[0],
timeSpentField = document.getElementsByClassName("time-spent")[0],
settings = {
    typeOfTimer: null,
    seconds: null,
};

// Let VARs
let choosedNumbers = [],
timer,
EQT,
WET,
timeSpent = 0,
count = 0;
questionList = [];

settingTimerBtn.addEventListener("click", _ => {
    timerSettings.classList.add("active");
    header.style.pointerEvents = "none";
    header.style.filter = "blur(2px)";
    main.style.pointerEvents = "none";
    main.style.filter = "blur(2px)";
});

usersTimer.addEventListener("input", _ => {
    settings.seconds = +usersTimer.value;
});

for (let i = 0; i < timerTypes.length; i++) {
    timerTypes[i].addEventListener("click", _ => {
        if (timerTypes[i].children[1].classList[1]) {
            timerTypes[i].children[1].classList.remove("active");
            settings.typeOfTimer = null;
        } else {
            for (let j = 0; j < timerTypes.length; j++) {
                timerTypes[j].children[1].classList.remove("active");
            };
            timerTypes[i].children[1].classList.add("active");
            settings.typeOfTimer = i == 0? "EQT": "WET";
        };
    });
};

apply.addEventListener("click", _ => {
    if (!settings.typeOfTimer) {
        settings.seconds = null;
        timerTypes[0].children[1].classList.remove("active");
        timerTypes[1].children[1].classList.remove("active");
        usersTimer.value = "";
    } else if (!(settings.seconds > 0)) {
        settings.typeOfTimer = null;
        settings.seconds = null;
        timerTypes[0].children[1].classList.remove("active");
        timerTypes[1].children[1].classList.remove("active");
        usersTimer.value = "";
    };
    timerSettings.classList.remove("active");
    header.style.pointerEvents = "initial";
    header.style.filter = "blur(0)";
    main.style.pointerEvents = "initial";
    main.style.filter = "blur(0)";
});

choosingNumbersBtn.addEventListener("click", _ => {
    window.location.reload();
});

showResult.addEventListener("click", _ => {
    moveToPage(pages[3]);
});

window.addEventListener("click", e => {
    if (e.target.className == "close") {
        moveToPage(pages[2]);
    };
});

restartBtn.addEventListener("click", _ => {
    questionList = [];
    moveToPage(pages[0]);
    chooseBtn.click();
    answers.innerHTML = '<a href="#" class="close">إغلاق</a>';
    usersAnswer.value = "";
    timeSpent = 0;
});

addEventListener("keydown", e => {
    if (e.key == "Enter") {
        console.log(timerSettings.classList[1])
        if (timerSettings.classList[1] == "active") {
            apply.click();
        } else if (pages[0].classList[1] == "active") {
            chooseBtn.click();
        } else if (pages[1].classList[1] == "active") {
            confirmBtn.click();
        }
    };
});

for (let i = 0; i < 10; i++) {
    tableContainer.innerHTML += `<div class="table">${i + 1}<div>`;
};

for (let i = 0; i < tables.length; i++) {
    tables[i].addEventListener("click", _ => {
        tables[i].classList.toggle("choosed");
    });
};

chooseBtn.addEventListener("click", _ => {
    if (document.getElementsByClassName("choosed").length) {
        count = settings.seconds;
        choosedNumbers = document.getElementsByClassName("choosed");
        moveToPage(pages[1])
        preparingQuestions(choosedNumbers);
        timer = setInterval(_ => {
            timeSpent++;
            settings.typeOfTimer == null? timerField.textContent = `${timeSpent}ث`: "";
        }, 1000);
        if (settings.typeOfTimer == "EQT") {
            document.querySelector(".timer-field .title").textContent = "الوقت المتبقي:";
            timerField.textContent = `${count}ث`;
            EQT = setInterval(_ => {
                if (count == 0) {
                    usersAnswer.value = "لم يتم حل السؤال";
                    confirmBtn.click();
                };
                timerField.textContent = `${count}ث`;
                count--;
            }, 1000);
        } else if (settings.typeOfTimer == "WET") {
            document.querySelector(".timer-field .title").textContent = "الوقت المتبقي:";
            timerField.textContent = `${count}ث`;
            WET = setInterval(_ => {
                if (count == 0) {
                    for (let i = 0; i < questionList.length; i++) {
                        answers.innerHTML += `
                            <div class="container">
                                <div class="question">${questionList[i]}</div>
                                <div class="answer wrong">
                                    <div class="user-answer">لم يتم حل السؤال</div>
                                    <div class="right-answer">${questionList[i].split(" X ")[0] * questionList[i].split(" X ")[1]}</div>
                                </div>
                                <div class="counter">${document.getElementsByClassName("counter").length + 1}</div>
                            </div>
                        `;
                    };
                    questionList = [];
                    usersAnswer.value = "لم يتم حل السؤال";
                    confirmBtn.click();
                };
                timerField.textContent = `${count}ث`;
                count--;
            }, 1000)
        };
    };
});

confirmBtn.addEventListener("click", _ => {
    const numbers = question.textContent.split(" X ");
    if (usersAnswer.value.length) {
        EQT? count = settings.seconds: null;
        answers.innerHTML += `
            <div class="container">
                <div class="question">${question.textContent}</div>
                <div class="answer ${usersAnswer.value == numbers[0] * numbers[1]? "right": "wrong"}">
                    <div class="user-answer">${usersAnswer.value}</div>
                    <div class="right-answer">${numbers[0] * numbers[1]}</div>
                </div>
                <div class="counter">${document.getElementsByClassName("counter").length + 1}</div>
            </div>
        `;
        usersAnswer.value = "";
        if (questionList.length) {
            getRandomNum();
        } else {
            moveToPage(pages[2]);
            const bestRes = document.getElementsByClassName("container").length;
            result.textContent = `${document.getElementsByClassName("right").length}/${bestRes}`;
            const usersResult = +result.textContent.split("/")[0];
            if (usersResult >= bestRes - ((bestRes / 10) * 2)) {
                result.style.color = "#28a745";
            } else if (usersResult >= bestRes - ((bestRes / 10) * 4)) {
                result.style.color = "#ffc107";
            } else {
                result.style.color = "#dc3545";
            };
            timeSpentField.textContent = `لقد استغرقت ${timeSpent}ث لحل الاختبار`
            clearInterval(timer);
            EQT? clearInterval(EQT): WET? clearInterval(WET): null;
            EQT = null;
            WET = null;
        };
    };
});

function preparingQuestions(choosedNumbers) {
    for (let i = 0; i < choosedNumbers.length; i++) {
        for (let j = 0; j < 10; j++) {
            questionList.push(`${choosedNumbers[i].textContent} X ${j + 1}`)
        };
    };
    getRandomNum();
};

function getRandomNum() {
    const randomNum = Math.round(Math.random() * (questionList.length - 1))
    question.textContent = questionList[randomNum];
    questionList.splice(randomNum, 1);
};

function moveToPage(page) {
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    };
    page.classList.add('active');
};


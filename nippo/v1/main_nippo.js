const inputYourName = document.querySelector('#input_yourname');
const inputDate = document.querySelector('#input_date');
const inputStaff = document.querySelector('#input_staff');
const mailResultText = document.querySelector('#mail_text');
const mailResultTitle = document.querySelector('#mail_title');
const submitButton = document.querySelector('#submit_btn');

const inputAMTasksCount = document.querySelector('#am_tasks_count');
const inputPMTasksCount = document.querySelector('#pm_tasks_count');

const inputTomorrowAMTasksCount = document.querySelector('#tomorrow_am_tasks_count');
const inputTomorrowPMTasksCount = document.querySelector('#tomorrow_pm_tasks_count');
const inputNextDate = document.querySelector('#input_next_date')

const inputTodayComment = document.querySelector('#input_today_comment');

const inputAMTasks = [
    document.querySelector('#input_am_task_1'),
    document.querySelector('#input_am_task_2'),
    document.querySelector('#input_am_task_3'),
];
const inputPMTasks = [
    document.querySelector('#input_pm_task_1'),
    document.querySelector('#input_pm_task_2'),
    document.querySelector('#input_pm_task_3'),
];
const inputTomorrowAMTasks = [
    document.querySelector('#input_tomorrow_am_task_1'),
    document.querySelector('#input_tomorrow_am_task_2'),
    document.querySelector('#input_tomorrow_am_task_3'),
];
const inputTomorrowPMTasks = [
    document.querySelector('#input_tomorrow_pm_task_1'),
    document.querySelector('#input_tomorrow_pm_task_2'),
    document.querySelector('#input_tomorrow_pm_task_3'),
];

// Dateクラス→フォーム用Date
function getDateStringForForm(date) {
    const yyyy = date.getFullYear();
    const mm = ("0"+(date.getMonth()+1)).slice(-2);
    const dd = ("0"+date.getDate()).slice(-2);
    return yyyy+'-'+mm+'-'+dd;
}


// エラーチェック。
// エラーがある場合はメッセージを返す。ない場合は空文字列を返す。
function getErrorMessage() {
    let error_msg = "";

    if(!inputYourName.value) {
        error_msg += "あなたの名前を入力してください。\n";
    }
    if(!inputDate.value) {
        error_msg += "日付が不正です。\n";
    }
    if(!inputStaff.value) {
        error_msg += "講師を選択してください。\n";
    }

    return error_msg;
}

// メール文用のタスク一覧文章を作成し取得
function getTaskText(title, tasksArray) {
    if(tasksArray.length == 0) return "";

    let result = "";

    result += `・${title}`;
    
    tasksArray.forEach((task) => {
        result += `\n　・${task}`;
    });
    result += "\n";

    return result;
}

// メール本文のヘッダーを取得
function getMailTextHeader(yourName, staffName) {
    let result = "";
    result += `${staffName}さん\n\n`;
    result += `お疲れ様です。${yourName}です。\n`;
    result += `本日の日報です。\n\n`;
    return result;
}

// メール本文のタスク一覧を取得
function getMailTextTodayTasks(amTaskArray, pmTaskArray) {
    let result = "";
    result += `■本日の作業実績\n`
    result += `${getTaskText("午前中", amTaskArray)}`;
    result += `${getTaskText("午後", pmTaskArray)}`;
    result += `\n`;
    return result;
}

// メール本文の明日の予定一覧を取得
function getMailTextTomorrowTasks(amTaskArray, pmTaskArray, isNextDay, isNextWeek) {
    let result = "";

    // 次回 or 明日 or 来週
    let nextTimeWord = "次回"

    if(isNextDay == true) {
        // 「次回の訓練日」が明日の場合は「明日の予定」になる
        nextTimeWord = "明日"
    } else if(isNextWeek == true) {
        // 「次回の訓練日」が来週の場合は「来週の予定」になる
        nextTimeWord = "来週"
    }

    result += `■${nextTimeWord}の予定\n`
    result += `${getTaskText("午前中", amTaskArray)}`;
    result += `${getTaskText("午後", pmTaskArray)}`;
    result += `\n`;
    return result;
}

// メール本文の今日の感想を取得
function getMailTextTodayComment(todayComment) {
    let result = "";
    result += `■感想\n`;
    result += `${todayComment}\n`;
    result += `\n`;
    return result;
}

// メール本文のフッターを取得
function getMailTextFooter(yourName) {
    let result = "";
    result += `以上です。\nよろしくお願いいたします。\n\n`;
    result += `${yourName}`;
    return result;
}

function getIsNextWeek(date_current, date_next) {
    const currentWeekLeftDays = 6 - (date_current.getDate() - date_current.getDay());
    console.log(currentWeekLeftDays);
    const dateSpan = (date_next - date_current) / 86400000;
    const result = dateSpan > currentWeekLeftDays && dateSpan <= currentWeekLeftDays + 7;
    console.log(result);
    return result;
}

// メールの本文を取得
function getMailText(yourName, staffName, amTaskArray, pmTaskArray, amTomorrowTaskArray, pmTomorrowTaskArray, todayComment) {
    let result = "";


    /**
     * １．次回が明日の場合→明日の予定
     * ２．次回が来週の場合→来週の予定
     * ３．それ以外の場合→次回の予定
     */

    const todayDate = new Date(inputDate.value);
    const nextdayDate = new Date(inputNextDate.value);

    const nextDaySpan = (nextdayDate - todayDate) / 86400000;
    const isNextDay = nextDaySpan == 1;
    const isNextWeek = getIsNextWeek(todayDate, nextdayDate);

    result += getMailTextHeader(yourName, staffName);
    result += getMailTextTodayTasks(amTaskArray, pmTaskArray);
    result += getMailTextTomorrowTasks(amTomorrowTaskArray, pmTomorrowTaskArray, isNextDay, isNextWeek);
    result += getMailTextTodayComment(todayComment)
    result += getMailTextFooter(yourName);

    return result;
}

// 日付フォームから取得した値をメール件名用に加工して返す
function convertFormDateToTitleDate(formDate) {
    return inputDate.value.split("-").map((value) => {return value.substr(-2)}).join("");
}

// メールの件名を取得
function getMailTitle(mailType, yourName, dateText) {
    return `【${mailType}】${yourName}${dateText}`;
}

// inputエレメントの配列からデータを抽出し、文字列の配列に加工して返す
function convertFormTasksToArray(inputTasks) {
    let result = [];
    inputTasks.forEach((inputElement) => {
        const inputValue = inputElement.value;
        if(inputValue != "") {
            result.push(inputValue);
        }
    });
    return result;
}

// 午前中のタスク入力を取得。
// 指定した作業数を超えたタスクは除外する。
function getAMTasksArray() {
    const amTasksCount = inputAMTasksCount.value;
    const amTasksArray = convertFormTasksToArray(inputAMTasks);
    return amTasksArray.slice(0, amTasksCount);
}


// 午後のタスク入力を取得。
// 指定した作業数を超えたタスクは除外する。
function getPMTasksArray() {
    const pmTasksCount = inputPMTasksCount.value;
    const pmTasksArray = convertFormTasksToArray(inputPMTasks);
    return pmTasksArray.slice(0, pmTasksCount);
}

// 午前中のタスク入力を取得。
// 指定した作業数を超えたタスクは除外する。
function getTomorrowAMTasksArray() {
    const amTasksCount = inputTomorrowAMTasksCount.value;
    const amTasksArray = convertFormTasksToArray(inputTomorrowAMTasks);
    return amTasksArray.slice(0, amTasksCount);
}

// 午後のタスク入力を取得。
// 指定した作業数を超えたタスクは除外する。
function getTomorrowPMTasksArray() {
    const pmTasksCount = inputTomorrowPMTasksCount.value;
    const pmTasksArray = convertFormTasksToArray(inputTomorrowPMTasks);
    return pmTasksArray.slice(0, pmTasksCount);
}

// 入力エラーがない場合のみメール結果を反映させる。
// エラーがある場合はAlertで教えてくれる。
function update_mail_result() {
    let error_message = getErrorMessage();

    if(error_message) {
        alert(error_message);
        return;
    }
    
    const mailType = "日報";
    const yourName = inputYourName.value;
    const staffName = inputStaff.value;
    const dateText = convertFormDateToTitleDate(inputDate.value);

    const amTaskArray = getAMTasksArray();
    const pmTaskArray = getPMTasksArray();

    const tomorrowAMTaskArray = getTomorrowAMTasksArray();
    const tomorrowPMTaskArray = getTomorrowPMTasksArray();

    const todayComment = inputTodayComment.value;

    mailResultTitle.value = getMailTitle(mailType, yourName, dateText);

    // 引数が多く改善の余地あり
    mailResultText.value = getMailText(yourName, staffName, amTaskArray, pmTaskArray, tomorrowAMTaskArray, tomorrowPMTaskArray, todayComment);
}

// 作業数に応じて午前タスクの入力ボックスの数を変える
function updateAMTasksList() {
    const taskCount = inputAMTasksCount.value;
    //console.log(taskCount);
    for(let i = 0; i < 3; i++) {
        const task = inputAMTasks[i];
        task.hidden = i >= taskCount;
    }
}

// 作業数に応じて午後タスクの入力ボックスの数を変える
function updatePMTasksList() {
    const taskCount = inputPMTasksCount.value;
    //console.log(taskCount);
    for(let i = 0; i < 3; i++) {
        const task = inputPMTasks[i];
        task.hidden = i >= taskCount;
    }
}

// 作業数に応じて午前タスクの入力ボックスの数を変える
function updateTomorrowAMTasksList() {
    const taskCount = inputTomorrowAMTasksCount.value;
    //console.log(taskCount);
    for(let i = 0; i < 3; i++) {
        const task = inputTomorrowAMTasks[i];
        task.hidden = i >= taskCount;
    }
}

// 作業数に応じて午後タスクの入力ボックスの数を変える
function updateTomorrowPMTasksList() {
    const taskCount = inputTomorrowPMTasksCount.value;
    //console.log(taskCount);
    for(let i = 0; i < 3; i++) {
        const task = inputTomorrowPMTasks[i];
        task.hidden = i >= taskCount;
    }
}

function initialize() {
    const today = new Date();
    inputDate.value = getDateStringForForm(today);
}

window.onload = initialize;
submitButton.onclick = update_mail_result;

inputAMTasksCount.onchange = updateAMTasksList;
inputPMTasksCount.onchange = updatePMTasksList;
inputTomorrowAMTasksCount.onchange = updateTomorrowAMTasksList;
inputTomorrowPMTasksCount.onchange = updateTomorrowPMTasksList;
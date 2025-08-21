const inputYourName = document.querySelector('#input_yourname');
const inputDate = document.querySelector('#input_date');
const inputStaff = document.querySelector('#input_staff');
const mailResultText = document.querySelector('#mail_text');
const mailResultTitle = document.querySelector('#mail_title');
const submitButton = document.querySelector('#submit_btn');
const inputAMTasksCount = document.querySelector('#am_tasks_count');
const inputPMTasksCount = document.querySelector('#pm_tasks_count');
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

// 今日の日付を文字列形式で取得する
function getTodayStringForForm() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = ("0"+(today.getMonth()+1)).slice(-2);
    const dd = ("0"+today.getDate()).slice(-2);
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
    result += `おはようございます。${yourName}です。\n`;
    result += `本日の作業計画です。\n\n`;
    return result;
}

// メール本文のタスク一覧を取得
function getMailTextTodayTasks(amTaskArray, pmTaskArray) {
    let result = "";
    result += `■本日の作業計画\n`
    result += `${getTaskText("午前中", amTaskArray)}`;
    result += `${getTaskText("午後", pmTaskArray)}`;
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

// メールの本文を取得
function getMailText(yourName, staffName, amTaskArray, pmTaskArray) {
    let result = "";

    result += getMailTextHeader(yourName, staffName);
    result += getMailTextTodayTasks(amTaskArray, pmTaskArray);
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

// 入力エラーがない場合のみメール結果を反映させる。
// エラーがある場合はAlertで教えてくれる。
function update_mail_result() {
    let error_message = getErrorMessage();

    if(error_message) {
        alert(error_message);
        return;
    }
    
    const mailType = "作業計画";
    const yourName = inputYourName.value;
    const staffName = inputStaff.value;
    const dateText = convertFormDateToTitleDate(inputDate.value);

    const amTaskArray = getAMTasksArray();
    const pmTaskArray = getPMTasksArray();

    mailResultTitle.value = getMailTitle(mailType, yourName, dateText);
    mailResultText.value = getMailText(yourName, staffName, amTaskArray, pmTaskArray);
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

function initialize() {
    inputDate.value = getTodayStringForForm();
}

window.onload = initialize;
submitButton.onclick = update_mail_result;

inputAMTasksCount.onchange = updateAMTasksList;
inputPMTasksCount.onchange = updatePMTasksList;
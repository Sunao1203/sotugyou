// =============================
// 設定ページ
// =============================

/*
    現在はDB未接続のため、
    設定内容をlocalStorageへ保存します。

    後からDB班と接続するときは、

    localStorageへの保存
        ↓
    APIを使ってDBへ保存

    に変更できます。
*/


// =============================
// 各入力欄を取得
// =============================


// 場所
const homeLocation =
    document.getElementById("homeLocation");

const workLocation =
    document.getElementById("workLocation");

const useCurrentLocation =
    document.getElementById("useCurrentLocation");


// 電車
const trainLine =
    document.getElementById("trainLine");

const boardingStation =
    document.getElementById("boardingStation");

const arrivalStation =
    document.getElementById("arrivalStation");


// 時間
const morningStart =
    document.getElementById("morningStart");

const morningEnd =
    document.getElementById("morningEnd");

const eveningStart =
    document.getElementById("eveningStart");

const eveningEnd =
    document.getElementById("eveningEnd");


// 通知
const weatherAlertNotification =
    document.getElementById(
        "weatherAlertNotification"
    );

const heatAlertNotification =
    document.getElementById(
        "heatAlertNotification"
    );

const rainNotification =
    document.getElementById(
        "rainNotification"
    );

const trainDelayNotification =
    document.getElementById(
        "trainDelayNotification"
    );

const trainStopNotification =
    document.getElementById(
        "trainStopNotification"
    );

const scheduleNotification =
    document.getElementById(
        "scheduleNotification"
    );


// AI秘書
const secretaryName =
    document.getElementById("secretaryName");

const secretaryTone =
    document.getElementById("secretaryTone");

const voiceEnabled =
    document.getElementById("voiceEnabled");


// ボタン
const saveButton =
    document.getElementById("saveButton");

const headerSaveButton =
    document.getElementById("headerSaveButton");

const resetButton =
    document.getElementById("resetButton");

const backButton =
    document.getElementById("backButton");


// トースト
const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


let toastTimer;


// =============================
// 初期設定
// =============================

const defaultSettings = {

    weather: {

        home: "",

        work: "",

        defaultLocation: "current",

        useCurrentLocation: true

    },


    train: {

        line: "",

        boardingStation: "",

        arrivalStation: "",

        weekdays: [
            "月",
            "火",
            "水",
            "木",
            "金"
        ],

        morningStart: "07:00",

        morningEnd: "09:30",

        eveningStart: "17:00",

        eveningEnd: "20:00"

    },


    notifications: {

        weatherAlert: true,

        heatAlert: true,

        rain: true,

        trainDelay: true,

        trainStop: true,

        schedule: true

    },


    assistant: {

        name: "",

        tone: "friendly",

        voiceEnabled: false

    }

};


// =============================
// トースト表示
// =============================

function showToast(message) {

    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove("show");

            },
            2500
        );

}


// =============================
// 曜日を取得
// =============================

function getSelectedWeekdays() {

    const weekdayCheckboxes =
        document.querySelectorAll(
            'input[name="weekday"]:checked'
        );


    const weekdays = [];


    weekdayCheckboxes.forEach(
        function (checkbox) {

            weekdays.push(
                checkbox.value
            );

        }
    );


    return weekdays;

}


// =============================
// 天気の初期表示場所を取得
// =============================

function getDefaultWeatherLocation() {

    const selected =
        document.querySelector(
            'input[name="defaultWeatherLocation"]:checked'
        );


    if (selected) {

        return selected.value;

    }


    return "current";

}


// =============================
// 入力内容から設定オブジェクトを作成
// =============================

function createSettingsObject() {

    return {

        weather: {

            home:
                homeLocation.value.trim(),

            work:
                workLocation.value.trim(),

            defaultLocation:
                getDefaultWeatherLocation(),

            useCurrentLocation:
                useCurrentLocation.checked

        },


        train: {

            line:
                trainLine.value.trim(),

            boardingStation:
                boardingStation.value.trim(),

            arrivalStation:
                arrivalStation.value.trim(),

            weekdays:
                getSelectedWeekdays(),

            morningStart:
                morningStart.value,

            morningEnd:
                morningEnd.value,

            eveningStart:
                eveningStart.value,

            eveningEnd:
                eveningEnd.value

        },


        notifications: {

            weatherAlert:
                weatherAlertNotification.checked,

            heatAlert:
                heatAlertNotification.checked,

            rain:
                rainNotification.checked,

            trainDelay:
                trainDelayNotification.checked,

            trainStop:
                trainStopNotification.checked,

            schedule:
                scheduleNotification.checked

        },


        assistant: {

            name:
                secretaryName.value.trim(),

            tone:
                secretaryTone.value,

            voiceEnabled:
                voiceEnabled.checked

        }

    };

}


// =============================
// 入力チェック
// =============================

function validateSettings(settings) {

    /*
        現在は最低限のチェックだけ行います。

        後から住所APIやDBと接続するときは、
        入力値の検証をさらに追加できます。
    */


    // 自宅を初期表示にしている場合
    if (
        settings.weather.defaultLocation === "home" &&
        settings.weather.home === ""
    ) {

        showToast(
            "自宅を表示する場合は自宅の地域を入力してください"
        );

        homeLocation.focus();

        return false;

    }


    // 職場を初期表示にしている場合
    if (
        settings.weather.defaultLocation === "work" &&
        settings.weather.work === ""
    ) {

        showToast(
            "職場を表示する場合は職場の地域を入力してください"
        );

        workLocation.focus();

        return false;

    }


    // 朝の時間チェック
    if (
        settings.train.morningStart &&
        settings.train.morningEnd &&
        settings.train.morningStart >
            settings.train.morningEnd
    ) {

        showToast(
            "朝の利用時間を確認してください"
        );

        return false;

    }


    // 帰宅時間チェック
    if (
        settings.train.eveningStart &&
        settings.train.eveningEnd &&
        settings.train.eveningStart >
            settings.train.eveningEnd
    ) {

        showToast(
            "帰宅時の利用時間を確認してください"
        );

        return false;

    }


    return true;

}


// =============================
// 設定を保存
// =============================

function saveSettings() {

    const settings =
        createSettingsObject();


    if (!validateSettings(settings)) {

        return;

    }


    /*
        LocalStorageへJSON形式で保存
    */

    localStorage.setItem(
        "aiSecretarySettings",
        JSON.stringify(settings)
    );


    /*
        main.htmlで使用している
        selectedWeatherLocationとも連携します。

        これによって設定画面で選択した

        現在地
        自宅
        職場

        がメイン画面にも反映できます。
    */

    localStorage.setItem(
        "selectedWeatherLocation",
        settings.weather.defaultLocation
    );


    console.log(
        "保存した設定：",
        settings
    );


    showToast(
        "設定を保存しました"
    );


    /*
        ★ DB接続後

        ここでfetchなどを利用して
        サーバーへ設定情報を送信します。


        例：

        fetch("/api/settings", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body:
                JSON.stringify(settings)

        });
    */

}


// =============================
// 保存済み設定を読み込む
// =============================

function loadSettings() {

    const savedData =
        localStorage.getItem(
            "aiSecretarySettings"
        );


    // 保存データがない場合
    if (!savedData) {

        applySettings(
            defaultSettings
        );

        return;

    }


    try {

        const settings =
            JSON.parse(savedData);


        applySettings(
            settings
        );

    }
    catch (error) {

        console.error(
            "設定データの読み込みに失敗しました",
            error
        );


        applySettings(
            defaultSettings
        );

    }

}


// =============================
// 設定を画面へ反映
// =============================

function applySettings(settings) {

    /*
        古い設定データがあっても
        エラーになりにくいように
        初期値と結合します。
    */

    const weather = {

        ...defaultSettings.weather,

        ...(settings.weather || {})

    };


    const train = {

        ...defaultSettings.train,

        ...(settings.train || {})

    };


    const notifications = {

        ...defaultSettings.notifications,

        ...(settings.notifications || {})

    };


    const assistant = {

        ...defaultSettings.assistant,

        ...(settings.assistant || {})

    };


    // -----------------------------
    // 場所・天気
    // -----------------------------

    homeLocation.value =
        weather.home;

    workLocation.value =
        weather.work;

    useCurrentLocation.checked =
        weather.useCurrentLocation;


    const weatherRadio =
        document.querySelector(
            `input[name="defaultWeatherLocation"][value="${weather.defaultLocation}"]`
        );


    if (weatherRadio) {

        weatherRadio.checked =
            true;

    }


    // -----------------------------
    // 電車
    // -----------------------------

    trainLine.value =
        train.line;

    boardingStation.value =
        train.boardingStation;

    arrivalStation.value =
        train.arrivalStation;

    morningStart.value =
        train.morningStart;

    morningEnd.value =
        train.morningEnd;

    eveningStart.value =
        train.eveningStart;

    eveningEnd.value =
        train.eveningEnd;


    // 曜日
    const weekdayCheckboxes =
        document.querySelectorAll(
            'input[name="weekday"]'
        );


    weekdayCheckboxes.forEach(
        function (checkbox) {

            checkbox.checked =
                train.weekdays.includes(
                    checkbox.value
                );

        }
    );


    // -----------------------------
    // 通知
    // -----------------------------

    weatherAlertNotification.checked =
        notifications.weatherAlert;

    heatAlertNotification.checked =
        notifications.heatAlert;

    rainNotification.checked =
        notifications.rain;

    trainDelayNotification.checked =
        notifications.trainDelay;

    trainStopNotification.checked =
        notifications.trainStop;

    scheduleNotification.checked =
        notifications.schedule;


    // -----------------------------
    // AI秘書
    // -----------------------------

    secretaryName.value =
        assistant.name;

    secretaryTone.value =
        assistant.tone;

    voiceEnabled.checked =
        assistant.voiceEnabled;

}


// =============================
// 設定初期化
// =============================

function resetSettings() {

    const answer =
        window.confirm(
            "設定を初期状態に戻しますか？"
        );


    if (!answer) {

        return;

    }


    localStorage.removeItem(
        "aiSecretarySettings"
    );


    localStorage.removeItem(
        "selectedWeatherLocation"
    );


    localStorage.removeItem(
        "selectedWeatherDay"
    );


    applySettings(
        defaultSettings
    );


    showToast(
        "設定を初期化しました"
    );

}


// =============================
// メイン画面へ戻る
// =============================

function goBackToMain() {

    /*
        htmlフォルダ内に

        main.html
        settings.html

        があるため、
        同じ階層として指定できます。
    */

    window.location.href =
        "main.html";

}


// =============================
// ボタンイベント
// =============================


// 下の保存ボタン
saveButton.addEventListener(
    "click",
    saveSettings
);


// ヘッダーの保存ボタン
headerSaveButton.addEventListener(
    "click",
    saveSettings
);


// 初期化
resetButton.addEventListener(
    "click",
    resetSettings
);


// 戻る
backButton.addEventListener(
    "click",
    goBackToMain
);


// =============================
// ページ読み込み時
// =============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSettings();

    }
);
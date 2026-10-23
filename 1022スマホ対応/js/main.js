// =============================
// 日付・時刻
// =============================

const currentDateElement =
    document.getElementById(
        "currentDate"
    );

const currentTimeElement =
    document.getElementById(
        "currentTime"
    );


function updateDateTime() {

    const now =
        new Date();


    const dayNames = [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土"
    ];


    const month =
        now.getMonth() + 1;

    const date =
        now.getDate();

    const day =
        dayNames[
        now.getDay()
        ];


    currentDateElement.textContent =
        `${month}月${date}日（${day}）`;


    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );


    currentTimeElement.textContent =
        `${hours}:${minutes}`;
}


updateDateTime();


setInterval(
    updateDateTime,
    1000
);


// =============================
// 共通：YYYY-MM-DD
// =============================

function getLocalDateString(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


// =============================
// トースト
// =============================

const toast =
    document.getElementById(
        "toast"
    );


const toastMessage =
    document.getElementById(
        "toastMessage"
    );


let toastTimer;


function showToast(message) {

    if (
        !toast
        ||
        !toastMessage
    ) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


// =============================
// 天気
// =============================

const weatherTemperature =
    document.getElementById(
        "weatherTemperature"
    );


const weatherRain =
    document.getElementById(
        "weatherRain"
    );


const weatherIcon =
    document.querySelector(
        "#weatherIcon i"
    );


const weatherLocationButtons =
    document.querySelectorAll(
        ".weather-location-button"
    );


const weatherDayButtons =
    document.querySelectorAll(
        ".weather-day-button"
    );


// =============================
// 天気設定
// =============================

const defaultWeatherSettings = {

    home: "",

    work: "",

    defaultLocation:
        "current",

    useCurrentLocation:
        true

};


function loadWeatherSettings() {

    const savedData =
        localStorage.getItem(
            "aiSecretarySettings"
        );


    if (!savedData) {

        return {
            ...defaultWeatherSettings
        };
    }


    try {

        const settings =
            JSON.parse(
                savedData
            );


        return {

            ...defaultWeatherSettings,

            ...(settings.weather || {})

        };

    }
    catch (error) {

        console.error(
            "天気設定の読み込みに失敗しました。",
            error
        );


        return {
            ...defaultWeatherSettings
        };

    }
}


let weatherSettings =
    loadWeatherSettings();


let selectedWeatherLocation =
    weatherSettings.defaultLocation
    ||
    "current";


let selectedWeatherDay =
    localStorage.getItem(
        "selectedWeatherDay"
    )
    ||
    "today";

// =============================
// AI秘書用：現在表示中の天気データ
// =============================

let currentWeatherData = {
    temperature: null,
    weatherCode: null,
    rain: null
};
// =============================
// 天気コード → アイコン
// =============================

function getWeatherIconClass(code) {

    if (code === 0) {

        return "fa-sun";
    }


    if (
        code === 1
        ||
        code === 2
    ) {

        return "fa-cloud-sun";
    }


    if (code === 3) {

        return "fa-cloud";
    }


    if (
        code === 45
        ||
        code === 48
    ) {

        return "fa-smog";
    }


    if (
        code === 51
        ||
        code === 53
        ||
        code === 55
        ||
        code === 56
        ||
        code === 57
        ||
        code === 61
        ||
        code === 63
        ||
        code === 65
        ||
        code === 66
        ||
        code === 67
    ) {

        return "fa-cloud-rain";
    }


    if (
        code === 71
        ||
        code === 73
        ||
        code === 75
        ||
        code === 77
        ||
        code === 85
        ||
        code === 86
    ) {

        return "fa-snowflake";
    }


    if (
        code === 80
        ||
        code === 81
        ||
        code === 82
    ) {

        return "fa-cloud-showers-heavy";
    }


    if (
        code === 95
        ||
        code === 96
        ||
        code === 99
    ) {

        return "fa-cloud-bolt";
    }


    return "fa-cloud";
}


// =============================
// 天気ボタン状態
// =============================

function updateWeatherButtons() {

    weatherLocationButtons
        .forEach(
            function (button) {

                button.classList.toggle(

                    "is-active",

                    button.dataset
                        .weatherLocation
                    ===
                    selectedWeatherLocation

                );

            }
        );


    weatherDayButtons
        .forEach(
            function (button) {

                button.classList.toggle(

                    "is-active",

                    button.dataset
                        .weatherDay
                    ===
                    selectedWeatherDay

                );

            }
        );
}


// =============================
// 天気読み込み中
// =============================

function showWeatherLoading() {

    weatherTemperature.textContent =
        "--℃";


    weatherRain.textContent =
        "--%";


    weatherIcon.className =
        "fa-solid fa-spinner fa-spin";
}


// =============================
// 天気取得エラー
// =============================

function showWeatherError() {

    weatherTemperature.textContent =
        "--℃";


    weatherRain.textContent =
        "--%";


    weatherIcon.className =
        "fa-solid fa-circle-exclamation";
}


// =============================
// 天気API
// =============================

async function getWeatherFromAPI(
    latitude,
    longitude
) {

    showWeatherLoading();


    const url =
        "https://api.open-meteo.com/v1/forecast"
        + `?latitude=${latitude}`
        + `&longitude=${longitude}`
        + "&current=temperature_2m,weather_code"
        + "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
        + "&timezone=auto"
        + "&forecast_days=2";


    try {

        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "天気APIの取得に失敗しました"
            );
        }


        const data =
            await response.json();


        displayWeather(
            data
        );

    }
    catch (error) {

        console.error(
            "天気情報を取得できませんでした。",
            error
        );


        showWeatherError();
    }
}


// =============================
// 天気表示
// =============================

function displayWeather(data) {

    let temperature;

    let weatherCode;

    let rain;


    // 今日
    if (
        selectedWeatherDay ===
        "today"
    ) {

        temperature =
            Math.round(
                data.current
                    .temperature_2m
            );


        weatherCode =
            data.current
                .weather_code;


        rain =
            data.daily
                .precipitation_probability_max[0]
            ??
            0;
    }

    // 明日
    else {

        temperature =
            Math.round(
                data.daily
                    .temperature_2m_max[1]
            );


        weatherCode =
            data.daily
                .weather_code[1];


        rain =
            data.daily
                .precipitation_probability_max[1]
            ??
            0;
    }


    weatherTemperature.textContent =
        `${temperature}℃`;


    weatherRain.textContent =
        `${rain}%`;


    weatherIcon.className =
        `fa-solid ${getWeatherIconClass(weatherCode)}`;

    if (
        typeof updateMobileWeatherDisplay
        ===
        "function"
    ) {

        // AI秘書でも使えるように保存
        currentWeatherData = {
            temperature: temperature,
            weatherCode: weatherCode,
            rain: rain
        };

        // 天気取得後に秘書表示も更新
        renderSecretaryAssistant();
        updateMobileWeatherDisplay();
    }

}

// =============================
// 地域名 → 緯度経度
// =============================

async function geocodeLocation(
    location
) {

    const searchText =
        location.trim();


    if (!searchText) {

        throw new Error(
            "地域が設定されていません"
        );
    }


    const url =
        "https://msearch.gsi.go.jp/address-search/AddressSearch"
        + `?q=${encodeURIComponent(searchText)}`;


    const response =
        await fetch(
            url
        );


    if (!response.ok) {

        throw new Error(
            "住所検索に失敗しました"
        );
    }


    const data =
        await response.json();


    if (
        !Array.isArray(data)
        ||
        data.length === 0
    ) {

        throw new Error(
            "地域が見つかりません"
        );
    }


    return {

        longitude:
            data[0]
                .geometry
                .coordinates[0],

        latitude:
            data[0]
                .geometry
                .coordinates[1]

    };
}


// =============================
// 現在地の天気
// =============================

function getCurrentLocationWeather() {

    weatherSettings =
        loadWeatherSettings();


    if (
        !weatherSettings
            .useCurrentLocation
    ) {

        showWeatherError();


        showToast(
            "現在地の利用がOFFになっています"
        );


        return;
    }


    if (
        !navigator.geolocation
    ) {

        showWeatherError();

        return;
    }


    navigator.geolocation
        .getCurrentPosition(

            function (position) {

                getWeatherFromAPI(

                    position
                        .coords
                        .latitude,

                    position
                        .coords
                        .longitude

                );

            },

            function (error) {

                console.error(
                    "現在地を取得できませんでした。",
                    error
                );


                showWeatherError();
            }

        );
}


// =============================
// 自宅・職場の天気
// =============================

async function getSavedLocationWeather(
    location,
    label
) {

    if (!location) {

        showWeatherError();


        showToast(
            `${label}が設定されていません`
        );


        return;
    }


    try {

        const place =
            await geocodeLocation(
                location
            );


        await getWeatherFromAPI(

            place.latitude,

            place.longitude

        );

    }
    catch (error) {

        console.error(
            `${label}の天気を取得できませんでした。`,
            error
        );


        showWeatherError();
    }
}


// =============================
// 選択中の場所の天気
// =============================

function updateWeather() {

    weatherSettings =
        loadWeatherSettings();


    updateWeatherButtons();


    // 現在地
    if (
        selectedWeatherLocation ===
        "current"
    ) {

        getCurrentLocationWeather();

        return;
    }


    // 自宅
    if (
        selectedWeatherLocation ===
        "home"
    ) {

        getSavedLocationWeather(

            weatherSettings.home,

            "自宅"

        );


        return;
    }


    // 職場
    if (
        selectedWeatherLocation ===
        "work"
    ) {

        getSavedLocationWeather(

            weatherSettings.work,

            "職場"

        );

    }
}


// =============================
// 現在地・自宅・職場切替
// =============================

weatherLocationButtons
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedWeatherLocation =
                        this.dataset
                            .weatherLocation;


                    updateWeather();
                }
            );

        }
    );


// =============================
// 天気 今日・明日切替
// =============================

weatherDayButtons
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedWeatherDay =
                        this.dataset
                            .weatherDay;


                    localStorage.setItem(

                        "selectedWeatherDay",

                        selectedWeatherDay

                    );


                    updateWeather();
                }
            );

        }
    );


updateWeather();


// =============================
// スケジュール
// =============================

const SCHEDULE_STORAGE_KEY =
    "aiSecretarySchedules";


const scheduleList =
    document.getElementById(
        "scheduleList"
    );


const mainScheduleEmpty =
    document.getElementById(
        "mainScheduleEmpty"
    );


const mainScheduleEmptyText =
    document.getElementById(
        "mainScheduleEmptyText"
    );


const scheduleTabs =
    document.querySelectorAll(
        ".main-schedule-tab"
    );


const scheduleDetailButton =
    document.getElementById(
        "scheduleDetailButton"
    );


let selectedScheduleDay =
    "today";


// =============================
// スケジュール読み込み
// =============================

function loadSchedules() {

    const savedData =
        localStorage.getItem(
            SCHEDULE_STORAGE_KEY
        );


    if (!savedData) {

        return [];
    }


    try {

        const schedules =
            JSON.parse(
                savedData
            );


        return Array.isArray(
            schedules
        )
            ? schedules
            : [];

    }
    catch (error) {

        console.error(
            "予定の読み込みに失敗しました。",
            error
        );


        return [];
    }
}


// =============================
// 表示対象の日付
// =============================

function getScheduleTargetDate() {

    const targetDate =
        new Date();


    if (
        selectedScheduleDay ===
        "tomorrow"
    ) {

        targetDate.setDate(

            targetDate.getDate()
            +
            1

        );
    }


    return getLocalDateString(
        targetDate
    );
}


// =============================
// スケジュール表示
// =============================

function renderSchedules() {

    const targetDate =
        getScheduleTargetDate();


    const schedules =
        loadSchedules()

            .filter(
                function (schedule) {

                    return (
                        schedule.date
                        ===
                        targetDate
                    );

                }
            )

            .sort(
                function (a, b) {

                    return String(
                        a.startTime || ""
                    ).localeCompare(
                        String(
                            b.startTime || ""
                        )
                    );

                }
            );


    scheduleList.innerHTML =
        "";


    if (
        schedules.length ===
        0
    ) {

        mainScheduleEmpty.hidden =
            false;


        mainScheduleEmptyText.textContent =
            selectedScheduleDay ===
                "today"
                ? "今日は予定がありません"
                : "明日は予定がありません";


        return;
    }


    mainScheduleEmpty.hidden =
        true;


    // メインでは最大5件表示
    schedules
        .slice(
            0,
            5
        )
        .forEach(
            function (schedule) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "schedule-item";


                const time =
                    document.createElement(
                        "span"
                    );


                time.className =
                    "schedule-time";


                time.textContent =
                    schedule.startTime
                    ||
                    "--:--";


                const title =
                    document.createElement(
                        "p"
                    );


                title.className =
                    "schedule-name";


                title.textContent =
                    schedule.title
                    ||
                    "予定";


                item.appendChild(
                    time
                );


                item.appendChild(
                    title
                );


                scheduleList.appendChild(
                    item
                );

            }
        );


    // 5件を超えた場合は件数のみ表示
    if (
        schedules.length >
        5
    ) {

        const more =
            document.createElement(
                "p"
            );


        more.className =
            "main-schedule-more";


        more.textContent =
            `ほか ${schedules.length - 5}件`;


        scheduleList.appendChild(
            more
        );
    }
}


// =============================
// スケジュール 今日・明日
// =============================

scheduleTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                selectedScheduleDay =
                    this.dataset
                        .scheduleDay;


                scheduleTabs
                    .forEach(
                        function (item) {

                            item.classList.remove(
                                "is-active"
                            );

                        }
                    );


                this.classList.add(
                    "is-active"
                );


                renderSchedules();
            }
        );

    }
);


// =============================
// カレンダーへ移動
// =============================

scheduleDetailButton
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "calendar.html";
        }
    );


renderSchedules();


// =============================
// タスク
// =============================

const TASK_STORAGE_KEY =
    "aiSecretaryTasks";


const unfinishedTaskCount =
    document.getElementById(
        "unfinishedTaskCount"
    );


const todayTaskCount =
    document.getElementById(
        "todayTaskCount"
    );


const taskDetailButton =
    document.getElementById(
        "taskDetailButton"
    );


// =============================
// タスク読み込み
// =============================

function loadTasks() {

    const savedData =
        localStorage.getItem(
            TASK_STORAGE_KEY
        );


    if (!savedData) {

        return [];
    }


    try {

        const tasks =
            JSON.parse(
                savedData
            );


        return Array.isArray(
            tasks
        )
            ? tasks
            : [];

    }
    catch (error) {

        console.error(
            "タスクの読み込みに失敗しました。",
            error
        );


        return [];
    }
}


// =============================
// タスク件数表示
// =============================

function renderTaskCounts() {

    const tasks =
        loadTasks();


    const today =
        getLocalDateString(
            new Date()
        );


    // 未完了
    const unfinishedTasks =
        tasks.filter(
            function (task) {

                return (
                    !task.completed
                );

            }
        );


    // 今日が期限の未完了タスク
    const todayTasks =
        unfinishedTasks.filter(
            function (task) {

                return (
                    task.dueDate
                    ===
                    today
                );

            }
        );


    unfinishedTaskCount.textContent =
        `${unfinishedTasks.length}件`;


    todayTaskCount.textContent =
        `${todayTasks.length}件`;
}


// =============================
// タスク一覧へ移動
// =============================

taskDetailButton
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "task.html";
        }
    );


renderTaskCounts();
// =============================
// AI秘書
// 今日のブリーフィング・提案
// =============================

const briefingGreeting =
    document.getElementById(
        "briefingGreeting"
    );


const briefingText =
    document.getElementById(
        "briefingText"
    );


const suggestionList =
    document.getElementById(
        "suggestionList"
    );


const suggestionCount =
    document.getElementById(
        "suggestionCount"
    );


// =============================
// 今日の予定を取得
// =============================

function getTodaySchedules() {

    const today =
        getLocalDateString(
            new Date()
        );


    return loadSchedules()

        .filter(
            function (schedule) {

                return (
                    schedule.date
                    ===
                    today
                );

            }
        )

        .sort(
            function (a, b) {

                return String(
                    a.startTime || ""
                ).localeCompare(
                    String(
                        b.startTime || ""
                    )
                );

            }
        );
}


// =============================
// 今日のタスク情報を取得
// =============================

function getTodayTaskData() {

    const tasks =
        loadTasks();


    const today =
        getLocalDateString(
            new Date()
        );


    const unfinishedTasks =
        tasks.filter(
            function (task) {

                return !task.completed;

            }
        );


    const todayTasks =
        unfinishedTasks.filter(
            function (task) {

                return (
                    task.dueDate
                    ===
                    today
                );

            }
        );


    return {

        all: tasks,

        unfinished:
            unfinishedTasks,

        today:
            todayTasks

    };
}


// =============================
// 時間帯による挨拶
// =============================
function getSecretaryGreeting() {

    const hour =
        new Date().getHours();


    if (
        hour >= 4
        &&
        hour < 11
    ) {

        return "おはようございます。";

    }


    if (hour < 18) {

        return "こんにちは。";

    }


    return "こんばんは。";
}
// =============================
// ブリーフィング文章生成
// =============================

function createBriefingText() {

    const schedules =
        getTodaySchedules();


    const taskData =
        getTodayTaskData();


    const messages = [];


    // -----------------------------
    // 今日の予定
    // -----------------------------

    if (schedules.length === 0) {

        messages.push(
            "今日は予定がありません。"
        );

    }
    else {

        const firstSchedule =
            schedules[0];


        if (
            firstSchedule.startTime
            &&
            firstSchedule.title
        ) {

            messages.push(
                `今日は${firstSchedule.startTime}から「${firstSchedule.title}」があります。`
            );

        }
        else {

            messages.push(
                `今日は予定が${schedules.length}件あります。`
            );

        }


        if (schedules.length >= 2) {

            messages.push(
                `全部で${schedules.length}件の予定が入っています。`
            );

        }

    }


    // -----------------------------
    // 今日までのタスク
    // -----------------------------

    if (taskData.today.length > 0) {

        messages.push(
            `今日までのタスクが${taskData.today.length}件あります。`
        );

    }
    else if (
        taskData.unfinished.length > 0
    ) {

        messages.push(
            `未完了のタスクは${taskData.unfinished.length}件です。`
        );

    }
    else {

        messages.push(
            "未完了のタスクはありません。"
        );

    }


    // -----------------------------
    // 天気
    // -----------------------------

    if (
        currentWeatherData.rain !== null
        &&
        currentWeatherData.rain >= 50
    ) {

        messages.push(
            `降水確率は${currentWeatherData.rain}%なので、傘があると安心です。`
        );

    }


    return messages.join(
        " "
    );
}


// =============================
// 秘書からの提案を生成
// =============================

function createSecretarySuggestions() {

    const schedules =
        getTodaySchedules();


    const taskData =
        getTodayTaskData();


    const suggestions = [];


    // -----------------------------
    // 雨
    // -----------------------------

    if (
        currentWeatherData.rain !== null
        &&
        currentWeatherData.rain >= 50
    ) {

        suggestions.push({

            icon:
                "fa-umbrella",

            title:
                "傘を持って出かけると安心です",

            text:
                `今日の降水確率は${currentWeatherData.rain}%です。`

        });

    }


    // -----------------------------
    // 今日までのタスク
    // -----------------------------

    if (
        taskData.today.length > 0
    ) {

        suggestions.push({

            icon:
                "fa-circle-check",

            title:
                `今日までのタスクが${taskData.today.length}件あります`,

            text:
                "空いている時間に確認してみましょう。"

        });

    }


    // -----------------------------
    // 予定が多い
    // -----------------------------

    if (
        schedules.length >= 4
    ) {

        suggestions.push({

            icon:
                "fa-mug-hot",

            title:
                "今日は予定が多めです",

            text:
                "予定の間に少し休憩を入れるのがおすすめです。"

        });

    }


    // -----------------------------
    // 未完了タスクが多い
    // -----------------------------

    if (
        taskData.unfinished.length >= 5
    ) {

        suggestions.push({

            icon:
                "fa-list-check",

            title:
                "タスクを少し整理しませんか？",

            text:
                `未完了のタスクが${taskData.unfinished.length}件あります。`

        });

    }


    // -----------------------------
    // 特に提案がない
    // -----------------------------

    if (
        suggestions.length === 0
    ) {

        suggestions.push({

            icon:
                "fa-face-smile",

            title:
                "今日は大きな注意事項はありません",

            text:
                "自分のペースで進めていきましょう。"

        });

    }


    // 最大3件
    return suggestions.slice(
        0,
        3
    );
}


// =============================
// 提案を画面に表示
// =============================

function renderSecretarySuggestions() {

    if (
        !suggestionList
        ||
        !suggestionCount
    ) {

        return;
    }


    const suggestions =
        createSecretarySuggestions();


    suggestionList.innerHTML =
        "";


    suggestionCount.textContent =
        `${suggestions.length}件`;


    suggestions.forEach(
        function (suggestion) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "suggestion-item";


            const icon =
                document.createElement(
                    "span"
                );


            icon.className =
                "suggestion-item-icon";


            icon.innerHTML =
                `<i class="fa-solid ${suggestion.icon}"></i>`;


            const textArea =
                document.createElement(
                    "div"
                );


            textArea.className =
                "suggestion-item-text";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                suggestion.title;


            const description =
                document.createElement(
                    "p"
                );


            description.textContent =
                suggestion.text;


            textArea.appendChild(
                title
            );


            textArea.appendChild(
                description
            );


            item.appendChild(
                icon
            );


            item.appendChild(
                textArea
            );


            suggestionList.appendChild(
                item
            );

        }
    );
}

// =============================
// スマホ用 秘書からの提案モーダル
// =============================

const secretarySuggestions =
    document.getElementById(
        "secretarySuggestions"
    );

const suggestionModal =
    document.getElementById(
        "suggestionModal"
    );

const suggestionModalOverlay =
    document.getElementById(
        "suggestionModalOverlay"
    );

const suggestionModalClose =
    document.getElementById(
        "suggestionModalClose"
    );

const suggestionModalList =
    document.getElementById(
        "suggestionModalList"
    );


function openSuggestionModal() {

    if (
        window.innerWidth > 550
        ||
        !suggestionModal
        ||
        !suggestionModalList
    ) {
        return;
    }


    const suggestions =
        createSecretarySuggestions();


    suggestionModalList.innerHTML =
        "";


    suggestions.forEach(
        function (suggestion) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "suggestion-item";


            item.innerHTML = `
                <span class="suggestion-item-icon">
                    <i class="fa-solid ${suggestion.icon}"></i>
                </span>

                <div class="suggestion-item-text">
                    <strong>${suggestion.title}</strong>
                    <p>${suggestion.text}</p>
                </div>
            `;


            suggestionModalList.appendChild(
                item
            );
        }
    );


    suggestionModal.hidden =
        false;
}


function closeSuggestionModal() {

    if (!suggestionModal) {
        return;
    }


    suggestionModal.hidden =
        true;
}


if (secretarySuggestions) {

    secretarySuggestions.addEventListener(
        "click",
        openSuggestionModal
    );
}


if (suggestionModalClose) {

    suggestionModalClose.addEventListener(
        "click",
        closeSuggestionModal
    );
}


if (suggestionModalOverlay) {

    suggestionModalOverlay.addEventListener(
        "click",
        closeSuggestionModal
    );
}
// =============================
// AI秘書全体を更新
// =============================

function renderSecretaryAssistant() {

    if (
        briefingGreeting
    ) {

        briefingGreeting.textContent =
            getSecretaryGreeting();

    }


    if (
        briefingText
    ) {

        briefingText.textContent =
            createBriefingText();

    }


    renderSecretarySuggestions();
}


// 初回表示
renderSecretaryAssistant();

// =============================
// 週間レポート
// =============================

const weeklyReportButton =
    document.getElementById(
        "weeklyReportButton"
    );

const weeklyReportModal =
    document.getElementById(
        "weeklyReportModal"
    );

const weeklyReportOverlay =
    document.getElementById(
        "weeklyReportOverlay"
    );

const weeklyReportClose =
    document.getElementById(
        "weeklyReportClose"
    );

const weeklyReportPeriod =
    document.getElementById(
        "weeklyReportPeriod"
    );

const weeklyCompletedTasks =
    document.getElementById(
        "weeklyCompletedTasks"
    );

const weeklySchedules =
    document.getElementById(
        "weeklySchedules"
    );

const weeklyDiaryDays =
    document.getElementById(
        "weeklyDiaryDays"
    );

const weeklyTopMood =
    document.getElementById(
        "weeklyTopMood"
    );

const weeklyChart =
    document.getElementById(
        "weeklyChart"
    );

const weeklyStreakText =
    document.getElementById(
        "weeklyStreakText"
    );

const weeklyComment =
    document.getElementById(
        "weeklyComment"
    );


const DIARY_STORAGE_KEY =
    "aiSecretaryDiary";


// =============================
// 今週の月曜日〜日曜日を取得
// =============================

function getCurrentWeekRange() {

    const now =
        new Date();

    const day =
        now.getDay() === 0
            ? 7
            : now.getDay();


    const monday =
        new Date(now);

    monday.setHours(
        0,
        0,
        0,
        0
    );

    monday.setDate(
        now.getDate() - day + 1
    );


    const sunday =
        new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    sunday.setHours(
        23,
        59,
        59,
        999
    );


    return {
        monday,
        sunday
    };
}


// =============================
// YYYY-MM-DD → Date
// =============================

function parseDateString(dateString) {

    if (!dateString) {
        return null;
    }


    const parts =
        String(dateString)
            .slice(0, 10)
            .split("-");


    if (parts.length !== 3) {
        return null;
    }


    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }


    return date;
}


// =============================
// 今週の日付か判定
// =============================

function isDateInCurrentWeek(
    dateString,
    weekRange
) {

    const date =
        parseDateString(
            dateString
        );


    if (!date) {
        return false;
    }


    return (
        date >= weekRange.monday
        &&
        date <= weekRange.sunday
    );
}


// =============================
// 日記読み込み
// =============================

function loadDiaryData() {

    const savedData =
        localStorage.getItem(
            DIARY_STORAGE_KEY
        );


    if (!savedData) {
        return [];
    }


    try {

        return JSON.parse(
            savedData
        );

    }
    catch (error) {

        console.error(
            "日記データの読み込みに失敗しました。",
            error
        );

        return [];
    }
}


// =============================
// 日記データを配列に変換
// =============================

function normalizeDiaryEntries() {

    const rawData =
        loadDiaryData();


    const entries = [];


    // 普通の配列の場合
    if (
        Array.isArray(rawData)
    ) {

        rawData.forEach(
            function (item) {

                if (
                    item
                    &&
                    typeof item ===
                    "object"
                ) {

                    entries.push(
                        item
                    );
                }

            }
        );


        return entries;
    }


    // 日付をキーにして保存している場合
    if (
        rawData
        &&
        typeof rawData ===
        "object"
    ) {

        Object.entries(
            rawData
        ).forEach(
            function (
                [key, value]
            ) {

                if (
                    /^\d{4}-\d{2}-\d{2}$/
                        .test(key)
                ) {

                    if (
                        value
                        &&
                        typeof value ===
                        "object"
                    ) {

                        entries.push({
                            ...value,
                            date:
                                value.date
                                ||
                                key
                        });

                    }

                }

            }
        );

    }


    return entries;
}


// =============================
// 日記の日付を取得
// =============================

function getDiaryDate(entry) {

    return (
        entry.date
        ||
        entry.diaryDate
        ||
        entry.recordDate
        ||
        entry.createdDate
        ||
        ""
    );
}


// =============================
// 日記の気持ちを取得
// =============================

function getDiaryMood(entry) {

    return (
        entry.mood
        ||
        entry.emotion
        ||
        entry.feeling
        ||
        entry.feelingName
        ||
        ""
    );
}


// =============================
// タスクの活動日を取得
// =============================

function getTaskActivityDate(task) {

    return (
        task.completedDate
        ||
        task.completedAt
        ||
        task.doneDate
        ||
        task.updatedAt
        ||
        task.dueDate
        ||
        ""
    );
}


// =============================
// 曜日表示
// =============================

function getWeekdayLabel(date) {

    const labels = [
        "日",
        "月",
        "火",
        "水",
        "木",
        "金",
        "土"
    ];


    return labels[
        date.getDay()
    ];
}


// =============================
// 今週のレポートデータ作成
// =============================

function createWeeklyReportData() {

    const weekRange =
        getCurrentWeekRange();


    const tasks =
        loadTasks();


    const schedules =
        loadSchedules();


    const diaryEntries =
        normalizeDiaryEntries();


    // -------------------------
    // 今週完了したタスク
    // -------------------------

    const completedTasks =
        tasks.filter(
            function (task) {

                if (!task.completed) {
                    return false;
                }


                return isDateInCurrentWeek(
                    getTaskActivityDate(task),
                    weekRange
                );

            }
        );


    // -------------------------
    // 今週の予定
    // -------------------------

    const weekSchedules =
        schedules.filter(
            function (schedule) {

                return isDateInCurrentWeek(
                    schedule.date,
                    weekRange
                );

            }
        );


    // -------------------------
    // 今週の日記
    // -------------------------

    const weekDiaryEntries =
        diaryEntries.filter(
            function (entry) {

                return isDateInCurrentWeek(
                    getDiaryDate(entry),
                    weekRange
                );

            }
        );


    // 日記を記録した日数
    const diaryDateSet =
        new Set(
            weekDiaryEntries.map(
                function (entry) {

                    return getDiaryDate(
                        entry
                    );

                }
            )
        );


    // -------------------------
    // 一番多かった気持ち
    // -------------------------

    const moodCounts = {};


    weekDiaryEntries.forEach(
        function (entry) {

            const mood =
                getDiaryMood(
                    entry
                );


            if (!mood) {
                return;
            }


            moodCounts[mood] =
                (
                    moodCounts[mood]
                    ||
                    0
                )
                +
                1;

        }
    );


    let topMood =
        "記録なし";


    let topMoodCount =
        0;


    Object.entries(
        moodCounts
    ).forEach(
        function (
            [mood, count]
        ) {

            if (
                count >
                topMoodCount
            ) {

                topMood =
                    mood;

                topMoodCount =
                    count;

            }

        }
    );


    return {

        weekRange,

        completedTasks,

        schedules:
            weekSchedules,

        diaryEntries:
            weekDiaryEntries,

        diaryDays:
            diaryDateSet.size,

        topMood

    };
}


// =============================
// 週間グラフ
// =============================

function renderWeeklyChart(
    reportData
) {

    if (!weeklyChart) {
        return;
    }


    weeklyChart.innerHTML =
        "";


    const days = [];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(
                reportData
                    .weekRange
                    .monday
            );


        date.setDate(
            date.getDate() + i
        );


        const dateString =
            getLocalDateString(
                date
            );


        const taskCount =
            reportData
                .completedTasks
                .filter(
                    function (task) {

                        return (
                            String(
                                getTaskActivityDate(
                                    task
                                )
                            ).slice(
                                0,
                                10
                            )
                            ===
                            dateString
                        );

                    }
                ).length;


        const scheduleCount =
            reportData
                .schedules
                .filter(
                    function (schedule) {

                        return (
                            schedule.date
                            ===
                            dateString
                        );

                    }
                ).length;


        const diaryCount =
            reportData
                .diaryEntries
                .filter(
                    function (entry) {

                        return (
                            getDiaryDate(
                                entry
                            )
                            ===
                            dateString
                        );

                    }
                ).length;


        days.push({
            date,
            taskCount,
            scheduleCount,
            diaryCount
        });

    }


    const maxValue =
        Math.max(
            1,
            ...days.map(
                function (day) {

                    return (
                        day.taskCount
                        +
                        day.scheduleCount
                        +
                        day.diaryCount
                    );

                }
            )
        );


    days.forEach(
        function (day) {

            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "weekly-chart-day";


            const bars =
                document.createElement(
                    "div"
                );


            bars.className =
                "weekly-chart-bars";


            const values = [
                {
                    type:
                        "task",
                    value:
                        day.taskCount
                },
                {
                    type:
                        "schedule",
                    value:
                        day.scheduleCount
                },
                {
                    type:
                        "diary",
                    value:
                        day.diaryCount
                }
            ];


            values.forEach(
                function (item) {

                    const bar =
                        document.createElement(
                            "span"
                        );


                    bar.className =
                        `weekly-chart-bar ${item.type}`;


                    const height =
                        item.value === 0
                            ? 4
                            : Math.max(
                                12,
                                (
                                    item.value
                                    /
                                    maxValue
                                )
                                *
                                100
                            );


                    bar.style.height =
                        `${height}%`;


                    bar.title =
                        `${item.value}件`;


                    bars.appendChild(
                        bar
                    );

                }
            );


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "weekly-chart-day-label";


            label.textContent =
                getWeekdayLabel(
                    day.date
                );


            column.appendChild(
                bars
            );


            column.appendChild(
                label
            );


            weeklyChart.appendChild(
                column
            );

        }
    );
}


// =============================
// 日記の連続記録
// =============================

function getDiaryStreak(
    diaryEntries
) {

    const dateSet =
        new Set(
            diaryEntries.map(
                function (entry) {

                    return getDiaryDate(
                        entry
                    );

                }
            )
        );


    if (
        dateSet.size === 0
    ) {

        return 0;
    }


    let streak = 0;


    const date =
        new Date();


    while (true) {

        const dateString =
            getLocalDateString(
                date
            );


        if (
            !dateSet.has(
                dateString
            )
        ) {
            break;
        }


        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;
}


// =============================
// 秘書コメント生成
// =============================

function createWeeklyComment(
    reportData
) {

    const parts = [];


    if (
        reportData
            .completedTasks
            .length >= 5
    ) {

        parts.push(
            "今週はタスクをたくさん完了できましたね。"
        );

    }
    else if (
        reportData
            .completedTasks
            .length > 0
    ) {

        parts.push(
            "今週もタスクを着実に進められています。"
        );

    }
    else {

        parts.push(
            "今週はまだ完了したタスクの記録がありません。"
        );

    }


    if (
        reportData
            .schedules
            .length >= 5
    ) {

        parts.push(
            "予定も多めだったので、週末はゆっくり休む時間を作るのもおすすめです。"
        );

    }


    if (
        reportData.diaryDays >= 3
    ) {

        parts.push(
            `日記は${reportData.diaryDays}日記録できました。`
        );

    }


    if (
        reportData.topMood !==
        "記録なし"
    ) {

        parts.push(
            `今週は「${reportData.topMood}」と感じる日が多かったようです。`
        );

    }


    return parts.join(
        " "
    );
}


// =============================
// 週間レポート表示
// =============================

function renderWeeklyReport() {

    const reportData =
        createWeeklyReportData();


    const monday =
        reportData
            .weekRange
            .monday;


    const sunday =
        reportData
            .weekRange
            .sunday;


    if (weeklyReportPeriod) {

        weeklyReportPeriod.textContent =
            `${monday.getMonth() + 1}/${monday.getDate()}（${getWeekdayLabel(monday)}）`
            +
            " ～ "
            +
            `${sunday.getMonth() + 1}/${sunday.getDate()}（${getWeekdayLabel(sunday)}）`;

    }


    if (weeklyCompletedTasks) {

        weeklyCompletedTasks.textContent =
            `${reportData.completedTasks.length}件`;

    }


    if (weeklySchedules) {

        weeklySchedules.textContent =
            `${reportData.schedules.length}件`;

    }


    if (weeklyDiaryDays) {

        weeklyDiaryDays.textContent =
            `${reportData.diaryDays}日`;

    }


    if (weeklyTopMood) {

        weeklyTopMood.textContent =
            reportData.topMood;

    }


    const streak =
        getDiaryStreak(
            normalizeDiaryEntries()
        );


    if (weeklyStreakText) {

        if (streak > 0) {

            weeklyStreakText.textContent =
                `${streak}日連続で記録しています`;

        }
        else {

            weeklyStreakText.textContent =
                "まだ連続記録はありません";

        }

    }


    if (weeklyComment) {

        weeklyComment.textContent =
            createWeeklyComment(
                reportData
            );

    }


    renderWeeklyChart(
        reportData
    );
}


// =============================
// モーダルを開く
// =============================

function openWeeklyReport() {

    if (!weeklyReportModal) {
        return;
    }


    renderWeeklyReport();


    weeklyReportModal.hidden =
        false;


    document.body.classList.add(
        "weekly-report-open"
    );
}


// =============================
// モーダルを閉じる
// =============================

function closeWeeklyReport() {

    if (!weeklyReportModal) {
        return;
    }


    weeklyReportModal.hidden =
        true;


    document.body.classList.remove(
        "weekly-report-open"
    );
}


// =============================
// 週間レポートイベント
// =============================

if (weeklyReportButton) {

    weeklyReportButton
        .addEventListener(
            "click",
            openWeeklyReport
        );

}


if (weeklyReportClose) {

    weeklyReportClose
        .addEventListener(
            "click",
            closeWeeklyReport
        );

}


if (weeklyReportOverlay) {

    weeklyReportOverlay
        .addEventListener(
            "click",
            closeWeeklyReport
        );

}


// Escキーでも閉じる
document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
            &&
            weeklyReportModal
            &&
            !weeklyReportModal.hidden
        ) {

            closeWeeklyReport();

        }

    }
);
// =============================
// ナビゲーション
// =============================

const navigationButtons =
    document.querySelectorAll(
        ".nav-item[data-page], .more-menu-item[data-page]"
    );


navigationButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const page =
                    this.dataset.page;


                // ホーム
                if (page === "home") {
                    return;
                }


                // タスク
                if (page === "task") {

                    window.location.href =
                        "task.html";

                    return;
                }


                // カレンダー
                if (page === "calendar") {

                    window.location.href =
                        "calendar.html";

                    return;
                }


                // 日記
                if (page === "diary") {

                    window.location.href =
                        "diary.html";

                    return;
                }
            }
        );

    }
);
// =============================
// お知らせ
// =============================

const notificationButton =
    document.getElementById(
        "notificationButton"
    );


notificationButton
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "news.html";
        }
    );


// =============================
// お知らせ未読マーク
// =============================

const notificationDot =
    document.querySelector(
        ".notification-dot"
    );


function updateNotificationDot() {

    const unreadCount =
        localStorage.getItem(
            "aiSecretaryUnreadCount"
        );


    const hasUnread =
        unreadCount === null
        ||
        Number(
            unreadCount
        ) > 0;


    notificationDot.hidden =
        !hasUnread;
}


updateNotificationDot();


// =============================
// 設定
// =============================

const settingsButton =
    document.getElementById(
        "settingsButton"
    );


settingsButton
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "settings.html";
        }
    );

// =============================
// AI秘書機能（準備中）
// =============================

// 音声登録
const registerModeButton =
    document.getElementById(
        "registerModeButton"
    );

// 音声会話
const conversationModeButton =
    document.getElementById(
        "conversationModeButton"
    );

// チャット
const helpButton =
    document.getElementById(
        "helpButton"
    );

[
    helpButton,
    registerModeButton,
    conversationModeButton
].forEach(
    function (button) {

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            function () {

                showToast(
                    "現在準備中です"
                );

            }
        );
    }
);
// =============================
// 他ページから戻った時
// 最新情報に更新
// =============================

window.addEventListener(
    "pageshow",
    function () {

        renderSchedules();

        renderTaskCounts();

        updateNotificationDot();

        updateWeather();

        renderSecretaryAssistant();

    }
);
// =============================
// スマホ用 天気ポップアップ
// =============================

const mobileWeatherButton =
    document.getElementById(
        "mobileWeatherButton"
    );


const mobileWeatherPopup =
    document.getElementById(
        "mobileWeatherPopup"
    );


const mobileWeatherOverlay =
    document.getElementById(
        "mobileWeatherOverlay"
    );


const mobileWeatherClose =
    document.getElementById(
        "mobileWeatherClose"
    );


const mobileWeatherTemperature =
    document.getElementById(
        "mobileWeatherTemperature"
    );


const mobileWeatherRain =
    document.getElementById(
        "mobileWeatherRain"
    );


const mobileWeatherIcon =
    document.querySelector(
        "#mobileWeatherIcon i"
    );


const mobileWeatherLocationButtons =
    document.querySelectorAll(
        ".mobile-weather-location-button"
    );


const mobileWeatherDayButtons =
    document.querySelectorAll(
        ".mobile-weather-day-button"
    );


// =============================
// ポップアップを開く
// =============================

function openMobileWeather() {

    mobileWeatherPopup.hidden =
        false;


    updateMobileWeatherButtons();


    updateWeather();
}


// =============================
// ポップアップを閉じる
// =============================

function closeMobileWeather() {

    mobileWeatherPopup.hidden =
        true;
}


// =============================
// スマホ側ボタン状態
// =============================

function updateMobileWeatherButtons() {

    mobileWeatherLocationButtons
        .forEach(
            function (button) {

                button.classList.toggle(

                    "is-active",

                    button.dataset
                        .mobileWeatherLocation
                    ===
                    selectedWeatherLocation

                );

            }
        );


    mobileWeatherDayButtons
        .forEach(
            function (button) {

                button.classList.toggle(

                    "is-active",

                    button.dataset
                        .mobileWeatherDay
                    ===
                    selectedWeatherDay

                );

            }
        );
}


// =============================
// スマホ天気表示を更新
// PC側に表示された内容を利用
// =============================

function updateMobileWeatherDisplay() {

    if (
        !mobileWeatherTemperature
        ||
        !mobileWeatherRain
        ||
        !mobileWeatherIcon
    ) {
        return;
    }


    mobileWeatherTemperature.textContent =
        weatherTemperature.textContent;


    mobileWeatherRain.textContent =
        `降水確率 ${weatherRain.textContent}`;


    mobileWeatherIcon.className =
        weatherIcon.className;
}


// =============================
// 天気ボタン
// =============================

mobileWeatherButton
    .addEventListener(
        "click",
        openMobileWeather
    );


mobileWeatherClose
    .addEventListener(
        "click",
        closeMobileWeather
    );


mobileWeatherOverlay
    .addEventListener(
        "click",
        closeMobileWeather
    );


// =============================
// 場所切り替え
// =============================

mobileWeatherLocationButtons
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedWeatherLocation =
                        this.dataset
                            .mobileWeatherLocation;


                    updateWeather();


                    updateMobileWeatherButtons();
                }
            );

        }
    );


// =============================
// 今日・明日切り替え
// =============================

mobileWeatherDayButtons
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedWeatherDay =
                        this.dataset
                            .mobileWeatherDay;


                    localStorage.setItem(

                        "selectedWeatherDay",

                        selectedWeatherDay

                    );


                    updateWeather();


                    updateMobileWeatherButtons();
                }
            );

        }
    );
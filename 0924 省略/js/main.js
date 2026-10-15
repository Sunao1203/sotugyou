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
// もっと見る
// =============================

const moreMenuButton =
    document.getElementById(
        "moreMenuButton"
    );


const moreMenu =
    document.getElementById(
        "moreMenu"
    );


function closeMoreMenu() {

    if (
        !moreMenu
        ||
        !moreMenuButton
    ) {
        return;
    }


    moreMenu.hidden = true;


    moreMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );
}


if (
    moreMenuButton
    &&
    moreMenu
) {

    moreMenuButton.addEventListener(
        "click",
        function () {

            const willOpen =
                moreMenu.hidden;


            moreMenu.hidden =
                !willOpen;


            moreMenuButton.setAttribute(
                "aria-expanded",
                String(willOpen)
            );

        }
    );

}


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


                // 天気
                if (page === "weather") {

                    showToast(
                        "天気画面は現在準備中です"
                    );

                    return;
                }


                // 日記
                if (page === "diary") {

                    closeMoreMenu();


                    showToast(
                        "日記画面は現在準備中です"
                    );

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
// 登録モード
// =============================

const registerModeButton =
    document.getElementById(
        "registerModeButton"
    );


registerModeButton
    .addEventListener(
        "click",
        function () {

            showToast(
                "登録モードを起動します"
            );

        }
    );


// =============================
// 会話モード
// =============================

const conversationModeButton =
    document.getElementById(
        "conversationModeButton"
    );


conversationModeButton
    .addEventListener(
        "click",
        function () {

            showToast(
                "会話モードを起動します"
            );

        }
    );


// =============================
// AI秘書 会話開始
// =============================

const helpButton =
    document.getElementById(
        "helpButton"
    );


helpButton
    .addEventListener(
        "click",
        function () {

            showToast(
                "AI秘書との会話機能は現在準備中です"
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

    }
);
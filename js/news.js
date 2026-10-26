// =============================
// localStorageキー
// =============================

const SETTINGS_KEY =
    "aiSecretarySettings";

const READ_STATE_KEY =
    "aiSecretaryNewsReadState";

const UNREAD_COUNT_KEY =
    "aiSecretaryUnreadCount";

const SCHEDULE_STORAGE_KEY =
    "aiSecretarySchedules";


// =============================
// 鉄道API
// =============================

const TRAIN_API_ENABLED =
    false;

const ODPT_API_KEY =
    "";


// =============================
// 状態
// =============================

let notifications = [];

let currentFilter =
    "all";

let notificationSettings =
    loadNotificationSettings();


// =============================
// 通知設定
// =============================

function loadNotificationSettings() {

    const defaultSettings = {

        weatherAlert: true,

        heatAlert: true,

        rain: true,

        trainDelay: true,

        trainStop: true,

        schedule: true

    };


    const savedData =
        localStorage.getItem(
            SETTINGS_KEY
        );


    if (!savedData) {

        return defaultSettings;

    }


    try {

        const settings =
            JSON.parse(
                savedData
            );


        return {

            ...defaultSettings,

            ...(settings.notifications || {})

        };

    } catch (error) {

        console.error(
            "通知設定の読み込みに失敗しました。",
            error
        );


        return defaultSettings;

    }

}


// =============================
// 日付
// =============================

function formatLocalDate(date) {

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


function addDays(
    date,
    days
) {

    const result =
        new Date(date);


    result.setDate(
        result.getDate() + days
    );


    return result;

}


// =============================
// カレンダーの予定を読み込む
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

    } catch (error) {

        console.error(
            "予定データの読み込みに失敗しました。",
            error
        );


        return [];

    }

}


// =============================
// カレンダー予定 → 通知
// =============================

function createScheduleNotifications() {

    if (
        notificationSettings.schedule ===
        false
    ) {

        return;

    }


    const schedules =
        loadSchedules();


    const today =
        new Date();


    const tomorrow =
        addDays(
            today,
            1
        );


    const todayString =
        formatLocalDate(
            today
        );


    const tomorrowString =
        formatLocalDate(
            tomorrow
        );


    const targetSchedules =
        schedules

            .filter(
                schedule =>

                    schedule.date ===
                        todayString

                    ||

                    schedule.date ===
                        tomorrowString
            )

            .sort(
                (a, b) => {

                    if (
                        a.date !==
                        b.date
                    ) {

                        return String(
                            a.date
                        ).localeCompare(
                            String(
                                b.date
                            )
                        );

                    }


                    return String(
                        a.startTime || ""
                    ).localeCompare(
                        String(
                            b.startTime || ""
                        )
                    );

                }
            );


    targetSchedules.forEach(
        schedule => {

            const isToday =
                schedule.date ===
                todayString;


            const dayLabel =
                isToday
                    ? "今日"
                    : "明日";


            let timeText =
                schedule.startTime || "";


            if (
                schedule.endTime
            ) {

                timeText +=
                    `〜${schedule.endTime}`;

            }


            let message =
                `${dayLabel} ${timeText}`;


            if (
                schedule.location
            ) {

                message +=
                    `・${schedule.location}`;

            }


            if (
                schedule.memo
            ) {

                message +=
                    `　${schedule.memo}`;

            }


            notifications.push({

                id:
                    `schedule-${schedule.id}-${schedule.date}-${schedule.startTime}`,

                category:
                    "schedule",

                title:
                    schedule.title ||
                    "予定",

                message,

                time:
                    `${dayLabel} ${schedule.startTime || ""}`,

                read:
                    false,

                settingKey:
                    "schedule"

            });

        }
    );

}


// =============================
// 現在地取得
// =============================

function getNewsCurrentPosition() {

    return new Promise(
        (resolve, reject) => {

            if (
                !navigator.geolocation
            ) {

                reject(
                    new Error(
                        "位置情報を利用できません"
                    )
                );


                return;

            }


            navigator.geolocation
                .getCurrentPosition(
                    resolve,
                    reject
                );

        }
    );

}


// =============================
// 住所 → 緯度経度
// =============================

async function geocodeNewsLocation(
    location
) {

    const url =
        "https://msearch.gsi.go.jp/address-search/AddressSearch"
        + `?q=${encodeURIComponent(location)}`;


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
            "登録地域が見つかりません"
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
// 天気通知
// =============================

async function createWeatherNotifications() {

    const savedData =
        localStorage.getItem(
            SETTINGS_KEY
        );


    let settings =
        {};


    if (savedData) {

        try {

            settings =
                JSON.parse(
                    savedData
                );

        } catch (error) {

            console.error(
                "設定データを読み込めませんでした。",
                error
            );

        }

    }


    const weatherSettings =
        settings.weather ||
        {};


    const defaultLocation =
        weatherSettings.defaultLocation ||
        "current";


    try {

        let latitude;

        let longitude;

        let locationName;


        // =============================
        // 現在地
        // =============================

        if (
            defaultLocation ===
            "current"
        ) {

            if (
                weatherSettings.useCurrentLocation ===
                false
            ) {

                return;

            }


            const position =
                await getNewsCurrentPosition();


            latitude =
                position.coords.latitude;

            longitude =
                position.coords.longitude;

            locationName =
                "現在地";

        }


        // =============================
        // 自宅
        // =============================

        else if (
            defaultLocation ===
            "home"
        ) {

            if (
                !weatherSettings.home
            ) {

                return;

            }


            const place =
                await geocodeNewsLocation(
                    weatherSettings.home
                );


            latitude =
                place.latitude;

            longitude =
                place.longitude;

            locationName =
                "自宅";

        }


        // =============================
        // 職場
        // =============================

        else if (
            defaultLocation ===
            "work"
        ) {

            if (
                !weatherSettings.work
            ) {

                return;

            }


            const place =
                await geocodeNewsLocation(
                    weatherSettings.work
                );


            latitude =
                place.latitude;

            longitude =
                place.longitude;

            locationName =
                "職場";

        }


        if (
            latitude === undefined
            ||
            longitude === undefined
        ) {

            return;

        }


        // =============================
        // Open-Meteo
        // =============================

        const url =
            "https://api.open-meteo.com/v1/forecast"
            + `?latitude=${latitude}`
            + `&longitude=${longitude}`
            + "&daily=precipitation_probability_max,temperature_2m_max,temperature_2m_min"
            + "&timezone=auto"
            + "&forecast_days=1";


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "天気情報の取得に失敗しました"
            );

        }


        const data =
            await response.json();


        const rain =
            data.daily
                .precipitation_probability_max[0]
            ?? 0;


        const maxTemperature =
            Math.round(
                data.daily
                    .temperature_2m_max[0]
            );


        const minTemperature =
            Math.round(
                data.daily
                    .temperature_2m_min[0]
            );


        const todayString =
            formatLocalDate(
                new Date()
            );


        // =============================
        // 雨
        // =============================

        if (
            notificationSettings.rain !==
                false
            &&
            rain >= 50
        ) {

            notifications.unshift({

                id:
                    `rain-${todayString}`,

                category:
                    "weather",

                title:
                    "雨のお知らせ",

                message:
                    `${locationName}の今日の降水確率は${rain}%です。傘を持っていくのがおすすめです。`,

                time:
                    "今日",

                read:
                    false,

                settingKey:
                    "rain"

            });

        }


        // =============================
        // 暑さ
        // =============================

        if (
            notificationSettings.heatAlert !==
                false
            &&
            maxTemperature >= 30
        ) {

            let message =
                `${locationName}の最高気温は${maxTemperature}℃の予報です。こまめに水分補給してください。`;


            if (
                maxTemperature >= 35
            ) {

                message =
                    `${locationName}の最高気温は${maxTemperature}℃です。厳しい暑さが予想されるため、熱中症に注意してください。`;

            }


            notifications.unshift({

                id:
                    `heat-${todayString}`,

                category:
                    "weather",

                title:
                    "暑さのお知らせ",

                message,

                time:
                    "今日",

                read:
                    false,

                settingKey:
                    "heatAlert"

            });

        }


        // =============================
        // 寒さ
        // =============================

        if (
            notificationSettings.weatherAlert !==
                false
            &&
            minTemperature <= 5
        ) {

            notifications.unshift({

                id:
                    `cold-${todayString}`,

                category:
                    "weather",

                title:
                    "寒さのお知らせ",

                message:
                    `${locationName}の最低気温は${minTemperature}℃の予報です。暖かい服装でお出かけください。`,

                time:
                    "今日",

                read:
                    false,

                settingKey:
                    "weatherAlert"

            });

        }

    } catch (error) {

        console.error(
            "天気通知を作成できませんでした。",
            error
        );

    }

}


// =============================
// 鉄道API
// =============================

async function getTrainStatusFromAPI(
    trainLine
) {

    if (
        !ODPT_API_KEY
    ) {

        throw new Error(
            "ODPT APIキーが設定されていません"
        );

    }


    console.log(
        "取得する路線：",
        trainLine
    );


    return "normal";

}


// =============================
// 交通通知
// =============================

async function createTrainNotification() {

    const savedData =
        localStorage.getItem(
            SETTINGS_KEY
        );


    if (!savedData) {

        return;

    }


    try {

        const settings =
            JSON.parse(
                savedData
            );


        const trainSettings =
            settings.train ||
            {};


        const trainLine =
            trainSettings.line ||
            "";


        const boardingStation =
            trainSettings.boardingStation ||
            "";


        const arrivalStation =
            trainSettings.arrivalStation ||
            "";


        if (!trainLine) {

            return;

        }


        let routeText =
            "";


        if (
            boardingStation
            &&
            arrivalStation
        ) {

            routeText =
                `${boardingStation} → ${arrivalStation}`;

        }


        let trainStatus;


        if (
            TRAIN_API_ENABLED
        ) {

            trainStatus =
                await getTrainStatusFromAPI(
                    trainLine
                );

        } else {

            trainStatus =
                "normal";

        }


        const todayString =
            formatLocalDate(
                new Date()
            );


        // =============================
        // 平常運転
        // =============================

        if (
            trainStatus ===
            "normal"
        ) {

            let message =
                `登録している${trainLine}は現在、平常運転です。`;


            if (
                routeText
            ) {

                message =
                    `${trainLine}（${routeText}）は現在、平常運転です。`;

            }


            if (
                !TRAIN_API_ENABLED
            ) {

                message +=
                    " ※現在は仮表示です。";

            }


            notifications.push({

                id:
                    `train-normal-${todayString}`,

                category:
                    "train",

                title:
                    "交通情報",

                message,

                time:
                    "今日",

                read:
                    false,

                settingKey:
                    null

            });

        }


        // =============================
        // 遅延
        // =============================

        if (
            trainStatus ===
                "delay"
            &&
            notificationSettings.trainDelay !==
                false
        ) {

            notifications.unshift({

                id:
                    `train-delay-${todayString}`,

                category:
                    "train",

                title:
                    "電車の遅延",

                message:
                    `${trainLine}に遅延が発生しています。時間に余裕を持って移動してください。`,

                time:
                    "今日",

                read:
                    false,

                settingKey:
                    "trainDelay"

            });

        }


        // =============================
        // 運転見合わせ
        // =============================

        if (
            trainStatus ===
                "suspended"
            &&
            notificationSettings.trainStop !==
                false
        ) {

            notifications.unshift({

                id:
                    `train-stop-${todayString}`,

                category:
                    "train",

                title:
                    "運転見合わせ",

                message:
                    `${trainLine}で運転見合わせが発生しています。別の移動手段も確認してください。`,

                time:
                    "今日",

                read:
                    false,

                settingKey:
                    "trainStop"

            });

        }

    } catch (error) {

        console.error(
            "交通通知を作成できませんでした。",
            error
        );

    }

}


// =============================
// 既読状態
// =============================

function loadReadState() {

    const savedData =
        localStorage.getItem(
            READ_STATE_KEY
        );


    if (!savedData) {

        return {};

    }


    try {

        return JSON.parse(
            savedData
        );

    } catch (error) {

        console.error(
            "既読状態を読み込めませんでした。",
            error
        );


        return {};

    }

}


function applySavedReadState() {

    const readState =
        loadReadState();


    notifications.forEach(
        notification => {

            const savedValue =
                readState[
                    notification.id
                ];


            if (
                typeof savedValue ===
                "boolean"
            ) {

                notification.read =
                    savedValue;

            }

        }
    );

}


function saveReadState() {

    const readState =
        loadReadState();


    notifications.forEach(
        notification => {

            readState[
                notification.id
            ] =
                notification.read;

        }
    );


    localStorage.setItem(
        READ_STATE_KEY,
        JSON.stringify(
            readState
        )
    );

}


// =============================
// 有効な通知
// =============================

function isNotificationEnabled(
    notification
) {

    if (
        !notification.settingKey
    ) {

        return true;

    }


    return (
        notificationSettings[
            notification.settingKey
        ] !== false
    );

}


// =============================
// 表示通知
// =============================

function getVisibleNotifications() {

    return notifications.filter(
        notification => {

            const enabled =
                isNotificationEnabled(
                    notification
                );


            const matchesFilter =
                currentFilter ===
                    "all"
                ||
                notification.category ===
                    currentFilter;


            return (
                enabled
                &&
                matchesFilter
            );

        }
    );

}


function getAllEnabledNotifications() {

    return notifications.filter(
        isNotificationEnabled
    );

}


// =============================
// HTMLエスケープ
// =============================

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// =============================
// 通知一覧描画
// =============================

function renderNotifications() {

    const notificationList =
        document.getElementById(
            "notificationList"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    const visibleNotifications =
        getVisibleNotifications();


    notificationList.innerHTML =
        "";


    if (
        visibleNotifications.length ===
        0
    ) {

        emptyState.hidden =
            false;


        updateUnreadCount();


        return;

    }


    emptyState.hidden =
        true;


    visibleNotifications.forEach(
        notification => {

            const card =
                createNotificationCard(
                    notification
                );


            notificationList.appendChild(
                card
            );

        }
    );


    updateUnreadCount();

}


// =============================
// 通知カード
// =============================

function createNotificationCard(
    notification
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "notification-card";


    article.dataset.category =
        notification.category;


    if (
        !notification.read
    ) {

        article.classList.add(
            "is-unread"
        );

    }


    article.innerHTML = `

        <div class="notification-content">

            <div class="notification-heading">

                <h2 class="notification-title">
                    ${escapeHtml(notification.title)}
                </h2>

                ${
                    notification.read
                        ? ""
                        : `
                            <span class="new-badge">
                                NEW
                            </span>
                        `
                }

            </div>


            <p class="notification-message">
                ${escapeHtml(notification.message)}
            </p>


            <div class="notification-meta">
                ${escapeHtml(notification.time)}
            </div>

        </div>


        <div class="notification-side">

            ${
                notification.read
                    ? ""
                    : `
                        <span
                            class="unread-dot"
                            aria-label="未読"
                        ></span>

                        <button
                            class="mark-read-button"
                            type="button"
                            data-id="${escapeHtml(notification.id)}"
                        >
                            既読にする
                        </button>
                    `
            }

        </div>

    `;


    const markReadButton =
        article.querySelector(
            ".mark-read-button"
        );


    if (
        markReadButton
    ) {

        markReadButton.addEventListener(
            "click",
            () => {

                markAsRead(
                    notification.id
                );

            }
        );

    }


    return article;

}


// =============================
// 未読件数
// =============================

function updateUnreadCount() {

    const unreadCount =
        document.getElementById(
            "unreadCount"
        );


    const readAllButton =
        document.getElementById(
            "readAllButton"
        );


    const unreadNotifications =
        getAllEnabledNotifications()
            .filter(
                notification =>
                    !notification.read
            );


    unreadCount.textContent =
        `未読 ${unreadNotifications.length}件`;


    readAllButton.disabled =
        unreadNotifications.length ===
        0;


    localStorage.setItem(
        UNREAD_COUNT_KEY,
        String(
            unreadNotifications.length
        )
    );

}


// =============================
// 1件既読
// =============================

function markAsRead(
    notificationId
) {

    const notification =
        notifications.find(
            item =>
                item.id ===
                notificationId
        );


    if (!notification) {

        return;

    }


    notification.read =
        true;


    saveReadState();

    renderNotifications();

}


// =============================
// すべて既読
// =============================

function setupReadAllButton() {

    const readAllButton =
        document.getElementById(
            "readAllButton"
        );


    readAllButton.addEventListener(
        "click",
        () => {

            notifications.forEach(
                notification => {

                    if (
                        isNotificationEnabled(
                            notification
                        )
                    ) {

                        notification.read =
                            true;

                    }

                }
            );


            saveReadState();

            renderNotifications();

        }
    );

}


// =============================
// フィルター
// =============================

function setupFilterTabs() {

    const filterTabs =
        document.querySelectorAll(
            ".filter-tab"
        );


    filterTabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    currentFilter =
                        tab.dataset.filter;


                    filterTabs.forEach(
                        item => {

                            const active =
                                item === tab;


                            item.classList.toggle(
                                "is-active",
                                active
                            );


                            item.setAttribute(
                                "aria-selected",
                                String(active)
                            );

                        }
                    );


                    renderNotifications();

                }
            );

        }
    );

}


// =============================
// 戻る
// =============================

function setupBackButton() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    backButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "main.html";

        }
    );

}


// =============================
// 通知を作り直す
// =============================

async function loadNotifications() {

    notifications =
        [];


    notificationSettings =
        loadNotificationSettings();


    // カレンダーの予定
    createScheduleNotifications();


    // 天気
    await createWeatherNotifications();


    // 交通
    await createTrainNotification();


    // 保存済み既読状態
    applySavedReadState();


    renderNotifications();

}


// =============================
// 別タブで予定変更時も更新
// =============================

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            SCHEDULE_STORAGE_KEY
        ) {

            loadNotifications();

        }

    }
);


// =============================
// 初期化
// =============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        setupFilterTabs();

        setupReadAllButton();

        setupBackButton();


        await loadNotifications();

    }
);
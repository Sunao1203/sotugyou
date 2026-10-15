// =============================
// LocalStorageキー
// =============================

const SCHEDULE_STORAGE_KEY =
    "aiSecretarySchedules";


// =============================
// 日付関係
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


function createDateFromString(dateString) {

    const [
        year,
        month,
        day
    ] =
        dateString
            .split("-")
            .map(Number);


    return new Date(
        year,
        month - 1,
        day
    );
}


function addDays(date, days) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;
}


function formatSelectedDate(dateString) {

    const date =
        createDateFromString(
            dateString
        );

    return `${date.getMonth() + 1}月${date.getDate()}日`;
}


// =============================
// ID作成
// =============================

function createScheduleId() {

    return `schedule-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}


// =============================
// 初期サンプル予定
// =============================

function createInitialSchedules() {

    const today =
        new Date();

    const tomorrow =
        addDays(
            today,
            1
        );


    return [

        {
            id:
                createScheduleId(),

            title:
                "チーム会議",

            date:
                formatLocalDate(
                    today
                ),

            startTime:
                "10:00",

            endTime:
                "11:00",

            location:
                "オンライン",

            memo:
                "進捗確認",

            createdAt:
                new Date()
                    .toISOString()
        },


        {
            id:
                createScheduleId(),

            title:
                "資料作成",

            date:
                formatLocalDate(
                    today
                ),

            startTime:
                "14:00",

            endTime:
                "15:30",

            location:
                "",

            memo:
                "",

            createdAt:
                new Date()
                    .toISOString()
        },


        {
            id:
                createScheduleId(),

            title:
                "打ち合わせ",

            date:
                formatLocalDate(
                    tomorrow
                ),

            startTime:
                "13:00",

            endTime:
                "14:00",

            location:
                "会議室",

            memo:
                "",

            createdAt:
                new Date()
                    .toISOString()
        }

    ];
}


// =============================
// LocalStorage
// =============================

function loadSchedules() {

    const savedData =
        localStorage.getItem(
            SCHEDULE_STORAGE_KEY
        );


    if (savedData === null) {

        const initialSchedules =
            createInitialSchedules();


        localStorage.setItem(
            SCHEDULE_STORAGE_KEY,
            JSON.stringify(
                initialSchedules
            )
        );


        return initialSchedules;
    }


    try {

        const parsedData =
            JSON.parse(
                savedData
            );


        return Array.isArray(
            parsedData
        )
            ? parsedData
            : [];

    } catch (error) {

        console.error(
            "予定データの読み込みに失敗しました。",
            error
        );


        return [];
    }
}


function saveSchedules() {

    localStorage.setItem(
        SCHEDULE_STORAGE_KEY,
        JSON.stringify(
            schedules
        )
    );
}


function addSchedule(schedule) {

    schedules.push(
        schedule
    );

    saveSchedules();
}


function updateSchedule(
    updatedSchedule
) {

    const index =
        schedules.findIndex(
            schedule =>
                schedule.id ===
                updatedSchedule.id
        );


    if (index === -1) {
        return;
    }


    schedules[index] =
        updatedSchedule;

    saveSchedules();
}


function removeSchedule(
    scheduleId
) {

    schedules =
        schedules.filter(
            schedule =>
                schedule.id !==
                scheduleId
        );

    saveSchedules();
}


// =============================
// DOM
// =============================

const backButton =
    document.getElementById(
        "backButton"
    );


const previousMonthButton =
    document.getElementById(
        "previousMonthButton"
    );


const nextMonthButton =
    document.getElementById(
        "nextMonthButton"
    );


const todayButton =
    document.getElementById(
        "todayButton"
    );


const addScheduleButton =
    document.getElementById(
        "addScheduleButton"
    );


const calendarMonthTitle =
    document.getElementById(
        "calendarMonthTitle"
    );


const calendarGrid =
    document.getElementById(
        "calendarGrid"
    );


// =============================
// 日付詳細モーダル
// =============================

const dayDetailModal =
    document.getElementById(
        "dayDetailModal"
    );


const dayDetailModalOverlay =
    document.getElementById(
        "dayDetailModalOverlay"
    );


const closeDayDetailButton =
    document.getElementById(
        "closeDayDetailButton"
    );


const dayDetailTitle =
    document.getElementById(
        "dayDetailTitle"
    );


const dayScheduleList =
    document.getElementById(
        "dayScheduleList"
    );


const dayScheduleEmpty =
    document.getElementById(
        "dayScheduleEmpty"
    );


const selectedDayAddButton =
    document.getElementById(
        "selectedDayAddButton"
    );


// =============================
// 予定追加・編集モーダル
// =============================

const scheduleModal =
    document.getElementById(
        "scheduleModal"
    );


const scheduleModalOverlay =
    document.getElementById(
        "scheduleModalOverlay"
    );


const closeScheduleModalButton =
    document.getElementById(
        "closeScheduleModalButton"
    );


const selectedDateTitle =
    document.getElementById(
        "selectedDateTitle"
    );


const schedulePanelTitle =
    document.getElementById(
        "schedulePanelTitle"
    );


const scheduleForm =
    document.getElementById(
        "scheduleForm"
    );


const scheduleIdInput =
    document.getElementById(
        "scheduleId"
    );


const scheduleTitleInput =
    document.getElementById(
        "scheduleTitle"
    );


const scheduleDateInput =
    document.getElementById(
        "scheduleDate"
    );


const scheduleStartTimeInput =
    document.getElementById(
        "scheduleStartTime"
    );


const scheduleEndTimeInput =
    document.getElementById(
        "scheduleEndTime"
    );


const scheduleLocationInput =
    document.getElementById(
        "scheduleLocation"
    );


const scheduleMemoInput =
    document.getElementById(
        "scheduleMemo"
    );


const deleteScheduleButton =
    document.getElementById(
        "deleteScheduleButton"
    );


const cancelScheduleButton =
    document.getElementById(
        "cancelScheduleButton"
    );


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


// =============================
// 状態
// =============================

let schedules = [];


const today =
    new Date();


let currentMonthDate =
    new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );


let selectedDate =
    formatLocalDate(
        today
    );


let toastTimer =
    null;


// =============================
// 予定取得
// =============================

function getSchedulesByDate(
    dateString
) {

    return schedules
        .filter(
            schedule =>
                schedule.date ===
                dateString
        )
        .sort(
            (a, b) =>
                String(
                    a.startTime
                ).localeCompare(
                    String(
                        b.startTime
                    )
                )
        );
}


// =============================
// カレンダー描画
// =============================

function renderCalendar() {

    calendarGrid.innerHTML =
        "";


    const year =
        currentMonthDate
            .getFullYear();


    const month =
        currentMonthDate
            .getMonth();


    calendarMonthTitle.textContent =
        `${year}年 ${month + 1}月`;


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const startDate =
        new Date(
            year,
            month,
            1 - firstDay.getDay()
        );


    const todayString =
        formatLocalDate(
            new Date()
        );


    for (
        let index = 0;
        index < 42;
        index += 1
    ) {

        const cellDate =
            addDays(
                startDate,
                index
            );


        const dateString =
            formatLocalDate(
                cellDate
            );


        const isOutsideMonth =
            cellDate.getMonth() !==
            month;


        const daySchedules =
            getSchedulesByDate(
                dateString
            );


        const dayButton =
            document.createElement(
                "button"
            );


        dayButton.type =
            "button";


        dayButton.className =
            "calendar-day";


        dayButton.setAttribute(
            "aria-label",
            `${cellDate.getMonth() + 1}月${cellDate.getDate()}日`
        );


        // 前月・翌月
        if (isOutsideMonth) {

            dayButton.classList.add(
                "is-outside-month"
            );


            dayButton.setAttribute(
                "aria-disabled",
                "true"
            );
        }


        // 今日
        if (
            dateString ===
            todayString
        ) {

            dayButton.classList.add(
                "is-today"
            );
        }


        // 選択日
        if (
            dateString ===
            selectedDate
            &&
            !isOutsideMonth
        ) {

            dayButton.classList.add(
                "is-selected"
            );
        }


        // 予定あり
        if (
            daySchedules.length > 0
        ) {

            dayButton.classList.add(
                "has-schedules"
            );
        }


        // =============================
        // 日付数字
        // =============================
        const dayHeader =
            document.createElement(
                "div"
            );

        dayHeader.className =
            "calendar-day-header";


        const dayNumber =
            document.createElement(
                "span"
            );

        dayNumber.className =
            "calendar-day-number";

        dayNumber.textContent =
            String(
                cellDate.getDate()
            );


        dayHeader.appendChild(
            dayNumber
        );


        // 2件以上予定がある場合
        if (
            daySchedules.length > 1
        ) {

            const count =
                document.createElement(
                    "span"
                );

            count.className =
                "calendar-day-count";

            count.textContent =
                `その他${daySchedules.length - 1}件`;

            dayHeader.appendChild(
                count
            );
        }


        dayButton.appendChild(
            dayHeader
        );

        // =============================
        // 予定プレビュー
        // PC：1件
        // スマホ：最大3件
        // =============================

        const preview =
            document.createElement(
                "div"
            );

        preview.className =
            "day-schedule-preview";


        daySchedules
            .slice(
                0,
                3
            )
            .forEach(
                schedule => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "day-schedule-line";


                    const time =
                        document.createElement(
                            "span"
                        );

                    time.className =
                        "day-schedule-time";

                    time.textContent =
                        schedule.startTime
                            ? `${schedule.startTime} `
                            : "";


                    const title =
                        document.createElement(
                            "span"
                        );

                    title.className =
                        "day-schedule-title";

                    title.textContent =
                        schedule.title;


                    item.appendChild(
                        time
                    );

                    item.appendChild(
                        title
                    );

                    preview.appendChild(
                        item
                    );
                }
            );


        dayButton.appendChild(
            preview
        );


        // =============================
        // 日付クリック
        // =============================

        dayButton.addEventListener(
            "click",
            () => {

                if (isOutsideMonth) {
                    return;
                }


                selectedDate =
                    dateString;


                renderCalendar();


                openDayDetailModal(
                    dateString
                );
            }
        );


        calendarGrid.appendChild(
            dayButton
        );
    }
}


// =============================
// 日付詳細一覧
// =============================

function renderDayDetail() {

    const daySchedules =
        getSchedulesByDate(
            selectedDate
        );


    dayDetailTitle.textContent =
        `${formatSelectedDate(selectedDate)}の予定`;


    dayScheduleList.innerHTML =
        "";


    if (
        daySchedules.length === 0
    ) {

        dayScheduleEmpty.hidden =
            false;

        return;
    }


    dayScheduleEmpty.hidden =
        true;


    daySchedules.forEach(
        schedule => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "day-detail-item";


            const timeText =
                schedule.endTime
                    ? `${schedule.startTime} - ${schedule.endTime}`
                    : schedule.startTime;


            const locationHtml =
                schedule.location
                    ? `
                        <p class="day-detail-location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${escapeHtml(schedule.location)}
                        </p>
                    `
                    : "";


            button.innerHTML = `

                <span class="day-detail-time">
                    ${escapeHtml(timeText)}
                </span>


                <span class="day-detail-content">

                    <strong>
                        ${escapeHtml(schedule.title)}
                    </strong>

                    ${locationHtml}

                </span>


                <i class="fa-solid fa-chevron-right"></i>

            `;


            button.addEventListener(
                "click",
                () => {

                    closeDayDetailModal();


                    openEditScheduleModal(
                        schedule
                    );
                }
            );


            dayScheduleList.appendChild(
                button
            );
        }
    );
}


// =============================
// 日付詳細モーダルを開く
// =============================

function openDayDetailModal(
    dateString
) {

    selectedDate =
        dateString;


    renderDayDetail();


    dayDetailModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";
}


// =============================
// 日付詳細モーダルを閉じる
// =============================

function closeDayDetailModal() {

    dayDetailModal.hidden =
        true;


    document.body.style.overflow =
        "";
}


// =============================
// 追加モーダル
// =============================

function openAddScheduleModal(
    dateString = null
) {

    scheduleForm.reset();


    scheduleIdInput.value =
        "";


    deleteScheduleButton.hidden =
        true;


    if (dateString) {

        selectedDate =
            dateString;

    } else {

        const now =
            new Date();


        if (
            currentMonthDate.getFullYear() ===
            now.getFullYear()
            &&
            currentMonthDate.getMonth() ===
            now.getMonth()
        ) {

            selectedDate =
                formatLocalDate(
                    now
                );

        } else {

            selectedDate =
                formatLocalDate(
                    new Date(
                        currentMonthDate
                            .getFullYear(),

                        currentMonthDate
                            .getMonth(),

                        1
                    )
                );
        }
    }


    selectedDateTitle.textContent =
        formatSelectedDate(
            selectedDate
        );


    schedulePanelTitle.textContent =
        "予定を追加";


    scheduleDateInput.value =
        selectedDate;


    scheduleModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";


    requestAnimationFrame(
        () => {

            scheduleTitleInput.focus();

        }
    );
}


// =============================
// 編集モーダル
// =============================

function openEditScheduleModal(
    schedule
) {

    selectedDate =
        schedule.date;


    const scheduleDate =
        createDateFromString(
            schedule.date
        );


    currentMonthDate =
        new Date(
            scheduleDate.getFullYear(),
            scheduleDate.getMonth(),
            1
        );


    selectedDateTitle.textContent =
        formatSelectedDate(
            schedule.date
        );


    schedulePanelTitle.textContent =
        "予定を編集";


    scheduleIdInput.value =
        schedule.id;


    scheduleTitleInput.value =
        schedule.title;


    scheduleDateInput.value =
        schedule.date;


    scheduleStartTimeInput.value =
        schedule.startTime;


    scheduleEndTimeInput.value =
        schedule.endTime || "";


    scheduleLocationInput.value =
        schedule.location || "";


    scheduleMemoInput.value =
        schedule.memo || "";


    deleteScheduleButton.hidden =
        false;


    scheduleModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";


    renderCalendar();
}


// =============================
// 予定モーダルを閉じる
// =============================

function closeScheduleModal() {

    scheduleModal.hidden =
        true;


    document.body.style.overflow =
        "";


    scheduleForm.reset();


    scheduleIdInput.value =
        "";


    deleteScheduleButton.hidden =
        true;
}


// =============================
// HTMLエスケープ
// =============================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;
}


// =============================
// 保存
// =============================

scheduleForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const title =
            scheduleTitleInput
                .value
                .trim();

        const date =
            scheduleDateInput.value
            ||
            selectedDate
            ||
            formatLocalDate(new Date());

        const startTime =
            scheduleStartTimeInput
                .value;


        const endTime =
            scheduleEndTimeInput
                .value;


        const location =
            scheduleLocationInput
                .value
                .trim();


        const memo =
            scheduleMemoInput
                .value
                .trim();


        if (!title) {

            showToast(
                "予定名を入力してください",
                "error"
            );

            return;
        }

        if (
            endTime
            &&
            endTime < startTime
        ) {

            showToast(
                "終了時間は開始時間より後にしてください",
                "error"
            );

            return;
        }


        const existingId =
            scheduleIdInput
                .value;


        // 編集
        if (existingId) {

            const oldSchedule =
                schedules.find(
                    schedule =>
                        schedule.id ===
                        existingId
                );


            if (!oldSchedule) {

                showToast(
                    "予定を確認できませんでした",
                    "error"
                );

                return;
            }


            updateSchedule({

                ...oldSchedule,

                title,
                date,
                startTime,
                endTime,
                location,
                memo

            });


            showToast(
                "予定を更新しました"
            );

        } else {

            // 新規追加

            addSchedule({

                id:
                    createScheduleId(),

                title,
                date,
                startTime,
                endTime,
                location,
                memo,

                createdAt:
                    new Date()
                        .toISOString()

            });


            showToast(
                "予定を追加しました"
            );
        }


        selectedDate =
            date;


        const savedDate =
            createDateFromString(
                date
            );


        currentMonthDate =
            new Date(
                savedDate.getFullYear(),
                savedDate.getMonth(),
                1
            );


        closeScheduleModal();

        renderCalendar();
    }
);


// =============================
// 削除
// =============================

deleteScheduleButton.addEventListener(
    "click",
    () => {

        const scheduleId =
            scheduleIdInput
                .value;


        if (!scheduleId) {
            return;
        }


        const confirmed =
            window.confirm(
                "この予定を削除しますか？"
            );


        if (!confirmed) {
            return;
        }


        removeSchedule(
            scheduleId
        );


        closeScheduleModal();

        renderCalendar();


        showToast(
            "予定を削除しました"
        );
    }
);


// =============================
// トースト
// =============================

function showToast(
    message,
    type = "success"
) {

    toastMessage.textContent =
        message;


    const icon =
        toast.querySelector(
            "i"
        );


    if (
        type ===
        "error"
    ) {

        icon.className =
            "fa-solid fa-circle-exclamation";

    } else {

        icon.className =
            "fa-solid fa-circle-check";
    }


    toast.classList.add(
        "show"
    );


    if (toastTimer) {

        clearTimeout(
            toastTimer
        );
    }


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );
}


// =============================
// 戻る
// =============================

backButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "main.html";
    }
);


// =============================
// 前月
// =============================

previousMonthButton.addEventListener(
    "click",
    () => {

        currentMonthDate =
            new Date(
                currentMonthDate
                    .getFullYear(),

                currentMonthDate
                    .getMonth() - 1,

                1
            );


        selectedDate =
            "";


        renderCalendar();
    }
);


// =============================
// 翌月
// =============================

nextMonthButton.addEventListener(
    "click",
    () => {

        currentMonthDate =
            new Date(
                currentMonthDate
                    .getFullYear(),

                currentMonthDate
                    .getMonth() + 1,

                1
            );


        selectedDate =
            "";


        renderCalendar();
    }
);


// =============================
// 今日
// =============================

todayButton.addEventListener(
    "click",
    () => {

        const now =
            new Date();


        currentMonthDate =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );


        selectedDate =
            formatLocalDate(
                now
            );


        renderCalendar();
    }
);


// =============================
// 上部追加ボタン
// =============================

addScheduleButton.addEventListener(
    "click",
    () => {

        openAddScheduleModal();

    }
);


// =============================
// 選択日に追加
// =============================

selectedDayAddButton.addEventListener(
    "click",
    () => {

        const date =
            selectedDate;


        closeDayDetailModal();


        openAddScheduleModal(
            date
        );
    }
);


// =============================
// 日付詳細を閉じる
// =============================

closeDayDetailButton.addEventListener(
    "click",
    closeDayDetailModal
);


dayDetailModalOverlay.addEventListener(
    "click",
    closeDayDetailModal
);


// =============================
// 予定フォームを閉じる
// =============================

closeScheduleModalButton.addEventListener(
    "click",
    closeScheduleModal
);


cancelScheduleButton.addEventListener(
    "click",
    closeScheduleModal
);


scheduleModalOverlay.addEventListener(
    "click",
    closeScheduleModal
);


// =============================
// Escキー
// =============================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        if (
            !scheduleModal.hidden
        ) {

            closeScheduleModal();

            return;
        }


        if (
            !dayDetailModal.hidden
        ) {

            closeDayDetailModal();
        }
    }
);


// =============================
// 初期表示
// =============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        schedules =
            loadSchedules();


        renderCalendar();
    }
);
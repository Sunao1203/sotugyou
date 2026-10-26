// =============================
// LocalStorageキー
// =============================

const TASK_STORAGE_KEY = "aiSecretaryTasks";



// =============================
// HTML要素
// =============================

const backButton =
    document.getElementById("backButton");

const addTaskButton =
    document.getElementById("addTaskButton");

const taskList =
    document.getElementById("taskList");

const taskEmpty =
    document.getElementById("taskEmpty");

const emptyTitle =
    document.getElementById("emptyTitle");

const emptyText =
    document.getElementById("emptyText");

const activeTaskCount =
    document.getElementById("activeTaskCount");

const todayTaskCount =
    document.getElementById("todayTaskCount");

const highTaskCount =
    document.getElementById("highTaskCount");


const taskModal =
    document.getElementById("taskModal");

const taskModalOverlay =
    document.getElementById("taskModalOverlay");

const modalCloseButton =
    document.getElementById("modalCloseButton");

const modalTitle =
    document.getElementById("modalTitle");

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskDueDate =
    document.getElementById("taskDueDate");

const taskPriority =
    document.getElementById("taskPriority");

const taskMemo =
    document.getElementById("taskMemo");

const cancelButton =
    document.getElementById("cancelButton");

const submitButtonText =
    document.getElementById("submitButtonText");


const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


const filterButtons =
    document.querySelectorAll(".filter-button");



// =============================
// タスクデータ
// =============================

let tasks = [];


// 現在選択中のフィルター
let currentFilter = "active";


// 編集中のタスクID
// null の場合は新規登録
let editingTaskId = null;



// =============================
// 日付関係
// =============================

// Dateを YYYY-MM-DD 形式に変換
function formatDateToString(date) {

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


// 今日の日付
function getTodayString() {

    return formatDateToString(
        new Date()
    );
}


// 明日の日付
function getTomorrowString() {

    const tomorrow =
        new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    return formatDateToString(
        tomorrow
    );
}



// =============================
// LocalStorage
// =============================

// タスクを保存
function saveTasks() {

    localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


// タスクを読み込み
function loadTasks() {

    const savedTasks =
        localStorage.getItem(
            TASK_STORAGE_KEY
        );


    // 初回だけ仮データを作成
    if (savedTasks === null) {

        createInitialTasks();

        saveTasks();

        return;
    }


    try {

        const parsedTasks =
            JSON.parse(savedTasks);


        if (
            Array.isArray(parsedTasks)
        ) {

            tasks = parsedTasks.map(task => ({
                ...task,
                priority:
                    task.priority === "high"
                        ? "high"
                        : "normal"
            }));

        } else {

            tasks = [];

        }

    } catch (error) {

        console.error(
            "タスクデータの読み込みに失敗しました。",
            error
        );

        tasks = [];

    }

}



// =============================
// 初期表示用仮データ
// =============================

function createInitialTasks() {

    const today =
        new Date();


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    const threeDaysLater =
        new Date(today);

    threeDaysLater.setDate(
        threeDaysLater.getDate() + 3
    );


    tasks = [

        {
            id:
                Date.now(),

            title:
                "企画資料を完成させる",

            dueDate:
                formatDateToString(
                    tomorrow
                ),

            priority:
                "high",

            completed:
                false,

            createdAt:
                new Date().toISOString()
        },


        {
            id:
                Date.now() + 1,

            title:
                "メールを返信する",

            dueDate:
                formatDateToString(
                    today
                ),

            priority:
                "normal",

            memo:
                "確認してから返信する",

            completed:
                false,

            createdAt:
                new Date().toISOString()
        },


        {
            id:
                Date.now() + 2,

            title:
                "プレゼン資料を確認する",

            dueDate:
                formatDateToString(
                    threeDaysLater
                ),
            priority:
                "normal",
            memo:
                "",

            completed:
                false,

            createdAt:
                new Date().toISOString()
        }

    ];

}



// =============================
// HTMLエスケープ
// =============================

// ユーザーが入力した文字を
// HTMLとして解釈されないようにする
function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";


    return div.innerHTML;

}

// =============================
// 優先度
// =============================

function getPriorityInfo(priority) {

    if (priority === "high") {
        return {
            icon: "fa-solid fa-flag",
            className: "priority-high"
        };
    }

    return null;
}

// =============================
// 期限表示
// =============================

function getDueDateInfo(dueDate) {

    // 期限なし
    if (!dueDate) {

        return {
            text: "期限なし",
            className: ""
        };

    }


    const today =
        getTodayString();

    const tomorrow =
        getTomorrowString();


    // 今日
    if (dueDate === today) {

        return {
            text: "今日",
            className: "today"
        };

    }


    // 明日
    if (dueDate === tomorrow) {

        return {
            text: "明日",
            className: ""
        };

    }


    // 日付を分解
    const dateParts =
        dueDate.split("-");


    const month =
        Number(
            dateParts[1]
        );

    const day =
        Number(
            dateParts[2]
        );

    // 期限切れ
    if (dueDate < today) {

        return {
            text:
                `期限切れ・${month}/${day}`,

            className:
                "overdue"
        };
    }


    return {
        text:
            `${month}月${day}日`,

        className:
            ""
    };

}



// =============================
// 並び順
// =============================

function sortTasks(taskArray) {

    const priorityOrder = {
        high: 0,
        normal: 1
    };


    return [...taskArray].sort(
        (a, b) => {

            // 1. 未完了を上にする
            if (
                a.completed
                !==
                b.completed
            ) {

                return (
                    a.completed
                        ?
                        1
                        :
                        -1
                );

            }


            // 2. 期限が近いものを上にする
            const dateA =
                a.dueDate
                ||
                "9999-12-31";

            const dateB =
                b.dueDate
                ||
                "9999-12-31";


            if (
                dateA
                !==
                dateB
            ) {

                return (
                    dateA.localeCompare(
                        dateB
                    )
                );

            }


            // 3. 優先度が高いものを上にする
            const priorityA =
                priorityOrder[
                a.priority
                ]
                ??
                1;

            const priorityB =
                priorityOrder[
                b.priority
                ]
                ??
                1;


            if (
                priorityA
                !==
                priorityB
            ) {

                return (
                    priorityA
                    -
                    priorityB
                );

            }


            // 最後に作成日時順
            return (
                new Date(
                    a.createdAt
                )
                -
                new Date(
                    b.createdAt
                )
            );

        }
    );

}



// =============================
// フィルター
// =============================

function getFilteredTasks() {

    const today =
        getTodayString();


    if (
        currentFilter
        ===
        "active"
    ) {

        return tasks.filter(
            task =>
                !task.completed
        );

    }


    if (
        currentFilter
        ===
        "completed"
    ) {

        return tasks.filter(
            task =>
                task.completed
        );

    }


    if (
        currentFilter
        ===
        "today"
    ) {

        return tasks.filter(
            task =>
                !task.completed
                &&
                task.dueDate
                ===
                today
        );

    }


    return tasks;

}



// =============================
// タスク一覧表示
// =============================

function renderTasks() {

    const filteredTasks =
        getFilteredTasks();


    const sortedTasks =
        sortTasks(
            filteredTasks
        );


    taskList.innerHTML = "";
    taskList.classList.toggle(
        "is-scrollable",
        sortedTasks.length >= 4
    );

    // 表示対象がない場合
    if (
        sortedTasks.length
        ===
        0
    ) {

        showEmptyState();

        return;

    }


    taskEmpty.hidden = true;


    sortedTasks.forEach(
        task => {

            const card =
                createTaskCard(
                    task
                );


            taskList.appendChild(
                card
            );

        }
    );

}



// =============================
// タスクカード作成
// =============================

function createTaskCard(task) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "task-card";


    if (task.completed) {

        card.classList.add(
            "completed"
        );

    }


    card.dataset.taskId =
        task.id;


    const priority =
        getPriorityInfo(
            task.priority
        );


    const dueDate =
        getDueDateInfo(
            task.dueDate
        );


    const memoHtml =
        task.memo
            ?
            `
            <span class="task-memo">
                <i class="fa-regular fa-note-sticky"></i>

                <span>
                    ${escapeHtml(task.memo)}
                </span>
            </span>
        `
            :
            "";

    const completeIcon =
        task.completed
            ?
            "fa-solid fa-rotate-left"
            :
            "fa-solid fa-check";


    const completeLabel =
        task.completed
            ?
            "未完了に戻す"
            :
            "完了";


    card.innerHTML = `

        <div class="task-content">

            <div class="task-top-row">

                <h3 class="task-name">
                    ${escapeHtml(task.title)}
                </h3>
                
        ${priority ? `
            <span
                class="priority-icon ${priority.className}"
                title="重要"
                aria-label="重要"
            >
                <i class="${priority.icon}"></i>
            </span>
        ` : ""}

            </div>


            <div class="task-meta">

                <span
                    class="
                        task-due
                        ${dueDate.className}
                    "
                >

                    <i class="fa-regular fa-calendar"></i>

                    ${dueDate.text}

                </span>


                ${memoHtml}

            </div>

        </div>


        <div class="task-actions">

    <button
        class="
            task-action-button
            complete-task-button
        "
        type="button"
        data-action="toggle"
        aria-label="${completeLabel}"
        title="${completeLabel}"
    >
        <i class="${completeIcon}"></i>

        <span>
            ${completeLabel}
        </span>
    </button>


    <button
        class="
            task-action-button
            edit-task-button
        "
        type="button"
        data-action="edit"
        aria-label="タスクを編集"
        title="編集"
    >
        <i class="fa-solid fa-pen"></i>

        <span>
            編集
        </span>
    </button>


    <button
        class="
            task-action-button
            delete-task-button
        "
        type="button"
        data-action="delete"
        aria-label="タスクを削除"
        title="削除"
    >
        <i class="fa-solid fa-trash"></i>

        <span>
            削除
        </span>
    </button>

</div>

    `;


    return card;

}



// =============================
// 空状態
// =============================

function showEmptyState() {

    taskEmpty.hidden = false;


    // 本当にタスクが0件
    if (
        tasks.length
        ===
        0
    ) {

        emptyTitle.textContent =
            "現在、登録されているタスクはありません。";

        emptyText.textContent =
            "新しいタスクを追加してみましょう。";

        return;

    }


    // フィルター結果が0件
    if (
        currentFilter
        ===
        "active"
    ) {

        emptyTitle.textContent =
            "未完了のタスクはありません。";

        emptyText.textContent =
            "すべて完了しています。";

        return;

    }


    if (
        currentFilter
        ===
        "completed"
    ) {

        emptyTitle.textContent =
            "完了済みのタスクはありません。";

        emptyText.textContent =
            "完了したタスクはこちらに表示されます。";

        return;

    }


    if (
        currentFilter
        ===
        "today"
    ) {

        emptyTitle.textContent =
            "今日が期限のタスクはありません。";

        emptyText.textContent =
            "今日の分はひとまず安心です。";

        return;

    }


    emptyTitle.textContent =
        "表示できるタスクがありません。";

    emptyText.textContent =
        "新しいタスクを追加してみましょう。";

}



// =============================
// サマリー更新
// =============================

function updateSummary() {

    const today =
        getTodayString();


    const activeTasks =
        tasks.filter(
            task =>
                !task.completed
        );


    const todayTasks =
        tasks.filter(
            task =>
                !task.completed
                &&
                task.dueDate
                ===
                today
        );


    const highTasks =
        tasks.filter(
            task =>
                !task.completed
                &&
                task.priority
                ===
                "high"
        );

    activeTaskCount.textContent =
        `${activeTasks.length}件`;


    todayTaskCount.textContent =
        `${todayTasks.length}件`;


    highTaskCount.textContent =
        `${highTasks.length}件`;

}



// =============================
// 画面更新
// =============================

function refreshTaskScreen() {

    renderTasks();

    updateSummary();

}



// =============================
// モーダル
// =============================

function openModal() {

    taskModal.hidden = false;

    document.body.style.overflow =
        "hidden";


    // 少し待ってからフォーカス
    setTimeout(
        () => {

            taskTitle.focus();

        },
        50
    );

}


function closeModal() {

    taskModal.hidden = true;

    document.body.style.overflow =
        "";

    editingTaskId = null;

    taskForm.reset();
    taskPriority.checked = false;

}



// =============================
// タスク追加
// =============================

function openAddTaskModal() {

    editingTaskId = null;


    taskForm.reset();

    modalTitle.textContent =
        "タスクを追加";


    submitButtonText.textContent =
        "保存";


    openModal();

}



// =============================
// タスク編集
// =============================

function openEditTaskModal(taskId) {

    const task =
        tasks.find(
            task =>
                task.id
                ===
                taskId
        );


    if (!task) {

        return;

    }


    editingTaskId =
        taskId;


    taskTitle.value =
        task.title;

    taskDueDate.value =
        task.dueDate
        ||
        "";

    taskPriority.checked =
    task.priority === "high";

    taskMemo.value =
        task.memo
        ||
        "";


    modalTitle.textContent =
        "タスクを編集";


    submitButtonText.textContent =
        "変更を保存";


    openModal();

}



// =============================
// タスク登録・更新
// =============================

function handleTaskSubmit(event) {

    event.preventDefault();


    const title =
        taskTitle.value.trim();

    const dueDate =
        taskDueDate.value;

    const priority =
        taskPriority.checked
            ? "high"
            : "normal";

    const memo =
        taskMemo.value.trim();


    if (!title) {

        taskTitle.focus();

        return;

    }


    // 新規登録
    if (
        editingTaskId
        ===
        null
    ) {

        const newTask = {

            id:
                Date.now(),

            title:
                title,

            dueDate:
                dueDate,

            priority:
                priority,

            memo:
                memo,

            completed:
                false,

            createdAt:
                new Date().toISOString()

        };


        tasks.push(
            newTask
        );


        saveTasks();

        refreshTaskScreen();

        closeModal();

        showToast(
            "タスクを登録しました"
        );

        return;

    }


    // 編集
    const taskIndex =
        tasks.findIndex(
            task =>
                task.id
                ===
                editingTaskId
        );


    if (
        taskIndex
        ===
        -1
    ) {

        return;

    }


    tasks[taskIndex] = {

        ...tasks[taskIndex],

        title:
            title,

        dueDate:
            dueDate,

        priority:
            priority,

        memo:
            memo

    };


    saveTasks();

    refreshTaskScreen();

    closeModal();

    showToast(
        "タスクを更新しました"
    );

}



// =============================
// 完了切り替え
// =============================

function toggleTask(taskId) {

    const task =
        tasks.find(
            task =>
                task.id
                ===
                taskId
        );


    if (!task) {

        return;

    }


    task.completed =
        !task.completed;


    saveTasks();

    refreshTaskScreen();


    if (
        task.completed
    ) {

        showToast(
            "タスクを完了しました"
        );

    } else {

        showToast(
            "タスクを未完了に戻しました"
        );

    }

}



// =============================
// タスク削除
// =============================

function deleteTask(taskId) {

    const task =
        tasks.find(
            task =>
                task.id
                ===
                taskId
        );


    if (!task) {

        return;

    }


    const confirmed =
        window.confirm(
            "このタスクを削除しますか？"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id
                !==
                taskId
        );


    saveTasks();

    refreshTaskScreen();

    showToast(
        "タスクを削除しました"
    );

}



// =============================
// フィルター切り替え
// =============================

function changeFilter(filter) {

    currentFilter =
        filter;


    filterButtons.forEach(
        button => {

            const isActive =
                button.dataset.filter
                ===
                filter;


            button.classList.toggle(
                "active",
                isActive
            );


            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        }
    );


    renderTasks();

}



// =============================
// トースト
// =============================

let toastTimer = null;


function showToast(message) {

    toastMessage.textContent =
        message;


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
// タスクカードクリック
// =============================

taskList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {

            return;

        }


        const card =
            button.closest(
                ".task-card"
            );


        if (!card) {

            return;

        }


        const taskId =
            Number(
                card.dataset.taskId
            );


        const action =
            button.dataset.action;


        if (
            action
            ===
            "toggle"
        ) {

            toggleTask(
                taskId
            );

            return;

        }


        if (
            action
            ===
            "edit"
        ) {

            openEditTaskModal(
                taskId
            );

            return;

        }


        if (
            action
            ===
            "delete"
        ) {

            deleteTask(
                taskId
            );

        }

    }
);



// =============================
// イベント
// =============================

// 戻る
backButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "main.html";

    }
);


// タスク追加
addTaskButton.addEventListener(
    "click",
    openAddTaskModal
);


// 登録・更新
taskForm.addEventListener(
    "submit",
    handleTaskSubmit
);


// モーダルを閉じる
modalCloseButton.addEventListener(
    "click",
    closeModal
);


cancelButton.addEventListener(
    "click",
    closeModal
);


taskModalOverlay.addEventListener(
    "click",
    closeModal
);


// Escキーでもモーダルを閉じる
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key
            ===
            "Escape"
            &&
            !taskModal.hidden
        ) {

            closeModal();

        }

    }
);


// フィルター
filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                changeFilter(
                    button.dataset.filter
                );

            }
        );

    }
);



// =============================
// 初期表示
// =============================

loadTasks();

refreshTaskScreen();
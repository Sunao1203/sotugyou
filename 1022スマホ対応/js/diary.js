(() => {
  'use strict';

  /* ==================================================
     保存キー
  ================================================== */
  const STORAGE_KEY = 'aiSecretaryDiary';
  const REWARD_STORAGE_KEY = 'aiSecretaryDiaryRewards';
  const MEMORY_STORAGE_KEY = 'aiSecretaryDiaryMemory';
  const VIEW_STORAGE_KEY = 'aiSecretaryDiaryCurrentView';
  const DIARY_CURSOR_STORAGE_KEY = 'aiSecretaryDiaryCursor';
  const AQUARIUM_CURSOR_STORAGE_KEY = 'aiSecretaryAquariumCursor';

  /* ==================================================
     気持ち
  ================================================== */
  const MOODS = [
    {
      key: 'excited',
      mood: 'わくわく',
      chipClass: 'mood-excited',
      barClass: 'bar-excited',
      fishClass: 'fish-excited'
    },
    {
      key: 'happy',
      mood: 'うれしい',
      chipClass: 'mood-happy',
      barClass: 'bar-happy',
      fishClass: 'fish-happy'
    },
    {
      key: 'calm',
      mood: '穏やか',
      chipClass: 'mood-calm',
      barClass: 'bar-calm',
      fishClass: 'fish-calm'
    },
    {
      key: 'tired',
      mood: 'だるい',
      chipClass: 'mood-tired',
      barClass: 'bar-tired',
      fishClass: 'fish-tired'
    },
    {
      key: 'cloudy',
      mood: 'もやもや',
      chipClass: 'mood-cloudy',
      barClass: 'bar-cloudy',
      fishClass: 'fish-cloudy'
    },
    {
      key: 'sad',
      mood: '悲しい',
      chipClass: 'mood-sad',
      barClass: 'bar-sad',
      fishClass: 'fish-sad'
    }
  ];


  /* ==================================================
     月別装飾
     画像：assets/aquarium/{月}-{番号}.png
     10月だけ旧Font Awesome
  ================================================== */

  const img = (month, no) =>
    `../assets/aquarium/${month}-${no}.png`;

  const MONTH_DECORATIONS = {
    /* ---------- 1月：お正月 ---------- */
    1: [
      
{
  name: '星',
  iconClass: 'fa-solid fa-star',
  type: 'floating',
  x: 80, y: 37,
  width: 70, height: 70,
  zIndex: 7,
  color: '#f5c85c',
  fontSize: 35
},
{
  name: '星',
  iconClass: 'fa-solid fa-star',
  type: 'floating',
  x: 90, y: 20,
  width: 70, height: 70,
  zIndex: 7,
  color: '#f5c85c',
  fontSize: 49
},

      {
        name: '門松',
        image: img(1, 1),
        type: 'floating',
        x: 14, y: 25,
        width: 122, height: 78,
        zIndex: 8,
        opacity: 0.6
      },
      {
        name: '福',
        image: img(1, 2),
        type: 'floating',
        x: 75, y: 65,
        opacity: 0.6,
        width: 70, height: 68,
        zIndex: 7
      },
      
      {
        name: '初日の出と富士山',
        image: img(1, 5),
        type: 'background',
        x: 47, y:55,
        width: 400, height: 600,
        zIndex: 2,
        opacity: 0.6
      },
      {
        name: '鏡餅',
        image: img(1, 4),
        type: 'floor',
        x: 27, y: 0,
        width: 130, height:150,
        opacity: 0.65,
        zIndex: 8
      }
      
    ],

    /* ---------- 2月：バレンタイン ---------- */
    2: [
      {
  name: 'プレゼント',
  iconClass: 'fa-solid fa-gift',
  type: 'floor',
  x: 13, y: 80,
  width: 70, height: 70,
  zIndex: 8,
  color: '#d894b7',
  fontSize: 54
},
      
      {
  name: 'キャンディ',
  iconClass: 'fa-solid fa-candy-cane',
  type: 'floor',
  x: 70, y: 25,
  width: 60, height: 60,
  zIndex: 7,
  color: '#f08ba8',
  fontSize: 50
},
      {
        name: '型',
        image: img(2, 3),
        type: 'floor',
        x: 80, y: 80,
        width: 128, height: 92,opacity: 0.6,
        zIndex: 8
      },
      {
        name: '花束',
        image: img(2, 4),
        type: 'floor',
         x: 41, y: -5,
        width: 82, height: 112,opacity: 0.7,
        zIndex: 8
      },
      {
        name: 'ハート',
        image: img(2, 1),
        type: 'background',
        x: 50, y:30,
        width: 400, height: 175,
        zIndex: 2,
        opacity: 0.5
      },
      {
        name: 'ハートうさぎ',
        image: img(2, 5),
        type: 'floor',
       x: 25, y: 20,
        width: 132, height: 88,opacity: 0.7,
        zIndex: 8
      }
      
    ],

    /* ---------- 3月：ひな祭り ---------- */
    3: [
      {
  name: '扇',
  iconClass: 'fa-solid fa-fan',
  type: 'floating',
  x: 18, y: 6,
  width: 70, height: 70,
  zIndex: 7,
  color: '#e6a7bc',
  fontSize: 54
},

{
  name: '若葉',
  iconClass: 'fa-solid fa-seedling',
  type: 'floating',
  x:42, y: 20,
  width: 60, height: 80,
  zIndex: 8,
  color: '#8dbb83',
  fontSize: 44
},

{
  name: '花',
  iconClass: 'fa-solid fa-spa',
  type: 'floating',
  x: 63, y: 10,
  width: 68, height: 68,
  zIndex: 7,
  color: '#e8a0b5',
  fontSize: 44
},


      {
        name: 'ぼんぼり',
        image: img(3, 2),
        type: 'floor',
        x: 20, y: 20,
        width: 124, height: 112,opacity: 0.6,
        zIndex: 8
      },
      {
        name: 'つるし雛',
        image: img(3, 4),
        type: 'hanging',
        x: 85, y: -10,
        width: 130, height: 142,
        opacity: 0.5,
        zIndex: 5,
      },
      {
        name: 'ひな人形',
        image: img(3, 6),
        type: 'floor',
        x: 52, y: 45,
        width: 358, height: 90,opacity: 0.6,
        zIndex: 8
      }
    ],

    /* ---------- 4月：春・お花見 ---------- */
    4: [
      {
        name: 'チューリップ',
        image: img(4, 1),
        type: 'floor',
        x: 23, y: 0,
        width: 70, height: 112,
        opacity: 0.6,
        zIndex: 8
      },
      {
        name: '桜の枝',
        image: img(4, 2),
        type: 'top',
        x: 12, y: 18,
        width: 160, height: 90,opacity: 0.9,
        zIndex: 5,
        opacity: 0.6
      },
      {
        name: '三色団子',
        image: img(4, 3),
        type: 'floating',
        x: 90, y: 58,
        width: 90, height: 76,
        opacity: 0.7,
        zIndex: 7
      },
      {
        name: 'お花見酒',
        image: img(4, 4),
        type: 'floor',
        x: 85, y: 85,
        width: 132, height: 82,
        opacity: 0.7,
        zIndex: 8
      },
      {
        name: 'お花見わんこ',
        image: img(4, 5),
        type: 'floor',
        x: 38, y: 10,
        width: 150, height: 88,
        opacity: 0.7,
        zIndex: 8
      },
      {
        name: '桜の木',
        image: img(4, 6),
        type: 'background',
        x: 55, y: 37,
        width: 420, height: 225,
        zIndex: 2,
        opacity: 0.40
      }
    ],

    /* ---------- 5月：こどもの日 ---------- */
    5: [
      {
  name: '星',
  iconClass: 'fa-solid fa-star',
  type: 'hanging',
  x: 15, y: 25,
  width: 55, height: 55,
  zIndex: 7,
  color: '#f0c75e',
  opacity: 0.7,
  fontSize: 44
},
{
  name: '星',
  iconClass: 'fa-solid fa-star',
  type: 'hanging',
  x: 6, y: 5,
  width: 55, height: 55,
  zIndex: 7,
  color: '#f0c75e',
  opacity: 0.7,
  fontSize: 58
},

      {
        name: '柏餅',
        image: img(5, 1),
        type: 'floor',
        x: 27, y: 0,
        width: 140, height: 62,
        opacity: 0.5,
        zIndex: 8
      },
      {
        name: '青い兜飾り',
        image: img(5, 2),
        type: 'top',
        x: 72, y: 0,
        width: 122, height: 56,
        opacity: 0.5,
        zIndex: 5
      },
      {
        name: '赤い兜飾り',
        image: img(5, 3),
        type: 'top',
        x: 91, y: 0,
        width: 122, height: 56,
        opacity: 0.5,
        zIndex: 5
      },
      {
        name: 'こいのぼり',
        image: img(5, 6),
        type: 'background',
        x: 52, y: 40,
        width: 300, height: 176,
        zIndex: 2,
        opacity: 0.5
      }
    ],

    /* ---------- 6月：梅雨 ---------- */
    6: [
      {
        name: 'あじさい',
        image: img(6, 1),
        type: 'floor',
        x: 23, y: 0,
        width: 155, height: 82,opacity: 0.6,
        zIndex: 8
      },
      {
        name: 'かたつむり',
        image: img(6, 2),
        type: 'floor',
        x: 38, y: 0,
        width: 92, height: 90,opacity: 0.7,
        zIndex: 8
      },
      {
        name: 'かえる',
        image: img(6, 3),
        type: 'floor',
        x: 74, y: 0,
        width: 86, height: 90,
        opacity: 0.85,
        zIndex: 8
      },
      {
        name: '雨の日うさぎ',
        image: img(6, 4),
        type: 'floating',
        x: 80, y: 4,
        width: 150, height: 88,opacity: 0.6,
        zIndex: 7
      },
      {
        name: '傘と長靴',
        image: img(6, 5),
        type: 'floor',
        x: 15, y: 90,
        width: 150, height: 75,opacity: 0.6,
        zIndex: 8
      },
      {
        name: '虹',
        image: img(6, 6),
        type: 'background',
        x: 50, y: 37,
        width: 400, height: 185,
        zIndex: 2,
        opacity: 0.5
      }
    ],

    /* ---------- 7月：七夕 ---------- */
    7: [

      {
  name: '笹の葉',
  iconClass: 'fa-solid fa-leaf',
  type: 'floor',
  x: 70, y: 15,
  width: 60, height: 60,
  zIndex: 6,
  color: '#74a985',
  fontSize: 49
},
{
  name: '月',
  iconClass: 'fa-solid fa-moon',
  type: 'top',
  x: 90, y: 16,
  width: 65, height: 65,
  zIndex: 5,
  color: '#f1d57a',
  opacity: 0.6,
  fontSize: 64
},
      {
        name: '短冊',
        image: img(7, 1),
        type: 'hanging',
        x: 11, y: 3,
        width: 100, height: 100,
        opacity: 0.6,
        zIndex: 5
      },
      {
        name: '望遠鏡',
        image: img(7, 2),
        type: 'floor',
        x: 46, y: -5,
        width: 92, height: 106,
        opacity: 0.6,
        zIndex: 8
      },
      {
        name: '星空',
        image: img(7, 3),
        type: 'background',
        x: 48, y: 25,
        width: 350, height: 190,opacity: 0.9,
        zIndex: 2,
        opacity: 0.42
      },
      {
        name: 'パンダ',
        image: img(7, 4),
        type: 'floor',
        x: 27, y: 10,
        width: 155, height: 125,
        opacity: 0.6,
        zIndex: 7
      }
    ],

    /* ---------- 8月：夏祭り ---------- */
    8: [
      {
  name: '星',
  iconClass: 'fa-solid fa-star',
  type: 'top',
  x: 35, y: 45,
  width: 75, height: 75,
  zIndex: 6,
  color: '#f0c75c',
  opacity: 0.6,
  fontSize: 44
},
{
  name: '月',
  iconClass: 'fa-solid fa-moon',
  type: 'top',
  x: 50, y: 26,
  width: 65, height: 65,
  zIndex: 5,
  color: '#f1d57a',
  opacity: 0.6,
  fontSize: 70
},
{
        name: '焼きそば',
        image: img(8, 1),
        type: 'floating',
        x: 14, y: 48,
        opacity: 0.6,
        width: 110, height: 68,
        zIndex: 7
      },

      {
        name: '屋形船',
        image: img(8, 3),
        type: 'floating',
        x: 20, y: 13,
        opacity: 0.6,
        width: 190, height: 68,
        zIndex: 7
      },
      {
        name: '花火',
        image: img(8, 4),
        type: 'floor',
        x: 80, y: 60,
        width: 280, height: 200,
        zIndex: 2,opacity: 0.9
      },
      {
        name: 'お祭りの仲間たち',
        image: img(8, 6),
        type: 'floor',
        x: 50, y: 38,
        width: 400, height: 82,
        opacity: 0.6,
        zIndex: 8
      }
    ],

    /* ---------- 9月：お月見 ---------- */
    9: [
      {
  name: '秋の葉',
  iconClass: 'fa-solid fa-leaf',
  type: 'floating',
  x: 8, y: 35,
  width: 55, height: 55,
  zIndex: 7,
  color: '#c68d52',
  fontSize: 44
},
{
  name: '秋風',
  iconClass: 'fa-solid fa-wind',
  type: 'floating',
  x: 12, y: 8,
  width: 75, height: 55,
  zIndex: 6,
  color: '#b4a98c',
  fontSize: 54
},
      {
        name: '月見うどん',
        image: img(9, 1),
        type: 'floor',
        x: 82, y: 40,
        width: 120, height: 64,
        opacity: 0.55,
        zIndex: 8
      },
      {
        name: '金木犀',
        image: img(9, 4),
        type: 'floating',
        x: 85, y: 14,
        width: 110, height: 72,
        opacity: 0.5,
        zIndex: 7
      },
      
      {
        name: '餅つきうさぎ',
        image: img(9, 3),
        type: 'floor',
        x: 28, y: 15,
        width: 230, height: 90,
        opacity: 0.6,
        zIndex: 8
      },
      {
        name: '十五夜',
        image: img(9, 6),
        type: 'background',
        x: 49, y: 26,
        width: 335, height: 190,
        zIndex: 2,
        opacity: 0.46
      }
    ],

    /* ---------- 10月：ハロウィン ---------- */
    10: [
      {
        name: '黒猫',
        iconClass: 'fa-solid fa-cat',
        type: 'floor',
        x: 73, y: 0,
        width: 58, height: 58,
        zIndex: 8,
        color: '#4b4961',
        fontSize: 54
      },
      {
        name: 'おばけ',
        iconClass: 'fa-solid fa-ghost',
        type: 'floating',
        x: 80, y: 50,
        width: 62, height: 52,
        zIndex: 7,
        color: '#eeeaf4',
        fontSize: 47
      },
      {
        name: 'クモ',
        iconClass: 'fa-solid fa-spider',
        type: 'hanging',
        x: 91, y: 4,
        width: 122, height: 72,
        zIndex: 7,
        color: '#565269',
        fontSize: 37
      },
      
      {
        name: 'かぼちゃ',
        image: img(10, 5),
        type: 'hanging',
        x: 12, y: -10,
        width: 110, height: 190,
        zIndex: 2,
        opacity: 0.55
      },
      {
        name: 'マカロン',
        image: img(10, 4),
        type: 'hanging',
        x: 13, y: 45,
        width: 110, height: 116,opacity: 0.7,
        zIndex: 7
      },
      {
        name: 'お城',
        image: img(10, 6),
        type: 'background',
        x: 49, y: 45,
        width: 405, height: 190,
        zIndex: 2,
        opacity: 0.46
      }
    ],

    /* ---------- 11月：秋 ---------- */
    11: [
      {
  name: '落ち葉',
  iconClass: 'fa-solid fa-leaf',
  type: 'floating',
  x: 87, y: 8,
  width: 55, height: 55,
  zIndex: 7,
  color: '#c47749',
  opacity: 0.7,
  fontSize: 40
},

{
  name: '秋風',
  iconClass: 'fa-solid fa-wind',
  type: 'floating',
  x: 80, y: 35,
  width: 80, height: 60,
  zIndex: 6,
  color: '#b8a489',
  opacity: 0.7,
  fontSize: 32
},
      {
  name: '木',
  iconClass: 'fa-solid fa-tree',
  type: 'floor',
  x: 19, y: 11,
  width: 75, height: 100,
  zIndex:7,
  color: '#8e765e',
   opacity: 0.7,
  fontSize: 90
},
      {
        name: 'もみじとイチョウ',
        image: img(11, 1),
        type: 'top',
        x: 15, y: 16,
        width: 138, height: 78,
        opacity: 0.5,
        zIndex: 5,
      },
      {
        name: '秋ねこ',
        image: img(11, 4),
        type: 'floor',
        x: 75, y: 25,
        width: 141, height: 80,
        opacity: 0.6,
        zIndex: 8
      },
      
      {
        name: '芋',
        image: img(11, 6),
        type: 'background',
        x: 50, y: 30,
        width: 350, height: 190,
        zIndex: 2,
        opacity: 0.42
      }
    ],

    /* ---------- 12月：クリスマス ---------- */
    12: [

      {
  name: '雪の結晶',
  iconClass: 'fa-solid fa-snowflake',
  type: 'floating',
  x: 78, y: 44,
  width: 60, height: 60,
  zIndex: 7,
  color: '#e5f3fa',
  opacity: 0.5,
  fontSize: 50
},
{
  name: 'ベル',
  iconClass: 'fa-solid fa-bell',
  type: 'hanging',
  x: 71, y: 65,
  width: 35, height: 70,
  zIndex: 7,
  color: '#dfbc57',
  opacity: 0.5,
  fontSize: 48
},

      {
        name: 'プレゼント',
        image: img(12, 1),
        type: 'floating',
        x: 12, y: 12,
        width: 120, height: 92,
        opacity: 0.5,
        zIndex: 7
      },
      {
        name: 'クリスマスリース',
        image: img(12, 2),
        type: 'hanging',
        x: 17, y: 45,
        width: 92, height: 78,
        opacity: 0.5,
        zIndex: 7
      },
      {
        name: 'サンタのそり',
        image: img(12, 3),
        type: 'top',
        x: 84, y: 7,
        width: 250, height: 70,
        opacity: 0.6,
        zIndex: 5
      },
      
      {
        name: 'クリスマスツリー',
        image: img(12, 6),
        type: 'floor',
        x: 46, y: -25,
        opacity: 0.4,
        width: 260, height: 600,
        zIndex: 8
      }
    ]
  };


  /* ==================================================
     状態
  ================================================== */

  const els = {};

  let selectedMoodKey = null;

  let diaryCursor =
  firstDayOfMonth(new Date());

let aquariumCursor =
  firstDayOfMonth(new Date());

  let toastTimer = null;


  document.addEventListener('DOMContentLoaded', init);


function init() {
  cacheElements();
  bindEvents();
  ensureDemoDiaryData();

  renderMoodPicker();
  renderDiaryList();
  renderAquarium();

  // 初期表示は現在月のアクアリウム
  switchView('aquarium');
}


  /* ==================================================
     DOM
  ================================================== */

  function cacheElements() {
    els.backButton = document.getElementById('backButton');

    els.segmentButtons = [
      ...document.querySelectorAll('.diary-segment-button')
    ];

    els.panels = [
      ...document.querySelectorAll('.diary-view-panel')
    ];

    els.openDiarySheet = document.getElementById('openDiarySheet');
    els.emptyAddButton = document.getElementById('emptyAddButton');

    els.sheetBackdrop = document.getElementById('diarySheetBackdrop');
    els.closeDiarySheet = document.getElementById('closeDiarySheet');
    els.diaryText = document.getElementById('diaryText');
    els.moodPicker = document.getElementById('moodPicker');
    els.saveToDatabase = document.getElementById('saveToDatabase');
    els.saveDiaryButton = document.getElementById('saveDiaryButton');

    els.diaryList = document.getElementById('diaryList');
    els.diaryMonthHeading = document.getElementById('diaryMonthHeading');
    els.diaryEmptyState = document.getElementById('diaryEmptyState');
    els.diaryPrevMonth = document.getElementById('diaryPrevMonth');
    els.diaryNextMonth = document.getElementById('diaryNextMonth');

    els.prevMonth = document.getElementById('prevMonth');
    els.nextMonth = document.getElementById('nextMonth');
    els.aquariumMonthLabel = document.getElementById('aquariumMonthLabel');
    els.aquariumShell = document.getElementById('aquariumShell');
    els.monthDecoration = document.getElementById('monthDecoration');
    els.aquariumFishLayer = document.getElementById('aquariumFishLayer');
    els.dropTransitionLayer = document.getElementById('dropTransitionLayer');

  els.recordedDays =
  document.getElementById('recordedDays');

els.mostCommonMood =
  document.getElementById('mostCommonMood');

els.moodStats =
  document.getElementById('moodStats');

els.moodPieChart =
  document.getElementById('moodPieChart');

els.moodPieTotal =
  document.getElementById('moodPieTotal');

els.monthlyComment =
  document.getElementById('monthlyComment');



    els.unlockProgressText = document.getElementById('unlockProgressText');
    els.unlockProgressBar = document.getElementById('unlockProgressBar');
    els.unlockBadges = document.getElementById('unlockBadges');

    els.rewardBackdrop = document.getElementById('rewardBackdrop');
    els.rewardIcon = document.getElementById('rewardIcon');
    els.rewardDescription = document.getElementById('rewardDescription');
    els.rewardCloseButton = document.getElementById('rewardCloseButton');

    els.diaryToast = document.getElementById('diaryToast');
    els.diaryToastText = document.getElementById('diaryToastText');
  }


  /* ==================================================
     イベント
  ================================================== */

  function bindEvents() {
    els.backButton.addEventListener('click', () => {
      if (history.length > 1) {
        history.back();
      } else {
        location.href = 'main.html';
      }
    });

    els.segmentButtons.forEach(button => {
      button.addEventListener('click', () => {
        switchView(button.dataset.view);
      });
    });

    els.openDiarySheet.addEventListener('click', openSheet);

    if (els.emptyAddButton) {
      els.emptyAddButton.addEventListener('click', openSheet);
    }

    els.closeDiarySheet.addEventListener('click', closeSheet);

    els.sheetBackdrop.addEventListener('click', event => {
      if (event.target === els.sheetBackdrop) {
        closeSheet();
      }
    });

    els.saveDiaryButton.addEventListener('click', saveDiaryEntry);

    els.diaryPrevMonth.addEventListener('click', () => {
      changeDiaryMonth(-1);
    });

    els.diaryNextMonth.addEventListener('click', () => {
      changeDiaryMonth(1);
    });

    els.prevMonth.addEventListener('click', () => {
      changeAquariumMonth(-1);
    });

    els.nextMonth.addEventListener('click', () => {
      changeAquariumMonth(1);
    });

    els.rewardCloseButton.addEventListener('click', () => {
      closeReward();
      switchView('aquarium');
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') {
        return;
      }

      if (!els.rewardBackdrop.hidden) {
        closeReward();
        return;
      }

      if (!els.sheetBackdrop.hidden) {
        closeSheet();
      }
    });
  }


  /* ==================================================
     タブ
  ================================================== */

  function switchView(view) {
    localStorage.setItem(
      VIEW_STORAGE_KEY,
      view
    );

    els.segmentButtons.forEach(button => {
      const active = button.dataset.view === view;

      button.classList.toggle('is-active', active);

      button.setAttribute(
        'aria-selected',
        active ? 'true' : 'false'
      );
    });

    els.panels.forEach(panel => {
      const active = panel.dataset.panel === view;

      panel.hidden = !active;

      panel.classList.toggle(
        'is-active',
        active
      );
    });

    if (view === 'aquarium') {
      renderAquarium();
    }
  }


  /* ==================================================
     日記追加
  ================================================== */

  function openSheet() {
    els.sheetBackdrop.hidden = false;

    requestAnimationFrame(() => {
      els.sheetBackdrop.classList.add('is-open');
    });

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      els.diaryText.focus();
    }, 220);
  }


  function closeSheet() {
    els.sheetBackdrop.classList.remove('is-open');

    document.body.style.overflow = '';

    setTimeout(() => {
      els.sheetBackdrop.hidden = true;
      resetSheet();
    }, 240);
  }


  function resetSheet() {
    selectedMoodKey = null;

    els.diaryText.value = '';

    els.saveToDatabase.checked = false;

    els.saveDiaryButton.disabled = true;

    renderMoodPicker();
  }


  function renderMoodPicker() {
    els.moodPicker.innerHTML =
      MOODS.map(item => `
        <button
          type="button"
          class="
            mood-choice
            ${
              selectedMoodKey === item.key
                ? 'is-selected'
                : ''
            }
          "
          data-mood-key="${item.key}"
          role="radio"
          aria-checked="${selectedMoodKey === item.key}"
        >
          <span class="mood-choice-check">
            <i
              class="fa-solid fa-check"
              aria-hidden="true"
            ></i>
          </span>

          ${renderFish(
            item,
            'mood-fish'
          )}

          <span class="mood-choice-label">
            ${item.mood}
          </span>
        </button>
      `).join('');

    els.moodPicker
      .querySelectorAll('.mood-choice')
      .forEach(button => {
        button.addEventListener('click', () => {
          selectedMoodKey = button.dataset.moodKey;

          els.saveDiaryButton.disabled = false;

          renderMoodPicker();
        });
      });
  }


  function renderFish(
    mood,
    rootClass = 'mood-fish'
  ) {
    return `
      <span
        class="${rootClass} ${mood.fishClass}"
        aria-hidden="true"
      >
        <span class="fish-graphic">
          <span class="fish-tail"></span>
          <span class="fish-body"></span>
          <span class="fish-fin"></span>
          <span class="fish-eye"></span>
          <span class="fish-mouth"></span>
          <span class="fish-extra"></span>
        </span>
      </span>
    `;
  }


  async function saveDiaryEntry() {
    const mood =
      MOODS.find(
        item =>
          item.key === selectedMoodKey
      );

    if (!mood) {
      return;
    }

    const now = new Date();

    const dateKey =
      formatDateKey(now);

    const beforeEntries =
      getEntries();

    const beforeDistinctDays =
      getEntriesForMonth(
        beforeEntries,
        now.getFullYear(),
        now.getMonth() + 1
      )
      .reduce(
        (set, entry) => {
          set.add(entry.date);
          return set;
        },
        new Set()
      )
      .size;

    const entry = {
      id: createId(),

      date: dateKey,

      text:
        els.diaryText.value.trim(),

      mood: mood.mood,

      moodKey: mood.key,

      saveToDatabase:
        els.saveToDatabase.checked,

      isDemoData: false,

      createdAt:
        now.toISOString()
    };

    saveEntries([
      ...beforeEntries,
      entry
    ]);

    if (entry.saveToDatabase) {
      saveMemoryEntry(entry);
    }

    const afterEntries =
      getEntries();

    const afterDistinctDays =
      getEntriesForMonth(
        afterEntries,
        now.getFullYear(),
        now.getMonth() + 1
      )
      .reduce(
        (set, item) => {
          set.add(item.date);
          return set;
        },
        new Set()
      )
      .size;

    const reward =
      getNewRewardForProgress(
        beforeDistinctDays,
        afterDistinctDays,
        now.getFullYear(),
        now.getMonth() + 1
      );

    diaryCursor =
      firstDayOfMonth(now);

    aquariumCursor =
      firstDayOfMonth(now);

    saveMonth(
      DIARY_CURSOR_STORAGE_KEY,
      diaryCursor
    );

    saveMonth(
      AQUARIUM_CURSOR_STORAGE_KEY,
      aquariumCursor
    );

    closeSheet();

    renderDiaryList();

    renderAquarium();

    showToast(
      entry.saveToDatabase
        ? '日記を保存し、AI秘書にも覚える設定にしました'
        : '日記を保存しました'
    );

    await playDropToFish(mood);

    if (reward) {
      setTimeout(() => {
        openReward(
          reward.item,
          reward.label
        );

        markRewardAsSeen(
          now.getFullYear(),
          now.getMonth() + 1,
          reward.index
        );
      }, 420);
    }
  }


  /* ==================================================
     日記一覧
  ================================================== */

  function changeDiaryMonth(delta) {
    diaryCursor = new Date(
      diaryCursor.getFullYear(),
      diaryCursor.getMonth() + delta,
      1
    );

    saveMonth(
      DIARY_CURSOR_STORAGE_KEY,
      diaryCursor
    );

    renderDiaryList();
  }


  function renderDiaryList() {
    const year =
      diaryCursor.getFullYear();

    const month =
      diaryCursor.getMonth() + 1;

    const entries =
      getEntriesForMonth(
        getEntries(),
        year,
        month
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

    els.diaryMonthHeading.textContent =
      `${year}年${month}月`;

    els.diaryEmptyState.hidden =
      entries.length !== 0;

    if (!entries.length) {
      els.diaryList.innerHTML = '';
      return;
    }

    els.diaryList.innerHTML =
      entries.map(entry => {
        const mood =
          MOODS.find(
            item =>
              item.mood === entry.mood ||
              item.key === entry.moodKey
          ) ||
          MOODS[0];

        return `
          <article
            class="diary-card"
            data-entry-id="${escapeHtml(entry.id)}"
          >
            <h3 class="diary-card-date">
              ${formatJapaneseDate(entry.date)}
            </h3>

            <p class="diary-card-text">${
              escapeHtml(
                entry.text ||
                '今日のこころを記録しました。'
              )
            }</p>

            <div class="diary-card-footer">
              <span
                class="diary-mood-chip ${mood.chipClass}"
              >
                ${mood.mood}
              </span>

              <button
                type="button"
                class="delete-entry-button"
                data-entry-id="${escapeHtml(entry.id)}"
                aria-label="この日記を削除"
              >
                <i
                  class="fa-regular fa-trash-can"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </article>
        `;
      }).join('');

    els.diaryList
      .querySelectorAll('.delete-entry-button')
      .forEach(button => {
        button.addEventListener('click', () => {
          deleteEntry(
            button.dataset.entryId
          );
        });
      });
  }


  function deleteEntry(id) {
    const entries =
      getEntries();

    const target =
      entries.find(
        entry =>
          entry.id === id
      );

    const nextEntries =
      entries.filter(
        entry =>
          entry.id !== id
      );

    saveEntries(nextEntries);

    if (target?.saveToDatabase) {
      removeMemoryEntry(id);
    }

    renderDiaryList();

    renderAquarium();

    showToast(
      '日記を削除しました'
    );
  }


  /* ==================================================
     アクアリウム
  ================================================== */

  function changeAquariumMonth(delta) {
    aquariumCursor = new Date(
      aquariumCursor.getFullYear(),
      aquariumCursor.getMonth() + delta,
      1
    );

    saveMonth(
      AQUARIUM_CURSOR_STORAGE_KEY,
      aquariumCursor
    );

    renderAquarium();
  }


  function renderAquarium() {
    const year =
      aquariumCursor.getFullYear();

    const month =
      aquariumCursor.getMonth() + 1;

    const entries =
      getEntriesForMonth(
        getEntries(),
        year,
        month
      );

    els.aquariumMonthLabel.textContent =
      `${year}年${month}月`;

    const recordedDays =
      new Set(
        entries.map(
          entry =>
            entry.date
        )
      ).size;

    setSeasonClass(month);

    renderAquariumFish(
      entries
    );

    renderMonthDecorations(
      month,
      recordedDays,
      year
    );

    renderUnlockProgress(
      month,
      recordedDays,
      year
    );

    renderMonthlySummary(
      entries
    );
  }


  function setSeasonClass(month) {
    els.aquariumShell
      .classList
      .remove(
        'season-spring',
        'season-summer',
        'season-autumn',
        'season-winter'
      );

    if (
      [3, 4, 5].includes(month)
    ) {
      els.aquariumShell
        .classList
        .add('season-spring');

    } else if (
      [6, 7, 8].includes(month)
    ) {
      els.aquariumShell
        .classList
        .add('season-summer');

    } else if (
      [9, 10, 11].includes(month)
    ) {
      els.aquariumShell
        .classList
        .add('season-autumn');

    } else {
      els.aquariumShell
        .classList
        .add('season-winter');
    }
  }


  function renderAquariumFish(
    entries
  ) {
    const counts =
      Object.fromEntries(
        MOODS.map(
          item => [
            item.mood,
            0
          ]
        )
      );

    entries.forEach(
      entry => {
        if (
          entry.mood in counts
        ) {
          counts[
            entry.mood
          ]++;
        }
      }
    );

    const activeMoods =
      MOODS.filter(
        item =>
          counts[
            item.mood
          ] > 0
      );

    const topPositions = [
      10,
      27,
      46,
      63,
      18,
      52
    ];

    els.aquariumFishLayer.innerHTML =
      activeMoods.map(
        (mood, index) => {
          const count =
            counts[
              mood.mood
            ];

          const size =
            Math.min(
              0.76 +
              (count - 1) *
              0.075,

              1.48
            );

          const duration =
            15 +
            (
              (
                index * 3
              ) %
              8
            );

          const delay =
            -(
              index * 2.5
            );

          const swimLeft =
            index % 2 === 1;

          return `
            <span
              class="
                aquarium-fish
                ${mood.fishClass}
                ${
                  swimLeft
                    ? 'swim-left'
                    : ''
                }
              "
              style="
                top:${
                  topPositions[
                    index %
                    topPositions.length
                  ]
                }%;

                animation-duration:
                  ${duration}s;

                animation-delay:
                  ${delay}s;

                scale:
                  ${size};
              "
              title="${
                escapeHtml(
                  mood.mood
                )
              }：${count}回"
            >
              <span class="fish-graphic">
                <span class="fish-tail"></span>
                <span class="fish-body"></span>
                <span class="fish-fin"></span>
                <span class="fish-eye"></span>
                <span class="fish-mouth"></span>
                <span class="fish-extra"></span>
              </span>
            </span>
          `;
        }
      ).join('');
  }


  function renderMonthDecorations(
    month,
    recordedDays,
    year
  ) {
    const decorations =
      MONTH_DECORATIONS[
        month
      ] || [];

    const unlockedCount =
      getUnlockedDecorationCount(
        recordedDays,
        year,
        month
      );

    els.monthDecoration.innerHTML =
      decorations
        .slice(
          0,
          unlockedCount
        )
        .map(
          (item, index) => {
            return `
              <span
                class="
                  month-deco-item
                  deco-${item.type}
                "
                title="${
                  escapeHtml(
                    item.name
                  )
                }"
                style="
                  --deco-x:
                    ${item.x}%;

                  --deco-y:
                    ${item.y}%;

                  --deco-width:
                    ${
                      item.width ||
                      60
                    }px;

                  --deco-height:
                    ${
                      item.height ||
                      60
                    }px;

                  --deco-z:
                    ${
                      item.zIndex ||
                      5
                    };

                  --deco-opacity:
                    ${
                      item.opacity ??
                      1
                    };

                  --deco-color:
                    ${
                      item.color ||
                      '#fff'
                    };

                  --deco-font-size:
                    ${
                      item.fontSize ||
                      34
                    }px;

                  --deco-delay:
                    ${
                      -(
                        index *
                        0.55
                      )
                    }s;
                "
              >
                ${
                  getDecorationGraphicHTML(
                    item
                  )
                }
              </span>
            `;
          }
        )
        .join('');
  }


  function getDecorationGraphicHTML(
    item
  ) {
    if (!item) {
      return '';
    }

    if (
      item.image
    ) {
      return `
        <img
          class="deco-image"
          src="${
            escapeHtml(
              item.image
            )
          }"
          alt=""
          draggable="false"
        >
      `;
    }

    if (
      item.iconClass
    ) {
      return `
        <i
          class="
            deco-fa
            ${
              escapeHtml(
                item.iconClass
              )
            }
          "
          aria-hidden="true"
        ></i>
      `;
    }

    return '';
  }


  /* ==================================================
     コレクション
  ================================================== */

  function renderUnlockProgress(
    month,
    recordedDays,
    year
  ) {
    const decorations =
      MONTH_DECORATIONS[
        month
      ] || [];

    const milestones =
      getMilestones(
        year,
        month
      );

    const unlockedCount =
      getUnlockedDecorationCount(
        recordedDays,
        year,
        month
      );

    els.unlockProgressText.textContent =
      `${unlockedCount} / 6`;

    els.unlockProgressBar.style.width =
      `${
        (
          unlockedCount /
          6
        ) *
        100
      }%`;

    els.unlockBadges.innerHTML =
      decorations.map(
        (item, index) => {
          const unlocked =
            index <
            unlockedCount;

          const milestone =
            milestones[
              index
            ];

          return `
            <div
  class="
    unlock-badge
    ${
      unlocked
        ? 'is-unlocked'
        : ''
    }
  "
>
              <span
  class="unlock-badge-icon"
  style="
    --deco-color: ${item.color || '#8a8390'};
    --deco-font-size: ${item.fontSize || 21}px;
  "
>
                ${
                  unlocked
                    ?
                    getDecorationGraphicHTML(
                      item
                    )
                    :
                    `
                      <i
                        class="
                          fa-solid
                          fa-lock
                          unlock-lock
                        "
                        aria-hidden="true"
                      ></i>
                    `
                }
              </span>

              <span
                class="unlock-badge-label"
              >
                ${
                  milestone.label
                }
              </span>
            </div>
          `;
        }
      ).join('');
  }


  function getMilestones(
    year,
    month
  ) {
    const lastDay =
      daysInMonth(
        year,
        month - 1
      );

    return [
      {
        days: 5,
        label: '5日'
      },
      {
        days: 10,
        label: '10日'
      },
      {
        days: 15,
        label: '15日'
      },
      {
        days: 20,
        label: '20日'
      },
      {
        days: 25,
        label: '25日'
      },
      {
        days: lastDay,
        label: 'COMPLETE'
      }
    ];
  }


  function getUnlockedDecorationCount(
    recordedDays,
    year,
    month
  ) {
    return getMilestones(
      year,
      month
    )
    .filter(
      item =>
        recordedDays >=
        item.days
    )
    .length;
  }


  function getNewRewardForProgress(
    beforeDays,
    afterDays,
    year,
    month
  ) {
    const milestones =
      getMilestones(
        year,
        month
      );

    const decorations =
      MONTH_DECORATIONS[
        month
      ] || [];

    for (
      let index =
        milestones.length - 1;

      index >= 0;

      index--
    ) {
      const milestone =
        milestones[
          index
        ];

      if (
        beforeDays <
          milestone.days &&

        afterDays >=
          milestone.days &&

        !hasRewardBeenSeen(
          year,
          month,
          index
        )
      ) {
        return {
          index: index,

          item:
            decorations[
              index
            ],

          label:
            milestone.label
        };
      }
    }

    return null;
  }


  function openReward(
    item,
    label
  ) {
    if (!item) {
      return;
    }

    els.rewardIcon.innerHTML =
      getDecorationGraphicHTML(
        item
      );

    els.rewardDescription.textContent =
      `${label}達成！「${item.name}」がアクアリウムに追加されました。`;

    els.rewardBackdrop.hidden =
      false;

    requestAnimationFrame(
      () => {
        els.rewardBackdrop
          .classList
          .add(
            'is-open'
          );
      }
    );

    document.body.style.overflow =
      'hidden';
  }


  function closeReward() {
    els.rewardBackdrop
      .classList
      .remove(
        'is-open'
      );

    document.body.style.overflow =
      '';

    setTimeout(
      () => {
        els.rewardBackdrop.hidden =
          true;
      },
      220
    );
  }


  /* ==================================================
     月まとめ
  ================================================== */

  function renderMonthlySummary(
  entries
) {
  const counts =
    Object.fromEntries(
      MOODS.map(
        item => [
          item.mood,
          0
        ]
      )
    );

  entries.forEach(
    entry => {
      if (
        entry.mood in counts
      ) {
        counts[
          entry.mood
        ]++;
      }
    }
  );

  const distinctDays =
    new Set(
      entries.map(
        entry =>
          entry.date
      )
    ).size;

  els.recordedDays.textContent =
    String(distinctDays);


  /* =========================
     一番多かった気持ち
  ========================= */

  const maxCount =
    Math.max(
      0,
      ...Object.values(counts)
    );

  const mostCommon =
    maxCount === 0
      ? null
      : MOODS.find(
          item =>
            counts[item.mood] ===
            maxCount
        );

  els.mostCommonMood.textContent =
    mostCommon
      ? mostCommon.mood
      : 'まだありません';


  /* =========================
     円グラフ
  ========================= */

  const totalMoodCount =
    Object.values(counts)
      .reduce(
        (sum, count) =>
          sum + count,
        0
      );

  const moodColors = {
    'わくわく': '#f4bf46',
    'うれしい': '#f28ba7',
    '穏やか': '#70c5bd',
    'だるい': '#9b8ad6',
    'もやもや': '#7e89ab',
    '悲しい': '#65abe0'
  };


  /* 円グラフ中央 */

  if (els.moodPieTotal) {
    els.moodPieTotal.textContent =
      String(distinctDays);
  }


  /* 円グラフ本体 */

  let currentPercent = 0;

  const pieSegments =
    MOODS
      .filter(
        item =>
          counts[item.mood] > 0
      )
      .map(
        item => {
          const count =
            counts[item.mood];

          const percentage =
            totalMoodCount === 0
              ? 0
              :
              (
                count /
                totalMoodCount
              ) *
              100;

          const start =
            currentPercent;

          const end =
            currentPercent +
            percentage;

          currentPercent = end;

          return (
            `${moodColors[item.mood]} ` +
            `${start}% ${end}%`
          );
        }
      );


  if (els.moodPieChart) {
    if (
      totalMoodCount === 0
    ) {
      els.moodPieChart.style.background =
        '#eeeef2';

    } else {
      els.moodPieChart.style.background =
        `conic-gradient(${pieSegments.join(',')})`;
    }
  }


  /* =========================
     円グラフ凡例
  ========================= */

  els.moodStats.innerHTML =
    MOODS.map(
      item => {
        const count =
          counts[item.mood];

        const percentage =
          totalMoodCount === 0
            ? 0
            : Math.round(
                (
                  count /
                  totalMoodCount
                ) *
                100
              );

        return `
          <div class="mood-legend-row">

            <span
              class="mood-legend-color"
              style="
                background:
                  ${moodColors[item.mood]};
              "
            ></span>

            <span class="mood-legend-name">
              ${item.mood}
            </span>

            <strong class="mood-legend-value">
              ${count}
              <small>
                ${percentage}%
              </small>
            </strong>

          </div>
        `;
      }
    ).join('');


  /* =========================
     AIコメント
  ========================= */

  els.monthlyComment.textContent =
    generateMonthlyComment(
      counts,
      distinctDays
    );
}

  function generateMonthlyComment(
    counts,
    distinctDays
  ) {
    if (
      !distinctDays
    ) {
      return (
        'この月は、まだこころの記録がありません。\n' +
        '気が向いた日に、ひとつずつ残してみましょう。'
      );
    }

    const topMood =
      MOODS.reduce(
        (
          best,
          item
        ) => {
          if (!best) {
            return item;
          }

          return (
            counts[
              item.mood
            ] >
            counts[
              best.mood
            ]
          )
            ? item
            : best;
        },
        null
      );

    const comments = {
      'わくわく':
        '新しいことを楽しみにできた時間が多かったのかもしれませんね。',

      'うれしい':
        'うれしい出来事をたくさん見つけられた月だったようです。',

      '穏やか':
        '落ち着いて過ごせた時間が、いつもより多かったのかもしれません。',

      'だるい':
        '少し疲れがたまっていた月かもしれません。休める時間も大切に。',

      'もやもや':
        '考えることが多い月だったようです。言葉にするだけでも整理につながります。',

      '悲しい':
        '気持ちが沈む日もあったようです。日記に残せたことも大切な記録です。'
    };

    return (
      `今月は「${topMood.mood}」の気持ちが一番多かったようです。\n` +
      comments[
        topMood.mood
      ]
    );
  }


  /* ==================================================
     水滴 → 魚
  ================================================== */

  function playDropToFish(
    mood
  ) {
    return new Promise(
      resolve => {
        if (
          !els.dropTransitionLayer
        ) {
          resolve();
          return;
        }

        els.dropTransitionLayer.innerHTML =
          `
            <span
              class="magic-drop"
            ></span>
          `;

        const drop =
          els.dropTransitionLayer
            .querySelector(
              '.magic-drop'
            );

        setTimeout(
          () => {
            drop?.classList.add(
              'is-transforming'
            );
          },
          760
        );

        setTimeout(
          () => {
            els.dropTransitionLayer.innerHTML =
              `
                <span
                  class="magic-fish"
                >
                  ${
                    renderFish(
                      mood,
                      'mood-fish'
                    )
                  }
                </span>
              `;
          },
          980
        );

        setTimeout(
          () => {
            els.dropTransitionLayer.innerHTML =
              '';

            resolve();
          },
          1580
        );
      }
    );
  }


  /* ==================================================
     LocalStorage
  ================================================== */

  function getEntries() {
    try {
      const value =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          ) ||
          '[]'
        );

      return Array.isArray(
        value
      )
        ? value
        : [];

    } catch {
      return [];
    }
  }


  function saveEntries(
    entries
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        entries
      )
    );
  }


  function getEntriesForMonth(
    entries,
    year,
    month
  ) {
    return entries.filter(
      entry => {
        const date =
          parseLocalDate(
            entry.date
          );

        return (
          date.getFullYear() ===
            year &&

          date.getMonth() + 1 ===
            month
        );
      }
    );
  }


  /* ==================================================
     AI秘書にも覚えてもらう
     ※現時点では仮LocalStorage
  ================================================== */

  function saveMemoryEntry(
    entry
  ) {
    try {
      const memories =
        JSON.parse(
          localStorage.getItem(
            MEMORY_STORAGE_KEY
          ) ||
          '[]'
        );

      const safeMemories =
        Array.isArray(
          memories
        )
          ? memories
          : [];

      const next = [
        ...safeMemories.filter(
          item =>
            item.diaryId !==
            entry.id
        ),

        {
          diaryId:
            entry.id,

          date:
            entry.date,

          text:
            entry.text,

          mood:
            entry.mood,

          createdAt:
            entry.createdAt
        }
      ];

      localStorage.setItem(
        MEMORY_STORAGE_KEY,
        JSON.stringify(
          next
        )
      );

    } catch {
      /* 将来DBへ置換 */
    }
  }


  function removeMemoryEntry(
    diaryId
  ) {
    try {
      const memories =
        JSON.parse(
          localStorage.getItem(
            MEMORY_STORAGE_KEY
          ) ||
          '[]'
        );

      const next =
        Array.isArray(
          memories
        )
          ?
          memories.filter(
            item =>
              item.diaryId !==
              diaryId
          )
          :
          [];

      localStorage.setItem(
        MEMORY_STORAGE_KEY,
        JSON.stringify(
          next
        )
      );

    } catch {
      /* 何もしない */
    }
  }


  /* ==================================================
     2026/02〜2027/01
     テスト日記
  ================================================== */

  function ensureDemoDiaryData() {
    const entries =
      getEntries();

    const existingDemoDates =
      new Set(
        entries
          .filter(
            entry =>
              entry.isDemoData
          )
          .map(
            entry =>
              entry.date
          )
      );

    const sampleTexts = [
      '今日はゆっくり過ごせた。少し気持ちが整った気がする。',

      '学校で新しいことを学んだ。できることが増えるとうれしい。',

      '友達と話してたくさん笑った。いい気分転換になった。',

      'やることが多くて少し疲れた。今日は早めに休みたい。',

      '気になっていた予定を整理した。少し安心できた。',

      '好きなことをして過ごした。こういう時間も大切にしたい。',

      '新しい場所に行ってみたい。次の休みの予定を考えた。',

      '今日は少しもやもやしたけど、日記に書いたら整理できた。',

      '小さなことだけど、できたことがあってうれしかった。',

      '落ち着いた一日だった。明日も無理せず過ごしたい。'
    ];

    const moodCycle = [
      'excited',
      'happy',
      'calm',
      'calm',
      'tired',
      'cloudy',
      'happy',
      'excited',
      'sad',
      'calm'
    ];

    const demoEntries =
      [];

    const cursor =
      new Date(
        2026,
        1,
        1
      );

    const end =
      new Date(
        2027,
        0,
        31
      );

    let index = 0;

    while (
      cursor <= end
    ) {
      const dateKey =
        formatDateKey(
          cursor
        );

      if (
        !existingDemoDates.has(
          dateKey
        )
      ) {
        const mood =
          MOODS.find(
            item =>
              item.key ===
              moodCycle[
                index %
                moodCycle.length
              ]
          ) ||
          MOODS[0];

        demoEntries.push({
          id:
            `demo-${dateKey}`,

          date:
            dateKey,

          text:
            sampleTexts[
              index %
              sampleTexts.length
            ],

          mood:
            mood.mood,

          moodKey:
            mood.key,

          saveToDatabase:
            false,

          isDemoData:
            true,

          createdAt:
            new Date(
              cursor.getFullYear(),
              cursor.getMonth(),
              cursor.getDate(),
              20,
              0,
              0
            ).toISOString()
        });
      }

      cursor.setDate(
        cursor.getDate() + 1
      );

      index++;
    }

    if (
      demoEntries.length
    ) {
      saveEntries([
        ...entries,
        ...demoEntries
      ]);
    }
  }


  /* ==================================================
     報酬既読
  ================================================== */

  function getSeenRewards() {
    try {
      const value =
        JSON.parse(
          localStorage.getItem(
            REWARD_STORAGE_KEY
          ) ||
          '{}'
        );

      return (
        value &&
        typeof value ===
          'object'
      )
        ? value
        : {};

    } catch {
      return {};
    }
  }


  function rewardKey(
    year,
    month,
    index
  ) {
    return (
      `${year}-` +
      `${month}-` +
      `${index}`
    );
  }


  function hasRewardBeenSeen(
    year,
    month,
    index
  ) {
    return Boolean(
      getSeenRewards()[
        rewardKey(
          year,
          month,
          index
        )
      ]
    );
  }


  function markRewardAsSeen(
    year,
    month,
    index
  ) {
    const seen =
      getSeenRewards();

    seen[
      rewardKey(
        year,
        month,
        index
      )
    ] = true;

    localStorage.setItem(
      REWARD_STORAGE_KEY,
      JSON.stringify(
        seen
      )
    );
  }


  /* ==================================================
     トースト
  ================================================== */

  function showToast(
    message
  ) {
    clearTimeout(
      toastTimer
    );

    els.diaryToastText.textContent =
      message;

    els.diaryToast.hidden =
      false;

    toastTimer =
      setTimeout(
        () => {
          els.diaryToast.hidden =
            true;
        },
        2200
      );
  }


  /* ==================================================
     開いていた月を保存
  ================================================== */

  function saveMonth(
    key,
    date
  ) {
    localStorage.setItem(
      key,
      JSON.stringify({
        year: date.getFullYear(),
        month: date.getMonth()
      })
    );
  }


  function loadSavedMonth(key) {
    try {
      const value =
        JSON.parse(
          localStorage.getItem(key)
        );

      if (
        !value ||
        typeof value.year !== 'number' ||
        typeof value.month !== 'number'
      ) {
        return null;
      }

      return new Date(
        value.year,
        value.month,
        1
      );

    } catch {
      return null;
    }
  }


  /* ==================================================
     日付・共通
  ================================================== */

  function firstDayOfMonth(
    date
  ) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
  }


  function daysInMonth(
    year,
    zeroBasedMonth
  ) {
    return new Date(
      year,
      zeroBasedMonth + 1,
      0
    ).getDate();
  }


  function formatDateKey(
    date
  ) {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      )
      .padStart(
        2,
        '0'
      );

    const day =
      String(
        date.getDate()
      )
      .padStart(
        2,
        '0'
      );

    return (
      `${year}-` +
      `${month}-` +
      `${day}`
    );
  }


  function parseLocalDate(
    dateKey
  ) {
    const [
      year,
      month,
      day
    ] =
      String(
        dateKey
      )
      .split('-')
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }


  function formatJapaneseDate(
    dateKey
  ) {
    const date =
      parseLocalDate(
        dateKey
      );

    const weekdays = [
      '日',
      '月',
      '火',
      '水',
      '木',
      '金',
      '土'
    ];

    return (
      `${date.getMonth() + 1}月` +
      `${date.getDate()}日` +
      `（${weekdays[date.getDay()]}）`
    );
  }


  function createId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID ===
        'function'
    ) {
      return window.crypto.randomUUID();
    }

    return (
      `${Date.now()}-` +
      `${Math.random()
        .toString(16)
        .slice(2)}`
    );
  }


  function escapeHtml(
    value
  ) {
    return String(
      value ??
      ''
    )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );
  }

})();
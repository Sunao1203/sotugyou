/* ==================================================
   AI Secretary
   index.js
   ※ 現在ログイン・新規登録はLocalStorageによる仮実装
   ※ 後でサーバー側のDB認証に差し替える想定
================================================== */


/* =============================
   スマホメニュー
============================= */

const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');

if (menuButton && mobileNav) {

    menuButton.addEventListener('click', () => {

        const open = mobileNav.classList.toggle('is-open');

        menuButton.setAttribute(
            'aria-expanded',
            String(open)
        );

    });


    mobileNav.querySelectorAll('a').forEach((link) => {

        link.addEventListener('click', () => {

            mobileNav.classList.remove('is-open');

            menuButton.setAttribute(
                'aria-expanded',
                'false'
            );

        });

    });

}


/* =============================
   ログインモーダル
============================= */

const modal =
    document.getElementById('loginModal');

const openButtons =
    document.querySelectorAll('.js-open-login');

const closeButtons =
    document.querySelectorAll('.js-close-login');


function openModal() {

    if (!modal) {
        return;
    }

    modal.classList.add('is-open');

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.classList.add('modal-open');


    const loginNickname =
        document.getElementById('loginNickname');

    if (loginNickname) {

        setTimeout(() => {
            loginNickname.focus();
        }, 0);

    }

}


function closeModal() {

    if (!modal) {
        return;
    }

    modal.classList.remove('is-open');

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.classList.remove('modal-open');

}


openButtons.forEach((button) => {

    button.addEventListener(
        'click',
        openModal
    );

});


closeButtons.forEach((button) => {

    button.addEventListener(
        'click',
        closeModal
    );

});


document.addEventListener(
    'keydown',
    (event) => {

        if (
            event.key === 'Escape' &&
            modal &&
            modal.classList.contains('is-open')
        ) {

            closeModal();

        }

    }
);


/* =============================
   ログイン / 新規登録タブ
============================= */

const tabButtons =
    document.querySelectorAll('.tab-button');

const loginTab =
    document.getElementById('loginTab');

const registerTab =
    document.getElementById('registerTab');


tabButtons.forEach((button) => {

    button.addEventListener('click', () => {

        const tab =
            button.dataset.tab;


        tabButtons.forEach((item) => {

            item.classList.remove('active');

        });


        button.classList.add('active');


        if (loginTab) {

            loginTab.classList.toggle(
                'active',
                tab === 'login'
            );

        }


        if (registerTab) {

            registerTab.classList.toggle(
                'active',
                tab === 'register'
            );

        }

    });

});


/* =============================
   パスワード表示 / 非表示
============================= */

document
    .querySelectorAll('.password-toggle')
    .forEach((button) => {

        button.addEventListener(
            'click',
            () => {

                const target =
                    document.getElementById(
                        button.dataset.target
                    );


                if (!target) {
                    return;
                }


                const hidden =
                    target.type === 'password';


                target.type =
                    hidden
                        ? 'text'
                        : 'password';


                /*
                 アイコンを使用している場合
                */
                const icon =
                    button.querySelector('i');

                if (icon) {

                    icon.classList.toggle(
                        'fa-eye',
                        !hidden
                    );

                    icon.classList.toggle(
                        'fa-eye-slash',
                        hidden
                    );

                } else {

                    button.textContent =
                        hidden
                            ? '非表示'
                            : '表示';

                }

            }
        );

    });


/* =============================
   ログイン
============================= */

const loginForm =
    document.getElementById('loginForm');

const loginNickname =
    document.getElementById('loginNickname');

const loginPassword =
    document.getElementById('loginPassword');

const loginNicknameError =
    document.getElementById(
        'loginNicknameError'
    );

const loginPasswordError =
    document.getElementById(
        'loginPasswordError'
    );

const loginStatus =
    document.getElementById('loginStatus');


if (
    loginForm &&
    loginNickname &&
    loginPassword
) {

    loginForm.addEventListener(
        'submit',
        (event) => {

            event.preventDefault();


            /*
             エラー初期化
            */

            if (loginNicknameError) {

                loginNicknameError.textContent = '';

            }

            if (loginPasswordError) {

                loginPasswordError.textContent = '';

            }

            if (loginStatus) {

                loginStatus.textContent = '';

            }


            const nickname =
                loginNickname.value.trim();

            const password =
                loginPassword.value;


            let valid = true;


            /*
             未入力チェック
            */

            if (!nickname) {

                if (loginNicknameError) {

                    loginNicknameError.textContent =
                        'ニックネームを入力してください。';

                }

                valid = false;

            }


            if (!password) {

                if (loginPasswordError) {

                    loginPasswordError.textContent =
                        'パスワードを入力してください。';

                }

                valid = false;

            }


            if (!valid) {
                return;
            }


            /*
             LocalStorageから
             登録ユーザー取得
            */

            const savedUserText =
                localStorage.getItem(
                    'aiSecretaryUser'
                );


            if (!savedUserText) {

                if (loginStatus) {

                    loginStatus.style.color =
                        '#d34d6b';

                    loginStatus.textContent =
                        'ユーザーが登録されていません。新規登録してください。';

                }

                return;

            }


            let savedUser;


            try {

                savedUser =
                    JSON.parse(
                        savedUserText
                    );

            } catch (error) {

                console.error(
                    'ユーザー情報の読み込みに失敗しました。',
                    error
                );


                if (loginStatus) {

                    loginStatus.style.color =
                        '#d34d6b';

                    loginStatus.textContent =
                        'ユーザー情報の読み込みに失敗しました。';

                }

                return;

            }


            /*
             ニックネーム確認
            */

            if (
                nickname !==
                savedUser.nickname
            ) {

                if (loginNicknameError) {

                    loginNicknameError.textContent =
                        'ニックネームが正しくありません。';

                }

                return;

            }


            /*
             パスワード確認
            */

            if (
                password !==
                savedUser.password
            ) {

                if (loginPasswordError) {

                    loginPasswordError.textContent =
                        'パスワードが正しくありません。';

                }

                return;

            }


            /*
             ログイン成功
            */

            localStorage.setItem(
                'aiSecretaryLoggedIn',
                'true'
            );


            localStorage.setItem(
                'aiSecretaryCurrentUser',
                nickname
            );


            /*
             メイン画面へ移動
            */

            window.location.href =
                'main.html';

        }
    );

}


/* =============================
   新規登録
============================= */

const registerForm =
    document.getElementById(
        'registerForm'
    );

const registerNickname =
    document.getElementById(
        'registerNickname'
    );

const registerPassword =
    document.getElementById(
        'registerPassword'
    );

const registerPasswordConfirm =
    document.getElementById(
        'registerPasswordConfirm'
    );

const registerNicknameError =
    document.getElementById(
        'registerNicknameError'
    );

const registerPasswordError =
    document.getElementById(
        'registerPasswordError'
    );

const registerStatus =
    document.getElementById(
        'registerStatus'
    );


/* =============================
   パスワード条件
============================= */

const ruleElements = {

    length:
        document.querySelector(
            '[data-rule="length"]'
        ),

    upper:
        document.querySelector(
            '[data-rule="upper"]'
        ),

    lower:
        document.querySelector(
            '[data-rule="lower"]'
        ),

    number:
        document.querySelector(
            '[data-rule="number"]'
        )

};


function getRules(password) {

    return {

        length:
            password.length >= 8,

        upper:
            /[A-Z]/.test(password),

        lower:
            /[a-z]/.test(password),

        number:
            /[0-9]/.test(password)

    };

}


function updateRules() {

    if (!registerPassword) {
        return;
    }


    const rules =
        getRules(
            registerPassword.value
        );


    Object
        .entries(rules)
        .forEach(
            ([key, valid]) => {

                const element =
                    ruleElements[key];


                if (element) {

                    element.classList.toggle(
                        'valid',
                        valid
                    );

                }

            }
        );

}


if (registerPassword) {

    registerPassword.addEventListener(
        'input',
        updateRules
    );

}


/* =============================
   新規登録処理
============================= */

if (
    registerForm &&
    registerNickname &&
    registerPassword &&
    registerPasswordConfirm
) {

    registerForm.addEventListener(
        'submit',
        (event) => {

            event.preventDefault();


            /*
             エラー初期化
            */

            if (registerNicknameError) {

                registerNicknameError.textContent = '';

            }


            if (registerPasswordError) {

                registerPasswordError.textContent = '';

            }


            if (registerStatus) {

                registerStatus.textContent = '';

            }


            let valid = true;


            const nickname =
                registerNickname.value.trim();

            const password =
                registerPassword.value;

            const confirm =
                registerPasswordConfirm.value;

            const rules =
                getRules(password);


            /*
             ニックネームチェック
            */

            if (!nickname) {

                if (registerNicknameError) {

                    registerNicknameError.textContent =
                        'ニックネームを入力してください。';

                }

                valid = false;

            } else if (
                nickname.length > 20
            ) {

                if (registerNicknameError) {

                    registerNicknameError.textContent =
                        'ニックネームは20文字以内にしてください。';

                }

                valid = false;

            }


            /*
             パスワード条件
            */

            if (
                !Object
                    .values(rules)
                    .every(Boolean)
            ) {

                if (registerPasswordError) {

                    registerPasswordError.textContent =
                        'パスワードの条件をすべて満たしてください。';

                }

                valid = false;

            } else if (
                password !== confirm
            ) {

                if (registerPasswordError) {

                    registerPasswordError.textContent =
                        '確認用パスワードが一致していません。';

                }

                valid = false;

            }


            if (!valid) {
                return;
            }


            /*
             LocalStorageへ
             ユーザー仮保存
            */

            const user = {

                nickname:
                    nickname,

                password:
                    password

            };


            localStorage.setItem(
                'aiSecretaryUser',
                JSON.stringify(user)
            );


            /*
             登録成功表示
            */

            if (registerStatus) {

                registerStatus.style.color =
                    '#4e9b6b';

                registerStatus.textContent =
                    '登録しました。ログインしてください。';

            }


            /*
             ログインタブへ切り替え
            */

            setTimeout(
                () => {

                    const loginTabButton =
                        document.querySelector(
                            '[data-tab="login"]'
                        );


                    if (loginTabButton) {

                        loginTabButton.click();

                    }


                    if (loginNickname) {

                        loginNickname.value =
                            nickname;

                    }


                    if (loginPassword) {

                        loginPassword.value = '';

                        loginPassword.focus();

                    }

                },
                700
            );

        }
    );

}


/* =============================
   Footer placeholder links
============================= */

const comingSoonToast =
    document.getElementById(
        'comingSoonToast'
    );

const comingSoonText =
    document.getElementById(
        'comingSoonText'
    );

let comingSoonTimer;


document
    .querySelectorAll(
        '.coming-soon-link'
    )
    .forEach((link) => {

        link.addEventListener(
            'click',
            (event) => {

                event.preventDefault();


                if (
                    !comingSoonToast ||
                    !comingSoonText
                ) {

                    return;

                }


                const pageName =
                    link.dataset.page ||
                    'このページ';


                comingSoonText.textContent =
                    `${pageName}は現在準備中です。`;


                comingSoonToast.classList.add(
                    'show'
                );


                clearTimeout(
                    comingSoonTimer
                );


                comingSoonTimer =
                    setTimeout(
                        () => {

                            comingSoonToast
                                .classList
                                .remove(
                                    'show'
                                );

                        },
                        2200
                    );

            }
        );

    });
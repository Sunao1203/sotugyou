const menuButton=document.getElementById('menuButton');const mobileNav=document.getElementById('mobileNav');menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(open))});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false')}));
const modal=document.getElementById('loginModal');const openButtons=document.querySelectorAll('.js-open-login');const closeButtons=document.querySelectorAll('.js-close-login');function openModal(){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>document.getElementById('loginNickname').focus(),0)}function closeModal(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}openButtons.forEach(b=>b.addEventListener('click',openModal));closeButtons.forEach(b=>b.addEventListener('click',closeModal));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeModal()});
const tabButtons=document.querySelectorAll('.tab-button');const loginTab=document.getElementById('loginTab');const registerTab=document.getElementById('registerTab');tabButtons.forEach(button=>button.addEventListener('click',()=>{const tab=button.dataset.tab;tabButtons.forEach(b=>b.classList.remove('active'));button.classList.add('active');loginTab.classList.toggle('active',tab==='login');registerTab.classList.toggle('active',tab==='register')}));
document.querySelectorAll('.password-toggle').forEach(button=>button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.target);const hidden=target.type==='password';target.type=hidden?'text':'password';button.textContent=hidden?'非表示':'表示'}));
const loginForm=document.getElementById('loginForm');const loginNickname=document.getElementById('loginNickname');const loginPassword=document.getElementById('loginPassword');const loginNicknameError=document.getElementById('loginNicknameError');const loginPasswordError=document.getElementById('loginPasswordError');const loginStatus=document.getElementById('loginStatus');loginForm.addEventListener('submit',e=>{e.preventDefault();let valid=true;loginNicknameError.textContent='';loginPasswordError.textContent='';loginStatus.textContent='';if(!loginNickname.value.trim()){loginNicknameError.textContent='ニックネームを入力してください。';valid=false}if(!loginPassword.value){loginPasswordError.textContent='パスワードを入力してください。';valid=false}if(!valid)return;loginStatus.style.color='#4e9b6b';loginStatus.textContent='入力チェックOK（現在はDB未接続です）'});
const registerForm=document.getElementById('registerForm');const registerNickname=document.getElementById('registerNickname');const registerPassword=document.getElementById('registerPassword');const registerPasswordConfirm=document.getElementById('registerPasswordConfirm');const registerNicknameError=document.getElementById('registerNicknameError');const registerPasswordError=document.getElementById('registerPasswordError');const registerStatus=document.getElementById('registerStatus');const ruleElements={length:document.querySelector('[data-rule="length"]'),upper:document.querySelector('[data-rule="upper"]'),lower:document.querySelector('[data-rule="lower"]'),number:document.querySelector('[data-rule="number"]')};function getRules(p){return{length:p.length>=8,upper:/[A-Z]/.test(p),lower:/[a-z]/.test(p),number:/[0-9]/.test(p)}}function updateRules(){const rules=getRules(registerPassword.value);Object.entries(rules).forEach(([k,v])=>ruleElements[k].classList.toggle('valid',v))}registerPassword.addEventListener('input',updateRules);registerForm.addEventListener('submit',e=>{e.preventDefault();registerNicknameError.textContent='';registerPasswordError.textContent='';registerStatus.textContent='';let valid=true;const nickname=registerNickname.value.trim();const password=registerPassword.value;const confirm=registerPasswordConfirm.value;const rules=getRules(password);if(!nickname){registerNicknameError.textContent='ニックネームを入力してください。';valid=false}else if(nickname.length>20){registerNicknameError.textContent='ニックネームは20文字以内にしてください。';valid=false}if(!Object.values(rules).every(Boolean)){registerPasswordError.textContent='パスワードの条件をすべて満たしてください。';valid=false}else if(password!==confirm){registerPasswordError.textContent='確認用パスワードが一致していません。';valid=false}if(!valid)return;registerStatus.style.color='#4e9b6b';registerStatus.textContent='入力チェックOK（現在はDB未接続です）'});

/* =============================
   Footer placeholder links
============================= */
const comingSoonToast = document.getElementById("comingSoonToast");
const comingSoonText = document.getElementById("comingSoonText");
let comingSoonTimer;

document.querySelectorAll(".coming-soon-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const pageName = link.dataset.page || "このページ";
    comingSoonText.textContent = `${pageName}は現在準備中です。`;

    comingSoonToast.classList.add("show");
    clearTimeout(comingSoonTimer);
    comingSoonTimer = setTimeout(() => {
      comingSoonToast.classList.remove("show");
    }, 2200);
  });
});

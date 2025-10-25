// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam";

// === ВОПРОСЫ ===
const questions = [
  { text: "Что обязаны знать и соблюдать сотрудники Военной полиции?" },
  { text: "Как должны разговаривать сотрудники военной полиции?" },
  { text: "При каких условиях сотрудник ВП может покинуть свою ВЧ без формы в рабочее время?" },
  { text: "Что должны иметь при себе сотрудники военной полиции?" },
  { text: "Что должен делать сотрудник ВП при проверке ВЧ на ЧС, помимо самой проверки?" },
  { text: "Что запрещается сотрудникам ВП при выполнении спец.задачи?" },
  { text: "При каком приказе сотрудник ВП обязан снять маску?" },
  { text: "Каким цветом должен быть автомобиль сотрудника ВП?" },
  { text: "Что можно носить сотруднику ВП? (аксессуары)" },
  { text: "Какая приписка в рации департамента?" },
  { text: "Сколько минимум минут проверять ВЧ на чс?" },
  { text: "Кому подчиняются сотрудники ВП?" },
  { text: "Последовательность действий офицера ВП при виде нарушителя?" },
  { text: "Какие места помимо ВЧ нужно проверить?" },
  { text: "Недельная норма проверок от состава ВП?" }
];

let test = null;

// === АНТИ-ЧИТ ===
const BLOCK_KEY = "blockedUser_v1";
const UNLOCK_KEY = "unlockCode_v1";
let isBlocked = false;
let isAdminActive = false;

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
function shuffleArray(arr) {
  for (let i = arr.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]]=[arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str){
  if(typeof str!=="string") return str;
  return str.replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function setCookie(name,value,days=3650){
  const d=new Date();
  d.setTime(d.getTime()+days*24*60*60*1000);
  document.cookie=`${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}

function getCookie(name){
  const matches=document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)'));
  return matches?decodeURIComponent(matches[1]):null;
}

function markBlocked(reason="blocked"){
  isBlocked=true;
  try{localStorage.setItem(BLOCK_KEY,JSON.stringify({reason,date:new Date().toISOString()}));}catch(e){}
  try{sessionStorage.setItem(BLOCK_KEY,"1");}catch(e){}
  try{setCookie(BLOCK_KEY,"1");}catch(e){}
}

function isUserBlocked(){
  try{if(localStorage.getItem(BLOCK_KEY)) return true;}catch(e){}
  try{if(sessionStorage.getItem(BLOCK_KEY)) return true;}catch(e){}
  try{if(getCookie(BLOCK_KEY)) return true;}catch(e){}
  return false;
}

function generateUnlockCode(){
  const bytes=new Uint8Array(24);
  window.crypto.getRandomValues(bytes);
  let hex=Array.from(bytes).map(b=>b.toString(16).padStart(2,"0")).join("");
  return `UNLOCK-${hex}-${Date.now().toString(36)}`;
}

function clearBlockStorage(){
  try{localStorage.removeItem(BLOCK_KEY);}catch(e){}
  try{sessionStorage.removeItem(BLOCK_KEY);}catch(e){}
  try{document.cookie=`${BLOCK_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`; }catch(e){}
}

function blockTest(reason="Вы покинули вкладку во время теста."){
  if(isBlocked||isAdminActive) return;
  const unlockCode=generateUnlockCode();
  markBlocked(reason);
  isBlocked=true;

  const username=test?.username||document.getElementById("username")?.value||"Неизвестный пользователь";
  const reportText=
    `Нарушение при прохождении теста\nИмя: ${username}\nПричина: ${reason}\nДата: ${new Date().toLocaleString()}\n\n`+
    `Код для разблокировки (введите в поле имени):\n${unlockCode}\n\n(Сохраните этот код)`;

  try{localStorage.setItem(UNLOCK_KEY,unlockCode);}catch(e){}

  try{
    const blob=new Blob([reportText],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    saveAs(blob,`${username}_нарушение.docx`);
  }catch(e){console.error("Ошибка при сохранении отчёта:",e);}

  test=null;
  disableStartButton();

  const area=document.getElementById("mainArea");
  if(area){
    area.innerHTML=`<div class="question-box" style="text-align:center;">
      <h2 style="color:#ff6b6b;">Тест заблокирован</h2>
      <p>${escapeHtml(reason)}</p>
      <p>Код для разблокировки записан в скачанном документе.</p>
    </div>`;
  }
}

function disableStartButton(){
  const startBtn=document.getElementById("startBtn");
  if(startBtn){
    startBtn.disabled=true;
    startBtn.classList.add("ghost");
    startBtn.style.opacity="0.6";
    startBtn.title="Доступ заблокирован — вы нарушили правила тестирования";
  }
}

// === ИНИЦИАЛИЗАЦИЯ ===
function initUI(){
  if(isUserBlocked()){
    isBlocked=true;
    document.addEventListener("DOMContentLoaded",()=>{
      disableStartButton();
      const area=document.getElementById("mainArea");
      if(area){
        area.innerHTML=`<div class="question-box" style="text-align:center;">
          <h2 style="color:#ff6b6b;">Доступ заблокирован</h2>
          <p>Ранее вы покинули вкладку — повторное прохождение невозможно без кода.</p>
          <p style="font-size:0.85em;color:#ccc;margin-top:12px;">(Вставьте код разблокировки в поле "Имя" и нажмите Начать.)</p>
        </div>`;
      }
    });
  }

  document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
      const tabName=tab.dataset.tab;
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");

      if(tabName==="admin"){
        const pwd=prompt("Введите пароль для Админки:");
        if(pwd!==ADMIN_PASSWORD){
          alert("Неверный пароль!");
          document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
          document.querySelector(".tab[data-tab='test']").classList.add("active");
          render("test");
          return;
        }

        clearBlockStorage();
        isBlocked=false;
        isAdminActive=true;
        alert("Все блокировки сняты! Пока вы в админке — блокировка теста не срабатывает, тест можно запускать.");
        renderAdmin(document.getElementById("mainArea"));
        return;
      }

      if(isAdminActive) isAdminActive=false;
      render(tabName);
    });
  });

  const existingNote=document.getElementById("antiCheatNote");
  if(!existingNote){
    const note=document.createElement("p");
    note.id="antiCheatNote";
    note.className="small";
    note.style.marginTop="6px";
    note.style.color="#f87171";
    note.innerHTML='⚠ <strong>Важно:</strong> не переключайтесь на другие вкладки во время теста — при выходе тест будет заблокирован и код для разблокировки появится в скачанном документе.';
    const startBtn=document.getElementById("startBtn");
    if(startBtn) startBtn.parentNode.appendChild(note);
  }

  document.getElementById("startBtn").addEventListener("click",startTest);
  render("test");
}

// --- СТАРТ ТЕСТА ---
function startTest

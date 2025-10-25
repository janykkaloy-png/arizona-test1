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

// === АНТИ-ЧИТ ===
const BLOCK_KEY = "blockedUser_v1";
const UNLOCK_KEY = "unlockCode_v1";

function markBlocked(reason="blocked"){
  isBlocked=true;
  try{localStorage.setItem(BLOCK_KEY,JSON.stringify({reason,date:new Date().toISOString()}));}catch(e){}
  try{sessionStorage.setItem(BLOCK_KEY,"1");}catch(e){}
}

function clearBlockStorage(){
  try{localStorage.removeItem(BLOCK_KEY);}catch(e){}
  try{sessionStorage.removeItem(BLOCK_KEY);}catch(e){}
  isBlocked=false;
}

function generateUnlockCode(){
  const bytes=new Uint8Array(24);
  window.crypto.getRandomValues(bytes);
  let hex=Array.from(bytes).map(b=>b.toString(16).padStart(2,"0")).join("");
  return `UNLOCK-${hex}-${Date.now().toString(36)}`;
}

function blockTest(reason="Вы покинули вкладку во время теста.") {
  if(isBlocked || isAdminActive) return;

  const unlockCode = generateUnlockCode();
  markBlocked(reason);

  const username = test?.username || document.getElementById("username")?.value || "Неизвестный пользователь";
  const reportText = 
    `Нарушение при прохождении теста\nИмя: ${username}\nПричина: ${reason}\nДата: ${new Date().toLocaleString()}\n\n` +
    `Код для разблокировки (введите в поле имени):\n${unlockCode}\n\n(Сохраните этот код)`;

  try { localStorage.setItem(UNLOCK_KEY, unlockCode); } catch(e){}

  try {
    const blob = new Blob([reportText], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(blob, `${username}_нарушение.docx`);
  } catch(e){ console.error(e); }

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
  const startBtn = document.getElementById("startBtn");
  if(startBtn){
    startBtn.disabled = true;
    startBtn.classList.add("ghost");
    startBtn.style.opacity = "0.6";
    startBtn.title = "Доступ заблокирован";
  }
}

// === ДОБАВЛЕНИЕ КНОПКИ РАЗБЛОКИРОВКИ ===
function addUnlockButton(){
  const container = document.getElementById("username").parentNode;
  if(document.getElementById("unlockBtn")) return;

  const btn = document.createElement("button");
  btn.id = "unlockBtn";
  btn.className = "btn ghost";
  btn.style.marginTop = "6px";
  btn.textContent = "Разблокировать";
  container.appendChild(btn);

  btn.addEventListener("click", ()=>{
    const input = document.getElementById("username").value.trim();
    const storedCode = localStorage.getItem(UNLOCK_KEY);
    if(!storedCode){
      alert("Нет кода для разблокировки.");
      return;
    }
    if(input === storedCode){
      clearBlockStorage();
      localStorage.removeItem(UNLOCK_KEY);
      isBlocked = false;
      const startBtn = document.getElementById("startBtn");
      if(startBtn){
        startBtn.disabled = false;
        startBtn.classList.remove("ghost");
        startBtn.style.opacity = "1";
        startBtn.title = "";
      }
      alert("Тест разблокирован! Можете начать.");
    } else {
      alert("Код неверный.");
    }
  });
}

// === ИНИЦИАЛИЗАЦИЯ UI ===
function initUI(){
  if(localStorage.getItem(BLOCK_KEY)) isBlocked=true;

  addUnlockButton(); // кнопка разблокировки

  // вкладки
  document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click", ()=>{
      const tabName = tab.dataset.tab;
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
        isAdminActive=true;
        alert("Все блокировки сняты! Тест можно запускать в админке.");
        renderAdmin(document.getElementById("mainArea"));
        return;
      }

      isAdminActive=false;
      render(tabName);
    });
  });

  // предупреждение под кнопкой
  if(!document.getElementById("antiCheatNote")){
    const note=document.createElement("p");
    note.id="antiCheatNote";
    note.className="small";
    note.style.marginTop="6px";
    note.style.color="#f87171";
    note.innerHTML='⚠ Не переключайтесь на другие вкладки во время теста — при выходе тест блокируется.';
    const startBtn = document.getElementById("startBtn");
    if(startBtn) startBtn.parentNode.appendChild(note);
  }

  document.getElementById("startBtn").addEventListener("click", startTest);
  render("test");
}

// === СТАРТ ТЕСТА ===
function startTest(){
  const usernameInput = document.getElementById("username");
  const usernameRaw = usernameInput.value.trim();

  // проверка кода разблокировки
  const storedCode = localStorage.getItem(UNLOCK_KEY);
  if(storedCode && usernameRaw===storedCode){
    clearBlockStorage();
    localStorage.removeItem(UNLOCK_KEY);
    isBlocked=false;
    alert("Код принят, тест разблокирован");
    usernameInput.value="";
  }

  if(isBlocked && !isAdminActive){
    alert("Доступ заблокирован: используйте код из отчёта.");
    disableStartButton();
    return;
  }

  if(!usernameRaw){ alert("Введите имя!"); return; }

  const shuffledQuestions = shuffleArray([...questions]).slice(0, TEST_COUNT);
  test = { username: usernameRaw, current:0, answers:{}, shuffledQuestions };
  renderTest();
}

// === РЕНДЕР ===
function render(tab){
  const area = document.getElementById("mainArea");
  if(!area) return;
  if(tab==="admin") renderAdmin(area);
  else renderTest();
}

// --- РЕНДЕР ТЕСТА ---
function renderTest(){
  const area = document.getElementById("mainArea");
  if(!test){ area.innerHTML=`<h2>Нажмите «Начать тест»</h2>`; return; }

  const q = test.shuffledQuestions[test.current];
  area.innerHTML = `<div class="question-box">
    <h3>${test.current+1}/${TEST_COUNT}: ${q.text}</h3>
    <input type="text" id="answerInput" placeholder="Введите ответ..." value="${test.answers[test.current]||''}">
    <div><button class="btn" id="nextBtn">${test.current<TEST_COUNT-1?"Далее":"Закончить"}</button></div>
  </div>`;

  document.getElementById("answerInput").addEventListener("input", e=>{
    test.answers[test.current]=e.target.value.trim();
  });
  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
}

function nextQuestion(){
  if(!test) return;
  if(test.current<TEST_COUNT-1){ test.current++; renderTest(); }
  else finishTest();
}

// --- ЗАВЕРШЕНИЕ ТЕСТА ---
function finishTest(){
  if(!test) return;
  let reportText=`Тест завершён\nИмя: ${test.username}\n\nОтветы:\n`;
  test.shuffledQuestions.forEach((q,i)=>{
    const ans=test.answers[i]||"";
    reportText+=`${i+1}. ${q.text}\nОтвет: ${ans}\n\n`;
  });

  const blob=new Blob([reportText],{ type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(blob,`${test.username}_тест.docx`);

  const area=document.getElementById("mainArea");
  area.innerHTML=`<div class="question-box">
    <h2>Тест завершён</h2>
    <p>${escapeHtml(test.username)}, скачайте файл и отправьте администратору.</p>
    <div><button class="btn" id="restartBtn">Пройти снова</button></div>
  </div>`;
  document.getElementById("restartBtn").addEventListener("click", ()=>{ test=null; renderTest(); });
}

// --- АДМИНКА ---
function renderAdmin(area){
  area.innerHTML=`<h2>Админка — Загрузка результатов</h2>
    <p>Здесь можно загрузить файлы пользователей, просмотреть ответы и удалить файл.</p>
    <input type="file" id="fileInput" multiple style="display:none;">
    <button class="btn" id="chooseFileBtn">Выбрать файл</button>
    <ul id="fileList"></ul>
    <div id="fileViewer" style="display:none;"></div>
    <button class="btn" id="clearAllBtn">Удалить все записи</button>`;

  const fileInput=document.getElementById("fileInput");
  const chooseFileBtn=document.getElementById("chooseFileBtn");
  const fileList=document.getElementById("fileList");
  const fileViewer=document.getElementById("fileViewer");
  let savedFiles = JSON.parse(localStorage.getItem("adminFiles")||"[]");

  chooseFileBtn.addEventListener("click", ()=>fileInput.click());
  fileInput.addEventListener("change", e=>{
    const files=e.target.files;
    Array.from(files).forEach(file=>{
      const reader=new FileReader();
      reader.onload=function(evt){
        savedFiles.push({name:file.name, passed:false, content:evt.target.result});
        localStorage.setItem("adminFiles",JSON.stringify(savedFiles));
        renderFiles();
      };
      reader.readAsText(file);
    });
    fileInput.value="";
  });

  function renderFiles(){
    fileList.innerHTML = savedFiles.map((f,i)=>`
      <li>
        <strong>${escapeHtml(f.name)}</strong>
        <input type="checkbox" ${f.passed?"checked":""} data-index="${i}" class="passCheckbox"> Пройден
        <button class="btn small openBtn" data-index="${i}">Открыть</button>
        <button class="btn small delBtn" data-index="${i}">Удалить</button>
      </li>`).join("");

    document.querySelectorAll(".passCheckbox").forEach(cb=>{
      cb.addEventListener("change", e=>{
        const idx=e.target.dataset.index;
        savedFiles[idx].passed=e.target.checked;
        localStorage.setItem("adminFiles",JSON.stringify(savedFiles));
      });
    });

    document.querySelectorAll(".openBtn").forEach(btn=>{
      btn.addEventListener("click", e=>{
        const idx=e.target.dataset.index;
        const content=savedFiles[idx].content||"";
        fileViewer.innerHTML=`<pre>${escapeHtml(content)}</pre><button class="btn" id="closeViewerBtn">Закрыть документ</button>`;
        fileViewer.style.display="block";
        document.getElementById("closeViewerBtn").addEventListener("click", ()=>{ fileViewer.style.display="none"; });
      });
    });

    document.querySelectorAll(".delBtn").forEach(btn=>{
      btn.addEventListener("click", e=>{
        const idx=e.target.dataset.index;
        if(confirm(`Удалить файл ${savedFiles[idx].name}?`)){
          savedFiles.splice(idx,1);
          localStorage.setItem("adminFiles",JSON.stringify(savedFiles));
          renderFiles();
          fileViewer.style.display="none";
        }
      });
    });
  }

  renderFiles();
  document.getElementById("clearAllBtn").addEventListener("click", ()=>{
    if(confirm("Удалить все записи?")){
      savedFiles=[];
      localStorage.removeItem("adminFiles");
      renderFiles();
      fileViewer.style.display="none";
    }
  });
}

// --- АНТИ-ЧИТ НА УХОД СО ВКЛАДКИ ---
window.addEventListener("blur", ()=>{
  if(test && !isAdminActive) blockTest("Вы покинули вкладку во время теста.");
});

// === СТАРТ ===
initUI();

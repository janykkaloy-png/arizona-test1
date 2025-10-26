// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam";

let test = null;
let isBlocked = false;
let isAdminMode = false;
let unlockCode = null;

// === СПИСОК ВОПРОСОВ ===
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

// === ЭЛЕМЕНТЫ DOM ===
const overlay = document.getElementById("blockOverlay");
const overlayUnlockBtn = document.getElementById("overlayUnlockBtn");
const overlayInput = document.getElementById("unlockCodeInput");
const startBtn = document.getElementById("startBtn");
const usernameInput = document.getElementById("username");
const unlockBtn = document.getElementById("unlockBtn");

// === ФУНКЦИИ ВСПОМОГАТЕЛЬНЫЕ ===
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));
}

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 12; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

// === ИНИЦИАЛИЗАЦИЯ ===
function initUI() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if(tabName==="admin"){
        const pwd = prompt("Введите пароль для Админки:");
        if(pwd!==ADMIN_PASSWORD){
          alert("Неверный пароль!");
          document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
          document.querySelector(".tab[data-tab='test']").classList.add("active");
          render("test");
          return;
        }
        isAdminMode=true;
        isBlocked=false;
        unlockCode=null;
        overlay.classList.add("hidden");
      }else{
        isAdminMode=false;
      }
      render(tabName);
    });
  });

  startBtn.addEventListener("click", startTest);
  unlockBtn.addEventListener("click", tryUnlock);
  overlayUnlockBtn.addEventListener("click", tryUnlockOverlay);

  render("test");
}

// === СТАРТ ТЕСТА ===
function startTest(){
  if(isBlocked && !isAdminMode){
    alert("Тест заблокирован! Введите код разблокировки.");
    return;
  }
  const username = usernameInput.value.trim();
  if(!username){ alert("Введите имя!"); return; }

  const shuffledQuestions = shuffleArray([...questions]).slice(0, TEST_COUNT);
  test = { username, current: 0, answers: {}, shuffledQuestions };
  renderTest();
}

// === РАЗБЛОКИРОВКА ===
function tryUnlock(){
  const code = usernameInput.value.trim();
  if(code && code === unlockCode){
    isBlocked=false;
    unlockCode=null;
    overlay.classList.add("hidden");
    alert("Тест разблокирован!");
    renderTest();
  }else{
    alert("Неверный код!");
  }
}

function tryUnlockOverlay(){
  const code = overlayInput.value.trim();
  if(code && code === unlockCode){
    isBlocked=false;
    unlockCode=null;
    overlay.classList.add("hidden");
    alert("Тест разблокирован!");
    renderTest();
  }else{
    alert("Неверный код!");
  }
}

// === БЛОКИРОВКА ПРИ ВЫХОДЕ ИЗ ВКЛАДКИ ===
window.addEventListener("blur", ()=>{
  if(test && !isAdminMode && !isBlocked){
    isBlocked=true;
    unlockCode=generateCode();
    overlay.classList.remove("hidden");
    overlayInput.value="";
    saveAs(new Blob([`Тест заблокирован.\nПользователь: ${test.username}\nКод разблокировки: ${unlockCode}`], 
      {type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}), `${test.username}_блокировка.docx`);
  }
});

// === РЕНДЕР ===
function render(tab){
  const area=document.getElementById("mainArea");
  if(!area) return;
  if(tab==="admin") renderAdmin(area);
  else renderTest();
}

// === ТЕСТ ===
function renderTest(){
  const area=document.getElementById("mainArea");
  if(isBlocked && !isAdminMode){
    area.innerHTML=`<h2>Тест заблокирован</h2><p>Введите код разблокировки в поле имени или на оверлее.</p>`;
    return;
  }
  if(!test){
    area.innerHTML=`<h2>Нажмите «Начать тест»</h2>`;
    return;
  }
  const q = test.shuffledQuestions[test.current];
  area.innerHTML=`
    <div class="question-box">
      <h3>${test.current+1}/${TEST_COUNT}: ${q.text}</h3>
      <input type="text" id="answerInput" placeholder="Введите ответ..." value="${test.answers[test.current]||''}">
      <div>
        <button class="btn" id="nextBtn">${test.current<TEST_COUNT-1?"Далее":"Закончить"}</button>
      </div>
    </div>
  `;
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

// === ЗАВЕРШЕНИЕ ТЕСТА ===
function finishTest(){
  if(!test) return;

  let reportText=`Тест завершён\nИмя: ${test.username}\n\nОтветы:\n`;
  test.shuffledQuestions.forEach((q,i)=>{
    const ans=test.answers[i]||"";
    reportText+=`${i+1}. ${q.text}\nОтвет: ${ans}\n\n`;
  });

  const blob=new Blob([reportText],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  saveAs(blob, `${test.username}_тест.docx`);

  const area=document.getElementById("mainArea");
  area.innerHTML=`
    <div class="question-box">
      <h2>Тест завершён</h2>
      <p>${escapeHtml(test.username)}, скачайте файл и отправьте администратору.</p>
      <div>
        <button class="btn" id="restartBtn">Пройти снова</button>
      </div>
    </div>
  `;
  document.getElementById("restartBtn").addEventListener("click", ()=>{
    test=null; renderTest();
  });
}

// === АДМИН ===
function renderAdmin(area){
  area.innerHTML=`
    <h2>Админка — Загрузка результатов</h2>
    <p>Здесь можно загрузить файлы пользователей, посмотреть ответы, отметить пройденные тесты или удалить файл.</p>
    <input type="file" id="fileInput" multiple style="display:none;">
    <button class="btn" id="chooseFileBtn">Выбрать файл</button>
    <ul id="fileList"></ul>
    <div id="fileViewer" style="display:none;"></div>
    <button class="btn" id="clearAllBtn">Удалить все записи</button>
  `;

  const fileInput=document.getElementById("fileInput");
  const chooseFileBtn=document.getElementById("chooseFileBtn");
  const fileList=document.getElementById("fileList");
  const fileViewer=document.getElementById("fileViewer");
  let savedFiles=JSON.parse(localStorage.getItem("adminFiles")||"[]");

  chooseFileBtn.addEventListener("click",()=>fileInput.click());

  fileInput.addEventListener("change",e=>{
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
    fileList.innerHTML=savedFiles.map((f,i)=>`
      <li>
        <strong>${escapeHtml(f.name)}</strong>
        <input type="checkbox" ${f.passed?"checked":""} data-index="${i}" class="passCheckbox"> Пройден
        <button class="btn small openBtn" data-index="${i}">Открыть</button>
        <button class="btn small delBtn" data-index="${i}">Удалить</button>
      </li>
    `).join("");

    document.querySelectorAll(".passCheckbox").forEach(cb=>{
      cb.addEventListener("change",e=>{
        const idx=e.target.dataset.index;
        savedFiles[idx].passed=e.target.checked;
        localStorage.setItem("adminFiles",JSON.stringify(savedFiles));
      });
    });

    document.querySelectorAll(".openBtn").forEach(btn=>{
      btn.addEventListener("click",e=>{
        const idx=e.target.dataset.index;
        const content=savedFiles[idx].content||"";
        fileViewer.innerHTML=`<pre>${escapeHtml(content)}</pre><button class="btn" id="closeViewerBtn">Закрыть документ</button>`;
        fileViewer.style.display="block";
        document.getElementById("closeViewerBtn").addEventListener("click",()=>{fileViewer.style.display="none";});
      });
    });

    document.querySelectorAll(".delBtn").forEach(btn=>{
      btn.addEventListener("click",e=>{
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

  document.getElementById("clearAllBtn").addEventListener("click",()=>{
    if(confirm("Удалить все записи?")){
      savedFiles=[];
      localStorage.removeItem("adminFiles");
      renderFiles();
      fileViewer.style.display="none";
    }
  });

  // Разблокируем тест при входе в админку
  isBlocked=false;
  unlockCode=null;
  overlay.classList.add("hidden");
}

// === СТАРТ ===
initUI();

// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam";

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

let test = null;

// === ВСПОМОГАТЕЛЬНЫЕ ===
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}

// === АНТИ-ЧИТ: ХРАНИЛИЩЕ ===
const BLOCK_KEY = "blockedUser_v1";
let isBlocked = false;

// Установить cookie (на долгий срок)
function setCookie(name, value, days = 3650) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  const matches = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return matches ? decodeURIComponent(matches[1]) : null;
}

function markBlocked(reason = "blocked") {
  isBlocked = true;
  try { localStorage.setItem(BLOCK_KEY, JSON.stringify({ reason, date: new Date().toISOString() })); } catch(e){}
  try { sessionStorage.setItem(BLOCK_KEY, "1"); } catch(e){}
  try { setCookie(BLOCK_KEY, "1"); } catch(e){}
}

function isUserBlocked() {
  try {
    if (localStorage.getItem(BLOCK_KEY)) return true;
  } catch (e) {}
  try {
    if (sessionStorage.getItem(BLOCK_KEY)) return true;
  } catch (e) {}
  try {
    if (getCookie(BLOCK_KEY)) return true;
  } catch (e) {}
  return false;
}

// === ФУНКЦИЯ БЛОКИРОВКИ ===
function blockTest(reason = "Вы покинули вкладку во время теста.") {
  if (isBlocked) return;
  markBlocked(reason);

  const username = test?.username || document.getElementById("username")?.value || "Неизвестный пользователь";
  const reportText = `Нарушение при прохождении теста\nИмя: ${username}\nПричина: ${reason}\nДата: ${new Date().toLocaleString()}\n\n(Тест аннулирован)`;

  // Скачиваем docx с сообщением о нарушении
  try {
    const blob = new Blob([reportText], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(blob, `${username}_нарушение.docx`);
  } catch (e) {
    console.error("Ошибка при сохранении отчёта:", e);
  }

  // Очищаем текущий тест и запрещаем новый
  test = null;
  disableStartButton();

  // Заменяем основную область на сообщение о блокировке
  const area = document.getElementById("mainArea");
  if (area) {
    area.innerHTML = `
      <div class="question-box" style="text-align:center;">
        <h2 style="color:#ff6b6b;">Тест заблокирован</h2>
        <p>${escapeHtml(reason)}</p>
        <p>Вы больше не можете проходить тест на этом устройстве/в этом браузере.</p>
      </div>
    `;
  } else {
    // fallback — заменить тело
    document.body.innerHTML = `
      <div style="text-align:center;margin-top:20vh;">
        <h1 style="color:red;">Тест заблокирован</h1>
        <p>${escapeHtml(reason)}</p>
      </div>
    `;
  }
}

// Отключить кнопку "Начать тест"
function disableStartButton() {
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.classList.add("ghost");
    startBtn.style.opacity = "0.6";
    startBtn.title = "Доступ заблокирован — вы нарушили правила тестирования";
  }
}

// === ИНИЦИАЛИЗАЦИЯ ===
function initUI() {
  // Проверяем блокировку при старте
  if (isUserBlocked()) {
    isBlocked = true;
    // Ждём DOMContentLoaded, но если уже загружено — сразу
    document.addEventListener("DOMContentLoaded", () => {
      disableStartButton();
      const area = document.getElementById("mainArea");
      if (area) {
        area.innerHTML = `
          <div class="question-box" style="text-align:center;">
            <h2 style="color:#ff6b6b;">Доступ заблокирован</h2>
            <p>Ранее вы покинули вкладку во время теста — повторное прохождение невозможно.</p>
          </div>
        `;
      }
    });
  }

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (tabName === "admin") {
        const pwd = prompt("Введите пароль для Админки:");
        if (pwd !== ADMIN_PASSWORD) {
          alert("Неверный пароль!");
          document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
          document.querySelector(".tab[data-tab='test']").classList.add("active");
          render("test");
          return;
        }
      }

      render(tabName);
    });
  });

  const usernameInput = document.getElementById("username");

  // Добавляем предупреждение рядом с полем/кнопкой (если ещё нет)
  const existingNote = document.getElementById("antiCheatNote");
  if (!existingNote) {
    const note = document.createElement("p");
    note.id = "antiCheatNote";
    note.className = "small";
    note.style.marginTop = "6px";
    note.style.color = "#f87171"; // красноватый
    note.innerHTML = '⚠ <strong>Важно:</strong> не переключайтесь на другие вкладки во время теста — при выходе тест будет заблокирован.';
    const startBtn = document.getElementById("startBtn");
    if (startBtn) startBtn.parentNode.appendChild(note);
  }

  document.getElementById("startBtn").addEventListener("click", startTest);
  render("test");
}

// === СТАРТ ТЕСТА ===
function startTest() {
  if (isBlocked || isUserBlocked()) {
    alert("Доступ заблокирован: повторное прохождение теста невозможно.");
    disableStartButton();
    return;
  }

  const username = document.getElementById("username").value.trim();
  if (!username) { alert("Введите имя!"); return; }

  const shuffledQuestions = shuffleArray([...questions]).slice(0, TEST_COUNT);
  test = { username, current: 0, answers: {}, shuffledQuestions };
  renderTest();
}

// --- РЕНДЕР ---
function render(tab) {
  const area = document.getElementById("mainArea");
  if (!area) return;
  if (tab === "admin") renderAdmin(area);
  else renderTest();
}

// --- ТЕСТ ---
function renderTest() {
  const area = document.getElementById("mainArea");
  if (!test) { area.innerHTML = `<h2>Нажмите «Начать тест»</h2>`; return; }

  const q = test.shuffledQuestions[test.current];
  area.innerHTML = `
    <div class="question-box">
      <h3>${test.current + 1}/${TEST_COUNT}: ${escapeHtml(q.text)}</h3>
      <input type="text" id="answerInput" placeholder="Введите ответ..." value="${escapeHtml(test.answers[test.current] || '')}">
      <div>
        <button class="btn" id="nextBtn">${test.current < TEST_COUNT - 1 ? "Далее" : "Закончить"}</button>
      </div>
    </div>
  `;
  document.getElementById("answerInput").addEventListener("input", e => {
    test.answers[test.current] = e.target.value.trim();
  });
  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
}

function nextQuestion() {
  if (!test) return;
  if (test.current < TEST_COUNT - 1) { test.current++; renderTest(); }
  else finishTest();
}

// --- ЗАВЕРШЕНИЕ ТЕСТА ---
function finishTest() {
  if (!test) return;

  let reportText = `Тест завершён\nИмя: ${test.username}\n\nОтветы:\n`;
  test.shuffledQuestions.forEach((q, i) => {
    const ans = test.answers[i] || "";
    reportText += `${i + 1}. ${q.text}\nОтвет: ${ans}\n\n`;
  });

  const blob = new Blob([reportText], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(blob, `${test.username}_тест.docx`);

  const area = document.getElementById("mainArea");
  area.innerHTML = `
    <div class="question-box">
      <h2>Тест завершён</h2>
      <p>${escapeHtml(test.username)}, скачайте файл и отправьте администратору.</p>
      <div>
        <button class="btn" id="restartBtn">Пройти снова</button>
      </div>
    </div>
  `;
  document.getElementById("restartBtn").addEventListener("click", () => { test = null; renderTest(); });
}

// --- АДМИН ---
function renderAdmin(area) {
  area.innerHTML = `
    <h2>Админка — Загрузка результатов</h2>
    <p>Здесь можно загрузить файлы пользователей, посмотреть ответы, отметить пройденные тесты или удалить файл.</p>

    <input type="file" id="fileInput" multiple style="display:none;">
    <button class="btn" id="chooseFileBtn">Выбрать файл</button>

    <ul id="fileList"></ul>

    <div id="fileViewer" style="display:none;"></div>
    <button class="btn" id="clearAllBtn">Удалить все записи</button>
  `;

  const fileInput = document.getElementById("fileInput");
  const chooseFileBtn = document.getElementById("chooseFileBtn");
  const fileList = document.getElementById("fileList");
  const fileViewer = document.getElementById("fileViewer");
  let savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");

  chooseFileBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", e => {
    const files = e.target.files;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (evt) {
        savedFiles.push({ name: file.name, passed: false, content: evt.target.result });
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        renderFiles();
      };
      reader.readAsText(file);
    });
    fileInput.value = "";
  });

  function renderFiles() {
    fileList.innerHTML = savedFiles.map((f, i) => `
      <li>
        <strong>${escapeHtml(f.name)}</strong>
        <input type="checkbox" ${f.passed ? "checked" : ""} data-index="${i}" class="passCheckbox"> Пройден
        <button class="btn small openBtn" data-index="${i}">Открыть</button>
        <button class="btn small delBtn" data-index="${i}">Удалить</button>
      </li>
    `).join("");

    document.querySelectorAll(".passCheckbox").forEach(cb => {
      cb.addEventListener("change", e => {
        const idx = e.target.dataset.index;
        savedFiles[idx].passed = e.target.checked;
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
      });
    });

    document.querySelectorAll(".openBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.dataset.index;
        const content = savedFiles[idx].content || "";
        fileViewer.innerHTML = `<pre>${escapeHtml(content)}</pre><button class="btn" id="closeViewerBtn">Закрыть документ</button>`;
        fileViewer.style.display = "block";

        document.getElementById("closeViewerBtn").addEventListener("click", () => {
          fileViewer.style.display = "none";
        });
      });
    });

    document.querySelectorAll(".delBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        const idx = e.target.dataset.index;
        if (confirm(`Удалить файл ${savedFiles[idx].name}?`)) {
          savedFiles.splice(idx, 1);
          localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
          renderFiles();
          fileViewer.style.display = "none";
        }
      });
    });
  }

  renderFiles();

  document.getElementById("clearAllBtn").addEventListener("click", () => {
    if (confirm("Удалить все записи?")) {
      savedFiles = [];
      localStorage.removeItem("adminFiles");
      renderFiles();
      fileViewer.style.display = "none";
    }
  });
}

// === АНТИ-ЧИТ: СЛУШАТЕЛИ ===
// Срабатывает когда вкладка становится невидимой
document.addEventListener("visibilitychange", () => {
  // блокируем только если тест уже начат и пользователь ещё не был заблокирован
  if (document.hidden && test && !isBlocked) {
    blockTest("Пользователь покинул вкладку во время теста.");
  }
});

// Очистка временных данных при закрытии — НЕ трогаем localStorage/block (чтобы блокировка осталась)
window.addEventListener("beforeunload", () => {
  try { sessionStorage.removeItem("tempTestData"); } catch(e){}
});

// === СТАРТ ===
initUI();

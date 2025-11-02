// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam";
const AES_KEY = "my_secret_aes_key"; // Ключ AES для шифрования всех файлов

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
  { text: "Что можно носить сотруднику ВП?(аксессуары)" },
  { text: "Какая приписка в рации департамента?" },
  { text: "Сколько минимум минут проверять ВЧ на чс?" },
  { text: "Кому подчиняются сотрудники ВП?" },
  { text: "Последовательность действий офицера ВП при виде нарушителя?" },
  { text: "Какие места помимо ВЧ нужно проверить?" },
  { text: "Недельная норма проверок от состава ВП?" }
];

let test = null;
let blocked = false;

// --- ВСПОМОГАТЕЛЬНЫЕ ---
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, s => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));
}

function blockTest() {
  blocked = true;
  document.querySelectorAll("input, button").forEach(el => {
    if (!el.id.includes("unlock") && !el.closest(".tabs")) el.disabled = true;
  });
  const area = document.getElementById("mainArea");
  if (!area.querySelector(".blocked-note")) {
    const note = document.createElement("p");
    note.className = "blocked-note";
    note.style.color = "red";
    note.innerText = "Тест заблокирован! Введите код для разблокировки или используйте админку.";
    area.prepend(note);
  }
}

function unblockTest() {
  blocked = false;
  document.querySelectorAll("input, button").forEach(el => el.disabled = false);
  const note = document.querySelector(".blocked-note");
  if (note) note.remove();
}

// === UI INIT ===
function initUI() {
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
          renderTest();
          return;
        }
      }

      render(tabName);
    });
  });

  document.getElementById("startBtn").addEventListener("click", startTest);
  document.getElementById("unlockBtn").addEventListener("click", tryUnlock);

  document.addEventListener("visibilitychange", () => {
    if (test && !blocked && document.hidden) blockTest();
  });

  window.addEventListener("blur", () => {
    if (test && !blocked) blockTest();
  });

  renderTest();
}

// === СТАРТ ТЕСТА ===
function startTest() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Введите имя!");
    return;
  }

  const shuffledQuestions = shuffleArray([...questions]).slice(0, TEST_COUNT);
  test = { username, current: 0, answers: {}, shuffledQuestions };

  renderTest();
}

// === ПРОВЕРКА КОДА РАЗБЛОКИРОВКИ ===
function tryUnlock() {
  const code = document.getElementById("username").value.trim();
  const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");

  for (let f of savedFiles) {
    try {
      // Сначала декодируем base64 → бинарный массив → UTF-8 строка
      const encrypted = atob(f.content);
      const wordArray = CryptoJS.lib.WordArray.create(
        Uint8Array.from(encrypted.split('').map(c=>c.charCodeAt(0)))
      );
      const decrypted = CryptoJS.AES.decrypt(wordArray, AES_KEY).toString(CryptoJS.enc.Utf8);
      if (decrypted === code) {
        unblockTest();
        alert("Тест разблокирован!");
        return;
      }
    } catch (e) {}
  }
  alert("Неверный код!");
}

// === РЕНДЕР ===
function render(tab) {
  if (tab === "admin") renderAdmin();
  else renderTest();
}

// === РЕНДЕР ТЕСТА ===
function renderTest() {
  const area = document.getElementById("mainArea");

  if (!test) {
    area.innerHTML = `<h2>Нажмите «Начать тест»</h2>`;
    return;
  }

  const q = test.shuffledQuestions[test.current];

  area.innerHTML = `
    <div class="question-box">
      <h3>${test.current + 1}/${TEST_COUNT}: ${q.text}</h3>
      <input type="text" id="answerInput" placeholder="Введите ответ..." value="${test.answers[test.current] || ''}">
      <button class="btn" id="nextBtn">${test.current < TEST_COUNT - 1 ? "Далее" : "Закончить"}</button>
    </div>
  `;

  if (blocked) blockTest();

  document.getElementById("answerInput").addEventListener("input", e => {
    test.answers[test.current] = e.target.value.trim();
  });

  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
}

function nextQuestion() {
  if (test.current < TEST_COUNT - 1) {
    test.current++;
    renderTest();
  } else finishTest();
}

// === ЗАВЕРШЕНИЕ ТЕСТА ===
function finishTest() {
  let reportText = `Тест завершён\nИмя: ${test.username}\n\nОтветы:\n\n`;
  test.shuffledQuestions.forEach((q, i) => {
    reportText += `${i + 1}. ${q.text}\nОтвет: ${test.answers[i] || ""}\n\n`;
  });

  // Зашифрованный AES + сохранение как бинарный DOCX
  const encrypted = CryptoJS.AES.encrypt(reportText, AES_KEY).toString();
  const base64 = btoa(encrypted);
  const blob = new Blob([base64], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(blob, `${test.username}_тест.docx`);

  document.getElementById("mainArea").innerHTML = `
    <div class="question-box">
      <h2>Тест завершён</h2>
      <p>${escapeHtml(test.username)}, скачайте файл и отправьте администратору.</p>
      <button class="btn" id="restartBtn">Пройти снова</button>
    </div>
  `;

  document.getElementById("restartBtn").addEventListener("click", () => {
    test = null;
    unblockTest();
    renderTest();
  });
}

// === АДМИНКА ===
function renderAdmin() {
  const area = document.getElementById("mainArea");
  area.innerHTML = `
    <h2>Админка — Загрузка результатов</h2>

    <input type="file" id="fileInput" multiple style="display:none;">
    <button class="btn" id="chooseFileBtn">Выбрать файл</button>

    <ul id="fileList"></ul>
    <div id="fileViewer" class="report" style="display:none;"></div>

    <button class="btn" id="clearAllBtn">Удалить все записи</button>
  `;

  const fileInput = document.getElementById("fileInput");
  const chooseFileBtn = document.getElementById("chooseFileBtn");
  const fileList = document.getElementById("fileList");
  const fileViewer = document.getElementById("fileViewer");

  let savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");

  chooseFileBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", e => {
    [...e.target.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        // Сохраняем как base64 для корректного DOCX
        const base64 = arrayBufferToBase64(evt.target.result);
        savedFiles.push({ name: file.name, passed: false, content: base64 });
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        renderFiles();
      };
      reader.readAsArrayBuffer(file);
    });
    fileInput.value = "";
  });

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function renderFiles() {
    fileList.innerHTML = savedFiles.map((f, i) => `
      <li>
        <strong>${escapeHtml(f.name)}</strong>
        <input type="checkbox" class="passCheckbox" data-index="${i}" ${f.passed ? "checked" : ""}> Пройден
        <button class="btn small openBtn" data-index="${i}">Открыть</button>
        <button class="btn small delBtn" data-index="${i}">Удалить</button>
      </li>
    `).join("");

    document.querySelectorAll(".passCheckbox").forEach(cb => {
      cb.addEventListener("change", e => {
        savedFiles[e.target.dataset.index].passed = e.target.checked;
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
      });
    });

    document.querySelectorAll(".openBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        const file = savedFiles[e.target.dataset.index];
        fileViewer.innerHTML = `<pre>${escapeHtml(file.content)}</pre><button class="btn" id="closeViewerBtn">Закрыть документ</button>`;
        fileViewer.style.display = "block";
        document.getElementById("closeViewerBtn").addEventListener("click", () => fileViewer.style.display = "none");
      });
    });

    document.querySelectorAll(".delBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.dataset.index;
        if (confirm(`Удалить файл ${savedFiles[index].name}?`)) {
          savedFiles.splice(index, 1);
          localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
          renderFiles();
          fileViewer.style.display = "none";
        }
      });
    });
  }

  document.getElementById("clearAllBtn").addEventListener("click", () => {
    if (confirm("Удалить все записи?")) {
      savedFiles = [];
      localStorage.removeItem("adminFiles");
      renderFiles();
      fileViewer.style.display = "none";
    }
  });

  renderFiles();
}

// === СТАРТ ===
initUI();

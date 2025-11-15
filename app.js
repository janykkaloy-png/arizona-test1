// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam";
const AES_KEY = "my_secret_aes_key_2024";
const INACTIVITY_TIMEOUT = 20000; // 20 секунд

const questions = [
    { text: "Что обязаны знать и соблюдать сотрудники Военной полиции?" },
    { text: "Как должны разговаривать сотрудники военной полиции?" },
    { text: "При каких условиях сотрудник ВП может покинуть свою ВЧ без формы в рабочее время?(Не с разрешения и не в обед)" },
    { text: "Что должны иметь при себе сотрудники военной полиции при проверке ВЧ на ЧС?" },
    { text: "Что должен делать сотрудник ВП при проверке ВЧ на ЧС, помимо самой проверки?" },
    { text: "Что запрещается сотрудникам ВП при выполнении спец.задачи?" },
    { text: "При каком приказе сотрудник ВП обязан снять маску?" },
    { text: "Какими цветами должен быть покрашен автомобиль сотрудника ВП?" },
    { text: "Что можно носить сотруднику ВП?(аксессуары от 2)" },
    { text: "Какая приписка в рации департамента?" },
    { text: "Сколько минимум минут нужно проверять ВЧ на ЧС?" },
    { text: "Кому подчиняются сотрудники ВП?" },
    { text: "Последовательность действий офицера ВП при виде нарушителя?" },
    { text: "Какие места помимо Военных Частей нужно проверять?" },
    { text: "Недельная норма проверок состава И" }
];

let test = null;
let blocked = false;
let inactivityTimer = null;
let lastActivityTime = Date.now();

// --- УПРАВЛЕНИЕ ДИСКЛЕЙМЕРОМ ---
function showDisclaimer() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        showError("Введите имя перед началом теста!");
        return;
    }
    
    const modal = document.getElementById("disclaimerModal");
    modal.style.display = "flex";
    
    // Добавляем обработчики для кнопок дисклеймера
    document.getElementById("closeDisclaimerBtn").onclick = closeDisclaimer;
    document.getElementById("confirmStartBtn").onclick = confirmStartTest;
}

function closeDisclaimer() {
    const modal = document.getElementById("disclaimerModal");
    modal.style.display = "none";
}

function confirmStartTest() {
    const modal = document.getElementById("disclaimerModal");
    modal.style.display = "none";
    
    // Запускаем тест после подтверждения
    actuallyStartTest();
}

// --- СИСТЕМА БЕЗДЕЙСТВИЯ ---
function resetInactivityTimer() {
    lastActivityTime = Date.now();
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    if (test && !test.blocked) {
        inactivityTimer = setTimeout(() => {
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            if (test && !test.blocked && timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
                showError("Тест заблокирован за бездействие! Возможно, вы использовали телефон для подсматривания ответов.");
                blockTest();
            }
        }, INACTIVITY_TIMEOUT);
    }
}

function trackActivity() {
    resetInactivityTimer();
}

function showInactivityWarning() {
    // Показываем предупреждение за 5 секунд до блокировки
    const timeLeft = INACTIVITY_TIMEOUT - (Date.now() - lastActivityTime);
    if (timeLeft <= 5000 && !document.getElementById('inactivityWarning')) {
        const warning = document.createElement('div');
        warning.className = 'inactivity-warning';
        warning.id = 'inactivityWarning';
        warning.innerHTML = `⚠️ Внимание! Бездействие обнаружено!<br>Тест будет заблокирован через ${Math.ceil(timeLeft/1000)} сек.`;
        document.body.appendChild(warning);
        
        setTimeout(() => {
            const w = document.getElementById('inactivityWarning');
            if (w) w.remove();
        }, 5000);
    }
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function shuffleArray(arr) {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function escapeHtml(str) {
    if (typeof str !== "string") return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function generateReadableCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// --- СОХРАНЕНИЕ И ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ ---
function saveTestState() {
    if (test) {
        localStorage.setItem('currentTest', JSON.stringify({
            username: test.username,
            current: test.current,
            answers: test.answers,
            shuffledQuestions: test.shuffledQuestions,
            startTime: test.startTime,
            blocked: test.blocked,
            unlockCode: test.unlockCode
        }));
    }
}

function loadTestState() {
    const saved = localStorage.getItem('currentTest');
    if (saved) {
        const savedTest = JSON.parse(saved);
        test = {
            username: savedTest.username,
            current: savedTest.current,
            answers: savedTest.answers,
            shuffledQuestions: savedTest.shuffledQuestions,
            startTime: new Date(savedTest.startTime),
            blocked: savedTest.blocked,
            unlockCode: savedTest.unlockCode
        };
        blocked = savedTest.blocked;
        
        if (blocked) {
            document.querySelectorAll("input, button").forEach(el => {
                if (!el.id.includes("unlock") && el.id !== "username" && !el.closest(".tabs")) {
                    el.disabled = true;
                }
            });
        }
    }
}

function clearTestState() {
    localStorage.removeItem('currentTest');
    test = null;
    blocked = false;
}

// --- СИСТЕМА БЛОКИРОВКИ ---
function blockTest() {
    if (blocked || !test) return;
    
    blocked = true;
    test.blocked = true;

    // Блокируем элементы интерфейса
    document.querySelectorAll("input, button").forEach(el => {
        if (!el.id.includes("unlock") && el.id !== "username" && !el.closest(".tabs")) {
            el.disabled = true;
        }
    });

    // Останавливаем таймер бездействия
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    // Генерация кода разблокировки
    if (!test.unlockCode) {
        test.unlockCode = generateReadableCode();
    }

    // Создаем файл с кодом разблокировки
    createUnlockFile();

    // Сохраняем состояние
    saveTestState();

    // Показываем сообщение о блокировке
    renderBlockedScreen();
}

function createUnlockFile() {
    const unlockContent = `КОД РАЗБЛОКИРОВКИ ТЕСТА

Имя пользователя: ${test.username}
Код разблокировки: ${test.unlockCode}

Причина блокировки: Бездействие (отсутствие активности более 20 секунд)
Тест заблокирован: ${new Date().toLocaleString('ru-RU')}
Прогресс: ${test.current + 1}/${TEST_COUNT} вопросов

Для разблокировки теста обратитесь к администратору.
Сообщите администратору этот код.

Arizona RP | Военная Полиция`;

    const encryptedUnlock = CryptoJS.AES.encrypt(unlockContent, AES_KEY).toString();
    const unlockBlob = new Blob([btoa(encryptedUnlock)], { 
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    });
    saveAs(unlockBlob, `${test.username}_код_разблокировки.docx`);
}

function renderBlockedScreen() {
    const area = document.getElementById("mainArea");
    area.innerHTML = `
        <div class="blocked-note">
            <h2>🚫 Тест заблокирован за бездействие!</h2>
            <p>Система зафиксировала отсутствие активности более 20 секунд.</p>
            <p><strong>Возможная причина: использование телефона для подсматривания ответов</strong></p>
            <p>Файл с кодом разблокировки был скачан.</p>
            <p>Отправьте файл <strong>${test.username}_код_разблокировки.docx</strong> администратору.</p>
            <p>Администратор предоставит вам код для разблокировки теста.</p>
            
            <div style="margin: 20px 0;">
                <button class="btn ghost" id="resendCodeBtn">
                    📧 Получить код повторно
                </button>
            </div>
            
            <div style="margin-top: 20px;">
                <input type="text" id="unlockCodeInput" placeholder="Введите код от администратора" style="margin: 10px 0; width: 100%;">
                <button class="btn" id="submitUnlockBtn">Разблокировать тест</button>
            </div>
        </div>
    `;

    document.getElementById("resendCodeBtn").addEventListener("click", () => {
        createUnlockFile();
        showMessage("Файл с кодом разблокировки отправлен на скачивание!", "success");
    });

    document.getElementById("submitUnlockBtn").addEventListener("click", () => {
        const enteredCode = document.getElementById("unlockCodeInput").value.trim().toUpperCase();
        if (enteredCode === test.unlockCode) {
            blocked = false;
            test.blocked = false;
            document.querySelectorAll("input, button").forEach(el => el.disabled = false);
            saveTestState();
            showMessage("Тест успешно разблокирован!", "success");
            resetInactivityTimer();
            renderTest();
        } else {
            showError("Неверный код разблокировки!");
        }
    });
}

function unblockTest() {
    const code = document.getElementById("username").value.trim().toUpperCase();
    if (!test) {
        showError("Нет активного теста для разблокировки!");
        return;
    }
    
    if (code === test.unlockCode) {
        blocked = false;
        test.blocked = false;
        document.querySelectorAll("input, button").forEach(el => el.disabled = false);
        saveTestState();
        showMessage("Тест успешно разблокирован!", "success");
        resetInactivityTimer();
        renderTest();
    } else {
        showError("Неверный код разблокировки!");
    }
}

// --- УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ ---
function initUI() {
    // Загружаем состояние теста при запуске
    loadTestState();
    
    // Слушатели активности (только мышь и клавиатура)
    document.addEventListener('mousemove', trackActivity);
    document.addEventListener('mousedown', trackActivity);
    document.addEventListener('keypress', trackActivity);
    document.addEventListener('keydown', trackActivity);
    
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            trackActivity();
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

    // Обновляем обработчик - теперь показываем дисклеймер
    document.getElementById("startBtn").addEventListener("click", showDisclaimer);
    document.getElementById("unlockBtn").addEventListener("click", unblockTest);

    document.addEventListener("visibilitychange", () => {
        if (test && !blocked && document.hidden) {
            showInactivityWarning();
            setTimeout(() => blockTest(), 2000);
        }
    });

    window.addEventListener("blur", () => {
        if (test && !blocked) {
            showInactivityWarning();
            setTimeout(() => blockTest(), 2000);
        }
    });

    // Скрываем кнопку разблокировки по умолчанию
    document.getElementById("unlockBtn").style.display = "none";

    // Запускаем проверку бездействия каждую секунду
    setInterval(() => {
        if (test && !test.blocked) {
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            if (timeSinceLastActivity >= INACTIVITY_TIMEOUT - 5000) {
                showInactivityWarning();
            }
        }
    }, 1000);

    renderTest();
}

// --- УВЕДОМЛЕНИЯ ---
function showMessage(message, type = "info") {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === "success") {
        alertDiv.style.background = "#10b981";
    } else if (type === "error") {
        alertDiv.style.background = "#ef4444";
    } else {
        alertDiv.style.background = "#3b82f6";
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function showError(message) {
    showMessage(message, "error");
}

// --- ОБНОВЛЕННЫЙ СТАРТ ТЕСТА ---
function actuallyStartTest() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        showError("Введите имя!");
        return;
    }
    
    const shuffledQuestions = shuffleArray([...questions]).slice(0, TEST_COUNT);
    test = {
        username,
        current: 0,
        answers: {},
        shuffledQuestions,
        startTime: new Date(),
        blocked: false
    };
    
    // Сохраняем состояние
    saveTestState();
    
    // Показываем кнопку разблокировки
    document.getElementById("unlockBtn").style.display = "inline-block";
    
    showMessage("Тест начат! Не покидайте вкладку и будьте активны (двигайте мышкой/печатайте).", "success");
    resetInactivityTimer();
    renderTest();
}

// --- РЕНДЕР ТЕСТА ---
function renderTest() {
    const area = document.getElementById("mainArea");
    
    if (!test) {
        area.innerHTML = `
            <div class="question-box">
                <h2>Добро пожаловать в тест Военной Полиции</h2>
                <p>Введите ваше имя в поле ниже и нажмите "Начать тест" для начала тестирования.</p>
                <p><strong>Важно:</strong> Система отслеживает активность! Двигайте мышкой или печатайте каждые 20 секунд.</p>
                <p style="color: var(--warning);"><strong>⚠️ Использование телефона для подсматривания ответов приведет к блокировке теста!</strong></p>
            </div>
        `;
        return;
    }

    if (test.blocked) {
        renderBlockedScreen();
        return;
    }

    const q = test.shuffledQuestions[test.current];
    area.innerHTML = `
        <div class="question-box">
            <h3>Вопрос ${test.current + 1} из ${TEST_COUNT}</h3>
            <p><strong>${q.text}</strong></p>
            <input type="text" id="answerInput" placeholder="Введите ваш ответ здесь..." 
                   value="${test.answers[test.current] || ''}" autocomplete="off">
            <div style="margin-top: 20px;">
                <button class="btn" id="nextBtn">
                    ${test.current < TEST_COUNT - 1 ? "Следующий вопрос" : "Завершить тест"}
                </button>
            </div>
            <div class="small" style="margin-top: 15px; color: var(--warning);">
                ⚠️ Система отслеживает активность! Двигайте мышкой или печатайте для предотвращения блокировки.
            </div>
        </div>
    `;

    const answerInput = document.getElementById("answerInput");
    answerInput.addEventListener("input", (e) => {
        trackActivity();
        test.answers[test.current] = e.target.value.trim();
        saveTestState();
    });
    
    answerInput.addEventListener("keypress", (e) => {
        trackActivity();
        if (e.key === "Enter") {
            nextQuestion();
        }
    });
    
    answerInput.addEventListener("mousedown", trackActivity);
    
    document.getElementById("nextBtn").addEventListener("click", () => {
        trackActivity();
        nextQuestion();
    });
    
    answerInput.focus();
}

function nextQuestion() {
    if (test.current < TEST_COUNT - 1) {
        test.current++;
        saveTestState();
        renderTest();
    } else {
        finishTest();
    }
}

// --- ЗАВЕРШЕНИЕ ТЕСТА ---
function finishTest() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - test.startTime) / 1000 / 60);
    
    let reportText = `ТЕСТ ВОЕННОЙ ПОЛИЦИИ - РЕЗУЛЬТАТЫ
=================================

Общая информация:
----------------
Имя: ${test.username}
Дата: ${new Date().toLocaleString('ru-RU')}
Время выполнения: ${timeSpent} минут
Всего вопросов: ${TEST_COUNT}

Ответы:
----------------
`;

    test.shuffledQuestions.forEach((q, i) => {
        reportText += `\n${i + 1}. ${q.text}\n`;
        reportText += `Ответ: ${test.answers[i] || "Нет ответа"}\n`;
        reportText += `---------------------------------\n`;
    });

    reportText += `\n
=================================
Arizona RP | Военная Полиция
Тест завершен`;

    // Сохраняем результаты в зашифрованном DOCX
    const encrypted = CryptoJS.AES.encrypt(reportText, AES_KEY).toString();
    const blob = new Blob([btoa(encrypted)], { 
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    });
    
    saveAs(blob, `${test.username}_тест_результаты.docx`);

    // Останавливаем таймер бездействия
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    // Очищаем состояние после завершения теста
    clearTestState();

    // Скрываем кнопку разблокировки
    document.getElementById("unlockBtn").style.display = "none";

    document.getElementById("mainArea").innerHTML = `
        <div class="question-box">
            <h2>✅ Тест завершён!</h2>
            <p><strong>${escapeHtml(test.username)}</strong>, ваш тест успешно завершён.</p>
            <p>Файл с результатами был автоматически скачан.</p>
            <p>Отправьте файл <strong>${test.username}_тест_результаты.docx</strong> администратору для проверки.</p>
            <div style="margin-top: 20px;">
                <button class="btn" id="restartBtn">Пройти тест снова</button>
            </div>
        </div>
    `;

    document.getElementById("restartBtn").addEventListener("click", () => {
        document.getElementById("username").value = "";
        document.querySelectorAll("input, button").forEach(el => el.disabled = false);
        showMessage("Готово к новому тесту!", "success");
        renderTest();
    });
}

// --- АДМИН-ПАНЕЛЬ ---
function renderAdmin() {
    const area = document.getElementById("mainArea");
    
    area.innerHTML = `
        <div class="question-box">
            <h2>🔧 Админ-панель</h2>
            
            <div style="margin-bottom: 30px;">
                <h3>Загрузка и проверка результатов</h3>
                <p>Загрузите файлы результатов тестов для проверки.</p>
                
                <input type="file" id="fileInput" multiple accept=".docx,.txt" style="display: none;">
                <button class="btn" id="chooseFileBtn">📁 Выбрать файлы</button>
                
                <div style="margin-top: 20px;">
                    <h4>Загруженные файлы:</h4>
                    <ul id="fileList"></ul>
                </div>
                
                <div id="fileViewer" class="report" style="display: none; margin-top: 20px;"></div>
                
                <!-- Панель оценки -->
                <div id="gradingPanel" style="display: none; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <h4>📝 Оценка ответов</h4>
                    <div id="gradingStats" class="grading-stats"></div>
                    <div id="answersList"></div>
                    <div style="margin-top: 15px;">
                        <button class="btn" id="saveGradingBtn">💾 Сохранить оценку</button>
                        <button class="btn ghost" id="closeGradingBtn">❌ Закрыть</button>
                    </div>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <button class="btn ghost" id="clearAllBtn">🗑️ Удалить все записи</button>
            </div>
        </div>
    `;

    const fileInput = document.getElementById("fileInput");
    const chooseFileBtn = document.getElementById("chooseFileBtn");
    const fileList = document.getElementById("fileList");
    const fileViewer = document.getElementById("fileViewer");
    const gradingPanel = document.getElementById("gradingPanel");
    
    let savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    let currentGradingFile = null;
    let currentGradingIndex = null;

    chooseFileBtn.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const base64 = arrayBufferToBase64(evt.target.result);
                
                // Проверяем, не загружен ли уже этот файл
                const existingFileIndex = savedFiles.findIndex(f => f.name === file.name);
                if (existingFileIndex !== -1) {
                    // Обновляем существующий файл
                    savedFiles[existingFileIndex] = {
                        ...savedFiles[existingFileIndex],
                        content: base64,
                        size: file.size,
                        uploaded: new Date().toLocaleString('ru-RU')
                    };
                    showMessage(`Файл "${file.name}" обновлен!`, "success");
                } else {
                    // Добавляем новый файл
                    savedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uploaded: new Date().toLocaleString('ru-RU'),
                        passed: false,
                        content: base64,
                        graded: false,
                        score: 0,
                        correctAnswers: 0,
                        totalAnswers: 0,
                        gradingData: null
                    });
                    showMessage(`Файл "${file.name}" загружен!`, "success");
                }
                
                localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
                renderFiles();
            };
            reader.readAsArrayBuffer(file);
        });
        
        fileInput.value = "";
    });

    function renderFiles() {
        if (savedFiles.length === 0) {
            fileList.innerHTML = '<li style="text-align: center; color: var(--text-muted);">Нет загруженных файлов</li>';
            return;
        }

        fileList.innerHTML = savedFiles.map((f, i) => `
            <li>
                <div class="file-info">
                    <strong>${escapeHtml(f.name)}</strong>
                    <span class="small">${(f.size / 1024).toFixed(1)} KB</span>
                </div>
                <div class="small">Загружен: ${f.uploaded}</div>
                ${f.graded ? `
                    <div class="small" style="color: ${f.score >= 70 ? 'var(--success)' : 'var(--error)'}; font-weight: bold;">
                        Оценка: ${f.score}% (${f.correctAnswers}/${f.totalAnswers})
                    </div>
                ` : ''}
                
                <div class="file-actions">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" class="pass-checkbox" data-index="${i}" ${f.passed ? "checked" : ""}>
                        <span class="small">Пройден</span>
                    </label>
                    
                    <button class="btn small open-btn" data-index="${i}">👁️ Просмотр</button>
                    <button class="btn small grade-btn" data-index="${i}">📝 ${f.graded ? 'Изменить оценку' : 'Оценить'}</button>
                    <button class="btn small ghost del-btn" data-index="${i}">❌ Удалить</button>
                </div>
            </li>
        `).join("");

        document.querySelectorAll(".pass-checkbox").forEach(cb => {
            cb.addEventListener("change", (e) => {
                const index = parseInt(e.target.dataset.index);
                savedFiles[index].passed = e.target.checked;
                localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
                
                if (e.target.checked) {
                    showMessage(`Тест "${savedFiles[index].name}" отмечен как пройденный`, "success");
                }
            });
        });

        document.querySelectorAll(".open-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                const file = savedFiles[index];
                fileViewer.style.display = "block";

                try {
                    const storedBase64 = file.content;
                    const fileText = atob(storedBase64);
                    let decryptedPlain = null;
                    
                    try {
                        const encrypted = atob(fileText);
                        decryptedPlain = CryptoJS.AES.decrypt(encrypted, AES_KEY).toString(CryptoJS.enc.Utf8);
                    } catch (err) {
                        decryptedPlain = null;
                    }

                    let contentHTML = '';
                    if (decryptedPlain && decryptedPlain.length > 0) {
                        // Если есть данные оценки, добавляем их к просмотру
                        let reportWithGrading = decryptedPlain;
                        if (file.graded) {
                            reportWithGrading += `\n\n=== ОЦЕНКА АДМИНИСТРАТОРА ===\n`;
                            reportWithGrading += `Оценка: ${file.score}%\n`;
                            reportWithGrading += `Правильных ответов: ${file.correctAnswers}/${file.totalAnswers}\n`;
                            reportWithGrading += `Статус: ${file.passed ? '✅ ПРОЙДЕН' : '❌ НЕ ПРОЙДЕН'}\n`;
                            
                            if (file.gradingData) {
                                reportWithGrading += `\nДетальная оценка:\n`;
                                file.gradingData.forEach((item, idx) => {
                                    reportWithGrading += `\n${idx + 1}. ${item.correct ? '✅ ПРАВИЛЬНО' : '❌ НЕПРАВИЛЬНО'}\n`;
                                });
                            }
                        }
                        
                        contentHTML = `<pre>${escapeHtml(reportWithGrading)}</pre>`;
                    } else {
                        contentHTML = `<pre style="color: var(--error);">Не удалось расшифровать файл. Возможно, это не зашифрованный документ теста.</pre>`;
                    }

                    fileViewer.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <strong>${escapeHtml(file.name)}</strong>
                            <button class="btn small" id="closeViewerBtn">✖ Закрыть</button>
                        </div>
                        ${contentHTML}
                    `;
                    
                    document.getElementById("closeViewerBtn").addEventListener("click", () => {
                        fileViewer.style.display = "none";
                    });
                    
                } catch (error) {
                    fileViewer.innerHTML = `<div style="color: var(--error);">Ошибка при чтении файла: ${error.message}</div>`;
                }
            });
        });

        document.querySelectorAll(".grade-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                const file = savedFiles[index];
                renderGradingPanel(file, index);
            });
        });

        document.querySelectorAll(".del-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                const fileName = savedFiles[index].name;
                
                if (confirm(`Удалить файл "${fileName}"?`)) {
                    savedFiles.splice(index, 1);
                    localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
                    renderFiles();
                    fileViewer.style.display = "none";
                    gradingPanel.style.display = "none";
                    showMessage(`Файл "${fileName}" удален`, "success");
                }
            });
        });
    }

    function renderGradingPanel(fileData, fileIndex) {
        currentGradingFile = fileData;
        currentGradingIndex = fileIndex;
        
        const gradingStats = document.getElementById("gradingStats");
        const answersList = document.getElementById("answersList");
        
        try {
            const storedBase64 = fileData.content;
            const fileText = atob(storedBase64);
            let decryptedPlain = null;
            
            try {
                const encrypted = atob(fileText);
                decryptedPlain = CryptoJS.AES.decrypt(encrypted, AES_KEY).toString(CryptoJS.enc.Utf8);
            } catch (err) {
                decryptedPlain = null;
            }

            if (decryptedPlain) {
                // Используем существующие данные оценки или парсим заново
                let answers = fileData.gradingData || parseAnswersFromReport(decryptedPlain);
                const correctCount = answers.filter(a => a.correct).length;
                const totalCount = answers.length;
                const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
                
                gradingStats.innerHTML = `
                    Правильных ответов: ${correctCount}/${totalCount} | Оценка: ${score}%
                    ${fileData.graded ? '<span style="color: var(--success);">✓ Оценка сохранена</span>' : ''}
                `;
                
                answersList.innerHTML = answers.map((answer, index) => `
                    <div class="answer-item ${answer.correct ? 'correct' : 'incorrect'}">
                        <div><strong>Вопрос ${index + 1}:</strong> ${escapeHtml(answer.question)}</div>
                        <div style="margin: 5px 0;"><strong>Ответ:</strong> ${escapeHtml(answer.answer)}</div>
                        <label style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                            <input type="checkbox" class="correct-checkbox" data-index="${index}" ${answer.correct ? 'checked' : ''}>
                            <span>✅ Правильный ответ</span>
                        </label>
                    </div>
                `).join('');

                // Обновляем галочки в реальном времени
                document.querySelectorAll('.correct-checkbox').forEach(cb => {
                    cb.addEventListener('change', (e) => {
                        const index = parseInt(e.target.dataset.index);
                        answers[index].correct = e.target.checked;
                        
                        // Обновляем статистику
                        const newCorrectCount = answers.filter(a => a.correct).length;
                        const newScore = Math.round((newCorrectCount / totalCount) * 100);
                        gradingStats.innerHTML = `
                            Правильных ответов: ${newCorrectCount}/${totalCount} | Оценка: ${newScore}%
                            ${fileData.graded ? '<span style="color: var(--success);">✓ Оценка сохранена</span>' : ''}
                        `;
                        
                        // Обновляем стиль ответа
                        const answerItem = e.target.closest('.answer-item');
                        if (e.target.checked) {
                            answerItem.classList.add('correct');
                            answerItem.classList.remove('incorrect');
                        } else {
                            answerItem.classList.add('incorrect');
                            answerItem.classList.remove('correct');
                        }
                    });
                });

                document.getElementById("saveGradingBtn").onclick = () => {
                    saveGradedResults(fileData, answers, fileIndex);
                };

                document.getElementById("closeGradingBtn").onclick = () => {
                    gradingPanel.style.display = 'none';
                };

                gradingPanel.style.display = 'block';
            }
        } catch (error) {
            showError("Ошибка при загрузке ответов для оценки: " + error.message);
        }
    }

    function parseAnswersFromReport(reportText) {
        const lines = reportText.split('\n');
        const answers = [];
        let currentQuestion = null;
        let currentAnswer = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.match(/^\d+\./)) {
                if (currentQuestion && currentAnswer !== null) {
                    answers.push({
                        question: currentQuestion,
                        answer: currentAnswer,
                        correct: false
                    });
                }
                currentQuestion = line.replace(/^\d+\.\s*/, '');
                currentAnswer = null;
            } else if (line.startsWith('Ответ:') && currentQuestion) {
                currentAnswer = line.replace('Ответ:', '').trim();
            }
        }

        if (currentQuestion && currentAnswer !== null) {
            answers.push({
                question: currentQuestion,
                answer: currentAnswer,
                correct: false
            });
        }

        return answers;
    }

    function saveGradedResults(originalFile, gradedAnswers, fileIndex) {
        const correctCount = gradedAnswers.filter(a => a.correct).length;
        const totalCount = gradedAnswers.length;
        const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        
        // Сохраняем оценку в данных файла
        savedFiles[fileIndex] = {
            ...savedFiles[fileIndex],
            graded: true,
            score: score,
            correctAnswers: correctCount,
            totalAnswers: totalCount,
            gradingData: gradedAnswers,
            passed: score >= 70 // Автоматически отмечаем как пройденный если оценка >= 70%
        };
        
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        
        showMessage(`Оценка сохранена! Результат: ${score}%`, "success");
        
        // Закрываем панель оценки и обновляем список
        gradingPanel.style.display = "none";
        renderFiles();
    }

    document.getElementById("clearAllBtn").addEventListener("click", () => {
        if (savedFiles.length === 0) {
            showMessage("Нет файлов для удаления", "info");
            return;
        }
        
        if (confirm("Удалить все загруженные файлы и оценки?")) {
            localStorage.removeItem("adminFiles");
            savedFiles = [];
            showMessage("Все файлы и оценки удалены", "success");
            renderFiles();
            fileViewer.style.display = "none";
            gradingPanel.style.display = "none";
        }
    });

    renderFiles();
}

// --- ОСНОВНОЙ РЕНДЕР ---
function render(tab) {
    if (tab === "admin") {
        renderAdmin();
    } else {
        renderTest();
    }
}

// CSS анимация для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', initUI);

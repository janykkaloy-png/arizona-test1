// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam2025kP9Lm2qR8xZ3ButIfYouLose5202tY6nB4vC7sW1BanForTheWholeLife2520";
const AES_KEY = "my_secret_aes_key_2024";
const INACTIVITY_TIMEOUT = 20000;

// Переменная для хранения статуса авторизации (сохраняется в localStorage)
let isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

let currentTestType = 'academy'; // 'academy', 'exam', 'retraining'

// База зарегистрированных игроков
let playersDatabase = JSON.parse(localStorage.getItem('playersDatabase') || '[]');

const examQuestions = [
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
    { text: "Назовите недельную норму проверок состава МО от ВП." }
];

const retrainingQuestions = [
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
    { text: "Назовите недельную норму проверок состава МО от ВП." }
];

const academyQuestions = [
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
    { text: "Назовите недельную норму проверок состава МО от ВП." }
];

let test = null;
let blocked = false;
let inactivityTimer = null;
let lastActivityTime = Date.now();

// --- СИСТЕМА РЕГИСТРАЦИИ ИГРОКОВ ---
function validateAndRegisterPlayer(username, testType) {
    // Проверяем формат ника (только латиница, цифры и пробелы)
    const nicknameRegex = /^[a-zA-Z0-9\s_-]+$/;
    if (!nicknameRegex.test(username)) {
        showError("Ник должен содержать только латинские буквы, цифры, пробелы, дефисы и подчеркивания!");
        return false;
    }
    
    if (username.length < 2) {
        showError("Ник должен содержать минимум 2 символа!");
        return false;
    }
    
    // Ищем игрока в базе
    let player = playersDatabase.find(p => p.username.toLowerCase() === username.toLowerCase());
    
    if (!player) {
        // Новый игрок - запрашиваем подтверждение ника
        const confirmed = confirm(`Вы новый игрок?\n\nВаш ник: ${username}\n\nВНИМАНИЕ: После подтверждения изменить ник будет невозможно!\n\nПодтверждаете правильность ника?`);
        
        if (!confirmed) {
            showError("Пожалуйста, введите правильный никнейм");
            return false;
        }
        
        // Регистрируем нового игрока
        player = {
            id: Date.now().toString(),
            username: username,
            registrationDate: new Date().toISOString(),
            folders: {
                exam: `${username}_Exam`,
                retraining: `${username}_Retraining`, 
                academy: `${username}_Academy`
            },
            tests: {
                exam: [],
                retraining: [],
                academy: []
            }
        };
        
        playersDatabase.push(player);
        localStorage.setItem('playersDatabase', JSON.stringify(playersDatabase));
        
        showMessage(`Игрок ${username} успешно зарегистрирован!`, "success");
    }
    
    // Сохраняем текущего игрока в сессии
    localStorage.setItem('currentPlayer', JSON.stringify(player));
    return true;
}

function getCurrentPlayer() {
    return JSON.parse(localStorage.getItem('currentPlayer') || 'null');
}

function updatePlayersDatalist() {
    const datalist = document.getElementById('playersList');
    datalist.innerHTML = playersDatabase.map(player => 
        `<option value="${player.username}">`
    ).join('');
}

// --- ФУНКЦИИ АДМИН АУТЕНТИФИКАЦИИ ---
function authenticateAdmin() {
    if (isAdminAuthenticated) {
        return true;
    }
    
    const pwd = prompt("Введите пароль для Админки:");
    if (pwd === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        localStorage.setItem('adminAuthenticated', 'true');
        return true;
    } else {
        alert("Неверный пароль!");
        return false;
    }
}

function logoutAdmin() {
    isAdminAuthenticated = false;
    localStorage.setItem('adminAuthenticated', 'false');
    showMessage("Выход из админ-панели выполнен", "info");
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelector(".tab[data-tab='academy']").classList.add("active");
    renderAcademy();
}

// --- УПРАВЛЕНИЕ ДИСКЛЕЙМЕРОМ ---
function showDisclaimer() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        showError("Введите имя перед началом теста!");
        return;
    }
    
    const modal = document.getElementById("disclaimerModal");
    modal.style.display = "flex";
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
                showError("Тест заблокирован за бездействие!");
                blockTest();
            }
        }, INACTIVITY_TIMEOUT);
    }
}

function trackActivity() {
    resetInactivityTimer();
}

function showInactivityWarning() {
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

// --- СОХРАНЕНИЕ СОСТОЯНИЯ ---
function saveTestState() {
    if (test) {
        localStorage.setItem('currentTest', JSON.stringify({
            username: test.username,
            current: test.current,
            answers: test.answers,
            shuffledQuestions: test.shuffledQuestions,
            startTime: test.startTime,
            blocked: test.blocked,
            unlockCode: test.unlockCode,
            testType: test.testType,
            playerId: test.playerId
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
            unlockCode: savedTest.unlockCode,
            testType: savedTest.testType || 'academy',
            playerId: savedTest.playerId
        };
        blocked = savedTest.blocked;
        currentTestType = savedTest.testType || 'academy';
        
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

    document.querySelectorAll("input, button").forEach(el => {
        if (!el.id.includes("unlock") && el.id !== "username" && !el.closest(".tabs")) {
            el.disabled = true;
        }
    });

    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    if (!test.unlockCode) {
        test.unlockCode = generateReadableCode();
    }

    createUnlockFile();
    saveTestState();
    renderBlockedScreen();
}

function createUnlockFile() {
    const testTypeName = getTestTypeName(test.testType);
    const unlockContent = `КОД РАЗБЛОКИРОВКИ ТЕСТА

Тип теста: ${testTypeName}
Имя пользователя: ${test.username}
Код разблокировки: ${test.unlockCode}

Причина блокировки: Бездействие
Тест заблокирован: ${new Date().toLocaleString('ru-RU')}
Прогресс: ${test.current + 1}/${TEST_COUNT} вопросов

Для разблокировки теста обратитесь к администратору.

Arizona RP | Военная Полиция`;

    const encryptedUnlock = CryptoJS.AES.encrypt(unlockContent, AES_KEY).toString();
    const unlockBlob = new Blob([btoa(encryptedUnlock)], { 
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    });
    saveAs(unlockBlob, `${test.username}_${testTypeName}_код_разблокировки.docx`);
}

function renderBlockedScreen() {
    const testTypeName = getTestTypeName(test.testType);
    const area = document.getElementById("mainArea");
    area.innerHTML = `
        <div class="blocked-note">
            <h2>🚫 ${testTypeName} заблокирован за бездействие!</h2>
            <p>Система зафиксировала отсутствие активности более 20 секунд.</p>
            <p>Файл с кодом разблокировки был скачан.</p>
            <p>Отправьте файл <strong>${test.username}_${testTypeName}_код_разблокировки.docx</strong> администратору.</p>
            
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
            renderCurrentTest();
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
        renderCurrentTest();
    } else {
        showError("Неверный код разблокировки!");
    }
}

// --- УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ ---
function initUI() {
    loadTestState();
    updatePlayersDatalist();
    
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
                if (!authenticateAdmin()) {
                    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
                    document.querySelector(".tab[data-tab='academy']").classList.add("active");
                    renderAcademy();
                    return;
                }
            }
            render(tabName);
        });
    });

    document.getElementById("startBtn").addEventListener("click", showDisclaimer);
    document.getElementById("finishBtn").addEventListener("click", finishTestManually);
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

    document.getElementById("unlockBtn").style.display = "none";

    setInterval(() => {
        if (test && !test.blocked) {
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            if (timeSinceLastActivity >= INACTIVITY_TIMEOUT - 5000) {
                showInactivityWarning();
            }
        }
    }, 1000);

    renderAcademy();
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

// --- ФУНКЦИИ ДЛЯ ТЕСТИРОВАНИЯ ---
function getQuestionsByType(type) {
    switch(type) {
        case 'exam': return examQuestions;
        case 'retraining': return retrainingQuestions;
        case 'academy': return academyQuestions;
        default: return academyQuestions;
    }
}

function getTestTypeName(type) {
    switch(type) {
        case 'exam': return 'Экзамен';
        case 'retraining': return 'Переаттестация';
        case 'academy': return 'Академия';
        default: return 'Тест';
    }
}

// --- СТАРТ ТЕСТА ---
function actuallyStartTest() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        showError("Введите имя!");
        return;
    }
    
    // Проверяем и регистрируем игрока
    if (!validateAndRegisterPlayer(username, currentTestType)) {
        return;
    }
    
    const questions = getQuestionsByType(currentTestType);
    const shuffledQuestions = shuffleArray([...questions]).slice(0, TEST_COUNT);
    const player = getCurrentPlayer();
    
    test = {
        username,
        current: 0,
        answers: {},
        shuffledQuestions,
        startTime: new Date(),
        blocked: false,
        testType: currentTestType,
        playerId: player.id
    };
    
    saveTestState();
    document.getElementById("unlockBtn").style.display = "inline-block";
    document.getElementById("finishBtn").style.display = "inline-block";
    showMessage("Тест начат! Не покидайте вкладку.", "success");
    resetInactivityTimer();
    renderCurrentTest();
}

// --- РЕНДЕР ТЕСТОВ ---
function renderCurrentTest() {
    if (currentTestType === 'exam') {
        renderExam();
    } else if (currentTestType === 'retraining') {
        renderRetraining();
    } else {
        renderAcademy();
    }
}

function renderAcademy() {
    currentTestType = 'academy';
    const area = document.getElementById("mainArea");
    
    if (!test || test.testType !== 'academy') {
        area.innerHTML = `
            <div class="question-box">
                <h2>📚 Академия Военной Полиции</h2>
                <p>Введите ваше имя в поле ниже и нажмите "Начать тест" для начала обучения в Академии.</p>
                <p><strong>Важно:</strong> Система отслеживает активность!</p>
                <p>Тест состоит из 15 случайных вопросов по теоретической подготовке.</p>
            </div>
        `;
        return;
    }

    if (test.blocked) {
        renderBlockedScreen();
        return;
    }

    renderTestQuestions();
}

function renderExam() {
    currentTestType = 'exam';
    const area = document.getElementById("mainArea");
    
    if (!test || test.testType !== 'exam') {
        area.innerHTML = `
            <div class="question-box">
                <h2>🎓 Экзамен Военной Полиции</h2>
                <p>Введите ваше имя в поле ниже и нажмите "Начать тест" для начала экзамена.</p>
                <p><strong>Важно:</strong> Система отслеживает активность!</p>
                <p>Тест состоит из 15 случайных вопросов по основной деятельности ВП.</p>
            </div>
        `;
        return;
    }

    if (test.blocked) {
        renderBlockedScreen();
        return;
    }

    renderTestQuestions();
}

function renderRetraining() {
    currentTestType = 'retraining';
    const area = document.getElementById("mainArea");
    
    if (!test || test.testType !== 'retraining') {
        area.innerHTML = `
            <div class="question-box">
                <h2>🔄 Переаттестация Военной Полиции</h2>
                <p>Введите ваше имя в поле ниже и нажмите "Начать тест" для прохождения переаттестации.</p>
                <p><strong>Важно:</strong> Система отслеживает активность!</p>
                <p>Тест состоит из 15 вопросов для обновления знаний и навыков.</p>
                <div class="retraining-notice">
                    <strong>📝 Для переаттестации в нике укажите:</strong>
                    <br><code>ВашНик - Переаттестация 1-3</code>
                </div>
            </div>
        `;
        return;
    }

    if (test.blocked) {
        renderBlockedScreen();
        return;
    }

    renderTestQuestions();
}

function renderTestQuestions() {
    const q = test.shuffledQuestions[test.current];
    const area = document.getElementById("mainArea");
    
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
                ⚠️ Система отслеживает активность!
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
        renderCurrentTest();
    } else {
        finishTest();
    }
}

function finishTestManually() {
    if (confirm("Вы уверены, что хотите завершить тест? Все ответы будут сохранены, но файл не будет скачан.")) {
        finishTestWithoutDownload();
    }
}

function finishTestWithoutDownload() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - test.startTime) / 1000 / 60);
    const testTypeName = getTestTypeName(test.testType);
    
    // Сохраняем результат теста в базу игрока
    saveTestToPlayerFolder(test, timeSpent);
    
    // Сохраняем для статистики
    saveTestResultForStatistics(test, timeSpent);

    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    clearTestState();
    document.getElementById("unlockBtn").style.display = "none";
    document.getElementById("finishBtn").style.display = "none";

    document.getElementById("mainArea").innerHTML = `
        <div class="question-box">
            <h2>✅ ${testTypeName} завершён!</h2>
            <p><strong>${escapeHtml(test.username)}</strong>, ваш ${testTypeName.toLowerCase()} успешно завершён.</p>
            <p><strong>Файл не был скачан.</strong> Результаты сохранены в системе.</p>
            <p>Ожидайте оценки администратора.</p>
            <div style="margin-top: 20px;">
                <button class="btn" id="restartBtn">Пройти тест снова</button>
            </div>
        </div>
    `;

    document.getElementById("restartBtn").addEventListener("click", () => {
        document.getElementById("username").value = "";
        document.querySelectorAll("input, button").forEach(el => el.disabled = false);
        showMessage("Готово к новому тесту!", "success");
        renderCurrentTest();
    });
}

// --- ЗАВЕРШЕНИЕ ТЕСТА ---
function finishTest() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - test.startTime) / 1000 / 60);
    const testTypeName = getTestTypeName(test.testType);
    
    let reportText = `${testTypeName.toUpperCase()} ВОЕННОЙ ПОЛИЦИИ - РЕЗУЛЬТАТЫ
=================================

Общая информация:
----------------
Имя: ${test.username}
Тип теста: ${testTypeName}
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

    const encrypted = CryptoJS.AES.encrypt(reportText, AES_KEY).toString();
    const blob = new Blob([btoa(encrypted)], { 
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    });
    
    // Сохраняем файл с временем в названии
    saveAs(blob, `${test.username}_${testTypeName}_${timeSpent}мин_результаты.docx`);

    // Сохраняем результат теста в базу игрока
    saveTestToPlayerFolder(test, timeSpent);

    // Сохраняем для статистики
    saveTestResultForStatistics(test, timeSpent);

    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }

    clearTestState();
    document.getElementById("unlockBtn").style.display = "none";
    document.getElementById("finishBtn").style.display = "none";

    document.getElementById("mainArea").innerHTML = `
        <div class="question-box">
            <h2>✅ ${testTypeName} завершён!</h2>
            <p><strong>${escapeHtml(test.username)}</strong>, ваш ${testTypeName.toLowerCase()} успешно завершён.</p>
            <p>Файл с результатами был автоматически скачан.</p>
            <p>Отправьте файл <strong>${test.username}_${testTypeName}_${timeSpent}мин_результаты.docx</strong> администратору.</p>
            <div style="margin-top: 20px;">
                <button class="btn" id="restartBtn">Пройти тест снова</button>
            </div>
        </div>
    `;

    document.getElementById("restartBtn").addEventListener("click", () => {
        document.getElementById("username").value = "";
        document.querySelectorAll("input, button").forEach(el => el.disabled = false);
        showMessage("Готово к новому тесту!", "success");
        renderCurrentTest();
    });
}

// --- СОХРАНЕНИЕ РЕЗУЛЬТАТОВ ---
function saveTestToPlayerFolder(testData, timeSpent) {
    const player = getCurrentPlayer();
    if (!player) return;
    
    const testResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: 0, // Будет установлено при оценке
        timeSpent: timeSpent,
        totalQuestions: TEST_COUNT,
        correctAnswers: 0, // Будет установлено при оценке
        graded: false
    };
    
    // Обновляем базу данных игроков
    const updatedPlayers = playersDatabase.map(p => {
        if (p.id === player.id) {
            return {
                ...p,
                tests: {
                    ...p.tests,
                    [testData.testType]: [...p.tests[testData.testType], testResult]
                }
            };
        }
        return p;
    });
    
    playersDatabase = updatedPlayers;
    localStorage.setItem('playersDatabase', JSON.stringify(playersDatabase));
    localStorage.setItem('currentPlayer', JSON.stringify(
        updatedPlayers.find(p => p.id === player.id)
    ));
}

function saveTestResultForStatistics(testData, timeSpent) {
    const testResult = {
        id: Date.now().toString(),
        username: testData.username,
        testType: testData.testType,
        score: 0, // Будет установлено при оценке
        timeSpent: timeSpent,
        totalQuestions: TEST_COUNT,
        correctAnswers: 0, // Будет установлено при оценке
        date: new Date().toISOString(),
        graded: false,
        passed: false
    };
    
    // Сохраняем во временное хранилище до оценки
    const pendingResults = JSON.parse(localStorage.getItem('pendingTestResults') || '[]');
    pendingResults.push(testResult);
    localStorage.setItem('pendingTestResults', JSON.stringify(pendingResults));
}

// --- АДМИН-ПАНЕЛЬ ---
function renderAdmin() {
    const area = document.getElementById("mainArea");
    
    // Сначала собираем статистику
    const stats = calculateStats();
    
    area.innerHTML = `
        <div class="question-box">
            <h2>🔧 Админ-панель</h2>
            <div style="margin-bottom: 15px; display: flex; justify-content: flex-end; align-items: center;">
                <button class="btn small ghost" id="logoutAdminBtn">🚪 Выйти</button>
            </div>
            
            <!-- БЛОК СТАТИСТИКИ -->
            <div style="margin-bottom: 30px;">
                <h3>📈 Статистика тестирования</h3>
                
                <!-- ОСНОВНЫЕ МЕТРИКИ -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalTests}</div>
                        <div class="stat-label">Всего тестов</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.averageScore}%</div>
                        <div class="stat-label">Средний балл</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.passRate}%</div>
                        <div class="stat-label">Проходимость</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.averageTime}</div>
                        <div class="stat-label">Среднее время</div>
                    </div>
                </div>
                
                <!-- МИНИМАЛЬНЫЕ/МАКСИМАЛЬНЫЕ ЗНАЧЕНИЯ -->
                <div class="extended-stats">
                    <div class="stat-row">
                        <div class="stat-item">
                            <span class="stat-title">📊 Баллы:</span>
                            <div class="stat-values">
                                <span>Мин: <strong>${stats.minScore}%</strong></span>
                                <span>Макс: <strong>${stats.maxScore}%</strong></span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-title">⏱️ Время:</span>
                            <div class="stat-values">
                                <span>Мин: <strong>${stats.minTime}</strong></span>
                                <span>Макс: <strong>${stats.maxTime}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- ТИПЫ ТЕСТОВ -->
                <div class="test-types">
                    <div class="type-card exam">
                        <div class="type-icon">🎓</div>
                        <div class="type-info">
                            <div class="type-count">${stats.examCount}</div>
                            <div class="type-label">Экзамены</div>
                        </div>
                    </div>
                    <div class="type-card academy">
                        <div class="type-icon">📚</div>
                        <div class="type-info">
                            <div class="type-count">${stats.academyCount}</div>
                            <div class="type-label">Академия</div>
                        </div>
                    </div>
                </div>
                
                <!-- ДЕТАЛЬНАЯ СТАТИСТИКА -->
                <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="stat-section">
                        <h4>📊 Распределение оценок</h4>
                        <div class="grade-distribution">
                            ${renderGradeDistribution(stats.gradeDistribution)}
                        </div>
                    </div>
                    <div class="stat-section">
                        <h4>🎯 Последние результаты</h4>
                        <div class="recent-results">
                            ${renderRecentResults(stats.recentResults)}
                        </div>
                    </div>
                </div>
                
                <!-- РЕЙТИНГИ ТЕСТОВ -->
                <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <!-- РЕЙТИНГ ЭКЗАМЕНОВ -->
                    <div class="stat-section">
                        <h4>📋 Рейтинг экзаменов</h4>
                        <div class="ranking-list">
                            ${renderRanking(stats.examRanking, 'exam')}
                        </div>
                    </div>
                    
                    <!-- РЕЙТИНГ АКАДЕМИИ -->
                    <div class="stat-section">
                        <h4>📋 Рейтинг академии</h4>
                        <div class="ranking-list">
                            ${renderRanking(stats.academyRanking, 'academy')}
                        </div>
                    </div>
                </div>
                
                <!-- КНОПКА ЭКСПОРТА -->
                <div style="margin-top: 20px;">
                    <button class="btn" id="exportStatsBtn">📊 Экспорт статистики</button>
                </div>
            </div>
            
            <!-- ТЕСТЫ, ОЖИДАЮЩИЕ ОЦЕНКИ -->
            <div style="margin-bottom: 30px;">
                <h3>⏳ Тесты, ожидающие оценку</h3>
                <div class="pending-tests">
                    ${renderPendingTests()}
                </div>
            </div>
            
            <!-- УПРАВЛЕНИЕ ИГРОКАМИ -->
            <div style="margin-bottom: 30px;">
                <h3>👥 Управление игроками</h3>
                <div class="players-management">
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <input type="text" id="searchPlayer" placeholder="Поиск игрока..." style="flex: 1;">
                        <button class="btn" id="searchPlayerBtn">🔍 Поиск</button>
                    </div>
                    <div class="players-list">
                        ${renderPlayersList()}
                    </div>
                </div>
            </div>
            
            <!-- ЗАГРУЗКА И ПРОВЕРКА РЕЗУЛЬТАТОВ -->
            <div style="margin-bottom: 30px;">
                <h3>📁 Загрузка и проверка результатов</h3>
                <p>Загрузите файлы результатов тестов для проверки.</p>
                
                <input type="file" id="fileInput" multiple accept=".docx,.txt" style="display: none;">
                <button class="btn" id="chooseFileBtn">📁 Выбрать файлы</button>
                
                <div style="margin-top: 20px;">
                    <h4>Загруженные файлы:</h4>
                    <ul id="fileList"></ul>
                </div>
                
                <div id="fileViewer" class="report" style="display: none; margin-top: 20px;"></div>
                
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

    // Обработчики событий
    document.getElementById("logoutAdminBtn").addEventListener("click", logoutAdmin);
    document.getElementById("exportStatsBtn").addEventListener("click", exportStatistics);
    document.getElementById("searchPlayerBtn").addEventListener("click", searchPlayers);
    document.getElementById("clearAllBtn").addEventListener("click", clearAllData);

    // Инициализация админ-панели
    initAdminPanel();
}

// Функции для админ-панели будут в следующем сообщении из-за ограничения длины...
// --- ФУНКЦИИ АДМИН-ПАНЕЛИ ---
function initAdminPanel() {
    const fileInput = document.getElementById("fileInput");
    const chooseFileBtn = document.getElementById("chooseFileBtn");
    
    chooseFileBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handleFileUpload);
    
    renderFiles();
}

function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    let savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64 = arrayBufferToBase64(evt.target.result);
            
            const existingFileIndex = savedFiles.findIndex(f => f.name === file.name);
            if (existingFileIndex !== -1) {
                savedFiles[existingFileIndex] = {
                    ...savedFiles[existingFileIndex],
                    content: base64,
                    size: file.size,
                    uploaded: new Date().toLocaleString('ru-RU')
                };
                showMessage(`Файл "${file.name}" обновлен!`, "success");
            } else {
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
}

function renderFiles() {
    const fileList = document.getElementById("fileList");
    const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    
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

    // Обработчики для файлов
    document.querySelectorAll(".pass-checkbox").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const index = parseInt(e.target.dataset.index);
            savedFiles[index].passed = e.target.checked;
            localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        });
    });

    document.querySelectorAll(".open-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            openFileViewer(savedFiles[index]);
        });
    });

    document.querySelectorAll(".grade-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            openGradingPanel(savedFiles[index], index);
        });
    });

    document.querySelectorAll(".del-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            deleteFile(index);
        });
    });
}

function openFileViewer(file) {
    const fileViewer = document.getElementById("fileViewer");
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
            let reportWithGrading = decryptedPlain;
            if (file.graded) {
                reportWithGrading += `\n\n=== ОЦЕНКА АДМИНИСТРАТОРА ===\n`;
                reportWithGrading += `Оценка: ${file.score}%\n`;
                reportWithGrading += `Правильных ответов: ${file.correctAnswers}/${file.totalAnswers}\n`;
                reportWithGrading += `Статус: ${file.passed ? '✅ ПРОЙДЕН' : '❌ НЕ ПРОЙДЕН'}\n`;
            }
            
            contentHTML = `<pre>${escapeHtml(reportWithGrading)}</pre>`;
        } else {
            contentHTML = `<pre style="color: var(--error);">Не удалось расшифровать файл.</pre>`;
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
        fileViewer.innerHTML = `<div style="color: var(--error);">Ошибка при чтении файла</div>`;
    }
}

function openGradingPanel(file, fileIndex) {
    const gradingPanel = document.getElementById("gradingPanel");
    const gradingStats = document.getElementById("gradingStats");
    const answersList = document.getElementById("answersList");
    
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

        if (decryptedPlain) {
            let answers = file.gradingData || parseAnswersFromReport(decryptedPlain);
            const correctCount = answers.filter(a => a.correct).length;
            const totalCount = answers.length;
            const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
            
            gradingStats.innerHTML = `
                Правильных ответов: ${correctCount}/${totalCount} | Оценка: ${score}%
                ${file.graded ? '<span style="color: var(--success);">✓ Оценка сохранена</span>' : ''}
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

            document.querySelectorAll('.correct-checkbox').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    answers[index].correct = e.target.checked;
                    
                    const newCorrectCount = answers.filter(a => a.correct).length;
                    const newScore = Math.round((newCorrectCount / totalCount) * 100);
                    gradingStats.innerHTML = `
                        Правильных ответов: ${newCorrectCount}/${totalCount} | Оценка: ${newScore}%
                        ${file.graded ? '<span style="color: var(--success);">✓ Оценка сохранена</span>' : ''}
                    `;
                    
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
                saveGradedResults(file, answers, fileIndex);
            };

            document.getElementById("closeGradingBtn").onclick = () => {
                gradingPanel.style.display = 'none';
            };

            gradingPanel.style.display = 'block';
        }
    } catch (error) {
        showError("Ошибка при загрузке ответов для оценки");
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
    
    // Извлекаем время из названия файла
    const timeMatch = originalFile.name.match(/(\d+)мин/);
    const timeSpent = timeMatch ? parseInt(timeMatch[1]) : 15;
    
    // Извлекаем имя пользователя и тип теста
    const username = originalFile.name.split('_')[0];
    const testType = originalFile.name.includes('Экзамен') ? 'exam' : 
                    originalFile.name.includes('Академия') ? 'academy' : 
                    originalFile.name.includes('Переаттестация') ? 'retraining' : 'unknown';
    
    const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    
    savedFiles[fileIndex] = {
        ...savedFiles[fileIndex],
        graded: true,
        score: score,
        correctAnswers: correctCount,
        totalAnswers: totalCount,
        gradingData: gradedAnswers,
        passed: score >= 70,
        username: username,
        testType: testType,
        timeSpent: timeSpent,
        gradedDate: new Date().toLocaleString('ru-RU')
    };
    
    // СОХРАНЯЕМ РЕЗУЛЬТАТ ДЛЯ СТАТИСТИКИ
    saveToStatistics({
        username: username,
        testType: testType,
        score: score,
        timeSpent: timeSpent,
        correctAnswers: correctCount,
        totalAnswers: totalCount,
        passed: score >= 70,
        date: new Date().toISOString()
    });
    
    localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
    showMessage(`Оценка сохранена! Результат: ${score}%`, "success");
    document.getElementById("gradingPanel").style.display = "none";
    renderFiles();
}

function saveToStatistics(resultData) {
    const statistics = JSON.parse(localStorage.getItem('testStatistics') || '[]');
    
    // Проверяем, нет ли уже такого результата
    const existingIndex = statistics.findIndex(stat => 
        stat.username === resultData.username && 
        stat.testType === resultData.testType &&
        Math.abs(new Date(stat.date) - new Date(resultData.date)) < 60000
    );
    
    if (existingIndex !== -1) {
        // Обновляем существующую запись
        statistics[existingIndex] = resultData;
    } else {
        // Добавляем новую запись
        statistics.push(resultData);
    }
    
    localStorage.setItem('testStatistics', JSON.stringify(statistics));
}

function deleteFile(index) {
    const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    const fileName = savedFiles[index].name;
    
    if (confirm(`Удалить файл "${fileName}"?`)) {
        savedFiles.splice(index, 1);
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        renderFiles();
        document.getElementById("fileViewer").style.display = "none";
        document.getElementById("gradingPanel").style.display = "none";
        showMessage(`Файл "${fileName}" удален`, "success");
    }
}

// --- СТАТИСТИКА ---
function calculateStats() {
    const statistics = JSON.parse(localStorage.getItem('testStatistics') || '[]');
    const gradedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]").filter(f => f.graded);
    
    if (statistics.length === 0 && gradedFiles.length === 0) {
        return getEmptyStats();
    }
    
    // Объединяем данные из статистики и оцененных файлов
    const allResults = [...statistics];
    
    // Добавляем данные из оцененных файлов (для старых записей)
    gradedFiles.forEach(file => {
        if (file.username && file.testType && file.score !== undefined) {
            const existing = allResults.find(result => 
                result.username === file.username && 
                result.testType === file.testType &&
                file.gradedDate && Math.abs(new Date(result.date) - new Date(file.gradedDate)) < 60000
            );
            
            if (!existing) {
                allResults.push({
                    username: file.username,
                    testType: file.testType,
                    score: file.score,
                    timeSpent: file.timeSpent || 15,
                    correctAnswers: file.correctAnswers || 0,
                    totalAnswers: file.totalAnswers || 15,
                    passed: file.passed || false,
                    date: file.gradedDate || new Date().toISOString()
                });
            }
        }
    });
    
    if (allResults.length === 0) {
        return getEmptyStats();
    }
    
    // Статистика по баллам
    const scores = allResults.map(f => f.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round(totalScore / allResults.length);
    
    // Статистика по времени
    const times = allResults.map(result => result.timeSpent);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const averageTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    
    // Форматирование времени
    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}` : `${mins} мин`;
    };
    
    const passedTests = allResults.filter(f => f.passed).length;
    const passRate = Math.round((passedTests / allResults.length) * 100);
    
    // Разделяем по типам тестов
    const examResults = allResults.filter(f => f.testType === 'exam');
    const academyResults = allResults.filter(f => f.testType === 'academy');
    const retrainingResults = allResults.filter(f => f.testType === 'retraining');
    
    const examCount = examResults.length;
    const academyCount = academyResults.length;
    const retrainingCount = retrainingResults.length;
    
    // Создаем рейтинги
    const examRanking = createRanking(examResults, 'Экзамен');
    const academyRanking = createRanking(academyResults, 'Академия');
    const retrainingRanking = createRanking(retrainingResults, 'Переаттестация');
    
    // Распределение оценок
    const gradeDistribution = {
        excellent: allResults.filter(f => f.score >= 90).length,
        good: allResults.filter(f => f.score >= 70 && f.score < 90).length,
        satisfactory: allResults.filter(f => f.score >= 50 && f.score < 70).length,
        fail: allResults.filter(f => f.score < 50).length
    };
    
    // Последние 5 результатов
    const recentResults = allResults
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(f => ({
            name: f.username,
            score: f.score,
            passed: f.passed,
            date: new Date(f.date).toLocaleString('ru-RU'),
            type: getTestTypeName(f.testType),
            time: formatTime(f.timeSpent)
        }));
    
    return {
        totalTests: allResults.length,
        averageScore,
        passRate,
        examCount,
        academyCount,
        retrainingCount,
        minScore,
        maxScore,
        minTime: formatTime(minTime),
        maxTime: formatTime(maxTime),
        averageTime: formatTime(averageTime),
        gradeDistribution,
        recentResults,
        examRanking,
        academyRanking,
        retrainingRanking
    };
}

function getEmptyStats() {
    return {
        totalTests: 0,
        averageScore: 0,
        passRate: 0,
        examCount: 0,
        academyCount: 0,
        retrainingCount: 0,
        minScore: 0,
        maxScore: 0,
        minTime: "0:00",
        maxTime: "0:00", 
        averageTime: "0:00",
        gradeDistribution: { excellent: 0, good: 0, satisfactory: 0, fail: 0 },
        recentResults: [],
        examRanking: [],
        academyRanking: [],
        retrainingRanking: []
    };
}

function createRanking(results, type) {
    if (results.length === 0) return [];
    
    return results
        .map(result => ({
            username: result.username,
            score: result.score,
            passed: result.passed,
            date: new Date(result.date).toLocaleString('ru-RU'),
            time: `${result.timeSpent} мин`,
            correctAnswers: result.correctAnswers || 0,
            totalAnswers: result.totalAnswers || 15
        }))
        .sort((a, b) => a.score - b.score)
        .map((result, index) => ({
            ...result,
            rank: index + 1,
            position: `${index + 1}/${results.length}`
        }));
}

function renderGradeDistribution(distribution) {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    if (total === 0) return '<p style="text-align: center; color: var(--text-muted);">Нет данных</p>';
    
    return `
        <div class="distribution-bar">
            <div class="dist-item">
                <span>Отлично (90-100%)</span>
                <div class="bar-container">
                    <div class="bar excellent" style="width: ${(distribution.excellent / total) * 100}%"></div>
                </div>
                <span>${distribution.excellent}</span>
            </div>
            <div class="dist-item">
                <span>Хорошо (70-89%)</span>
                <div class="bar-container">
                    <div class="bar good" style="width: ${(distribution.good / total) * 100}%"></div>
                </div>
                <span>${distribution.good}</span>
            </div>
            <div class="dist-item">
                <span>Удовл. (50-69%)</span>
                <div class="bar-container">
                    <div class="bar satisfactory" style="width: ${(distribution.satisfactory / total) * 100}%"></div>
                </div>
                <span>${distribution.satisfactory}</span>
            </div>
            <div class="dist-item">
                <span>Неудовл. (0-49%)</span>
                <div class="bar-container">
                    <div class="bar fail" style="width: ${(distribution.fail / total) * 100}%"></div>
                </div>
                <span>${distribution.fail}</span>
            </div>
        </div>
    `;
}

function renderRecentResults(results) {
    if (results.length === 0) return '<p style="text-align: center; color: var(--text-muted);">Нет данных</p>';
    
    return results.map(result => `
        <div class="recent-result ${result.passed ? 'passed' : 'failed'}">
            <div class="result-info">
                <strong>${result.name}</strong>
                <span class="result-type">${result.type}</span>
            </div>
            <div class="result-score ${result.score >= 70 ? 'score-good' : 'score-bad'}">
                ${result.score}%
            </div>
            <div class="result-date">${result.date}</div>
        </div>
    `).join('');
}

function renderRanking(ranking, type) {
    if (ranking.length === 0) {
        return `<p style="text-align: center; color: var(--text-muted); padding: 20px;">
                   Нет данных по ${type === 'exam' ? 'экзаменам' : type === 'academy' ? 'академии' : 'переаттестации'}
               </p>`;
    }
    
    const worstResults = ranking.slice(0, 10);
    const bestResults = ranking.slice(-5).reverse();
    
    return `
        <div class="ranking-container">
            <div class="ranking-group">
                <h5 style="color: var(--error); margin-bottom: 10px;">⬇️ Худшие результаты</h5>
                ${worstResults.map(result => `
                    <div class="ranking-item ${result.passed ? '' : 'failed'}">
                        <div class="rank-badge rank-${result.rank}">${result.rank}</div>
                        <div class="ranking-info">
                            <div class="ranking-name">${escapeHtml(result.username)}</div>
                            <div class="ranking-details">
                                <span class="ranking-score ${result.score >= 70 ? 'score-good' : 'score-bad'}">
                                    ${result.score}%
                                </span>
                                <span class="ranking-time">${result.time}</span>
                            </div>
                        </div>
                        <div class="ranking-answers">
                            ${result.correctAnswers}/${result.totalAnswers}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="ranking-group" style="margin-top: 20px;">
                <h5 style="color: var(--success); margin-bottom: 10px;">⬆️ Лучшие результаты</h5>
                ${bestResults.map(result => `
                    <div class="ranking-item ${result.passed ? 'excellent' : ''}">
                        <div class="rank-badge rank-top">${result.rank}</div>
                        <div class="ranking-info">
                            <div class="ranking-name">${escapeHtml(result.username)}</div>
                            <div class="ranking-details">
                                <span class="ranking-score score-excellent">
                                    ${result.score}%
                                </span>
                                <span class="ranking-time">${result.time}</span>
                            </div>
                        </div>
                        <div class="ranking-answers">
                            ${result.correctAnswers}/${result.totalAnswers}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderPendingTests() {
    const pendingResults = JSON.parse(localStorage.getItem('pendingTestResults') || '[]');
    
    if (pendingResults.length === 0) {
        return '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Нет тестов, ожидающих оценку</p>';
    }
    
    return `
        <div class="pending-list">
            ${pendingResults.map((test, index) => `
                <div class="pending-item">
                    <div class="pending-info">
                        <strong>${escapeHtml(test.username)}</strong>
                        <span class="pending-type">${getTestTypeName(test.testType)}</span>
                        <span class="pending-time">⏱️ ${test.timeSpent} мин</span>
                    </div>
                    <div class="pending-date">
                        ${new Date(test.date).toLocaleString('ru-RU')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-muted);">
            📝 Эти тесты завершены, но еще не оценены администратором
        </div>
    `;
}

function renderPlayersList(searchTerm = '') {
    let filteredPlayers = playersDatabase;
    
    if (searchTerm) {
        filteredPlayers = playersDatabase.filter(player => 
            player.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredPlayers.length === 0) {
        return '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Игроки не найдены</p>';
    }
    
    return `
        <div class="players-grid">
            ${filteredPlayers.map(player => `
                <div class="player-card">
                    <div class="player-header">
                        <strong>${escapeHtml(player.username)}</strong>
                        <span class="player-id">ID: ${player.id.slice(-6)}</span>
                    </div>
                    <div class="player-folders">
                        <div class="folder-item">
                            <span class="folder-icon">🎓</span>
                            <span>${player.folders.exam}</span>
                        </div>
                        <div class="folder-item">
                            <span class="folder-icon">🔄</span>
                            <span>${player.folders.retraining}</span>
                        </div>
                        <div class="folder-item">
                            <span class="folder-icon">📚</span>
                            <span>${player.folders.academy}</span>
                        </div>
                    </div>
                    <div class="player-stats">
                        <div class="stat">
                            <span>Экзамены:</span>
                            <strong>${player.tests.exam.length}</strong>
                        </div>
                        <div class="stat">
                            <span>Переатт.:</span>
                            <strong>${player.tests.retraining.length}</strong>
                        </div>
                        <div class="stat">
                            <span>Академия:</span>
                            <strong>${player.tests.academy.length}</strong>
                        </div>
                    </div>
                    <div class="player-actions">
                        <button class="btn small" onclick="viewPlayerDetails('${player.id}')">👁️ Просмотр</button>
                        <button class="btn small ghost" onclick="deletePlayer('${player.id}')">🗑️ Удалить</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-muted);">
            Всего игроков: ${filteredPlayers.length}
        </div>
    `;
}

function searchPlayers() {
    const searchTerm = document.getElementById('searchPlayer').value;
    const playersList = document.querySelector('.players-list');
    playersList.innerHTML = renderPlayersList(searchTerm);
}

function viewPlayerDetails(playerId) {
    const player = playersDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    alert(`Детали игрока:\n\nИмя: ${player.username}\nID: ${player.id}\nЗарегистрирован: ${new Date(player.registrationDate).toLocaleString('ru-RU')}\n\nПапки:\n- ${player.folders.exam}\n- ${player.folders.retraining}\n- ${player.folders.academy}\n\nТесты:\n- Экзамены: ${player.tests.exam.length}\n- Переаттестации: ${player.tests.retraining.length}\n- Академия: ${player.tests.academy.length}`);
}

function deletePlayer(playerId) {
    const player = playersDatabase.find(p => p.id === playerId);
    if (!player) return;
    
    if (confirm(`Удалить игрока "${player.username}" и все его данные?`)) {
        playersDatabase = playersDatabase.filter(p => p.id !== playerId);
        localStorage.setItem('playersDatabase', JSON.stringify(playersDatabase));
        showMessage(`Игрок "${player.username}" удален`, "success");
        renderPlayersList();
    }
}

function exportStatistics() {
    const stats = calculateStats();
    const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    const gradedFiles = savedFiles.filter(f => f.graded);
    
    let csvContent = "Статистика тестирования\n\n";
    csvContent += "Общая статистика:\n";
    csvContent += `Всего тестов,${stats.totalTests}\n`;
    csvContent += `Средний балл,${stats.averageScore}%\n`;
    csvContent += `Минимальный балл,${stats.minScore}%\n`;
    csvContent += `Максимальный балл,${stats.maxScore}%\n`;
    csvContent += `Проходимость,${stats.passRate}%\n`;
    csvContent += `Среднее время,${stats.averageTime}\n`;
    csvContent += `Минимальное время,${stats.minTime}\n`;
    csvContent += `Максимальное время,${stats.maxTime}\n`;
    csvContent += `Экзамены,${stats.examCount}\n`;
    csvContent += `Академия,${stats.academyCount}\n`;
    csvContent += `Переаттестации,${stats.retrainingCount}\n\n`;
    
    csvContent += "Распределение оценок:\n";
    csvContent += `Отлично (90-100%),${stats.gradeDistribution.excellent}\n`;
    csvContent += `Хорошо (70-89%),${stats.gradeDistribution.good}\n`;
    csvContent += `Удовлетворительно (50-69%),${stats.gradeDistribution.satisfactory}\n`;
    csvContent += `Неудовлетворительно (0-49%),${stats.gradeDistribution.fail}\n\n`;
    
    // Рейтинг экзаменов
    csvContent += "Рейтинг экзаменов (от худшего к лучшему):\n";
    csvContent += "Место,Имя,Оценка,Время,Статус,Правильные ответы\n";
    stats.examRanking.forEach(result => {
        const status = result.passed ? 'Пройден' : 'Не пройден';
        csvContent += `${result.rank},${result.username},${result.score}%,${result.time},${status},${result.correctAnswers}/${result.totalAnswers}\n`;
    });
    
    csvContent += "\nРейтинг академии (от худшего к лучшему):\n";
    csvContent += "Место,Имя,Оценка,Время,Статус,Правильные ответы\n";
    stats.academyRanking.forEach(result => {
        const status = result.passed ? 'Пройден' : 'Не пройден';
        csvContent += `${result.rank},${result.username},${result.score}%,${result.time},${status},${result.correctAnswers}/${result.totalAnswers}\n`;
    });
    
    csvContent += "\nДетальная статистика по тестам:\n";
    csvContent += "Имя,Тип,Оценка,Время,Статус,Дата,Правильные ответы,Всего вопросов\n";
    
    gradedFiles.forEach(file => {
        const type = getTestTypeName(file.testType);
        const status = file.passed ? 'Пройден' : 'Не пройден';
        const time = file.timeSpent ? `${file.timeSpent} мин` : '15 мин';
        csvContent += `"${file.username}","${type}",${file.score}%,"${time}","${status}","${file.gradedDate}",${file.correctAnswers},${file.totalAnswers}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `статистика_тестирования_${new Date().toISOString().split('T')[0]}.csv`);
}

function clearAllData() {
    if (confirm("ВНИМАНИЕ! Это удалит ВСЕ данные: игроков, тесты, статистику. Продолжить?")) {
        localStorage.clear();
        playersDatabase = [];
        showMessage("Все данные очищены", "success");
        setTimeout(() => location.reload(), 1000);
    }
}

// --- ОСНОВНОЙ РЕНДЕР ---
function render(tab) {
    if (tab === "admin") {
        renderAdmin();
    } else if (tab === "retraining") {
        renderRetraining();
    } else if (tab === "exam") {
        renderExam();
    } else {
        renderAcademy();
    }
}

// ЗАПУСК ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', initUI);


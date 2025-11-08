// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam";
const AES_KEY = "my_secret_aes_key_2024";

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

Для разблокировки теста обратитесь к администратору.
Сообщите администратору этот код.

Тест заблокирован: ${new Date().toLocaleString('ru-RU')}
Прогресс: ${test.current + 1}/${TEST_COUNT} вопросов

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
            <h2>🚫 Тест заблокирован!</h2>
            <p>Вы покинули вкладку во время тестирования.</p>
            <p><strong>Файл с кодом разблокировки был скачан.</strong></p>
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
        renderTest();
    } else {
        showError("Неверный код разблокировки!");
    }
}

// --- УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ ---
function initUI() {
    // Загружаем состояние теста при запуске
    loadTestState();
    
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
    document.getElementById("unlockBtn").addEventListener("click", unblockTest);

    document.addEventListener("visibilitychange", () => {
        if (test && !blocked && document.hidden) {
            blockTest();
        }
    });

    window.addEventListener("blur", () => {
        if (test && !blocked) {
            blockTest();
        }
    });

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

// --- СТАРТ ТЕСТА ---
function startTest() {
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
    
    showMessage("Тест начат! Не покидайте вкладку.", "success");
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
        </div>
    `;

    document.getElementById("answerInput").addEventListener("input", (e) => {
        test.answers[test.current] = e.target.value.trim();
        saveTestState();
    });
    
    document.getElementById("answerInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            nextQuestion();
        }
    });
    
    document.getElementById("nextBtn").addEventListener("click", nextQuestion);
    document.getElementById("answerInput").focus();
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

    // Очищаем состояние после завершения теста
    clearTestState();

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
                <h3>Загрузка результатов</h3>
                <p>Загрузите файлы результатов тестов для просмотра.</p>
                
                <input type="file" id="fileInput" multiple accept=".docx,.txt" style="display: none;">
                <button class="btn" id="chooseFileBtn">📁 Выбрать файлы</button>
                
                <div style="margin-top: 20px;">
                    <h4>Загруженные файлы:</h4>
                    <ul id="fileList"></ul>
                </div>
                
                <div id="fileViewer" class="report" style="display: none; margin-top: 20px;"></div>
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
    
    let savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");

    chooseFileBtn.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const base64 = arrayBufferToBase64(evt.target.result);
                savedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    uploaded: new Date().toLocaleString('ru-RU'),
                    passed: false,
                    content: base64
                });
                
                localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
                renderFiles();
                showMessage(`Файл "${file.name}" загружен!`, "success");
            };
            reader.readAsArrayBuffer(file);
        });
        
        fileInput.value = "";
    });

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function renderFiles() {
        if (savedFiles.length === 0) {
            fileList.innerHTML = '<li style="text-align: center; color: var(--text-muted);">Нет загруженных файлов</li>';
            return;
        }

        fileList.innerHTML = savedFiles.map((f, i) => `
            <li>
                <strong>${escapeHtml(f.name)}</strong>
                <span class="small">(${(f.size / 1024).toFixed(1)} KB, ${f.uploaded})</span>
                
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" class="passCheckbox" data-index="${i}" ${f.passed ? "checked" : ""}>
                        <span class="small">Пройден</span>
                    </label>
                    
                    <button class="btn small openBtn" data-index="${i}">👁️ Просмотр</button>
                    <button class="btn small ghost delBtn" data-index="${i}">❌ Удалить</button>
                </div>
            </li>
        `).join("");

        document.querySelectorAll(".passCheckbox").forEach(cb => {
            cb.addEventListener("change", (e) => {
                const index = parseInt(e.target.dataset.index);
                savedFiles[index].passed = e.target.checked;
                localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
                
                if (e.target.checked) {
                    showMessage(`Тест "${savedFiles[index].name}" отмечен как пройденный`, "success");
                }
            });
        });

        document.querySelectorAll(".openBtn").forEach(btn => {
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
                        contentHTML = `<pre>${escapeHtml(decryptedPlain)}</pre>`;
                    } else {
                        contentHTML = `<pre style="color: var(--error);">Не удалось расшифровать файл. Возможно, это не зашифрованный документ теста.</pre>`;
                    }

                    fileViewer.innerHTML = `
                        <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
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

        document.querySelectorAll(".delBtn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                const fileName = savedFiles[index].name;
                
                if (confirm(`Удалить файл "${fileName}"?`)) {
                    savedFiles.splice(index, 1);
                    localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
                    renderFiles();
                    fileViewer.style.display = "none";
                    showMessage(`Файл "${fileName}" удален`, "success");
                }
            });
        });
    }

    document.getElementById("clearAllBtn").addEventListener("click", () => {
        if (savedFiles.length === 0) {
            showMessage("Нет файлов для удаления", "info");
            return;
        }
        
        if (confirm("Удалить все загруженные файлы?")) {
            localStorage.removeItem("adminFiles");
            savedFiles = [];
            showMessage("Все файлы удалены", "success");
            renderFiles();
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

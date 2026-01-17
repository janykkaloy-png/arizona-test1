// === НАСТРОЙКИ ===
const TEST_COUNT = 15;
const ADMIN_PASSWORD = "TryToPassTheExam2025kP9Lm2qR8xZ3ButIfYouLose5202tY6nB4vC7sW1BanForTheWholeLife2520";
const AES_KEY = "my_secret_aes_key_2024";
const INACTIVITY_TIMEOUT = 20000;

let isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
let currentTestType = 'academy';
let playersDatabase = JSON.parse(localStorage.getItem('playersDatabase') || '[]');

const FIXED_EMPLOYEE_STRUCTURE = [
    { id: 'curator', position: 'Куратор ВП', type: 'curator', username: 'Chaffy_Washington' },
    { id: 'senior_officer_1', position: 'Старший офицер ВП', type: 'senior_officer', username: 'Вакантно' },
    { id: 'senior_officer_2', position: 'Старший офицер ВП', type: 'senior_officer', username: 'Вакантно' },
    { id: 'officer_1', position: 'Офицер ВП', type: 'officer', username: 'Вакантно' },
    { id: 'officer_2', position: 'Офицер ВП', type: 'officer', username: 'Angel_Extazzy' },
    { id: 'officer_3', position: 'Офицер ВП', type: 'officer', username: 'Crux_Red' },
    { id: 'officer_4', position: 'Офицер ВП', type: 'officer', username: 'Goose_Playboy' },
    { id: 'officer_5', position: 'Офицер ВП', type: 'officer', username: 'Вакантно' },
    { id: 'officer_6', position: 'Офицер ВП', type: 'officer', username: 'Вакантно' },
    { id: 'officer_7', position: 'Офицер ВП', type: 'officer', username: 'Вакантно' },
    { id: 'cadet_1', position: 'Курсант ВП', type: 'cadet', username: 'Cheer_Queensight' },
    { id: 'cadet_2', position: 'Курсант ВП', type: 'cadet', username: 'Denis_Thompson' },
    { id: 'cadet_3', position: 'Курсант ВП', type: 'cadet', username: 'Matwey_Valhalla' }
];


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
let currentGradingFile = null;
let currentGradingAnswers = null;
let currentFileIndex = null;

// --- ФУНКЦИИ ДЛЯ СОХРАНЕНИЯ ФАЙЛОВ В ПАПКИ СОТРУДНИКОВ ---

function extractUsernameFromFilename(filename) {
    console.log('🔍 Извлечение имени из файла:', filename);
    
    const nameWithoutExt = filename.replace(/\.docx$/, '');
    
    const patterns = [
        /^([^_]+_[^_]+)_(?:Academy|Академия|Exam|Экзамен|Retraining|Переаттестация)/i,
        /^([^_]+_[^_]+)_(?:Academy|Академия|Exam|Экзамен|Retraining|Переаттестация).*?оценка/i,
        /^([^_]+_[^_]+)_код_разблокировки/i,
        /^([^_]+_[^_]+)_(?:Academy|Академия|Exam|Экзамен|Retraining|Переаттестация).*?разблокировка/i,
        /^([a-zA-Z]+_[a-zA-Z]+)_/,
        /^([a-zA-Z]+)_(?:Academy|Академия|Exam|Экзамен|Retraining|Переаттестация)/i,
    ];
    
    for (const pattern of patterns) {
        const match = nameWithoutExt.match(pattern);
        if (match && match[1]) {
            const extractedName = match[1];
            console.log('✅ Извлечено полное имя:', extractedName, 'из', filename);
            return extractedName;
        }
    }
    
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 2) {
        const secondPart = parts[1].toLowerCase();
        const isTestType = ['academy', 'академия', 'exam', 'экзамен', 'retraining', 'переаттестация'].includes(secondPart);
        
        if (!isTestType && /^[a-zA-Z]+$/.test(parts[0]) && /^[a-zA-Z]+$/.test(parts[1])) {
            const fullName = `${parts[0]}_${parts[1]}`;
            console.log('✅ Извлечено полное имя (разделитель):', fullName, 'из', filename);
            return fullName;
        }
    }
    
    if (parts.length >= 1 && /^[a-zA-Z]+$/.test(parts[0])) {
        console.log('⚠️ Извлечено только имя:', parts[0], 'из', filename);
        return parts[0];
    }
    
    console.error('❌ Не удалось извлечь имя из файла:', filename);
    return null;
}

function extractTestTypeFromFilename(filename) {
    const lowerName = filename.toLowerCase();
    
    if (lowerName.includes('академия') || lowerName.includes('academy')) return 'academy';
    if (lowerName.includes('экзамен') || lowerName.includes('exam')) return 'exam';
    if (lowerName.includes('переаттестация') || lowerName.includes('retraining')) return 'retraining';
    
    const parts = filename.split('_');
    if (parts.length >= 2) {
        const possibleType = parts[1].toLowerCase();
        if (possibleType.includes('exam') || possibleType.includes('экзамен')) return 'exam';
        if (possibleType.includes('academy') || possibleType.includes('академия')) return 'academy';
        if (possibleType.includes('retraining') || possibleType.includes('переатт')) return 'retraining';
    }
    
    return 'academy';
}

function extractTimeFromFilename(filename) {
    const match = filename.match(/(\d+)мин/);
    return match ? parseInt(match[1]) : 15;
}

function findPossibleEmployees(username) {
    console.log('🔍 Поиск сотрудников для:', username);
    
    const employeesData = loadEmployeesData();
    
    if (!username || username.trim() === '') {
        return Object.values(employeesData)
            .filter(emp => emp.username && emp.username !== 'Вакантно')
            .map(emp => ({
                ...emp,
                matchScore: 50
            }));
    }
    
    const cleanUsername = username.toLowerCase().replace(/[^a-zа-яё0-9]/g, '');
    
    const results = Object.values(employeesData)
        .filter(emp => emp.username && emp.username !== 'Вакантно')
        .map(emp => {
            const cleanEmpName = emp.username.toLowerCase().replace(/[^a-zа-яё0-9]/g, '');
            let score = 0;
            
            if (cleanEmpName === cleanUsername) score = 100;
            if (cleanEmpName.includes(cleanUsername)) score = Math.max(score, 90);
            if (cleanUsername.includes(cleanEmpName)) score = Math.max(score, 85);
            
            const empParts = cleanEmpName.split(/[_\s-]/);
            const userParts = cleanUsername.split(/[_\s-]/);
            
            let partScore = 0;
            empParts.forEach(empPart => {
                userParts.forEach(userPart => {
                    if (empPart === userPart) partScore += 50;
                    else if (empPart.includes(userPart)) partScore += 30;
                    else if (userPart.includes(empPart)) partScore += 25;
                });
            });
            
            if (partScore > 0) {
                score = Math.max(score, partScore / Math.max(empParts.length, userParts.length));
            }
            
            if (cleanUsername.length < 3) {
                score *= 0.7;
            }
            
            return {
                ...emp,
                matchScore: Math.min(100, Math.round(score))
            };
        })
        .filter(emp => emp.matchScore > 30)
        .sort((a, b) => b.matchScore - a.matchScore);
    
    return results;
}

function showEmployeeSelectionModal(filename, username, testType, gradedFile, gradedAnswers, fileIndex) {
    console.log('📁 Открытие модального окна для файла:', filename);
    
    const possibleEmployees = findPossibleEmployees(username);
    
    if (possibleEmployees.length === 0) {
        showError(`Не найдено сотрудников для имени "${username}". Проверьте правильность имени в файле.`);
        return;
    }
    
    if (possibleEmployees.length === 1) {
        console.log('✅ Найден один сотрудник, сохраняем автоматически:', possibleEmployees[0].username);
        const employee = possibleEmployees[0];
        saveGradedResultsToEmployee(employee, gradedFile, gradedAnswers, fileIndex);
        return;
    }
    
    const modal = document.getElementById('employeeSelectionModal');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const employeeList = document.getElementById('employeeSelectionList');
    const confirmBtn = document.getElementById('confirmEmployeeSelection');
    
    currentGradingFile = gradedFile;
    currentGradingAnswers = gradedAnswers;
    currentFileIndex = fileIndex;
    
    fileNameDisplay.textContent = filename;
    employeeList.innerHTML = '';
    
    possibleEmployees.forEach((employee, index) => {
        const employeeOption = document.createElement('div');
        employeeOption.className = 'employee-option';
        employeeOption.innerHTML = `
            <input type="radio" name="employeeSelect" id="employee_${index}" value="${employee.id}">
            <div class="employee-info">
                <div class="employee-name">${escapeHtml(employee.username)}</div>
                <div class="employee-position">${employee.position}</div>
                <div class="employee-stats">
                    <span>📁 Академия: ${employee.files.academy.length}</span>
                    <span>🎓 Экзамен: ${employee.files.exam.length}</span>
                    <span>🔄 Переатт.: ${employee.files.retraining.length}</span>
                </div>
                <div class="employee-match-score">Совпадение: ${employee.matchScore}%</div>
            </div>
        `;
        
        employeeOption.querySelector('input').addEventListener('change', (e) => {
            document.querySelectorAll('.employee-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            employeeOption.classList.add('selected');
            confirmBtn.disabled = false;
        });
        
        employeeList.appendChild(employeeOption);
    });
    
    document.getElementById('cancelEmployeeSelection').onclick = () => {
        modal.style.display = 'none';
        showMessage('Сохранение отменено', 'info');
    };
    
    confirmBtn.onclick = () => {
        const selectedInput = document.querySelector('input[name="employeeSelect"]:checked');
        if (selectedInput) {
            const employeeId = selectedInput.value;
            const employeesData = loadEmployeesData();
            const selectedEmployee = employeesData[employeeId];
            
            if (selectedEmployee) {
                console.log('✅ Выбран сотрудник:', selectedEmployee.username);
                saveGradedResultsToEmployee(selectedEmployee, currentGradingFile, currentGradingAnswers, currentFileIndex);
                modal.style.display = 'none';
            }
        }
    };
    
    confirmBtn.disabled = true;
    document.querySelectorAll('.employee-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    modal.style.display = 'flex';
}

function saveGradedResultsToEmployee(employee, gradedFile, gradedAnswers, fileIndex) {
    console.log('💾 СОХРАНЕНИЕ для сотрудника:', employee.username);
    
    const username = employee.username;
    const testType = gradedFile.testType || extractTestTypeFromFilename(gradedFile.name);
    const timeSpent = gradedFile.timeSpent || extractTimeFromFilename(gradedFile.name) || 15;
    
    let reportText, fileName;
    
    if (gradedFile.isUnlockFile) {
        reportText = `КОД РАЗБЛОКИРОВКИ ТЕСТА - СОХРАНЁН В ПАПКУ
=================================

Тип теста: ${getTestTypeName(testType)}
Имя пользователя: ${username}
Дата сохранения: ${new Date().toLocaleString('ru-RU')}

Файл разблокировки сохранен в папку сотрудника ${username}
Администратор: Система
=================================
Arizona RP | Военная Полиция
Файл сохранен автоматически`;

        fileName = `${username}_${getTestTypeName(testType)}_разблокировка_сохранено_${new Date().toLocaleDateString('ru-RU')}.docx`;
        
    } else {
        const score = gradedFile.score;
        const correctAnswers = gradedFile.correctAnswers;
        const totalAnswers = gradedFile.totalAnswers;
        const passed = gradedFile.passed;
        const testTypeName = getTestTypeName(testType);
        
        reportText = `${testTypeName.toUpperCase()} ВОЕННОЙ ПОЛИЦИИ - РЕЗУЛЬТАТЫ С ОЦЕНКОЙ
=================================

Общая информация:
----------------
Имя: ${username}
Тип теста: ${testTypeName}
Дата оценки: ${new Date().toLocaleString('ru-RU')}
Время выполнения: ${timeSpent} минут
Всего вопросов: ${totalAnswers}
Правильных ответов: ${correctAnswers}
Оценка: ${score}%
Статус: ${passed ? '✅ ПРОЙДЕН' : '❌ НЕ ПРОЙДЕН'}

Ответы с оценкой:
----------------
`;

        gradedAnswers.forEach((answer, index) => {
            reportText += `\n${index + 1}. ${escapeHtml(answer.question)}\n`;
            reportText += `Ответ: ${escapeHtml(answer.answer)}\n`;
            reportText += `Оценка: ${answer.correct ? '✅ Правильно' : '❌ Неправильно'}\n`;
            reportText += `---------------------------------\n`;
        });

        reportText += `\n
=================================
Arizona RP | Военная Полиция
Тест оценен администратором`;

        fileName = `${username}_${testTypeName}_${timeSpent}мин_оценка_${score}%.docx`;
    }
    
    console.log('📝 Сохраняем файл:', fileName, 'для сотрудника:', username, 'тип:', testType);
    
    const success = addFileToEmployeeFolder(
        username,
        testType,
        fileName,
        reportText
    );
    
    if (success) {
        const message = gradedFile.isUnlockFile 
            ? `✅ Файл разблокировки сохранен в папку сотрудника ${username}!` 
            : `✅ Оценка сохранена! Файл "${fileName}" сохранен в папку сотрудника ${username}`;
            
        showMessage(message, "success");
        
        const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
        if (savedFiles[fileIndex]) {
            savedFiles[fileIndex].username = username;
            savedFiles[fileIndex].testType = testType;
            savedFiles[fileIndex].graded = true;
            
            if (gradedFile.isUnlockFile) {
                savedFiles[fileIndex].isUnlockFile = true;
                savedFiles[fileIndex].passed = true;
                savedFiles[fileIndex].score = 100;
            } else {
                savedFiles[fileIndex].score = gradedFile.score;
                savedFiles[fileIndex].correctAnswers = gradedFile.correctAnswers;
                savedFiles[fileIndex].totalAnswers = gradedFile.totalAnswers;
                savedFiles[fileIndex].passed = gradedFile.passed;
            }
            
            localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        }
        
        const statistics = JSON.parse(localStorage.getItem('testStatistics') || '[]');
        if (!gradedFile.isUnlockFile) {
            statistics.push({
                username: username,
                testType: testType,
                score: gradedFile.score,
                timeSpent: timeSpent,
                correctAnswers: gradedFile.correctAnswers,
                totalAnswers: gradedFile.totalAnswers,
                passed: gradedFile.passed,
                date: new Date().toISOString(),
                graded: true
            });
            
            localStorage.setItem("testStatistics", JSON.stringify(statistics));
        }
        
        const gradingPanel = document.getElementById("gradingPanel");
        if (gradingPanel) {
            gradingPanel.style.display = "none";
        }
        
        renderFiles();
        renderAdmin();
    } else {
        console.error('❌ Ошибка сохранения файла');
        showError(`❌ Не удалось сохранить файл в папку сотрудника ${username}.`);
    }
}

// --- ОСНОВНЫЕ ФУНКЦИИ СИСТЕМЫ ---

function loadEmployeesData() {
    const saved = localStorage.getItem('fixedEmployees');
    let employeesData;
    
    if (saved) {
        employeesData = JSON.parse(saved);
        FIXED_EMPLOYEE_STRUCTURE.forEach(fixedEmp => {
            if (fixedEmp.username !== 'Вакантно') {
                if (employeesData[fixedEmp.id]) {
                    employeesData[fixedEmp.id].username = fixedEmp.username;
                }
            }
        });
    } else {
        employeesData = {};
        FIXED_EMPLOYEE_STRUCTURE.forEach(emp => {
            employeesData[emp.id] = {
                ...emp,
                username: emp.username,
                folders: {
                    academy: `${emp.username !== 'Вакантно' ? emp.username : emp.position}_Академия`,
                    exam: `${emp.username !== 'Вакантно' ? emp.username : emp.position}_Экзамен`,
                    retraining: `${emp.username !== 'Вакантно' ? emp.username : emp.position}_Переаттестация`
                },
                files: {
                    academy: [],
                    exam: [],
                    retraining: []
                }
            };
        });
    }
    
    saveEmployeesData(employeesData);
    return employeesData;
}

function saveEmployeesData(employeesData) {
    localStorage.setItem('fixedEmployees', JSON.stringify(employeesData));
}

function getEmployeeByUsername(username, employeesData) {
    return Object.values(employeesData).find(emp => 
        emp.username.toLowerCase() === username.toLowerCase() && emp.username !== 'Вакантно'
    );
}

function addFileToEmployeeFolder(username, folderType, fileName, content) {
    console.log('🔍 ПОИСК СОТРУДНИКА:', username, 'тип папки:', folderType);
    
    const employeesData = loadEmployeesData();
    let employee = getEmployeeByUsername(username, employeesData);
    
    if (!employee) {
        employee = Object.values(employeesData).find(emp => 
            emp.username !== 'Вакантно' && 
            username.toLowerCase().includes(emp.username.toLowerCase())
        );
        
        if (!employee) {
            employee = Object.values(employeesData).find(emp => 
                emp.username !== 'Вакантно' && 
                emp.username.toLowerCase().includes(username.toLowerCase())
            );
        }
        
        if (!employee) {
            employee = Object.values(employeesData).find(emp => 
                emp.username !== 'Вакантно' && 
                emp.username.toLowerCase().startsWith(username.toLowerCase().split('_')[0])
            );
        }
    }
    
    if (!employee) {
        console.error(`❌ Сотрудник с именем ${username} не найден`);
        return false;
    }
    
    console.log('✅ Найден сотрудник:', employee.username, employee.position);

    const file = {
        id: Date.now().toString(),
        name: fileName,
        content: content,
        date: new Date().toLocaleString('ru-RU'),
        type: 'document',
        graded: fileName.includes('оценка') || fileName.includes('разблокировка'),
        score: content.match(/Оценка: (\d+)%/)?.[1] || 0,
        isUnlockFile: fileName.includes('разблокировка'),
        isGraded: fileName.includes('оценка'),
        isNew: true
    };

    if (!employee.files[folderType]) {
        employee.files[folderType] = [];
    }

    employee.files[folderType].push(file);
    saveEmployeesData(employeesData);
    
    console.log(`✅ Файл ${fileName} сохранен в папку ${folderType} сотрудника ${employee.username}`);
    return true;
}

function getTestTypeName(type) {
    switch(type) {
        case 'exam': return 'Экзамен';
        case 'retraining': return 'Переаттестация';
        case 'academy': return 'Академия';
        default: return 'Тест';
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

function escapeHtml(str) {
    if (typeof str !== "string") return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

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

function resetInactivityTimer() {
    lastActivityTime = Date.now();
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    if (test && !test.blocked) {
        const bufferTime = test.current === 0 ? 10000 : 0;
        
        inactivityTimer = setTimeout(() => {
            const timeSinceLastActivity = Date.now() - lastActivityTime;
            if (test && !test.blocked && timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
                console.log(`Блокировка: бездействие ${timeSinceLastActivity}ms`);
                showError("Тест заблокирован за бездействие!");
                blockTest();
            }
        }, INACTIVITY_TIMEOUT + bufferTime);
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

function shuffleArray(arr) {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function getQuestionsByType(type) {
    switch(type) {
        case 'exam': return examQuestions;
        case 'retraining': return retrainingQuestions;
        case 'academy': return academyQuestions;
        default: return academyQuestions;
    }
}

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

function actuallyStartTest() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        showError("Введите имя!");
        return;
    }
    
    if (!validateAndRegisterPlayer(username, currentTestType)) {
        return;
    }
    
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
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
                <p>Введите ваше имя в поле ниже и нажмите "Начать теста" для прохождения переаттестации.</p>
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
    
    saveAs(blob, `${test.username}_${testTypeName}_${timeSpent}мин_результаты.docx`);

    saveTestToPlayerFolder(test, timeSpent);
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
            <p>Отправьте файл <strong>${test.username}_${testTypeName}_${timeSpent}мин_результаты.docx</strong> администратору для оценки.</p>
            <p><strong>Результат будет сохранен в вашу папку только после оценки администратором.</strong></p>
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

function finishTestWithoutDownload() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - test.startTime) / 1000 / 60);
    const testTypeName = getTestTypeName(test.testType);
    
    saveTestToPlayerFolder(test, timeSpent);
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

function saveTestToPlayerFolder(testData, timeSpent) {
    const player = getCurrentPlayer();
    if (!player) return;
    
    const testResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: 0,
        timeSpent: timeSpent,
        totalQuestions: TEST_COUNT,
        correctAnswers: 0,
        graded: false
    };
    
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
        score: 0,
        timeSpent: timeSpent,
        totalQuestions: TEST_COUNT,
        correctAnswers: 0,
        date: new Date().toISOString(),
        graded: false,
        passed: false
    };
    
    const pendingResults = JSON.parse(localStorage.getItem('pendingTestResults') || '[]');
    pendingResults.push(testResult);
    localStorage.setItem('pendingTestResults', JSON.stringify(pendingResults));
}

function validateAndRegisterPlayer(username, testType) {
    const nicknameRegex = /^[a-zA-Z0-9\s_-]+$/;
    if (!nicknameRegex.test(username)) {
        showError("Ник должен содержать только латинские буквы, цифры, пробелы, дефисы и подчеркивания!");
        return false;
    }
    
    if (username.length < 2) {
        showError("Ник должен содержать минимум 2 символа!");
        return false;
    }
    
    let player = playersDatabase.find(p => p.username.toLowerCase() === username.toLowerCase());
    
    if (!player) {
        const confirmed = confirm(`Вы новый игрок?\n\nВаш ник: ${username}\n\nВНИМАНИЕ: После подтверждения изменить ник будет невозможно!\n\nПодтверждаете правильность ника?`);
        
        if (!confirmed) {
            showError("Пожалуйста, введите правильный никнейм");
            return false;
        }
        
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

    saveUnlockFileToEmployeeFolder(test.username, test.testType, unlockContent);
}

function saveUnlockFileToEmployeeFolder(username, testType, unlockContent) {
    const testTypeName = getTestTypeName(testType);
    const fileName = `${username}_${testTypeName}_разблокировка_${new Date().toLocaleDateString('ru-RU')}.docx`;
    
    const success = addFileToEmployeeFolder(
        username,
        testType,
        fileName,
        unlockContent
    );
    
    if (success) {
        console.log(`✅ Файл разблокировки сохранен в папку ${testType} сотрудника ${username}`);
    } else {
        console.error(`❌ Не удалось сохранить файл разблокировки для сотрудника ${username}`);
    }
}

function renderBlockedScreen() {
    const testTypeName = getTestTypeName(test.testType);
    const area = document.getElementById("mainArea");
    area.innerHTML = `
        <div class="blocked-note">
            <h2>🚫 ${testTypeName} заблокирован за бездействие!</h2>
            <p>Система зафиксировала отсутствие активности более 20 секунд.</p>
            <p>Файл с кодом разблокировки был скачан и сохранен в вашу папку.</p>
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

function generateReadableCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function initUI() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
    
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
            
            const contentArea = document.getElementById("contentArea");
            if (tabName === "admin") {
                contentArea.classList.add("admin-active");
                document.getElementById("mainArea").style.display = "none";
                document.getElementById("adminArea").style.display = "block";
                if (!authenticateAdmin()) {
                    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
                    document.querySelector(".tab[data-tab='academy']").classList.add("active");
                    document.getElementById("mainArea").style.display = "block";
                    document.getElementById("adminArea").style.display = "none";
                    contentArea.classList.remove("admin-active");
                    currentTestType = 'academy';
                    renderAcademy();
                    return;
                }
                renderAdmin();
            } else {
                contentArea.classList.remove("admin-active");
                document.getElementById("mainArea").style.display = "block";
                document.getElementById("adminArea").style.display = "none";
                currentTestType = tabName;
                renderCurrentTest();
            }
        });
    });

    document.getElementById("startBtn").addEventListener("click", showDisclaimer);
    document.getElementById("finishBtn").addEventListener("click", finishTestManually);
    document.getElementById("unlockBtn").addEventListener("click", unblockTest);

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
    currentTestType = 'academy';
    renderAcademy();
}

// Функции админ-панели
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    let savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64 = arrayBufferToBase64(evt.target.result);
            
            const extractedUsername = extractUsernameFromFilename(file.name);
            const testType = extractTestTypeFromFilename(file.name);
            
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
                    gradingData: null,
                    username: extractedUsername,
                    testType: testType,
                    isUnlockFile: file.name.toLowerCase().includes('разблокировк')
                });
                showMessage(`Файл "${file.name}" загружен! ${extractedUsername ? `Определен сотрудник: ${extractedUsername}` : 'Сотрудник не определен'}`, "success");
            }
            
            localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
            renderFiles();
        };
        reader.readAsArrayBuffer(file);
    });
    
    e.target.value = "";
}

function initAdminPanel() {
    const fileInput = document.getElementById("fileInput");
    const chooseFileBtn = document.getElementById("chooseFileBtn");
    
    if (chooseFileBtn) {
        chooseFileBtn.addEventListener("click", () => fileInput.click());
    }
    if (fileInput) {
        fileInput.addEventListener("change", handleFileUpload);
    }
    
    renderFiles();
}

// ВАЖНО: ОБНОВЛЕННАЯ ФУНКЦИЯ С КНОПКОЙ ДЛЯ ФАЙЛОВ РАЗБЛОКИРОВКИ
function renderFiles() {
    const fileList = document.getElementById("fileList");
    if (!fileList) return;
    
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
            ${f.name.toLowerCase().includes('разблокировк') ? `
                <div class="small" style="color: var(--warning); font-weight: bold;">
                    🔓 Файл разблокировки
                </div>
            ` : f.graded ? `
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
                
                ${f.name.toLowerCase().includes('разблокировк') ? `
                    <!-- КНОПКА ДЛЯ ФАЙЛОВ РАЗБЛОКИРОВКИ -->
                    <button class="btn small unlock-save-btn" data-index="${i}">📁 Сохранить в папку</button>
                ` : `
                    <!-- КНОПКА ДЛЯ ОБЫЧНЫХ ТЕСТОВ -->
                    <button class="btn small grade-btn" data-index="${i}">📝 ${f.graded ? 'Изменить оценку' : 'Оценить'}</button>
                `}
                
                <button class="btn small ghost del-btn" data-index="${i}">❌ Удалить</button>
            </div>
        </li>
    `).join("");

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

    // ДОБАВЛЕН ОБРАБОТЧИК ДЛЯ КНОПКИ РАЗБЛОКИРОВКИ
    document.querySelectorAll(".unlock-save-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            saveUnlockFileToEmployee(savedFiles[index], index);
        });
    });

    document.querySelectorAll(".del-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            deleteFile(index);
        });
    });
}

// НОВАЯ ФУНКЦИЯ ДЛЯ СОХРАНЕНИЯ ФАЙЛОВ РАЗБЛОКИРОВКИ
function saveUnlockFileToEmployee(file, fileIndex) {
    try {
        const storedBase64 = file.content;
        const fileText = atob(storedBase64);
        let decryptedContent = null;
        
        try {
            const encrypted = atob(fileText);
            decryptedContent = CryptoJS.AES.decrypt(encrypted, AES_KEY).toString(CryptoJS.enc.Utf8);
        } catch (err) {
            decryptedContent = fileText;
        }

        const unlockMatch = decryptedContent?.match(/Имя пользователя:\s*([^\n]+)/i);
        const username = unlockMatch ? unlockMatch[1].trim() : extractUsernameFromFilename(file.name);
        
        const typeMatch = decryptedContent?.match(/Тип теста:\s*([^\n]+)/i);
        const testType = typeMatch ? typeMatch[1].toLowerCase().includes('академи') ? 'academy' : 
                               typeMatch[1].toLowerCase().includes('экзамен') ? 'exam' : 
                               typeMatch[1].toLowerCase().includes('переаттестац') ? 'retraining' : 'academy' 
                         : extractTestTypeFromFilename(file.name);
        
        if (!username || username === '' || username === 'Вакантно') {
            showError("Не удалось определить имя сотрудника из файла!");
            return;
        }

        showEmployeeSelectionModal(
            file.name,
            username,
            testType,
            {
                ...file,
                isUnlockFile: true,
                testType: testType,
                passed: true,
                score: 100,
                correctAnswers: 1,
                totalAnswers: 1,
                timeSpent: extractTimeFromFilename(file.name) || 15
            },
            [{ question: "Файл разблокировки", answer: "Код разблокировки теста", correct: true }],
            fileIndex
        );
        
    } catch (error) {
        console.error("Ошибка при обработке файла разблокировки:", error);
        showError("Ошибка при обработке файла разблокировки");
    }
}

function openGradingPanel(file, fileIndex) {
    const gradingPanel = document.getElementById("gradingPanel");
    const gradingStats = document.getElementById("gradingStats");
    const answersList = document.getElementById("answersList");
    
    if (!gradingPanel || !gradingStats || !answersList) return;
    
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
            
            const extractedUsername = extractUsernameFromFilename(file.name);
            const testType = extractTestTypeFromFilename(file.name);
            
            answersList.innerHTML = answers.map((answer, index) => `
                <div class="answer-item ${answer.correct ? 'correct' : 'incorrect'}">
                    <div><strong>Вопрос ${index + 1}:</strong> ${escapeHtml(answer.question)}</div>
                    <div style="margin: 5px 0;"><strong>Ответ:</strong> ${escapeHtml(answer.answer)}</div>
                    <label style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                        <input type="checkbox" class="correct-checkbox" data-index="${index}" ${answer.correct ? 'checked' : ''}>
                        <span>✅ Правильный ответ</span>
                    </label>
                </div>
            `).join('') + `
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <h4>👤 Определение сотрудника</h4>
                    <p>Автоматически определено: <strong>${extractedUsername || "Не определено"}</strong></p>
                    <p>Тип теста: <strong>${getTestTypeName(testType)}</strong></p>
                    <div style="margin-top: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Введите имя сотрудника вручную:</label>
                        <input type="text" id="manualUsernameInput" 
                               style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: white;"
                               placeholder="Введите ник сотрудника"
                               value="${extractedUsername || ''}">
                    </div>
                </div>
            `;

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

            const saveGradingBtn = document.getElementById("saveGradingBtn");
            const closeGradingBtn = document.getElementById("closeGradingBtn");
            
            if (saveGradingBtn) {
                saveGradingBtn.onclick = () => {
                    file.gradingData = answers;
                    file.correctAnswers = answers.filter(a => a.correct).length;
                    file.totalAnswers = answers.length;
                    file.score = Math.round((file.correctAnswers / file.totalAnswers) * 100);
                    file.passed = file.score >= 70;
                    file.testType = testType;
                    
                    const manualUsername = document.getElementById('manualUsernameInput')?.value.trim();
                    const username = manualUsername || extractedUsername;
                    
                    if (!username) {
                        showError("Введите имя сотрудника!");
                        return;
                    }
                    
                    showEmployeeSelectionModal(file.name, username, testType, file, answers, fileIndex);
                };
            }
            
            if (closeGradingBtn) {
                closeGradingBtn.onclick = () => {
                    gradingPanel.style.display = 'none';
                };
            }

            gradingPanel.style.display = 'block';
        }
    } catch (error) {
        showError("Ошибка при загрузке ответов для оценки");
    }
}

function openFileViewer(file) {
    const fileViewer = document.getElementById("fileViewer");
    if (!fileViewer) return;
    
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

function deleteFile(index) {
    const savedFiles = JSON.parse(localStorage.getItem("adminFiles") || "[]");
    const fileName = savedFiles[index].name;
    
    if (confirm(`Удалить файл "${fileName}"?`)) {
        savedFiles.splice(index, 1);
        localStorage.setItem("adminFiles", JSON.stringify(savedFiles));
        renderFiles();
        
        const fileViewer = document.getElementById("fileViewer");
        const gradingPanel = document.getElementById("gradingPanel");
        
        if (fileViewer) fileViewer.style.display = "none";
        if (gradingPanel) gradingPanel.style.display = "none";
        
        showMessage(`Файл "${fileName}" удален`, "success");
    }
}

// --- ФУНКЦИИ ДЛЯ АДМИН-ПАНЕЛИ ---

function calculateStats() {
    const statistics = JSON.parse(localStorage.getItem('testStatistics') || '[]');
    const validResults = statistics.filter(result => 
        result.graded === true && 
        result.score !== undefined && 
        result.username && 
        result.testType
    );
    
    if (validResults.length === 0) {
        return getEmptyStats();
    }
    
    const uniqueResults = [];
    const seen = new Set();
    
    validResults.forEach(result => {
        const key = `${result.username}_${result.testType}_${new Date(result.date).getTime()}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueResults.push(result);
        }
    });
    
    const scores = uniqueResults.map(f => f.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = Math.round(totalScore / uniqueResults.length);
    
    const times = uniqueResults.map(result => result.timeSpent || 15);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const averageTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    
    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}` : `${mins} мин`;
    };
    
    const passedTests = uniqueResults.filter(f => f.passed).length;
    const passRate = Math.round((passedTests / uniqueResults.length) * 100);
    
    const examResults = uniqueResults.filter(f => f.testType === 'exam');
    const academyResults = uniqueResults.filter(f => f.testType === 'academy');
    const retrainingResults = uniqueResults.filter(f => f.testType === 'retraining');
    
    const examCount = examResults.length;
    const academyCount = academyResults.length;
    const retrainingCount = retrainingResults.length;
    
    const examRanking = createRanking(examResults, 'Экзамен');
    const academyRanking = createRanking(academyResults, 'Академия');
    const retrainingRanking = createRanking(retrainingResults, 'Переаттестация');
    
    const gradeDistribution = {
        excellent: uniqueResults.filter(f => f.score >= 90).length,
        good: uniqueResults.filter(f => f.score >= 70 && f.score < 90).length,
        satisfactory: uniqueResults.filter(f => f.score >= 50 && f.score < 70).length,
        fail: uniqueResults.filter(f => f.score < 50).length
    };
    
    const recentResults = uniqueResults
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(f => ({
            name: f.username,
            score: f.score,
            passed: f.passed,
            date: new Date(f.date).toLocaleString('ru-RU'),
            type: getTestTypeName(f.testType),
            time: formatTime(f.timeSpent || 15)
        }));
    
    return {
        totalTests: uniqueResults.length,
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
            time: `${result.timeSpent || 15} мин`,
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
                            <strong>${player.tests?.exam?.length || 0}</strong>
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
    if (playersList) {
        playersList.innerHTML = renderPlayersList(searchTerm);
    }
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
        
        const playersList = document.querySelector('.players-list');
        if (playersList) {
            playersList.innerHTML = renderPlayersList();
        }
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
    
    csvContent += "Рейтинг экзаменов (от худшего к лучшему):\n";
    csvContent += "Место,Имя,Оценка,Время,Правильные ответы,Всего вопросов,Статус\n";
    stats.examRanking.forEach(result => {
        csvContent += `${result.rank},${result.username},${result.score}%,${result.time},${result.correctAnswers},${result.totalAnswers},${result.passed ? 'ПРОЙДЕН' : 'НЕ ПРОЙДЕН'}\n`;
    });
    
    csvContent += "\nРейтинг академии (от худшего к лучшему):\n";
    csvContent += "Место,Имя,Оценка,Время,Правильные ответы,Всего вопросов,Статус\n";
    stats.academyRanking.forEach(result => {
        csvContent += `${result.rank},${result.username},${result.score}%,${result.time},${result.correctAnswers},${result.totalAnswers},${result.passed ? 'ПРОЙДЕН' : 'НЕ ПРОЙДЕН'}\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `статистика_тестирования_${new Date().toISOString().slice(0,10)}.csv`);
    showMessage("Статистика экспортирована в CSV", "success");
}

function clearAllData() {
    if (confirm("ВНИМАНИЕ! Это удалит ВСЕ данные:\n- Всех игроков\n- Все тесты\n- Всю статистику\n- Все файлы\n\nВы уверены?")) {
        const adminAuthenticated = localStorage.getItem('adminAuthenticated');
        const fixedEmployees = localStorage.getItem('fixedEmployees');
        
        localStorage.clear();
        
        if (fixedEmployees) {
            localStorage.setItem('fixedEmployees', fixedEmployees);
        }
        if (adminAuthenticated) {
            localStorage.setItem('adminAuthenticated', adminAuthenticated);
        }
        
        playersDatabase = [];
        isAdminAuthenticated = adminAuthenticated === 'true';
        
        showMessage("Все данные удалены (кроме фиксированных сотрудников)", "success");
        renderAdmin();
    }
}

function renderFixedEmployees(employeesData) {
    return `
        <div class="employees-composition">
            ${FIXED_EMPLOYEE_STRUCTURE.map(empTemplate => {
                const employee = employeesData[empTemplate.id];
                const isVacant = employee.username === 'Вакантно';
                const isFixedEmployee = FIXED_EMPLOYEE_STRUCTURE.find(fixed => 
                    fixed.id === empTemplate.id && fixed.username !== 'Вакантно'
                );
                
                let typeClass = '';
                if (employee.type === 'curator' || employee.type === 'senior_officer') {
                    typeClass = 'employee-high-rank';
                } else {
                    typeClass = 'employee-standard';
                }
                
                const academyFiles = employee.files.academy || [];
                const examFiles = employee.files.exam || [];
                const retrainingFiles = employee.files.retraining || [];
                
                return `
                    <div class="employee-slot ${typeClass}" data-employee-id="${employee.id}">
                        <div class="employee-header">
                            <div class="employee-position">${employee.position}</div>
                            <div class="employee-status ${isVacant ? 'status-vacant' : 'status-occupied'}">
                                ${isVacant ? '🔄 Вакантно' : '✅ ' + employee.username}
                            </div>
                        </div>
                        
                        <div class="employee-content">
                            ${isFixedEmployee && !isVacant ? `
                            ` : `
                                <input type="text" 
                                       class="employee-username" 
                                       value="" 
                                       placeholder="Введите ник сотрудника"
                                       data-employee-id="${employee.id}">
                                
                                <div class="employee-actions">
                                    <button class="btn small save-employee-btn" data-employee-id="${employee.id}">
                                        💾 Сохранить
                                    </button>
                                    <button class="btn small ghost clear-employee-btn" data-employee-id="${employee.id}" ${isVacant ? 'style="display: none;"' : ''}>
                                        🗑️ Очистить
                                    </button>
                                </div>
                            `}
                            
                            ${!isVacant ? `
                                <div class="employee-folders">
                                    <div class="folder-card ${getFolderState(academyFiles)}" 
                                         data-employee-id="${employee.id}" 
                                         data-folder-type="academy">
                                        ${getFolderBadges(academyFiles)}
                                        <div class="folder-icon">${getFolderIcon('academy')}</div>
                                        <div class="folder-label">${getFolderLabel('academy')}</div>
                                        <div class="folder-stats">
                                            <div class="file-count">${academyFiles.length} файлов</div>
                                            ${getFolderStatus(academyFiles, getFolderStats(academyFiles))}
                                        </div>
                                    </div>
                                    
                                    <div class="folder-card ${getFolderState(examFiles)}" 
                                         data-employee-id="${employee.id}" 
                                         data-folder-type="exam">
                                        ${getFolderBadges(examFiles)}
                                        <div class="folder-icon">${getFolderIcon('exam')}</div>
                                        <div class="folder-label">${getFolderLabel('exam')}</div>
                                        <div class="folder-stats">
                                            <div class="file-count">${examFiles.length} файлов</div>
                                            ${getFolderStatus(examFiles, getFolderStats(examFiles))}
                                        </div>
                                    </div>
                                    
                                    <div class="folder-card ${getFolderState(retrainingFiles)}" 
                                         data-employee-id="${employee.id}" 
                                         data-folder-type="retraining">
                                        ${getFolderBadges(retrainingFiles)}
                                        <div class="folder-icon">${getFolderIcon('retraining')}</div>
                                        <div class="folder-label">${getFolderLabel('retraining')}</div>
                                        <div class="folder-stats">
                                            <div class="file-count">${retrainingFiles.length} файлов</div>
                                            ${getFolderStatus(retrainingFiles, getFolderStats(retrainingFiles))}
                                        </div>
                                    </div>
                                </div>
                            ` : `
                                <div class="employee-empty">
                                    <span class="empty-text">Должность свободна</span>
                                </div>
                            `}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getFolderState(files) {
    if (files.length === 0) return 'empty';
    
    const hasUnlockFiles = files.some(f => f.isUnlockFile);
    const hasGradedFiles = files.some(f => f.graded && !f.isUnlockFile);
    const hasNewFiles = files.some(f => f.isNew);
    const hasPendingFiles = files.some(f => !f.graded && !f.isUnlockFile);
    
    if (hasUnlockFiles) return 'has-unlock';
    if (hasNewFiles) return 'has-new';
    if (hasPendingFiles) return 'has-pending';
    if (hasGradedFiles) return 'has-graded';
    
    return 'has-files';
}

function getFolderStats(files) {
    const totalFiles = files.length;
    const unlockFiles = files.filter(f => f.isUnlockFile).length;
    const gradedFiles = files.filter(f => f.graded && !f.isUnlockFile).length;
    const pendingFiles = files.filter(f => !f.graded && !f.isUnlockFile).length;
    const newFiles = files.filter(f => f.isNew).length;
    
    const averageScore = gradedFiles > 0 
        ? Math.round(files.filter(f => f.graded && !f.isUnlockFile)
                         .reduce((sum, f) => sum + parseInt(f.score), 0) / gradedFiles)
        : 0;
    
    return { 
        totalFiles, 
        unlockFiles, 
        gradedFiles, 
        pendingFiles,
        newFiles,
        averageScore 
    };
}

function getFolderIcon(folderType) {
    const icons = {
        academy: '📚',
        exam: '🎓',
        retraining: '🔄'
    };
    return icons[folderType] || '📁';
}

function getFolderLabel(folderType) {
    const labels = {
        academy: 'Академия',
        exam: 'Экзамен',
        retraining: 'Переатт.'
    };
    return labels[folderType] || folderType;
}

function getFolderBadges(files) {
    let badges = '';
    const stats = getFolderStats(files);
    
    if (stats.unlockFiles > 0) {
        badges += '<div class="folder-badge badge-unlock">🔓</div>';
    }
    if (stats.newFiles > 0) {
        badges += '<div class="folder-badge badge-new">NEW</div>';
    }
    
    return badges;
}

function getFolderStatus(files, stats) {
    if (stats.unlockFiles > 0) {
        return `<div class="folder-details">${stats.unlockFiles} блокировка</div>`;
    }
    if (stats.pendingFiles > 0) {
        return `<div class="folder-details">Ожидает оценки</div>`;
    }
    if (stats.gradedFiles > 0) {
        const scoreClass = getScoreClass(stats.averageScore);
        return `<div class="folder-score ${scoreClass}">${stats.averageScore}%</div>`;
    }
    return `<div class="folder-details"></div>`;
}

function getScoreClass(score) {
    if (score >= 90) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 50) return 'score-average';
    return 'score-poor';
}

function initEmployeesManagement() {
    document.querySelectorAll('.save-employee-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const employeeId = e.target.dataset.employeeId;
            const input = document.querySelector(`.employee-username[data-employee-id="${employeeId}"]`);
            
            if (input) {
                const username = input.value.trim();
                
                if (!username) {
                    showError('Введите ник сотрудника!');
                    return;
                }
                
                saveEmployee(employeeId, username);
            }
        });
    });
    
    document.querySelectorAll('.clear-employee-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const employeeId = e.target.dataset.employeeId;
            clearEmployee(employeeId);
        });
    });
    
    document.querySelectorAll('.employee-username').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const employeeId = e.target.dataset.employeeId;
                const username = e.target.value.trim();
                
                if (username) {
                    saveEmployee(employeeId, username);
                }
            }
        });
    });
    
    document.querySelectorAll('.folder-card').forEach(folder => {
        folder.addEventListener('click', (e) => {
            const employeeId = e.currentTarget.dataset.employeeId;
            const folderType = e.currentTarget.dataset.folderType;
            openFolderModal(employeeId, folderType);
        });
    });
}

function saveEmployee(employeeId, username) {
    const employeesData = loadEmployeesData();
    const employee = employeesData[employeeId];
    
    const fixedEmployee = FIXED_EMPLOYEE_STRUCTURE.find(emp => 
        emp.id === employeeId && emp.username !== 'Вакантно'
    );
    
    if (fixedEmployee && fixedEmployee.username !== 'Вакантно') {
        showError(`Сотрудник "${fixedEmployee.username}" является фиксированным и не может быть изменен!`);
        return;
    }
    
    const existingEmployee = getEmployeeByUsername(username, employeesData);
    if (existingEmployee && existingEmployee.id !== employeeId) {
        showError(`Сотрудник "${username}" уже назначен на должность "${existingEmployee.position}"!`);
        return;
    }
    
    employee.username = username;
    
    employee.folders = {
        academy: `${username}_Академия`,
        exam: `${username}_Экзамен`,
        retraining: `${username}_Переаттестация`
    };
    
    saveEmployeesData(employeesData);
    showMessage(`Сотрудник "${username}" назначен на должность "${employee.position}"`, 'success');
    
    renderAdmin();
}

function clearEmployee(employeeId) {
    const employeesData = loadEmployeesData();
    const employee = employeesData[employeeId];
    const oldUsername = employee.username;
    
    const fixedEmployee = FIXED_EMPLOYEE_STRUCTURE.find(emp => 
        emp.id === employeeId && emp.username !== 'Вакантно'
    );
    
    if (fixedEmployee && fixedEmployee.username !== 'Вакантно') {
        showError(`Сотрудник "${fixedEmployee.username}" является фиксированным и не может быть удален!`);
        return;
    }
    
    if (oldUsername === 'Вакантно') {
        showError('Эта должность уже свободна!');
        return;
    }
    
    if (!confirm(`Освободить должность "${employee.position}" от сотрудника "${oldUsername}"?`)) {
        return;
    }
    
    employee.username = 'Вакантно';
    
    employee.folders = {
        academy: `${employee.position}_Академия`,
        exam: `${employee.position}_Экзамен`,
        retraining: `${employee.position}_Переаттестация`
    };
    
    saveEmployeesData(employeesData);
    showMessage(`Должность "${employee.position}" освобождена`, 'success');
    
    renderAdmin();
}

function openFolderModal(employeeId, folderType) {
    const employeesData = loadEmployeesData();
    const employee = employeesData[employeeId];
    
    if (!employee) return;
    
    const folderNames = {
        academy: 'Академия',
        exam: 'Экзамен', 
        retraining: 'Переаттестация'
    };
    
    const files = employee.files[folderType] || [];
    const testFiles = files.filter(f => !f.isUnlockFile);
    const unlockFiles = files.filter(f => f.isUnlockFile);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>📁 ${employee.username} - ${folderNames[folderType]}</h2>
            <div class="small" style="margin-bottom: 15px; color: var(--text-muted);">
                📝 Файлы появляются здесь после оценки администратором или блокировки теста
            </div>
            
            <!-- КНОПКА ЗАГРУЗКИ ФАЙЛА -->
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <h4 style="margin-top: 0; color: var(--accent);">📤 Загрузить файл в папку</h4>
                <input type="file" id="folderFileInput" accept=".docx,.txt,.pdf" style="display: none;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button class="btn small" id="chooseFolderFileBtn">📁 Выбрать файл</button>
                    <span id="selectedFileName" style="color: var(--text-muted); font-size: 0.9em;">Файл не выбран</span>
                </div>
                <div style="margin-top: 10px;">
                    <button class="btn small" id="uploadToFolderBtn" disabled>⬆️ Загрузить в папку</button>
                </div>
            </div>
            
            <div class="files-list">
                ${unlockFiles.length > 0 ? `
                    <div class="file-section">
                        <div class="file-section-title">
                            <span>🔓</span>
                            <span>Файлы разблокировки (${unlockFiles.length})</span>
                        </div>
                        ${unlockFiles.map(file => `
                            <div class="file-item">
                                <div class="file-info">
                                    <div class="file-name">
                                        <span>🔓</span>
                                        ${escapeHtml(file.name)}
                                    </div>
                                    <div class="file-date">${file.date}</div>
                                    <div class="file-score" style="color: var(--warning);">Файл разблокировки</div>
                                </div>
                                <div class="file-actions">
                                    <button class="btn small download-file-btn" 
                                            data-file-content="${btoa(unescape(encodeURIComponent(file.content)))}"
                                            data-file-name="${file.name}">
                                        📥 Скачать
                                    </button>
                                    <button class="btn small ghost delete-file-btn" 
                                            data-file-id="${file.id}">
                                        🗑️ Удалить
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${testFiles.length > 0 ? `
                    <div class="file-section">
                        <div class="file-section-title">
                            <span>📝</span>
                            <span>Результаты тестов (${testFiles.length})</span>
                        </div>
                        ${testFiles.map(file => `
                            <div class="file-item">
                                <div class="file-info">
                                    <div class="file-name">
                                        ${file.graded ? '✅' : '⏳'} ${escapeHtml(file.name)}
                                    </div>
                                    <div class="file-date">${file.date}</div>
                                    ${file.graded ? `
                                        <div class="file-score ${file.score >= 70 ? 'score-good' : 'score-bad'}">
                                            Оценка: ${file.score}%
                                        </div>
                                    ` : `
                                        <div class="file-score" style="color: var(--warning);">
                                            Ожидает оценки
                                        </div>
                                    `}
                                </div>
                                <div class="file-actions">
                                    <button class="btn small download-file-btn" 
                                            data-file-content="${btoa(unescape(encodeURIComponent(file.content)))}"
                                            data-file-name="${file.name}">
                                        📥 Скачать
                                    </button>
                                    <button class="btn small ghost delete-file-btn" 
                                            data-file-id="${file.id}">
                                        🗑️ Удалить
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${files.length === 0 ? `
                    <div class="no-files-message">
                        <p>📁 В папке пока нет файлов</p>
                        <p class="small">Вы можете загрузить файлы с помощью формы выше</p>
                    </div>
                ` : ''}
            </div>
            
            <div class="modal-buttons">
                <button class="btn ghost" id="closeFolderModal">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('closeFolderModal').addEventListener('click', () => {
        modal.remove();
    });
    
    const folderFileInput = document.getElementById('folderFileInput');
    const chooseFolderFileBtn = document.getElementById('chooseFolderFileBtn');
    const uploadToFolderBtn = document.getElementById('uploadToFolderBtn');
    const selectedFileName = document.getElementById('selectedFileName');
    
    chooseFolderFileBtn.addEventListener('click', () => folderFileInput.click());
    
    folderFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            selectedFileName.textContent = file.name;
            uploadToFolderBtn.disabled = false;
        } else {
            selectedFileName.textContent = 'Файл не выбран';
            uploadToFolderBtn.disabled = true;
        }
    });
    
    uploadToFolderBtn.addEventListener('click', () => {
        const file = folderFileInput.files[0];
        if (!file) return;
        
        uploadFileToEmployeeFolder(file, employeeId, folderType, modal);
    });
    
    document.querySelectorAll('.download-file-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileContent = e.target.dataset.fileContent;
            const fileName = e.target.dataset.fileName;
            
            try {
                const content = decodeURIComponent(escape(atob(fileContent)));
                const blob = new Blob([content], { 
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                });
                saveAs(blob, fileName);
                showMessage('Файл скачан', 'success');
            } catch (error) {
                showError('Ошибка при скачивании файла');
            }
        });
    });
    
    document.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileId = e.target.dataset.fileId;
            if (confirm('Удалить этот файл?')) {
                deleteEmployeeFile(employeeId, folderType, fileId);
                modal.remove();
                renderAdmin();
            }
        });
    });
}

function uploadFileToEmployeeFolder(file, employeeId, folderType, modal) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        const fileName = file.name;
        
        const employeesData = loadEmployeesData();
        const employee = employeesData[employeeId];
        
        if (!employee) {
            showError('Сотрудник не найден!');
            return;
        }
        
        const newFile = {
            id: Date.now().toString(),
            name: fileName,
            content: typeof content === 'string' ? content : new TextDecoder().decode(content),
            date: new Date().toLocaleString('ru-RU'),
            type: 'uploaded',
            graded: false,
            score: 0,
            isUnlockFile: false,
            isGraded: false,
            isNew: true
        };
        
        if (!employee.files[folderType]) {
            employee.files[folderType] = [];
        }
        
        employee.files[folderType].push(newFile);
        saveEmployeesData(employeesData);
        
        showMessage(`Файл "${fileName}" успешно загружен в папку!`, 'success');
        
        modal.remove();
        renderAdmin();
    };
    
    reader.onerror = () => {
        showError('Ошибка при чтении файла');
    };
    
    reader.readAsText(file);
}

function deleteEmployeeFile(employeeId, folderType, fileId) {
    const employeesData = loadEmployeesData();
    const employee = employeesData[employeeId];
    
    if (!employee || !employee.files[folderType]) return;
    
    employee.files[folderType] = employee.files[folderType].filter(file => file.id !== fileId);
    saveEmployeesData(employeesData);
    
    showMessage('Файл удален', 'success');
}

function renderAdmin() {
    const area = document.getElementById("adminArea");
    const employeesData = loadEmployeesData();
    
    const totalPositions = FIXED_EMPLOYEE_STRUCTURE.length;
    const occupiedPositions = Object.values(employeesData).filter(emp => emp.username !== 'Вакантно').length;
    const vacantPositions = totalPositions - occupiedPositions;
    
    const typeCounts = {
        curator: 0,
        senior_officer: 0,
        officer: 0,
        cadet: 0
    };
    
    Object.values(employeesData).forEach(emp => {
        if (emp.username !== 'Вакантно') {
            typeCounts[emp.type]++;
        }
    });

    const stats = calculateStats();
    
    area.innerHTML = `
        <div class="admin-container">
            <div class="admin-layout">
                <!-- ЛЕВАЯ КОЛОНКА - СОТРУДНИКИ -->
                <div class="admin-employees-sidebar">
                    <h3>👥 Состав Военной Полиции</h3>
                    
                    <!-- СТАТИСТИКА СОТРУДНИКОВ -->
                    <div class="employees-stats">
                        <div class="employee-stat">
                            <div class="stat-value">${totalPositions}</div>
                            <div class="stat-label">Всего мест</div>
                        </div>
                        <div class="employee-stat">
                            <div class="stat-value">${occupiedPositions}</div>
                            <div class="stat-label">Занято</div>
                        </div>
                        <div class="employee-stat">
                            <div class="stat-value">${vacantPositions}</div>
                            <div class="stat-label">Свободно</div>
                        </div>
                    </div>
                    
                    <!-- ФИКСИРОВАННАЯ СЕТКА СОТРУДНИКОВ -->
                    ${renderFixedEmployees(employeesData)}
                    
                    <div style="margin-top: 15px; font-size: 0.9em; color: var(--text-muted);">
                        💡 Фиксированные сотрудники не могут быть изменены. Редактирование доступно только для вакантных мест.
                    </div>
                </div>

                <!-- ПРАВАЯ КОЛОНКА - ОСНОВНОЙ КОНТЕНТ -->
                <div class="admin-main-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="color: var(--accent); margin: 0;">📊 Админ-панель</h2>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn small" onclick="exportStatistics()">📈 Экспорт статистики</button>
                            <button class="btn small ghost" onclick="logoutAdmin()">🚪 Выйти</button>
                        </div>
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
                        
                        <!-- Дополнительная статистика -->
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
                            <div class="type-card">
                                <div class="type-icon">🔄</div>
                                <div class="type-info">
                                    <div class="type-count">${stats.retrainingCount}</div>
                                    <div class="type-label">Переаттестация</div>
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
                            <div class="stat-section">
                                <h4>📋 Рейтинг экзаменов</h4>
                                <div class="ranking-list">
                                    ${renderRanking(stats.examRanking, 'exam')}
                                </div>
                            </div>
                            
                            <div class="stat-section">
                                <h4>📋 Рейтинг академии</h4>
                                <div class="ranking-list">
                                    ${renderRanking(stats.academyRanking, 'academy')}
                                </div>
                            </div>
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
                        <p><strong>Важно:</strong> Файлы автоматически сохраняются в папки сотрудников только после оценки!</p>
                        <p>Система определит имя сотрудника из названия файла (формат: <code>Имя_Фамилия_ТипТеста_время_результаты.docx</code>)</p>
                        
                        <input type="file" id="fileInput" multiple accept=".docx,.txt" style="display: none;">
                        <button class="btn" id="chooseFileBtn">📁 Выбрать файлы</button>
                        
                        <div style="margin-top: 20px;">
                            <h4>Загруженные файлы:</h4>
                            <ul id="fileList"></ul>
                        </div>
                        
                        <div id="gradingPanel" style="display: none; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                            <h4>📝 Оценка ответов</h4>
                            <div id="gradingStats" class="grading-stats"></div>
                            <div id="answersList"></div>
                            <div style="margin-top: 15px;">
                                <button class="btn" id="saveGradingBtn">💾 Сохранить оценку</button>
                                <button class="btn ghost" id="closeGradingBtn">❌ Закрыть</button>
                            </div>
                        </div>
                        
                        <div id="fileViewer" class="report" style="display: none; margin-top: 20px;"></div>
                    </div>
                    
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                        <button class="btn ghost" id="clearAllBtn" onclick="clearAllData()">🗑️ Удалить все записи</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="fileViewer" class="modal-overlay" style="display: none;">
            <div class="modal-content" style="max-width: 800px; max-height: 80vh;"></div>
        </div>
    `;

    document.getElementById("logoutAdminBtn")?.addEventListener("click", logoutAdmin);
    
    initAdminPanel();
    initEmployeesManagement();
    
    const searchPlayerBtn = document.getElementById('searchPlayerBtn');
    if (searchPlayerBtn) {
        searchPlayerBtn.addEventListener('click', searchPlayers);
    }
    
    const searchPlayerInput = document.getElementById('searchPlayer');
    if (searchPlayerInput) {
        searchPlayerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPlayers();
            }
        });
    }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener('DOMContentLoaded', initUI);













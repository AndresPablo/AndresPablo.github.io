// js/custom-script.js
// Sin skillMapping: los IDs de los checkboxes deben coincidir con los nombres en classes.json

let CLASSES_DATA = null;
let SKILLS_DATA = null;
let currentCharacter = {};

let remainingSkillPoints = 0;
let remainingTrained = 0;
let remainingExpert = 0;
let remainingMaster = 0;

let currentLang = 'SPA'; // 'SPA' o 'ENG'

// Utilidades de dados
function roll2d10Plus(base) {
    return Math.floor(Math.random() * 10) + 1 + Math.floor(Math.random() * 10) + 1 + base;
}
function rollStat() { return roll2d10Plus(25); }
function rollSave() { return roll2d10Plus(10); }
function rollHealth() { return Math.floor(Math.random() * 10) + 1 + 10; }
function rollStress() { return Math.floor(Math.random() * 10) + 1; }
function randomCredits() { return Math.floor(Math.random() * 800) + 50; }

const FIRST_NAMES = ["Ellen", "Dwayne", "Ripley", "Amanda", "Arthur", "Janek", "Foster", "Lyova", "Nova", "Cassian", "Irina", "Sam", "Jones", "Marlow", "Petrov", "Zoe", "Hideo", "Sakura"];
const LAST_NAMES = ["Ripley", "Hicks", "Kane", "Vickers", "Cleveland", "Morse", "Dallas", "Lambert", "Brett", "Parker", "Ash", "Bishop", "Call", "Johner", "Christie", "Yutani"];
function randomName() { return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] + " " + LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]; }
function randomAge() { return Math.floor(Math.random() * 45) + 20; }

function applyClassBonuses(baseStats, baseSaves, classData) {
    let finalStats = { ...baseStats };
    finalStats.strength += (classData.strength_bonus || 0);
    finalStats.speed += (classData.speed_bonus || 0);
    finalStats.intellect += (classData.intellect_bonus || 0);
    finalStats.combat += (classData.combat_bonus || 0);
    let chooseStat = classData.choose_stat_bonus || 0;
    if (chooseStat !== 0) finalStats.strength += chooseStat;

    let finalSaves = { ...baseSaves };
    finalSaves.sanity += (classData.sanity_bonus || 0);
    finalSaves.fear += (classData.fear_bonus || 0);
    finalSaves.body += (classData.body_bonus || 0);
    let chooseSave = classData.choose_save_bonus || 0;
    if (chooseSave !== 0) finalSaves.sanity += chooseSave;
    return { finalStats, finalSaves };
}

// Marca y bloquea habilidades iniciales de clase (sin mapeo: usa directamente el nombre del skill)
function applyStartingSkills(classId) {
    // Limpiar todo (desmarcar, habilitar, quitar atributo)
    document.querySelectorAll('#character-section input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
        cb.removeAttribute('data-starting');
    });
    // Luego marcar y bloquear los de la nueva clase
    const classData = CLASSES_DATA[classId];
    if (classData && classData.starting_skills) {
        classData.starting_skills.forEach(skillName => {
            const cb = document.getElementById(skillName);
            if (cb) {
                cb.checked = true;
                cb.disabled = true;
                cb.setAttribute('data-starting', 'true');
            }
        });
    }
}

// Cargar textos y dependencias desde skills.json
async function loadAndApplySkillTexts() {
    if (!SKILLS_DATA) return;
    for (const [id, skillInfo] of Object.entries(SKILLS_DATA)) {
        const checkbox = document.getElementById(id);
        if (!checkbox) continue;
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) continue;
        const displayName = skillInfo[`display_name_${currentLang}`] || skillInfo.display_name_ENG || id;
        const description = skillInfo[`description_${currentLang}`] || skillInfo.description_ENG || "";
        const abbr = document.createElement('abbr');
        abbr.title = description;
        abbr.textContent = displayName;
        label.innerHTML = '';
        label.appendChild(abbr);
        if (skillInfo.requires && skillInfo.requires.length > 0 && skillInfo.requires[0] !== "") {
            checkbox.setAttribute('data-requires', JSON.stringify(skillInfo.requires));
        } else {
            checkbox.removeAttribute('data-requires');
        }
    }
}

function checkDependencies(checkbox, isChecking) {
    const requires = checkbox.getAttribute('data-requires');
    if (!requires) return true;
    const requiredIds = JSON.parse(requires);
    if (isChecking) {
        for (let reqId of requiredIds) {
            const reqCb = document.getElementById(reqId);
            if (!reqCb || !reqCb.checked || reqCb.disabled) {
                return false;
            }
        }
        return true;
    } else {
        const allCheckboxes = document.querySelectorAll('#character-section input[type="checkbox"]');
        for (let other of allCheckboxes) {
            if (other === checkbox) continue;
            const otherRequires = other.getAttribute('data-requires');
            if (otherRequires && other.checked) {
                const reqs = JSON.parse(otherRequires);
                if (reqs.includes(checkbox.id)) {
                    return false;
                }
            }
        }
        return true;
    }
}

function onSkillCheckboxChange(event, checkbox, category) {
    event.stopPropagation();
    if (checkbox.disabled) return;
    const isChecking = checkbox.checked;
    if (isChecking) {
        if (!checkDependencies(checkbox, true)) {
            checkbox.checked = false;
            alert(`No puedes tomar esta habilidad sin antes tener: ${checkbox.getAttribute('data-requires')}`);
            return;
        }
        let canTake = false;
        if (category === 'trained') {
            if (remainingTrained > 0) {
                remainingTrained--;
                canTake = true;
            } else if (remainingSkillPoints > 0) {
                remainingSkillPoints--;
                canTake = true;
            }
        } else if (category === 'expert') {
            if (remainingExpert > 0) {
                remainingExpert--;
                canTake = true;
            } else if (remainingSkillPoints > 0) {
                remainingSkillPoints--;
                canTake = true;
            }
        } else if (category === 'master') {
            if (remainingMaster > 0) {
                remainingMaster--;
                canTake = true;
            }
        }
        if (!canTake) {
            checkbox.checked = false;
            alert(`No tienes puntos disponibles para ${category === 'trained' ? 'Entrenadas' : category === 'expert' ? 'Expertas' : 'Maestrías'}.`);
            return;
        }
    } else {
        if (!checkDependencies(checkbox, false)) {
            checkbox.checked = true;
            alert(`No puedes desmarcar esta habilidad porque otras habilidades dependen de ella.`);
            return;
        }
        if (category === 'trained') remainingTrained++;
        else if (category === 'expert') remainingExpert++;
        else if (category === 'master') remainingMaster++;
    }
    updatePointsDisplay();
}

function bindAllCheckboxEvents() {
    // Usar .col-4-md (clase correcta en el HTML)
    document.querySelectorAll('.col-4-md:first-of-type input[type="checkbox"]').forEach(cb => {
        cb.onchange = (e) => onSkillCheckboxChange(e, cb, 'trained');
    });
    document.querySelectorAll('.col-4-md:nth-of-type(2) input[type="checkbox"]').forEach(cb => {
        cb.onchange = (e) => onSkillCheckboxChange(e, cb, 'expert');
    });
    document.querySelectorAll('.col-4-md:last-of-type input[type="checkbox"]').forEach(cb => {
        cb.onchange = (e) => onSkillCheckboxChange(e, cb, 'master');
    });
}

function updatePointsDisplay() {
    const trainedCol = document.querySelector('.col-4-md:first-of-type h5');
    const expertCol = document.querySelector('.col-4-md:nth-of-type(2) h5');
    const masterCol = document.querySelector('.col-4-md:last-of-type h5');
    
    if (trainedCol && !document.getElementById('trainedPointsIndicator')) {
        const span = document.createElement('span');
        span.id = 'trainedPointsIndicator';
        span.style.fontSize = '0.8rem';
        span.style.display = 'block';
        span.style.marginTop = '5px';
        trainedCol.parentNode.insertBefore(span, trainedCol.nextSibling);
    }
    if (expertCol && !document.getElementById('expertPointsIndicator')) {
        const span = document.createElement('span');
        span.id = 'expertPointsIndicator';
        span.style.fontSize = '0.8rem';
        span.style.display = 'block';
        span.style.marginTop = '5px';
        expertCol.parentNode.insertBefore(span, expertCol.nextSibling);
    }
    if (masterCol && !document.getElementById('masterPointsIndicator')) {
        const span = document.createElement('span');
        span.id = 'masterPointsIndicator';
        span.style.fontSize = '0.8rem';
        span.style.display = 'block';
        span.style.marginTop = '5px';
        masterCol.parentNode.insertBefore(span, masterCol.nextSibling);
    }
    
    const trainedSpan = document.getElementById('trainedPointsIndicator');
    const expertSpan = document.getElementById('expertPointsIndicator');
    const masterSpan = document.getElementById('masterPointsIndicator');
    if (trainedSpan) trainedSpan.innerText = `🎓 Puntos Entrenadas restantes: ${remainingTrained}`;
    if (expertSpan) expertSpan.innerText = `🔧 Puntos Expertas restantes: ${remainingExpert}`;
    if (masterSpan) masterSpan.innerText = `🏆 Puntos Maestrías restantes: ${remainingMaster}`;
    
    const bonusP = document.querySelector("#bonusSkillPointsBox p");
    if (bonusP) {
        if (remainingSkillPoints > 0) {
            bonusP.innerHTML = `🎯 Puntos libres (Entrenadas/Expertas): <strong>${remainingSkillPoints}</strong>`;
        } else {
            bonusP.innerHTML = `⚠️ No quedan puntos libres. Usa los puntos específicos de cada columna.`;
        }
    }
}

function resetPointsAndSkills(classObj) {
    remainingSkillPoints = classObj.skill_points || 0;
    remainingTrained = classObj.bonus_trained_skills || 0;
    remainingExpert = classObj.bonus_expert_skills || 0;
    remainingMaster = classObj.bonus_master_skills || 0;
    
    document.querySelectorAll('#character-section input[type="checkbox"]').forEach(cb => {
        if (!cb.disabled) cb.checked = false;
    });
    applyStartingSkills(currentCharacter.classId);
    updatePointsDisplay();
    bindAllCheckboxEvents();
}

function updateUI() {
    const classObj = CLASSES_DATA[currentCharacter.classId];
    if (!classObj) return;
    const { finalStats, finalSaves } = applyClassBonuses(currentCharacter.baseStats, currentCharacter.baseSaves, classObj);
    document.getElementById("strengthStatValue").innerText = finalStats.strength;
    document.getElementById("speedStatValue").innerText = finalStats.speed;
    document.getElementById("intelectStatValue").innerText = finalStats.intellect;
    document.getElementById("combatStatValue").innerText = finalStats.combat;
    document.getElementById("sanitySaveValue").innerText = finalSaves.sanity;
    document.getElementById("fearSaveValue").innerText = finalSaves.fear;
    document.getElementById("bodySaveValue").innerText = finalSaves.body;
    document.getElementById("characterClassSpan").innerText = classObj.display_name;
    document.getElementById("classTraumaResponse").innerHTML = `⚠️ ${classObj.trauma_response}`;
    let maxWoundsTotal = 2 + (classObj.max_wounds_bonus || 0);
    document.getElementById("wounds").innerText = maxWoundsTotal;
    document.getElementById("healthPoints").innerText = currentCharacter.currentHealth;
    document.getElementById("equipedArmorPoints").innerText = "0";
    document.getElementById("equipedDamageReduction").innerText = "0";
    document.getElementById("currentStress").innerText = currentCharacter.stressCurrent;
    const minSpan = document.getElementById("minStress");
    if (minSpan) minSpan.innerText = classObj.min_stress || 2;
    document.getElementById("characterName").value = currentCharacter.name;
    document.getElementById("characterAge").value = currentCharacter.age;
    document.getElementById("characterNickname").value = currentCharacter.nickname || "";
    document.getElementById("credits").innerText = currentCharacter.credits;
    document.getElementById("trainedSkillBonus").innerText = "10";
    document.getElementById("expertSkillBonus").innerText = "15";
    document.getElementById("masterSkillBonus").innerText = "20";
    resetPointsAndSkills(classObj);
}

function fullRegenerate() {
    const classKeys = Object.keys(CLASSES_DATA);
    const randomClassId = classKeys[Math.floor(Math.random() * classKeys.length)];
    currentCharacter = {
        baseStats: { strength: rollStat(), speed: rollStat(), intellect: rollStat(), combat: rollStat() },
        baseSaves: { sanity: rollSave(), fear: rollSave(), body: rollSave() },
        healthMax: rollHealth(),
        currentHealth: rollHealth(),
        stressCurrent: rollStress(),
        maxWoundsBase: 2,
        classId: randomClassId,
        credits: randomCredits(),
        name: randomName(),
        age: randomAge(),
        nickname: ""
    };
    updateUI();
}

function regenerateClassOnly() {
    const classKeys = Object.keys(CLASSES_DATA);
    currentCharacter.classId = classKeys[Math.floor(Math.random() * classKeys.length)];
    updateUI();
}

function rerollStatsAndSaves() {
    currentCharacter.baseStats = { strength: rollStat(), speed: rollStat(), intellect: rollStat(), combat: rollStat() };
    currentCharacter.baseSaves = { sanity: rollSave(), fear: rollSave(), body: rollSave() };
    updateUI();
}

function randomizeCredits() {
    currentCharacter.credits = randomCredits();
    document.getElementById("credits").innerText = currentCharacter.credits;
}

function randomizeIdentity() {
    currentCharacter.name = randomName();
    currentCharacter.age = randomAge();
    currentCharacter.nickname = "";
    document.getElementById("characterName").value = currentCharacter.name;
    document.getElementById("characterAge").value = currentCharacter.age;
    document.getElementById("characterNickname").value = "";
}

// --------------------------------------------------------------
// CATÁLOGO: toggle secciones y carga de datos
// --------------------------------------------------------------
let weaponsData = [];
let armorsData = [];
let cyberwareData = [];

async function loadCatalogData() {
    try {
        const [weaponsRes, armorsRes, cyberwareRes] = await Promise.all([
            fetch('./data/core-rules/weapons.json'),
            fetch('./data/core-rules/armors.json'),
            fetch('./data/core-rules/cyberware.json')
        ]);
        
        if (weaponsRes.ok) {
            let weaponsJson = await weaponsRes.json();
            weaponsData = weaponsJson.weapons 
                ? (Array.isArray(weaponsJson.weapons) ? weaponsJson.weapons : Object.values(weaponsJson.weapons))
                : [];
        }
        if (armorsRes.ok) {
            let armorsJson = await armorsRes.json();
            armorsData = armorsJson.armors 
                ? (Array.isArray(armorsJson.armors) ? armorsJson.armors : Object.values(armorsJson.armors))
                : [];
        }
        if (cyberwareRes.ok) {
            let cyberJson = await cyberwareRes.json();
            cyberwareData = cyberJson.cyberware 
                ? (Array.isArray(cyberJson.cyberware) ? cyberJson.cyberware : Object.values(cyberJson.cyberware))
                : [];
        }
    } catch (error) {
        console.error("Error cargando catálogo:", error);
        weaponsData = []; armorsData = []; cyberwareData = [];
    }
}


function renderWeaponsTable() {
    const tbody = document.querySelector("#weapons-list tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (weaponsData.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 7;
        cell.textContent = "No hay armas cargadas.";
        return;
    }
    weaponsData.forEach(weapon => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = "🔫";
        row.insertCell(1).textContent = weapon.name || "?";
        row.insertCell(2).textContent = weapon.damage || "?";
        row.insertCell(3).textContent = weapon.range || "?";
        row.insertCell(4).textContent = weapon.capacity || weapon.shots || "?";
        row.insertCell(5).textContent = weapon.special || "";
        row.insertCell(6).textContent = `${weapon.price || 0} cr`;
    });
}

function renderArmorsTable() {
    const tbody = document.querySelector("#armor-list tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (armorsData.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.textContent = "No hay armaduras cargadas.";
        return;
    }
    armorsData.forEach(armor => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = "🛡️";
        row.insertCell(1).textContent = armor.name || "?";
        row.insertCell(2).textContent = `${armor.pa || 0} PA`;
        row.insertCell(3).textContent = armor.rd ? `${armor.rd} RD` : "-";
        row.insertCell(4).textContent = armor.special || "";
        row.insertCell(5).textContent = `${armor.price || 0} cr`;
    });
}

function renderCyberwareTable() {
    const tbody = document.querySelector("#cyberware-list tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (cyberwareData.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.textContent = "No hay ciberware cargado.";
        return;
    }
    cyberwareData.forEach(cyber => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = "🧠";
        row.insertCell(1).textContent = cyber.name || "?";
        row.insertCell(2).textContent = cyber.slots || "1";
        row.insertCell(3).textContent = cyber.description || "";
        row.insertCell(4).textContent = cyber.requirement || "";
        row.insertCell(5).textContent = `${cyber.price || 0} cr`;
    });
}

function hideAllTables() {
    
}


function showCharacters() {
    const charSection = document.getElementById('character-section');
    const itemsSection = document.getElementById('items-section');
    if (charSection) charSection.classList.remove('d-none');
    if (itemsSection) itemsSection.classList.add('d-none');
}

function showItems() {
    const charSection = document.getElementById('character-section');
    const itemsSection = document.getElementById('items-section');
    if (charSection) charSection.classList.add('d-none');
    if (itemsSection) itemsSection.classList.remove('d-none');
    renderWeaponsTable();
    renderArmorsTable();
    renderCyberwareTable();
}

function showMercenaries() {
    const charSection = document.getElementById('character-section');
    const itemsSection = document.getElementById('items-section');
    if (charSection) charSection.classList.add('d-none');
    if (itemsSection) itemsSection.classList.add('d-none');
}

function bindCatalogEvents() {
    const btnCatalogo = document.getElementById("btnCatalogo");
    const btnPersonajes = document.getElementById("btnPersonajes");
    const btnMercenaries = document.getElementById("btnMercenaries");
    if (btnCatalogo) btnCatalogo.addEventListener("click", showItems);
    if (btnPersonajes) btnPersonajes.addEventListener("click", showCharacters);
    if (btnMercenaries) btnMercenaries.addEventListener("click", showMercenaries);
}

// --------------------------------------------------------------
// INICIALIZACIÓN PRINCIPAL
// --------------------------------------------------------------
async function loadClassesAndInit() {
    try {
        const [classesRes, skillsRes] = await Promise.all([
            fetch('./data/core-rules/classes.json'),
            fetch('./data/core-rules/skills.json')
        ]);
        if (!classesRes.ok) throw new Error(`Classes HTTP ${classesRes.status}`);
        if (!skillsRes.ok) throw new Error(`Skills HTTP ${skillsRes.status}`);
        const classesJson = await classesRes.json();
        const skillsJson = await skillsRes.json();
        CLASSES_DATA = classesJson.classes || classesJson;
        SKILLS_DATA = skillsJson;
        await loadAndApplySkillTexts();
        fullRegenerate();
        await loadCatalogData();
        bindCatalogEvents();

        document.getElementById("fullRegenBtn").addEventListener("click", fullRegenerate);
        document.getElementById("classRegenBtn").addEventListener("click", regenerateClassOnly);
        const rerollBtn = document.getElementById("rerollStatsBtn");
        if (rerollBtn) rerollBtn.addEventListener("click", rerollStatsAndSaves);
        document.getElementById("randomCreditsBtn").addEventListener("click", randomizeCredits);
        
        const regenClassBtn = document.querySelector("#bio-character-form button[type='submit']:first-of-type");
        const regenAllBtn = document.querySelector("#bio-character-form button[type='submit']:last-of-type");
        if (regenClassBtn) regenClassBtn.addEventListener("click", (e) => { e.preventDefault(); regenerateClassOnly(); });
        if (regenAllBtn) regenAllBtn.addEventListener("click", (e) => { e.preventDefault(); fullRegenerate(); });

        document.getElementById("characterName").addEventListener("dblclick", randomizeIdentity);
        document.getElementById("characterAge").addEventListener("dblclick", () => {
            currentCharacter.age = randomAge();
            document.getElementById("characterAge").value = currentCharacter.age;
        });

        const stressBtn = document.getElementById("stressValueBtn");
        if (stressBtn) {
            stressBtn.addEventListener("click", () => {
                let newStress = currentCharacter.stressCurrent + 1;
                if (newStress > 15) newStress = 15;
                currentCharacter.stressCurrent = newStress;
                document.getElementById("currentStress").innerText = currentCharacter.stressCurrent;
            });
            stressBtn.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                let newStress = currentCharacter.stressCurrent - 1;
                if (newStress < 0) newStress = 0;
                currentCharacter.stressCurrent = newStress;
                document.getElementById("currentStress").innerText = currentCharacter.stressCurrent;
            });
        }

        document.getElementById("healthPoints").addEventListener("dblclick", () => {
            let newHp = prompt("Nuevos puntos de vida:", currentCharacter.currentHealth);
            if (newHp !== null && !isNaN(parseInt(newHp))) {
                currentCharacter.currentHealth = Math.min(Math.max(0, parseInt(newHp)), currentCharacter.healthMax);
                document.getElementById("healthPoints").innerText = currentCharacter.currentHealth;
            }
        });
    } catch (error) {
        console.error("Error cargando archivos:", error);
        document.getElementById("characterClassSpan").innerText = "ERROR";
        document.getElementById("classTraumaResponse").innerHTML = "❌ No se pudieron cargar los datos necesarios.";
    }
}

loadClassesAndInit();
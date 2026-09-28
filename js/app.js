import {
    saveCharacter,
    loadCharacter,
    exportCharacter,
    importCharacter
} from "./storage.js";

import { validateCharacter } from "./validation.js";

const ATTRIBUTE_GROUPS = {
    physical: [
        ["strength", "Força"],
        ["dexterity", "Destreza"],
        ["stamina", "Vigor"]
    ],
    social: [
        ["charisma", "Carisma"],
        ["manipulation", "Manipulação"],
        ["composure", "Autocontrole"]
    ],
    mental: [
        ["intelligence", "Inteligência"],
        ["wits", "Raciocínio"],
        ["resolve", "Determinação"]
    ]
};

const SKILL_LABELS = {
    athletics: "Atletismo",
    awareness: "Percepção",
    craft: "Ofício",
    expression: "Expressão",
    fighting: "Briga",
    investigation: "Investigação",
    knowledge: "Conhecimento",
    medicine: "Medicina",
    persuasion: "Persuasão",
    shooting: "Tiro",
    sabotage: "Sabotagem",
    subterfuge: "Subterfúgio",
    survival: "Sobrevivência"
};

const RESOURCE_PRESETS = [
    ["Riqueza", "Dinheiro disponível / patrimônio"],
    ["Aliado", "Quem é e como ajuda"],
    ["Contatos", "Quem é e que informações consegue"],
    ["Máscara", "Identidade falsa"],
    ["Refúgio", "Onde fica, tamanho, segurança"],
    ["Veículo", "Moto, carro, van etc."],
    ["Repositório", "Arsenal, biblioteca, ferramentas etc."],
    ["Propriedade", "Apartamento, clube, escritório etc."],
    ["Fama", "Em qual meio é conhecido"],
    ["Rebanho", "Mortais disponíveis para alimentação"],
    ["Status", "Grupo onde possui respeito / autoridade"]
];

const HUNGER_EFFECTS = {
    SATISFEITO: "+1 dado para resistir Frenesi/Explosão e +1 dado em testes de Poder das Disciplinas do Clã.",
    SEDENTO: "+1 Quickening ao entrar na faixa e +1 no início de cada cena enquanto permanecer Sedento.",
    FAMINTO: "+2 Quickening ao entrar na faixa e +2 por cena. Teste Autocontrole + Determinação ao perceber sangue ou vítima vulnerável.",
    TORPOR: "Paralisado; sem Disciplinas; perde todo Quickening. Ao ser alimentado: teste Autocontrole + Determinação, Dificuldade 5."
};

const DEFAULT_CHARACTER = {
    version: 2,
    identity: {
        name: "teste",
        clan: "Ministry",
        apparentAge: "32",
        actualAge: "32",
        embraceDate: "xxx",
        nostalgicDecade: "seculo 20",
        generation: 11,
        generationModifier: 1,
        playLevel: "neonate",
        archetype: "",
        sire: "Cruel Sire",
        curse: "Flagrante do Sol"
    },
    attributes: {
        strength: 2, dexterity: 3, stamina: 3,
        charisma: 1, manipulation: 1, composure: 4,
        intelligence: 4, wits: 3, resolve: 3
    },
    skills: {
        athletics: { dots: 2, focus: "throwing" },
        awareness: { dots: 2, focus: "instinct" },
        craft: { dots: 1, focus: "forgery" },
        expression: { dots: 0, focus: "" },
        fighting: { dots: 2, focus: "hand to hand" },
        investigation: { dots: 0, focus: "" },
        knowledge: { dots: 0, focus: "" },
        medicine: { dots: 1, focus: "first aid" },
        persuasion: { dots: 3, focus: "intimidation, negotiating" },
        shooting: { dots: 3, focus: "light firearms, heavy firearms" },
        sabotage: { dots: 1, focus: "burglary" },
        subterfuge: { dots: 2, focus: "skulking" },
        survival: { dots: 1, focus: "tracking" }
    },
    resources: [
        { name: "Contact", dots: 1, details: "" },
        { name: "Mask", dots: 2, details: "" },
        { name: "Repository", dots: 2, details: "" },
        { name: "Contact", dots: 1, details: "" },
        { name: "Ally", dots: 0, details: "" }
    ],
    disciplines: [
        { name: "Corruption", dots: 2, powers: [{name:"Nightmare Glimpses", cost:"", reminder:""}, {name:"Self Doubt", cost:"", reminder:""}] },
        { name: "Obfuscate", dots: 0, powers: [{name:"", cost:"", reminder:""}] },
        { name: "Presence", dots: 1, powers: [{name:"Dread Gaze", cost:"", reminder:""}] }
    ],
    lifepaths: [
        "Criminal — You made your living by breaking the law.",
        "Military — You served your country under its military organizations and were trained in the art of war."
    ],
    clanTraits: [
        "Beguiling Words — You gain a dice bonus equal to your generation modifier to tests to deceive, lie, or deny or obscure the truth.",
        "Divine Image — Once each night, you can use an action to transform into a divine form, channeling the power of your vampire ancestors."
    ],
    merit: "Subdued Hunger — You have some control over your hunger and gain a bonus to resist hunger frenzy.",
    flaw: "",
    nature: "Survivor — You always pull through, surviving whatever the world throws at you.",
    beast: "Enticer — Your Beast rejoices in corrupting others, in making them chase their repressed desires and darkest wishes.",
    items: "foto da esposa, pistola",
    currentVitae: 13,
    currentWillpower: 12,
    quickening: 0,
    nefariousDamage: 0,
    beastPoints: 0,
    naturePoints: 0,
    humanityPosition: 0,
    frenzyTrigger: "",
    outburstTrigger: ""
};

const EMPTY_CHARACTER = {
    version: 2,
    identity: {
        name: "", clan: "", apparentAge: "", actualAge: "", embraceDate: "",
        nostalgicDecade: "", generation: 0, generationModifier: 0,
        playLevel: "", archetype: "", sire: "", curse: ""
    },
    attributes: {
        strength: 0, dexterity: 0, stamina: 0,
        charisma: 0, manipulation: 0, composure: 0,
        intelligence: 0, wits: 0, resolve: 0
    },
    skills: Object.fromEntries(Object.keys(SKILL_LABELS).map((key) => [key, {dots:0, focus:""}])),
    resources: RESOURCE_PRESETS.map(([name, details]) => ({name, dots:0, details})),
    disciplines: [
        {name:"", dots:0, powers:[{name:"", cost:"", reminder:""}]},
        {name:"", dots:0, powers:[{name:"", cost:"", reminder:""}]},
        {name:"", dots:0, powers:[{name:"", cost:"", reminder:""}]}
    ],
    lifepaths:["",""],
    clanTraits:["",""],
    merit:"", flaw:"", nature:"", beast:"", items:"",
    currentVitae:0, currentWillpower:0, quickening:0, nefariousDamage:0,
    beastPoints:0, naturePoints:0, humanityPosition:0,
    frenzyTrigger:"", outburstTrigger:""
};

let character = normalizeCharacter(loadCharacter() || DEFAULT_CHARACTER);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizePower(power) {
    if (typeof power === "string") {
        return {name: power, cost: "", reminder: ""};
    }
    return {
        name: power?.name || "",
        cost: power?.cost || "",
        reminder: power?.reminder || ""
    };
}

function normalizeCharacter(value) {
    const base = clone(DEFAULT_CHARACTER);
    const incoming = value && typeof value === "object" ? value : {};

    base.version = 2;
    base.identity = {...base.identity, ...(incoming.identity || {})};
    base.attributes = {...base.attributes, ...(incoming.attributes || {})};

    for (const key of Object.keys(SKILL_LABELS)) {
        base.skills[key] = {
            ...base.skills[key],
            ...(incoming.skills?.[key] || {})
        };
    }

    if (Array.isArray(incoming.resources)) {
        base.resources = incoming.resources.map((resource) => ({
            name: resource?.name || "",
            dots: Number(resource?.dots || 0),
            details: resource?.details || ""
        }));
    }

    if (Array.isArray(incoming.disciplines)) {
        base.disciplines = incoming.disciplines.map((discipline) => ({
            name: discipline?.name || "",
            dots: Number(discipline?.dots || 0),
            powers: Array.isArray(discipline?.powers)
                ? discipline.powers.map(normalizePower)
                : [{name:"", cost:"", reminder:""}]
        }));
    }

    if (Array.isArray(incoming.lifepaths)) base.lifepaths = incoming.lifepaths.slice(0, 2);
    while (base.lifepaths.length < 2) base.lifepaths.push("");

    if (Array.isArray(incoming.clanTraits)) base.clanTraits = incoming.clanTraits.slice(0, 2);
    while (base.clanTraits.length < 2) base.clanTraits.push("");

    for (const key of [
        "merit","flaw","nature","beast","items",
        "currentVitae","currentWillpower","quickening","nefariousDamage",
        "beastPoints","naturePoints","humanityPosition","frenzyTrigger","outburstTrigger"
    ]) {
        if (incoming[key] !== undefined) base[key] = incoming[key];
    }

    return base;
}

function maxVitae() {
    return 10 + Number(character.attributes.stamina || 0);
}

function effectiveMaxVitae() {
    return Math.max(0, maxVitae() - Number(character.nefariousDamage || 0));
}

function maxWillpower() {
    return 5 + Number(character.attributes.composure || 0) + Number(character.attributes.resolve || 0);
}

function hungerState() {
    const value = Number(character.currentVitae || 0);
    if (value <= 0) return "TORPOR";
    if (value >= 11) return "SATISFEITO";
    if (value >= 6) return "SEDENTO";
    return "FAMINTO";
}

function humanityState() {
    if (character.beastPoints >= 5) return "⚠ TESTE DE FRENESI";
    if (character.naturePoints >= 5) return "⚠ TESTE DE OUTBURST";
    if (character.beastPoints >= 3) return "BESTA AGITADA";
    if (character.naturePoints >= 3) return "NATUREZA AGITADA";
    return "ESTÁVEL";
}

function saveNow(message = "Alteração salva automaticamente.") {
    saveCharacter(character);
    document.getElementById("save-status").textContent = "Salvo automaticamente.";
    document.getElementById("save-detail").textContent = message;
    renderValidation();
}

function bindInput(id, getter, setter, options = {}) {
    const element = document.getElementById(id);
    element.value = getter();

    const eventName = element.tagName === "SELECT" ? "change" : "input";
    element.addEventListener(eventName, () => {
        const value = options.number ? Number(element.value || 0) : element.value;
        setter(value);
        if (options.after) options.after();
        saveNow();
    });
}

function createDots(value, max, onChange, label, className = "dot") {
    const wrapper = document.createElement("div");
    wrapper.className = "dots";
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", label);

    for (let index = 1; index <= max; index += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className + (index <= value ? " filled" : "");
        button.setAttribute("aria-label", label + ": " + index);
        button.addEventListener("click", () => onChange(index === value ? index - 1 : index));
        wrapper.appendChild(button);
    }

    return wrapper;
}

function renderAttributes() {
    const root = document.getElementById("attributes");
    root.replaceChildren();

    for (const [groupKey, attributes] of Object.entries(ATTRIBUTE_GROUPS)) {
        const group = document.createElement("div");
        group.className = "attribute-group";

        const title = document.createElement("h3");
        title.textContent = groupKey === "physical" ? "Físicos" : groupKey === "social" ? "Sociais" : "Mentais";
        group.appendChild(title);

        for (const [key, label] of attributes) {
            const row = document.createElement("div");
            row.className = "dot-row";
            const name = document.createElement("span");
            name.className = "dot-label";
            name.textContent = label;
            row.append(name, createDots(character.attributes[key], 5, (next) => {
                character.attributes[key] = next;
                clampCoreResources();
                renderAttributes();
                renderCoreResources();
                renderCalculator();
                saveNow("Atributo salvo.");
            }, label));
            group.appendChild(row);
        }

        root.appendChild(group);
    }
}

function renderSkills() {
    const root = document.getElementById("skills");
    root.replaceChildren();

    for (const [key, label] of Object.entries(SKILL_LABELS)) {
        const skill = character.skills[key];
        const row = document.createElement("div");
        row.className = "skill-row";

        const name = document.createElement("span");
        name.textContent = label;

        const focus = document.createElement("input");
        focus.type = "text";
        focus.className = "skill-focus";
        focus.placeholder = "Foco(s)";
        focus.value = skill.focus || "";
        focus.addEventListener("input", () => {
            skill.focus = focus.value;
            saveNow("Foco salvo.");
        });

        row.append(name, createDots(skill.dots, 5, (next) => {
            skill.dots = next;
            renderSkills();
            renderCalculator();
            saveNow("Habilidade salva.");
        }, label), focus);

        root.appendChild(row);
    }
}

function renderResources() {
    const root = document.getElementById("resources");
    root.replaceChildren();

    character.resources.forEach((resource, index) => {
        const row = document.createElement("div");
        row.className = "resource-row resource-row-detailed";

        const name = document.createElement("input");
        name.value = resource.name;
        name.placeholder = "Recurso";
        name.addEventListener("input", () => {
            resource.name = name.value;
            saveNow("Recurso salvo.");
        });

        const details = document.createElement("input");
        details.value = resource.details || "";
        details.placeholder = "Detalhes";
        details.addEventListener("input", () => {
            resource.details = details.value;
            saveNow("Detalhes do recurso salvos.");
        });

        const dots = createDots(resource.dots, 5, (next) => {
            resource.dots = next;
            renderResources();
            saveNow("Nível do recurso salvo.");
        }, "Nível de " + (resource.name || "recurso"));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "icon-button no-print";
        remove.textContent = "×";
        remove.title = "Remover recurso";
        remove.addEventListener("click", () => {
            character.resources.splice(index, 1);
            renderResources();
            saveNow("Recurso removido.");
        });

        row.append(name, dots, details, remove);
        root.appendChild(row);
    });
}

function addResource() {
    character.resources.push({name:"", dots:0, details:""});
    renderResources();
    saveNow("Novo recurso criado.");
}

function renderDisciplines() {
    const root = document.getElementById("disciplines");
    root.replaceChildren();

    character.disciplines.forEach((discipline, disciplineIndex) => {
        const card = document.createElement("div");
        card.className = "discipline-card";

        const head = document.createElement("div");
        head.className = "discipline-head";

        const name = document.createElement("input");
        name.value = discipline.name;
        name.placeholder = "Disciplina";
        name.addEventListener("input", () => {
            discipline.name = name.value;
            saveNow("Disciplina salva.");
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "icon-button no-print";
        remove.textContent = "×";
        remove.title = "Remover disciplina";
        remove.addEventListener("click", () => {
            character.disciplines.splice(disciplineIndex, 1);
            renderDisciplines();
            saveNow("Disciplina removida.");
        });

        const dots = createDots(discipline.dots, 5, (next) => {
            discipline.dots = next;
            renderDisciplines();
            saveNow("Nível da disciplina salvo.");
        }, discipline.name || "Disciplina");

        head.append(name, dots, remove);
        card.appendChild(head);

        const powers = document.createElement("div");
        powers.className = "power-list";

        discipline.powers.forEach((power, powerIndex) => {
            const row = document.createElement("div");
            row.className = "power-row";

            const powerName = document.createElement("input");
            powerName.value = power.name;
            powerName.placeholder = "Poder";
            powerName.addEventListener("input", () => {
                power.name = powerName.value;
                saveNow("Poder salvo.");
            });

            const cost = document.createElement("input");
            cost.value = power.cost;
            cost.placeholder = "Custo";
            cost.addEventListener("input", () => {
                power.cost = cost.value;
                saveNow("Custo salvo.");
            });

            const reminder = document.createElement("input");
            reminder.value = power.reminder;
            reminder.placeholder = "Lembrete";
            reminder.addEventListener("input", () => {
                power.reminder = reminder.value;
                saveNow("Lembrete salvo.");
            });

            const removePower = document.createElement("button");
            removePower.type = "button";
            removePower.className = "icon-button no-print";
            removePower.textContent = "×";
            removePower.title = "Remover poder";
            removePower.addEventListener("click", () => {
                discipline.powers.splice(powerIndex, 1);
                renderDisciplines();
                saveNow("Poder removido.");
            });

            row.append(powerName, cost, reminder, removePower);
            powers.appendChild(row);
        });

        const addPower = document.createElement("button");
        addPower.type = "button";
        addPower.className = "small-button no-print";
        addPower.textContent = "+ Poder";
        addPower.addEventListener("click", () => {
            discipline.powers.push({name:"", cost:"", reminder:""});
            renderDisciplines();
            saveNow("Novo poder criado.");
        });

        card.append(powers, addPower);
        root.appendChild(card);
    });
}

function addDiscipline() {
    character.disciplines.push({name:"", dots:0, powers:[{name:"",cost:"",reminder:""}]});
    renderDisciplines();
    saveNow("Nova disciplina criada.");
}

function renderLifepaths() {
    const root = document.getElementById("lifepaths");
    root.replaceChildren();

    while (character.lifepaths.length < 2) character.lifepaths.push("");

    character.lifepaths.slice(0,2).forEach((value, index) => {
        const label = document.createElement("label");
        const span = document.createElement("span");
        span.textContent = "Caminho de Vida " + (index + 1);
        const textarea = document.createElement("textarea");
        textarea.rows = 5;
        textarea.value = value;
        textarea.addEventListener("input", () => {
            character.lifepaths[index] = textarea.value;
            saveNow("Caminho de Vida salvo.");
        });
        label.append(span, textarea);
        root.appendChild(label);
    });
}

function clampCoreResources() {
    character.currentVitae = Math.max(0, Math.min(Number(character.currentVitae || 0), effectiveMaxVitae()));
    character.currentWillpower = Math.max(0, Math.min(Number(character.currentWillpower || 0), maxWillpower()));
    character.quickening = Math.max(0, Number(character.quickening || 0));
    character.nefariousDamage = Math.max(0, Number(character.nefariousDamage || 0));
}

function renderCoreResources() {
    clampCoreResources();

    const vitaeMax = maxVitae();
    const effective = effectiveMaxVitae();
    const wpMax = maxWillpower();
    const state = hungerState();

    document.getElementById("vitae-label").textContent = character.currentVitae + " / " + vitaeMax;
    document.getElementById("willpower-label").textContent = character.currentWillpower + " / " + wpMax;
    document.getElementById("effective-vitae").textContent = effective;
    document.getElementById("hunger-state").textContent = state;
    document.getElementById("hunger-effect").textContent = HUNGER_EFFECTS[state];
    document.getElementById("quickening-label").textContent = String(character.quickening);
    document.getElementById("quickening").value = character.quickening;
    document.getElementById("nefarious-damage").value = character.nefariousDamage;

    const vitaeRoot = document.getElementById("vitae-tracker");
    vitaeRoot.replaceChildren(createDots(character.currentVitae, vitaeMax, (next) => {
        character.currentVitae = Math.min(next, effectiveMaxVitae());
        renderCoreResources();
        saveNow("Vitae salvo.");
    }, "Vitae", "tracker-dot"));

    const wpRoot = document.getElementById("willpower-tracker");
    wpRoot.replaceChildren(createDots(character.currentWillpower, wpMax, (next) => {
        character.currentWillpower = next;
        renderCoreResources();
        saveNow("Força de Vontade salva.");
    }, "Força de Vontade", "tracker-dot"));
}

function renderHumanity() {
    document.getElementById("beast-points-label").textContent = character.beastPoints + " / 5";
    document.getElementById("nature-points-label").textContent = character.naturePoints + " / 5";
    document.getElementById("humanity-state").textContent = humanityState();

    const beastRoot = document.getElementById("beast-points");
    beastRoot.replaceChildren(createDots(character.beastPoints, 5, (next) => {
        character.beastPoints = next;
        character.humanityPosition = Math.max(-3, Math.min(3, character.naturePoints - character.beastPoints));
        renderHumanity();
        saveNow("Pontos de Besta salvos.");
    }, "Pontos de Besta", "tracker-dot"));

    const natureRoot = document.getElementById("nature-points");
    natureRoot.replaceChildren(createDots(character.naturePoints, 5, (next) => {
        character.naturePoints = next;
        character.humanityPosition = Math.max(-3, Math.min(3, character.naturePoints - character.beastPoints));
        renderHumanity();
        saveNow("Pontos de Natureza salvos.");
    }, "Pontos de Natureza", "tracker-dot"));

    const scale = document.getElementById("humanity-scale");
    scale.replaceChildren();

    for (let pos=-3; pos<=3; pos+=1) {
        const button=document.createElement("button");
        button.type="button";
        button.className="humanity-dot" + (pos===Number(character.humanityPosition) ? " active" : "");
        button.title = pos < 0 ? "Mais próximo da Besta" : pos > 0 ? "Mais próximo da Natureza" : "Neutro";
        button.addEventListener("click", () => {
            character.humanityPosition = pos;
            renderHumanity();
            saveNow("Escala de Humanidade salva.");
        });
        scale.appendChild(button);
    }
}

function renderCalculator() {
    const attributeSelect = document.getElementById("calculator-attribute");
    const skillSelect = document.getElementById("calculator-skill");

    if (!attributeSelect.dataset.ready) {
        attributeSelect.innerHTML = '<option value="">—</option>';
        for (const attributes of Object.values(ATTRIBUTE_GROUPS)) {
            for (const [key,label] of attributes) {
                const option=document.createElement("option");
                option.value=key; option.textContent=label;
                attributeSelect.appendChild(option);
            }
        }

        skillSelect.innerHTML = '<option value="">—</option>';
        for (const [key,label] of Object.entries(SKILL_LABELS)) {
            const option=document.createElement("option");
            option.value=key; option.textContent=label;
            skillSelect.appendChild(option);
        }

        attributeSelect.dataset.ready="1";
        skillSelect.dataset.ready="1";
    }

    const attrKey=attributeSelect.value;
    const skillKey=skillSelect.value;
    const difficulty=Math.max(0, Number(document.getElementById("calculator-difficulty").value || 0));
    const attr=attrKey ? Number(character.attributes[attrKey] || 0) : 0;
    const skill=skillKey ? Number(character.skills[skillKey]?.dots || 0) : 0;
    const result=Math.max(0, attr + skill - difficulty);

    document.getElementById("calculator-result").textContent = result + (result===1 ? " dado" : " dados");
    document.getElementById("calculator-breakdown").textContent = attr + " + " + skill + " − " + difficulty;
}

function renderValidation() {
    const warnings = validateCharacter(character);
    const summary = document.getElementById("validation-summary");
    const root = document.getElementById("validation-list");
    root.replaceChildren();

    if (!warnings.length) {
        summary.innerHTML='<span class="validation-ok">Sem avisos de criação.</span>';
        const p=document.createElement("p");
        p.className="validation-ok";
        p.textContent="A validação automática não encontrou pendências nas regras atualmente verificadas.";
        root.appendChild(p);
        return;
    }

    summary.innerHTML='<span class="validation-count">' + warnings.length + ' aviso(s)</span>';
    const ul=document.createElement("ul");
    ul.className="validation-list";
    for (const warning of warnings) {
        const li=document.createElement("li");
        li.className="validation-warning";
        li.textContent=warning;
        ul.appendChild(li);
    }
    root.appendChild(ul);
}

function bindStaticFields() {
    const identityBindings = [
        ["character-name","name"],["clan","clan"],["age-apparent","apparentAge"],["age-actual","actualAge"],
        ["embrace-date","embraceDate"],["nostalgic-decade","nostalgicDecade"],["generation","generation"],
        ["generation-modifier","generationModifier"],["play-level","playLevel"],["archetype","archetype"],
        ["sire","sire"],["curse","curse"]
    ];

    for (const [id,key] of identityBindings) {
        bindInput(id, () => character.identity[key], (value) => { character.identity[key]=value; }, {
            number:["generation","generationModifier"].includes(key)
        });
    }

    bindInput("clan-trait-1",()=>character.clanTraits[0] || "",(v)=>character.clanTraits[0]=v);
    bindInput("clan-trait-2",()=>character.clanTraits[1] || "",(v)=>character.clanTraits[1]=v);
    bindInput("merit",()=>character.merit,(v)=>character.merit=v);
    bindInput("flaw",()=>character.flaw,(v)=>character.flaw=v);
    bindInput("nature",()=>character.nature,(v)=>character.nature=v);
    bindInput("beast",()=>character.beast,(v)=>character.beast=v);
    bindInput("items",()=>character.items,(v)=>character.items=v);
    bindInput("frenzy-trigger",()=>character.frenzyTrigger,(v)=>character.frenzyTrigger=v);
    bindInput("outburst-trigger",()=>character.outburstTrigger,(v)=>character.outburstTrigger=v);

    bindInput("quickening",()=>character.quickening,(v)=>character.quickening=Math.max(0,v),{
        number:true, after:renderCoreResources
    });

    bindInput("nefarious-damage",()=>character.nefariousDamage,(v)=>{
        character.nefariousDamage=Math.max(0,v);
        clampCoreResources();
    },{number:true, after:renderCoreResources});
}

function installActions() {
    document.getElementById("add-resource").addEventListener("click", addResource);
    document.getElementById("add-discipline").addEventListener("click", addDiscipline);

    document.getElementById("quickening-minus").addEventListener("click", () => {
        character.quickening=Math.max(0, Number(character.quickening || 0)-1);
        renderCoreResources(); saveNow("Quickening salvo.");
    });
    document.getElementById("quickening-plus").addEventListener("click", () => {
        character.quickening=Number(character.quickening || 0)+1;
        renderCoreResources(); saveNow("Quickening salvo.");
    });

    for (const id of ["calculator-attribute","calculator-skill","calculator-difficulty"]) {
        document.getElementById(id).addEventListener("input", renderCalculator);
        document.getElementById(id).addEventListener("change", renderCalculator);
    }

    document.getElementById("export-button").addEventListener("click",()=>exportCharacter(character));
    document.getElementById("print-button").addEventListener("click",()=>window.print());

    document.getElementById("import-file").addEventListener("change", async (event) => {
        const file=event.target.files?.[0];
        if (!file) return;
        try {
            character=normalizeCharacter(await importCharacter(file));
            saveCharacter(character);
            location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            event.target.value="";
        }
    });

    document.getElementById("reset-button").addEventListener("click",()=>{
        if (!confirm("Limpar toda a ficha e começar um personagem novo? A ficha atual será substituída no salvamento local.")) return;
        saveCharacter(clone(EMPTY_CHARACTER));
        location.reload();
    });
}

bindStaticFields();
renderAttributes();
renderSkills();
renderResources();
renderDisciplines();
renderLifepaths();
renderCoreResources();
renderHumanity();
renderCalculator();
renderValidation();
installActions();

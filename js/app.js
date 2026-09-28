import {
    saveCharacter,
    loadCharacter,
    exportCharacter,
    importCharacter
} from "./storage.js";

import { validateCharacter } from "./validation.js";

const ATTRIBUTE_GROUPS = {
    physical: [
        ["strength", "Strength"],
        ["dexterity", "Dexterity"],
        ["stamina", "Stamina"]
    ],
    social: [
        ["charisma", "Charisma"],
        ["manipulation", "Manipulation"],
        ["composure", "Composure"]
    ],
    mental: [
        ["intelligence", "Intelligence"],
        ["wits", "Wits"],
        ["resolve", "Resolve"]
    ]
};

const SKILL_LABELS = {
    athletics: "Athletics",
    awareness: "Awareness",
    craft: "Craft",
    expression: "Expression",
    fighting: "Fighting",
    investigation: "Investigation",
    knowledge: "Knowledge",
    medicine: "Medicine",
    persuasion: "Persuasion",
    shooting: "Shooting",
    sabotage: "Sabotage",
    subterfuge: "Subterfuge",
    survival: "Survival"
};

const DEFAULT_CHARACTER = {
    version: 1,
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
        strength: 2,
        dexterity: 3,
        stamina: 3,
        charisma: 1,
        manipulation: 1,
        composure: 4,
        intelligence: 4,
        wits: 3,
        resolve: 3
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
        { name: "Contact", dots: 1 },
        { name: "Mask", dots: 2 },
        { name: "Repository", dots: 2 },
        { name: "Contact", dots: 1 },
        { name: "Ally", dots: 0 }
    ],
    disciplines: [
        {
            name: "Corruption",
            dots: 2,
            powers: ["Nightmare Glimpses", "Self Doubt"]
        },
        {
            name: "Obfuscate",
            dots: 0,
            powers: [""]
        },
        {
            name: "Presence",
            dots: 1,
            powers: ["Dread Gaze"]
        }
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
    humanityScale: "neutral",
    items: "foto da esposa, pistola",
    currentVitae: 13,
    currentWillpower: 12
};


const EMPTY_CHARACTER = {
    version: 1,
    identity: {
        name: "",
        clan: "",
        apparentAge: "",
        actualAge: "",
        embraceDate: "",
        nostalgicDecade: "",
        generation: 0,
        generationModifier: 0,
        playLevel: "",
        archetype: "",
        sire: "",
        curse: ""
    },
    attributes: {
        strength: 0,
        dexterity: 0,
        stamina: 0,
        charisma: 0,
        manipulation: 0,
        composure: 0,
        intelligence: 0,
        wits: 0,
        resolve: 0
    },
    skills: {
        athletics: { dots: 0, focus: "" },
        awareness: { dots: 0, focus: "" },
        craft: { dots: 0, focus: "" },
        expression: { dots: 0, focus: "" },
        fighting: { dots: 0, focus: "" },
        investigation: { dots: 0, focus: "" },
        knowledge: { dots: 0, focus: "" },
        medicine: { dots: 0, focus: "" },
        persuasion: { dots: 0, focus: "" },
        shooting: { dots: 0, focus: "" },
        sabotage: { dots: 0, focus: "" },
        subterfuge: { dots: 0, focus: "" },
        survival: { dots: 0, focus: "" }
    },
    resources: [
        { name: "", dots: 0 },
        { name: "", dots: 0 },
        { name: "", dots: 0 },
        { name: "", dots: 0 },
        { name: "", dots: 0 }
    ],
    disciplines: [
        { name: "", dots: 0, powers: [""] },
        { name: "", dots: 0, powers: [""] },
        { name: "", dots: 0, powers: [""] }
    ],
    lifepaths: ["", ""],
    clanTraits: ["", ""],
    merit: "",
    flaw: "",
    nature: "",
    beast: "",
    humanityScale: "",
    items: "",
    currentVitae: 0,
    currentWillpower: 0
};

let character = normalizeCharacter(loadCharacter() || DEFAULT_CHARACTER);

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeCharacter(value) {
    const base = clone(DEFAULT_CHARACTER);
    const incoming = value && typeof value === "object" ? value : {};

    base.version = Number(incoming.version || base.version);
    base.identity = { ...base.identity, ...(incoming.identity || {}) };
    base.attributes = { ...base.attributes, ...(incoming.attributes || {}) };
    base.skills = { ...base.skills, ...(incoming.skills || {}) };

    if (Array.isArray(incoming.resources)) {
        base.resources = incoming.resources;
    }

    if (Array.isArray(incoming.disciplines)) {
        base.disciplines = incoming.disciplines;
    }

    if (Array.isArray(incoming.lifepaths)) {
        base.lifepaths = incoming.lifepaths;
    }

    if (Array.isArray(incoming.clanTraits)) {
        base.clanTraits = incoming.clanTraits;
    }

    ["merit", "flaw", "nature", "beast", "humanityScale", "items", "currentVitae", "currentWillpower"].forEach((key) => {
        if (incoming[key] !== undefined) {
            base[key] = incoming[key];
        }
    });

    return base;
}

function maxVitae() {
    return 10 + Number(character.attributes.stamina || 0);
}

function maxWillpower() {
    return 5
        + Number(character.attributes.composure || 0)
        + Number(character.attributes.resolve || 0);
}

function clampTrackers() {
    character.currentVitae = Math.max(0, Math.min(Number(character.currentVitae || 0), maxVitae()));
    character.currentWillpower = Math.max(0, Math.min(Number(character.currentWillpower || 0), maxWillpower()));
}

function setDirty(message) {
    saveCharacter(character);
    document.getElementById("save-status").textContent = "Salvo automaticamente.";
    document.getElementById("save-detail").textContent =
        message || "A alteração foi armazenada neste navegador.";
    renderValidation();
}

function bindInput(id, getter, setter, options = {}) {
    const element = document.getElementById(id);
    element.value = getter();

    element.addEventListener("input", () => {
        const value = options.number ? Number(element.value) : element.value;
        setter(value);

        if (options.recalculate) {
            clampTrackers();
            renderTrackers();
        }

        setDirty();
    });
}

function createDots(value, max, onChange, label) {
    const wrapper = document.createElement("div");
    wrapper.className = "dots";
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", label);

    for (let index = 1; index <= max; index += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dot" + (index <= value ? " filled" : "");
        button.setAttribute("aria-label", label + ": " + index + " pontos");
        button.title = index + " pontos";

        button.addEventListener("click", () => {
            onChange(index === value ? index - 1 : index);
        });

        wrapper.appendChild(button);
    }

    return wrapper;
}

function renderAttributes() {
    const root = document.getElementById("attributes");
    root.replaceChildren();

    const titles = {
        physical: "Physical",
        social: "Social",
        mental: "Mental"
    };

    Object.entries(ATTRIBUTE_GROUPS).forEach(([groupKey, attributes]) => {
        const group = document.createElement("div");
        group.className = "attribute-group";

        const heading = document.createElement("h3");
        heading.textContent = titles[groupKey];
        group.appendChild(heading);

        attributes.forEach(([key, label]) => {
            const row = document.createElement("div");
            row.className = "dot-row";

            const name = document.createElement("span");
            name.className = "dot-label";
            name.textContent = label;

            row.appendChild(name);
            row.appendChild(
                createDots(character.attributes[key], 5, (nextValue) => {
                    character.attributes[key] = nextValue;
                    clampTrackers();
                    renderAttributes();
                    renderTrackers();
                    setDirty("Atributo atualizado.");
                }, label)
            );

            group.appendChild(row);
        });

        root.appendChild(group);
    });
}

function renderSkills() {
    const root = document.getElementById("skills");
    root.replaceChildren();

    Object.entries(SKILL_LABELS).forEach(([key, label]) => {
        const skill = character.skills[key];

        const row = document.createElement("div");
        row.className = "skill-row";

        const name = document.createElement("span");
        name.textContent = label;

        const dots = createDots(skill.dots, 5, (nextValue) => {
            skill.dots = nextValue;
            renderSkills();
            setDirty("Habilidade atualizada.");
        }, label);

        const focus = document.createElement("input");
        focus.className = "skill-focus";
        focus.type = "text";
        focus.value = skill.focus;
        focus.placeholder = "Foco(s)";
        focus.setAttribute("aria-label", "Focos de " + label);
        focus.addEventListener("input", () => {
            skill.focus = focus.value;
            setDirty("Foco atualizado.");
        });

        row.append(name, dots, focus);
        root.appendChild(row);
    });
}

function renderResources() {
    const root = document.getElementById("resources");
    root.replaceChildren();

    character.resources.forEach((resource, index) => {
        const row = document.createElement("div");
        row.className = "resource-row";

        const name = document.createElement("input");
        name.type = "text";
        name.value = resource.name;
        name.setAttribute("aria-label", "Nome do Recurso " + (index + 1));
        name.addEventListener("input", () => {
            resource.name = name.value;
            setDirty("Recurso atualizado.");
        });

        const dots = createDots(resource.dots, 5, (nextValue) => {
            resource.dots = nextValue;
            renderResources();
            setDirty("Pontos de Recurso atualizados.");
        }, "Recurso " + (index + 1));

        row.append(name, dots);
        root.appendChild(row);
    });
}

function renderDisciplines() {
    const root = document.getElementById("disciplines");
    root.replaceChildren();

    character.disciplines.forEach((discipline, index) => {
        const card = document.createElement("div");
        card.className = "discipline-card";

        const head = document.createElement("div");
        head.className = "discipline-head";

        const name = document.createElement("input");
        name.type = "text";
        name.value = discipline.name;
        name.setAttribute("aria-label", "Disciplina " + (index + 1));
        name.addEventListener("input", () => {
            discipline.name = name.value;
            setDirty("Disciplina atualizada.");
        });

        const dots = createDots(discipline.dots, 5, (nextValue) => {
            discipline.dots = nextValue;
            renderDisciplines();
            setDirty("Pontos de Disciplina atualizados.");
        }, discipline.name || "Disciplina");

        head.append(name, dots);

        const powersLabel = document.createElement("label");
        const labelText = document.createElement("span");
        labelText.textContent = "Poderes — um por linha";

        const powers = document.createElement("textarea");
        powers.rows = 3;
        powers.value = discipline.powers.join("\n");
        powers.addEventListener("input", () => {
            discipline.powers = powers.value.split("\n");
            setDirty("Poderes atualizados.");
        });

        powersLabel.append(labelText, powers);
        card.append(head, powersLabel);
        root.appendChild(card);
    });
}

function renderLifepaths() {
    const root = document.getElementById("lifepaths");
    root.replaceChildren();

    while (character.lifepaths.length < 2) {
        character.lifepaths.push("");
    }

    character.lifepaths.slice(0, 2).forEach((lifepath, index) => {
        const label = document.createElement("label");
        const span = document.createElement("span");
        span.textContent = "Caminho de Vida " + (index + 1);

        const textarea = document.createElement("textarea");
        textarea.rows = 3;
        textarea.value = lifepath;
        textarea.addEventListener("input", () => {
            character.lifepaths[index] = textarea.value;
            setDirty("Caminho de Vida atualizado.");
        });

        label.append(span, textarea);
        root.appendChild(label);
    });
}

function createTracker(rootId, current, maximum, setter, label) {
    const root = document.getElementById(rootId);
    root.replaceChildren();

    for (let index = 1; index <= maximum; index += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tracker-dot" + (index <= current ? " filled" : "");
        button.title = index + " / " + maximum;
        button.setAttribute("aria-label", label + " " + index + " de " + maximum);

        button.addEventListener("click", () => {
            setter(index === current ? index - 1 : index);
            renderTrackers();
            setDirty(label + " atualizado.");
        });

        root.appendChild(button);
    }
}

function renderTrackers() {
    clampTrackers();

    const vitaeMax = maxVitae();
    const willpowerMax = maxWillpower();

    document.getElementById("vitae-label").textContent =
        character.currentVitae + " / " + vitaeMax;

    document.getElementById("willpower-label").textContent =
        character.currentWillpower + " / " + willpowerMax;

    createTracker(
        "vitae-tracker",
        character.currentVitae,
        vitaeMax,
        (value) => { character.currentVitae = value; },
        "Vitae"
    );

    createTracker(
        "willpower-tracker",
        character.currentWillpower,
        willpowerMax,
        (value) => { character.currentWillpower = value; },
        "Força de Vontade"
    );
}

function renderValidation() {
    const warnings = validateCharacter(character);
    const summary = document.getElementById("validation-summary");
    const root = document.getElementById("validation-list");

    root.replaceChildren();

    if (warnings.length === 0) {
        summary.innerHTML = '<span class="validation-ok">Sem avisos de criação.</span>';
        const ok = document.createElement("p");
        ok.className = "validation-ok";
        ok.textContent = "A validação automática não encontrou pendências nas regras que esta versão verifica.";
        root.appendChild(ok);
        return;
    }

    summary.innerHTML =
        '<span class="validation-count">' + warnings.length + ' aviso(s)</span>';

    const list = document.createElement("ul");
    list.className = "validation-list";

    warnings.forEach((warning) => {
        const item = document.createElement("li");
        item.className = "validation-warning";
        item.textContent = warning;
        list.appendChild(item);
    });

    root.appendChild(list);
}

function bindStaticFields() {
    bindInput("character-name", () => character.identity.name, (value) => {
        character.identity.name = value;
    });

    bindInput("clan", () => character.identity.clan, (value) => {
        character.identity.clan = value;
    });

    bindInput("age-apparent", () => character.identity.apparentAge, (value) => {
        character.identity.apparentAge = value;
    });

    bindInput("age-actual", () => character.identity.actualAge, (value) => {
        character.identity.actualAge = value;
    });

    bindInput("embrace-date", () => character.identity.embraceDate, (value) => {
        character.identity.embraceDate = value;
    });

    bindInput("nostalgic-decade", () => character.identity.nostalgicDecade, (value) => {
        character.identity.nostalgicDecade = value;
    });

    bindInput("generation", () => character.identity.generation, (value) => {
        character.identity.generation = value;
    }, { number: true });

    bindInput("generation-modifier", () => character.identity.generationModifier, (value) => {
        character.identity.generationModifier = value;
    }, { number: true });

    bindInput("play-level", () => character.identity.playLevel, (value) => {
        character.identity.playLevel = value;
    });

    bindInput("archetype", () => character.identity.archetype, (value) => {
        character.identity.archetype = value;
    });

    bindInput("sire", () => character.identity.sire, (value) => {
        character.identity.sire = value;
    });

    bindInput("curse", () => character.identity.curse, (value) => {
        character.identity.curse = value;
    });

    bindInput("humanity-scale", () => character.humanityScale, (value) => {
        character.humanityScale = value;
    });

    bindInput("clan-trait-1", () => character.clanTraits[0] || "", (value) => {
        character.clanTraits[0] = value;
    });

    bindInput("clan-trait-2", () => character.clanTraits[1] || "", (value) => {
        character.clanTraits[1] = value;
    });

    bindInput("merit", () => character.merit, (value) => {
        character.merit = value;
    });

    bindInput("flaw", () => character.flaw, (value) => {
        character.flaw = value;
    });

    bindInput("nature", () => character.nature, (value) => {
        character.nature = value;
    });

    bindInput("beast", () => character.beast, (value) => {
        character.beast = value;
    });

    bindInput("items", () => character.items, (value) => {
        character.items = value;
    });
}

function refreshAll() {
    renderAttributes();
    renderSkills();
    renderResources();
    renderDisciplines();
    renderLifepaths();
    renderTrackers();
    renderValidation();
}

function installActions() {
    document.getElementById("export-button").addEventListener("click", () => {
        exportCharacter(character);
    });

    document.getElementById("print-button").addEventListener("click", () => {
        window.print();
    });

    document.getElementById("import-file").addEventListener("change", async (event) => {
        const file = event.target.files && event.target.files[0];

        if (!file) {
            return;
        }

        try {
            character = normalizeCharacter(await importCharacter(file));
            saveCharacter(character);
            location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            event.target.value = "";
        }
    });

    document.getElementById("reset-button").addEventListener("click", () => {
        const confirmed = confirm(
            "Limpar toda a ficha e começar um personagem novo? Os dados salvos neste navegador serão substituídos por uma ficha vazia."
        );

        if (!confirmed) {
            return;
        }

        saveCharacter(clone(EMPTY_CHARACTER));
        location.reload();
    });

}

bindStaticFields();
refreshAll();
installActions();

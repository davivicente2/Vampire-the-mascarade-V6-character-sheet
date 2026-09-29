import { ensureCreationSlots } from "./model/creation.js";
import { saveCharacter } from "./storage.js";
import { bindInput as bindControl } from "./ui/controls.js";
import { installFileActions } from "./ui/file-actions.js";
import { installTooltips } from "./ui/tooltips.js";
import { renderRulesReference } from "./ui/sections/reference.js";
import { createAttributes } from "./ui/sections/attributes.js";
import { createSkills } from "./ui/sections/skills.js";
import { createResources } from "./ui/sections/resources.js";
import { createDisciplines } from "./ui/sections/disciplines.js";
import { createLifepaths } from "./ui/sections/lifepaths.js";
import { createIdentity } from "./ui/sections/identity.js";
import { createHumanity } from "./ui/sections/humanity.js";
import { createCoreResources } from "./ui/sections/core-resources.js";
import { createCalculator } from "./ui/sections/calculator.js";
import { createValidation } from "./ui/sections/validation.js";
import { createMerit } from "./ui/sections/merit.js";
import { createClanIcon } from "./ui/clan-icon.js";
import { installNotes } from "./ui/notes.js";
import { createAdvancement } from "./ui/sections/advancement.js";

// Builds each section once; rerenders replace controls without reinstalling static listeners.
export function mountSheet(character) {
    const { renderValidation } = createValidation({character});
    const { renderCalculator } = createCalculator({character});
    const { renderResources, addResource } = createResources({character, saveNow});
    const { renderDisciplines, addDiscipline } = createDisciplines({character, saveNow, refreshEligibility});
    const { renderClanIcon } = createClanIcon({character, saveNow});
    const { renderLifepaths, refreshLifepathSkills } = createLifepaths({character, saveNow,
        onSkillsChange: () => { renderSkills(); renderCalculator(); }});
    const humanity = createHumanity({character, saveNow, renderCoreResources: () => renderCoreResources()});
    const { renderHumanity, renderBeastIdentity, installNatureSelection, renderHumanityDetails, installHumanityActions } = humanity;
    const { renderCoreResources, installCoreResourceActions } = createCoreResources({character, saveNow, renderHumanity});
    const { renderAttributes } = createAttributes({character, saveNow, renderCoreResources, renderCalculator, refreshEligibility});
    const { renderSkills } = createSkills({character, saveNow, renderCalculator, onSkillsChange: refreshLifepathSkills});
    const { renderClanTraits, renderIdentityAutomation, installIdentityAutomation } = createIdentity({character, saveNow, renderBeastIdentity, renderDisciplines, renderCoreResources, refreshEligibility, renderClanIcon});
    const { renderMerits, installMeritActions } = createMerit({character, saveNow});
    const { renderAdvancement } = createAdvancement({character, saveNow});
    const bindInput = (id, getter, setter, options) => bindControl(id, getter, setter, {...options, save: saveNow});

    function refreshEligibility() {
        renderMerits();
        renderClanTraits();
    }

    function renderSessionSummary() {
        document.body.dataset.sheetMode = character.mode || "creation";
        const name = character.identity.name?.trim() || "Personagem sem nome";
        const clan = character.identity.clan?.trim() || "Sem clã";
        const generation = Number(character.identity.generation || 0);
        document.getElementById("session-character-name").textContent = name;
        document.getElementById("session-character-meta").textContent =
            clan + " · " + (generation ? generation + "ª geração" : "geração —");
        document.getElementById("session-vitae").textContent =
            document.getElementById("vitae-label").textContent || "0 / 0";
        document.getElementById("session-willpower").textContent =
            document.getElementById("willpower-label").textContent || "0 / 0";
        document.getElementById("session-quickening").textContent =
            document.getElementById("quickening-label").textContent || "0 / 5";
        document.getElementById("session-xp").textContent = character.experience.available + " XP";
        document.getElementById("session-humanity").textContent =
            document.getElementById("humanity-stage").textContent || "Neutro";
    }

    function renderModeAndTier() {
        ensureCreationSlots(character);
        renderAttributes(); renderSkills(); renderResources(); renderDisciplines();
        refreshEligibility(); renderHumanityDetails(); renderLifepaths(); renderValidation();
        document.getElementById("skills-creation-help").textContent = character.mode === "creation"
            ? "Na criação, máximo de 3 pontos por Habilidade. Focos em 1 e 3; o terceiro foco fica disponível em 5 pontos durante o jogo."
            : "Em jogo, Habilidades podem chegar a 5. Focos em 1, 3 e 5 pontos; um foco relevante concede +1 dado ao teste.";
        renderSessionSummary();
    }

    function saveNow(message = "Alteração salva automaticamente.") {
        try {
            saveCharacter(character);
        } catch (error) {
            document.getElementById("save-status").textContent = "Alterações não salvas.";
            document.getElementById("save-detail").textContent = error.message;
            renderValidation();
            return;
        }
        document.getElementById("save-status").textContent = "Salvo automaticamente.";
        document.getElementById("save-detail").textContent = message;
        renderValidation();
        renderSessionSummary();
    }

    function bindStaticFields() {
        bindInput("sheet-mode", () => character.mode, (value) => { character.mode = value; }, {after: renderModeAndTier});
        const identityBindings = [
            ["character-name","name"],["age-apparent","apparentAge"],["age-actual","actualAge"],
            ["embrace-date","embraceDate"],["nostalgic-decade","nostalgicDecade"],["generation","generation"],
            ["generation-modifier","generationModifier"],["play-level","playLevel"],["archetype","archetype"]
        ];

        for (const [id,key] of identityBindings) {
            bindInput(id, () => character.identity[key], (value) => { character.identity[key]=value; }, {
                number:["generation","generationModifier"].includes(key),
                after:key === "playLevel" ? renderModeAndTier
                    : key === "generationModifier" ? () => { renderCoreResources(); refreshEligibility(); } : undefined
            });
        }

        bindInput("flaw",()=>character.flaw,(v)=>character.flaw=v);
        bindInput("beast",()=>character.beast,(v)=>character.beast=v);
        bindInput("items",()=>character.items,(v)=>character.items=v);
        bindInput("frenzy-trigger",()=>character.frenzyTrigger,(v)=>character.frenzyTrigger=v);
        bindInput("outburst-trigger",()=>character.outburstTrigger,(v)=>character.outburstTrigger=v);
    }

    function installActions() {
        document.getElementById("add-resource").addEventListener("click", addResource);
        document.getElementById("add-discipline").addEventListener("click", addDiscipline);

        for (const id of ["calculator-attribute","calculator-skill","calculator-difficulty"]) {
            document.getElementById(id).addEventListener("input", renderCalculator);
            document.getElementById(id).addEventListener("change", renderCalculator);
        }

        installCoreResourceActions();
        installMeritActions();
        installFileActions(character);
    }

    bindStaticFields();
    renderMerits();
    installNatureSelection();
    renderIdentityAutomation();
    installIdentityAutomation();
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
    installHumanityActions();
    renderRulesReference();
    installNotes({character, saveNow});
    renderAdvancement();
    renderModeAndTier();
    installTooltips();
    document.getElementById("beast-rules-link").addEventListener("click", () => {
        const panel = document.getElementById("beast-rules");
        panel.open = true;
        panel.querySelector("summary").focus();
    });
}

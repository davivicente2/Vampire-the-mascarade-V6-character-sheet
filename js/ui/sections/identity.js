import { populateEligibleSelect } from "../eligible-select.js";
import { sireDisciplines } from "../../model/selection-limits.js";
import { visibleSlotCount } from "../../model/creation.js";
import { createChoiceField } from "../choice-field.js";
import { HELP } from "../help-text.js";
import { creationFor } from "../../../data/tiers.js";
import { clans, getClanByName } from "../../../data/clans.js";
import { sires, getSireByName } from "../../../data/sires.js";
import { normalizeTraitSelection, syncDisciplinesToIdentity } from "../../model/identity.js";
import { populateSelect } from "../controls.js";
import { rulePreview } from "../disclosure.js";

export function createIdentity({ character, saveNow, renderBeastIdentity, renderDisciplines, renderCoreResources, refreshEligibility, renderClanIcon }) {
    function currentClan() {
        return getClanByName(character.identity.clan);
    }

    function currentSire() {
        return getSireByName(character.identity.sire);
    }

    function renderClanTraits() {
        const clan = currentClan();
        const normal = creationFor(character.identity.playLevel).clanTraits;

        for (const [list, rootId] of [["clanTraits", "clan-traits"], ["advancementClanTraits", "advancement-clan-traits"]]) {
            const acquired = list === "advancementClanTraits";
            const root = document.getElementById(rootId);
            root.replaceChildren();
            const count = acquired ? character[list].length : visibleSlotCount(character[list], normal);

            for (let index = 0; index < count; index++) {
                const id = (acquired ? "acquired-trait-" : "clan-trait-") + (index + 1);
                const field = createChoiceField(
                    id,
                    (acquired ? "Traço adicional " : "Traço de Clã ") + (index + 1),
                    "Referência do material atual"
                );
                const raw = character[list][index] || "";
                const selected = clan?.traits.find((trait) => trait.name === raw) || null;
                const manual = Boolean(raw && !selected);
                const writable = character.mode === "play" || (!acquired && index < normal);

                const options = writable
                    ? [
                        ...(clan?.traits || []).map((trait) => ({value:trait.name, label:trait.name})),
                        {value:"__manual__", label:"Outro / manual"}
                    ]
                    : selected
                        ? [{value:selected.name, label:selected.name}]
                        : manual
                            ? [{value:"__manual__", label:"Outro / manual"}]
                            : [];

                populateSelect(
                    field.select,
                    options,
                    manual ? "__manual__" : selected?.name || "",
                    "Selecione um Traço"
                );
                field.select.disabled = !writable;

                const manualInput = document.createElement("input");
                manualInput.type = "text";
                manualInput.className = "manual-choice-input";
                manualInput.placeholder = "Nome do Traço / decisão da mesa";
                manualInput.setAttribute("aria-label", (acquired ? "Traço adicional" : "Traço de Clã") + " manual " + (index + 1));
                manualInput.value = manual ? raw : "";
                manualInput.hidden = !manual;
                field.select.after(manualInput);

                const extra = !acquired && index >= normal && raw
                    ? "Escolha acima dos espaços iniciais deste tier; preservada. "
                    : "";

                field.help.textContent = extra + (selected
                    ? "Entrada catalogada no material atual. A descrição abaixo é apenas referência; a mesa pode usar uma versão diferente."
                    : manual
                        ? "Entrada manual. A ficha não valida requisitos nem custo desta escolha."
                        : "Use uma opção catalogada como referência ou escolha Outro / manual.");

                field.rule.textContent = selected
                    ? "Referência do material atual.\n\nPré-requisitos indicados: " +
                        (selected.prerequisites || "Nenhum informado.") + "\n\n" + selected.description
                    : "";
                field.details.hidden = !selected;

                field.select.addEventListener("change", () => {
                    if (!writable) return;
                    if (field.select.value === "__manual__") {
                        character[list][index] = manualInput.value.trim();
                        manualInput.hidden = false;
                        field.details.hidden = true;
                        manualInput.focus();
                        saveNow("Modo manual de Traço selecionado.");
                        return;
                    }
                    character[list][index] = field.select.value;
                    renderClanTraits();
                    document.getElementById(id)?.focus();
                    saveNow("Traço atualizado.");
                });

                manualInput.addEventListener("input", () => {
                    if (!writable) return;
                    character[list][index] = manualInput.value;
                    saveNow("Traço manual salvo.");
                });

                if (acquired && character.mode === "play") {
                    const remove = document.createElement("button");
                    remove.type = "button";
                    remove.className = "small-button no-print";
                    remove.textContent = "Remover Traço";
                    remove.addEventListener("click", () => {
                        character[list].splice(index, 1);
                        renderClanTraits();
                        saveNow("Traço removido.");
                    });
                    field.root.append(remove);
                }

                root.append(field.root);
            }
        }

        const add = document.getElementById("add-clan-trait");
        add.hidden = character.mode !== "play";
        add.disabled = character.advancementClanTraits.includes("");
        document.getElementById("clan-trait-advancement-help").textContent = character.mode === "play"
            ? "Adicione Traços conforme a decisão da mesa. Opções e requisitos catalogados servem apenas como referência."
            : "Na criação: " + normal + " espaço(s) de Traço. A ficha não bloqueia decisões manuais da mesa.";
    }

    function renderIdentityAutomation() {
        const clanSelect = document.getElementById("clan");
        const sireSelect = document.getElementById("sire");
        const sireDisciplineSelect = document.getElementById("sire-discipline");
        const specialField = document.getElementById("clan-special-discipline-field");
        const specialSelect = document.getElementById("clan-special-discipline");

        const clan = currentClan();
        const sire = currentSire();

        populateSelect(
            clanSelect,
            clans.map((item) => ({value:item.id, label:item.name})),
            clan?.id || "",
            "Selecione um clã"
        );

        populateSelect(
            sireSelect,
            sires.map((item) => ({value:item.id, label:item.name})),
            sire?.id || "",
            "Selecione um Sire"
        );

        const variableSlot = clan?.disciplineSlots.find((slot) => slot.length > 1);
        if (variableSlot) {
            if (!variableSlot.includes(character.identity.clanDisciplineChoice)) {
                character.identity.clanDisciplineChoice = variableSlot[0];
            }
            specialField.hidden = false;
            populateSelect(
                specialSelect,
                variableSlot.map((name) => ({value:name,label:name})),
                character.identity.clanDisciplineChoice,
                null
            );
        } else {
            character.identity.clanDisciplineChoice = "";
            specialField.hidden = true;
            specialSelect.replaceChildren();
        }

        const related = document.getElementById("sire-clan");
        document.getElementById("sire-clan-field").hidden = sire?.mode !== "custom-clan";
        populateEligibleSelect(related, clans.map((item) => ({value:item.name,label:item.name})), character.identity.sireClan, "Selecione o Clã relacionado");
        document.getElementById("sire-discipline-field").hidden = !sire && !character.identity.sireDiscipline;
        const sireOptions = sireDisciplines(character);

        populateEligibleSelect(
            sireDisciplineSelect,
            sireOptions.map((name) => ({value:name,label:name})),
            character.identity.sireDiscipline,
            sire?.mode === "custom-clan"
                ? "Escolha a Disciplina do clã relacionado"
                : "Selecione a Disciplina"
        );
        sireDisciplineSelect.disabled = !sire;

        document.getElementById("sire-description").textContent = sire?.description || "";
        document.getElementById("sire-description").closest("details").hidden = !sire;
        document.getElementById("clan-curse-summary").textContent = rulePreview(clan?.curse?.description || "Selecione um Clã.");
        document.getElementById("clan-beast-name").textContent = clan?.beast?.name || "—";
        document.getElementById("clan-curse-name").textContent = clan?.curse?.name || character.identity.curse || "—";
        document.getElementById("clan-curse-description").textContent =
            clan?.curse?.description || "Selecione um clã.";
        document.getElementById("clan-frenzy-name").textContent = clan?.frenzy?.name || "—";


        renderClanTraits();
        renderClanIcon();
        renderBeastIdentity();
    }

    function installIdentityAutomation() {
        document.getElementById("add-clan-trait").addEventListener("click", () => {
            if (character.mode !== "play" || character.advancementClanTraits.includes("")) return;
            character.advancementClanTraits.push("");
            renderClanTraits();
            saveNow("Espaço para Traço adicionado.");
        });
        document.getElementById("clan").addEventListener("change", (event) => {
            const clan = clans.find((item) => item.id === event.target.value) || null;
            character.identity.clan = clan?.name || "";
            character.identity.curse = clan?.curse?.name || "";

            const variableSlot = clan?.disciplineSlots.find((slot) => slot.length > 1);
            character.identity.clanDisciplineChoice = variableSlot?.[0] || "";

            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderIdentityAutomation();
            renderDisciplines();
            renderCoreResources();
            refreshEligibility();
            saveNow("Clã e opções relacionadas atualizados.");
        });

        document.getElementById("sire").addEventListener("change", (event) => {
            const sire = sires.find((item) => item.id === event.target.value) || null;
            character.identity.sire = sire?.name || "";
            // Keep a still-valid choice (and all invested Discipline dots/powers).
            const previous = character.identity.sireDiscipline;
            const options = sireDisciplines(character);
            character.identity.sireDiscipline = options.includes(previous) ? previous : options[0] || "";
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderIdentityAutomation();
            renderDisciplines();
            refreshEligibility();
            saveNow("Sire e opções relacionadas atualizados.");
        });

        document.getElementById("sire-discipline").addEventListener("change", (event) => {
            if (event.target.value && !sireDisciplines(character).includes(event.target.value)) return;
            character.identity.sireDiscipline = event.target.value;
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderDisciplines();
            refreshEligibility();
            saveNow("Disciplina do Sire atualizada.");
        });

        document.getElementById("sire-clan").addEventListener("change", (event) => {
            character.identity.sireClan = event.target.value;
            if (!sireDisciplines(character).includes(character.identity.sireDiscipline)) character.identity.sireDiscipline = "";
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderIdentityAutomation(); renderDisciplines(); refreshEligibility();
            saveNow("Clã relacionado ao Sire atualizado; pontos existentes preservados.");
        });

        document.getElementById("clan-special-discipline").addEventListener("change", (event) => {
            character.identity.clanDisciplineChoice = event.target.value;
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderDisciplines();
            refreshEligibility();
            saveNow("Disciplina variável do Clã atualizada.");
        });
    }

    return { renderClanTraits, renderIdentityAutomation, installIdentityAutomation };
}

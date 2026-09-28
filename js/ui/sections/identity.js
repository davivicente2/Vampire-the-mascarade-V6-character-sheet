import { tierLevels as levels } from "../../../data/tiers.js";
import { clans, getClanByName, getAvailableTraits } from "../../../data/clans.js";
import { sires, getSireByName } from "../../../data/sires.js";
import { disciplines } from "../../../data/disciplines.js";
import { normalizeTraitSelection, syncDisciplinesToIdentity } from "../../model/identity.js";
import { populateSelect } from "../controls.js";
import { rulePreview } from "../disclosure.js";

export function createIdentity({ character, saveNow, renderBeastIdentity, renderDisciplines }) {
    function currentClan() {
        return getClanByName(character.identity.clan);
    }

    function currentSire() {
        return getSireByName(character.identity.sire);
    }

    function renderClanTraitSelect(index) {
        const clan = currentClan();
        const select = document.getElementById("clan-trait-" + (index + 1));
        const help = document.getElementById("clan-trait-" + (index + 1) + "-description");
        const traits = getAvailableTraits(clan);
        const saved = normalizeTraitSelection(character.clanTraits[index], clan);

        character.clanTraits[index] = saved;

        populateSelect(
            select,
            traits.map((trait) => ({
                value: trait.name,
                label: (trait.tier === "ancilla" ? "⚠ Ancilla — " : "") + trait.name
            })),
            saved,
            "Selecione um Traço"
        );

        const selected = traits.find((trait) => trait.name === saved);
        const warning = selected && levels[selected.tier] > (levels[character.identity.playLevel] || 0)
            ? "⚠ Requer " + selected.tier + " ou superior. " : "";
        help.textContent = selected
            ? warning + [selected.prerequisites, rulePreview(selected.description)].filter(Boolean).join(" — ")
            : "Os Traços disponíveis dependem do Clã.";
        const rule = document.getElementById("clan-trait-" + (index + 1) + "-rule");
        rule.textContent = selected?.description || "";
        rule.closest("details").hidden = !selected;
    }

    function renderClanTraits() {
        renderClanTraitSelect(0);
        renderClanTraitSelect(1);
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

        const sireOptions = sire?.disciplines?.length
            ? sire.disciplines
            : Object.keys(disciplines);

        populateSelect(
            sireDisciplineSelect,
            sireOptions.map((name) => ({value:name,label:name})),
            character.identity.sireDiscipline,
            sire?.mode === "custom-clan"
                ? "Escolha a Disciplina do clã relacionado"
                : "Selecione a Disciplina"
        );

        document.getElementById("sire-description").textContent = sire?.description || "Selecione um Sire.";
        document.getElementById("clan-curse-summary").textContent = rulePreview(clan?.curse?.description || "Selecione um Clã.");
        document.getElementById("clan-beast-name").textContent = clan?.beast?.name || "—";
        document.getElementById("clan-curse-name").textContent = clan?.curse?.name || character.identity.curse || "—";
        document.getElementById("clan-curse-description").textContent =
            clan?.curse?.description || "Selecione um clã.";
        document.getElementById("clan-frenzy-name").textContent = clan?.frenzy?.name || "—";
        document.getElementById("clan-frenzy-description").textContent =
            rulePreview(clan?.frenzy?.description || "Selecione um clã.");

        renderClanTraits();
        renderBeastIdentity();
    }

    function installIdentityAutomation() {
        document.getElementById("clan").addEventListener("change", (event) => {
            const clan = clans.find((item) => item.id === event.target.value) || null;
            character.identity.clan = clan?.name || "";
            character.identity.curse = clan?.curse?.name || "";

            const variableSlot = clan?.disciplineSlots.find((slot) => slot.length > 1);
            character.identity.clanDisciplineChoice = variableSlot?.[0] || "";

            character.clanTraits = ["", ""];
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderIdentityAutomation();
            renderDisciplines();
            saveNow("Clã e opções relacionadas atualizados.");
        });

        document.getElementById("sire").addEventListener("change", (event) => {
            const sire = sires.find((item) => item.id === event.target.value) || null;
            character.identity.sire = sire?.name || "";
            // Keep a still-valid choice (and all invested Discipline dots/powers).
            const previous = character.identity.sireDiscipline;
            character.identity.sireDiscipline = sire && (sire.disciplines.includes(previous) ||
                (sire.mode === "custom-clan" && disciplines[previous]))
                ? previous : sire?.disciplines?.[0] || "";
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderIdentityAutomation();
            renderDisciplines();
            saveNow("Sire e opções relacionadas atualizados.");
        });

        document.getElementById("sire-discipline").addEventListener("change", (event) => {
            character.identity.sireDiscipline = event.target.value;
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderDisciplines();
            saveNow("Disciplina do Sire atualizada.");
        });

        document.getElementById("clan-special-discipline").addEventListener("change", (event) => {
            character.identity.clanDisciplineChoice = event.target.value;
            syncDisciplinesToIdentity(character, {resetExtras:false});
            renderDisciplines();
            saveNow("Disciplina variável do Clã atualizada.");
        });

        [0,1].forEach((index) => {
            document.getElementById("clan-trait-" + (index + 1)).addEventListener("change", (event) => {
                character.clanTraits[index] = event.target.value;
                renderClanTraitSelect(index);
                saveNow("Traço de Clã atualizado.");
            });
        });
    }

    return { renderClanTraits, renderIdentityAutomation, installIdentityAutomation };
}

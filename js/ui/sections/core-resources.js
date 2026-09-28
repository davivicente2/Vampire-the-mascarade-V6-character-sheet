import { frenzyDifficulty } from "../../model/frenzy.js";
import { HUNGER_EFFECTS } from "../../../data/hunger.js";
import { maxVitae, effectiveMaxVitae, maxWillpower, hungerState, clampCoreResources } from "../../model/resources.js";
import { createDots, bindInput as bindControl } from "../controls.js";

export function createCoreResources({ character, saveNow, renderHumanity }) {
    function renderCoreResources() {
        clampCoreResources(character);

        const vitaeMax = maxVitae(character);
        const effective = effectiveMaxVitae(character);
        const wpMax = maxWillpower(character);
        const state = hungerState(character);

        document.getElementById("vitae-label").textContent = character.currentVitae + " / " + vitaeMax;
        document.getElementById("willpower-label").textContent = character.currentWillpower + " / " + wpMax;
        document.getElementById("effective-vitae").textContent = effective;
        document.getElementById("hunger-state").textContent = state;
        document.getElementById("hunger-effect").textContent = state === "MORTE FINAL"
            ? "Todas as caixas de Vitae estão marcadas com Dano Nefasto: o personagem foi destruído."
            : HUNGER_EFFECTS[state] + (state === "FAMINTO"
                ? " Dificuldade para resistir ao frenesi de fome: " + frenzyDifficulty(character, 6 - character.currentVitae) + "."
                : "");
        document.getElementById("quickening-label").textContent = character.quickening + " / 5";
        document.getElementById("quickening").value = character.quickening;
        document.getElementById("quickening-minus").disabled = character.quickening === 0;
        document.getElementById("quickening-plus").disabled = character.quickening === 5 || character.currentVitae === 0;
        document.getElementById("quickening").disabled = character.currentVitae === 0;
        document.getElementById("nefarious-damage").value = character.nefariousDamage;

        const vitaeRoot = document.getElementById("vitae-tracker");
        vitaeRoot.replaceChildren(createDots(character.currentVitae, vitaeMax, (next) => {
            character.currentVitae = Math.min(next, effectiveMaxVitae(character));
            renderCoreResources();
            saveNow("Vitae salvo.");
        }, "Vitae", "tracker-dot"));
        [...vitaeRoot.querySelectorAll("button")].forEach((button, index) => {
            if (index >= effective) {
                button.disabled = true;
                button.textContent = "×";
                button.setAttribute("aria-label", "Vitae " + (index + 1) + ": bloqueada por Dano Nefasto");
            }
        });

        const wpRoot = document.getElementById("willpower-tracker");
        wpRoot.replaceChildren(createDots(character.currentWillpower, wpMax, (next) => {
            character.currentWillpower = next;
            renderCoreResources();
            saveNow("Força de Vontade salva.");
        }, "Força de Vontade", "tracker-dot"));
        renderHumanity();
        wpRoot.nextElementSibling.textContent = "Máximo: 5 + Autocontrole + Determinação." +
            (character.currentWillpower === 0
                ? " Sem Vontade: resista ao frenesi de fúria (dificuldade " + frenzyDifficulty(character, 2) + ", antes de ajustes da situação) ou aceite-o."
                : character.currentWillpower <= 3
                    ? " Com 3 ou menos: uma falha dolorosa pode provocar frenesi de fúria."
                    : "");
    }

    function installCoreResourceActions() {
        const bindInput = (id, getter, setter, options) => bindControl(id, getter, setter, {...options, save: saveNow});
        bindInput("quickening",()=>character.quickening,(v)=>character.quickening=Math.max(0,v),{
            number:true, after:renderCoreResources
        });

        bindInput("nefarious-damage",()=>character.nefariousDamage,(v)=>{
            character.nefariousDamage=Math.max(0,v);
            clampCoreResources(character);
        },{number:true, after:renderCoreResources});
        document.getElementById("quickening-minus").addEventListener("click", () => {
            character.quickening=Math.max(0, Number(character.quickening || 0)-1);
            renderCoreResources(); saveNow("Quickening salvo.");
        });
        document.getElementById("quickening-plus").addEventListener("click", () => {
            character.quickening=Number(character.quickening || 0)+1;
            renderCoreResources(); saveNow("Quickening salvo.");
        });
    }

    return { renderCoreResources, installCoreResourceActions };
}

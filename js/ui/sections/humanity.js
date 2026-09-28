import { humanityStages } from "../../../data/humanity.js";
import { natures, getNature } from "../../../data/natures.js";
import { getClanByName } from "../../../data/clans.js";
import { humanityBounds, shiftHumanity, resistancePool, humanityState } from "../../model/humanity.js";
import { maxWillpower } from "../../model/resources.js";
import { createDots, populateSelect } from "../controls.js";

export function createHumanity({ character, saveNow, renderCoreResources }) {
    function renderHumanity() {
        document.getElementById("beast-points-label").textContent = character.beastPoints + " / 5";
        document.getElementById("nature-points-label").textContent = character.naturePoints + " / 5";
        document.getElementById("humanity-state").textContent = humanityState(character);

        const beastRoot = document.getElementById("beast-points");
        beastRoot.replaceChildren(createDots(character.beastPoints, 5, (next) => {
            character.beastPoints = next;
            renderHumanity();
            saveNow("Pontos de Besta salvos.");
        }, "Pontos de Besta", "tracker-dot"));

        const natureRoot = document.getElementById("nature-points");
        natureRoot.replaceChildren(createDots(character.naturePoints, 5, (next) => {
            character.naturePoints = next;
            renderHumanity();
            saveNow("Pontos de Natureza salvos.");
        }, "Pontos de Natureza", "tracker-dot"));

        renderHumanityDetails();
        const bounds = humanityBounds(character);
        const scale = document.getElementById("humanity-scale");
        scale.replaceChildren();

        for (let pos=-3; pos<=3; pos+=1) {
            const button=document.createElement("button");
            button.type="button";
            button.className="humanity-dot" + (pos===Number(character.humanityPosition) ? " active" : "");
            button.textContent = pos === 0 ? "0" : String(Math.abs(pos));
            button.title = humanityStages[pos].name;
            button.setAttribute("aria-label", humanityStages[pos].name);
            button.setAttribute("aria-pressed", String(pos === character.humanityPosition));
            const lost = pos < bounds.min || pos > bounds.max;
            button.disabled = lost || Boolean(character.humanityFate);
            if (lost) {
                button.textContent = "×";
                button.title += " — círculo perdido";
                button.setAttribute("aria-label", button.title);
            }
            button.addEventListener("click", () => {
                character.humanityPosition = pos;
                renderHumanity();
                saveNow("Escala de Humanidade salva.");
            });
            scale.appendChild(button);
        }
    }

    function renderBeastIdentity() {
        const clan = getClanByName(character.identity.clan);
        document.getElementById("beast-clan-name").textContent = clan?.beast?.name
            ? "Besta do Clã: " + clan.beast.name : "Besta do Clã";
        document.getElementById("beast-clan-description").textContent = clan?.beast?.description || "Escolha um Clã para conhecer a manifestação da sua Besta.";
        document.getElementById("beast-clan-indulging").textContent = clan?.beast?.indulging || "Selecione um Clã para ver exemplos.";
        document.getElementById("beast-frenzy-name").textContent = clan?.frenzy
            ? "Frenesi do Clã: " + clan.frenzy.name : "Frenesi da Besta";
        document.getElementById("beast-clan-frenzy").textContent = clan?.frenzy?.description ||
            "Selecione um Clã para ver o comportamento e os efeitos do seu Frenesi.";
    }

    function installNatureSelection() {
        const select = document.getElementById("nature");
        const selected = getNature(character.nature);
        const options = natures.map((nature) => ({ value: nature.name, label: nature.name }));
        if (character.nature && !selected) {
            options.push({ value: character.nature, label: character.nature.split(" — ")[0] + " (salva)" });
        }
        populateSelect(select, options, selected?.name || character.nature, "Selecione uma Natureza");
        const render = () => {
            const nature = getNature(select.value);
            document.getElementById("nature-description").textContent = nature?.description ||
                (select.value || "Escolha a Natureza que representa o que ainda faz você se sentir humano.");
            document.getElementById("nature-indulging").textContent = nature?.indulging || "Sem exemplos cadastrados para esta seleção.";
            document.getElementById("nature-outburst-name").textContent = nature ? "Explosão: " + nature.outburst : "Explosão da Natureza";
            document.getElementById("nature-outburst-effect").textContent = nature?.effect || "Selecione uma Natureza para consultar o comportamento compulsivo e seus efeitos.";
        };
        render();
        select.addEventListener("change", () => {
            character.nature = select.value;
            render();
            saveNow("Natureza atualizada. Anotações pessoais preservadas.");
        });
    }

    function renderHumanityDetails() {
        const tier = character.identity.playLevel;
        document.getElementById("humanity-start-help").textContent = "Na criação, comece no círculo central (Neutro). " +
            (tier === "ancilla" ? "Com autorização do Narrador, Ancilla pode começar em Monstruoso 1 ou Mortal 1."
                : tier === "elder" ? "Com autorização do Narrador, Elder pode começar em Monstruoso 2 ou Mortal 2."
                : "A posição inicial não muda automaticamente ao selecionar o tier.");
        const stage = humanityStages[character.humanityPosition];
        document.getElementById("humanity-stage").textContent = stage.name;
        document.getElementById("humanity-effects").textContent = stage.effects;
        document.getElementById("humanity-appearance").textContent = stage.appearance;
        document.getElementById("humanity-losses").textContent =
            "Círculos perdidos — Besta: " + character.lostBeastCircles + "; Natureza: " + character.lostNatureCircles + ".";
        document.getElementById("humanity-fate").textContent = character.humanityFate === "wight"
            ? "A jornada terminou: tornou-se um Wight sob controle do Narrador."
            : character.humanityFate === "departure" ? "A jornada terminou: defina seu afastamento com o Narrador." : "";
        for (const side of ["beast", "nature"]) {
            const pool = resistancePool(character, side);
            const episode = character[side + "Episode"];
            const blocked = Boolean(character.humanityFate || episode || character[side + "Points"] < 5);
            const marks = character[side + "Points"];
            const episodeName = side === "beast" ? "Frenesi da Besta" : "Explosão da Natureza";
            const phase = character.humanityFate ? "Jornada encerrada"
                : episode ? episodeName + " em curso"
                : marks === 5 ? "5 marcas — resolva o impulso" : "Acompanhe a agitação";
            document.getElementById(side + "-phase").textContent = phase;
            document.getElementById(side + "-resolution").dataset.phase = episode ? "episode" : marks === 5 ? "full" : "tracking";
            document.getElementById(side + "-resistance").textContent = character.humanityFate
                ? "O desfecho da jornada está indicado na escala."
                : episode
                    ? "As marcas foram apagadas. Interprete o episódio até seu término; depois, conclua para mover 1 passo para " + (side === "beast" ? "Monstruoso." : "Mortal.") +
                        (episode === "accepted" ? " Como você cedeu voluntariamente, recuperará 2 Vontade ao concluir, até o máximo." : "") +
                        (episode === "painful" ? " Falha dolorosa: o Narrador ganha 1 Drama; resolva também a Escolha sua Dor." : "")
                    : marks < 5
                        ? "Faltam " + (5 - marks) + " marcas para exigir resistência."
                        : !pool.canResist
                            ? "Mortal 3: você não pode resistir à Explosão. Inicie o episódio; a escala só muda quando ele terminar."
                            : "Role Autocontrole + Determinação − dificuldade " + pool.difficulty +
                                " (3 + modificador de geração). Bônus já considerados: +" + pool.bonus + ". Parada: " + pool.dice +
                                " dados, antes de outros efeitos. Registre o resultado abaixo ou ceda sem rolar. A ficha não rola dados.";
            for (const result of ["success", "failure", "painful", "accepted"]) {
                const button = document.getElementById(side + "-" + result);
                const forbidden = !pool.canResist && ["success", "painful"].includes(result);
                button.hidden = blocked || forbidden;
                button.disabled = blocked || forbidden;
            }
            document.getElementById(side + "-failure").textContent = pool.canResist
                ? "Falha — iniciar episódio" : "Iniciar Explosão inevitável";
            const finish = document.getElementById(side + "-finish");
            finish.hidden = !episode || Boolean(character.humanityFate);
            finish.disabled = finish.hidden;
        }
    }

    function installHumanityActions() {
        for (const side of ["beast", "nature"]) {
            for (const result of ["success", "failure", "painful", "accepted"]) {
                document.getElementById(side + "-" + result).addEventListener("click", () => {
                    if (character[side + "Points"] < 5 || character[side + "Episode"] || character.humanityFate) return;
                    if (!resistancePool(character, side).canResist && ["success", "painful"].includes(result)) return;
                    if (result === "success") {
                        if (!resistancePool(character, side).canResist) return;
                        character[side + "Points"] = 4;
                    } else {
                        character[side + "Points"] = 0;
                        character[side + "Episode"] = result;
                    }
                    renderHumanity();
                    saveNow(result === "success" ? "Resistência bem-sucedida: uma marca apagada." : "Episódio iniciado; escala será alterada ao concluir.");
                });
            }
            document.getElementById(side + "-finish").addEventListener("click", () => {
                const episode = character[side + "Episode"];
                if (!episode || character.humanityFate) return;
                shiftHumanity(character, side === "beast" ? -1 : 1);
                if (episode === "accepted") character.currentWillpower = Math.min(maxWillpower(character), character.currentWillpower + 2);
                character[side + "Episode"] = "";
                renderCoreResources();
                saveNow("Episódio concluído e Humanidade atualizada.");
            });
        }
    }

    return { renderHumanity, renderBeastIdentity, installNatureSelection, renderHumanityDetails, installHumanityActions };
}

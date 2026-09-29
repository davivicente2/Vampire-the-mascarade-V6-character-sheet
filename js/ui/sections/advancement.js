import { experienceAwards, experienceCosts } from "../../../data/advancement.js";

export function createAdvancement({ character, saveNow }) {
    const root = document.getElementById("xp-history");
    const available = document.getElementById("xp-available");
    const amount = document.getElementById("xp-change");
    const note = document.getElementById("xp-note");

    function renderHistory() {
        root.replaceChildren();
        if (!character.experience.history.length) {
            const empty = document.createElement("p");
            empty.className = "field-help";
            empty.textContent = "Nenhum ganho ou gasto registrado.";
            root.appendChild(empty);
            return;
        }
        [...character.experience.history].reverse().forEach((entry) => {
            const row = document.createElement("div");
            row.className = "xp-history-row";
            const delta = document.createElement("strong");
            delta.textContent = (entry.delta > 0 ? "+" : "") + entry.delta + " XP";
            const description = document.createElement("span");
            description.textContent = entry.note || (entry.delta > 0 ? "XP recebido" : "XP gasto");
            row.append(delta, description);
            root.appendChild(row);
        });
    }

    function renderAdvancement() {
        available.value = character.experience.available;
        document.getElementById("xp-balance").textContent = character.experience.available + " XP";
        renderHistory();
    }

    function record(sign) {
        const value = Math.max(1, Math.trunc(Number(amount.value) || 0));
        const delta = sign * value;
        if (delta < 0 && value > character.experience.available) {
            document.getElementById("xp-status").textContent =
                "XP insuficiente para esse gasto. Ajuste o saldo manualmente se a mesa estiver usando outra regra.";
            return;
        }
        character.experience.available += delta;
        character.experience.history.push({delta, note: note.value.trim()});
        amount.value = "1";
        note.value = "";
        document.getElementById("xp-status").textContent = delta > 0 ? "Ganho registrado." : "Gasto registrado.";
        renderAdvancement();
        saveNow(delta > 0 ? "XP recebido e salvo." : "XP gasto e salvo.");
    }

    available.addEventListener("change", () => {
        character.experience.available = Math.max(0, Math.trunc(Number(available.value) || 0));
        document.getElementById("xp-status").textContent =
            "Saldo ajustado manualmente; nenhum registro foi criado.";
        renderAdvancement();
        saveNow("Saldo de XP ajustado manualmente.");
    });

    document.getElementById("xp-gain").addEventListener("click", () => record(1));
    document.getElementById("xp-spend").addEventListener("click", () => record(-1));
    document.getElementById("xp-clear-history").addEventListener("click", () => {
        if (!character.experience.history.length) return;
        if (!window.confirm("Limpar o histórico de XP? O saldo atual será preservado.")) return;
        character.experience.history = [];
        renderHistory();
        saveNow("Histórico de XP limpo; saldo preservado.");
    });

    const awards = document.getElementById("xp-awards");
    for (const [label, description] of experienceAwards) {
        const item = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = label + ": ";
        item.append(strong, description);
        awards.appendChild(item);
    }

    const costs = document.getElementById("xp-costs");
    for (const [label, cost] of experienceCosts) {
        const row = document.createElement("tr");
        const stat = document.createElement("td");
        const value = document.createElement("td");
        stat.textContent = label;
        value.textContent = cost;
        row.append(stat, value);
        costs.appendChild(row);
    }

    return { renderAdvancement };
}

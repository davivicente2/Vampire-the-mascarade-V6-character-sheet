import { getClanByName } from "../../data/clans.js";

async function iconData(file) {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Escolha uma imagem PNG, JPEG ou WebP.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Escolha uma imagem de até 5 MB.");
    const bitmap = await createImageBitmap(file);
    try {
        const scale = Math.min(1, 256 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png");
    } finally { bitmap.close(); }
}

export function createClanIcon({ character, saveNow }) {
    const image = document.getElementById("clan-icon");
    const placeholder = document.getElementById("clan-icon-placeholder");
    const button = document.getElementById("clan-icon-button");
    const remove = document.getElementById("clan-icon-remove");
    const input = document.getElementById("clan-icon-file");
    const status = document.getElementById("clan-icon-status");
    function renderClanIcon() {
        const clan = getClanByName(character.identity.clan);
        const src = character.clanIcons[clan?.id];
        image.hidden = !src;
        if (src) { image.src = src; image.alt = "Ícone do Clã " + clan.name; }
        else { image.removeAttribute("src"); image.alt = ""; }
        placeholder.hidden = Boolean(src);
        placeholder.textContent = clan ? clan.name.slice(0, 2).toUpperCase() : "Clã";
        button.disabled = !clan;
        button.textContent = src ? "Trocar ícone" : "Adicionar ícone";
        remove.hidden = !src;
        status.textContent = clan ? "" : "Selecione um Clã.";
    }
    button.addEventListener("click", () => input.click());
    input.addEventListener("change", async () => {
        const file = input.files?.[0], clan = getClanByName(character.identity.clan);
        if (!file || !clan) return;
        button.disabled = true;
        try {
            const data = await iconData(file);
            character.clanIcons[clan.id] = data;
            renderClanIcon();
            saveNow("Ícone do Clã salvo.");
        } catch (error) {
            renderClanIcon();
            status.textContent = error.message || "Não foi possível abrir esta imagem.";
        } finally { input.value = ""; }
    });
    remove.addEventListener("click", () => {
        const clan = getClanByName(character.identity.clan);
        if (clan) delete character.clanIcons[clan.id];
        renderClanIcon(); saveNow("Ícone removido.");
    });
    return { renderClanIcon };
}

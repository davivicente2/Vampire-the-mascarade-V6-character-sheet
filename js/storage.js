const STORAGE_KEY = "vtm-v6-character-sheet";

export function saveCharacter(character) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
}

export function loadCharacter() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error("Não foi possível ler a ficha salva.", error);
        return null;
    }
}

export function clearCharacter() {
    localStorage.removeItem(STORAGE_KEY);
}

export function exportCharacter(character) {
    const json = JSON.stringify(character, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = (character.identity.name || "personagem-vtm-v6")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + ".vtm6.json";

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export function importCharacter(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            try {
                resolve(JSON.parse(reader.result));
            } catch (error) {
                reject(new Error("O arquivo selecionado não contém JSON válido."));
            }
        });

        reader.addEventListener("error", () => {
            reject(new Error("Não foi possível ler o arquivo selecionado."));
        });

        reader.readAsText(file);
    });
}

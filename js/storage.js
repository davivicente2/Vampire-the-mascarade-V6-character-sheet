const STORAGE_KEY = "vtm-v6-character-sheet";

export function saveCharacter(character) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    } catch {
        throw new Error("Não foi possível salvar neste navegador. Exporte a ficha em JSON para guardar suas alterações.");
    }
}

export function loadCharacter(onError = () => {}) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const character = JSON.parse(raw);
        assertCharacter(character);
        return character;
    } catch (error) {
        console.error("Não foi possível ler a ficha salva.", error);
        onError(error);
        return null;
    }
}

// Accept partial/older sheets, but reject incompatible structures before saving.
export function assertCharacter(value) {
    const object = (item) => item !== null && typeof item === "object" && !Array.isArray(item);
    const fail = () => { throw new Error("O arquivo não contém uma ficha VTM válida."); };
    const text = (item) => typeof item === "string";
    const number = (item) => (typeof item === "number" || typeof item === "string") &&
        String(item).trim() !== "" && Number.isFinite(Number(item));
    const fields = (item, numeric = []) => {
        if (!object(item)) fail();
        for (const [key, entry] of Object.entries(item)) {
            if (!(numeric.includes(key) ? number(entry) : text(entry))) fail();
        }
    };
    if (!object(value) || !object(value.identity)) fail();
    fields(value.identity, ["generation", "generationModifier"]);
    if (value.attributes !== undefined) {
        if (!object(value.attributes) || !Object.values(value.attributes).every(number)) fail();
    }
    if (value.skills !== undefined) {
        if (!object(value.skills)) fail();
        Object.values(value.skills).forEach((skill) => {
            if (!object(skill)) fail();
            const { focuses, ...rest } = skill;
            fields(rest, ["dots"]);
            if (focuses !== undefined && (!Array.isArray(focuses) || !focuses.every(text))) fail();
        });
    }
    for (const key of ["resources", "disciplines", "lifepaths", "clanTraits"]) {
        if (value[key] !== undefined && !Array.isArray(value[key])) fail();
    }
    value.resources?.forEach((resource) => fields(resource, ["dots"]));
    value.disciplines?.forEach((discipline) => {
        if (!object(discipline)) fail();
        const { powers, ...rest } = discipline;
        fields(rest, ["dots"]);
        if (powers !== undefined && !Array.isArray(powers)) fail();
        powers?.forEach((power) => { if (!text(power)) fields(power); });
    });
    for (const key of ["lifepaths", "clanTraits"]) {
        if (value[key] && !value[key].every(text)) fail();
    }
    for (const key of ["merit", "flaw", "nature", "beast", "items", "frenzyTrigger", "outburstTrigger", "beastEpisode", "natureEpisode", "humanityFate"]) {
        if (value[key] !== undefined && !text(value[key])) fail();
    }
    for (const key of ["currentVitae", "currentWillpower", "quickening", "nefariousDamage", "beastPoints", "naturePoints", "humanityPosition", "lostBeastCircles", "lostNatureCircles"]) {
        if (value[key] !== undefined && !number(value[key])) fail();
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
                const character = JSON.parse(reader.result);
                assertCharacter(character);
                resolve(character);
            } catch (error) {
                reject(error instanceof SyntaxError
                    ? new Error("O arquivo selecionado não contém JSON válido.")
                    : error);
            }
        });

        reader.addEventListener("error", () => {
            reject(new Error("Não foi possível ler o arquivo selecionado."));
        });

        reader.readAsText(file);
    });
}

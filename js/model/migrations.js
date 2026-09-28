import { CURRENT_SCHEMA_VERSION } from "../../data/schema.js";

const migrations = {
    1: (sheet) => ({...sheet, version: 2}),
    2: (sheet) => ({...sheet, version: 3,
        merits: Array.isArray(sheet.merits) ? [...sheet.merits] : sheet.merit ? [sheet.merit] : []})
};

export function migrateCharacter(value) {
    let sheet = JSON.parse(JSON.stringify(value || {}));
    let version = sheet.version === undefined ? 1 : Number(sheet.version);
    if (!Number.isInteger(version) || version < 1 || version > CURRENT_SCHEMA_VERSION) {
        throw new Error("Versão de ficha não suportada: " + sheet.version + ".");
    }
    while (version < CURRENT_SCHEMA_VERSION) {
        sheet = migrations[version](sheet);
        version = sheet.version;
    }
    // Legacy merit remains untouched; merits is authoritative from v3 onward.
    return {...sheet, version};
}

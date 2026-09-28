export function maxVitae(character) {
    return 10 + Number(character.attributes.stamina || 0);
}

export function effectiveMaxVitae(character) {
    return Math.max(0, maxVitae(character) - Number(character.nefariousDamage || 0));
}

export function maxWillpower(character) {
    return 5 + Number(character.attributes.composure || 0) + Number(character.attributes.resolve || 0);
}

export function hungerState(character) {
    const value = Number(character.currentVitae || 0);
    if (effectiveMaxVitae(character) === 0) return "MORTE FINAL";
    if (value <= 0) return "TORPOR";
    if (value >= 11) return "SATISFEITO";
    if (value >= 6) return "SEDENTO";
    return "FAMINTO";
}

export function clampCoreResources(character) {
    character.currentVitae = Math.max(0, Math.min(Number(character.currentVitae || 0), effectiveMaxVitae(character)));
    character.currentWillpower = Math.max(0, Math.min(Number(character.currentWillpower || 0), maxWillpower(character)));
    character.quickening = Math.max(0, Math.min(5, Math.trunc(Number(character.quickening) || 0)));
    character.nefariousDamage = Math.max(0, Math.trunc(Number(character.nefariousDamage) || 0));
    if (character.currentVitae === 0) character.quickening = 0;
}

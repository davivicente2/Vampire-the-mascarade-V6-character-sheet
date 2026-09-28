export const sires = [
    { id: "adoptive", name: "Adoptive Sire", disciplines: [], mode: "custom-clan", description: "Choose one Discipline from the adoptive sire's clan." },
    { id: "brood-child", name: "Brood Child", disciplines: [], mode: "custom-clan", description: "Choose one Discipline from a broodmate's clan." },
    { id: "caring", name: "Caring Sire", disciplines: ["Fortitude", "Potence", "Presence"], description: "A sire who cared for and taught you." },
    { id: "cruel", name: "Cruel Sire", disciplines: ["Dominate", "Fortitude", "Obfuscate"], description: "A cruel and abusive sire." },
    { id: "manipulator", name: "Manipulator Sire", disciplines: ["Dominate", "Potence", "Presence"], description: "A manipulative sire who used you as a pawn." },
    { id: "secretive", name: "Secretive Sire", disciplines: ["Auspex", "Celerity", "Obfuscate"], description: "A mysterious and reserved sire." },
    { id: "unknown", name: "Unknown Sire", disciplines: ["Celerity", "Fortitude", "Potence"], description: "You never knew your sire." },
    { id: "vigilant", name: "Vigilant Sire", disciplines: ["Auspex", "Dominate", "Fortitude"], description: "A demanding sire who watched every move." }
];

export function getSireById(id) {
    return sires.find((sire) => sire.id === id) || null;
}

export function getSireByName(name) {
    const normalized = String(name || "").trim().toLowerCase();
    return sires.find((sire) => sire.name.toLowerCase() === normalized) || null;
}

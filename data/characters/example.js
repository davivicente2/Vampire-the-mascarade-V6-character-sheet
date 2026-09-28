export const DEFAULT_CHARACTER = {
    version: 2,
    identity: {
        name: "teste",
        clan: "Ministry",
        apparentAge: "32",
        actualAge: "32",
        embraceDate: "xxx",
        nostalgicDecade: "seculo 20",
        generation: 11,
        generationModifier: 1,
        playLevel: "neonate",
        archetype: "",
        sire: "Cruel Sire",
        sireDiscipline: "Obfuscate",
        clanDisciplineChoice: "",
        curse: "Sunlight Bane"
    },
    attributes: {
        strength: 2, dexterity: 3, stamina: 3,
        charisma: 1, manipulation: 1, composure: 4,
        intelligence: 4, wits: 3, resolve: 3
    },
    skills: {
        athletics: { dots: 2, focus: "throwing" },
        awareness: { dots: 2, focus: "instinct" },
        craft: { dots: 1, focus: "forgery" },
        expression: { dots: 0, focus: "" },
        fighting: { dots: 2, focus: "hand to hand" },
        investigation: { dots: 0, focus: "" },
        knowledge: { dots: 0, focus: "" },
        medicine: { dots: 1, focus: "first aid" },
        persuasion: { dots: 3, focus: "intimidation, negotiating" },
        shooting: { dots: 3, focus: "light firearms, heavy firearms" },
        sabotage: { dots: 1, focus: "burglary" },
        subterfuge: { dots: 2, focus: "skulking" },
        survival: { dots: 1, focus: "tracking" }
    },
    resources: [
        { name: "Contact", dots: 1, details: "" },
        { name: "Mask", dots: 2, details: "" },
        { name: "Repository", dots: 2, details: "" },
        { name: "Contact", dots: 1, details: "" },
        { name: "Ally", dots: 0, details: "" }
    ],
    disciplines: [
        { name: "Corruption", dots: 2, powers: [{name:"Nightmare Glimpses", cost:"", reminder:""}, {name:"Self Doubt", cost:"", reminder:""}] },
        { name: "Obfuscate", dots: 0, powers: [{name:"", cost:"", reminder:""}] },
        { name: "Presence", dots: 1, powers: [{name:"Dread Gaze", cost:"", reminder:""}] }
    ],
    lifepaths: [
        "Criminal — You made your living by breaking the law.",
        "Military — You served your country under its military organizations and were trained in the art of war."
    ],
    lifepathAllocations: [
        { skills: ["Atletismo (Corrida)", "Percepção", "Briga (Luta suja)", "Sabotagem (Arrombamento)", "Subterfúgio"], resources: ["Contatos: receptador", "Riqueza", "Máscara"] },
        { skills: ["Atletismo", "Briga", "Medicina (Primeiros socorros)", "Tiro (Armas pesadas)", "Sobrevivência"], resources: ["Repositório: armas", "Contatos: militares", "Aliado: antigos companheiros"] }
    ],
    clanTraits: [
        "Beguiling Words — You gain a dice bonus equal to your generation modifier to tests to deceive, lie, or deny or obscure the truth.",
        "Divine Image — Once each night, you can use an action to transform into a divine form, channeling the power of your vampire ancestors."
    ],
    merit: "Subdued Hunger — You have some control over your hunger and gain a bonus to resist hunger frenzy.",
    flaw: "",
    nature: "Survivor — You always pull through, surviving whatever the world throws at you.",
    beast: "",
    items: "foto da esposa, pistola",
    currentVitae: 13,
    currentWillpower: 12,
    quickening: 0,
    nefariousDamage: 0,
    beastPoints: 0,
    naturePoints: 0,
    humanityPosition: 0,
    frenzyTrigger: "",
    outburstTrigger: ""
};

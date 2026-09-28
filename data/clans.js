export const clans = [
    {
        id: "brujah",
        name: "Brujah",
        disciplineSlots: [["Celerity"], ["Potence"], ["Presence"]],
        curse: { name: "Boiling Passion", description: "Emotions burn hotter; frenzy resistance becomes harder by the generation modifier." },
        frenzy: { name: "Rebellion", description: "Frenzy pushes the vampire to act against authority and structures of control." },
        beast: { name: "Anti-Authority", description: "The Beast presses the vampire to challenge authority and established control." },
        traits: [
            { name: "Prowess", tier: "neonate", prerequisites: "Potence 2+", description: "Improves damage from unarmed attacks and light melee weapons." },
            { name: "Spark of Rage", tier: "neonate", prerequisites: "Potence 1+; Presence 1+", description: "Improves attempts to incite anger and violence." },
            { name: "Wrestler", tier: "neonate", prerequisites: "Potence 1+", description: "Improves tussle attacks and crush damage." },
            { name: "Combat Reflexes", tier: "ancilla", prerequisites: "Celerity 3+", description: "Improves reactions and recovery from prone/surprise." },
            { name: "Living Weapon", tier: "ancilla", prerequisites: "Potence 3+", description: "Lets a grappled creature be used as an improvised weapon." }
        ]
    },
    {
        id: "gangrel",
        name: "Gangrel",
        disciplineSlots: [["Animalism"], ["Celerity"], ["Fortitude"]],
        curse: { name: "Embraced Beast", description: "After frenzy or a Nature outburst, animalistic traits can manifest and reduce Attributes." },
        frenzy: { name: "Feral Impulses", description: "Frenzy pushes the vampire toward instinctive and animalistic behavior." },
        beast: { name: "Animalistic", description: "The Beast favors instinct, predation, and the thrill of the hunt." },
        traits: [
            { name: "Enduring Beasts", tier: "neonate", prerequisites: "Animalism 1+; Fortitude 1+", description: "Animals influenced through Animalism can become tougher." },
            { name: "Feral Whispers", tier: "neonate", prerequisites: "Animalism 1+", description: "Allows communication with animals without immediately disturbing them." },
            { name: "Safety of the Earth", tier: "neonate", prerequisites: "None", description: "Allows the vampire to shelter within natural earth, grass, or stone." },
            { name: "Quick and Tough", tier: "ancilla", prerequisites: "Celerity 2+; Fortitude 1+", description: "Combines active Celerity with faster Fortitude use." },
            { name: "Surrounded Prey", tier: "ancilla", prerequisites: "Animalism 3+", description: "Improves attacks while supported by an animal ally." }
        ]
    },
    {
        id: "lasombra",
        name: "Lasombra",
        disciplineSlots: [["Dominate"], ["Potence"], ["Corruption", "Oblivion"]],
        curse: { name: "Shadow Presence", description: "Reflections and recordings distort, and complex technology can be disrupted by the clan's connection to the Abyss." },
        frenzy: { name: "Ruthlessness", description: "Frenzy intensifies the Lasombra drive to punish failure and enforce success." },
        beast: { name: "Punisher", description: "The Beast despises failure and presses for punishment or humiliation." },
        traits: [
            { name: "Eyes of the Night", tier: "neonate", prerequisites: "Oblivion 1+", description: "Improves perception through darkness created with Oblivion." },
            { name: "Shadow Cloak", tier: "neonate", prerequisites: "Oblivion 2+", description: "Improves stealth and intimidation in darkness." },
            { name: "Tenebrous Reach", tier: "neonate", prerequisites: "Oblivion 1+", description: "Commands nearby shadows to perform simple tasks." },
            { name: "Night Blood", tier: "ancilla", prerequisites: "Oblivion 3+", description: "Enhances ghouls with night-adapted traits." },
            { name: "Oppressing Dominance", tier: "ancilla", prerequisites: "Dominate 2+; Oblivion or Corruption 1+", description: "Strengthens Dominate under the clan's corruption/shadow conditions." }
        ]
    },
    {
        id: "ministry",
        name: "Ministry",
        disciplineSlots: [["Corruption"], ["Obfuscate"], ["Presence"]],
        curse: { name: "Sunlight Bane", description: "Bright light imposes a penalty equal to the generation modifier; sunlight is especially dangerous." },
        frenzy: { name: "Transgression", description: "Frenzy drives the vampire to push others toward forbidden desires and transgression." },
        beast: { name: "Enticer", description: "The Beast revels in temptation, corruption, and drawing out repressed desires." },
        traits: [
            { name: "Beguiling Words", tier: "neonate", prerequisites: "Corruption 1+", description: "Improves deception, obscuring truth, and detecting withheld information." },
            { name: "Eyes of the Serpent", tier: "neonate", prerequisites: "Presence 1+", description: "Serpentine eyes help captivate mortals and tempt them toward risky behavior." },
            { name: "Serpent Speech", tier: "neonate", prerequisites: "Corruption 1+", description: "Allows communication with serpents and reptiles and improves influence over them." },
            { name: "Heart of Darkness", tier: "ancilla", prerequisites: "Ancilla or stronger", description: "A rite removes and stores the heart, protecting against staking and improving frenzy resistance." },
            { name: "Divine Image", tier: "ancilla", prerequisites: "Corruption 1+; Presence 1+", description: "Once each night, assume a divine form for a scene and gain generation-based bonuses." }
        ]
    },
    {
        id: "nosferatu",
        name: "Nosferatu",
        disciplineSlots: [["Animalism"], ["Obfuscate"], ["Potence"]],
        curse: { name: "External Beast", description: "The clan's monstrous nature is visibly written on the body and interferes with many social interactions." },
        frenzy: { name: "Cryptophilia", description: "Frenzy becomes an overwhelming need to uncover secrets." },
        beast: { name: "Secretive", description: "The Beast hungers for secrets, information, and leverage." },
        traits: [
            { name: "Feral Whispers", tier: "neonate", prerequisites: "Animalism 1+", description: "Allows communication with animals without immediately disturbing them." },
            { name: "Ghost in the Machine", tier: "neonate", prerequisites: "Obfuscate 1+", description: "Extends Obfuscate concealment to electronic observation." },
            { name: "Lingering Obscurement", tier: "neonate", prerequisites: "Obfuscate 2+", description: "Lets an Obfuscate effect remain after you leave its target or area." },
            { name: "Obscured Power", tier: "ancilla", prerequisites: "Obfuscate 2+; Potence 2+", description: "Trades an Obfuscate effect for a Potence-related bonus." },
            { name: "Shared Shadows", tier: "ancilla", prerequisites: "Obfuscate 3+", description: "Extends self-targeting Obfuscate effects to controlled animals." }
        ]
    },
    {
        id: "toreador",
        name: "Toreador",
        disciplineSlots: [["Auspex"], ["Celerity"], ["Presence"]],
        curse: { name: "Starved for Beauty", description: "In surroundings devoid of beauty, Power tests are penalized by the generation modifier." },
        frenzy: { name: "Obsession", description: "Frenzy fixates the vampire on a source of beauty." },
        beast: { name: "Idol", description: "The Beast craves attention, seduction, admiration, and flattery." },
        traits: [
            { name: "Addictive Kiss", tier: "neonate", prerequisites: "None", description: "Feeding can become intensely pleasurable and addictive." },
            { name: "Star Magnetism", tier: "neonate", prerequisites: "Presence 2+", description: "Allows Presence to be transmitted through a live electronic feed." },
            { name: "Throw Voice", tier: "neonate", prerequisites: "Presence 1+; Auspex 1+", description: "Projects the vampire's voice and can serve as a point for Presence." },
            { name: "Entrancing Object", tier: "ancilla", prerequisites: "Presence 3+; Auspex 1+", description: "Imbues an object with a low-rank Presence power." },
            { name: "Powerful Presence", tier: "ancilla", prerequisites: "Presence 3+", description: "Improves Presence range and number of affected targets." }
        ]
    },
    {
        id: "ventrue",
        name: "Ventrue",
        disciplineSlots: [["Dominate"], ["Fortitude"], ["Presence"]],
        curse: { name: "Rarefied Palate", description: "Only a specific type of mortal blood is truly palatable." },
        frenzy: { name: "Arrogance", description: "Frenzy pushes the Ventrue to seize command and compel obedience." },
        beast: { name: "Superior", description: "The Beast demands loyalty, obedience, and hierarchy." },
        traits: [
            { name: "Obedience", tier: "neonate", prerequisites: "Dominate 1+", description: "Broadens how Dominate can be delivered." },
            { name: "Rationalize", tier: "neonate", prerequisites: "Dominate 2+", description: "Victims rationalize actions taken under Dominate." },
            { name: "Unwavering Devotion", tier: "neonate", prerequisites: "Dominate 1+; Presence 1+", description: "Helps subjects resist similar coercion from others." },
            { name: "Commanding Leader", tier: "ancilla", prerequisites: "Fortitude 2+; Presence 2+", description: "Extends certain Fortitude effects to followers." },
            { name: "Imposing Physique", tier: "ancilla", prerequisites: "Fortitude 2+; Dominate or Presence 1+", description: "Converts Fortitude into a bonus for Presence-related tests." }
        ]
    }
];

export function getClanById(id) {
    return clans.find((clan) => clan.id === id) || null;
}

export function getClanByName(name) {
    const normalized = String(name || "").trim().toLowerCase();
    return clans.find((clan) => clan.name.toLowerCase() === normalized) || null;
}

export function resolveClanDisciplines(clan, specialChoice = "") {
    if (!clan) return [];
    return clan.disciplineSlots.map((slot) => {
        if (slot.length === 1) return slot[0];
        return slot.includes(specialChoice) ? specialChoice : slot[0];
    });
}

export function getAvailableTraits(clan) {
    return clan?.traits || [];
}

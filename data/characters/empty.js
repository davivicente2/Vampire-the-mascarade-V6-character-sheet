import { SKILL_LABELS } from "../skills.js";
import { CURRENT_SCHEMA_VERSION } from "../schema.js";

export const EMPTY_CHARACTER = {
    version: CURRENT_SCHEMA_VERSION,
    identity: {
        name: "", clan: "", apparentAge: "", actualAge: "", embraceDate: "",
        nostalgicDecade: "", generation: 0, generationModifier: 0,
        playLevel: "", archetype: "", sire: "", sireDiscipline: "", clanDisciplineChoice: "", curse: ""
    },
    attributes: {
        strength: 1, dexterity: 1, stamina: 1,
        charisma: 1, manipulation: 1, composure: 1,
        intelligence: 1, wits: 1, resolve: 1
    },
    skills: Object.fromEntries(Object.keys(SKILL_LABELS).map((key) => [key, {dots:0, focus:""}])),
    resources: [],
    disciplines: [
        {name:"", dots:0, powers:[{name:"", cost:"", reminder:""}]},
        {name:"", dots:0, powers:[{name:"", cost:"", reminder:""}]},
        {name:"", dots:0, powers:[{name:"", cost:"", reminder:""}]}
    ],
    lifepaths:[], lifepathAllocations:[], clanTraits:[],
    merits:[], merit:"", flaw:"", nature:"", beast:"", items:"",
    currentVitae:0, currentWillpower:0, quickening:0, nefariousDamage:0,
    beastPoints:0, naturePoints:0, humanityPosition:0,
    lostBeastCircles:0, lostNatureCircles:0, beastEpisode:"", natureEpisode:"", humanityFate:"",
    frenzyTrigger:"", outburstTrigger:""
};

import { clanTraitRules } from "./clan-trait-rules.js";
export const clans = [
    {
        id: "brujah",
        name: "Brujah",
        disciplineSlots: [["Celerity"], ["Potence"], ["Presence"]],
        curse: { name: "Boiling Passion", description: "Ao tentar resistir a qualquer frenesi, a Dificuldade aumenta em um valor igual ao seu modificador de geração." },
        frenzy: {"name": "Rebellion", "description": "Aja contra quem ou o que considera autoridade na cena: recuse a tarefa recebida ou sabote a figura de poder. Todas as outras ações sofrem uma penalidade de dados igual ao modificador de geração."},
        beast: {"name": "Anti-Authority", "description": "Sua Besta exige desafiar autoridades e romper as regras que prendem você.", "indulging": "Desafie líderes, desobedeça ordens, destrua símbolos de autoridade ou sabote estruturas de poder e hierarquia."},
        traits: [
            { name: "Prowess", tier: "neonate", prerequisites: "Potence 2+", requirements: [{"discipline": "Potence", "dots": 2}], description: clanTraitRules["Prowess"] },
            { name: "Spark of Rage", tier: "neonate", prerequisites: "Potence 1+; Presence 1+", requirements: [{"discipline": "Potence", "dots": 1}, {"discipline": "Presence", "dots": 1}], description: clanTraitRules["Spark of Rage"] },
            { name: "Wrestler", tier: "neonate", prerequisites: "Potence 1+", requirements: [{"discipline": "Potence", "dots": 1}], description: clanTraitRules["Wrestler"] },
            { name: "Combat Reflexes", tier: "ancilla", prerequisites: "Celerity 3+", requirements: [{"discipline": "Celerity", "dots": 3}], description: clanTraitRules["Combat Reflexes"] },
            { name: "Living Weapon", tier: "ancilla", prerequisites: "Potence 3+", requirements: [{"discipline": "Potence", "dots": 3}], description: clanTraitRules["Living Weapon"] }
        ]
    },
    {
        id: "gangrel",
        name: "Gangrel",
        disciplineSlots: [["Animalism"], ["Celerity"], ["Fortitude"]],
        curse: { name: "Embraced Beast", description: "Quando um frenesi ou Explosão da Natureza termina, ganhe características animalescas em quantidade igual ao modificador de geração até o fim da noite seguinte. Cada característica reduz um Atributo em 1, mínimo 1; aceitar o impulso (Ride the Wave) reduz a quantidade em 1." },
        frenzy: {"name": "Feral Impulses", "description": "Aja por impulso, como um animal, resolvendo obstáculos da forma mais direta possível. Testes em que não age como um animal sofrem uma penalidade igual ao modificador de geração. A penalidade é dobrada em testes de Inteligência ou Manipulação, exceto quando feitos contra animais."},
        beast: {"name": "Animalistic", "description": "Sua Besta quer viver por instinto e sentir a emoção da caça.", "indulging": "Comporte-se como um animal, corra com lobos, persiga presas como um predador e reaja instintivamente a ameaças e oportunidades."},
        traits: [
            { name: "Enduring Beasts", tier: "neonate", prerequisites: "Animalism 1+; Fortitude 1+", requirements: [{"discipline": "Animalism", "dots": 1}, {"discipline": "Fortitude", "dots": 1}], description: clanTraitRules["Enduring Beasts"] },
            { name: "Feral Whispers", tier: "neonate", prerequisites: "Animalism 1+", requirements: [{"discipline": "Animalism", "dots": 1}], description: clanTraitRules["Feral Whispers"] },
            { name: "Safety of the Earth", tier: "neonate", prerequisites: "None", requirements: [], description: clanTraitRules["Safety of the Earth"] },
            { name: "Quick and Tough", tier: "ancilla", prerequisites: "Celerity 2+; Fortitude 1+", requirements: [{"discipline": "Celerity", "dots": 2}, {"discipline": "Fortitude", "dots": 1}], description: clanTraitRules["Quick and Tough"] },
            { name: "Surrounded Prey", tier: "ancilla", prerequisites: "Animalism 3+", requirements: [{"discipline": "Animalism", "dots": 3}], description: clanTraitRules["Surrounded Prey"] }
        ]
    },
    {
        id: "lasombra",
        name: "Lasombra",
        disciplineSlots: [["Dominate"], ["Potence"], ["Corruption", "Oblivion"]],
        curse: { name: "Shadow Presence", description: "Reflexos e gravações de você aparecem distorcidos. Na primeira tentativa da noite de usar um dispositivo mais complexo que uma roldana ou cadeado, você falha a menos que passe em Inteligência ou Carisma contra Dificuldade igual ao dobro do modificador de geração; depois disso, não pode repetir esse teste para o mesmo dispositivo até a noite seguinte." },
        frenzy: {"name": "Ruthlessness", "description": "Não tolera erros ou incompetência. Ao falhar em um teste, sofre uma penalidade igual ao modificador de geração em todos os testes até obter sucesso em um teste posterior ou terminar o frenesi. Uma falha dolorosa de um aliado em distância Curta também pode impor essa penalidade; nesse caso, ela dura até você ou o aliado ter sucesso em outra tentativa da mesma ação, ou até o frenesi terminar."},
        beast: {"name": "Punisher", "description": "Sua Besta despreza o fracasso e exige punir e humilhar quem falha com você.", "indulging": "Puna quem falha nas tarefas recebidas, humilhe quem considera inferior ou castigue a si mesmo quando o erro for seu."},
        traits: [
            { name: "Eyes of the Night", tier: "neonate", prerequisites: "Oblivion 1+", requirements: [{"discipline": "Oblivion", "dots": 1}], description: clanTraitRules["Eyes of the Night"] },
            { name: "Shadow Cloak", tier: "neonate", prerequisites: "Oblivion 2+", requirements: [{"discipline": "Oblivion", "dots": 2}], description: clanTraitRules["Shadow Cloak"] },
            { name: "Tenebrous Reach", tier: "neonate", prerequisites: "Oblivion 1+", requirements: [{"discipline": "Oblivion", "dots": 1}], description: clanTraitRules["Tenebrous Reach"] },
            { name: "Night Blood", tier: "ancilla", prerequisites: "Oblivion 3+", requirements: [{"discipline": "Oblivion", "dots": 3}], description: clanTraitRules["Night Blood"] },
            { name: "Oppressing Dominance", tier: "ancilla", prerequisites: "Dominate 2+; Oblivion or Corruption 1+", requirements: [{"discipline": "Dominate", "dots": 2}, {"any": [{"discipline": "Oblivion", "dots": 1}, {"discipline": "Corruption", "dots": 1}]}], description: clanTraitRules["Oppressing Dominance"] }
        ]
    },
    {
        id: "ministry",
        name: "Ministry",
        disciplineSlots: [["Corruption"], ["Obfuscate"], ["Presence"]],
        curse: { name: "Sunlight Bane", description: "Sob exposição direta a luz intensa, inclusive artificial, sofra uma penalidade de dados igual ao modificador de geração em todos os testes. Dano Nefasto causado por luz solar aumenta em valor igual ao modificador de geração." },
        frenzy: {"name": "Transgression", "description": "Sinta a necessidade incontrolável de levar outros a desejos degradantes, vícios, egoísmo ou prazeres hedonistas. Todos os testes que não busquem corromper alguém dessa forma sofrem uma penalidade igual ao modificador de geração."},
        beast: {"name": "Enticer", "description": "Sua Besta se satisfaz corrompendo outros e despertando desejos reprimidos.", "indulging": "Entregue-se a prazeres hedonistas, incentive outras pessoas a fazer o mesmo e ajude-as a descobrir seus desejos secretos."},
        traits: [
            { name: "Beguiling Words", tier: "neonate", prerequisites: "Corruption 1+", requirements: [{"discipline": "Corruption", "dots": 1}], description: clanTraitRules["Beguiling Words"] },
            { name: "Eyes of the Serpent", tier: "neonate", prerequisites: "Presence 1+", requirements: [{"discipline": "Presence", "dots": 1}], description: clanTraitRules["Eyes of the Serpent"] },
            { name: "Serpent Speech", tier: "neonate", prerequisites: "Corruption 1+", requirements: [{"discipline": "Corruption", "dots": 1}], description: clanTraitRules["Serpent Speech"] },
            { name: "Heart of Darkness", tier: "ancilla", prerequisites: "Ancilla or stronger", requirements: [], description: clanTraitRules["Heart of Darkness"] },
            { name: "Divine Image", tier: "ancilla", prerequisites: "Corruption 1+; Presence 1+", requirements: [{"discipline": "Corruption", "dots": 1}, {"discipline": "Presence", "dots": 1}], description: clanTraitRules["Divine Image"] }
        ]
    },
    {
        id: "nosferatu",
        name: "Nosferatu",
        disciplineSlots: [["Animalism"], ["Obfuscate"], ["Potence"]],
        curse: { name: "External Beast", description: "Contra mortais, testes sociais que não busquem assustar, coagir ou afirmar domínio sofrem penalidade igual ao modificador de geração. Contra vampiros, a penalidade só se aplica quando sua aparência prejudica a interação." },
        frenzy: {"name": "Cryptophilia", "description": "Busque desesperadamente segredos e conhecimento, por menores que sejam. Todas as outras ações sofrem uma penalidade igual ao dobro do modificador de geração. O frenesi pode terminar antes se descobrir um segredo importante para a cena, como uma informação que dê vantagem sobre alguém presente."},
        beast: {"name": "Secretive", "description": "Sua Besta deseja acumular segredos e conhecimento para usá-los quando precisar.", "indulging": "Descubra segredos alheios, esconda informações e use o que sabe contra os outros."},
        traits: [
            { name: "Feral Whispers", tier: "neonate", prerequisites: "Animalism 1+", requirements: [{"discipline": "Animalism", "dots": 1}], description: clanTraitRules["Feral Whispers"] },
            { name: "Ghost in the Machine", tier: "neonate", prerequisites: "Obfuscate 1+", requirements: [{"discipline": "Obfuscate", "dots": 1}], description: clanTraitRules["Ghost in the Machine"] },
            { name: "Lingering Obscurement", tier: "neonate", prerequisites: "Obfuscate 2+", requirements: [{"discipline": "Obfuscate", "dots": 2}], description: clanTraitRules["Lingering Obscurement"] },
            { name: "Obscured Power", tier: "ancilla", prerequisites: "Obfuscate 2+; Potence 2+", requirements: [{"discipline": "Obfuscate", "dots": 2}, {"discipline": "Potence", "dots": 2}], description: clanTraitRules["Obscured Power"] },
            { name: "Shared Shadows", tier: "ancilla", prerequisites: "Obfuscate 3+", requirements: [{"discipline": "Obfuscate", "dots": 3}], description: clanTraitRules["Shared Shadows"] }
        ]
    },
    {
        id: "toreador",
        name: "Toreador",
        disciplineSlots: [["Auspex"], ["Celerity"], ["Presence"]],
        curse: { name: "Starved for Beauty", description: "Em ambientes que o Narrador considere desprovidos de beleza, todos os testes de Poder sofrem penalidade de dados igual ao modificador de geração." },
        frenzy: {"name": "Obsession", "description": "Escolha algo belo da cena, como uma pessoa, música, obra de arte ou um padrão de sangue. Quase não consegue desviar o olhar e só fala desse assunto. Testes que não envolvam apreciar, elogiar ou proteger o objeto sofrem uma penalidade igual ao modificador de geração. O frenesi pode terminar antes se o objeto for destruído ou sair da cena e da sua percepção."},
        beast: {"name": "Idol", "description": "Sua Besta exige adoração e quer que os outros se encantem com sua presença.", "indulging": "Seduza outras pessoas, faça-as implorar por sua atenção e deleite-se com sua bajulação."},
        traits: [
            { name: "Addictive Kiss", tier: "neonate", prerequisites: "None", requirements: [], description: clanTraitRules["Addictive Kiss"] },
            { name: "Star Magnetism", tier: "neonate", prerequisites: "Presence 2+", requirements: [{"discipline": "Presence", "dots": 2}], description: clanTraitRules["Star Magnetism"] },
            { name: "Throw Voice", tier: "neonate", prerequisites: "Presence 1+; Auspex 1+", requirements: [{"discipline": "Presence", "dots": 1}, {"discipline": "Auspex", "dots": 1}], description: clanTraitRules["Throw Voice"] },
            { name: "Entrancing Object", tier: "ancilla", prerequisites: "Presence 3+; Auspex 1+", requirements: [{"discipline": "Presence", "dots": 3}, {"discipline": "Auspex", "dots": 1}], description: clanTraitRules["Entrancing Object"] },
            { name: "Powerful Presence", tier: "ancilla", prerequisites: "Presence 3+", requirements: [{"discipline": "Presence", "dots": 3}], description: clanTraitRules["Powerful Presence"] }
        ]
    },
    {
        id: "ventrue",
        name: "Ventrue",
        disciplineSlots: [["Dominate"], ["Fortitude"], ["Presence"]],
        curse: { name: "Rarefied Palate", description: "Escolha um tipo específico de mortal cujo sangue seja palatável. Pelo odor natural ou sangue, você reconhece se pertence ao tipo. Ao beber sangue incompatível, faça Autocontrole contra Dificuldade igual ao dobro do modificador de geração: sucesso recupera apenas 1 Vitae a cada 3 ingeridas; falha faz você vomitar e não obter benefício." },
        frenzy: {"name": "Arrogance", "description": "Busque assumir o comando e fazer alguém obedecer a uma ordem sua, sem imposição sobrenatural como Dominate. Todas as outras ações sofrem uma penalidade igual ao dobro do modificador de geração. O frenesi pode terminar antes se alguém que não seja seu aliado obedecer sem influência sobrenatural."},
        beast: {"name": "Superior", "description": "Sua Besta considera seu sangue superior e exige lealdade e submissão.", "indulging": "Aja com superioridade, faça os outros obedecerem e estabeleça uma hierarquia em que sua voz comanda."},
        traits: [
            { name: "Obedience", tier: "neonate", prerequisites: "Dominate 1+", requirements: [{"discipline": "Dominate", "dots": 1}], description: clanTraitRules["Obedience"] },
            { name: "Rationalize", tier: "neonate", prerequisites: "Dominate 2+", requirements: [{"discipline": "Dominate", "dots": 2}], description: clanTraitRules["Rationalize"] },
            { name: "Unwavering Devotion", tier: "neonate", prerequisites: "Dominate 1+; Presence 1+", requirements: [{"discipline": "Dominate", "dots": 1}, {"discipline": "Presence", "dots": 1}], description: clanTraitRules["Unwavering Devotion"] },
            { name: "Commanding Leader", tier: "ancilla", prerequisites: "Fortitude 2+; Presence 2+", requirements: [{"discipline": "Fortitude", "dots": 2}, {"discipline": "Presence", "dots": 2}], description: clanTraitRules["Commanding Leader"] },
            { name: "Imposing Physique", tier: "ancilla", prerequisites: "Fortitude 2+; Dominate or Presence 1+", requirements: [{"discipline": "Fortitude", "dots": 2}, {"any": [{"discipline": "Dominate", "dots": 1}, {"discipline": "Presence", "dots": 1}]}], description: clanTraitRules["Imposing Physique"] }
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

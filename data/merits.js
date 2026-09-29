// Resumos em português do Chapter 2 e do Player Packet fornecidos pelo usuário.
// Os nomes originais são mantidos para compatibilidade com as fichas salvas.
export const merits = [
    {
        name: "Bond Famulus",
        prerequisites: "Duskborn ou vampiro; Animalism 1+.",
        requirements: [{"discipline": "Animalism", "dots": 1}],
        description: "Transforme um animal que já seja seu ghoul em um famulus: o vínculo exige pelo menos 1 hora e 3 Vitae. O nível de NPC inicial não pode superar seus pontos em Animalism. O famulus ganha seu modificador de geração em nível de NPC (limitado ao dobro de Animalism) e sobe uma categoria. Seus poderes de Animalism custam 1 a menos sobre ele, até o mínimo de 0. Você pode manter um famulus. Com Animalism 5+, pode manter dois, e a redução de custo passa a ser igual ao modificador de geração. Se o famulus morrer ou o vínculo acabar, você perde Força de Vontade igual a Animalism e só pode criar outro vínculo na noite seguinte."
    },
    {
        name: "Bond Resistant",
        description: "+1 dado para resistir aos efeitos de um Laço de Sangue, inclusive às ordens do mestre.",
        activation: "Como reação ao beber pela primeira vez a Vitae de um vampiro, impeça que essa ingestão forme um Laço de Sangue."
    },
    {
        name: "Chain the Psyche",
        prerequisites: "Dominate 2+.",
        requirements: [{"discipline": "Dominate", "dots": 2}],
        description: "Um alvo sob seus poderes de Dominate que tente desobedecer, ou recuperar memórias que você alterou, sente dor e sofre −1 dado em testes que não sejam para cumprir sua ordem. Com Dominate 5+, a penalidade passa a −2 dados."
    },
    {
        name: "Code of Honor",
        description: "Defina seu código pessoal com o Narrador. Receba +1 dado em testes de Autocontrole (Self Control) quando esse código ajudar a manter a calma.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Enchanting Presence",
        prerequisites: "Duskborn ou vampiro; Presence 2+.",
        requirements: [{"discipline": "Presence", "dots": 2}],
        description: "Mortais sofrem −1 dado para resistir aos seus poderes de Presence. Com Presence 5+, a penalidade passa a −2 dados. Se você for Ancilla ou mais poderoso, o efeito também se aplica a criaturas sobrenaturais."
    },
    {
        name: "Fleetness",
        prerequisites: "Celerity 1+.",
        requirements: [{"discipline": "Celerity", "dots": 1}],
        description: "Receba um bônus igual aos seus pontos em Celerity em testes de Destreza fora de conflitos.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Flexible Limbs",
        description: "+1 dado em testes nos quais sua flexibilidade ajude a se mover ou escapar, como passar por espaços apertados ou se livrar de amarras.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Forgettable Face",
        description: "Sua aparência comum é fácil de esquecer, salvo se você exibir algo marcante. Receba +1 dado em Subterfúgio para se misturar à multidão ou passar despercebido em um grupo.",
        activation: "Use uma ação menor para que um alvo visível a distância Média ignore você pelo restante da cena, até que você deliberadamente chame sua atenção, por exemplo gritando com ele ou o atingindo."
    },
    {
        name: "Friends in High Places",
        description: "+1 dado em testes sociais com a elite, inclusive ataques em conflitos sociais. O bônus também se aplica ao usar suas conexões para obter informações ou acesso a locais restritos.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico. Não se aplica a ataques sociais."
    },
    {
        name: "Hunger Strength",
        prerequisites: "Duskborn ou vampiro.",
        requirements: [],
        requirements: [],
        description: "Com 5 Vitae ou menos, receba +1 dado em testes de Força, inclusive durante conflitos físicos.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Intimidating Presence",
        description: "+1 dado em testes para intimidar ou inquietar outras pessoas, desde que o alvo possa ver você.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Might",
        prerequisites: "Potence 1+.",
        requirements: [{"discipline": "Potence", "dots": 1}],
        description: "Receba um bônus igual aos seus pontos em Potence em testes de Força fora de conflitos.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Prestigious Sire",
        description: "Escolha a seita ou o clã que valoriza seu Sire (ou mestre, para ghouls). Receba +1 dado em testes sociais com esse grupo quando a reputação dele favorecer você. A critério do Narrador, a mesma reputação pode causar −1 dado ao lidar com um grupo rival.",
        activation: "Como reação ao fazer um teste favorecido por essa reputação, obtenha um sucesso básico."
    },
    {
        name: "Subdued Hunger",
        prerequisites: "Duskborn ou vampiro.",
        requirements: [],
        requirements: [],
        description: "+1 dado em testes de Autocontrole (Self Control) para resistir a entrar em frenesi de fome.",
        activation: "Como reação ao fazer um desses testes, obtenha um sucesso básico."
    },
    {
        name: "Tough Skin",
        prerequisites: "Possuir um modificador de geração; Vigor (Stamina) 5+.",
        requirements: [{"attribute": "stamina", "dots": 5}, {"generationModifier": 1}],
        description: "Seu modificador de geração conta como 1 ponto maior ao calcular o dano recebido. Essa redução não se aplica a Dano Nefasto (baneful damage)."
    },
    {
        name: "Wrecker",
        prerequisites: "Potence 2+.",
        requirements: [{"discipline": "Potence", "dots": 2}],
        description: "Ao fazer um teste de ataque corpo a corpo contra um objeto inanimado, receba um bônus igual aos seus pontos em Potence."
    }
];

export function getMerit(value) {
    const name = String(value || "").split(" — ")[0].trim().toLowerCase();
    return merits.find((merit) => merit.name.toLowerCase() === name) || null;
}

export function meritHelp(merit) {
    if (!merit) return "";
    return [
        "Pré-requisitos: " + (merit.prerequisites || "Nenhum."),
        merit.description,
        merit.activation ? "Ativação: " + merit.activation : "",
        merit.activation
            ? "Após usar a ativação, o mérito fica inativo e perde todos os efeitos até a próxima noite."
            : ""
    ].filter(Boolean).join("\n\n");
}

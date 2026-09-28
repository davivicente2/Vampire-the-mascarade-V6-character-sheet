import { tierRules } from "./tiers.js";

// Consulta resumida do Chapter 4 fornecido pelo usuário; não aplica efeitos.
export const rulesReference = [
    ['Testes e resultados', [
        'Teste comum: Atributo + Habilidade − Dificuldade. Poder: Atributo + Disciplina − Dificuldade. Autocontrole: Autocontrole (Composure) + Determinação − Dificuldade. A parada nunca fica abaixo de 0.',
        'Cada d10 com 8+ é um sucesso; cada 10 concede 1 Quickening. Sem sucesso e com pelo menos um 1: falha dolorosa. Sem sucesso nem 1: falha comum.',
        'Sem dados: aceite a falha (ganhe 1 Quickening; Narrador ganha 1 Drama), procure vantagens ou ajude alguém. Não vale fabricar tentativas sem risco para acumular Quickening.',
        'Escolha sua Dor: perca 3 Vitae ou Vontade, perca todo Quickening (se tiver algum), marque 1 Besta ou conceda 1 Drama. Escolha apenas custos que possa pagar, ou combine outra complicação com o Narrador.',
        'Pacto com o Diabo: uma vez por cena, após falha comum, proponha uma complicação e conceda 1 Drama para obter sucesso básico. Não vale para falha dolorosa. O Narrador gasta 1 Drama para rejeitar.',
        'Uma nova tentativa exige abordagem diferente (outro Atributo ou Habilidade), dificuldade +1 e transforma falha em falha dolorosa. Só é permitida uma repetição.'
    ]],
    ['Turnos, ações e distâncias', [
        'Ordem de turno: Raciocínio (Wits), do maior para o menor; jogadores empatados agem juntos e NPCs empatados agem depois. No turno: movimento, uma ação e uma ação menor. Entre turnos: reações iguais a Wits, recuperadas no início do próximo turno.',
        'Perto (Close): cerca de 2 m. Curta: 5–15 m. Média: 15–50 m. Longa: 50–100 m. Muito longe: 100+ m.',
        'Em conflito, mova-se até Curta e aja, ou abra mão da ação para chegar a Média. Longa exige pelo menos dois turnos completos. Movimento pode ser trocado por levantar/deitar, tarefa mundana de ação menor ou mirar (+1 dado no próximo ataque à distância).',
        'Ajudar: em geral +1 dado por aliado, até três aliados; sem treinamento, explique como ajuda. Todos compartilham consequências e a falha do ajudado é dolorosa.',
        'Coordenar: Inteligência ou Wits + Percepção, contra a maior Inteligência/nível de NPC inimigo em Curta. Distribua um dado por sucesso a aliados em Curta para a próxima ação ofensiva antes do seu próximo turno; só repita um aliado depois de todos receberem um.',
        'Desmoralizar: Carisma + Persuasão contra Autocontrole/nível do alvo. Cada sucesso concede +1 dado à defesa contra a próxima ação ofensiva desse alvo antes do seu próximo turno.'
    ]],
    ['Conflito, dano e recuperação', [
        'Corpo a corpo: Força + Briga em Perto. À distância: Destreza + Tiro. Dificuldade: nível do NPC ou Destreza de outro jogador. Dano: arma + sucessos além do primeiro. Tiro em Perto: dificuldade +1; uma faixa além do alcance da arma: +2.',
        'Dano comum em Vitae: reduza pelo modificador de geração, mínimo de 1 dano. Tough Skin conta o modificador como 1 maior. Gastos de Vitae não são dano. Dano em Vontade não recebe essa redução.',
        'Dano Nefasto bloqueia caixas de Vitae, da direita para a esquerda, e não é reduzido pela geração. Todas as caixas bloqueadas significam Morte Final. Um único golpe igual ao máximo de Vitae pode destruir o vampiro por dano massivo.',
        'Curar Dano Nefasto: uma vez por noite, após a noite em que ocorreu, gaste 5 Vitae e 1 Vontade para desbloquear uma caixa. Se não tiver capacidade para 5 Vitae, pode gastar enquanto se alimenta de fonte com pelo menos 5.',
        'Vontade 0 exige resistir a frenesi de fúria ou aceitá-lo. Com 3 ou menos, uma falha dolorosa também pode desencadeá-lo. Dificuldade base 2, modificada pela situação.',
        'Recupere Vontade por conquistas (1–3, Narrador), matar um humano ao drená-lo (1), aceitar um frenesi (2 ao terminar), ou voluntariamente agitar Besta/Natureza (marque uma caixa e recupere 1). Marcas recebidas por outros motivos não recuperam Vontade.'
    ]],
    ['Quickening, fome e despertar', [
        'Quickening vai de 0 a 5; cada ganho excedente marca Besta ou Natureza, à escolha do jogador. Começa e termina a sessão em 0; o Narrador pode permitir início com 2 em cenas tensas.',
        'Antes da rolagem: 1 Quickening por dado extra, 3 para sucesso básico com Habilidade treinada, 5 sem treinamento. Aliados que se veem ou ouvem podem colaborar no custo; o gasto deve ser definido antes de rolar.',
        '11+ Vitae: +1 dado para resistir a frenesi/Explosão e em Poderes de Disciplinas do Clã. 6–10: ganhe 1 Quickening ao entrar na faixa e no início das cenas seguintes. 1–5: ganhe 2 nas mesmas condições.',
        'Com 1–5 Vitae, sangue fresco em Curta ou vítima indefesa pode exigir resistência ao frenesi de fome: dificuldade 6 − Vitae atual. Torpor (0) zera Quickening, impede ganhos e uso de Disciplinas. Alimentar alguém em torpor exige Autocontrole, dificuldade 5, para evitar frenesi ao despertar (Narrador pode reduzir).',
        'Despertar custa 1 Vitae e marca 1 Besta e 1 Natureza. Com apenas 1 Vitae, teste Autocontrole, dificuldade 2 + geração: sucesso mantém a última Vitae e gasta Vontade igual à geração; falha ou Vontade insuficiente resulta em torpor. Após sucesso, ganhe e gaste pelo menos 1 Vitae antes do fim da noite ou entrará em torpor no próximo sono.'
    ]],
    ['Alimentação', [
        'Em conflito, agarrar e morder permite alimentação; sob pressão, beba até sua Força em Vitae por turno, sempre ferindo a vítima.',
        'Animais drenados: minúsculo 1, pequeno 2, médio 3, grande 5 Vitae. Beber mais da metade causa morte em poucas horas sem atendimento. Bolsa de sangue recente, sem separação de componentes: 1 Vitae.',
        'Humano adulto saudável: até 10 Vitae. Deixar 7–9 não ameaça a vida, mas abaixo de 9 causa fraqueza por cerca de uma semana. Deixar 4–6 exige tratamento em poucos dias; coloque 1 Besta se conscientemente arriscou a vida.',
        'Deixar 1–3 exige hospitalização em poucas horas; marque mais 1 Besta se não garantir socorro. Drenar até 0 mata, recupera 1 Vontade e marca mais 1 Besta, cumulativo com as faixas anteriores.',
        'Beber de outro vampiro transfere Vitae diretamente; deixá-lo em 0 causa torpor. Consumir sua essência por pelo menos 10 minutos é diablerie, com regras próprias de evolução.'
    ]],
    ['Laço de Sangue', [
        'Vitae com menos de 1 hora, pelo menos um frasco (~5 ml), em três ocasiões separadas forma o laço completo. 1 Vitae produz até cinco frascos. Duskborn não vinculam vampiros de sangue pleno, mas podem vincular mortais e Duskborn.',
        'Estágio 1: −1 dado para agir contra ordens/vontade direta do mestre; mestre ganha +1 para influenciar. Estágio 2: ±2; voz presencial substitui visão/contato visual exigidos por poderes. Estágio 3: ±3 e poderes podem alcançar o servo por dispositivos eletrônicos.',
        'Intervalo entre ingestões para avançar: neonatos/Duskborn 1 mês, Ancilla 6 meses, Elder 1 ano, Matusalém 100 anos. Ultrapassar esse intervalo sem beber reduz o vínculo em um estágio; no estágio 1, rompe o laço.',
        'Pode haver múltiplos laços, mas apenas um no estágio 3. Vinculum da Vaulderie é separado, sem estágios: −2 dados ao agir contra o bando ou outro participante vinculado.'
    ]],
    ['Blood Surge e Blush of Life', [
        'Blood Surge: ação menor, ou reação ao testar/iniciar cena. Gaste 1 Vitae por +1 Atributo ou 2 Vitae por +1 Disciplina, até o fim da cena. Cada característica aumentada exige custo e ação próprios.',
        'Aumentar Vigor, Autocontrole ou Determinação assim não altera Vitae/Vontade atuais nem máximas. Aumentar Disciplina não ensina poderes novos, mas fortalece efeitos e permite aspectos Maturing de poderes conhecidos.',
        "Limite do bônus de Atributo por tier: Neonate +2, Ancilla +4, Elder +6. Disciplinas durante o jogo (Clã/fora do Clã): " + Object.values(tierRules).map((tier) => tier.label + " " + tier.inPlay.clanDisciplineMax + "/" + tier.inPlay.nonClanDisciplineMax).join(", ") + ". Limites gerais de criação: " + Object.values(tierRules).map((tier) => tier.label + " " + tier.creation.maxDots).join(", ") + ". São limites de etapas diferentes.",
        'Blush of Life: ação menor e 1 Vitae, duração até o fim da noite ou encerramento voluntário. Simula vida, permite telas sensíveis ao toque e pequenas porções de comida/bebida sem sustento. Consulte os efeitos de Humanidade para exceções.'
    ]],
    ['Condições', [
        'Condições diferentes acumulam efeitos. Em geral, uma condição não se acumula consigo mesma. Não poder agir inclui ações menores e reações.',
        'Emotional: −1 em ações e poderes sociais/mentais; nova aplicação vira Greater Emotional. Greater Emotional: −2 sociais/mentais, −1 físicos; poderes sociais/mentais custam +1 Vontade.',
        'Tired: −1 em ações/poderes físicos. Exhausted: −2 físicos, −1 ações sociais e poderes sociais/mentais; poderes físicos custam +1 Vitae.',
        'Held: não se move; −1 em ações físicas e testes de Poder físicos. Immobilized: não se move; −2 nos físicos (incluindo defesa) e −1 nos demais testes. Mangled: −2 em testes que usem o membro lesionado.',
        'Paralyzed: não se move nem fala; sem ações físicas ou outras que exijam movimento/fala. Poderes sociais/mentais que ainda possa usar custam +2 Vontade. Ataques físicos contra você têm dificuldade base 0.',
        'Prone: gaste movimento para levantar; −1 para defender corpo a corpo e +1 contra ataques à distância. Surprised: sem movimento/ações e −2 em todos os testes, inclusive defesa.',
        'Scared: −1 ofensivo contra a fonte e +1 para escapar/esconder-se; repetição vira Terrified. Terrified: sem ofensivas contra a fonte; +2 para escapar/esconder-se; não termine o turno mais perto que Média, salvo se impossível.'
    ]],
    ['Humanidade e downtime', [
        'Rastreadores cheios: Autocontrole, dificuldade 3 + geração. Sucesso apaga 1 caixa; falha limpa o rastreador e inicia Frenesi da Besta ou Explosão. Falha dolorosa também concede 1 Drama, além da Escolha sua Dor. Ao terminar o episódio, mova um passo para o lado correspondente.',
        'Atividade alinhada de pelo menos 10 minutos ou uma cena, com complicação, apaga 1 caixa. Uma vez por sessão, com o rastreador vazio, uma atividade alinhada pode mover um passo; não pode levar ao estágio 3. Esse estágio exige Frenesi da Besta ou Explosão.',
        'Ultrapassar um extremo 3 remove permanentemente um círculo do lado oposto. Se esse lado já não tiver círculos, a jornada termina (Wight ou afastamento). Para recuperar: chegue ao último círculo restante do lado perdido e cumpra uma nova condição de movimento nessa direção; recupere o círculo sem avançar nele.',
        'Entre histórias, normalmente duas ações de downtime (ajustadas pelo Narrador): adquirir informação; aumentar/adquirir Recurso em 1 ponto; conectar-se à Natureza ou alimentar a Besta (apague até 3 marcas); ritual; realocar até 3 pontos de Recursos; recuperar gastos de um Recurso ou até 3 pontos distribuídos; trabalhar em projeto.'
    ]]
];

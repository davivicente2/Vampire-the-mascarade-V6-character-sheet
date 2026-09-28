import { tierLevels as levels, tierLabels as labels } from "./tiers.js";

// Chapter 2: caminhos e benefícios fornecidos pelo usuário.
export const lifepaths = [
    { name: 'Artist', tier: 'mortal', description: 'Escritor, ator, pintor, designer ou outro profissional criativo.', skills: ['Percepção', 'Ofício', 'Expressão (escolha uma arte)', 'Conhecimento (Arte)', 'Persuasão'], resources: ['Riqueza', 'Contatos: negociante de arte', 'Aliado: patrono'] },
    { name: 'Corporate Executive', tier: 'mortal', description: 'Executivo que domina negociações, disputas de poder e decisões no mundo corporativo.', skills: ['Percepção', 'Investigação (Fofocas)', 'Conhecimento (Negócios)', 'Persuasão', 'Subterfúgio (Enganação)'], resources: ['Riqueza', 'Propriedade', 'Refúgio'] },
    { name: 'Criminal', tier: 'mortal', description: 'Viveu de infringir a lei, sozinho ou ligado ao crime organizado.', skills: ['Atletismo (Corrida)', 'Percepção', 'Briga (Luta suja)', 'Sabotagem (Arrombamento)', 'Subterfúgio'], resources: ['Contatos: receptador', 'Riqueza', 'Máscara'] },
    { name: 'Holy Person', tier: 'mortal', description: 'Dedicou parte da vida ao estudo e à divulgação de uma religião ou fé.', skills: ['Percepção', 'Expressão (Oratória)', 'Conhecimento (Religião)', 'Medicina', 'Persuasão'], resources: ['Contatos: igreja local', 'Status mortal: membro da igreja', 'Riqueza'] },
    { name: 'Hunter', tier: 'mortal', description: 'Rastreou presas, preparou armadilhas e aprendeu a sobreviver onde caçava.', skills: ['Percepção', 'Ofício (Armadilhas)', 'Briga', 'Tiro', 'Sobrevivência (Caça em ambiente selvagem)'], resources: ['Refúgio', 'Aliado: outro caçador', 'Repositório: arsenal'] },
    { name: 'Military', tier: 'mortal', description: 'Serviu nas forças armadas e recebeu treinamento em guerra e sobrevivência.', skills: ['Atletismo', 'Briga', 'Medicina (Primeiros socorros)', 'Tiro (Armas pesadas)', 'Sobrevivência'], resources: ['Repositório: armas', 'Contatos: militares', 'Aliado: antigos companheiros'] },
    { name: 'Politician', tier: 'mortal', description: 'Atuou na política, negociando acordos e disputando a atenção pública.', skills: ['Percepção (Discernimento)', 'Investigação', 'Conhecimento (Política)', 'Persuasão (Negociação)', 'Subterfúgio (Enganação)'], resources: ['Riqueza', 'Status: político', 'Refúgio'] },
    { name: 'Technician', tier: 'mortal', description: 'Usou ferramentas e soluções práticas para criar, consertar e desmontar coisas.', skills: ['Atletismo', 'Ofício (Improvisação)', 'Briga', 'Sabotagem (Sistemas de segurança)', 'Subterfúgio'], resources: ['Veículo', 'Repositório: ferramentas', 'Refúgio'] },
    { name: 'Blood Deliverer', tier: 'neonate', description: 'Obteve e entregou sangue para outros vampiros, por lucro, obrigação ou promessa de prestígio.', skills: ['Atletismo', 'Percepção', 'Persuasão', 'Sabotagem', 'Subterfúgio (Furtividade)'], resources: ['Veículo', 'Riqueza', 'Contatos'] },
    { name: 'Clean Up Crew', tier: 'neonate', description: 'Fez desaparecer os problemas e vestígios deixados por outros vampiros, recebendo dinheiro ou favores.', skills: ['Atletismo', 'Briga', 'Investigação (Cena de crime)', 'Sabotagem', 'Subterfúgio'], resources: ['Contatos: autoridade vampírica', 'Veículo', 'Repositório: materiais de limpeza'] },
    { name: 'Hound', tier: 'neonate', description: 'Foi o braço armado da autoridade vampírica local. Também representa Sweeper ou Ductus.', skills: ['Briga', 'Investigação (Conhecimento das ruas)', 'Tiro', 'Subterfúgio', 'Sobrevivência (Rastreamento urbano)'], resources: ['Status: seita', 'Repositório: arsenal', 'Contatos: autoridade vampírica'] },
    { name: 'Diplomat', tier: 'ancilla', description: 'Representou sua seita em outros domínios e negociou com facções rivais. Também representa Emissary ou Herald.', skills: ['Percepção (Empatia)', 'Expressão (Oratória)', 'Investigação', 'Persuasão (Confraternização ou Negociação)', 'Subterfúgio'], resources: ['Refúgio', 'Status: seita', 'Máscaras'] },
    { name: 'Harpy', tier: 'ancilla', description: 'Influenciou a sociedade vampírica, controlando reputações, segredos e registros de favores.', skills: ['Percepção', 'Expressão', 'Conhecimento (Sociedade vampírica)', 'Persuasão', 'Subterfúgio (Enganação)'], resources: ['Refúgio', 'Status: seita', 'Aliados'] },
    { name: 'Sheriff', tier: 'ancilla', description: 'Impôs as leis da sociedade vampírica e puniu seus infratores. Também representa Warlord.', skills: ['Percepção (Discernimento)', 'Investigação', 'Conhecimento (Política vampírica)', 'Persuasão (Intimidação)', 'Sobrevivência (Rastreamento urbano)'], resources: ['Aliado: Hound/Sweeper', 'Repositório: arsenal', 'Status: seita'] }
];

export function getLifepath(value) {
    const name = String(value || '').split(' — ')[0].replace(/\s*\((Neonate|Ancilla)\)$/i, '').trim().toLowerCase();
    return lifepaths.find((path) => path.name.toLowerCase() === name) || null;
}

export function lifepathRequirement(path, tier) {
    if (!path || path.tier === 'mortal') return '';
    if (!levels[tier]) return 'Defina o tier e confirme a elegibilidade com o Narrador.';
    return levels[tier] < levels[path.tier]
        ? 'Requer ' + labels[path.tier] + ' ou superior; não está disponível para ' + labels[tier] + '.'
        : '';
}

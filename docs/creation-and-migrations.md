# Criação por tier e migração

`data/tiers.js` é a fonte dos orçamentos de criação de vampiros. `creation` e `inPlay` são configurações separadas; os avisos da ficha conferem a criação, sem impor limites de avanço durante o jogo.

| Criação | Neonate | Ancilla | Elder |
| --- | --- | --- | --- |
| Caminhos de Vida | 2 | 3 | 4 |
| Grupos de Atributos, além do ponto inicial | 7/5/3 | 8/6/4 | 9/7/5 |
| Disciplinas, incluindo o Sire | 3 + 1 | 5 + 1 | 7 + 1 |
| Poderes | 4 | 6 | 8 |
| Méritos | 1 | 2 | 3 |
| Traços de Clã | 2 | 3 | 4 |
| Habilidades adicionais | 8 | 8 | 8 |
| Recursos adicionais | 3 | 5 | 7 |
| Máximo geral na criação | 5 | 6 | 8 |
| Disciplinas em jogo: Clã/fora do Clã | 5/3 | 7/5 | 8/7 |

Cada Caminho concede 5 pontos de Habilidade e 3 de Recursos. Com o número normal de Caminhos, os totais são 18/23/28 em Habilidades e 9/14/19 em Recursos. O capítulo 2 estabelece uma exceção ao máximo geral: nenhuma Habilidade pode superar 3 na criação; seus focos e controles de jogo continuam disponíveis até 5.

## Preservação dos dados

A normalização deixa de reduzir dots ao máximo do tier. Ela preserva valores e listas existentes; os controles oferecem o máximo do tier e os dots maiores já registrados. Ao reduzir o tier, aparecem avisos para valores e escolhas excedentes. Recuperar o tier ou recarregar não apaga dados. Apenas slots finais vazios podem ficar fora da visualização; continuam no JSON.

Contadores dos Caminhos editam as ocorrências em `lifepathAllocations`, mantendo o formato anterior. Eles param em 5/3. Cada alteração na distribuição de Habilidades atualiza seus pontos finais e a calculadora. Recursos finais continuam manuais. Uma distribuição importada fora do catálogo ou acima do orçamento permanece disponível para correção manual. Trocar o Caminho explicitamente remove apenas suas alocações incompatíveis.

### Sincronização de Habilidades

- O total de uma Habilidade é a soma dos pontos distribuídos nos Caminhos com os pontos adicionais. Editar um Caminho preserva esses pontos adicionais e os focos pessoais.
- Na seção Habilidades, os controles editam o total respeitando o mínimo já concedido pelos Caminhos. Para retirar pontos dessa origem, edite o Caminho correspondente. A origem aparece junto do nome da Habilidade.
- Novas alocações respeitam o limite de 3 na criação, considerando o total de todos os Caminhos e os pontos adicionais. Valores importados maiores não são reduzidos.
- Em fichas antigas, os valores finais são considerados como já incluindo as alocações. Se o total estiver abaixo da contribuição dos Caminhos, ele é completado até essa contribuição; pontos existentes não são somados novamente. Essa convenção evita duplicação, pois o formato antigo não indicava se a distribuição já havia sido aplicada.
- A normalização é idempotente: recarregar ou importar novamente não reaplica pontos.
- As opções do catálogo são associadas às Habilidades pelo nome, separando a indicação de foco entre parênteses. Focos não são preenchidos automaticamente. Opções desconhecidas são preservadas, sem atribuir pontos a uma Habilidade presumida.
- Alocações importadas sem um Caminho reconhecido continuam visíveis para correção, inclusive para retirar pontos que já contribuam para Habilidades.
- Distribuições completas se recolhem, mostrando total e escolhas no resumo; podem ser reabertas para edição. Distribuições incompletas ou incompatíveis abrem por padrão. O estado de abertura é apenas de interface, não é exportado no JSON.

A exceção de personagem jovem continua possível deixando os demais Caminhos vazios. Os bônus opcionais de compensação dependem da decisão do Narrador; não são aplicados nem presumidos na validação dos totais.

## Schema e migrações

- `data/schema.js` declara `CURRENT_SCHEMA_VERSION`.
- `js/model/migrations.js` aplica as migrações sequenciais sobre uma cópia do objeto.
- Fichas sem versão são tratadas como versão 1; as migrações seguem sequencialmente até o schema atual.
- Na migração 2 → 3, `merit: "X"` cria `merits: ["X"]`. O campo singular original continua no JSON. Se o primeiro Mérito for editado, o campo singular acompanha essa escolha para compatibilidade.
- `merits[]` passa a ser a fonte da interface. A normalização completa slots vazios conforme o tier, sem truncar listas maiores.
- Versões futuras e estruturas inválidas de `merits` são rejeitadas antes de substituir o salvamento na importação.

Abrir a ficha sem salvamento usa `EMPTY_CHARACTER`, sem Recursos iniciais. O exemplo permanece em `data/characters/example.js` somente para desenvolvimento e testes. A abertura não grava nada no localStorage; importação válida ou edição salva os dados no schema atual.

## Frenesi e regras pendentes

`js/model/frenzy.js` centraliza a dificuldade: Brujah soma o modificador de geração à dificuldade base de qualquer Frenesi. A função é usada na resistência da Besta e nos lembretes calculados de fome e fúria. Explosão da Natureza usa seu cálculo próprio e não recebe Boiling Passion.

O modo Em jogo possui um registro manual de XP. O schema 5 adiciona `experience.available` e `experience.history`; fichas anteriores recebem saldo 0 sem perder campos. A referência de custos não compra avanços automaticamente e não substitui decisões da mesa. Méritos repetidos geram aviso para conferência na mesa, sem bloquear ou apagar a escolha. Bônus opcionais de personagem jovem continuam manuais. O Chapter 5 completo permanece ausente, sem alterações nos poderes catalogados.

## Testes

`tests/creation-browser.js` cobre migração e idempotência, importação real de arquivos v2 e atuais, Neonate/Ancilla/Elder, orçamentos, 6/8 dots, troca de tier com reload, múltiplos Méritos, exportação, Recursos personalizados, contadores, Brujah e largura de 390 px. As suítes anteriores continuam verificando Humanidade, focos, tooltips e ausência de listeners duplicados.

`tests/lifepath-sync-browser.js` verifica contribuições de múltiplos Caminhos, pontos adicionais, focos, limites de criação, recolhimento, calculadora, troca de Caminho/tier, recarregamento, importação/exportação sem duplicação e largura de 390 px.

Após a sincronização, as quatro suítes totalizam 231 verificações aprovadas no Firefox, na raiz do servidor e sob `/sheet/`. Imports e dependências dos 62 módulos também foram conferidos com `tests/check_structure.py`.

Na rodada de criação por tier, 191 verificações passaram no Firefox, tanto na raiz do servidor quanto sob `/sheet/`. A limpeza dos seletores CSS foi comparada em 390, 800 e 1280 px, sem diferenças nos estilos calculados dos componentes envolvidos.

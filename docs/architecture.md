# Organização da ficha

A ficha continua em HTML, CSS e módulos JavaScript nativos, sem build ou framework.

## Onde alterar cada coisa

| Responsabilidade | Arquivo ou pasta |
| --- | --- |
| Estrutura e campos da página | `index.html` |
| Entrada da aplicação: carregar, normalizar e montar | `js/app.js` |
| Composição das seções, salvamento e atualizações entre seções | `js/sheet.js` |
| Normalização de fichas | `js/model/character.js` |
| Migrações sequenciais e versão do schema | `js/model/migrations.js`, `data/schema.js` |
| Configuração de criação e limites em jogo | `data/tiers.js` |
| Slots e controles por tier | `js/model/creation.js` |
| Dificuldade de Frenesi, incluindo Boiling Passion | `js/model/frenzy.js` |
| Limites de Vitae, Vontade, Quickening e estado de fome | `js/model/resources.js` |
| Escala, episódios e resistência de Humanidade | `js/model/humanity.js` |
| Sincronização das Disciplinas com Clã/Sire | `js/model/identity.js` |
| Focos e compatibilidade do campo antigo | `js/model/skills.js` |
| Contribuições dos Caminhos e sincronização com Habilidades | `js/model/lifepath-skills.js` |
| Avisos de criação e requisitos | `js/model/validation.js` |
| localStorage, validação estrutural e JSON | `js/storage.js` |
| Renderização e eventos de cada seção | `js/ui/sections/` |
| Controles reutilizáveis: pontos, selects e inputs | `js/ui/controls.js` |
| Formatação de trechos e metadados dos poderes | `js/ui/disclosure.js` |
| Tooltips e textos de ajuda da interface | `js/ui/tooltips.js`, `js/ui/help-text.js` |
| Importar, exportar, imprimir e criar ficha | `js/ui/file-actions.js` |
| Aviso ao abrir diretamente por `file://` | `js/local-file-warning.js` |
| Catálogos, descrições e opções da campanha | `data/` |
| Poderes de cada Disciplina | `data/powers/` |
| Ficha vazia e personagem de exemplo | `data/characters/` |
| Cores, tipografia, layout e controles compartilhados | `css/base.css`, `css/layout.css`, `css/controls.css` |
| Estilos de cada seção | `css/components/` |
| Ordem de carregamento dos estilos | `css/style.css` |
| Impressão | `css/print.css` |
| Testes de comportamento e estrutura | `tests/` |

## Dependências

`app.js` carrega a ficha e chama `mountSheet`. `sheet.js` cria cada seção uma vez e fornece o personagem e as funções de atualização/salvamento. As seções recebem essas funções como parâmetros; elas não importam a inicialização nem outras seções.

O modelo recebe o personagem explicitamente. Ele não acessa DOM, localStorage ou controles da página. Os catálogos em `data/` dependem apenas de outros catálogos; funções de consulta podem permanecer junto dos dados, enquanto alterações na ficha ficam no modelo.

Os valores finais continuam no mesmo objeto de personagem. A chave de armazenamento continua igual. O schema 3 adiciona `merits[]` por migração explícita, mantendo o campo singular antigo e aceitando fichas anteriores; consulte [Criação e migrações](creation-and-migrations.md). O jogador distribui os pontos dos Caminhos; cada alteração em Habilidades atualiza o total da ficha e a calculadora, preservando os pontos adicionais. As contribuições são derivadas de `lifepathAllocations`, sem um segundo registro persistido. Recursos e focos continuam sob edição manual.

Os métodos de instalação de eventos são chamados uma vez na montagem. Métodos de renderização podem ser chamados novamente e substituem apenas os controles dinâmicos. Isso evita instalar vários listeners no mesmo controle estático.

## Dados e regras

Besta, Maldição, Frenesi e Traços ficam em `data/clans.js`, porque são dados do Clã. Natureza e Explosão ficam em `data/natures.js`. O antigo `data/beasts.js` estava vazio e não era usado. Também foram removidos os placeholders vazios `data/flaws.js`, `data/powers.js` e `js/builder.js`. Falha permanece um campo pessoal de texto livre.

`data/disciplines.js` mantém metadados e consultas; seus poderes vêm de arquivos individuais em `data/powers/`. A separação preserva todos os valores do catálogo anterior. Nenhuma regra ausente foi completada. As limitações registradas na [revisão de UX](ux-review.md) continuam válidas.

Os textos de tooltip descrevem o uso da interface e ficam fora do catálogo mecânico. `js/local-file-warning.js` usa script clássico intencionalmente: precisa funcionar quando o navegador impede ES modules em arquivos locais.

## Verificação

```sh
python3 tests/check_structure.py
```

Esse comando verifica referências locais, imports relativos, ciclos e dependências indevidas entre catálogo, modelo e interface. Para os testes funcionais em perfil temporário de navegador, siga o [README](../README.md).

Na reorganização, as duas suítes de navegador passaram com 131 verificações, inclusive ao servir a aplicação sob `/sheet/`. O catálogo de poderes foi comparado integralmente com a versão anterior. Os estilos renderizados foram comparados nas larguras de 390, 800 e 1280 pixels, com painéis abertos e recolhidos.

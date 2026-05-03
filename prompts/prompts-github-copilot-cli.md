# Prompt 1 - .gitignore

Contexto: Estou criando um dashboard em Angular com Angular Material em um repositorio para um MVP.
Objetivo: Ger um arquivo .gitignore para o Angular com os principais arquivos e pastas que devem ser ignorados, como node_modules, cache de testes e configurações locais do editor.
Estilo: Organize por seções com comentários.
Resposta: fornceça apenas o conteudo do arquivo .gitignore e crie ele.

# Prompt 2

Contexto: MVP de Dashboard para monitormaneto de preçoes de passagens aéreas.
Objetivo: Escrever um README inciial com nome do projeto: EasyTravel, descrição do contexto e projeto (seguir copilot-instructions.md), stack, como rodar localmente e roadmap de releases.
Estilo Markdown simples, direto e profissional.
Resposta: Crie e escreva o README completo

# Promtp 3

Contexto: Projeto em Angular 19 com Angular Materials;
Objetivo: Criar estrutura inicial de repositório angular;
Estilo: Utilizar angular materials para estilização;
Resposta: forneça um passo a passo de comandos para realizar a estruturação inicial.

# Prompt 4

Contexto: MVP em angular para dashboard de busca preços de passagens aéreas. Os usuários devem poder inserir cidade de saída e destino, opções de ida ou ida e volta, e cidades que desejam passar durante a viagem, criando roteiro com multiplos trechos. O site deve buscar em APIs gratuitas os melhores preços encontrados para esses trechos nas datas previstas pelo usuário, apresentando os resultados de forma clara e intuitiva ao usuário.
Objetivo: Documente os requisitos funcionais e não funcionais desse MVP;
Estilo: Direto e profisional, com foco em MVP e não projeto final;
Resposta: Crie ou atualize docs/escopo.md com a lista de requisitos funcionais, não funcionais e as histórias de usuário para esse MVP. Atualize docs/backlog.md com o detalhamento do roadmap de releases e backlog de atividades.

# Prompt 5

Contexto: Frontend enxuto com chamadas para APIs gratuitas de busca de preço de passagens aéreas;
Objetivo: gerar diagrama mermaid de componentes e fluxo de dados;
Estilo: simples, legível e versonavel;
Resposta: apenas bloco mermaid. Salve o arquivo em docs/ como mermaid-<contexto>.md, usando um nome descritivo para o contexto do diagrama.

# Prompt 6

Contexto: Foi criada a pasta docs/ com centralização da documentação sobre escopo, backlog e mermaid diagram.
Objetivo: Faça o commit dessas modificações
Estilo: Use conventional commits
Resposta: surira uma mensagem de commit e envie depois da minha aprovação

# Prompt 7 (FigmaMake)

- Contexto: MVP para dashboard de passagens aereas e roteiros de viagens;
[docs/escopo.md]
- Objetivo: Crie a interface para o primeiro release do backlog que é:
[docs/backlog.md/Release 1: Desenvolvimento (Core)]
- Estilo: Estou desenvolvendo com angular e angular materials, quero uma interface com tons leves de verde e laranja,, sem dark mode por enquanto;

# Prompt 8 (FigmaMake)

Me forneça uma interface para eu ter de exemplo e depois disso me forneça um prompt completo para eu solicitar ao meu agente no vscode que crie esses componentes.
Se esse prompt ficar muito complexo podemos usar chain-of-thought para dividir em partes e facilitar a implantação

# Prompt 9

Contexto: Aplicação MVP para busca de passagens aereas, com front em angular buscando em api externa;
Objetivo: Atualize o o arquivo docs/mermaid-frontend.md para refletir as mudanças recentes na arquitetura do frontend e na separação do serviço.
Estilo: Seguir o que já esta sendo feito no mermaid-frontend.md
Tom: técnico;
Audiência: o diagrama será lido por engenheiros de software que vão avaliar a estrutura, portanod deve ser detalhado de forma didatica para entendimento do repositório;
Resposta: diagrama atualizado para refletir o atual estado do repositório

# Prompt 10 (ChatGPT)

Contexto: Estou desenvolvendo um dashboard de passagens aéreas
Objetivo: gerar um icone para a identidade visual do projeto
Estilo: Estou usando as cores #FF9800 e #4CAF50


# Prompt 11 

Contexto: Aplicação Angular para busca de passagens aereas. Fiz alterações no serviço que busca os voos por meio de uma api, que agora é a FlightAPI; Fiz alterações estéticas para melhorar a interface; E troquei o icone da aplicação.
Objetivo: Divida as modificações em 3 commits e me sugira mensagens para os commits;
Estilo: Use conventional commits;
Resposta: Me forneça a lista de quais arquivos vão junto e com quais mensagens em português.

# Prompt 12

Contexto: Dashboard de busca por voos. A opção de busca ida e volta esta mostrando apenas voos de ia. Há um filtro para mostrar apenas 10 voos que pode ser um dos motivos de não mostrar todos; No frontend não há um indicador de que divida voos de ida e volta;
Objetivo: Refatorar o backend para devolver os 10 primeiros voos de ida e os 10 primeiros voos de volta separados. Refatorar o frontend para receber o novo formato de resposta e colocar marcador que divida voos de ida e volta quando for utilziado essa opçao. Quando for só ida, mostrar só o marcador de Ida.
Estilo: comente as funções descrevendo o uso;
Resposta: refatore o backend e o frontend

# Prompt 13

Contexto: Tenho uma aplicação Angular com SSR (Node + Express) que expõe um endpoint `/api/flights`. Esse endpoint recebe origin, destination, date e opcionalmente returnDate, consulta uma API externa de voos e retorna uma lista de voos no formato de json da linha 160 do server.ts. Também possuo funções auxiliares como `#sym:parseFlightApiResponse `, `#sym:createApiFlightFromLeg ` e `#sym:mapFlightsFromFlightApi `. No frontend Angular, há um dashboard que consome esse endpoint e permite filtrar voos por preço, duração e companhia.

Objetivo: Gerar uma suíte de testes automatizados cobrindo:

* funções utilitárias (cálculo de duração, estimativa de preço, mapeamento de dados)
* endpoint `/api/flights` (cenários de sucesso, parâmetros inválidos, erro da API externa)
* serviço Angular que consome `/api/flights` (mockando HTTP)
* lógica de filtros (preço, duração, companhia)

Estilo: testes claros, nomes descritivos, uso de mocks para chamadas HTTP externas, isolamento das dependências, foco em testes unitários e de serviço. Usar boas práticas do ecossistema Angular (Jasmine/Karma ou Jest) e Node.

Resposta:

1. Código completo dos testes unitários das funções utilitárias
2. Código de teste do endpoint `/api/flights` com mocks de fetch
3. Código de teste do serviço Angular com HttpTestingController
4. Organização sugerida de arquivos de teste
5. Breve explicação do que cada grupo de testes cobre

# Prompt 14

Contexto: Foram criados os casos de testes para o MVP de dashboard de voos.
Objetivo: Atualize essa estrutura de testes, descrevendo como rodar e o que esta coberto no nosso README.md
Estilo: Escrita técnica;
Resposta: README.md editado com descrição dos testes disponíveis no projeto

# Prompt 15

Analise o arquivo server.ts;
Objetivo: Sugerir refatoração com foco em DRY e SRP sem mudar comportamento externo.
Resposta: 1- lista de mudanças propostas 2 - patch sugerido por arquivo

# Prompt 16

Com base no código e nos testes atuais, gere um checklist com:
- Riscos tecnicos restante
- Gaps de cobertura de testes
- Melhorias prioritariapara a proxima realease
Resposta em bullets curto

# Prompt 17


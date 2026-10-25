# Prompt 01 - 

Atue como engenheiro de QA especializado em testes de integração com Vitest.

Analise os testes existentes em `src/server/server.api.spec.ts` e a implementação do endpoint em `src/server/server.ts`.

Proponha novos testes de integração para validar a comunicação do backend com a FlightAPI, utilizando respostas HTTP simuladas com `vi.stubGlobal('fetch', ...)`, sem realizar chamadas reais à API.

Priorize o sucesso da busca, o envio correto dos parâmetros, o mapeamento dos voos e os cenários de erro, incluindo respostas HTTP malsucedidas, falhas de comunicação e payloads inválidos.

Evite duplicar testes existentes. Baseie os cenários no comportamento real do código e identifique eventuais divergências entre os testes atuais e a implementação.

**Nesta etapa, não altere arquivos nem implemente testes.** Apresente os cenários propostos, seus resultados esperados e os arquivos que pretende modificar, aguardando minha aprovação.

--- 

# Prompt 02 - :

Você é um engenheiro de testes de software. Analise os testes existentes no meu projeto Angular/Express que consulta a FlightAPI e sugira **casos de teste de integração focados em situações de erro**.

Considere cenários como falha de comunicação, respostas HTTP com erro, JSON inválido, parâmetros incorretos e respostas inesperadas da API.

Para cada caso, informe:
- Cenário de erro;
- Como simular a situação;
- Resultado esperado;
- Se já existe um teste semelhante no projeto.

**Não altere arquivos nem implemente testes.** Quero apenas as sugestões, baseadas no código existente, evitando duplicar testes que já existem.
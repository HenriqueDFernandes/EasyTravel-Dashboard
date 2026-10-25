# Resumo dos testes de integração

## Escopo

Os testes de `src/server/server.api.spec.ts` cobrem o endpoint Express `GET /api/flights` e os recursos de documentação da API. As requisições ao servidor são feitas com Supertest; a comunicação com a FlightAPI é simulada por meio de `vi.stubGlobal('fetch', ...)`, sem chamadas reais ao serviço externo.

O teste também substitui dependências de ambiente, como o Angular SSR e a gravação de logs, permitindo validar o endpoint isoladamente.

## Cenários cobertos

- Disponibilização do documento OpenAPI e da interface Swagger UI.
- Busca bem-sucedida de voos one-way: agrupamento, mapeamento dos dados e URL completa enviada à FlightAPI.
- Busca bem-sucedida de voos round-trip: separação dos trechos de ida e volta e parâmetros da URL.
- Validação de data de ida inválida, parâmetros obrigatórios ausentes, `returnDate` ausente e `returnDate` inválida.
- Comportamento atual para `tripType` não suportado: o valor não é rejeitado, a consulta segue como one-way e o valor recebido aparece na resposta.
- Erro quando a chave `FLIGHTAPI_API_KEY` não está configurada.
- Uso do limite padrão quando o limite informado é inválido, zero ou negativo.
- Continuidade da resposta quando há falha ao gravar o log bruto da API.
- Resposta HTTP malsucedida do provedor: uso de dados de fallback e sinalização `isMockData: true`.
- JSON inválido, erro declarado pelo provedor em diferentes formatos e falha ao ler o corpo da resposta.
- Payload JSON vazio e estrutura inesperada, conforme o comportamento atual do endpoint.
- Mapeamento de preço alternativo e exclusão de itinerários sem preço válido ou sem trecho correspondente.
- Falha de comunicação quando `fetch` rejeita.

## Execução e resultado

Comando executado na raiz do repositório:

```powershell
npm --prefix .\easytravel-dashboard run test:unit -- src/server/server.api.spec.ts
```

Resultado da última execução:

- Arquivos de teste: 1 aprovado.
- Testes: 22 aprovados.
- Duração: aproximadamente 2,5 segundos.

Os casos de parâmetros obrigatórios são parametrizados; as variações de parâmetro também são contabilizadas individualmente pelo Vitest.

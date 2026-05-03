# 🛫 EasyTravel - Dashboard de Busca de Passagens Aéreas

**Repositório do MVP**: Dashboard interativo para busca de passagens aéreas desenvolvido como especialização em GenAI (IA Generativa).

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-0.1.0-blue)]()
[![License](https://img.shields.io/badge/license-CC%20BY%204.0-blue)]()

## 📋 Descrição

EasyTravel é um MVP desenvolvido como parte de uma especialização em GenAI que explora o uso de IA generativa em todas as fases do ciclo de desenvolvimento de software: concepção, design, implementação, testes e documentação.

O projeto consiste em um **dashboard web responsivo** para busca de passagens aéreas em rotas brasileiras, com integração em tempo real com a API [FlightAPI](https://www.flightapi.io/) e práticas modernas de desenvolvimento Angular.

### Contexto do Projeto
- **Propósito**: Explorar GenAI no desenvolvimento full-stack
- **Escopo**: MVP com funcionalidades core (~30h de desenvolvimento)
- **Tecnologias Familiares**: Angular + Angular Material (foco em IA, não framework)
- **Validação**: Testes automáticos e práticas de conventional commits

## 🎯 Funcionalidades Implementadas (v0.1.0)

### ✅ Search Core
- [x] Busca por origem, destino e data
- [x] Suporte para ida/volta e múltiplos trechos
- [x] Histórico de buscas recentes (localStorage)
- [x] Integração com FlightAPI

### ✅ Filtering & Sorting
- [x] Filtrar por preço máximo
- [x] Filtrar por duração máxima
- [x] Filtrar por companhia aérea (fuzzy matching)
- [x] Filtrar por voos diretos apenas
- [x] Ordenação por preço, duração, horário de saída

### ✅ UI/UX
- [x] Interface responsiva (mobile-first)
- [x] Componentes Angular Material
- [x] Spinner de carregamento com estado melhorado
- [x] Tema verde/laranja customizado
- [x] Favicon personalizado

### ✅ Backend & Security
- [x] Express.js SSR (Server-Side Rendering)
- [x] API key protegida em servidor (.env)
- [x] Validação de parâmetros (ISO dates)
- [x] Error handling com status HTTP apropriados

## 🏗️ Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | Angular | 21.2.9 |
| | Angular Material | 21.2.9 |
| | RxJS | 7.8.0 |
| | TypeScript | 5.6.x |
| | SCSS | ✓ |
| **Backend** | Express.js | 5.1.0 |
| | Node.js SSR | Angular 21.2 |
| | dotenv | 17.4.2 |
| **Build** | Angular CLI | 21.2.9 |
| | Webpack | (via Angular) |
| **Package Manager** | npm | 10.x |

## ⚙️ Setup Inicial

### Pré-requisitos
```bash
node --version   # >= 20.11.x
npm --version    # >= 10.x
git --version    # >= 2.x
```

Versão de Node recomendada no projeto: arquivo `.nvmrc` em `easytravel-dashboard/`.

### 1️⃣ Clonar Repositório
```bash
git clone https://github.com/seu-usuario/Especializacao_GenAI.git
cd Especializacao_GenAI/Laboratorio_introdutorio/easytravel-dashboard
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar API Key
Use o arquivo de exemplo versionado:
```bash
cp .env.example .env
# depois edite o .env e preencha:
FLIGHTAPI_API_KEY=sua_chave_da_api
```

**Como obter a chave:**
1. Acesse [FlightAPI](https://www.flightapi.io/)
2. Registre-se e faça login
3. Copie sua API Key do dashboard
4. Cole no arquivo `.env`

⚠️ **Segurança**: Nunca commite `.env`. Está no `.gitignore`.

### 4️⃣ Validação Pós-Setup (Health Check)

Com a aplicação em execução (`npm start`), valide o endpoint backend:

```bash
curl "http://localhost:4200/api/flights?origin=GRU&destination=REC&date=2026-06-01"
```

Comportamento esperado:
- com `FLIGHTAPI_API_KEY` válida: retorno `200` com lista de voos
- sem chave válida: retorno `503` com mensagem de configuração ausente

### 5️⃣ Rodando o Projeto

**Desenvolvimento:**
```bash
npm start
# Acesse: http://localhost:4200
```

**Build Produção:**
```bash
npm run build
# Saída: dist/
```

## 🔁 Reprodutibilidade em Máquina Limpa

O repositório está preparado para execução em máquina limpa com:

- versão mínima de runtime definida em `easytravel-dashboard/package.json` (`engines`)
- versão recomendada de Node em `easytravel-dashboard/.nvmrc`
- arquivo `easytravel-dashboard/.env.example` para bootstrap seguro do ambiente
- fluxo de validação inicial via health check do endpoint `/api/flights`
- scripts de build e testes unitários documentados e validados

## 🧭 Onboarding Técnico

Pontos-chave para entrada técnica no projeto:

- **Arquitetura backend SSR**: `src/server/server.ts` concentra roteamento Express SSR, validação de query e integração com FlightAPI
- **Contratos e tipos**: `src/server/server.types.ts` centraliza os tipos de request/response e mapeamento de domínio
- **Fluxo frontend**: `AppComponent` orquestra busca, filtros e ordenação; `FlightService` encapsula acesso ao endpoint `/api/flights`
- **Estratégia de testes**: suíte Vitest cobre utilitários de backend, endpoint, serviço Angular e lógica de filtros (27 testes)
- **Artefatos de apoio**: `docs/escopo.md`, `docs/backlog.md` e `docs/mermaid-frontend.md` para contexto de produto e arquitetura

## 🤖 Uso de IA no Projeto

Este MVP foi desenvolvido com apoio de IA generativa em etapas de design, implementação, refatoração, testes e documentação.

### Ferramentas e Modelos Utilizados

| Ferramenta | Contexto de uso | Modelos / foco |
|-----------|------------------|----------------|
| **GitHub Copilot CLI** | Geração de código, refatorações incrementais, criação/ajuste de testes, revisão de gaps | **GPT-4.1** e **GPT-5.3-Codex** |
| **GitHub Copilot Chat (lateral no VS Code)** | Iteração rápida de arquitetura, debug, ajustes de README e validações de implementação | **GPT-4.1** e **GPT-5.3-Codex** |
| **ChatGPT** | Dúvidas conceituais, alternativas de abordagem e validação de decisões técnicas | Suporte conceitual |
| **FigmaMake** | Ideação visual e direcionamento de layout para interface Angular Material | Design de interface |

### Boas Práticas de Uso de IA Adotadas

- Prompts orientados por objetivo, contexto e resultado esperado
- Revisão humana de todo código gerado antes de merge
- Validação por testes automatizados após alterações sugeridas por IA
- Uso de commits semânticos para rastrear mudanças induzidas por IA
- Remoção de dados sensíveis do contexto (API key apenas em `.env`)

## 📖 Exemplos de Uso

### Busca Simples (Só Ida)
1. Selecione "Só Ida" no formulário
2. Escolha: Origem (ex: GRU) → Destino (ex: CNF) → Data (ex: 22/05/2026)
3. Clique "Buscar"
4. Resultado exibe voos com preço, duração, horários

### Filtros Avançados
- **Preço Máximo**: Digite 300 para ver apenas voos até R$ 300
- **Duração**: Digite 120 para voos com até 2 horas
- **Companhia**: Selecione "LATAM" ou "Azul"
- **Diretos**: Ative "Apenas voos diretos"

### Histórico
- Clique em uma busca recente para refazer a mesma consulta
- Histórico salvo localmente (não sincroniza com servidor)

## 📁 Estrutura do Projeto

```
Laboratorio_introdutorio/
├── easytravel-dashboard/          # Projeto Angular principal
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── search-form/   # Formulário de busca
│   │   │   │   ├── filter-panel/  # Painel de filtros
│   │   │   │   ├── flight-results/# Listagem de voos
│   │   │   │   └── recent-searches/
│   │   │   ├── services/
│   │   │   │   ├── flight.service.ts
│   │   │   │   └── search-history.service.ts
│   │   │   ├── models/
│   │   │   └── data/
│   │   ├── server/
│   │   │   ├── server.ts          # Express SSR + /api/flights
│   │   │   └── server.types.ts    # Tipos e contratos do backend SSR
│   │   └── main.ts
│   ├── public/
│   │   └── easytravel.ico
│   ├── angular.json
│   ├── package.json
│   └── README.md                  # Setup técnico detalhado
│
├── docs/                          # Documentação do projeto
│   ├── escopo.md                 # Requisitos e histórias de usuário
│   ├── backlog.md                # Roadmap e releases
│   └── mermaid-frontend.md       # Diagrama de arquitetura
│
├── prompts/                       # Prompts GenAI usados
│   └── prompts-github-copilot-cli.md
│
└── README.md                      # Este arquivo
```

## 🔄 Fluxo de Dados

```
┌─────────────────┐
│  SearchForm     │ Usuário preenche form
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AppComponent   │ Orquestra busca
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FlightService  │ HTTP GET /api/flights
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Express (SSR)   │ Valida + chama FlightAPI
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FlightAPI      │ Retorna itinerários
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Mapeamento      │ ApiFlight[]
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Filtros Aplicados
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ FlightResults   │ Renderiza voos
└─────────────────┘
```

## 🎨 Design & Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde | `#4CAF50` | Botões principais, ações |
| Laranja | `#FF9800` | Destaque, variações |
| Branco | `#FFFFFF` | Fundo, cards |
| Cinzento | `#F5F5F5` | Bordas, textos secundários |

## 📊 Commits (v0.1.0)

Seguindo [Conventional Commits](https://www.conventionalcommits.org/):

1. `feat(api): migrar busca de voos para a FlightAPI com chave no servidor`
2. `feat(ui): melhorar fluxo de carregamento da busca e comportamento dos filtros`
3. `style(ui): ajustar larguras do layout e atualizar o favicon da aplicação`

## 📈 Roadmap (Próximas Releases)

### v0.2.0 - Ida e Volta Automática
- [ ] Montagem automática de trecho retorno
- [ ] Diferenciação clara ida/volta nos resultados

### v0.3.0 - Testes & Documentação
- [x] Testes unitários e de serviço com Vitest (backend + frontend)
- [ ] Testes E2E (Cypress)
- [ ] Swagger/OpenAPI para backend

### v0.4.0 - Performance & UX
- [ ] Implementar cache de resultados
- [ ] Dark mode
- [ ] Multi-idioma (PT-BR, EN, ES)

### v0.5.0 - Recursos Avançados
- [ ] Comparação side-by-side de voos
- [ ] Salvar favoritos
- [ ] Alertas de preço

## 🐛 Limitações Conhecidas

| Limitação | Motivo | Status |
|-----------|--------|--------|
| Apenas voos nacionais | Escopo MVP | ⏳ v0.2.0 |
| 50 req/mês FlightAPI | Plano free da API | ⏳ Roadmap |
| Sem dark mode | Tempo de dev | ⏳ v0.4.0 |
| Sem autenticação | MVP simplificado | ⏳ Futuro |

## 💡 Troubleshooting

### "FLIGHTAPI_API_KEY not configured"
```bash
# Verificar se .env existe
ls .env

# Se não existir, criar:
echo "FLIGHTAPI_API_KEY=sua_chave" > .env

# Reiniciar
npm start
```

### Spinner não desaparece
- Verificar console do navegador (F12)
- Validar origem/destino/data do formulário
- Confirmar conectividade da API

### Favicon não atualiza
```bash
# Hard refresh
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

## 🧪 Testes Automatizados

O projeto possui uma suíte de testes unitários e de serviço baseada em **Vitest**, cobrindo backend SSR, endpoint Express, serviço Angular e lógica de filtros do dashboard.

### Como rodar

Na pasta `easytravel-dashboard/`:

```bash
# Executa toda a suíte unitária
npm run test:unit

# Executa em modo watch durante desenvolvimento
npm run test:unit:watch

# Mantém o comando padrão do Angular/Karma disponível
npm run test
```

### Estrutura dos testes

```text
easytravel-dashboard/
├── src/
│   ├── server/
│   │   ├── server.utils.spec.ts            # Funções utilitárias do backend
│   │   └── server.api.spec.ts              # Endpoint /api/flights com fetch mockado
│   ├── test-setup.ts                       # Bootstrap do ambiente Angular no Vitest
│   └── app/
│       ├── app.component.spec.ts           # Lógica de filtros e separação ida/volta
│       └── services/
│           └── flight.service.spec.ts      # Serviço Angular com HttpTestingController
└── vitest.config.ts                        # Configuração do runner de testes
```

### Cobertura atual

#### Backend utilitário
- `parseFlightApiResponse`: parse seguro de payload JSON e fallback para erro de payload inválido
- `formatDurationFromMinutes`: formatação padronizada de duração em horas e minutos
- `normalizePrice`: normalização de valores numéricos e strings com separador decimal
- `isValidIsoDate`: validação de datas reais no formato `YYYY-MM-DD`
- `getDurationLabel`: cálculo de duração a partir de timestamps ISO
- `getRealPriceFromPricingOptions`: extração de preço com fallback para `cheapest_price`
- `createApiFlightFromLeg`: mapeamento de `leg` da FlightAPI para o contrato interno da aplicação
- `mapFlightsFromFlightApi`: separação de voos de ida e volta no formato consumido pelo frontend

#### Endpoint `/api/flights`
- cenário de sucesso para busca `one-way`
- cenário de sucesso completo para busca `round-trip` (ida e volta separadas)
- validação de parâmetros obrigatórios
- rejeição de datas inválidas
- validação de `returnDate` em buscas `round-trip`
- validação de ausência de `FLIGHTAPI_API_KEY` (status `503`)
- fallback de `limit` inválido/zero/negativo para o valor padrão
- resiliência quando a gravação de log cru falha (sem quebrar resposta HTTP)
- tratamento de erro HTTP da API externa
- tratamento de erro de comunicação com o provedor externo
- verificação do uso de moeda `BRL` nas chamadas ao provedor

#### Serviço Angular `FlightService`
- envio correto dos parâmetros para buscas `one-way`
- envio correto dos parâmetros para buscas `round-trip`
- retorno vazio quando a busca não possui segmento válido
- propagação de erro HTTP vindo do backend

#### Lógica de filtros do dashboard
- filtro por preço máximo
- filtro por duração máxima
- filtro por companhia com fuzzy matching
- aplicação independente dos filtros para listas de ida e volta
- combinação de filtros + ordenação por horário de partida (casos limite)

### Observações

- Os testes do backend isolam chamadas externas com mocks de `fetch`.
- A gravação de logs crus da FlightAPI também fica isolada por mocks, sem escrever arquivos reais durante a suíte.
- O foco atual está em testes unitários e de serviço; testes E2E ainda não fazem parte desta release.
- Suíte atual validada com `27` testes passando (`npm run test:unit`).

## 📝 Licença

Este projeto é licenciado sob a **Creative Commons Attribution 4.0 International (CC-BY-4.0)** - veja [LICENSE](LICENSE) para detalhes.

```
CC-BY-4.0 - Trabalho Acadêmico
Você é livre para: compartilhar, adaptar, criar derivados
Sob a condição de: atribuição do trabalho original
```

## 🙏 Créditos & Atribuições

| Componente | Provedor | Link |
|-----------|----------|------|
| Framework | Angular | https://angular.dev/ |
| Componentes UI | Angular Material | https://material.angular.io/ |
| API de Voos | FlightAPI | https://www.flightapi.io/ |
| Formatação de Data | date-fns | https://date-fns.org/ |
| Estado Reativo | RxJS | https://rxjs.dev/ |

### Desenvolvimento
- **Desenvolvedor Principal**: Henrique DF
- **Especialização**: Pós-Graduação em GenAI
- **Instituição**: [Sua Instituição]
- **Período**: 2026

## 📞 Suporte & Contato

- 📧 Email: fernandesdhenrique@gmail.com

---

**Desenvolvido com ❤️ e GenAI** | Last Updated: Maio 2026

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
node --version   # >= 18.x
npm --version    # >= 10.x
git --version    # >= 2.x
```

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
Crie um arquivo `.env` na raiz do projeto:
```bash
# .env (não será versionado)
FLIGHTAPI_API_KEY=sua_chave_da_api
```

**Como obter a chave:**
1. Acesse [FlightAPI](https://www.flightapi.io/)
2. Registre-se e faça login
3. Copie sua API Key do dashboard
4. Cole no arquivo `.env`

⚠️ **Segurança**: Nunca commite `.env`. Está no `.gitignore`.

### 4️⃣ Rodando o Projeto

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
│   │   ├── server.ts              # Express SSR + /api/flights
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
- [ ] Testes unitários (FlightService, FilterPipe)
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
| Ida e volta mescladas | Lógica atual | ⏳ v0.2.0 |
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

## 🧪 Testes (A Implementar)

```bash
# Unitários (Vitest)
npm run test

# E2E (Cypress)
npm run e2e

# Coverage
npm run test:coverage
```

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

- 📧 Email: seu-email@dominio.com
- 🐙 GitHub Issues: [Abrir issue](../../issues)
- 💬 Discussões: [Participar](../../discussions)

---

**Desenvolvido com ❤️ e GenAI** | Last Updated: Maio 2026

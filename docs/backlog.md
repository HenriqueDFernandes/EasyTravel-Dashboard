# Backlog de Releases e Atividades

Backlog atualizado para refletir o que foi entregue no MVP `v1.0.0-mvp` e o roadmap descrito no README.

## Release v1.0.0-mvp (Concluida)

### Search Core
- [x] Busca por origem, destino e data
- [x] Suporte para ida/volta e multiplos trechos
- [x] Historico de buscas recentes (localStorage)
- [x] Integracao com FlightAPI

### Filtering & Sorting
- [x] Filtro por preco maximo
- [x] Filtro por duracao maxima
- [x] Filtro por companhia (fuzzy matching)
- [x] Filtro por voos diretos
- [x] Ordenacao por preco, duracao e horario

### UI/UX
- [x] Interface responsiva (mobile-first)
- [x] Componentes Angular Material
- [x] Spinner de carregamento com estados
- [x] Tema customizado e favicon

### Backend, Integracao e Confiabilidade
- [x] Backend SSR com Express (`/api/flights`)
- [x] Chave da API protegida em `.env`
- [x] Validacao de parametros e datas ISO
- [x] Tratamento de erros HTTP do provedor
- [x] Modo demo com fallback de dados ficticios quando FlightAPI falha

### Qualidade e Documentacao
- [x] Suite de testes unitarios/servico com Vitest (27 testes)
- [x] README atualizado com setup, troubleshooting, roadmap e uso de IA
- [x] Tag de release criada: `v1.0.0-mvp`

## Release v1.1.0 - Multiplos Trechos & Paradas
- [ ] Suporte para ate 5 segmentos em uma unica busca
- [ ] Calculo automatico de conexoes e tempo de espera
- [ ] Visualizacao de paradas intermediarias
- [ ] Itinerarios complexos com melhor UX

## Release v1.2.0 - Controle de Usuarios & Preferencias
- [ ] Autenticacao com email/senha
- [ ] Perfis de usuario com preferencias personalizadas
- [ ] Salvar e gerenciar buscas favoritas
- [ ] Historico sincronizado entre dispositivos
- [ ] Recomendacoes baseadas em historico

## Release v1.3.0 - Alertas Automaticos & Notificacoes
- [ ] Sistema de alertas de preco por rota
- [ ] Email digest com melhores ofertas
- [ ] Notificacoes push no navegador
- [ ] Rastreamento de voos e status em tempo real
- [ ] Alertas customizaveis por rota favorita

## Melhorias Tecnicas Pos-MVP
- [ ] Retry automatico com backoff exponencial
- [ ] Cache de resultados para reduzir dependencia de API externa
- [ ] Observabilidade (logs estruturados e metricas de falha)
- [ ] Estrategia para aumento de cobertura de testes (incluindo E2E)

# Backlog de Releases e Atividades


## Release 1: Desenvolvimento (Core)
- [ ] Implementação da busca de passagens aéreas (origem, destino, datas)
- [X] Opção de ida ou ida e volta
- [X] Adição de cidades intermediárias (multitrechos)
- [ ] Integração com pelo menos uma API gratuita de voos
- [ ] Exibição clara dos resultados (preço, datas, companhias)
- [ ] Interface responsiva (desktop/mobile)

### Detalhamento: Integração com Serviço Único de Voos
- [X] Definir um único provedor externo para o MVP (Aviationstack)
- [X] Criar configuração central da API (base URL, apiKey, limite) no frontend
- [X] Evoluir `FlightService` para estratégia de provedor único por segmento
- [X] Suportar busca multitrechos com agregação de resultados por `forkJoin`
- [X] Mapear payload externo para modelo interno de `Flight`
- [X] Manter fallback local (mock) quando não houver chave configurada
- [ ] Configurar `apiKey` de desenvolvimento para chamada real da API
- [ ] Validar cenários reais: ida, ida/volta e multitrechos
- [ ] Ajustar regra de preço quando API de produção não retornar fare
- [ ] Documentar setup da chave e limitações do provedor no README


## Release 2: Testes e Validação
- [ ] Testes básicos dos componentes principais
- [ ] Validação das funcionalidades principais
- [ ] Ajustes de usabilidade e correção de bugs
- [ ] Documentação do processo e decisões técnicas


## Release 3: Entrega Final
- [ ] Revisão geral do código e documentação
- [ ] Preparação do material de entrega acadêmica
- [ ] Registro das limitações e próximos passos sugeridos

## Possíveis Extensões Futuras (fora do escopo do trabalho)
- [ ] Integração com múltiplas APIs de voos
- [ ] Filtros avançados (preço, duração, companhia)
- [ ] Histórico de buscas recentes
- [ ] Exportação/compartilhamento de resultados
- [ ] Deploy em ambiente público
- [ ] Funcionalidades avançadas de recomendação
- [ ] Melhorias de performance e UX
- [ ] Cobertura de testes ampliada
- [ ] Feedback do usuário e ajustes finais

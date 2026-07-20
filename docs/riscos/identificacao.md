Com base exclusivamente nas informações dos documentos fornecidos (README, escopo e backlog) e no contexto informado (MVP acadêmico, requisitos evolutivos e uso de GenAI), os seguintes riscos podem ser identificados.

---

# 1. Lista de riscos identificados

### Risco 1 — Mudanças frequentes de requisitos durante o desenvolvimento

**Descrição:**
O projeto é um MVP e os requisitos ainda estão evoluindo. Isso pode exigir retrabalho em funcionalidades já implementadas, documentação e testes.

**Contexto de ocorrência:**
Durante a evolução do backlog ou após validação do MVP, quando novas funcionalidades ou alterações de escopo forem priorizadas. O próprio contexto informado indica que os requisitos podem sofrer mudanças ao longo do projeto, e o backlog prevê novas releases com funcionalidades relevantes. 

---

### Risco 2 — Dependência de uma API externa para funcionamento da aplicação

**Descrição:**
A funcionalidade principal depende da FlightAPI. Problemas de disponibilidade, autenticação, limites de uso ou mudanças na API podem impedir o funcionamento esperado da aplicação.

**Contexto de ocorrência:**
Durante qualquer busca de passagens, caso a API esteja indisponível, retorne erros ou altere seu comportamento. O projeto já prevê um modo demo para essas situações, evidenciando essa dependência. 

---

### Risco 3 — Limitação do plano gratuito da API

**Descrição:**
O uso do plano gratuito limita a quantidade de consultas disponíveis, podendo impedir demonstrações, testes ou validações contínuas.

**Contexto de ocorrência:**
Quando os créditos gratuitos forem consumidos durante desenvolvimento ou demonstrações do MVP. 

---

### Risco 4 — Funcionalidades planejadas ainda não implementadas

**Descrição:**
Diversas funcionalidades importantes já fazem parte do roadmap, mas ainda não foram desenvolvidas. Caso sejam consideradas necessárias durante a validação do MVP, podem gerar aumento de prazo ou esforço.

**Contexto de ocorrência:**
Durante novas releases previstas para autenticação, alertas de preço, múltiplos trechos e preferências do usuário. 

---

### Risco 5 — Cobertura limitada de testes

**Descrição:**
Embora existam testes unitários e de serviço, ainda não há testes E2E. Isso aumenta a possibilidade de problemas de integração não serem identificados antes da utilização da aplicação.

**Contexto de ocorrência:**
Durante integração entre frontend, backend SSR e API externa, principalmente após novas funcionalidades ou refatorações. 

---

### Risco 6 — Desempenho abaixo do requisito não funcional

**Descrição:**
O escopo estabelece resposta de até cinco segundos para o MVP. Dependências externas e futuras ampliações de funcionalidades podem dificultar o atendimento desse requisito.

**Contexto de ocorrência:**
Durante consultas à API de voos em cenários de maior latência ou indisponibilidade parcial do serviço externo. 

---

### Risco 7 — Evolução arquitetural do MVP

**Descrição:**
Como o sistema foi concebido inicialmente como MVP, decisões arquiteturais adequadas ao protótipo podem dificultar futuras expansões previstas no roadmap.

**Contexto de ocorrência:**
Na implementação de autenticação, sincronização entre dispositivos, notificações, múltiplos trechos e outras funcionalidades planejadas. 

> **Observação:** este risco é uma inferência decorrente da evolução prevista do produto. Os documentos não indicam problemas na arquitetura atual, portanto sua ocorrência dependerá da forma como as próximas funcionalidades forem incorporadas.

---

### Risco 8 — Dependência de armazenamento local para histórico

**Descrição:**
O histórico de buscas utiliza localStorage. Enquanto isso atende ao escopo do MVP, limita continuidade de uso entre dispositivos e pode exigir mudanças estruturais futuras.

**Contexto de ocorrência:**
Quando houver implementação da sincronização de histórico prevista no roadmap.  

---

### Risco 9 — Ausência de autenticação no MVP

**Descrição:**
O projeto deliberadamente não possui autenticação. Caso o escopo evolua para funcionalidades personalizadas antes da implementação prevista, será necessário introduzir mecanismos de controle de usuários.

**Contexto de ocorrência:**
Durante a evolução para funcionalidades como preferências, favoritos ou sincronização entre dispositivos.  

---

### Risco 10 — Necessidade de validação do comportamento em produção

**Descrição:**
O escopo informa que o deploy em produção pública está fora do escopo do MVP. Dessa forma, características relacionadas à operação em ambiente produtivo ainda não foram validadas.

**Contexto de ocorrência:**
Caso o projeto evolua para uso real ou disponibilização pública sem etapas adicionais de validação. 

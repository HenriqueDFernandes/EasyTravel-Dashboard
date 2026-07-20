# 1. Análise estruturada dos riscos

## Risco 1 – Mudanças frequentes de requisitos

**Descrição:**
Por se tratar de um MVP com requisitos em evolução, funcionalidades e prioridades podem ser alteradas durante o desenvolvimento.

**Possíveis impactos no projeto:**

* Retrabalho de funcionalidades já implementadas;
* Aumento do esforço de desenvolvimento;
* Atualização de documentação e testes;
* Possível impacto no cronograma.

**Fatores que influenciam a ocorrência:**

* Natureza iterativa do MVP;
* Evolução do backlog;
* Validação contínua das funcionalidades.

**Probabilidade (qualitativa):** Alta

**Impacto (qualitativo):** Alto

**Justificativa da classificação:**
O próprio contexto do projeto informa que os requisitos ainda estão evoluindo, tornando esse risco inerente ao desenvolvimento do MVP.

---

## Risco 2 – Dependência da API externa (FlightAPI)

**Descrição:**
A principal funcionalidade depende da disponibilidade e do funcionamento correto de uma API externa.

**Possíveis impactos no projeto:**

* Interrupção das buscas;
* Limitação das demonstrações;
* Necessidade de utilizar dados fictícios;
* Redução da confiabilidade percebida da aplicação.

**Fatores que influenciam a ocorrência:**

* Disponibilidade do provedor;
* Alterações na API;
* Problemas de autenticação ou conectividade.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Alto

**Justificativa da classificação:**
Existe um mecanismo de fallback que reduz parcialmente os efeitos da indisponibilidade, porém a principal funcionalidade continua dependente do serviço externo.

---

## Risco 3 – Limitação do plano gratuito da API

**Descrição:**
O plano gratuito possui quantidade limitada de créditos para consultas.

**Possíveis impactos no projeto:**

* Interrupção dos testes;
* Limitação das demonstrações;
* Necessidade de adquirir plano pago.

**Fatores que influenciam a ocorrência:**

* Volume de consultas realizadas;
* Frequência de testes e demonstrações.

**Probabilidade (qualitativa):** Alta

**Impacto (qualitativo):** Médio

**Justificativa da classificação:**
O consumo dos créditos é esperado ao longo do desenvolvimento, porém o impacto é parcialmente reduzido pelo modo demo existente.

---

## Risco 4 – Funcionalidades previstas ainda não implementadas

**Descrição:**
Diversas funcionalidades encontram-se apenas no roadmap e poderão aumentar o esforço de desenvolvimento futuro.

**Possíveis impactos no projeto:**

* Ampliação do escopo;
* Aumento do prazo;
* Maior necessidade de testes e documentação.

**Fatores que influenciam a ocorrência:**

* Priorização de novas releases;
* Necessidade de evolução do MVP.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Médio

**Justificativa da classificação:**
As funcionalidades estão planejadas, porém sua implementação dependerá da evolução do projeto.

---

## Risco 5 – Cobertura limitada de testes

**Descrição:**
O projeto possui testes unitários e de serviço, porém ainda não contempla testes end-to-end.

**Possíveis impactos no projeto:**

* Falhas de integração não detectadas;
* Maior esforço de correção;
* Redução da qualidade da aplicação.

**Fatores que influenciam a ocorrência:**

* Evolução da aplicação;
* Inclusão de novas funcionalidades;
* Complexidade crescente das integrações.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Médio

**Justificativa da classificação:**
A existência de testes automatizados reduz o risco, mas a ausência de testes E2E deixa lacunas de validação.

---

## Risco 6 – Desempenho abaixo do requisito esperado

**Descrição:**
O tempo de resposta poderá exceder o requisito definido para o MVP.

**Possíveis impactos no projeto:**

* Experiência do usuário prejudicada;
* Necessidade de otimizações;
* Retrabalho técnico.

**Fatores que influenciam a ocorrência:**

* Latência da API externa;
* Volume de consultas;
* Crescimento da aplicação.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Médio

**Justificativa da classificação:**
O desempenho depende parcialmente de serviços externos e poderá variar conforme a evolução do sistema.

---

## Risco 7 – Evolução arquitetural do MVP

**Descrição:**
Decisões arquiteturais adequadas ao MVP podem dificultar a implementação das funcionalidades futuras.

**Possíveis impactos no projeto:**

* Refatorações;
* Aumento da complexidade;
* Maior esforço de manutenção.

**Fatores que influenciam a ocorrência:**

* Crescimento do backlog;
* Inclusão de autenticação, notificações e sincronização.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Médio

**Justificativa da classificação:**
Os documentos não indicam limitações arquiteturais atuais. O risco decorre apenas da evolução prevista do projeto, portanto existe incerteza quanto à sua ocorrência.

---

## Risco 8 – Dependência de armazenamento local (localStorage)

**Descrição:**
O histórico de buscas é armazenado apenas localmente, o que limita futuras funcionalidades de sincronização.

**Possíveis impactos no projeto:**

* Necessidade de refatoração;
* Maior esforço para evolução da funcionalidade.

**Fatores que influenciam a ocorrência:**

* Implementação futura de contas de usuário;
* Sincronização entre dispositivos.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Baixo

**Justificativa da classificação:**
O mecanismo atende ao escopo atual, mas poderá exigir alterações quando novas funcionalidades forem implementadas.

---

## Risco 9 – Ausência de autenticação

**Descrição:**
O MVP não possui autenticação, embora funcionalidades futuras dependam dela.

**Possíveis impactos no projeto:**

* Necessidade de mudanças arquiteturais;
* Maior esforço de implementação nas próximas versões.

**Fatores que influenciam a ocorrência:**

* Evolução para funcionalidades personalizadas;
* Priorização do roadmap.

**Probabilidade (qualitativa):** Média

**Impacto (qualitativo):** Baixo

**Justificativa da classificação:**
A ausência de autenticação é uma decisão de escopo do MVP e somente produzirá impactos caso o projeto evolua conforme o roadmap.

---

## Risco 10 – Ausência de validação em ambiente de produção

**Descrição:**
O projeto não contempla implantação em produção pública, limitando a validação em ambiente real.

**Possíveis impactos no projeto:**

* Problemas operacionais identificados apenas em fases posteriores;
* Necessidade de ajustes antes da disponibilização pública.

**Fatores que influenciam a ocorrência:**

* Evolução do projeto além do contexto acadêmico;
* Necessidade de deploy futuro.

**Probabilidade (qualitativa):** Baixa

**Impacto (qualitativo):** Médio

**Justificativa da classificação:**
Enquanto permanecer como MVP acadêmico, esse risco possui baixa probabilidade. Caso o projeto evolua para produção, sua relevância aumentará.

---

# 2. Matriz Qualitativa de Riscos

| **Probabilidade \ Impacto** | **Baixo**                                                                  | **Médio**                                                                                                                                                                      | **Alto**                                   |
| --------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **Alta**                    | —                                                                          | **R3** – Limitação do plano gratuito da API<br>                                                                                   | **R1** – Mudanças frequentes de requisitos |
| **Média**                   | **R8** – Dependência de localStorage<br>**R9** – Ausência de autenticação | **R4** – Funcionalidades futuras não implementadas<br>**R5** – Cobertura limitada de testes<br>**R6** – Desempenho abaixo do esperado<br>**R7** – Evolução arquitetural do MVP | **R2** – Dependência da FlightAPI          |
| **Baixa**                   | —                                                                          | **R10** – Ausência de validação em produção                                                                                                 | —                                          |


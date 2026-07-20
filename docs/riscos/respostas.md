# 1. Estratégias Possíveis por Risco

## Risco 1 – Mudanças frequentes de requisitos

**Estratégia de resposta:** **Mitigar**

**Justificativa:**
Como o projeto é um MVP e os requisitos evoluem continuamente, não é viável eliminar esse risco. A melhor estratégia é reduzir seus impactos por meio de práticas de gerenciamento de requisitos e desenvolvimento incremental.

**Possíveis ações associadas:**

* Revisar e priorizar o backlog ao final de cada iteração.
* Validar requisitos antes do início de novas implementações.
* Atualizar documentação e testes sempre que houver mudanças.
* Desenvolver funcionalidades em incrementos pequenos.

---

## Risco 2 – Dependência da API externa (FlightAPI)

**Estratégia de resposta:** **Mitigar**

**Justificativa:**
A integração com a FlightAPI é essencial para o funcionamento da aplicação e faz parte do escopo do projeto. Assim, a melhor alternativa é reduzir os impactos de possíveis indisponibilidades do serviço.

**Possíveis ações associadas:**

* Manter o modo demo com dados fictícios.
* Implementar cache de consultas.
* Implementar retry com backoff exponencial.
* Monitorar falhas de comunicação com a API.

---

## Risco 3 – Limitação do plano gratuito da API

**Estratégia de resposta:** **Transferir**

**Justificativa:**
Caso a limitação de créditos comprometa a continuidade do projeto, a responsabilidade pelo fornecimento da infraestrutura pode ser transferida mediante contratação de um plano pago do provedor da API.

**Possíveis ações associadas:**

* Avaliar a contratação de um plano com maior limite de consultas.
* Monitorar o consumo de créditos durante o desenvolvimento.
* Planejar custos caso o projeto evolua além do contexto acadêmico.

---

## Risco 4 – Funcionalidades previstas ainda não implementadas

**Estratégia de resposta:** **Mitigar**

**Justificativa:**
A expansão do escopo pode ser controlada por meio da priorização adequada das funcionalidades e da evolução incremental do produto.

**Possíveis ações associadas:**

* Priorizar funcionalidades por valor de negócio.
* Dividir novas funcionalidades em pequenas entregas.
* Revisar continuamente o roadmap conforme a evolução do projeto.

---

## Risco 5 – Cobertura limitada de testes

**Estratégia de resposta:** **Mitigar**

**Justificativa:**
A ampliação da estratégia de testes reduz a probabilidade de defeitos chegarem às fases finais do desenvolvimento.

**Possíveis ações associadas:**

* Desenvolver testes end-to-end.
* Expandir testes de integração.
* Automatizar a execução da suíte de testes em cada alteração.

---

## Risco 6 – Desempenho abaixo do requisito esperado

**Estratégia de resposta:** **Mitigar**

**Justificativa:**
Existem medidas técnicas que permitem reduzir a probabilidade de degradação do desempenho sem alterar os objetivos do projeto.

**Possíveis ações associadas:**

* Monitorar tempos de resposta.
* Otimizar consultas à API.
* Implementar cache quando aplicável.
* Identificar e corrigir gargalos de desempenho.

---

## Risco 7 – Evolução arquitetural do MVP

**Estratégia de resposta:** **Mitigar**

**Justificativa:**
Embora exista incerteza quanto à evolução da arquitetura, é possível reduzir esse risco adotando uma estrutura modular e realizando refatorações planejadas.

**Possíveis ações associadas:**

* Manter componentes desacoplados.
* Revisar a arquitetura a cada nova release.
* Refatorar módulos conforme o crescimento do sistema.

---

## Risco 8 – Dependência de armazenamento local (localStorage)

**Estratégia de resposta:** **Aceitar**

**Justificativa:**
O uso de localStorage atende aos objetivos do MVP e está alinhado ao escopo atual. Como funcionalidades de sincronização estão previstas apenas para versões futuras, o risco pode ser aceito neste momento.

**Possíveis ações associadas:**

* Documentar a limitação.
* Planejar futura migração para armazenamento persistente em servidor.

---

## Risco 9 – Ausência de autenticação

**Estratégia de resposta:** **Aceitar**

**Justificativa:**
A ausência de autenticação foi uma decisão deliberada para reduzir o escopo do MVP, não comprometendo os objetivos definidos para esta versão.

**Possíveis ações associadas:**

* Registrar essa limitação na documentação.
* Planejar a implementação de autenticação nas próximas releases.

---


## Risco 10 – Ausência de validação em ambiente de produção

**Estratégia de resposta:** **Aceitar**

**Justificativa:**
O deploy em produção está explicitamente fora do escopo do MVP. Dessa forma, não é necessário investir recursos para eliminar esse risco nesta fase do projeto.

**Possíveis ações associadas:**

* Documentar essa limitação.
* Planejar testes em ambiente de produção caso o projeto evolua para uma aplicação real.

---

# Resumo das estratégias propostas

| Risco                                                        | Estratégia de resposta |
| ------------------------------------------------------------ | ---------------------- |
| R1 – Mudanças frequentes de requisitos                       | **Mitigar**            |
| R2 – Dependência da FlightAPI                                | **Mitigar**            |
| R3 – Limitação do plano gratuito da API                      | **Transferir**         |
| R4 – Funcionalidades previstas ainda não implementadas       | **Mitigar**            |
| R5 – Cobertura limitada de testes                            | **Mitigar**            |
| R6 – Desempenho abaixo do esperado                           | **Mitigar**            |
| R7 – Evolução arquitetural do MVP                            | **Mitigar**            |
| R8 – Dependência de localStorage                             | **Aceitar**            |
| R9 – Ausência de autenticação                               | **Aceitar**            |
| R10 – Ausência de validação em ambiente de produção          | **Aceitar**            |

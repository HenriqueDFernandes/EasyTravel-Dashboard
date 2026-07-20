# Comunicação da Situação do Projeto aos Stakeholders

## Status do Projeto

O projeto consiste em um MVP de um dashboard para busca de passagens aéreas, desenvolvido como parte da especialização em Inteligência Artificial Generativa. Nesta etapa, a aplicação já permite realizar buscas de voos por meio de uma API externa, visualizar os resultados e aplicar filtros, atendendo ao objetivo principal do MVP.

O desenvolvimento foi interrompido nesta versão por atender aos objetivos da disciplina. A principal limitação é o uso do plano gratuito da API, que permite até 30 consultas por dia, quantidade suficiente para desenvolvimento e demonstrações, mas inadequada para uso contínuo. Além disso, algumas melhorias de interface e funcionalidades previstas no roadmap ainda não foram implementadas.

## Principais Riscos

Os riscos mais relevantes identificados durante o projeto foram:

- **Mudanças de requisitos**, comuns em projetos MVP, podendo gerar retrabalho conforme a evolução da solução.
- **Dependência da API externa**, cuja indisponibilidade pode comprometer as consultas de voos.
- **Limitação do plano gratuito da API**, restringindo o número diário de buscas.
- **Cobertura parcial de testes**, já que o projeto possui testes unitários, mas ainda não contempla testes end-to-end.
- **Evolução futura da arquitetura**, caso funcionalidades como autenticação, sincronização e notificações sejam incorporadas.

## Ações Adotadas

Para reduzir esses riscos, algumas medidas já foram implementadas:

- modo de demonstração com dados fictícios quando a API está indisponível;
- testes automatizados para as principais funcionalidades;
- documentação técnica atualizada;
- planejamento incremental das próximas funcionalidades, permitindo evolução controlada do sistema.

## Próximos Passos

Caso o projeto tenha continuidade, as principais prioridades são:

- ampliar a cobertura de testes;
- melhorar a interface do usuário;
- implementar cache e mecanismos para reduzir a dependência da API;
- avaliar a contratação de um plano superior da API;
- desenvolver funcionalidades previstas no roadmap, como autenticação, histórico sincronizado e alertas de preço.

## Conclusão

O MVP atingiu seu objetivo principal: validar a viabilidade técnica da solução e entregar uma aplicação funcional para busca de passagens aéreas. Os riscos identificados são compatíveis com esta fase do projeto e possuem estratégias de tratamento definidas. A decisão para os stakeholders consiste em avaliar se os resultados obtidos justificam a evolução do MVP para uma versão mais completa e preparada para uso contínuo.

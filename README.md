# Sistema Gerenciador de Ordens de Serviço para Oficinas Mecânicas

## Sobre o Projeto

O Sistema Gerenciador de Ordens de Serviço foi desenvolvido como projeto da disciplina de Certificadora de Competência Específica.

O objetivo do sistema é auxiliar oficinas mecânicas no gerenciamento de clientes, veículos, ordens de serviço, peças, mão de obra, usuários e informações administrativas da empresa, centralizando todos os dados em uma única plataforma.

A aplicação foi desenvolvida utilizando HTML, CSS, JavaScript, PHP e MySQL, seguindo uma arquitetura cliente-servidor e disponibilizada online para acesso e validação.

---

## Integrantes

- José Victor Garcia Zacarias
- Lucas Nishimura Sato
- Marcos Gustavo Lara
- Rodrigo Tamura Kazuma

### Professor

Francisco Pereira Junior (Thesko)

---

# Problema Identificado

Muitas oficinas mecânicas de pequeno e médio porte ainda realizam o controle de clientes, veículos e serviços utilizando anotações manuais ou planilhas.

Esse método dificulta:

- Controle das ordens de serviço;
- Consulta de histórico dos veículos;
- Organização dos clientes;
- Controle financeiro dos serviços realizados;
- Geração de relatórios;
- Tomada de decisões.

Para solucionar esse problema foi desenvolvido um sistema web completo para gerenciamento das atividades da oficina.

---

# Funcionalidades

## Login

- Autenticação de usuários;
- Controle de acesso ao sistema;
- Sessões protegidas.

---

## Dashboard

Exibe indicadores importantes para acompanhamento da oficina:

- Ordens abertas;
- Ordens concluídas;
- Clientes ativos;
- Veículos cadastrados;
- Ordens aguardando peças;
- Ordens em andamento;
- Ordens prontas para retirada;
- Faturamento total.

---

## Clientes

Permite:

- Cadastrar clientes;
- Editar clientes;
- Excluir clientes;
- Pesquisar clientes;
- Consultar histórico de veículos vinculados.

---

## Veículos

Permite:

- Cadastrar veículos;
- Editar veículos;
- Excluir veículos;
- Pesquisar veículos;
- Vincular veículos aos proprietários.

---

## Ordens de Serviço

Permite:

- Criar ordens de serviço;
- Editar ordens;
- Excluir ordens;
- Alterar status;
- Visualizar detalhes;
- Imprimir ordens.

---

## Itens da Ordem

Permite:

- Adicionar peças;
- Adicionar mão de obra;
- Editar itens;
- Excluir itens;
- Atualizar valores automaticamente.

---

## Relatórios

Disponibiliza:

- Indicadores gráficos;
- Estatísticas das ordens;
- Informações gerenciais da oficina.

---

## Configurações

Permite:

- Alterar dados da oficina;
- Atualizar endereço;
- Atualizar telefone;
- Atualizar e-mail.

As informações são utilizadas automaticamente na impressão das ordens de serviço.

---

# Diferenciais Implementados

Durante o desenvolvimento foram implementados diversos recursos além dos requisitos básicos:

- Dashboard gerencial;
- Controle de usuários;
- Impressão de ordens de serviço;
- Responsividade mobile;
- Hospedagem online;
- Filtros de pesquisa;
- Associação automática entre clientes e veículos;
- Edição completa dos itens da ordem;
- Controle de status das ordens;
- Interface moderna baseada em Glassmorphism.

---

# Arquitetura da Solução

A aplicação utiliza arquitetura cliente-servidor.

Fluxo da aplicação:

Usuário
↓
Frontend (HTML, CSS e JavaScript)
↓
Backend (PHP)
↓
Banco de Dados (MySQL)

O frontend é responsável pela interface e interação com o usuário.

O backend processa as regras de negócio, realiza validações e efetua a comunicação com o banco de dados.

O MySQL armazena todas as informações da aplicação.

---

# Banco de Dados

O sistema utiliza banco de dados relacional MySQL.

Principais entidades:

- Usuários
- Clientes
- Veículos
- Ordens de Serviço
- Itens da Ordem
- Configurações

Relacionamentos:

- Clientes 1:N Veículos
- Clientes 1:N Ordens de Serviço
- Veículos 1:N Ordens de Serviço
- Ordens de Serviço 1:N Itens da Ordem

---

# Tecnologias Utilizadas

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- PHP

## Banco de Dados

- MySQL

## Bibliotecas

- Chart.js
- Lucide Icons

## Ferramentas

- GitHub
- Trello
- phpMyAdmin
- InfinityFree

---

# Responsividade

O sistema foi desenvolvido para funcionar em diferentes dispositivos:

- Desktop
- Notebook
- Tablet
- Smartphone

Foram realizados diversos ajustes para melhorar a experiência em dispositivos móveis, incluindo:

- Sidebar mobile;
- Menu responsivo;
- Tabelas com rolagem horizontal;
- Modais adaptados;
- Ajuste automático de botões e formulários.

---

# Hospedagem

O sistema encontra-se hospedado online para demonstração.

Link:

https://honorioveiculos.site.je

---

# Estrutura do Projeto

```
Certificadora-de-Competencia-Especifica/

├── backend/
│   ├── routes/
│   ├── database/
│   └── config/
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── index.html
│
└── README.md
```

---

# Divisão das Atividades

## José Victor Garcia Zacarias

- Backend;
- Integração frontend/backend;
- Regras de negócio;
- Hospedagem;
- Correções de comunicação com banco de dados.

## Lucas Nishimura Sato

- Modelagem do banco de dados;
- Estruturação das tabelas;
- Relacionamentos;
- Validação dos dados.

## Marcos Gustavo Lara

- Dashboard;
- Relatórios;
- Indicadores gerenciais;
- Testes e validações.

## Rodrigo Tamura Kazuma

- Desenvolvimento do frontend;
- Interface do usuário;
- Responsividade;
- Melhorias visuais e usabilidade.

---

# Status do Projeto

Projeto concluído e funcional.

Versão atual contempla todas as funcionalidades planejadas para a entrega final da disciplina.

---

# Repositório

https://github.com/RodrigoTK0/Certificadora-de-Competencia-Especifica

---

# Licença

Projeto desenvolvido exclusivamente para fins acadêmicos.

# Sistema Gerenciador de Ordens de Serviço (S.O.S)

## Sobre o Projeto

O Sistema Gerenciador de Ordens de Serviço (S.O.S) foi desenvolvido como projeto da disciplina de Certificadora de Competência Específica.

O objetivo do sistema é auxiliar pequenas oficinas mecânicas no gerenciamento de clientes, veículos e ordens de serviço, substituindo métodos manuais como cadernos e planilhas.

O sistema permite:

* Cadastro de clientes
* Cadastro de veículos
* Criação de ordens de serviço
* Adição de peças e mão de obra
* Controle de status das ordens
* Dashboard com métricas
* Relatórios simples
* Login de usuários

---

# Tecnologias Utilizadas

## Front-end

* HTML5
* CSS3
* JavaScript

## Back-end

* PHP

## Banco de Dados

* MySQL

## Ferramentas

* XAMPP
* GitHub
* VS Code
* phpMyAdmin
* Trello

---

# Estrutura do Projeto

```txt
Certificadora-de-Competencia-Especifica
│
├── frontend
│   ├── css
│   ├── js
│   └── index.html
│
├── backend
│   ├── config
│   └── routes
│
├── database
│   └── oficina_os.sql
│
└── README.md
```

---

# Funcionalidades Implementadas

## Login

* Login integrado com banco de dados
* Proteção de rotas
* Logout funcional

## Clientes

* Cadastro de clientes
* Listagem dinâmica
* Integração com MySQL

## Veículos

* Cadastro de veículos
* Associação com clientes
* Listagem dinâmica

## Ordens de Serviço

* Criação de ordens
* Alteração de status
* Adição de peças e mão de obra
* Cálculo automático do valor total
* Visualização dos itens da ordem

## Dashboard

* Total de clientes
* Total de veículos
* Ordens abertas
* Ordens concluídas
* Atualização automática

## Relatórios

* Relatórios gerais do sistema
* Métricas integradas ao banco de dados

---

# Como Executar o Projeto

## 1. Instalar o XAMPP

Baixe e instale o XAMPP:

[https://www.apachefriends.org/pt_br/index.html](https://www.apachefriends.org/pt_br/index.html)

Durante a instalação, marque:

* Apache
* MySQL
* PHP

---

## 2. Clonar o Projeto

```bash
git clone https://github.com/RodrigoTK0/Certificadora-de-Competencia-Especifica.git
```

---

## 3. Colocar o Projeto no htdocs

Mover a pasta do projeto para:

```txt
C:\xampp\htdocs
```

Ficando:

```txt
C:\xampp\htdocs\Certificadora-de-Competencia-Especifica
```

---

## 4. Iniciar Apache e MySQL

Abrir o XAMPP e iniciar:

* Apache
* MySQL

---

## 5. Criar o Banco de Dados

Abrir:

```txt
http://localhost/phpmyadmin
```

Criar um banco chamado:

```txt
oficina_os
```

Depois importar o arquivo:

```txt
database/oficina_os.sql
```

---

## 6. Executar o Sistema

Abrir no navegador:

```txt
http://localhost/Certificadora-de-Competencia-Especifica/frontend/index.html
```

---

# Login de Teste

```txt
E-mail: admin@oficina.com
Senha: 123456
```

---

# Integrantes

* José Victor Garcia
* Marcos Gustavo Lara
* Rodrigo Tamura Kazuma
* Lucas Nishimura

---

# Banco de Dados - oficina_os.sql

```sql
CREATE DATABASE IF NOT EXISTS oficina_os;
USE oficina_os;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco VARCHAR(255)
);

CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    ano INT,
    placa VARCHAR(20),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE ordens_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    descricao TEXT,
    valor_total DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Aberta',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
);

CREATE TABLE itens_ordem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordem_id INT NOT NULL,
    descricao VARCHAR(255),
    tipo ENUM('Peca', 'Mao de obra') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ordem_id) REFERENCES ordens_servico(id)
);

INSERT INTO usuarios (nome, email, senha)
VALUES
('Administrador', 'admin@oficina.com', '123456');

INSERT INTO clientes (nome, telefone, email, endereco)
VALUES
('João Silva', '(43)99999-1111', 'joao@email.com', 'Rua A'),
('Maria Souza', '(43)99999-2222', 'maria@email.com', 'Rua B');

INSERT INTO veiculos (cliente_id, marca, modelo, ano, placa)
VALUES
(1, 'Toyota', 'Corolla', 2020, 'ABC-1234'),
(2, 'Honda', 'Civic', 2019, 'XYZ-9876');

INSERT INTO ordens_servico (cliente_id, veiculo_id, descricao, valor_total, status)
VALUES
(1, 1, 'Troca de óleo', 0, 'Aberta'),
(2, 2, 'Revisão completa', 0, 'Em andamento');
```

---

# Considerações Finais

O projeto foi desenvolvido utilizando arquitetura em camadas, separando frontend, backend e banco de dados.

O sistema busca resolver problemas reais de organização em oficinas mecânicas, oferecendo uma solução simples, moderna e funcional.

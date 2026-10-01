# Projeto: Microsserviços (Catálogo e Pedidos)

Este repositório contém a entrega da atividade prática da Aula 07 sobre Microsserviços e Comunicação entre Serviços.

O projeto demonstra a separação de responsabilidades em dois processos independentes que se comunicam entre si por meio do protocolo HTTP.

---

## Estrutura do Projeto

O sistema é composto por dois microsserviços:

### 1. Catálogo (`catalogo-service`)

Executa na porta `3001` e é responsável por gerenciar e fornecer as informações dos produtos.

### 2. Pedidos (`pedidos-service`)

Executa na porta `3000` e é responsável por processar compras, consultando previamente o serviço de Catálogo para verificar preços e disponibilidade de estoque.

---

## Configuração e Instalação

Para que os serviços funcionem corretamente, é necessário instalar as dependências e configurar as variáveis de ambiente em ambos os microsserviços.

### 1. Configurar o Serviço de Catálogo

Abra um terminal e acesse a pasta do serviço:

```bash
cd catalogo-service
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` baseado no arquivo `.env.example` e configure a porta:

```env
PORT=3001
```

---

### 2. Configurar o Serviço de Pedidos

Abra um novo terminal e acesse a pasta do serviço:

```bash
cd pedidos-service
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` baseado no arquivo `.env.example` contendo a porta do serviço e a URL do serviço de Catálogo:

```env
PORT=3000
CATALOGO_URL=http://localhost:3001
```

---

## Como Executar

Os dois microsserviços devem ser executados simultaneamente em terminais separados.

### Terminal 1 - Serviço de Catálogo

```bash
cd catalogo-service
npm run dev
```

O serviço estará disponível em:

```text
http://localhost:3001
```

### Terminal 2 - Serviço de Pedidos

```bash
cd pedidos-service
npm run dev
```

O serviço estará disponível em:

```text
http://localhost:3000
```

---

## Comunicação entre os Microsserviços

O serviço de Pedidos realiza uma comunicação HTTP com o serviço de Catálogo antes de criar um pedido.

O fluxo funciona da seguinte forma:

```text
Cliente
   |
   v
Pedidos Service
   |
   | HTTP
   v
Catálogo Service
   |
   v
Validação do produto e estoque
   |
   v
Criação do pedido
```

Dessa forma, os serviços possuem responsabilidades separadas e podem funcionar como processos independentes.

---

## Contratos da API

### Catálogo Service

Base URL:

```text
http://localhost:3001
```

### GET `/produtos/:id`

Retorna os detalhes de um produto específico.

#### Respostas

* `200 OK` - Produto encontrado.
* `404 Not Found` - Produto não encontrado no catálogo.

Exemplo:

```http
GET http://localhost:3001/produtos/1
```

---

### Pedidos Service

Base URL:

```text
http://localhost:3000
```

### POST `/pedidos`

Cria um novo pedido após validar o produto e a quantidade disponível em estoque.

#### Corpo da requisição

```json
{
  "produtoId": 1,
  "quantidade": 2
}
```

#### Respostas

* `201 Created` - Pedido validado e criado com sucesso, retornando o cálculo do total.
* `409 Conflict` - O produto existe, porém a quantidade solicitada é superior ao estoque disponível.
* `502 Bad Gateway` - O serviço de Catálogo está indisponível ou ocorreu uma falha na comunicação.
* `504 Gateway Timeout` - O serviço de Catálogo demorou além do tempo permitido para responder.

---

## Testes no Thunder Client

Os testes da API foram realizados utilizando o Thunder Client, contemplando tanto o caminho de sucesso quanto diferentes cenários de erro e falha de comunicação.

### Cenários Testados

| Cenário                         | Método | Endpoint        | Resultado Esperado                         |
| ------------------------------- | ------ | --------------- | ------------------------------------------ |
| Consulta de produto válido      | GET    | `/produtos/1`   | `200 OK`                                   |
| Consulta de produto inexistente | GET    | `/produtos/999` | `404 Not Found`                            |
| Criação de pedido com sucesso   | POST   | `/pedidos`      | `201 Created`                              |
| Quantidade superior ao estoque  | POST   | `/pedidos`      | `409 Conflict`                             |
| Serviço de Catálogo desligado   | POST   | `/pedidos`      | `502 Bad Gateway` ou `504 Gateway Timeout` |

---

## Teste de Criação de Pedido

Para testar a criação de um pedido, utilize:

```http
POST http://localhost:3000/pedidos
```

Com o seguinte corpo:

```json
{
  "produtoId": 1,
  "quantidade": 2
}
```

O pedido deve ser criado somente após o serviço de Pedidos consultar o serviço de Catálogo e verificar a existência do produto, seu preço e a disponibilidade em estoque.

---

## Teste de Falta de Estoque

Para testar o cenário de quantidade superior ao estoque disponível, utilize uma quantidade elevada:

```json
{
  "produtoId": 1,
  "quantidade": 99
}
```

O serviço deve retornar:

```text
409 Conflict
```

Esse comportamento indica que o produto existe, mas não possui estoque suficiente para atender à quantidade solicitada.

---

## Teste de Resiliência

Para testar a resiliência da aplicação:

1. Inicie normalmente o serviço de Pedidos.
2. Inicie o serviço de Catálogo.
3. Confirme que a comunicação entre os dois serviços está funcionando.
4. Pare manualmente o serviço de Catálogo.
5. Envie uma nova requisição `POST /pedidos` para o serviço de Pedidos.

O serviço de Pedidos deve tratar a falha de comunicação e retornar:

```text
502 Bad Gateway
```

ou:

```text
504 Gateway Timeout
```

dependendo do tipo de falha identificada.

---

## Tecnologias Utilizadas

* Node.js
* TypeScript
* Express
* HTTP
* Dotenv
* Thunder Client

---

## Objetivo da Atividade

O projeto tem como objetivo demonstrar, na prática, os conceitos de arquitetura baseada em microsserviços, incluindo:

* Separação de responsabilidades;
* Execução de serviços independentes;
* Comunicação entre serviços por HTTP;
* Consumo de uma API por outro microsserviço;
* Validação de dados antes da criação de pedidos;
* Tratamento de erros;
* Tratamento de indisponibilidade de serviços;
* Testes de diferentes cenários utilizando o Thunder Client.

---

## Conclusão

A aplicação demonstra a comunicação entre dois microsserviços independentes, sendo o `catalogo-service` responsável pelo gerenciamento dos produtos e o `pedidos-service` responsável pelo processamento dos pedidos.

O serviço de Pedidos depende do serviço de Catálogo para validar as informações necessárias antes de concluir uma compra, permitindo demonstrar tanto o fluxo normal da aplicação quanto o tratamento de erros e falhas de comunicação entre os serviços.

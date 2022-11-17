# Projeto Front-end LABTRANS UFSC
 Projeto desenvolvido para o desafio LABTRANS da UFSC para vaga desenvolvedor full-stack.
 
## APIs Banana Ltda

### Objetivo do Documento

Este documento tem como objetivo demonstrar todos os requisitos funcionais e design dos objetos de API e também os campos de tela e funcionalidades.

### Objetivo do Software

APIs Mensagens tem como objetivo disponibilizar a primeira parte das APIs como teste simples como bônus.

APIs Reservas tem como objetivo disponibilizar a funcionalidade principal do desafio que é realizar reservas de salas para a empresa Banana Ltda.

### Detalhes do Software – APIs de CRUD do sistema

Este projeto será comtemplado com APis básicas de cadastro e listagens.
* API de Cadastro de usuários (Utilizaremos o Identity Microsoft).
* APIs de Cadastro, edição, exclusão, listagem de Mensagens.
* APIs de Cadastro, edição, exclusão, listagem de Reservas de salas

### Detalhes do Software – Regras APis Notificações

Esta API será comtemplada com 1 regra de validação.
*	Validação de título não pode ser vazio.

### Detalhes do Software – Regras APis Reservas

Esta API será comtemplada com 6 regras de validação.
*	Validação de local da reserva que não pode ser vazio, sendo notificado através de nosso sistema de notificações.
*	Validação de sala da reserva que não pode ser vazio, sendo notificado através de nosso sistema de notificações.
*	Validação de data inicial da reserva que não pode ser vazio e não pode ser menor que data atual, sendo notificado através de nosso sistema de notificações.
*	Validação de data final da reserva que não pode ser vazio e não pode ser menor que data inicial, sendo notificado através de nosso sistema de notificações.
*	Validação de responsável da reserva que não pode ser vazio, sendo notificado através de nosso sistema de notificações.
*	Validação de choque de horários da reserva em que uma sala não pode ser reservada na mesma data, local e horario de outra reserva, sendo notificado através de nosso sistema de notificações.

### Detalhes da arquitetura

Este projeto front-end conta com uma arquitetura baseada em manipulação de eventos e componentes HTML para o desenvolvimento de uma aplicação SPA somente com  Javascript, Botstrap e jQuery.

### Detalhes técnicos

* API: Projeto Back-end com EndPoints em JSON com JWT
* Linguagem de programação: Javascript
* Biblioteca: jQuery
* Design Components: Bootstrap

### Detalhes técnicos do design da tela

As telas do sistema foram produzidas com a utilização do Bootstrap com responsividade e design simples e atraente, devendo conter os seguintes recursos obrigatórios:
* Botão para cadastrar nova reserva.
* Listagem de reservas (Todos os campos exceto café e quantidade de pessoas).
* Botão de edição de registro na listagem.
* Botão de exclusão de registro na listagem.
* Confirmar exclusão via modal de confirmação.
* Café, se verdadeiro: informar a quantidade de pessoas.

## Modelo de APIs (EndPoints utilizadas no projeto)

#### Booking
* POST - /api/AddBooking
* POST - /api/UpdateBooking
* POST - /api/DeleteBooking
* POST - /api/GetBookingById
* POST - /api/ListBooking
#### Message
* POST - /api/AddMessage
* POST - /api/UpdateMessage
* POST - /api/DeleteMessage
* POST - /api/GetMessageById
* POST - /api/ListMessage
* POST - /api/ListMessageActives
#### Users
* POST - /api/CreateTokenIdentity
* POST - /api/AddUserIdentity

### JSON USERS

```
{
  "email": "string",
  "senha": "string",
  "cpf": "string"
}
```

### JSON MESSAGE

```
{
  "id": 0,
  "titulo": "string",
  "ativo": true,
  "dataCadastro": "2022-11-17T01:29:59.284Z",
  "dataAlteracao": "2022-11-17T01:29:59.284Z"
}
```

### JSON BOOKING

```
{
  "id": 0,
  "local": 1,
  "sala": 1,
  "dataHoraInicio": "2022-11-17T01:30:28.980Z",
  "dataHoraFim": "2022-11-17T01:30:28.980Z",
  "responsavel": "string",
  "cafe": true,
  "qtdPessoasCafe": 0,
  "descricao": "string"
}
```

## Execução do projeto

Para a execução do projeto front-end é necessário um servidor de hospedgem local ou de sua preferência.
* Primeiro subir os arquivos para o seu servidor de hospedagem.
* Depois defina a variável "server" na primeira linha do código dentro do arquivo index.js com as definições do seu servidor de APIs Back-end rodando ex.: (var server = "https://localhost:7197";).
* Por fim, abra o arquivo index.html no seu navegador através da sua hospedagem local ou de sua preferencia. Ex.: (https://localhost/index.html)
* Para utilização da API é necessário cadastrar inicialmente um usuário através do botão "Cadastrar >" na página inicial e, logo após, efetuar login com o mesmo.

### Envolvidos 

**Nome:**	Luiz Fernando da Silva - **Data:**	16/11/2022	- **Status:** Enviado




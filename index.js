var server = "https://localhost:7197";
var contentHome = $('#content-home');
var contentLogin = $('#content-login');
var contentCadastro = $('#content-cadastro');
var contentReservas = $('#content-reservas');
var contentMensagens = $('#content-mensagens');
var buttonLoginLogout = $('#button-login-logout');
var usuarioAutenticado = false;

// Funções para cadastrar e autenticar os usuários da api

$("#submit-form-login").click(function(event) {
    event.preventDefault();

    var options = {};
    options.url = server + "/api/CreateTokenIdentity";
    options.type = "POST";

    var obj = {};
    obj.email = $("#email-form-login").val();
    obj.senha = $("#senha-form-login").val();
    obj.cpf = "string";

    options.data = JSON.stringify(obj);
    options.contentType = "application/json";
    options.dataType = "json";

    options.success = function (obj) {
        response("<h2>Usuário autenticado com sucesso.</h2>", "alert-success");
        sessionStorage.setItem("token", obj);
        hashRotas();
        
        setTimeout(function () {
            sessionStorage.removeItem("token");
            hashRotas();
        }, 5*60*1000);
    };
    options.error = function (a, b) {
        response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
        sessionStorage.removeItem("token");
        hashRotas();
    };
    $.ajax(options);
});

$("#submit-form-cadastro").click(function(event) {
    event.preventDefault();
    
    var options = {};
    options.url = server + "/api/AddUserIdentity";
    options.type = "POST";

    var obj = {};
    obj.email = $("#email-form-cadastro").val();
    obj.senha = $("#senha-form-cadastro").val();
    obj.cpf = $("#cpf-form-cadastro").val();

    options.data = JSON.stringify(obj);
    options.contentType = "application/json";
    options.dataType = "json";

    options.success = function (obj) {
        if (typeof obj == "string") {
            response("<h2>" + obj + "</h2>", "alert-success");
        } else {
            var table = "<table border='0' cellpadding='10'>";
            obj.forEach(function (element) {
                var row = "<tr>";
                row += "<td>";
                row += element.code;
                row += "</td>";
                row += "<td>";
                row += element.description;
                row += "</td>";
                row += "</tr>";
                table += row;
            });
            table += "</table>";
            response(table, "alert-danger");
        }
        hashRotas();
    };
    options.error = function (a, b) {
        response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
        sessionStorage.removeItem("token");
        hashRotas();
    };
    $.ajax(options);
});

// Funções para cadastrar as mensagens e reservas da api

$("#submit-form-reservas").click(function(event) {
    event.preventDefault();

    var options = {};
    var buttonTexto = $("#submit-form-reservas").html();
    if (buttonTexto=="Cadastrar"){
        options.url = server + "/api/AddBooking";
    }else{
        options.url = server + "/api/UpdateBooking";
    }
    options.type = "POST";
    options.beforeSend = function (request) {
        request.setRequestHeader("Authorization",
            "Bearer " + sessionStorage.getItem("token"));
    };

    var obj = {};
    if (buttonTexto!="Cadastrar") obj.id = (parseInt($("#id-form-reservas").val()))?parseInt($("#id-form-reservas").val()):0;
    obj.local = (parseInt($("#local-form-reservas").val()))?parseInt($("#local-form-reservas").val()):null;
    obj.sala = (parseInt($("#sala-form-reservas").val()))?parseInt($("#sala-form-reservas").val()):null;
    obj.dataHoraInicio = $("#inicio-form-reservas").val() + ":00.000Z";
    obj.dataHoraFim = $("#fim-form-reservas").val() + ":00.000Z";
    obj.responsavel = $("#responsavel-form-reservas").val();
    obj.cafe = ($("#cafe-form-reservas").prop( "checked"))? true : false;
    obj.qtdPessoasCafe = (parseInt($("#pessoas-form-reservas").val()))?parseInt($("#pessoas-form-reservas").val()):0;;
    obj.descricao = $("#descricao-form-reservas").val();

    if(validaFormReservas(obj)){
        options.data = JSON.stringify(obj);
        options.contentType = "application/json";
        options.dataType = "json";

        options.success = function (obj) {
            if (obj.length > 0) {
                var texto = "";
                obj.forEach(function (element) {
                    text += "<h2>Erro: " + element.nomePropriedade + " > " + element.mensagem + "</h2>";
                });
                response(texto, "alert-danger");
            } else {
                if (buttonTexto=="Cadastrar"){
                    response("<h2>Cadastrado com sucesso!</h2>", "alert-success");
                } else {
                    response("<h2>Atualizado com sucesso!</h2>", "alert-success");
                }
                $("#edita-reservas").hide();
                $("#lista-reservas").show();
            }
            hashRotas();
        };
        options.error = function (a, b) {
            response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
            sessionStorage.removeItem("token");
            hashRotas();
        };
        $.ajax(options);
    }
});

$("#button-cancelar-reservas").click(function(event) {
    limparFormReservas();
    $("#edita-reservas").hide();
    $("#lista-reservas").show();
});

$("#button-cadastro-reservas").click(function(event) {
    limparFormReservas();
    $("#edita-reservas").show();
    $("#lista-reservas").hide();
});

function exibeQtdPessoas(){
    if ($("#cafe-form-reservas").prop( "checked")){
        $("#pessoas-form-reservas").show();
    } else {
        $("#pessoas-form-reservas").hide();
    }
}

function limparFormReservas() {
    $(".input-reserva-id").hide();
    $("#id-form-reservas").val('');
    $("#local-form-reservas").val('');;
    $("#sala-form-reservas").val('');
    $("#inicio-form-reservas").val('');
    $("#fim-form-reservas").val('');
    $("#responsavel-form-reservas").val('');
    $("#cafe-form-reservas").prop( "checked",false);
    $("#pessoas-form-reservas").val('');
    $("#descricao-form-reservas").val('');
    $("#submit-form-reservas").html("Cadastrar");
    exibeQtdPessoas();
}

function validaFormReservas(obj) {
    var retorno = true;
    var texto = "";
    if (!obj.local) {
        texto += "<h2>Erro: Local > Campo obrigatório</h2>";
        retorno = false;
    }
    if (!obj.sala) {
        texto += "<h2>Erro: Sala > Campo obrigatório</h2>";
        retorno = false;
    }
    if (obj.dataHoraInicio == ":00.000Z") {
        texto += "<h2>Erro: Início > Campo obrigatório</h2>";
        retorno = false;
    } else if (Date.parse(obj.dataHoraInicio) <= Date.now()) {
        texto += "<h2>Erro: Início > A data inicial não pode ser menor que a atual</h2>";
        retorno = false;
    } else if (obj.dataHoraFim == ":00.000Z") {
        texto += "<h2>Erro: Fim > Campo obrigatório</h2>";
        retorno = false;
    } else if (Date.parse(obj.dataHoraFim) <= Date.parse(obj.dataHoraInicio)) {
        texto += "<h2>Erro: Fim >  A data final não pode ser menor que a inicial</h2>";
        retorno = false;
    }
    if (!obj.responsavel) {
        texto += "<h2>Erro: Responsável > Campo obrigatório</h2>";
        retorno = false;
    }
    if (obj.cafe && !obj.qtdPessoasCafe) {
        texto += "<h2>Erro: Quantidade de pessoas > Campo obrigatório</h2>";
        retorno = false;
    }
    if (!retorno) {
        response(texto, "alert-danger");
    }
    return retorno;
}

$("#submit-form-mensagens").click(function(event) {
    event.preventDefault();

    var options = {};
    var buttonTexto = $("#submit-form-mensagens").html();
    if (buttonTexto=="Cadastrar"){
        options.url = server + "/api/AddMessage";
    } else {
        options.url = server + "/api/UpdateMessage";
    }
    options.type = "POST";
    options.beforeSend = function (request) {
        request.setRequestHeader("Authorization",
            "Bearer " + sessionStorage.getItem("token"));
    };

    var obj = {};        
    if (buttonTexto!="Cadastrar")obj.id = parseInt($("#id-form-mensagens").val());
    obj.titulo = $("#titulo-form-mensagens").val();
    obj.ativo = ($("#ativo-form-mensagens").prop( "checked"))? true : false;

    if(validaFormMensagens(obj)){
        options.data = JSON.stringify(obj);
        options.contentType = "application/json";
        options.dataType = "json";

        options.success = function (obj) {
            if (obj.length > 0) {
                var texto = "";
                obj.forEach(function (element) {
                    text += "<h2>Erro: " + element.nomePropriedade + " > " + element.mensagem + "</h2>";
                });
                response(texto, "alert-danger");
            } else {
                if (buttonTexto=="Cadastrar"){
                    response("<h2>Cadastrado com sucesso!</h2>", "alert-success");
                } else {
                    response("<h2>Atualizado com sucesso!</h2>", "alert-success");
                }
                $("#edita-mensagens").hide();
                $("#lista-mensagens").show();
            }
            hashRotas();
        };
        options.error = function (a, b) {
            response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
            sessionStorage.removeItem("token");
            hashRotas();
        };
        $.ajax(options);
    }
});

$("#button-cancelar-mensagens").click(function(event) {
    limparFormMensagens();
    $("#edita-mensagens").hide();
    $("#lista-mensagens").show();
});

$("#button-cadastro-mensagens").click(function(event) {
    limparFormMensagens();
    $("#edita-mensagens").show();
    $("#lista-mensagens").hide();
});

function limparFormMensagens() {
    $("#id-form-mensagens").val('').hide();
    $("#ativo-form-mensagens").prop("checked", false);
    $(".input-message-ativo").hide();
    $("#titulo-form-mensagens").val('');
    $("#submit-form-mensagens").html("Cadastrar");
}

function validaFormMensagens(obj) {
    var retorno = true;
    var texto = "";
    if (!obj.titulo) {
        texto += "<h2>Erro: Título > Campo obrigatório</h2>";
        retorno = false;
    }
    if (!retorno) {
        response(texto, "alert-danger");
    }
    return retorno;
}

// Funções para exibir as listas das mensagens e reservas da api

function carregarReservas() {
    var options = {};
    options.url = server + "/api/ListBooking";
    options.type = "POST";
    options.beforeSend = function (request) {
        request.setRequestHeader("Authorization",
            "Bearer " + sessionStorage.getItem("token"));
    };
    options.dataType = "json";
    options.success = function (data) {
        var table = "<div class='table-responsive'><table id='table-list-reservas' class='table table-striped table-sm'>";
            table += "<thead><tr><td>ID</td><td>LOCAL</td><td>SALA</td><td>INÍCIO</td><td>FIM</td><td>RESPONSÁVEL</td><td style='width:50%'>DESCRIÇÃO</td><td>EDITAR</td><td>EXCLUIR</td></tr></thead><tbody>";
        data.forEach(function (element) {
            var row = "<tr>";
            row += "<td>";
            row += element.id;
            row += "</td>";
            row += "<td>";
            row += element.local;
            row += "</td>";
            row += "<td>";
            row += element.sala;
            row += "</td>";
            row += "<td>";
            row += element.dataHoraInicio;
            row += "</td>";
            row += "<td>";
            row += element.dataHoraFim;
            row += "</td>";
            row += "<td>";
            row += element.responsavel;
            row += "</td>";
            row += "<td>";
            row += element.descricao;
            row += "</td>";
            row += "<td>";
            row += "<a class='editar' onClick='editarBooking(" + element.id + ");'>editar</a>";
            row += "</td>";
            row += "<td>";
            row += "<a class='excluir' onClick='excluirBooking(" + element.id + ");'>excluir</a>";
            row += "</td>";
            row += "</tr>";
            table += row;
        });
        table += "</tbody></table></div>";
        $("#lista-reservas > div.response").html(table);
        $("#lista-reservas").show();
    };
    options.error = function (a, b) {
        response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
        sessionStorage.removeItem("token");
    };
    $.ajax(options);
}

function carregarMensagens() {
    var options = {};
    options.url = server + "/api/ListMessage";
    options.type = "POST";
    options.beforeSend = function (request) {
        request.setRequestHeader("Authorization",
            "Bearer " + sessionStorage.getItem("token"));
    };
    options.dataType = "json";
    options.success = function (data) {
        var table = "<div class='table-responsive'><table id='table-list-messages' class='table table-striped table-sm'>";
            table += "<thead><tr><td>ID</td><td>ATIVO</td><td style='width:70%'>TÍTULO</td><td>EDITAR</td><td>EXCLUIR</td></tr></thead><tbody>";
        data.forEach(function (element) {
            var row = "<tr>";
            row += "<td>";
            row += element.id;
            row += "</td>";
            row += "<td>";
            row += element.ativo;
            row += "</td>";
            row += "<td>";
            row += element.titulo;
            row += "</td>";
            row += "<td>";
            row += "<a class='editar' onClick='editarMessage(" + element.id + ");'>editar</a>";
            row += "</td>";
            row += "<td>";
            row += "<a class='excluir' onClick='excluirMessage(" + element.id + ");'>excluir</a>";
            row += "</td>";
            row += "</tr>";
            table += row;
        });
        table += "</tbody></table></div>";
        $("#lista-mensagens > div.response").html(table);
        $("#lista-mensagens").show();
    };
    options.error = function (a, b) {
        response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
        sessionStorage.removeItem("token");
    };
    $.ajax(options);
}

// Funções para excluir as mensagens e reservas da api

function excluirMessage(id) {
    if(confirm("Deseja realmente excluir?")){
        var options = {};
        options.url = server + "/api/DeleteMessage";
        options.type = "POST";
        options.beforeSend = function (request) {
            request.setRequestHeader("Authorization",
                "Bearer " + sessionStorage.getItem("token"));
        };
        var obj = {};
        obj.id = id;

        options.data = JSON.stringify(obj);
        options.contentType = "application/json";
        options.dataType = "json";

        options.success = function (obj) {
            response("<h2>Excluído com sucesso!</h2>", "alert-success");
            hashRotas();
        };
        options.error = function (a, b) {
            response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
            sessionStorage.removeItem("token");
            hashRotas();
        };
        $.ajax(options);
    }
}

function excluirBooking(id) {
    if(confirm("Deseja realmente excluir?")){
        var options = {};
        options.url = server + "/api/DeleteBooking";
        options.type = "POST";
        options.beforeSend = function (request) {
            request.setRequestHeader("Authorization",
                "Bearer " + sessionStorage.getItem("token"));
        };
        var obj = {};
        obj.id = id;

        options.data = JSON.stringify(obj);
        options.contentType = "application/json";
        options.dataType = "json";

        options.success = function (obj) {
            response("<h2>Excluído com sucesso!</h2>", "alert-success");
            hashRotas();
        };
        options.error = function (a, b) {
            response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
            sessionStorage.removeItem("token");
            hashRotas();
        };
        $.ajax(options);
    }
}

// Funções para editar as mensagens e reservas da api

function editarMessage(id)  {
    var options = {};
    options.url = server + "/api/GetMessageById";
    options.type = "POST";
    options.beforeSend = function (request) {
        request.setRequestHeader("Authorization",
            "Bearer " + sessionStorage.getItem("token"));
    };
    var obj = {};
    obj.id = id;

    options.data = JSON.stringify(obj);
    options.contentType = "application/json";
    options.dataType = "json";

    options.success = function (obj) {         
        $("#id-form-mensagens").val(obj.id).show();
        $("#titulo-form-mensagens").val(obj.titulo);
        (obj.ativo)? $("#ativo-form-mensagens").prop( "checked", true ) : $("#ativo-form-mensagens").prop( "checked", false );
        $(".input-message-ativo").show();

        $("#submit-form-mensagens").html("Atualizar");

        $("#edita-mensagens").show();
        $("#lista-mensagens").hide();
    };
    options.error = function (a, b) {
        response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
        sessionStorage.removeItem("token");
        hashRotas();
    };
    $.ajax(options);
}

function editarBooking(id)  {
    var options = {};
    options.url = server + "/api/GetBookingById";
    options.type = "POST";
    options.beforeSend = function (request) {
        request.setRequestHeader("Authorization",
            "Bearer " + sessionStorage.getItem("token"));
    };
    var obj = {};
    obj.id = id;

    options.data = JSON.stringify(obj);
    options.contentType = "application/json";
    options.dataType = "json";

    options.success = function (obj) {
        $(".input-reserva-id").show();
        $("#id-form-reservas").val(obj.id);
        $("#local-form-reservas").val(obj.local);
        $("#sala-form-reservas").val(obj.sala);
        $("#inicio-form-reservas").val(obj.dataHoraInicio);
        $("#fim-form-reservas").val(obj.dataHoraFim);
        $("#responsavel-form-reservas").val(obj.responsavel);
        (obj.cafe)? $("#cafe-form-reservas").prop("checked", true) : $("#cafe-form-reservas").prop("checked", false);
        $("#pessoas-form-reservas").val(obj.qtdPessoasCafe);
        $("#descricao-form-reservas").val(obj.descricao);

        $("#submit-form-reservas").html("Atualizar");
        exibeQtdPessoas();

        $("#edita-reservas").show();
        $("#lista-reservas").hide();
    };
    options.error = function (a, b) {
        response("<h1>Erro ao chamar a Web API! (" + b + " - " + a.status + ")</h1>", "alert-danger");
        sessionStorage.removeItem("token");
        hashRotas();
    };
    $.ajax(options);
}

// Funções para exibir respostas do sistema

function response(msg, cssclass = "alert-info") {
    $("#response > div").html(msg);
    $("#response").attr("class", cssclass).show();
    setTimeout(function () {
        $("#response").hide();
    }, 5000);
}

$("#fechar-response").click(function() {
    $("#response").hide();
});

// Funções para carregamento inicial e definição das rotas do sistema

window.addEventListener('hashchange', function() {
    hashRotas();
});

$(document).ready(function () {
    hashRotas();
});

function changeHash(hash) {
    window.location.hash = hash;
}

function hashRotas() {
    var hash = new URL(document.URL).hash;

    if (hash == '#sair.html') {
        sessionStorage.removeItem("token");
        response("<h2>Usuário saiu com sucesso.</h2 >", "alert-success");
    }

    if(sessionStorage.getItem("token")){
        usuarioAutenticado = true;
        buttonLoginLogout.text("Sair").attr("href", "#sair.html");
        $('.showIsLogged').show();
        $('.showIsNotLogged').hide();
    } else {
        usuarioAutenticado = false;
        buttonLoginLogout.text("Entrar").attr("href", "#entrar.html");
        $('.showIsLogged').hide();
        $('.showIsNotLogged').show();
    }

    if (hash == '#index.html' || hash == '#sair.html' || hash == '') {
        contentHome.show();
        contentLogin.hide();
        contentCadastro.hide();
        contentReservas.hide();
        contentMensagens.hide();
    }
    else if (hash == '#entrar.html') {
        contentHome.hide();
        contentLogin.show();
        contentCadastro.hide();
        contentReservas.hide();
        contentMensagens.hide();
    }
    else if (hash == '#cadastro.html') {
        contentHome.hide();
        contentLogin.hide();
        contentCadastro.show();
        contentReservas.hide();
        contentMensagens.hide();
    }
    else if (hash == '#reservas.html') {
        if(usuarioAutenticado){
            contentHome.hide();
            contentLogin.hide();
            contentCadastro.hide();
            contentReservas.show();
            contentMensagens.hide();
            $("#edita-reservas").hide();
            $("#lista-reservas").show();
            limparFormReservas();
            carregarReservas();
        } else {
            changeHash('#entrar.html');
        }
    }
    else if (hash == '#mensagens.html') {
        if(usuarioAutenticado){
            contentHome.hide();
            contentLogin.hide();
            contentCadastro.hide();
            contentReservas.hide();
            contentMensagens.show();
            $("#edita-mensagens").hide();
            $("#lista-mensagens").show();
            limparFormMensagens();
            carregarMensagens();
        } else {
            changeHash('#entrar.html');
        }
    } else {
        response("<h1>Erro 404, Página não encontrada!</h1>", "alert-danger");
        changeHash('#index.html');
    }
}
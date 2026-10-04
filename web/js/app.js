const lista = document.querySelector("#filmes");

const carregarFilmes = () => {
			$.ajax({
				url: "/filmes",
				success: (filmes) => {
					let conteudo = "";
					for (let f of filmes) {
						conteudo += ` <article class="filme" data-genero="${f.genero}" data-busca="${f.titulo} ${f.nota} ${f.ano} ${f.genero}">`;
						conteudo += `<div class="poster poster1"><div class="poster-conteudo"><small>STARLUME ORIGINAL ARCHIVE</small><h3>${f.titulo.toUpperCase} · ${f.nota}</h3><p>${f.ano} · ${f.genero.toUpperCase}</p></div></div>`
                        conteudo += `<div class="dados-filme"><small>${f.ano}</small><h4>${f.titulo.toUpperCase} </h4><p>${f.genero}</p><div class="acoes"><button class="editar">EDITAR</button><button class="excluir">EXCLUIR</button></div></div></article>`
					}
					$("#listaFilmes").html(conteudo);
				}
			});
		}
        
		
    
const incluirFilme = () => {
			titulo = $("#titulo").val();
            genero = $("#genero").val().trim().split();
			nota = Number($("#nota").val());
            ano = Number($("#ano").val());
			dados = JSON.stringify({id: null, titulo: titulo, genero: genero, nota: nota, ano: ano});
			$.ajax({
				url: "/filmes", type: "POST",
				data: dados,
				dataType: "json",
				contentType: "application/json",
				success: (data) => {
					console.log(data);
					carregarFilmes();
				}
			});
		}

/* ==========================================
   STARLUME
   JAVASCRIPT
========================================== */

/* ==========================================
   ELEMENTOS
========================================== */

const campoBusca = document.getElementById("campoBusca");
const categorias = document.querySelectorAll(".categoria");
const filmes = document.querySelectorAll(".filme");
const contadorResultados = document.getElementById("contadorResultados");
const formFilme = document.getElementById("formFilme");
const campoTitulo = document.getElementById("titulo");
const campoAno = document.getElementById("ano");
const campoGenero = document.getElementById("genero");
const listaFilmes = document.getElementById("listaFilmes");
const contadorFilmes = document.querySelector(".contador-filmes");


/* ==========================================
   VARIÁVEL DO FILTRO
========================================== */

let generoSelecionado = "todos";


/* ==========================================
   BUSCA DE FILMES
========================================== */

function filtrarFilmes(busca) {
    const textoBusca = busca
        .toLowerCase()
        .trim();
    console.log(textoBusca);
    let quantidadeVisivel = 0;

    filmes.forEach(function (filme) {
            const genero = filme.dataset.genero;
            const texto = filme.dataset.busca;

            if(textoBusca != "todos"){


                if (genero == textoBusca) {

                    filme.style.display = "flex";

                    quantidadeVisivel++;

                } else {

                    filme.style.display = "none";

                }
            }else
        filme.style.display = 'flex';
    }
    );


    contadorResultados.textContent =
        String(quantidadeVisivel).padStart(2, "0") +
        " TÍTULOS ENCONTRADOS";

}


/* ==========================================
   CAMPO DE BUSCA
========================================== */

campoBusca.addEventListener("input", function () {

    console.log(campoBusca.value);
    filtrarFilmes(campoBusca.value);

});


/* ==========================================
   FILTROS POR GÊNERO
========================================== */

categorias.forEach(function (categoria) {

    categoria.addEventListener("click", function () {

        categorias.forEach(function (item) {

            item.classList.remove("categoria-ativa");

        });


        categoria.classList.add("categoria-ativa");


        generoSelecionado =
            categoria.dataset.genero;


        filtrarFilmes(generoSelecionado);

    });

});


/* ==========================================
   ATALHO CTRL + K / CMD + K
========================================== */

document.addEventListener("keydown", function (event) {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        campoBusca.focus();

    }

});


/* ==========================================
   VALIDAR ANO
========================================== */

campoAno.addEventListener("input", function () {

    /*
        Remove qualquer coisa que não seja número.
        Assim o usuário pode digitar:

        1987
        1995
        2026

        mas não:

        ABCD
        19A7
        198X
    */

    campoAno.value =
        campoAno.value.replace(/\D/g, "");

});



/* ==========================================
   CADASTRAR FILME
========================================== */

formFilme.addEventListener("submit", function (event) {

    event.preventDefault();


    const titulo =
        campoTitulo.value.trim();
    const ano =
        campoAno.value.trim();
    const genero =
        campoGenero.value.trim();


    /* =========================
       VALIDAÇÕES
    ========================= */

    if (!titulo || !ano || !genero) {

        alert("Preencha todos os campos.");

        return;

    }


    if (ano.length !== 4) {

        alert("Digite um ano válido com 4 números.");

        campoAno.focus();

        return;

    }


    const anoNumerico =
        Number(ano);


    if (
        anoNumerico < 1888 ||
        anoNumerico > 2100
    ) {

        alert("Digite um ano válido.");

        campoAno.focus();

        return;

    }


    /* ==========================================
       CRIAR NOVO FILME
    ========================================== */

    const novoFilme =
        document.createElement("article");


    novoFilme.classList.add("filme");


    const generoNormalizado =
        genero.toLowerCase();


    novoFilme.dataset.genero =
        generoNormalizado;


    novoFilme.dataset.busca =
        `${titulo} ${ano} ${genero}`.toLowerCase();


    novoFilme.innerHTML = `

        <div class="poster poster1">

            <div class="poster-conteudo">

                <small>
                    STARLUME ORIGINAL ARCHIVE
                </small>

                <h3>
                    ${titulo.toUpperCase()}
                </h3>

                <p>
                    ${ano} · ${genero.toUpperCase()}
                </p>

            </div>

        </div>


        <div class="dados-filme">

            <small>
                ${ano}
            </small>

            <h4>
                ${titulo}
            </h4>

            <p>
                ${genero}
            </p>

            <div class="acoes">

                <button class="detalhes">
                    DETALHES
                </button>

                <button class="editar">
                    EDITAR
                </button>

                <button class="excluir">
                    EXCLUIR
                </button>

            </div>

        </div>

    `;


    listaFilmes.appendChild(novoFilme);


    /* ==========================================
       ATUALIZAR CONTADOR
    ========================================== */

    atualizarContador();


    /* ==========================================
       LIMPAR FORMULÁRIO
    ========================================== */

    formFilme.reset();


    /* ==========================================
       MENSAGEM
    ========================================== */

    alert(
        `O filme "${titulo}" foi cadastrado com sucesso!`
    );


    /* ==========================================
       VOLTAR PARA O CATÁLOGO
    ========================================== */

    document
        .getElementById("filmes")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* ==========================================
   ATUALIZAR CONTADOR
========================================== */

function atualizarContador() {

    const total =
        document.querySelectorAll(".filme").length;


    if (contadorFilmes) {

        contadorFilmes.textContent =
            String(total).padStart(2, "0");

    }

}


/* ==========================================
   BOTÕES DOS FILMES
========================================== */

document.addEventListener("click", function (event) {


    /* =========================
       DETALHES
    ========================= */

    if (
        event.target.classList.contains("detalhes")
    ) {

        const filme =
            event.target.closest(".filme");

        const titulo =
            filme.querySelector("h4").textContent;

        const ano =
            filme.querySelector(".dados-filme > small").textContent;

        const descricao =
            filme.querySelector(".dados-filme p").textContent;


        alert(
            `FILME\n\n` +
            `${titulo}\n\n` +
            `Ano: ${ano}\n` +
            `${descricao}`
        );

    }


    /* =========================
       EXCLUIR
    ========================= */

    if (
        event.target.classList.contains("excluir")
    ) {

        const filme =
            event.target.closest(".filme");

        const titulo =
            filme.querySelector("h4").textContent;


        const confirmar =
            confirm(
                `Deseja realmente excluir "${titulo}"?`
            );


        if (confirmar) {

            filme.remove();

            atualizarContador();

            filtrarFilmes();

        }

    }


    /* =========================
       EDITAR
    ========================= */

    if (
        event.target.classList.contains("editar")
    ) {

        const filme =
            event.target.closest(".filme");

        const titulo =
            filme.querySelector("h4").textContent;

        alert(
            `Área de edição de "${titulo}".\n\n` +
            `A funcionalidade de edição pode ser conectada posteriormente ao banco de dados.`
        );

    }

});


/* ==========================================
   MENU ATIVO AO CLICAR
========================================== */

const linksMenu =
    document.querySelectorAll("nav a");


linksMenu.forEach(function (link) {

    link.addEventListener("click", function () {

        linksMenu.forEach(function (item) {

            item.classList.remove("ativo");

        });


        link.classList.add("ativo");

    });

});


/* ==========================================
   ATUALIZAÇÃO INICIAL
========================================== */

atualizarContador();
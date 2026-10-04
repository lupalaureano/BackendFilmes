const lista = document.querySelector("#filmes");

const formatarGenero = (genero) => {
	if (Array.isArray(genero)) {
		return genero.join(", ");
	}
	return genero ?? "";
};

const carregarFilmes = () => {
	$.ajax({
		url: "/filmes",
		success: (filmes) => {
			let conteudo = "";
			for (let f of filmes) {
				const generoTexto = formatarGenero(f.genero);
				const generoData = Array.isArray(f.genero)
					? f.genero.join(" ").toLowerCase()
					: String(f.genero ?? "").toLowerCase();
				const titulo = f.titulo ?? "";
				const busca = `${titulo} ${f.nota} ${f.ano} ${generoTexto}`.toLowerCase();

				conteudo += `<article class="filme" data-id="${f.id}" data-genero="${generoData}" data-nota="${f.nota}" data-busca="${busca}">`;
				conteudo += `<div class="poster poster1"><div class="poster-conteudo"><small>STARLUME ORIGINAL ARCHIVE</small><h3>${titulo.toUpperCase()} · ${f.nota}</h3><p>${f.ano} · ${generoTexto.toUpperCase()}</p></div></div>`;
				conteudo += `<div class="dados-filme"><small>${f.ano}</small><h4>${titulo}</h4><p>${generoTexto}</p><div class="acoes"><button class="detalhes">DETALHES</button><button class="editar">EDITAR</button><button class="excluir">EXCLUIR</button></div></div></article>`;
			}
			$("#listaFilmes").html(conteudo);
			atualizarContador();
			filtrarFilmes(generoSelecionado === "todos" ? "todos" : generoSelecionado);
		},
		error: () => {
			console.error("Não foi possível carregar os filmes da API.");
		}
	});
};
        
		
    
const incluirFilme = (filme) => {
	return $.ajax({
		url: "/filmes",
		type: "POST",
		data: JSON.stringify(filme),
		dataType: "json",
		contentType: "application/json"
	});
};

const excluirFilme = (id) => {
	return $.ajax({
		url: `/filmes/${id}`,
		type: "DELETE"
	});
};

const atualizarFilme = (id, filme) => {
	return $.ajax({
		url: `/filmes/${id}`,
		type: "PUT",
		data: JSON.stringify(filme),
		dataType: "json",
		contentType: "application/json"
	});
};

/* ==========================================
   MODAL
========================================== */

const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");
const modalMensagem = document.getElementById("modalMensagem");
const modalConfirmar = document.getElementById("modalConfirmar");
const modalCancelar = document.getElementById("modalCancelar");
const modalRotulo = document.getElementById("modalRotulo");

let modalResolver = null;

const fecharModal = (resultado = false) => {
	if (!modal || modal.hidden) {
		return;
	}
	modal.hidden = true;
	document.body.style.overflow = "";
	if (modalResolver) {
		const resolver = modalResolver;
		modalResolver = null;
		resolver(resultado);
	}
};

const abrirModal = ({
	titulo,
	mensagem,
	rotulo = "STARLUME",
	confirmarTexto = "OK",
	cancelarTexto = "CANCELAR",
	mostrarCancelar = false
}) => {
	return new Promise((resolve) => {
		fecharModal(false);
		modalResolver = resolve;

		modalRotulo.textContent = rotulo;
		modalTitulo.textContent = titulo;
		modalMensagem.textContent = mensagem;
		modalConfirmar.textContent = confirmarTexto;
		modalCancelar.textContent = cancelarTexto;
		modalCancelar.hidden = !mostrarCancelar;

		modal.hidden = false;
		document.body.style.overflow = "hidden";
		modalConfirmar.focus();
	});
};

const mostrarModal = (mensagem, titulo = "AVISO") =>
	abrirModal({
		titulo,
		mensagem,
		confirmarTexto: "OK",
		mostrarCancelar: false
	});

const confirmarModal = (mensagem, titulo = "CONFIRMAR") =>
	abrirModal({
		titulo,
		mensagem,
		confirmarTexto: "CONFIRMAR",
		cancelarTexto: "CANCELAR",
		mostrarCancelar: true
	});

modalConfirmar.addEventListener("click", () => fecharModal(true));
modalCancelar.addEventListener("click", () => fecharModal(false));

modal.addEventListener("click", (event) => {
	if (event.target.matches("[data-modal-fechar]")) {
		fecharModal(false);
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && modal && !modal.hidden) {
		fecharModal(false);
	}
});

/* ==========================================
   STARLUME
   JAVASCRIPT
========================================== */

/* ==========================================
   ELEMENTOS
========================================== */

const campoBusca = document.getElementById("campoBusca");
const categorias = document.querySelectorAll(".categoria");
const contadorResultados = document.getElementById("contadorResultados");
const formFilme = document.getElementById("formFilme");
const campoTitulo = document.getElementById("titulo");
const campoAno = document.getElementById("ano");
const campoGenero = document.getElementById("genero");
const campoNota = document.getElementById("nota");
const listaFilmes = document.getElementById("listaFilmes");
const contadorFilmes = document.querySelector(".contador-filmes");
const tituloFormulario = document.querySelector("#cadastro h2");
const botaoFormulario = document.getElementById("btn_incluir");

let filmeEmEdicao = null;

const limparModoEdicao = () => {
	filmeEmEdicao = null;
	if (tituloFormulario) {
		tituloFormulario.textContent = "CADASTRAR FILME";
	}
	if (botaoFormulario) {
		botaoFormulario.textContent = "CADASTRAR FILME";
	}
};

const entrarModoEdicao = (filme) => {
	filmeEmEdicao = filme.dataset.id;
	campoTitulo.value = filme.querySelector("h4").textContent.trim();
	campoAno.value = filme.querySelector(".dados-filme > small").textContent.trim();
	campoGenero.value = filme.querySelector(".dados-filme p").textContent.trim();
	campoNota.value = filme.dataset.nota ?? "";

	if (tituloFormulario) {
		tituloFormulario.textContent = "EDITAR FILME";
	}
	if (botaoFormulario) {
		botaoFormulario.textContent = "SALVAR ALTERAÇÕES";
	}

	document
		.getElementById("cadastro")
		.scrollIntoView({
			behavior: "smooth"
		});
	campoTitulo.focus();
};


/* ==========================================
   VARIÁVEL DO FILTRO
========================================== */

let generoSelecionado = "todos";

const normalizarTexto = (texto) =>
	String(texto ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim();


/* ==========================================
   BUSCA DE FILMES
========================================== */

function filtrarFilmes(busca) {
	const textoBusca = normalizarTexto(busca);
	let quantidadeVisivel = 0;
	const filmes = document.querySelectorAll(".filme");

	filmes.forEach(function (filme) {
		const genero = normalizarTexto(filme.dataset.genero);
		const texto = normalizarTexto(filme.dataset.busca);
		let visivel = false;

		if (!textoBusca || textoBusca === "todos") {
			visivel = true;
		} else if (generoSelecionado !== "todos" && textoBusca === normalizarTexto(generoSelecionado)) {
			visivel = genero.split(/\s+/).includes(textoBusca);
		} else {
			visivel = texto.includes(textoBusca);
		}

		filme.style.display = visivel ? "flex" : "none";
		if (visivel) {
			quantidadeVisivel++;
		}
	});

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

formFilme.addEventListener("submit", async function (event) {

    event.preventDefault();

    const titulo = campoTitulo.value.trim();
    const ano = campoAno.value.trim();
    const genero = campoGenero.value.trim();
    const notaTexto = campoNota.value.trim().replace(",", ".");

    if (!titulo || !ano || !genero || !notaTexto) {
        await mostrarModal("Preencha todos os campos.", "CAMPOS OBRIGATÓRIOS");
        return;
    }

    if (ano.length !== 4) {
        await mostrarModal("Digite um ano válido com 4 números.", "ANO INVÁLIDO");
        campoAno.focus();
        return;
    }

    const anoNumerico = Number(ano);

    if (anoNumerico < 1888 || anoNumerico > 2100) {
        await mostrarModal("Digite um ano válido.", "ANO INVÁLIDO");
        campoAno.focus();
        return;
    }

    const nota = Number(notaTexto);

    if (Number.isNaN(nota) || nota < 0 || nota > 10) {
        await mostrarModal("Digite uma nota válida entre 0 e 10.", "NOTA INVÁLIDA");
        campoNota.focus();
        return;
    }

    const generos = genero
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const filme = {
        titulo: titulo,
        genero: generos,
        nota: nota,
        ano: anoNumerico
    };

    const requisicao = filmeEmEdicao
        ? atualizarFilme(filmeEmEdicao, filme)
        : incluirFilme(filme);

    const mensagemSucesso = filmeEmEdicao
        ? `O filme "${titulo}" foi atualizado com sucesso!`
        : `O filme "${titulo}" foi cadastrado com sucesso!`;

    const mensagemErro = filmeEmEdicao
        ? "Não foi possível atualizar o filme. Tente novamente."
        : "Não foi possível cadastrar o filme. Tente novamente.";

    try {
        await requisicao;
        formFilme.reset();
        limparModoEdicao();
        carregarFilmes();
        await mostrarModal(mensagemSucesso, "SUCESSO");
        document
            .getElementById("filmes")
            .scrollIntoView({
                behavior: "smooth"
            });
    } catch (erro) {
        await mostrarModal(mensagemErro, "ERRO");
    }

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

document.addEventListener("click", async function (event) {


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

        const nota = filme.dataset.nota ?? "-";

        await mostrarModal(
            `${titulo}\n\nAno: ${ano}\nNota: ${nota}\nGênero: ${descricao}`,
            "DETALHES DO FILME"
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

        const id = filme.dataset.id;
        const titulo =
            filme.querySelector("h4").textContent;

        if (!id) {
            await mostrarModal(
                "Não foi possível identificar o filme para exclusão.",
                "ERRO"
            );
            return;
        }

        const confirmar = await confirmarModal(
            `Deseja realmente excluir "${titulo}"?`,
            "EXCLUIR FILME"
        );

        if (!confirmar) {
            return;
        }

        try {
            await excluirFilme(id);
            carregarFilmes();
            await mostrarModal(
                `O filme "${titulo}" foi excluído.`,
                "SUCESSO"
            );
        } catch (erro) {
            await mostrarModal(
                "Não foi possível excluir o filme. Tente novamente.",
                "ERRO"
            );
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

        if (!filme?.dataset.id) {
            await mostrarModal(
                "Não foi possível identificar o filme para edição.",
                "ERRO"
            );
            return;
        }

        entrarModoEdicao(filme);

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
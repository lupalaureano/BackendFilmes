const lista = document.querySelector("#filmes");

async function carregarFilmes() {
    const resposta = await fetch("/filmes");
    if (!resposta.ok) {
        throw new Error("Não foi possível carregar os filmes");
    }
    const filmes = await resposta.json();
    lista.replaceChildren();
    for (const filme of filmes) {
        const item = document.createElement("li");
        item.textContent = filme.titulo;
        lista.append(item);
    }
}

carregarFilmes().catch(() => {
    lista.replaceChildren();
});

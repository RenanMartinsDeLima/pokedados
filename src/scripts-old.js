document.addEventListener("DOMContentLoaded", () => {
    const btnEncontrar = document.getElementById("btn-encontrar");
    const mensagemLoading = document.getElementById("mensagem-loading");
    const pokemonInfo = document.getElementById("pokemon-info");
    const pokemonImagem = document.getElementById("pokemon-imagem");
    const pokemonNome = document.getElementById("pokemon-nome");
    const pokemonDescricao = document.getElementById("pokemon-descricao");
    const btnCapturar = document.getElementById("btn-capturar");
    const btnRecusar = document.getElementById("btn-recusar");
    const listaCapturados = document.getElementById("lista-capturados");
    const btnsNavegacao = document.querySelector(".btns-navegacao");
    const btnLimpar = document.getElementById("btn-limpar");
    const pokemonTipo = document.getElementById("pokemon-tipo");

    let pokemonAtual = null;
    let capturados = [];

    const dadosSalvos = localStorage.getItem("capturados");

    try {
        capturados = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch {
        capturados = [];
    }

    atualizarLista();

    // 🔎 BOTÃO PROCURAR
    if (btnEncontrar) {
        btnEncontrar.addEventListener("click", async () => {
            pokemonInfo.classList.add("hidden");
            btnsNavegacao.classList.add("hidden");
            mensagemLoading.classList.remove("hidden");

            const id = Math.floor(Math.random() * 649) + 1;

            try {
                const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const dados = await resposta.json();

                const nivel = Math.floor(Math.random() * 50) + 1;
                await new Promise(resolve => setTimeout(resolve, 800));

                const imagemAnimada = dados.sprites?.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;
                const tiposArray = dados.types.map(t => t.type.name);

                mostrarTipo(tiposArray);

                const peso = dados.weight / 10;
                const altura = dados.height / 10;

                pokemonAtual = {
                    id: id,
                    nome: dados.name,
                    nivel: nivel,
                    tipos: tiposArray,
                    peso: peso,
                    altura: altura,
                    imagem: imagemAnimada || dados.sprites.front_default
                };

                pokemonImagem.onload = () => {
                    pokemonInfo.classList.remove("hidden");
                    btnsNavegacao.classList.remove("hidden");
                    mensagemLoading.classList.add("hidden");

                    pokemonInfo.classList.remove("animar");
                    void pokemonInfo.offsetWidth;
                    pokemonInfo.classList.add("animar");
                };

                pokemonImagem.src = pokemonAtual.imagem;

                pokemonNome.textContent =
                    `${pokemonAtual.nome.charAt(0).toUpperCase() + pokemonAtual.nome.slice(1)} Lv${nivel}`;

                pokemonDescricao.textContent =
                    `Peso: ${peso}kg | Altura: ${altura}m`;

            } catch (erro) {
                mensagemLoading.classList.add("hidden");
                alert("Erro ao buscar pokemon");
            }
        });
    }

    // 🧬 TIPOS
    function mostrarTipo(tiposArray) {
        pokemonTipo.innerHTML = "";

        tiposArray.forEach(tipo => {
            const span = document.createElement("span");
            span.textContent = tipo.toUpperCase();
            span.classList.add("tipo", tipo);
            pokemonTipo.appendChild(span);
        });
    }

    // 🎯 CAPTURAR
    if (btnCapturar) {
        btnCapturar.addEventListener("click", async () => {
            if (!pokemonAtual) return;

            capturados.push(pokemonAtual);
            localStorage.setItem("capturados", JSON.stringify(capturados));
            await fetch('http://localhost:3000/pokemon', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(pokemonAtual)})
            atualizarLista();
            limparTela();
        });
    }

    //RECUSAR
    if (btnRecusar) {
        btnRecusar.addEventListener("click", () => {
            limparTela();
        });
    }

    //LISTA
    function atualizarLista() {

        if (!listaCapturados) return;

        listaCapturados.innerHTML = "";

        if (!capturados || !Array.isArray(capturados)) return;

        capturados.forEach(pokemon => {
            if (!pokemon || !pokemon.imagem || !pokemon.nome) return; // 🔥 proteção total

            const li = document.createElement("li");

            const img = document.createElement("img");
            img.src = pokemon.imagem;
            img.style.width = "50px";

            // const nome = document.createElement("p");
            // nome.textContent = pokemon.nome;

            li.appendChild(img);
            // li.appendChild(nome);

            listaCapturados.appendChild(li);
        });
    }

    // 🧹 LIMPAR / POKEDEX
    if (btnLimpar) {
        btnLimpar.addEventListener("click", async () => {
            capturados = [];
            localStorage.removeItem("capturados");
            await fetch('http://localhost:3000/pokemon', {method: 'DELETE', headers: {'Content-Type': 'application/json'}})
            atualizarLista();
        });
    }

    // 🧼 LIMPAR TELA
    function limparTela() {
        pokemonInfo.classList.add("hidden");
        btnsNavegacao.classList.add("hidden");
        pokemonAtual = null;
    }
});
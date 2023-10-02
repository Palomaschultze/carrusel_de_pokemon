const url = 'https://pokeapi.co/api/v2/';

async function cargarTiposPokemon() {
    try {
        const response = await fetch(`${url}type`);
        const data = await response.json();

        const dropdown = document.getElementById('pokemonTypesDropdown');
        data.results.forEach(type => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="#" data-type="${type.name}">${type.name}</a>`;
            dropdown.appendChild(li);
        });

        // Manejar clics en el menú desplegable
        document.getElementById('pokemonTypesDropdown').addEventListener('click', async function (event) {
            if (event.target.tagName === 'A') {
                const selectedType = event.target.getAttribute('data-type');
                await cargarPokemonPorTipo(selectedType);
            }
        });

        // Inicializar el carrusel con el tipo 'normal' al cargar la página
        await cargarPokemonPorTipo('normal');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function obtenerTiposPokemon(pokemonName) {
    try {
        const response = await fetch(`${url}pokemon/${pokemonName}`);
        const data = await response.json();
        const tiposPokemon = data.types.map(tipo => tipo.type.name);
        return tiposPokemon;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function cargarPokemonPorTipo(selectedType) {
    try {
        const response = await fetch(`${url}type/${selectedType}`);
        const data = await response.json();

        const carouselContent = document.querySelector('.responsive');
        carouselContent.innerHTML = '';

        for (const pokemon of data.pokemon) {
            const div = document.createElement('div');
            div.className = 'pokemonItem';

            const tipos = await obtenerTiposPokemon(pokemon.pokemon.name);
            const tiposString = tipos.join(', ');

            div.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon.url.split('/')[6]}.png" 
                     alt="${pokemon.pokemon.name}"
                     class="card-img-top"
                     style="width: 100px; height: 100px;">
                <p id="pokeNombre">${pokemon.pokemon.name.toUpperCase()}</p>
                <p>Tipo ${tiposString}</p>
            `;

            carouselContent.appendChild(div);
        }

        // Actualizar el título con el tipo de Pokémon mostrado
        document.getElementById('tipo-pokemon').textContent = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

        // Destruir el carrusel antes de volver a inicializarlo
        if ($('.responsive').hasClass('slick-initialized')) {
            $('.responsive').slick('unslick');
        }

        // Inicializar el carrusel después de cargar los datos
        $('.responsive').slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarTiposPokemon);

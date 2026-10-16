let currentPage = 1;

// Mapeo inteligente para asignar apodos reales a los Ricks y Mortys repetidos de la API
function obtenerApodoPersonaje(char) {
  // Ricks específicos por ID
  if (char.id === 1) return "Rick Sanchez (C-137 - Protagonista)";
  if (char.id === 2) return "Morty Smith (C-137 - Protagonista)";
  if (char.id === 287) return "Rick Prime (El Asesino)";
  if (char.id === 118) return "Evil Morty (Morty Malvado)";
  if (char.id === 119) return "Evil Rick (Rick Malvado)";
  if (char.id === 69) return "Commander Rick";
  if (char.id === 86) return "Doofus Rick";
  if (char.id === 274) return "Rick Pepinillo (Pickle Rick)";
  if (char.id === 289) return "Rick Toxico";
  if (char.id === 361) return "Toxic Rick";

  // Asignación de apodos dinámicos por Origen / Ubicación si el nombre es genérico
  if (char.name === "Rick Sanchez") {
    if (char.origin.name.includes("C-137")) return "Rick Sanchez (Tierra C-137)";
    if (char.origin.name.includes("Evil Rick")) return "Rick (Víctima de Evil Rick)";
    if (char.origin.name.includes("Replacement")) return "Rick (Dimensión de Reemplazo)";
    if (char.origin.name.includes("Story Train")) return "Rick (Tren de Historias)";
    if (char.origin.name.includes("Wasps")) return "Rick Avispa";
    if (char.origin.name.includes("Shrimp")) return "Rick Camarón";
    if (char.origin.name.includes("Fascist")) return "Rick Fascista";
    if (char.origin.name !== "unknown") return `Rick (${char.origin.name})`;
    return "Rick Sanchez (Dimensión Desconocida)";
  }

  if (char.name === "Morty Smith") {
    if (char.origin.name.includes("C-137")) return "Morty Smith (Tierra C-137)";
    if (char.origin.name.includes("Replacement")) return "Morty (Dimensión de Reemplazo)";
    if (char.origin.name !== "unknown") return `Morty (${char.origin.name})`;
    return "Morty Smith (Dimensión Desconocida)";
  }

  // Si tiene un nombre único propio en la API (ej: "Simple Rick", "Cop Rick", "Cronenberg Morty")
  return char.name;
}

// Función principal para pedir datos a la API
async function fetchCharacters() {
  const name = document.getElementById('nameInput').value.trim();
  const species = document.getElementById('speciesSelect').value;
  const status = document.getElementById('statusSelect').value;
  const container = document.getElementById('charactersContainer');

  let url = `https://rickandmortyapi.com/api/character/?page=${currentPage}`;
  if (name) url += `&name=${encodeURIComponent(name)}`;
  if (species) url += `&species=${encodeURIComponent(species)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('No se encontraron personajes en esta dimensión.');
    }
    const data = await response.json();

    renderCharacters(data.results);

    document.getElementById('prevBtn').disabled = !data.info.prev;
    document.getElementById('nextBtn').disabled = !data.info.next;
    document.getElementById('pageIndicator').innerText = `Página ${currentPage} de ${data.info.pages}`;

  } catch (error) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ef4444; font-size: 1.2rem;">${error.message}</p>`;
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('pageIndicator').innerText = `Página 0`;
  }
}

// Renderizado de las tarjetas
function renderCharacters(characters) {
  const container = document.getElementById('charactersContainer');
  container.innerHTML = '';

  characters.forEach(char => {
    const apodoNombre = obtenerApodoPersonaje(char);
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}" loading="lazy">
      <div class="card-info">
        <h2 class="card-title">${apodoNombre}</h2>
        <div class="card-subtitle">${char.type ? char.type : char.species}</div>
        <p>
          <span class="status-badge ${char.status}"></span>
          <strong>Estado:</strong> ${char.status} - ${char.species}
        </p>
        <p><strong>Origen:</strong> ${char.origin.name}</p>
        <p><strong>Ubicación actual:</strong> ${char.location.name}</p>
        <p><strong>Apariciones:</strong> ${char.episode.length} episodio(s)</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function buscarPersonajes() {
  currentPage = 1;
  fetchCharacters();
}

function filtroRapido(nombre) {
  document.getElementById('nameInput').value = nombre;
  buscarPersonajes();
}

function cambiarPagina(delta) {
  currentPage += delta;
  fetchCharacters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Escuchar evento 'Enter' en el buscador
document.getElementById('nameInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    buscarPersonajes();
  }
});

// Cargar al iniciar la página
fetchCharacters();
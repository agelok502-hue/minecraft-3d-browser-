const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const latestGameName = document.getElementById('latest-game-name');
const latestGameTag = document.getElementById('latest-game-tag');

let allGames = [];

async function loadGames() {
  try {
    const response = await fetch('games.json');
    if (!response.ok) {
      throw new Error('Gagal memuat games.json');
    }

    allGames = await response.json();
    renderGames(allGames);
    if (allGames.length > 0) {
      const latest = allGames[0];
      latestGameName.textContent = latest.name;
      latestGameTag.textContent = latest.tags?.[0] || 'Game';
    }
  } catch (error) {
    console.error(error);
    gamesGrid.innerHTML = `
      <div class="game-card">
        <div class="game-content">
          <h3>Gagal memuat game</h3>
          <p>Pastikan file games.json tersedia dan benar.</p>
        </div>
      </div>
    `;
  }
}

function renderGames(games) {
  if (!games.length) {
    gamesGrid.innerHTML = `
      <div class="game-card">
        <div class="game-content">
          <h3>Game tidak ditemukan</h3>
          <p>Coba cari dengan kata kunci lain.</p>
        </div>
      </div>
    `;
    return;
  }

  gamesGrid.innerHTML = games
    .map((game) => {
      const tags = (game.tags || []).slice(0, 2).map((tag) => `<span class="tag">${tag}</span>`).join('');

      return `
        <article class="game-card">
          <div class="game-thumb">${game.shortLabel || game.name.charAt(0).toUpperCase()}</div>
          <div class="game-content">
            <div class="game-meta">
              <span class="game-badge">${game.category || 'Game'}</span>
              <span class="game-author">${game.author || 'Unknown'}</span>
            </div>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <div class="game-footer">
              <div class="tag-list">${tags}</div>
              <a class="play-btn" href="${game.file}" target="_blank" rel="noopener">Main</a>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

searchInput.addEventListener('input', (event) => {
  const keyword = event.target.value.trim().toLowerCase();

  const filtered = allGames.filter((game) => {
    return (
      game.name.toLowerCase().includes(keyword) ||
      game.description.toLowerCase().includes(keyword) ||
      (game.tags || []).join(' ').toLowerCase().includes(keyword)
    );
  });

  renderGames(filtered);
});

loadGames();
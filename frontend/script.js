let currentUser = null;
let users = [];

// Load users from JSON file
function loadUsers() {
    fetch('data/users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
        });
}

// Save users to JSON file
function saveUsers() {
    const data = JSON.stringify(users);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.json';
    a.click();
}

// Show register form
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Show login form
function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Register a new user
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (users.find(user => user.username === username)) {
        alert('Username already exists');
        return;
    }

    users.push({ username, password, lists: { watching: [], toWatch: [], dropped: [], boring: [] } });
    saveUsers();
    alert('Registration successful!');
    showLogin();
}

// Login a user
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        currentUser = user;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('tracker-section').style.display = 'block';
        document.getElementById('username-display').textContent = user.username;
        updateLists();
    } else {
        alert('Invalid username or password');
    }
}

// Logout the current user
function logout() {
    currentUser = null;
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('tracker-section').style.display = 'none';
}

// Search for an anime (simulated)
function searchAnime() {
    const query = document.getElementById('search-anime').value;
    const animeResults = document.getElementById('anime-results');
    animeResults.innerHTML = '';

    // Simulated anime data
    const animeData = [
        { title: 'Naruto', description: 'A young ninja dreams of becoming the Hokage.', genre: 'Action, Adventure' },
        { title: 'Attack on Titan', description: 'Humanity fights for survival against giant humanoid creatures.', genre: 'Action, Drama' },
        { title: 'My Hero Academia', description: 'A boy born without superpowers in a superpowered world.', genre: 'Action, School' }
    ];

    const results = animeData.filter(anime => anime.title.toLowerCase().includes(query.toLowerCase()));

    if (results.length > 0) {
        results.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            animeCard.innerHTML = `
                <h3>${anime.title}</h3>
                <p>${anime.description}</p>
                <p><strong>Genre:</strong> ${anime.genre}</p>
                <button onclick="addToList('watching', '${anime.title}')">Watching</button>
                <button onclick="addToList('toWatch', '${anime.title}')">To Watch</button>
                <button onclick="addToList('dropped', '${anime.title}')">Dropped</button>
                <button onclick="addToList('boring', '${anime.title}')">Boring</button>
            `;
            animeResults.appendChild(animeCard);
        });
    } else {
        animeResults.innerHTML = '<p>No results found</p>';
    }
}

// Add anime to a list
function addToList(list, title) {
    if (!currentUser.lists[list].includes(title)) {
        currentUser.lists[list].push(title);
        updateLists();
        saveUsers();
    }
}

// Update the anime lists
function updateLists() {
    const lists = ['watching', 'toWatch', 'dropped', 'boring'];
    lists.forEach(list => {
        const listElement = document.getElementById(`${list}-list`).querySelector('ul');
        listElement.innerHTML = '';
        currentUser.lists[list].forEach(anime => {
            const li = document.createElement('li');
            li.textContent = anime;
            listElement.appendChild(li);
        });
    });
}

// Export user data
function exportData() {
    const data = JSON.stringify(currentUser);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.username}_anime_lists.json`;
    a.click();
}

// Initialize
loadUsers();
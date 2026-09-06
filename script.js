// ===== Base de données des jeux =====
const games = [
    {
        id: 1,
        title: "Camping Horizon",
        description: "Installez vos campeurs, aménagez votre terrain, gérez votre équipe et faites grandir votre camping au cœur de paysages magnifiques.",
        image: "https://raw.githubusercontent.com/Jack-Masson/HORIZON.INTERACTIF.STUDIO/refs/heads/main/logoch.png",
        link: "https://jack-masson.github.io/campinghorizon.github.io/"
    }
    // Ajoutez vos autres jeux ici:
    // {
    //     id: 2,
    //     title: "Titre du Jeu",
    //     description: "Description du jeu",
    //     image: "https://lien-vers-votre-image.jpg",
    //     link: "lien-vers-la-page"
    // }
];

// ===== Éléments du DOM =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const gamesGrid = document.getElementById('gamesGrid');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Menu Hamburger =====
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Fermer le menu quand on clique sur un lien
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== Générer les cartes de jeux =====
function renderGames() {
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div class="no-games" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: #999;">Aucun jeu disponible pour le moment. Revenez bientôt ! 🎮</p>
            </div>
        `;
        return;
    }

    gamesGrid.innerHTML = games.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-cover" style="height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                <img src="${game.image}" alt="${game.title}" class="game-image" style="max-height: 100%; max-width: 100%; object-fit: contain;">
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <a href="${game.link}" class="game-link">Découvrir →</a>
            </div>
        </div>
    `).join('');

    // Ajouter les événements aux cartes
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            const game = games.find(g => g.id === parseInt(gameId));
            if (game) {
                console.log(`Redirection vers le jeu: ${game.title}`);
            }
        });
    });
}

// ===== Formulaire de Contact avec Formspree =====
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // Désactiver le bouton pendant l'envoi
    submitButton.disabled = true;
    submitButton.textContent = '⏳ Envoi...';
    
    try {
        const formData = new FormData(contactForm);
        
        // Envoyer à Formspree
        const response = await fetch('https://formspree.io/f/xwlknydw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Succès !
            submitButton.textContent = '✓ Message envoyé !';
            submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Restaurer le bouton après 3 secondes
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
            
            console.log('✓ Message envoyé avec succès !');
        } else {
            // Erreur
            throw new Error('Erreur lors de l\'envoi');
        }
    } catch (error) {
        // Afficher une erreur
        submitButton.textContent = '✗ Erreur d\'envoi';
        submitButton.style.background = 'linear-gradient(135deg, #d32f2f, #b71c1c)';
        
        console.error('Erreur:', error);
        
        // Restaurer après 3 secondes
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
    }
});

// ===== Ajouter des jeux dynamiquement =====
function addGame(title, description, image = "https://via.placeholder.com/300x200", link = "#") {
    const newGame = {
        id: games.length + 1,
        title: title,
        description: description,
        image: image,
        link: link
    };
    games.push(newGame);
    renderGames();
}

// ===== Animations au scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer les cartes de jeu et sections
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
    
    // Ajouter l'animation aux éléments
    const elementsToAnimate = document.querySelectorAll('.game-card, .about-content, .contact-content');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// ===== Animations de scroll fluide =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    if (parallaxElements.length > 0) {
        document.querySelector('.hero').style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
});

// ===== Exemple: Comment ajouter des jeux =====
// Décommentez et modifiez pour ajouter vos jeux:
/*
addGame(
    "Titre du Jeu",
    "Description du jeu...",
    "https://lien-vers-votre-image.jpg",
    "https://lien-vers-la-page-du-jeu"
);
*/
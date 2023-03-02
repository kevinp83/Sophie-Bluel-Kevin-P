// Ici je met l'url de l'API sous const pour pouvoir l'appeler plus facilement par la suite
const urlAPI = "http://localhost:5678/api/works"
// Appel a l'API via la const urlAPI
fetch(urlAPI)
    .then(function(response){
    if (response.ok){
        return response.json(); 
        //recuperation des données au format json pour pouvoir s'en servir dans la suite du code
    }
})
.then(function(values) {
    // Affichage des données récuperer dans l'API 
    console.log(values);

    values.forEach( value => {
// Création d'élément HTML à partir des valeurs JSON récuperer depuis l'API 
        let gallery = document.querySelector(".gallery");
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let figcaption = document.createElement("figcaption");
        let categoryId = document.createElement("p");

        img.setAttribute("src", value.imageUrl);
        figcaption.setAttribute("alt", value.title);
        img.setAttribute("crossorigin", "anonymous");
        categoryId.setAttribute("src", value.categoryId);
        categoryId.setAttribute("crossorigin", "anonymous");
        figcaption.innerHTML = value.title;

        figure.append(img, figcaption);
        gallery.append(figure);
    })
// Création d'une fonction pour filtrer les objets en fonction du bouton de catégorie cliquer sur le site
    function filterObjets(values, categoryId) {

                let filteredValues;

// Création de l'option "par défaut" pour dire que SI aucune catégorie n'est choisi (en cliquant sur le bouton 'tous'
// alors tout les éléments apparraitront à l'écran)
                if (categoryId.length === 0) {
                    filteredValues = values;

                }else{ //Sinon, on filtrera les objets pour afficher seulement ceux dont la catégorie est mentionner au click boutton
                    filteredValues = values.filter(value => categoryId.includes(value.categoryId));
                }

                // On vide les éléments HTML présent dans Gallery
                let gallery = document.querySelector(".gallery");
                gallery.innerHTML = "";

// Itération sur les objets filtrés pour créer les éléments HTML ci-joints
                filteredValues.forEach( value => {

                let figure = document.createElement("figure");
                let img = document.createElement("img");
                let figcaption = document.createElement("figcaption");

                img.setAttribute("src", value.imageUrl);
                figcaption.setAttribute("alt", value.title);
                img.setAttribute("crossorigin", "anonymous");

                figcaption.innerHTML = value.title;

                figure.append(img, figcaption);
                gallery.append(figure);
            
        });
    } // Création d'événements "au click" sur différent bouton pour filtrer les éléments selon leur catégorie (bouton) séléctionné
        const noFilter = document.querySelector(".filter-no");
        noFilter.addEventListener("click", function() {
            filterObjets(values, []);
        });

        const boutonObjets1 = document.querySelector(".filter-objets");
        boutonObjets1.addEventListener("click", function() {
            filterObjets(values, [1]);
        });

        const boutonObjets2 = document.querySelector(".filter-appartements");
        boutonObjets2.addEventListener("click", function() {
            filterObjets(values, [2]);
        });

        const boutonObjets3 = document.querySelector(".filter-hotel");
        boutonObjets3.addEventListener("click", function() {
            filterObjets(values, [3]);
        });

// Partie concernant la modal de modification de la gallerie
let modal = null 

const token = sessionStorage.getItem('token');

if (token) {
    document.querySelectorAll('.js-modal').forEach(a => {
        a.style.display = 'inline-block';

    const openModal = function (e) {
        e.preventDefault();

    const target = document.querySelector(e.target.getAttribute('href'));
// Affichage de la modale en modifiant le display, et  les attribut aria-hidden et aria-modal
        target.style.display = 'block';
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
        modal = target;
// On ajoute les écouteurs d'événements de fermeture de modal
        modal.addEventListener('click', closeModal);
        modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

// On vide la modale avant chaque ouverture, pour éviter le chargement des images en double-triple etc lors de plusieurs ouvertures
    document.querySelector(".modal-gallery").innerHTML = "";

    values.forEach( value => {
        // Création d'élément HTML à partir des valeurs JSON récuperer depuis l'API 
                let gallery = document.querySelector(".modal-gallery");
                let figure = document.createElement("figure");
                let img = document.createElement("img");
                let figcaption = document.createElement("figcaption");
                let categoryId = document.createElement("p");
        
                img.setAttribute("src", value.imageUrl);
                figcaption.setAttribute("alt", value.title);
                img.setAttribute("crossorigin", "anonymous");
                categoryId.setAttribute("src", value.categoryId);
                categoryId.setAttribute("crossorigin", "anonymous");
                figcaption.innerHTML = "Editer";

                figure.append(img, figcaption);
                gallery.append(figure);
    });
};
        a.addEventListener('click', openModal);
    });
}else{
    document.querySelectorAll('.js-modal').forEach(a => {
        a.style.display = 'none';
    });
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
    }

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

 window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
 });
});
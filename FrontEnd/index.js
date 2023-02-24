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
    } // Création d'événements "au click" pour filtrer les éléments selon leur catégorie
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
});
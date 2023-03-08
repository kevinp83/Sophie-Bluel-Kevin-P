// Ici je met l'url de l'API sous const pour pouvoir l'appeler plus facilement par la suite
const urlAPI = "http://localhost:5678/api/works"
// Appel a l'API via la const urlAPI
fetch(urlAPI)
  .then(function (response) {
    if (response.ok) {
      return response.json();
      //recuperation des données au format json pour pouvoir s'en servir dans la suite du code
    }
  })
  .then(function (values) {
    // Affichage des données récuperer dans l'API 
    console.log(values);

    values.forEach(value => {
      // Création d'élément HTML à partir des valeurs JSON récuperer depuis l'API 
      const gallery = document.querySelector(".gallery");
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      const categoryId = document.createElement("p");
      
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

      } else { //Sinon, on filtrera les objets pour afficher seulement ceux dont la catégorie est mentionner au click boutton
        filteredValues = values.filter(value => categoryId.includes(value.categoryId));
      }

      // On vide les éléments HTML présent dans Gallery
      gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";

      // Itération sur les objets filtrés pour créer les éléments HTML ci-joints
      filteredValues.forEach(value => {

        figure = document.createElement("figure");
        img = document.createElement("img");
        figcaption = document.createElement("figcaption");

        img.setAttribute("src", value.imageUrl);
        figcaption.setAttribute("alt", value.title);
        img.setAttribute("crossorigin", "anonymous");

        figcaption.innerHTML = value.title;

        gallery.append(figure);
        figure.append(img, figcaption);

      });
    } // Création d'événements "au click" sur différent bouton pour filtrer les éléments selon leur catégorie (bouton) séléctionné
    const noFilter = document.querySelector(".filter-no");
    noFilter.addEventListener("click", function () {
      filterObjets(values, []);
    });

    const boutonObjets1 = document.querySelector(".filter-objets");
    boutonObjets1.addEventListener("click", function () {
      filterObjets(values, [1]);
    });

    const boutonObjets2 = document.querySelector(".filter-appartements");
    boutonObjets2.addEventListener("click", function () {
      filterObjets(values, [2]);
    });

    const boutonObjets3 = document.querySelector(".filter-hotel");
    boutonObjets3.addEventListener("click", function () {
      filterObjets(values, [3]);
    });

    let modal = null;

    let token = sessionStorage.getItem('token');

    if (token) {
      const modalLinks = document.querySelectorAll('.js-modal');

      modalLinks.forEach((link) => {
        link.style.display = 'flex';

        const filterButton = document.querySelector('.filter');
        filterButton.style.display = 'none';

        const headerAdmin = document.querySelector('.header-admin-edition');
        headerAdmin.style.display = null;
        headerAdmin.removeAttribute('aria-hidden');

        const openModal = (e) => {
          e.preventDefault();
          closeModal();

          const target = document.querySelector(e.target.getAttribute('href'));

          target.style.display = 'block';
          target.removeAttribute('aria-hidden');
          target.setAttribute('aria-modal', 'true');
          modal = target;

          const modalGallery = modal.querySelector('.modal-gallery');
          modalGallery.innerHTML = '';

          values.forEach((value) => {
            figure = document.createElement('figure');
            img = document.createElement('img');
            figcaption = document.createElement('figcaption');
            categoryId = document.createElement('p');
            const delete1Work = document.createElement("i");

            img.setAttribute('src', value.imageUrl);
            figcaption.setAttribute('alt', value.title);
            figcaption.textContent = 'Editer';
            categoryId.setAttribute('src', value.categoryId);
            figure.append(img, figcaption, delete1Work);
            modalGallery.append(figure);
            delete1Work.classList.add("fa-solid", "fa-trash-can");

            
            function deleteWork(id) {
              console.log(id);
            
              fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { Authorization : `Bearer ${token}`},
              })
              .then((response) => response.json())
              .then((json) => console.log(json));
            };

            delete1Work.addEventListener("click", function () {
              deleteWork(value.id);
            });

            });

          const openModal2 = (e) => {
            e.preventDefault();
            closeModal();

            const target2 = document.querySelector('#modal2');

            target2.style.display = 'block';
            target2.removeAttribute('aria-hidden');
            target2.setAttribute('aria-modal', 'true');
            modal = target2;
          };

          const modalBtnAddPhoto = modal.querySelector('.modal-btn-add-photo');
          modalBtnAddPhoto.addEventListener('click', openModal2);

          modal.addEventListener('click', closeModal);
          modal.querySelector('.js-close-modal').addEventListener('click', closeModal);
          modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
        };

        link.addEventListener('click', openModal);
      });
    } else {
      const modalLinks = document.querySelectorAll('.js-modal');

      modalLinks.forEach((link) => {
        link.style.display = 'none';
      });
    }

    const closeModal = (e) => {
      if (modal === null) return;

      if (e) {
        e.preventDefault();
      }

      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal = null;
    };

    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
      }
    });

    /* Afficher l'image en miniature, ne fonctionne pas */
    const inputFile = document.querySelector("#file-input");
    const modalImage = document.querySelector(".modal-add-img");

    inputFile.addEventListener("change", function () {
      if (img) {
        modalImage.removeChild(img);
      }

      img = document.createElement("img");
      img.src = window.URL.createObjectURL(this.files[0]);
      img.onload = function () {
        URL.revokeObjectURL(this.src);
      };
      modalImage.appendChild(img);
    });
  })
// Ici je met l'url de l'API sous const pour pouvoir l'appeler plus facilement par la suite
const urlAPI = "http://localhost:5678/api/works";
// Appel a l'API via la const urlAPI
fetch(urlAPI)
  .then(function (response) {
    if (response.ok) {
      return response.json();    //recuperation des données au format json pour pouvoir s'en servir dans la suite du code
    }
  })
  .then(function (values) {
    console.log(values);

    values.forEach((value) => {
      displayOne(value);
    });

    // Création d'événements "au click" sur différent bouton pour filtrer les éléments selon leur catégorie (bouton) séléctionné
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

    let token = sessionStorage.getItem("token");

    if (token) {  // Mise en page de toute les actions possible si le token est présent
      const modalLinks = document.querySelectorAll(".js-modal");

      modalLinks.forEach((link) => {
        link.style.display = "flex";

        const filterButton = document.querySelector(".filter");
        filterButton.style.display = "none";

        const headerAdmin = document.querySelector(".header-admin-edition");
        headerAdmin.style.display = null;
        headerAdmin.removeAttribute("aria-hidden");

        const btnBack = document.querySelector(".back");
        btnBack.addEventListener("click", function () {
          const modal2 = document.querySelector("#modal2");
          const modal1 = document.querySelector("#modal1");
          modal2.style.display = "none";
          modal1.style.display = "block";
          modal = modal1;
        });

        const openModal = (e) => {
          e.preventDefault();
          closeModal();

          const target = document.querySelector(e.target.getAttribute("href"));

          target.style.display = "block";
          target.removeAttribute("aria-hidden");
          target.setAttribute("aria-modal", "true");
          modal = target;

          const modalGallery = modal.querySelector(".modal-gallery");
          modalGallery.innerHTML = "";

          values.forEach((value) => {
            figure = document.createElement("figure");
            img = document.createElement("img");
            figcaption = document.createElement("figcaption");
            categoryId = document.createElement("p");
            const delete1Work = document.createElement("i");

            img.setAttribute("src", value.imageUrl);
            figcaption.setAttribute("alt", value.title);
            figcaption.textContent = "Editer";
            categoryId.setAttribute("src", value.categoryId);
            delete1Work.classList.add("fa-solid", "fa-trash-can");
            figure.append(img, figcaption, delete1Work);
            modalGallery.append(figure);

            delete1Work.addEventListener("click", function () {
              deleteWork(value.id, token);
            });
          });

          const modalBtnAddPhoto = modal.querySelector(".modal-btn-add-photo");
          modalBtnAddPhoto.addEventListener("click", openModal2);

          modal.addEventListener("click", closeModal);
          modal
            .querySelector(".js-close-modal")
            .addEventListener("click", closeModal);
          modal
            .querySelector(".js-modal-stop")
            .addEventListener("click", stopPropagation);
        };

        link.addEventListener("click", openModal);



        const openModal2 = (e) => {
          e.preventDefault();
          closeModal();

          const target2 = document.querySelector("#modal2");
          target2.style.display = "block";
          target2.removeAttribute("aria-hidden");
          target2.setAttribute("aria-modal", "true");
          modal = target2;

          modal
            .querySelector(".js-close-modal")
            .addEventListener("click", closeModal);
          modal
            .querySelector(".js-modal-stop")
            .addEventListener("click", stopPropagation);

          modal.addEventListener("click", function (e) {
            if (e.target === modal) {
              closeModal();
            }
          });
        };
      });
    } else {
      const modalLinks = document.querySelectorAll(".js-modal");

      modalLinks.forEach((link) => {
        link.style.display = "none";
      });
    }

    const closeModal = (e) => {
      if (modal === null) return;

      if (e) {
        e.preventDefault();
      }

      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      modal.removeAttribute("aria-modal");
      modal = null;
    };

    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
      }
    });

    /* Afficher l'image en miniature, ne fonctionne pas */
    const inputFile = document.querySelector("#file-input");
    const modalImage = document.querySelector(".modal-add-img");
    const previewImage = document.querySelector("#preview-img"); // Ajout de la variable pour la miniature
    let img;

    inputFile.addEventListener("change", function () {

      if (img && modalImage.contains(img)) {
        modalImage.removeChild(img);
      }

      img = document.createElement("img");
      img.src = window.URL.createObjectURL(this.files[0]);
      img.onload = function () {
        window.URL.revokeObjectURL(this.src);
      };
      modalImage.appendChild(img);

      // Affichage de la miniature
      const reader = new FileReader();
      reader.onload = function (event) {
        previewImage.src = event.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    });

    // Gestion d'erreur pour la promesse asynchrone
    window.addEventListener('unhandledrejection', function (event) {
      console.log("Erreur :", event.reason);
    });
  })
  .catch(function (err) {
    console.log("erreur", err);
  });

function displayOne(value) {
  // Création d'élément HTML à partir des valeurs JSON récuperer depuis l'API
  let gallery = document.querySelector(".gallery");
  let figure = document.createElement("figure");
  let img = document.createElement("img");
  let figcaption = document.createElement("figcaption");

  img.setAttribute("src", value.imageUrl);
  figcaption.setAttribute("alt", value.title);
  img.setAttribute("crossorigin", "anonymous");

  figcaption.innerHTML = value.title;

  figure.append(img, figcaption);
  gallery.append(figure);
};

// Création d'une fonction pour filtrer les objets en fonction du bouton de catégorie cliquer sur le site
function filterObjets(values, categoryId) {
  let filteredValues;

  // Création de l'option "par défaut" pour dire que SI aucune catégorie n'est choisi (en cliquant sur le bouton 'tous'
  // alors tout les éléments apparraitront à l'écran)
  if (categoryId.length === 0) {
    filteredValues = values;
  } else {
    //Sinon, on filtrera les objets pour afficher seulement ceux dont la catégorie est mentionner au click boutton
    filteredValues = values.filter((value) =>
      categoryId.includes(value.categoryId)
    );
  }
  // On vide les éléments HTML présent dans Gallery
  document.querySelector(".gallery").innerHTML = "";

  // Itération sur les objets filtrés pour créer les éléments HTML ci-joints
  filteredValues.forEach((value) => {
    displayOne(value);
  });
};

function deleteWork(id, token) {
  console.log(id);

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
};

function addData() {
  const urlAPI = "http://localhost:5678/api/works";
  const title = document.querySelector("#title").value;
  const imageUrl = document.querySelector("#file-input").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("imageUrl", imageUrl);



  fetch(urlAPI, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    },
    body: formData
  })
    .then(function (response) {
      if (response.ok) {
        closeModal();
        return response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then(function (data) {
      console.log(data);
      displayOne(data);
    })
    .catch(function (error) {
      console.error("Error adding data:", error);
    });
}
const btnValidModal2 = document.querySelector('.btn-valid-modal2');
btnValidModal2.addEventListener('click', function (event) {
  event.preventDefault();
  addData();
});
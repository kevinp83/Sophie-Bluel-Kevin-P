// Ici je met l'url de l'API sous const pour pouvoir l'appeler plus facilement par la suite
const urlAPI = "http://localhost:5678/api/works";
let modal = null;
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

let dataTable = [];

fetch(urlAPI)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (values) {
    values.forEach(function(element) {
      dataTable.push(element);
    });

    displayAll(dataTable);
    
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

          displayAllModal(dataTable);

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
    // Ajout de l'image en miniature après le téléchargement
    const inputFile = document.querySelector("#file-input");
    const modalImage = document.querySelector(".modal-add-img");
    const previewImage = document.querySelector("#preview-img");
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
    // console.log("erreur", err);
  });

const displayGalleryItem = (value) => {
 // Remplissage de la gallery
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  figure.setAttribute("id", value.id);

  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

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
    filteredValues = values.filter((value) =>
      categoryId.includes(value.categoryId)
    );
  }
  displayAll(filteredValues);
};

const deleteWork = (id, token = sessionStorage.getItem("token")) => {

  fetch(urlAPI + "/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (response.ok) {
       alert("La suppression de l'élément a fonctionner");
        // document.getElementById(id).innerHTML ="";
        retirerElement(id);
        displayAll(dataTable);
        displayAllModal(dataTable);
        // closeModal();
      } else {
        console.error("La suppression de l'élément pose un problème, veuillez contacter l'équipe de maintenance du site.", response);
      }
    })
  };

function addData() {
  const urlAPI = "http://localhost:5678/api/works";
  const title = document.querySelector("#title").value;
  const imageUrl = document.querySelector("#file-input").files[0];
  const select = document.querySelector("#category");
  const options = select.options;
  const categoryIds = {
    "1": 1,
    "2": 2,
    "3": 3
  };

  const categoryId = categoryIds[options[select.selectedIndex].value];

  if (!title || !imageUrl || !categoryId) {
    alert("Veuillez remplir tout les champs du formulaire.");
    return;
  }

  const formData = new FormData();

  formData.append("title", title);
  formData.append("image", imageUrl);
  formData.append("category", categoryId);

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
        alert("L'ajout du nouveau projet a fonctionné");
        return response.json();
      } else {
        throw new Error("Réponse négative du serveur");
      }
    })
    .then(function (data) {
      
      // displayGalleryItem(data);
      dataTable.push(data);
      displayAll(dataTable);
      displayAllModal(dataTable);
    })
    .catch(function (error) {
      console.error("Error adding data:", error);
      alert("Une erreur est survenue lors de l'ajout des éléments. Veuillez réessayer ou joindre l'équipe si le problème persiste.")
    });
}
let newValues;

fetch(urlAPI)
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })

const btnValidModal2 = document.querySelector('.btn-valid-modal2');
btnValidModal2.addEventListener('click', function (event) {
  event.preventDefault();
  addData();
});

function displayAll(values){
  document.querySelector(".gallery").innerHTML = "";
  
  values.forEach((value) => {
    displayGalleryItem(value);
  });
}

function displayAllModal(values) {
  modalGallery = document.querySelector(".modal-gallery");
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
      deleteWork(value.id);
    });
  });
}

function retirerElement(id) {
  for(let i = 0; i < dataTable.length; i++){
    if(dataTable[i].id === id){
      dataTable.splice(i, 1);           
    }
  }
}
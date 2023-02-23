const urlAPI = "http://localhost:5678/api/works"

fetch(urlAPI)
    .then(function(response){
    if (response.ok){
        return response.json();
    }
})
.then(function(value) {
    console.log(value);

    for(let i = 0; i < value.length; i++) {

        let gallery = document.querySelector(".gallery");
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        let figcaption = document.createElement("figcaption");

        img.setAttribute("src", value[i].imageUrl);
        figcaption.setAttribute("alt", value[i].title);
        img.setAttribute("crossorigin", "anonymous");
        
        figcaption.innerHTML = value[i].title;

        figure.append(img, figcaption);
        gallery.append(figure);
    }   
})
.catch(function(err){
    console.log("erreur")
});

const boutonObjets = document.querySelector(".filter-objets");

    boutonObjets.addEventListener("click", function() {
        const objetsFiltrer = Array.from(categoryId);
        objetsFiltrer.sort(function (data) {
            return data.categoryId == 1;
        });
        document.querySelector(".gallery").innerHTML = "";
        console.log(objetsFiltrer);
    });

    const boutonAppartements = document.querySelector(".filter-appartements");

    boutonAppartements.addEventListener("click", function() {
        const appartementsFiltrer = Array.from(categoryId);
        appartementsFiltrer.sort(function (data) {
            return data.categoryId == 2;
        });
        document.querySelector(".gallery").innerHTML = "";
        console.log(appartementsFiltrer);
    });

    const boutonHotel = document.querySelector(".filter-hotel");

    boutonHotel.addEventListener("click", function() {
        const hotelFiltrer = Array.from(categoryId);
        hotelFiltrer.sort(function (data) {
            return data.categoryId == 3;
        });
        document.querySelector(".gallery").innerHTML = "";
        console.log(hotelFiltrer);
    });
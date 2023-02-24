const urlAPI = "http://localhost:5678/api/works"

fetch(urlAPI)
    .then(function(response){
    if (response.ok){
        return response.json();
    }
})
.then(function(values) {
    console.log(values);

    values.forEach( value => {

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

    function filterObjets(values, categoryId) {

                let filteredValues;

                if (categoryId.length === 0) {
                    filteredValues = values;
                }else{
                    filteredValues = values.filter(value => categoryId.includes(value.categoryId));
                }

                let gallery = document.querySelector(".gallery");
                gallery.innerHTML = "";

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
    }
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
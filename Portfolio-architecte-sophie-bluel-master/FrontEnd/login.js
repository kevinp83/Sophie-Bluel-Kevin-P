/** 
 * Gère l'affichage de la page Login et les paramètres de connexion
 */

fetch("http://localhost:5678/api/users/login")
    .then( data => data.json())
    .then( jsonLogin => {
        console.log(jsonLogin)  
    })
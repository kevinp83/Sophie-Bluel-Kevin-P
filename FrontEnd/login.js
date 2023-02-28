/** 
 * Gère l'affichage de la page Login et les paramètres de connexion
 */
const form = document.querySelector('.login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = form.elements.email.value;
    const password = form.elements.password.value;

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: 'post',
        headers: { 'content-Type': 'application/json'
},
        body: JSON.stringify({ email, password })
});

    if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token', data.token);

        window.location.href = 'index.html'
    }else {
        alert("Identifiant ou mot de passe incorrect");
    }
})
    .catch(error => {
        console.error('erreur:', error);
});














/* let loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(e) {

        let adminMail = "sophie.bluel@test.tld";
        let adminPassword = "S0phie";

        if(adminMail.value != adminMail) {
            alert((reponse.message = "Vous ne passerez pas"))

        }else if (adminPassword.value != adminPassword) {
            alert((reponse.message = "Vous ne passerez pas"))
        }else {
            alert('Formulaire envoyer et correct');
        }
    })
}); */




//body: JSON.stringify({  email: `${email.value}`, password: `${password.value}`, }); });

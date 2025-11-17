// script.js - petits scripts utiles
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', function(e){
    // petit feedback utilisateur
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Envoi...';
    // laisser l'envoi se faire (Formspree/Netlify...)
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Envoyer la demande';
    }, 3000);
  });
}

// script.js - petits scripts utiles
document.getElementById('year').textContent = new Date().getFullYear();// script.js - Gestion des feedbacks et interactions DCVTC66

// Sécurité : on s'assure que le formulaire de réservation existe sur la page
const reservationForm = document.getElementById('reservation-form');

if (reservationForm) {
  // Cibler les boutons d'envoi du formulaire
  const btnSms = reservationForm.querySelector('button[type="submit"]');
  const btnWhatsapp = document.getElementById('btn-whatsapp-form');

  // Exemple de feedback visuel temporaire pour le bouton SMS
  reservationForm.addEventListener('submit', function() {
    if (btnSms) {
      const texteOriginal = btnSms.textContent;
      btnSms.disabled = true;
      btnSms.textContent = '📱 Ouverture SMS...';
      
      setTimeout(() => {
        btnSms.disabled = false;
        btnSms.textContent = texteOriginal;
      }, 3000);
    }
  });

  // Exemple de feedback visuel temporaire pour le bouton WhatsApp
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
      const texteOriginal = btnWhatsapp.textContent;
      // On attend une fraction de seconde pour laisser le script d'index.html s'exécuter
      setTimeout(() => {
        btnWhatsapp.disabled = true;
        btnWhatsapp.textContent = '💬 Ouverture WhatsApp...';
      }, 50);

      setTimeout(() => {
        btnWhatsapp.disabled = false;
        btnWhatsapp.textContent = texteOriginal;
      }, 3000);
    });
  }
}

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

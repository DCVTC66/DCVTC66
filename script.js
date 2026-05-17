// script.js - Gestion des feedbacks et interactions DCVTC66

// On s'assure que le formulaire de réservation existe sur la page
const reservationForm = document.getElementById('reservation-form');

if (reservationForm) {
  const btnSms = reservationForm.querySelector('button[type="submit"]');
  const btnWhatsapp = document.getElementById('btn-whatsapp-form');

  // Feedback visuel lors du clic sur "Envoyer par SMS"
  reservationForm.addEventListener('submit', function() {
    if (btnSms) {
      const texteOriginal = btnSms.textContent;
      btnSms.disabled = true;
      btnSms.textContent = '📱 Ouverture SMS...';
      
      // On redonne le contrôle au bouton après 3 secondes
      setTimeout(() => {
        btnSms.disabled = false;
        btnSms.textContent = texteOriginal;
      }, 3000);
    }
  });

  // Feedback visuel lors du clic sur "Envoyer par WhatsApp"
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', function() {
      const texteOriginal = btnWhatsapp.textContent;
      
      // Petit délai de 50ms pour laisser le traitement de l'HTML se faire
      setTimeout(() => {
        btnWhatsapp.disabled = true;
        btnWhatsapp.textContent = '💬 Ouverture WhatsApp...';
      }, 50);

      // On redonne le contrôle au bouton après 3 secondes
      setTimeout(() => {
        btnWhatsapp.disabled = false;
        btnWhatsapp.textContent = texteOriginal;
      }, 3000);
    });
  }
}

<template>
  <div class="container mt-5">
    <h2 class="text-center title mb-4">Calendrier des Réservations</h2>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2";
import { useReservationStore } from "../store/reservationStore";

// Store des réservations
const reservationStore = useReservationStore();

// Configuration du calendrier
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: "fr",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  buttonText: {
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
  },
  events: [], // Les événements seront ajoutés dynamiquement
  dateClick: (info) => handleDateClick(info),
  eventClick: (info) => handleEventClick(info),
  eventColor: "#007bff", // Couleur par défaut
});

// Charger les événements
const loadReservations = () => {
  calendarOptions.value.events = reservationStore.reservations.map((res) => ({
    id: res.id,
    title: res.customer?.fullName || "Client Inconnu",
    start: res.startDate,
    end: res.endDate,
    color: res.status === "CONFIRMER" ? "#28a745" : "#ffc107",
    borderColor: res.status === "CONFIRMER" ? "#155724" : "#856404",
  }));
};

// Ajouter une nouvelle réservation
const handleDateClick = (info) => {
  Swal.fire({
    title: "Créer une réservation",
    html: `<strong>Date :</strong> ${info.dateStr}`,
    icon: "info",
    input: "text",
    inputLabel: "Nom du client",
    inputPlaceholder: "Entrez le nom du client",
    showCancelButton: true,
    confirmButtonText: "Enregistrer",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.isConfirmed) {
      const customerName = result.value || "Client Inconnu";
      reservationStore
        .addReservation({
          customer: { fullName: customerName },
          startDate: info.dateStr,
          endDate: info.dateStr,
          status: "EN_ATTENTE",
        })
        .then(() => {
          loadReservations();
          Swal.fire("Réservation ajoutée!", "La réservation a été créée.", "success");
        });
    }
  });
};

// Détails et actions sur un événement
const handleEventClick = (info) => {
  const event = info.event;
  Swal.fire({
    title: "Détails de la réservation",
    html: `
      <p><strong>Client :</strong> ${event.title}</p>
      <p><strong>Début :</strong> ${event.start.toLocaleDateString()}</p>
      <p><strong>Fin :</strong> ${event.end?.toLocaleDateString() || "Non défini"}</p>
    `,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Modifier",
    cancelButtonText: "Supprimer",
  }).then((result) => {
    if (result.isConfirmed) {
      // Modifier
      Swal.fire({
        title: "Modifier le client",
        input: "text",
        inputValue: event.title,
        inputLabel: "Nom du client",
        showCancelButton: true,
        confirmButtonText: "Enregistrer",
        cancelButtonText: "Annuler",
      }).then((updateResult) => {
        if (updateResult.isConfirmed) {
          reservationStore
            .updateReservation(event.id, { customer: { fullName: updateResult.value } })
            .then(() => {
              loadReservations();
              Swal.fire("Mise à jour réussie!", "Les détails ont été modifiés.", "success");
            });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Supprimer
      Swal.fire({
        title: "Confirmer la suppression",
        text: "Cette réservation sera définitivement supprimée.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
      }).then((deleteResult) => {
        if (deleteResult.isConfirmed) {
          reservationStore.deleteReservation(event.id).then(() => {
            loadReservations();
            Swal.fire("Supprimée!", "La réservation a été supprimée.", "success");
          });
        }
      });
    }
  });
};

// Charger les réservations à l'initialisation
onMounted(() => {
  reservationStore.fetchReservations().then(() => {
    loadReservations();
  });
});

// Mise à jour dynamique des réservations
watch(() => reservationStore.reservations, loadReservations);
</script>


<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.title {
  font-weight: bold;
  color: #333;
}
.calendar-container {
  margin-top: 20px;
}
.fc .fc-event {
  cursor: pointer;
}
.fc-daygrid-day:hover {
  background-color: #f0f8ff;
}
</style>

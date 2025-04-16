// js/supabase.js
const SUPABASE_URL = 'https://mgicdbgaokksyetwemjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naWNkYmdhb2trc3lldHdlbWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTA2OTksImV4cCI6MjA1OTk2NjY5OX0.JSUQoohut0nIrJFmH3oZZNTLtYZekS22bFcgmT3kX_Y';

// Inizializza il client Supabase (utilizza la libreria globale importata)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Funzione per gestire errori
function handleError(error) {
    console.error("Errore:", error);
    // Mostra un messaggio di errore all'utente
    const messageElement = document.querySelector('.message.error');
    if (messageElement) {
        messageElement.textContent = error.message || "Si è verificato un errore.";
        messageElement.style.display = 'block';
    } else {
        alert("Errore: " + (error.message || "Si è verificato un errore."));
    }
}

// Esponi queste funzioni globalmente
window.supabase = supabase;
window.handleError = handleError;
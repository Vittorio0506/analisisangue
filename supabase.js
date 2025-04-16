// js/supabase.js
console.log("Inizializzazione Supabase...");

const SUPABASE_URL = 'https://mgicdbgaokksyetwemjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naWNkYmdhb2trc3lldHdlbWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTA2OTksImV4cCI6MjA1OTk2NjY5OX0.JSUQoohut0nIrJFmH3oZZNTLtYZekS22bFcgmT3kX_Y';

// Verifica che la libreria Supabase sia caricata correttamente
let supabase;
if (window.supabase) {
    console.log("Libreria Supabase trovata, inizializzazione client...");
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Client Supabase inizializzato con successo");
    } catch (err) {
        console.error("Errore durante l'inizializzazione di Supabase:", err);
        alert("Errore durante l'inizializzazione di Supabase. Verifica la console per dettagli.");
    }
} else {
    console.error("Libreria Supabase non trovata! Assicurati di averla inclusa nello script.");
    alert("Errore: libreria Supabase non trovata. Verifica che tutti gli script siano caricati correttamente.");
}

// Funzione per gestire errori
function handleError(error) {
    console.error("Errore:", error);
    // Mostra un messaggio di errore all'utente
    const messageElement = document.querySelector('.message.error');
    if (messageElement) {
        messageElement.textContent = error.message || "Si è verificato un errore.";
        messageElement.style.display = 'block';
        
        // Nascondi eventuali messaggi di successo
        const successMessage = document.querySelector('.message.success');
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    } else {
        alert("Errore: " + (error.message || "Si è verificato un errore."));
    }
}

// Esponi queste funzioni globalmente
window.supabase = supabase;
window.handleError = handleError;
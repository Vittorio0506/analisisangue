const SUPABASE_URL = 'https://mgicdbgaokksyetwemjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1naWNkYmdhb2trc3lldHdlbWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTA2OTksImV4cCI6MjA1OTk2NjY5OX0.JSUQoohut0nIrJFmH3oZZNTLtYZekS22bFcgmT3kX_Y';

// Inizializza il client Supabase (utilizza la libreria globale importata)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// Verifica se l'utente è già autenticato
async function checkAuthentication() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Funzione per gestire errori
function handleError(error) {
    console.error("Errore:", error);
    // Mostra un messaggio di errore all'utente
}
// Controlla se l'utente è autenticato
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuthentication();
    if (!user) {
        // Reindirizza alla pagina di login
        window.location.href = 'index.html';
    }
});
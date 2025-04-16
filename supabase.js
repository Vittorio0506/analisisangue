// js/supabase.js
const SUPABASE_URL = 'https://tuo-progetto-id.supabase.co';
const SUPABASE_KEY = 'tua-chiave-api-pubblica';

// Inizializza il client Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
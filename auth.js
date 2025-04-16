// js/auth.js
// Funzione per la registrazione
async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per il login
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Memorizza i dati dell'utente
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Reindirizza alla dashboard
        window.location.href = 'dashboard.html';
        
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per il logout
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        // Rimuovi i dati dell'utente
        localStorage.removeItem('user');
        
        // Reindirizza alla pagina di login
        window.location.href = 'index.html';
    } catch (error) {
        handleError(error);
    }
}

// Funzione per il recupero password
async function resetPassword(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per verificare l'autenticazione
// Aggiunta qui per garantire che sia disponibile in questo file
async function checkAuthentication() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        handleError(error);
        return null;
    }
}

// Aggiungi event listener per i form quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    // Form di login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await signIn(email, password);
        });
    }
    
    // Form di registrazione
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await signUp(email, password);
        });
    }
    
    // Pulsante di logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await signOut();
        });
    }
});

// Controlla se l'utente è autenticato
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuthentication();
    if (!user) {
        // Reindirizza alla pagina di login
        window.location.href = 'index.html';
    }
});

// Esponi le funzioni di autenticazione globalmente
window.signIn = signIn;
window.signUp = signUp;
window.resetPassword = resetPassword;
window.checkAuthentication = checkAuthentication;
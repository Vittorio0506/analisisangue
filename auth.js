// js/auth.js
// Funzione per la registrazione
async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Mostra messaggio di successo
        const successMessage = document.querySelector('.message.success');
        if (successMessage) {
            successMessage.textContent = "Registrazione avvenuta con successo! Controlla la tua email per verificare l'account.";
            successMessage.style.display = 'block';
            
            // Nascondi eventuali messaggi di errore
            const errorMessage = document.querySelector('.message.error');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
        
        return data;
    } catch (error) {
        handleError(error);
        return null;
    }
}

// Funzione per il login
async function signIn(email, password) {
    try {
        // Assicurati che supabase sia definito correttamente
        if (!supabase || !supabase.auth) {
            throw new Error("Client Supabase non inizializzato correttamente");
        }
        
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
        return null;
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
        
        // Mostra messaggio di successo
        const successMessage = document.querySelector('.message.success');
        if (successMessage) {
            successMessage.textContent = "Istruzioni per il reset della password inviate alla tua email.";
            successMessage.style.display = 'block';
            
            // Nascondi eventuali messaggi di errore
            const errorMessage = document.querySelector('.message.error');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
        
        return data;
    } catch (error) {
        handleError(error);
        return null;
    }
}

// Funzione per verificare l'autenticazione
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
    console.log("DOM caricato, configurazione listener auth...");
    
    // Form di login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log("Form login trovato, aggiungo event listener");
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Tentativo di login...");
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            await signIn(email, password);
        });
    } else {
        console.log("Form login non trovato");
    }
    
    // Form di registrazione
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        console.log("Form signup trovato, aggiungo event listener");
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Tentativo di registrazione...");
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            await signUp(email, password);
        });
    } else {
        console.log("Form signup non trovato");
    }
    
    // Pulsante di logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await signOut();
        });
    }
});

// Esponi le funzioni di autenticazione globalmente
window.signIn = signIn;
window.signUp = signUp;
window.resetPassword = resetPassword;
window.checkAuthentication = checkAuthentication;
window.signOut = signOut;
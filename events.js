// js/events.js
// Funzione per ottenere gli eventi
async function getEvents(startDate = null, endDate = null) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        let query = supabase.from('events')
            .select('*')
            .eq('user_id', user.id);
        
        if (startDate) {
            query = query.gte('date', startDate);
        }
        
        if (endDate) {
            query = query.lte('date', endDate);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per aggiungere un evento
async function addEvent(date, description) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        const { data, error } = await supabase.from('events').insert({
            user_id: user.id,
            date: date,
            description: description
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Gestisci il form degli eventi quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const date = document.getElementById('event-date').value;
            const description = document.getElementById('event-description').value;
            
            await addEvent(date, description);
            
            // Resetta il form
            eventForm.reset();
            alert('Evento aggiunto con successo!');
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
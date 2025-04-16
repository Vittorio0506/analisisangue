// js/charts.js
// Funzione per creare un grafico dei valori
async function createValueChart(canvasId, startDate, endDate, classId = null) {
    try {
        // Verifica se getValues è disponibile, altrimenti la definisce localmente
        const fetchValues = window.getValues || async function(start, end) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                
                let query = supabase.from('values')
                    .select(`
                        *,
                        families (name),
                        classes (name),
                        units (symbol)
                    `)
                    .eq('user_id', user.id);
                
                if (start) {
                    query = query.gte('date', start);
                }
                
                if (end) {
                    query = query.lte('date', end);
                }
                
                const { data, error } = await query;
                
                if (error) throw error;
                return data;
            } catch (error) {
                handleError(error);
                return [];
            }
        };
        
        // Ottieni i valori dal database
        const values = await fetchValues(startDate, endDate);
        
        // Filtra per classe se specificata
        let filteredValues = values;
        if (classId) {
            filteredValues = values.filter(value => value.class_id === classId);
        }
        
        // Raggruppa i valori per data
        const valuesByDate = {};
        filteredValues.forEach(value => {
            if (!valuesByDate[value.date]) {
                valuesByDate[value.date] = 0;
            }
            valuesByDate[value.date] += parseFloat(value.numeric_value);
        });
        
        // Converti in array per Chart.js
        const dates = Object.keys(valuesByDate).sort();
        const data = dates.map(date => valuesByDate[date]);
        
        // Crea il grafico
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Valori',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        handleError(error);
    }
}

// Crea grafici quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('value-chart');
    if (chartCanvas) {
        // Per impostazione predefinita, mostra gli ultimi 30 giorni
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const startDateStr = startDate.toISOString().split('T')[0];
        
        createValueChart('value-chart', startDateStr, endDate);
        
        // Gestisci i filtri del grafico
        const filterForm = document.getElementById('chart-filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const startDate = document.getElementById('filter-start-date').value;
                const endDate = document.getElementById('filter-end-date').value;
                const classId = document.getElementById('filter-class').value || null;
                
                createValueChart('value-chart', startDate, endDate, classId);
            });
        }
    }
});

// Controlla se l'utente è autenticato
document.addEventListener('DOMContentLoaded', async () => {
    // Utilizziamo checkAuthentication se disponibile a livello globale
    const checkAuth = window.checkAuthentication || async function() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            handleError(error);
            return null;
        }
    };
    
    const user = await checkAuth();
    if (!user) {
        // Reindirizza alla pagina di login
        window.location.href = 'index.html';
    }
});
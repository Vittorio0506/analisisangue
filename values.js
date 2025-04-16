// js/values.js
// Funzione per ottenere i valori
async function getValues(startDate = null, endDate = null) {
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

// Funzione per aggiungere un valore
async function addValue(date, numericValue, familyId, classId, unitId) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        const { data, error } = await supabase.from('values').insert({
            user_id: user.id,
            date: date,
            numeric_value: numericValue,
            family_id: familyId,
            class_id: classId,
            unit_id: unitId
        });
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per ottenere tutte le famiglie
async function getFamilies() {
    try {
        const { data, error } = await supabase.from('families').select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per ottenere le classi di una famiglia
async function getClasses(familyId) {
    try {
        const { data, error } = await supabase.from('classes')
            .select('*')
            .eq('family_id', familyId);
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Funzione per ottenere tutte le unità di misura
async function getUnits() {
    try {
        const { data, error } = await supabase.from('units').select('*');
        
        if (error) throw error;
        return data;
    } catch (error) {
        handleError(error);
    }
}

// Popola i selettori quando il DOM è caricato
document.addEventListener('DOMContentLoaded', async () => {
    // Controlla se è la pagina di inserimento valori
    const familySelect = document.getElementById('family-select');
    if (familySelect) {
        // Popola il selettore delle famiglie
        const families = await getFamilies();
        families.forEach(family => {
            const option = document.createElement('option');
            option.value = family.id;
            option.textContent = family.name;
            familySelect.appendChild(option);
        });
        
        // Gestisci il cambio di famiglia
        familySelect.addEventListener('change', async () => {
            const familyId = familySelect.value;
            const classSelect = document.getElementById('class-select');
            
            // Resetta il selettore delle classi
            classSelect.innerHTML = '<option value="">Seleziona una classe</option>';
            
            // Popola il selettore delle classi
            const classes = await getClasses(familyId);
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                classSelect.appendChild(option);
            });
        });
        
        // Popola il selettore delle unità
        const unitSelect = document.getElementById('unit-select');
        const units = await getUnits();
        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit.id;
            option.textContent = `${unit.name} (${unit.symbol})`;
            unitSelect.appendChild(option);
        });
        
        // Gestisci il form di inserimento valori
        const valueForm = document.getElementById('value-form');
        if (valueForm) {
            valueForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const date = document.getElementById('date-input').value;
                const numericValue = document.getElementById('value-input').value;
                const familyId = familySelect.value;
                const classId = document.getElementById('class-select').value;
                const unitId = unitSelect.value;
                
                await addValue(date, numericValue, familyId, classId, unitId);
                
                // Resetta il form
                valueForm.reset();
                alert('Valore aggiunto con successo!');
            });
        }
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
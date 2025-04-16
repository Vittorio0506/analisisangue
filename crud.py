# crud.py
from db import supabase  # Importa il client Supabase configurato

# Funzioni per autenticazione
# Funzioni per gestione valori
# Funzioni per gestione eventi
# Funzioni per dati di riferimento

# Registrazione di un nuovo utente
def sign_up(email, password, full_name=None):
    """
    Registra un nuovo utente nel sistema.
    
    Args:
        email (str): Email dell'utente
        password (str): Password dell'utente
        full_name (str, optional): Nome completo dell'utente
        
    Returns:
        dict: Dati dell'utente e token di sessione
    """
    try:
        # Registra l'utente con Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        # Se la registrazione ha successo e full_name è fornito, aggiungilo al profilo
        if full_name and auth_response.user:
            user_id = auth_response.user.id
            
            # Inserisci i dati del profilo utente nella tabella user_profiles
            profile_response = supabase.table('user_profiles').insert({
                "id": user_id,
                "full_name": full_name
            }).execute()
            
        return auth_response
    except Exception as e:
        print(f"Errore in sign_up: {str(e)}")
        raise e

# Login di un utente esistente
def sign_in(email, password):
    """
    Effettua il login di un utente.
    
    Args:
        email (str): Email dell'utente
        password (str): Password dell'utente
        
    Returns:
        dict: Dati dell'utente e token di sessione
    """
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        return response
    except Exception as e:
        print(f"Errore in sign_in: {str(e)}")
        raise e

# Invio email per recupero password
def reset_password(email):
    """
    Invia un'email per il reset della password.
    
    Args:
        email (str): Email dell'utente
        
    Returns:
        dict: Risultato dell'operazione
    """
    try:
        response = supabase.auth.reset_password_for_email(email)
        return response
    except Exception as e:
        print(f"Errore in reset_password: {str(e)}")
        raise e

# Aggiornamento password
def update_password(access_token, new_password):
    """
    Aggiorna la password di un utente.
    
    Args:
        access_token (str): Token di recupero password
        new_password (str): Nuova password
        
    Returns:
        dict: Risultato dell'operazione
    """
    try:
        # Imposta il token di accesso
        supabase.auth.set_session(access_token)
        
        # Aggiorna la password
        response = supabase.auth.update_user({"password": new_password})
        return response
    except Exception as e:
        print(f"Errore in update_password: {str(e)}")
        raise e
    
    # CREATE - Inserimento di un nuovo evento
def add_event(user_id, date, description):
    """
    Aggiunge un nuovo evento nel database.
    
    Args:
        user_id (str): ID dell'utente
        date (str): Data in formato 'YYYY-MM-DD'
        description (str): Descrizione dell'evento
        
    Returns:
        dict: Dati dell'evento inserito
    """
    try:
        response = supabase.table('events').insert({
            'user_id': user_id,
            'date': date,
            'description': description
        }).execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in add_event: {str(e)}")
        raise e

# READ - Ottenere i valori con filtri opzionali
def get_values(user_id, start_date=None, end_date=None):
    """
    Ottiene i valori dal database con filtri opzionali.
    
    Args:
        user_id (str): ID dell'utente
        start_date (str, optional): Data di inizio in formato 'YYYY-MM-DD'
        end_date (str, optional): Data di fine in formato 'YYYY-MM-DD'
        
    Returns:
        list: Lista dei valori che soddisfano i criteri
    """
    try:
        # Inizia la query
        query = supabase.table('values')\
            .select('*, families(name), classes(name), units(symbol)')\
            .eq('user_id', user_id)
        
        # Applica i filtri opzionali
        if start_date:
            query = query.gte('date', start_date)
        if end_date:
            query = query.lte('date', end_date)
        
        # Ordina per data
        query = query.order('date', desc=True)
        
        # Esegui la query
        response = query.execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in get_values: {str(e)}")
        raise e

# CREATE - Aggiungere un nuovo valore
def add_value(user_id, date, numeric_value, family_id, class_id, unit_id):
    """
    Aggiunge un nuovo valore nel database.
    
    Args:
        user_id (str): ID dell'utente
        date (str): Data in formato 'YYYY-MM-DD'
        numeric_value (float): Valore numerico
        family_id (str): ID della famiglia
        class_id (str): ID della classe
        unit_id (str): ID dell'unità di misura
        
    Returns:
        dict: Dati del valore inserito
    """
    try:
        response = supabase.table('values').insert({
            'user_id': user_id,
            'date': date,
            'numeric_value': numeric_value,
            'family_id': family_id,
            'class_id': class_id,
            'unit_id': unit_id
        }).execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in add_value: {str(e)}")
        raise e
# UPDATE - Aggiornamento di un evento esistente
def update_event(event_id, data):
    """
    Aggiorna un evento esistente nel database.
    
    Args:
        event_id (str): ID dell'evento da aggiornare
        data (dict): Dizionario con i dati da aggiornare
        
    Returns:
        dict: Dati aggiornati dell'evento
    """
    try:
        # Verifica che data contenga solo campi validi
        valid_fields = ['date', 'description']
        update_data = {k: v for k, v in data.items() if k in valid_fields}
        
        # Aggiorna l'evento
        response = supabase.table('events')\
            .update(update_data)\
            .eq('id', event_id)\
            .execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in update_event: {str(e)}")
        raise e

# DELETE - Eliminazione di un evento
def delete_event(event_id):
    """
    Elimina un evento dal database.
    
    Args:
        event_id (str): ID dell'evento da eliminare
        
    Returns:
        dict: Conferma dell'eliminazione
    """
    try:
        response = supabase.table('events')\
            .delete()\
            .eq('id', event_id)\
            .execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in delete_event: {str(e)}")
        raise e
    
    # Ottenere tutte le famiglie
def get_families():
    """
    Ottiene tutte le famiglie disponibili.
    
    Returns:
        list: Lista delle famiglie
    """
    try:
        response = supabase.table('families')\
            .select('*')\
            .order('name')\
            .execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in get_families: {str(e)}")
        raise e

# Ottenere le classi di una famiglia
def get_classes(family_id=None):
    """
    Ottiene le classi, opzionalmente filtrate per famiglia.
    
    Args:
        family_id (str, optional): ID della famiglia per filtrare
        
    Returns:
        list: Lista delle classi
    """
    try:
        query = supabase.table('classes').select('*')
        
        if family_id:
            query = query.eq('family_id', family_id)
        
        query = query.order('name')
        response = query.execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in get_classes: {str(e)}")
        raise e

# Ottenere tutte le unità di misura
def get_units():
    """
    Ottiene tutte le unità di misura disponibili.
    
    Returns:
        list: Lista delle unità di misura
    """
    try:
        response = supabase.table('units')\
            .select('*')\
            .order('name')\
            .execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in get_units: {str(e)}")
        raise e
    
    # Ottiene i dati per i grafici con aggregazioni
def get_aggregated_values(user_id, period_type, start_date, end_date, class_id=None):
    """
    Ottiene valori aggregati per i grafici.
    
    Args:
        user_id (str): ID dell'utente
        period_type (str): Tipo di periodo ('day', 'week', 'month', 'year')
        start_date (str): Data di inizio in formato 'YYYY-MM-DD'
        end_date (str): Data di fine in formato 'YYYY-MM-DD'
        class_id (str, optional): ID della classe per filtrare
        
    Returns:
        list: Dati aggregati per il periodo specificato
    """
    try:
        # Questa funzione utilizza le funzioni di aggregazione di PostgreSQL
        # Definiamo una funzione personalizzata sul database Supabase
        
        # Nota: questa è una funzione SQL che dovresti prima creare su Supabase
        # usando l'editor SQL. Qui simuliamo il risultato.
        
        # La query potrebbe essere simile a questa:
        # 
        # CREATE OR REPLACE FUNCTION get_aggregated_values(
        #     p_user_id UUID,
        #     p_period_type TEXT,
        #     p_start_date DATE,
        #     p_end_date DATE,
        #     p_class_id UUID DEFAULT NULL
        # ) RETURNS TABLE (
        #     period TEXT,
        #     total DECIMAL
        # ) LANGUAGE plpgsql AS $$
        # BEGIN
        #     RETURN QUERY
        #     SELECT
        #         CASE
        #             WHEN p_period_type = 'day' THEN TO_CHAR(date, 'YYYY-MM-DD')
        #             WHEN p_period_type = 'week' THEN TO_CHAR(date_trunc('week', date), 'YYYY-MM-DD')
        #             WHEN p_period_type = 'month' THEN TO_CHAR(date_trunc('month', date), 'YYYY-MM')
        #             WHEN p_period_type = 'year' THEN TO_CHAR(date_trunc('year', date), 'YYYY')
        #         END AS period,
        #         SUM(numeric_value) AS total
        #     FROM
        #         values
        #     WHERE
        #         user_id = p_user_id
        #         AND date BETWEEN p_start_date AND p_end_date
        #         AND (p_class_id IS NULL OR class_id = p_class_id)
        #     GROUP BY
        #         period
        #     ORDER BY
        #         period;
        # END; $$;
        
        # Chiamata alla funzione stored
        response = supabase.rpc(
            'get_aggregated_values',
            {
                'p_user_id': user_id,
                'p_period_type': period_type,
                'p_start_date': start_date,
                'p_end_date': end_date,
                'p_class_id': class_id
            }
        ).execute()
        
        return response.data
    except Exception as e:
        print(f"Errore in get_aggregated_values: {str(e)}")
        raise e
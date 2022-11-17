import { createClient } from '@supabase/supabase-js'


async function getPlantsByUser(ownerID) { 
    
    // TODO: Add RLS such that only users who are logged in and match the query can access

    let resp = await supabase
    .from('plants')
    .select('*')
    .eq('owner', ownerID)
    .then(response => {
        return response
    })

    return resp
}

function addWatering(plant_id, health) { 
    
    // TODO: Owner should be converted to whomever the currently authenticated user is

    supabase
    .from('waterings')
    .insert([
        { 'plant_id' : plant_id, 'observed_health': health },
      ])
    .then(response => {
      return response
    })
  
}

const supabase = createClient(supabaseUrl, supabaseKey)
export { supabase, getPlantsByUser, addWatering }
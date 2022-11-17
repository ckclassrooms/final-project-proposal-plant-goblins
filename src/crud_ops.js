// File to insert rows into the plant table
// import process
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// TODO: replace this later with auth

dotenv.config({path : "./keys.env"})
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


// insert into plants
function addPlant(name, ownerID) { 
    
    // TODO: Owner should be converted to whomever the currently authenticated user is

    supabase
    .from('plants')
    .insert([
        { 'name' : name, 'owner': ownerID },
      ])
    .then(response => {
      return response
    })
  
}


// get plants by user
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

async function getWateringsByPlant(plant_id) { 
    
    // TODO: Add RLS such that only users who are logged in and match the query can access this data

    let resp = await supabase
    .from('waterings')
    .select('*')
    .eq('plant_id', plant_id)
    .then(response => {
        return response
    })

    return resp
}

// insert into plants
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



// addPlant("greg", 6)
export {addPlant, getPlantsByUser, getWateringsByPlant, addWatering};
// console.log(data2)

import { createClient } from '@supabase/supabase-js'


const supabaseUrl = "https://jjrfupwhjwljaaquzxpa.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcmZ1cHdoandsamFhcXV6eHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njc4NDIzNzAsImV4cCI6MTk4MzQxODM3MH0._dWFNy17lGKdylRVoPKETJDeITA2PM-X3eFoS2I-ZY0"

// async function getPlantsByUser(ownerID) { 
    
//     // TODO: Add RLS such that only users who are logged in and match the query can access

    // let resp = await supabase
    // .from('plants')
    // .select('*')
    // .eq('owner', ownerID)
    // .then(response => {
    //     return response
    // })

//     return resp
// }

// async function getWateringsByPlant(plant_id) { 
    
//   // TODO: Add RLS such that only users who are logged in and match the query can access this data

//   let resp = await supabase
//   .from('waterings')
//   .select('*')
//   .eq('plant_id', plant_id)
//   .then(response => {
//       return response
//   })

//   return resp
// }

// function addWatering(plant_id, health) { 
    
//     // TODO: Owner should be converted to whomever the currently authenticated user is

//     supabase
//     .from('waterings')
//     .insert([
//         { 'plant_id' : plant_id, 'observed_health': health },
//       ])
//     .then(response => {
//       return response
//     })
  
// }

// function getPlantInfo(ownerID) { 

//   let plantInfo = []
//   getPlantsByUser(ownerID).then(response => {

//     // this.state = {all_plants : response["data"]}
//     for(let i = 0; i < response["data"].length; i++) { 
      
//       let plant = response["data"][i]
//       // console.log(plant);
//       let waterings = []
//       getWateringsByPlant(plant["id"]).then(response => {
//         waterings = response["data"]
//         let lastWatering = waterings[waterings.length - 1]
//         // console.log(lastWatering)
//         plantInfo.push({
//           'name' : plant["name"],
//           'lastWatering' : lastWatering["watered_at"],
//           'observedHealth' : lastWatering["observed_health"]
//         })

//       })
//     }
//     return plantInfo;
//   });

// }
async function addPlant(name, ownerID) { 
    
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


const supabase = createClient(supabaseUrl, supabaseKey)
// export { supabase, getPlantsByUser, addWatering,  getPlantInfo, getWateringsByPlant, addPlant}
export {supabase, addPlant}
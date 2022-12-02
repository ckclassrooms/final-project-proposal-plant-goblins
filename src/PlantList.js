import { supabase } from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { getDefaultNormalizer, render } from '@testing-library/react';

function PlantList({plants, setPlants, user, getAllPlants, selected, setSelected}) { 
    
    function getLabelColor(plant) { 
      // we need to get the last watering
      let waterings = plant["waterings"]
        let water_every = plant["water_every"]
      // the last watering will always be the last one in the array
      if(waterings.length != 0 ) { 
  
        let lastWatering = waterings[waterings.length - 1]
        let dt = new Date(lastWatering["watered_at"])
        let hour_diff = Math.abs((((dt.getTime() - Date.now()) / 1000) / 60) / 60)
        switch(true) { 
          case (hour_diff <= water_every):
            return 'green'
            break;
          case (hour_diff > water_every && hour_diff <= (water_every * 2)):
            return 'orange'
            break;
          case (hour_diff > (water_every * 2)):
            return 'red'
            break; 
        }
      } else { 
        // if there are no waterings, return blue
        return "blue";
      }
    }
    
    let all_plants = plants  
      let plantList = []
  
      for(let i = 0; i < all_plants.length; i++) { 
  
        let plant_div_id = `plant_${all_plants[i]["id"]}`
  
        async function deletePlant() { 
          
          if(selected["id"] == all_plants[i]["id"]) { 
            setSelected({})
          }
          let new_all_plants = JSON.parse(JSON.stringify(plants))
          new_all_plants.splice(i, 1)
          setPlants(new_all_plants)
  
          // setPlants(await getAllPlants())
  
          let f = await supabase
          .from('waterings')
          .delete()
          .eq('plant_id', all_plants[i]["id"])
  
          let z = await supabase
          .from('plants')
          .delete()
          .eq('id', all_plants[i]["id"])
  
          if(z["data"]) { 
            alert('Could not delete your plant. Check the console for more details')
            console.log(z["data"])
  
          } 
  
        }
  
        async function waterPlant() { 
          
          let plantHealth = parseInt(prompt("Enter your plan's health on a scale of 1-5"))
          if(!plantHealth || plantHealth > 5 || plantHealth < 1) { 
            alert("Invalid health inputted! Health should be an integer from 1-5")
            return;
          }
          let resp = await supabase
            .from('waterings')
            .insert([{'plant_id' :  all_plants[i]["id"], 'observed_health' : plantHealth}])
            if(resp["error"]) { 
              alert('Could not water this plant. Check the console for more details. Sorry!')
              console.log(resp)
            } else { 
              console.log("watered this plant successfully")
              
              let new_all_plants = JSON.parse(JSON.stringify(plants))
              
              new_all_plants[i]["waterings"].push({
                'id' : -1,
                'watered_at' : new Date().toISOString(),
                'plant_id' : new_all_plants[i]["id"],
                'observed_health' : plantHealth
              })
              console.log("new waterings");
              console.log(new_all_plants[i])
              setPlants(new_all_plants)
              if(selected["id"] == all_plants[i]["id"]) { 
                setSelected(new_all_plants[i])
              }
            } 
          }
        
          function selectThisPlant() { 
            setSelected(all_plants[i])
          }
  
          let styling = {
            'text-decoration': `underline ${getLabelColor(all_plants[i])} 5px`
           }
  
        plantList.push(
  
        <div class="flexbox">
    <div class="gridded_box">
      <div class="cell">
        <p class="plantTitle" id="plantStatus" style={styling}> {all_plants[i]["name"]}</p>
      </div>
    </div>
    <div class="gridded_box">
      <div class="cell">
        <button class="water" onClick={waterPlant}> water 🌊</button>
      </div>
    </div>
    <div class="gridded_box">
      <div class="cell">
        <button class="select" onClick={selectThisPlant}> select 📊</button>
      </div>
    </div>
    <div class="gridded_box">
      <div class="cell">
        <button class="delete" onClick={deletePlant}> delete ❌</button>
      </div>
    </div>
  </div>
        )
    
      }
      return <div class="plantContainer">
        <ul>{plantList}</ul>
      </div>
    }

export default PlantList;
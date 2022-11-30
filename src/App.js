import logo from './logo.svg';
import './App.css';
import { supabase, getPlantsByUser, addWatering, getWateringsByPlant, getPlantInfo, addPlant} from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { render } from '@testing-library/react';




// TODO: 
// - deploy current build to netlify and test
// - push to github
// 
// Change plant label based on last watered
// if watered within a day, color green
// if watered 1-3 days ago, yellow
// if watered less than that, red
// if never watered, blue

function PlantList({plants, setPlants, user, getAllPlants}) { 
    let all_plants = plants  
    let plantList = []

    for(let i = 0; i < all_plants.length; i++) { 

      let plant_div_id = `plant_${all_plants[i]["id"]}`
      function handleButton(stuff) { 
        document.getElementById(plant_div_id).style.backgroundColor = "green";
      }

      async function deletePlant() { 
        
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

        } else { 

          setPlants(await getAllPlants())

        }

      }

      async function waterPlant() { 
        let resp = await supabase
          .from('waterings')
          .insert([{'plant_id' :  all_plants[i]["id"], 'observed_health' : 5}])
          if(resp["error"]) { 
            alert('Could not water this plant. Check the console for more details. Sorry!')
            console.log(resp)
          } 
        }
      console.log(all_plants[i])
      plantList.push(

      <div class="plantEntry" id={plant_div_id}>
      <h3>{all_plants[i]["name"]}</h3>
      <button onClick={waterPlant}>Water</button>  
      <button onClick={deletePlant}>Delete</button>  
      <details>
  <summary>Waterings</summary>
  This text will be hidden if your browser supports it.
</details>
      </div>
      )
  
    }
    return <div class="plantContainer">
      <ul>{plantList}</ul>
    </div>
  }

function App () {

    const [user, setUser] = useState(null);
    const [plants, setPlants] = useState([])
    useEffect(() => {

      checkUser();
      window.addEventListener('hashchange', function() {
        checkUser();
      });
    }, [])

    useEffect(() => {
      // change the current user
      if(user) {
        document.getElementById("currentUserLabel").innerText = user.email
      }
      
    })

    async function getAllPlants() { 
      let resp = await supabase
          .from('plants')
          .select('*')
          .eq('owner', user.id)
          console.log(resp);
          
          for(let plant of resp["data"]) {
            let waterings = await getWaterings(plant["id"])
            plant["waterings"] = waterings
          }
          return(resp["data"])

    }

    async function checkUser() {
      /* if a user is signed in, update local state */
      const user = await supabase.auth.getUser();
      setUser(user["data"]["user"]);
      let userid = user["data"]["user"]["id"]
      // get the user's plants 
      let resp = await supabase
        .from('plants')
        .select('*')
        .eq('owner', userid)
        
      if(resp["error"] != null) { 
        alert('There was an issue getting your plants. Please check the console for more information. Sorry about that!')
        console.log(resp["error"])
      } else { 

        // TODO: get waterings for each plant
        for(let plant of resp["data"]) {
          let waterings = await getWaterings(plant["id"])
          plant["waterings"] = waterings
        }
        setPlants(resp["data"])
      }
    }

    async function signInWithGitHub() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
      })
    }
    async function signOut() {
      /* sign the user out */
      await supabase.auth.signOut();
      document.getElementById("currentUserLabel").innerText = "Current User: None"
      setUser(null);
    }

    async function addPlantF() {
      
      let plantName = prompt("Enter your plant name!")
      if(!plantName) { 
        return;
      }
      let z  = await supabase
      .from('plants')
      .insert([
          { 'name' : plantName, 'owner': user.id },
        ])
      .then(response => {
        return response
      })
      // handle any errors
      if(z["error"] != null) { 
        alert('There was an issue adding your plant. Please check the console for more information. Sorry about that!')
        console.log(z["error"])
      } else { 


        console.log("WATERINGS:");
        
        // TODO: add in function call to getPlants
        setPlants(await getAllPlants())

      }
    }

    async function getWaterings(plant_id) { 
      let resp = await supabase
      .from('waterings')
      .select('*')
      .eq('plant_id', plant_id)
      return resp["data"]
    }

    console.log("CURRENT USER")
    console.log(user)
    if (user) {
      return (
        <div className="App">
          <h3>User: {user.email}</h3>
          <button onClick={signOut}>Sign out</button>
          <button onClick={addPlantF}>Add plant</button>
                <PlantList plants={plants} setPlants={setPlants} user={user} getAllPlants={getAllPlants}/>
        </div>
      )
    }
    // let plants = [{"name" : "gred"}]
    return (
      <div className="App">
      {/* <PlantList 
      /> */}
      <h1>Hello, please sign in!</h1>
      <button onClick={signInWithGitHub}>Sign In</button>
      </div>
    );

}

export default App;

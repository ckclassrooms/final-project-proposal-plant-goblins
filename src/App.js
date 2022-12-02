import './App.css';
import { supabase } from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { render } from '@testing-library/react';
import Dashboard from './Dashboard.js'
import PlantList from './PlantList.js'
import Sidebar from './Sidebar.js'

function App () {

    // setting state
    const [user, setUser] = useState(null);
    const [plants, setPlants] = useState([])
    const [selected, setSelected] = useState({})

    useEffect(() => {
      // only happens when the app starts
      checkUser();
      window.addEventListener('hashchange', function() {
        checkUser();
      });
    }, [])

    useEffect(() => {
      // change the current user, happens on state change 
      if(user) {
        document.getElementById("currentUserLabel").innerText = user.email
      }
    })

    // master function to update the plants
    async function getAllPlants() { 
      let resp = await supabase
          .from('plants')
          .select('*')
          .eq('owner', user.id).order('id', {ascending : false})
          console.log(resp);
          
          for(let plant of resp["data"]) {
            let waterings = await getWaterings(plant["id"])
            plant["waterings"] = waterings
          }
          return(resp["data"])
    }
    
    async function checkUser() {
      // when we've got our user, get their plants
      
      const user = await supabase.auth.getUser();
      setUser(user["data"]["user"]);
      let userid = user["data"]["user"]["id"]
      // get the user's plants 
      let resp = await supabase
        .from('plants')
        .select('*')
        .eq('owner', userid).order('id', {ascending : false})
        
      if(resp["error"] != null) { 
        alert('There was an issue getting your plants. Please check the console for more information. Sorry about that!')
        console.log(resp["error"])
      } else { 

        for(let plant of resp["data"]) {
          let waterings = await getWaterings(plant["id"])
          plant["waterings"] = waterings
        }
        setPlants(resp["data"])
        document.getElementById('signOutButton').setAttribute('style', 'visibility:visible')
        document.getElementById('signOutButton').onclick = signOut
      }
    }

    // boilerplate oauth code 
    async function signInWithGitHub() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
      })
    }
    async function signOut() {
      /* sign the user out */
      await supabase.auth.signOut();
      document.getElementById("currentUserLabel").innerText = "Current User: None"
      document.getElementById('signOutButton').setAttribute('style', 'visibility:hidden')
      setUser(null);

    }

    // I couldn't do this function locally first because the auto-generated plant ID is something I can't locally predict. 
    async function addPlantF() {
      
      // check for valid input
      let plantName = document.getElementById('plantName').value
      let numhours = document.getElementById('plantHours').value
      console.log("Num hours")
      console.log(numhours)
      if(numhours < 1) { 
        alert("hours watering cannot be zero or negative!")
        return;
      }
      if(plantName == "") { 
        alert("plant name cannot be empty!")
        return;
      }
      document.getElementById('plantName').value = ""
      document.getElementById('plantHours').value = ""
      let z  = await supabase
      .from('plants')
      .insert([
          { 'name' : plantName, 'owner': user.id, 'water_every' : numhours },
        ])
      .then(response => {
        return response
      })
      // handle any errors
      if(z["error"] != null) { 
        alert('There was an issue adding your plant. Please check the console for more information. Sorry about that!')
        console.log(z["error"])
      } else { 
        
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

    if (user) {
      return (
        <div className="App">
          <div class="mainContainer">
          <div class="sidebarCol column">
            <Sidebar addPlantF={addPlantF}/>
          </div>
            <div class="plantCol column">
              <PlantList 
                        plants={plants} 
                        setPlants={setPlants}
                        user={user}
                        getAllPlants={getAllPlants}
                        selected={selected}
                        setSelected={setSelected}/>
            </div>
            <div class="insightCol column">
              <Dashboard selected={selected}/>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="App">

      <h1>Hello, please sign in!</h1>
      <button onClick={signInWithGitHub}>Sign In</button>
      </div>
    );

}

export default App;

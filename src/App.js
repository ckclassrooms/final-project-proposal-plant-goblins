import logo from './logo.svg';
import './App.css';
import { supabase, getPlantsByUser, addWatering, getWateringsByPlant, getPlantInfo, addPlant} from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { render } from '@testing-library/react';

// getPlantsByUser(5).then(response => {
//   console.log(response)
// })

// THIS KINDA WORKS BUT NOT REALLY. REDO THIS CODE FROM SCRATCH.

// class PlantList extends React.Component { 
//   constructor(props) { 
//     super(props)
//     this.state = { 'all_plants' : [{'name' : 'PLANTS NOW LOADING'}]}
//   }
  
//   componentDidMount() {
//     getPlantsByUser(4).then(response => {
//       this.setState({'all_plants' : response["data"]})
//     });
//   }
//    render() {
//     console.log("plantList render")
    
//     let all_plants = this.state.all_plants
//     let plantList = []

//     for(let i = 0; i < all_plants.length; i++) { 

//       let plant_div_id = `plant_${all_plants[i]["id"]}`
//       function handleButton(stuff) { 
//         document.getElementById(plant_div_id).style.backgroundColor = "green";
//       }

//       console.log(all_plants[i])  
//       plantList.push(

//       <div class="plantEntry" id={plant_div_id}>
//       <h3>{all_plants[i]["name"]}</h3>
//       <button onClick={handleButton}>Water</button>    
//       </div>
//       )
  
//     }
//     return <div class="plantContainer">
//       <ul>{plantList}</ul>
//     </div>
//   }
// }


function PlantList({plants, setPlants, user}) { 
    let all_plants = plants  
    let plantList = []
    for(let i = 0; i < all_plants.length; i++) { 

      let plant_div_id = `plant_${all_plants[i]["id"]}`
      function handleButton(stuff) { 
        document.getElementById(plant_div_id).style.backgroundColor = "green";
      }
      
      async function deletePlant() { 
        
        let z = await supabase
        .from('plants')
        .delete()
        .eq('id', all_plants[i]["id"])

        if(z["data"]) { 
          alert('Could not delete your plant. Check the console for more details')
          console.log(z["data"])

        } else { 
          let resp = await supabase
          .from('plants')
          .select('*')
          .eq('owner', user.id)
          console.log(resp);
          setPlants(resp["data"])
        }

      }

      console.log(all_plants[i])  
      plantList.push(

      <div class="plantEntry" id={plant_div_id}>
      <h3>{all_plants[i]["name"]}</h3>
      <button onClick={handleButton}>Water</button>  
      <button onClick={deletePlant}>Delete</button>    
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
    async function checkUser() {
      /* if a user is signed in, update local state */
      const user = await supabase.auth.getUser();
      setUser(user["data"]["user"]);
      console.log("IN THIS ")
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

        let resp = await supabase
        .from('plants')
        .select('*')
        .eq('owner', user.id)
        console.log(resp);
        setPlants(resp["data"])

      }
    }

    console.log("CURRENT USER")
    console.log(user)
    if (user) {
      return (
        <div className="App">
          <h3>User: {user.email}</h3>
          <button onClick={signOut}>Sign out</button>
          <button onClick={addPlantF}>Add plant</button>
                <PlantList plants={plants} setPlants={setPlants} user={user}/>
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

import logo from './logo.svg';
import './App.css';
import { supabase } from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { render } from '@testing-library/react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Line, Chart } from "react-chartjs-2";

// TODO: 

// Add dashboard component 
// 


const lineOptions = {
  plugins: {
    title: {
      display: true,
      text: 'waterings by day',
      color: 'black'
    },
    legend: {
      display: false,
    }
  },
  scales : { 
    x : { 
      ticks : {
        font : {
          color : 'black'
        },
        color : 'black'
      }
    },
    y : { 
      ticks : {
        font : {
          color : 'black'
        },
        color : 'black'
      }
    }
  },
  
}

const barOptions = {
  plugins: {
    title: {
      display: true,
      text: 'health by waterings',
      color: 'black'
    },
    legend: {
      display: false,
    }
  },
  scales : { 
    x : { 
      ticks : {
        font : {
          color : 'black'
        },
        color : 'black'
      }
    },
    y : { 
      ticks : {
        font : {
          color : 'black'
        },
        color : 'black'
      }
    }
  },
  
}

function Dashboard({selected}) { 

  function getCountsByDay() { 
    
    function isDateSame(first, second) { 
      if(
        first.getFullYear() == second.getFullYear() &&
        first.getMonth() == second.getMonth() &&
        first.getDate() == second.getDate() 
      )  { return true; }
      else { 
        return false;
      }
    }

    // for now, we'll go back 7 days
    const daysBack = 7
    let datesXDaysBack = []
    let prettyDate = []
    let wateringsByDay = [] 
    for(let i = 0; i < daysBack; i++) { 
      let rightNow = new Date()
      rightNow.setDate(rightNow.getDate() - i)
      datesXDaysBack.push(rightNow.toISOString())
      prettyDate.push(rightNow.toDateString())
    }
    const waterings = selected["waterings"]
    console.log(waterings)
    // get counts for each day
    for(let date in datesXDaysBack) { 
      let count = 0;
      for(let wateringDate in waterings) {

        let currentDay = new Date(datesXDaysBack[date])
        let wateringDay = new Date(waterings[wateringDate]["watered_at"])
        if(isDateSame(currentDay, wateringDay)) { count += 1 };
      }
      wateringsByDay.push(count)
    }

    return [prettyDate.reverse(), wateringsByDay.reverse()]
  }
  
  // create the first chart
  let [dates, counts] = getCountsByDay()
  const data = {
    labels: dates,
    datasets: [
      {
        label: "Watering count by day",
        data: counts,
        fill: true,
        backgroundColor: "#f7d345",
        borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

  let exactTimes = []
  let health = []
  const waterings = selected["waterings"]
  for(let watering in waterings) { 
    console.log(waterings[watering]["observed_health"])
    let wateringDay = new Date(waterings[watering]["watered_at"])

    health.push(waterings[watering]["observed_health"])
    exactTimes.push(wateringDay.toLocaleString())
  }

  const health_data = {
    labels: exactTimes,
    datasets: [
      {
        label: "health across waterings",
        data: health,
        fill: false,
        backgroundColor: "yellow",
        borderColor : 'yellow'
        // borderColor: "rgba(75,192,192,1)"
      }
    ]
  };

  // The health graph will just be all waterings put together. You can still track the health over time, but accounting for more than one watering each day renders 'daily' health status useless. 

  if(!('name' in selected)) { 
    return <h1 class="plantHeader">Select a plant to get started!</h1>
  }
  if(selected["waterings"].length == 0) { 
    return <h1 class="plantHeader">This plant hasn't been watered yet. Water it routinely to get insights!</h1>
  }

  let lastWatering = selected["waterings"][selected['waterings'].length - 1]
  
  let dt = new Date(lastWatering["watered_at"])
  let hour_diff = Math.round(Math.abs((((dt.getTime() - Date.now()) / 1000) / 60) / 60))

  

  return <div class="basicInfo">
    
    <h1 class="plantHeader">{selected["name"]}</h1>
    <div>
    <h3 class="lastWatered">Last watered: {hour_diff}h ago</h3>
    {/* <br/> */}
    <h3 class="lastWatered">Last observed health: {lastWatering["observed_health"]} / 5</h3>
    </div>
    
    <div class="chartHolder"><Bar data={data} options={barOptions}/></div>
    <div class="chartHolder"><Line data={health_data} options={lineOptions}/></div>
    </div>
}

// enter current health of plant when you enter the plant 
// track health without watering

function PlantList({plants, setPlants, user, getAllPlants, selected, setSelected}) { 
    
  function getLabelColor(plant) { 
    // we need to get the last watering
    let waterings = plant["waterings"]

    // the last watering will always be the last one in the array
    if(waterings.length != 0 ) { 

      let lastWatering = waterings[waterings.length - 1]
      let dt = new Date(lastWatering["watered_at"])
      let hour_diff = Math.abs((((dt.getTime() - Date.now()) / 1000) / 60) / 60)
      switch(true) { 
        case (hour_diff <= 18):
          return 'green'
          break;
        case (hour_diff > 18 && hour_diff <= 36):
          return 'yellow'
          break;
        case (hour_diff > 36):
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

        } else { 

          

        }

      }

      async function waterPlant() { 
        
        let plantHealth = parseInt(prompt("Enter your plan's health on a scale of 1-5"))
        if(!plantHealth || plantHealth > 5 || plantHealth < 1) { 
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
  <div class="item">
    <div class="content">
      <p class="plantTitle" id="plantStatus" style={styling}> {all_plants[i]["name"]}</p>
    </div>
  </div>
  <div class="item">
    <div class="content">
      <button class="water" onClick={waterPlant}> water 🌊</button>
    </div>
  </div>
  <div class="item">
    <div class="content">
      <button class="select" onClick={selectThisPlant}> select 📊</button>
    </div>
  </div>
  <div class="item">
    <div class="content">
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

function App () {

    const [user, setUser] = useState(null);
    const [plants, setPlants] = useState([])
    const [selected, setSelected] = useState({})
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
          .eq('owner', user.id).order('id', {ascending : false})
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
          <div class="mainContainer">
            <div class="column sidebarCol column">
              <button onClick={addPlantF} class="addPlantButton">+ add plant + </button>
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
    // let plants = [{"name" : "gred"}]
    return (
      <div className="App">

      <h1>Hello, please sign in!</h1>
      <button onClick={signInWithGitHub}>Sign In</button>
      </div>
    );

}

export default App;

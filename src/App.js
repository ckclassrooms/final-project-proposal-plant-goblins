import logo from './logo.svg';
import './App.css';
import { supabase, getPlantsByUser, addWatering, getWateringsByPlant, getPlantInfo, addPlant} from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { render } from '@testing-library/react';

// getPlantsByUser(5).then(response => {
//   console.log(response)
// })


class PlantList extends React.Component { 
  constructor(props) { 
    super(props)
    this.state = { 'all_plants' : [{'name' : 'PLANTS NOW LOADING'}]}
  }
  
  componentDidMount() {
    getPlantsByUser(4).then(response => {
      this.setState({'all_plants' : response["data"]})
    });
  }
   render() {
    console.log("plantList render")
    
    let all_plants = this.state.all_plants
    let plantList = []

    for(let i = 0; i < all_plants.length; i++) { 

      let plant_div_id = `plant_${all_plants[i]["id"]}`
      function handleButton(stuff) { 
        document.getElementById(plant_div_id).style.backgroundColor = "green";
      }

      console.log(all_plants[i])  
      plantList.push(

      <div class="plantEntry" id={plant_div_id}>
      <h3>{all_plants[i]["name"]}</h3>
      <button onClick={handleButton}>Water</button>    
      </div>
      )
  
    }
    return <div class="plantContainer">
      <ul>{plantList}</ul>
    </div>
  }
}


class App extends React.Component {
  
  constructor(props) { 
    super(props);
    let plants = [{"name" : "LOADING PLANTS....."}]
    this.state = { 'plants' : plants }

  }
  componentDidMount() { 
    getPlantsByUser(5).then(response => {
      
      // setPlants(response["data"])
      // setPlants(response["data"])
      this.setState({
        'plants' : response["data"] 
      })
      
    });
  }
  
  render() {

    // let plants = [{"name" : "gred"}]
    return (
      <div className="App">
      <PlantList 
      />
      </div>
    );
  }

}

export default App;

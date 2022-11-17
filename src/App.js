import logo from './logo.svg';
import './App.css';
import { supabase, getPlantsByUser, addWatering, getWateringsByPlant } from './supabaseClient.js'
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
  // const [plants, setPlants] = useState([{'name' : 'PLANTS NOW LOADING'}])

  // componentWillReceiveProps(newprops) { 
  //   // this.state = {'all_plants' : newprops.all_plants}
  //   return {
  //     'all_plants' : newprops.all_plants
  //   }
  // }
  
  componentDidMount() {
    getPlantsByUser(5).then(response => {

      // this.state = {all_plants : response["data"]}
      this.setState({'all_plants' : response["data"]})
    });
  }
   render() {
    console.log("plantList render")
    
    let all_plants = this.state.all_plants
    let plantList = []

    console.log(all_plants)
    // let all_plants = this.state.all_plants

    for(let i = 0; i < all_plants.length; i++) { 
      console.log(all_plants[i])  
      plantList.push(
      <div>
      <h3>{all_plants[i]["name"]}</h3>
      <button onClick={console.log("watering " + all_plants[i]["name"])}>Water</button>    
      </div>
      )
  
    }
    return <ul>{plantList}</ul>
  }
}


class App extends React.Component {
  
  constructor(props) { 
    super(props);
    let plants = [{"name" : "LOADING PLANTS....."}]
    this.state = { 'plants' : plants }

  }

  // useEffect(() => {
  //   console.log("state change")
  // });
  // const [all_plants, setPlants] = useState([{"name" : "LOADING PLANTS....."}])

  componentDidMount() { 
    getPlantsByUser(5).then(response => {
      
      // setPlants(response["data"])
      // setPlants(response["data"])
      this.state = {
        'plants' : response["data"] 
      }
      // console.log("Updated state");
      // console.log(this.state.plants);
      
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

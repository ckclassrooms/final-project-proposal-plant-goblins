import { supabase } from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { render } from '@testing-library/react';
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Line, Chart } from "react-chartjs-2";

const lineOptions = {
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

const barOptions = {
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

function Dashboard({selected}) { 

  const [daysBack, setDaysBack] = useState(7)

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
    // const daysBack = 7
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
        label: `Watering count by day, ${daysBack} day span`,
        data: counts,
        fill: true,
        backgroundColor: "#f7d345",
        borderColor: "rgba(75,192,192,1)"
      },

    ]
  };

  let exactTimes = []
  let health = []
  const waterings = selected["waterings"]
  for(let watering in waterings) { 
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

  function changeTime() { 
    let days = parseInt(document.getElementById('timeSelect').value)
    console.log("in it ");
    setDaysBack(days)
  }

  return <div class="basicInfo">
    
    <h1 class="plantHeader">{selected["name"]}</h1>
    <div>
    <h3 class="lastWatered">Last watered: {hour_diff}h ago. Water every <u>{selected["water_every"]}</u> hours</h3>
    {/* <br/> */}
    <h3 class="lastWatered">Last observed health: {lastWatering["observed_health"]} / 5</h3>
    {/* <h3 class="lastWatered">Water every <u>{selected["water_every"]}</u> hours</h3> */}
    </div>
    
    <div class="chartHolder">
      <Bar data={data} options={barOptions}/>
       <select id="timeSelect" class="timeSelectClass" selected={"7"} onChange={changeTime}>
        <option value="7">1 Week</option>
        <option value="14">2 Weeks</option>
        <option value="30">1 Month</option>
       </select>
    </div>
    <div class="chartHolder"><Line data={health_data} options={lineOptions}/></div>
    </div>
}
export default Dashboard;
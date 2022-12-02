import { supabase } from './supabaseClient.js'
import React, {useState, useEffect, componentDidMount} from 'react'
import { getDefaultNormalizer, render } from '@testing-library/react';

function Sidebar({addPlantF}) { 
    
    return <div>
        <div class="AddPlantLabel">
            <button class="AddPlantP" disabled>Add your plant below!</button> 
        </div>
        
        <div class="plantCreationGuide">
            <label>I want my plant to be called:</label>
        </div>
            <div class="creationInput" >
                <input type="text" class="plantInput" id="plantName"></input>
            </div>
            
            <div class="plantCreationGuide">
                <label>I need to water it every X hours:</label>
            </div>
            <div class="creationInput" >
                <input type="number" class="plantInput" id="plantHours"></input>
            </div>
        
        <button onClick={addPlantF} class="addPlantButton">+ add plant + </button>
        <div class="outlineGuide">
            <label>a <u class="greenO">green underline</u> means you've watered it last since it's watering period</label>
        </div>
        <div class="outlineGuide">
            <label>an <u class="orangeO">orange underline</u> means it has been between 1-2x the watering period since last watered</label>
        </div>
        <div class="outlineGuide">
        <label>a <u class="redO">red underline</u> means it has been more than 2x the watering period since last watered</label>
        </div>
        <div class="outlineGuide">
        <label>a <u class="blueO">blue underline</u> means it has never been watered</label>
        </div>
    </div>
}

export default Sidebar;

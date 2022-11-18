# Final Project Proposal - Plant tracker
Group - Kenan Arica

## Deliverable 1: MVP 
- **hosted at: https://quiet-cranachan-8385fe.netlify.app/**

* My MVP proposal included an endpoint to get / manage plants and their waterings. My original idea was to use some kind of express server to manage these interactions, but I ended up writing a wrapper of sorts instead. It's very imperfect, and the current deployed app doesn't use most of it because I can't figure out async programming. 

### What my MVP **DOES** do
- Has a very rudimentary interface that pulls all plants for a given user (I have preloaded a few)
- Mimics the watering mechanic via changing div element color on button press. Since these aren't linked to a 'last watered' metric yet, they don't preserve state upon refresh. 

### What my MVP **DOES NOT** do
- Provide user auth or login
- Provide ways to manage plants (adding, removing)
- Provide visual analytics about the plants

## Checkpoint 2: tech stack & MVP proposal
Deployed link - can be found [here](https://quiet-cranachan-8385fe.netlify.app/). There's nothing there yet. 

### Tech stack
- Supabase for Auth
- Supabase for DB storage
- Supabase for file storage
- [ChartJS](https://www.chartjs.org/) for graphing data insights about plants / waterings
- Basic react for frontend. Mostly used for the OOP side of things (render X amount of these objects inside this object, etc)

### MVP Proposal
- Creating a POST endpoint to add a plant under a user ID
- Creating a GET endpoint to get waterings for a certain plant ID based on it's attached userID for data insights
- Creating a POST endpoint to signal a watering (and potentially a spot health rating of the plant)



## What does it do?
- My application stores and tracks maintainence on their gardens and plants.
I find it very difficult myself to keep track of when I watered what plants, as most plants have specific watering routines required, so watering them all at the same time may not work best.
My app will allow a user to log in, create any number of plants that (hopefully) correspond to plants in real life, and mark when they water them. 
Time permitting, I hope to add some form of layout system that allows users to view their plants (and watered status) in some form of meaningful geolocative way. 
For example, a user has houseplants and an outdoor garden. The user assigns plants X and Y to the `garden` group, and can easily pull up their garden plants 
with the click of a button. After that, analytics can be provided about plant insights.

## How is it different from a CRUD app? 
My app will be able to provide analytics and easy visual access to chronological information that is vital for maintaing a healthy garden. CRUD operations are, admittedly, a large part of the project.
However, I am hoping that the aspect of organization and intuitive metric visualization will set it apart. 

## Security / Privacy concerns
When holding user data, albeit nontraditional types of data about their plants, it is extremely important to pay close attention to detail in security.
Holding this data alone is a privacy concern, and will be addressed by using a popular authentication service to ensure that exploiting a vulnerability in my service will be just as difficult as exploiting a vulnerability in most of the other internet services. 


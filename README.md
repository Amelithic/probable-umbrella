# probable-umbrella ☂️
*By clicking 'Spawn Umbrella?', you will probably spawn an umbrella. How many will you create?* 

## Overview
An simple single page application (SPA) project using NodeJS and Three.js 3D graphics, to learn a bit about the Three.js web graphics library.

I found the randomly generated automatic GitHub repository name amusing, so I built a simple interactive 3D app around it. This app allows you to create instances of a custom .GLTF model file (an umbrella), render it with different lighting (AmbientLight, HemisphereLight, pointLight), animate its rotation and mouse interaction (drag to alter its rotation; camera controls interaction), and a bunch of small controls to create/delete umbrellas and toggle for showing the direction of lighting using the THREE.SpotlightHelper object. I also have a basic animated spinning cube and wireframe cube, which just fill out the screen and demo the animation in case the umbrellas don't work.

## Screenshots
![probable-umbrella-1](https://github.com/user-attachments/assets/ed21bd4c-6ff3-46e7-ace1-8101034db207)
*Many probable spawned umbrellas, showing shadow casting and general UI.*

![probable-umbrella-2](https://github.com/user-attachments/assets/046fed7f-a5c6-40c7-871b-a125cbfaeb1d)
*Rotated camera angle, showing SpotlightHelper toggled on.*

![probable-umbrella-3](https://github.com/user-attachments/assets/a3a78299-add1-4c85-8992-d3395dd75f80)
*Max. spawn cap is 50 umbrellas, to avoid performance issues and unnecessary umbrellas. However, excessive umbrellas is improbable.*

![probable-umbrella-4](https://github.com/user-attachments/assets/e6d819e5-003d-4ee9-bd46-0895f44406b8)
*One umbrella being rotated by dragging using the mouse (although hard to tell in screenshot)*

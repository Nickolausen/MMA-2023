'use strict';

let canvas, engine, scene, camera;

window.addEventListener('DOMContentLoaded', () => {
    // il tag canvas che visualizza l'animazione
    canvas = document.getElementById('c');
    // la rotella del mouse serve per fare zoom e non per scrollare la pagina
    canvas.addEventListener('wheel', evt => evt.preventDefault());
    
    // engine & scene
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    
    // camera
    camera = new BABYLON.ArcRotateCamera('cam', 
            -Math.PI/2,0.7,
            15, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13*2;            
    
    // luce
    let light1 = new BABYLON.PointLight('light1', new BABYLON.Vector3(0,1,0), scene);
    light1.parent = camera;
    
    // aggiungo i vari oggetti
    populateScene(scene);
    
    // main loop
    engine.runRenderLoop(()=>scene.render());

    // resize event
    window.addEventListener("resize", () => engine.resize());
});


function populateScene() 
{
    let nrCubes = 20;
    let RGB = [.1, .7, 10];
    let radius = 4;
    let cubes = [];

    for (let i = 0; i < nrCubes; i++)
    {
        let cube = BABYLON.MeshBuilder.CreateBox('cube', scene);
        let angle = 2 * i * Math.PI / nrCubes;

        cube.material = new BABYLON.StandardMaterial('mat-cubo', scene);
        cube.material.diffuseColor.set(...RGB);

        cube.position.x = radius * Math.cos(angle);
        cube.position.y = radius * Math.sin(angle);

        cubes.push(cube);
    }


    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', scene);
    

    scene.registerBeforeRender(() => {

        let t = performance.now() * .001;

        for (let i = 0; i < cubes.length; i++) 
        {
            let angle = 2 * i * Math.PI / nrCubes;
            sphere.position.x = radius * Math.cos(angle * t);
            sphere.position.y = radius * Math.sin(angle * t);

            if(collision(sphere, cubes[i]))
            {
                cubes[i].position.x = (radius + t) * Math.cos(angle * t)
                cubes[i].position.y = (radius + t) * Math.sin(angle * t)

                cubes[i].position.x = (radius - t) * Math.cos(angle)
                cubes[i].position.y = (radius - t) * Math.sin(angle)
            }

            console.log(`Iterazione: ${i}, Collisione? ${collision(sphere, cubes[i])}`)
        }
    });
}

function collision(elem1, elem2)
{
    return elem1.position.x == elem2.position.x
        && elem1.position.y == elem2.position.y
}

function bounce(element, distance)
{

}
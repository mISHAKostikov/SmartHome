import '../Api/Components/Screen/Screen.js';
import '../Api/Components/Switch/Switch.js';


import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { STLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

camera.position.set(0, 0.5, 5); // Устанавливаем начальную позицию камеры
camera.lookAt(0, 0, 0); // Устанавливаем точку, на которую будет направлена камера


renderer.setSize(window.innerWidth, 500);
let div_scene = document.getElementById("scene")
div_scene.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
scene.background = new THREE.Color(0xeeeeee);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Load STL model
const loader = new STLLoader();

loader.load('./Main/Model.stl', (geometry) => {
    const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, specular: 0x111111, shininess: 200 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.0015, 0.0015, 0.0015);
    mesh.rotation.set(Math.PI/2, Math.PI, 0);
    mesh.position.set(-0.3,0.25,0)
    // Math.PI0xeeeeee
    scene.add(mesh);
}, undefined, (error) => {
    console.error(error);
});

// Set camera position
camera.position.z = 1;

// Animation loop
const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();


let menu_burger = null;
let overlay = null;
let screens = null;
let sub_menu = null;
let x_switches = null;


function _burger__on_pointerDown() {
    _toggle__sub_menu();
}

function _menu__on_pointerDown(event) {
    if (!event.target.classList.contains('sub_menu__item')) return;
    // if (!event.target.classList.contains('menu__item') || !event.target.parentElement.classList.contains('menu__item')) return;

    let screen_current = screens.find((item) => item.visibility == true);
    let screen_next = screens.find((item) => item.id == event.target.getAttribute('screen'));

    if (screen_current) {
        screen_current.visibility = false;
    }

    screen_next.visibility = true;

    _toggle__sub_menu();
}

async function _switch__on_toggle(event) {
    await fetch('https://iocontrol.ru/api/sendData/SmartHomeRepnoe/' + event.target.id + '/' + +event.target.on);
}

function _toggle__sub_menu() {
    if (menu_burger.hasAttribute('_active')) {
        menu_burger.removeAttribute('_active');
        overlay.removeAttribute('_active');
        sub_menu.removeAttribute('_active');
    }
    else {
        menu_burger.setAttribute('_active', true);
        overlay.setAttribute('_active', true);
        sub_menu.setAttribute('_active', true);
    }
}

// async function data__onLoad() {
//     for (let x_switch of x_switches) {
//         let response = await fetch('https://iocontrol.ru/api/readData/SmartHomeRepnoe/' + x_switch.id);
//         console.log(response)
//         x_switch.on = JSON.toString(response).value;
//     }

//     // let response = x_switches.forEach((x_switch) => await fetch('https://iocontrol.ru/api/readData/SmartHomeRepnoe/' + x_switch.id));
// }

async function _x_switches__updata() {
    for (let x_switch of x_switches) {
        let response = await fetch('http://localhost:7000/?url_io=https://iocontrol.ru/api/readData/SmartHomeRepnoe/' + x_switch.id);
        let data = await response.json()
        x_switch.on = !!(+JSON.parse(data).value);
    }
}



function main() {
    menu_burger = document.body.querySelector('.burger');
    overlay = document.body.querySelector('.overlay');
    screens = Array.from(document.querySelectorAll('x-screen'));
    sub_menu = document.querySelector('.sub_menu');
    x_switches = Array.from(document.querySelectorAll('x-switch'));

    menu_burger.addEventListener('pointerdown', _burger__on_pointerDown);
    sub_menu.addEventListener('pointerdown', _menu__on_pointerDown);
    x_switches.forEach((x_switch) => x_switch.addEventListener('toggle', _switch__on_toggle));

    screens[0].visibility = true;

    _x_switches__updata();
}


main();


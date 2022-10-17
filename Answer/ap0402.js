//
// 応用プログラミング 第4回 課題2 (ap0402)
// G184002021 拓殖太郎
//
"use strict"; // 厳格モード

import * as THREE from 'three';
import GUI from 'gui';
import { myTriangleGeometry } from './myTriangleGeometry.js'

// ３Ｄページ作成関数の定義
function init() {
  const param = { // カメラの設定値
    fov: 60, // 視野角
    x: 30,
    y: 10,
    z: 30,
    wireframe: false
  };

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  axes.visible = false;
  scene.add(axes);
  
  // 素材の設定
  const glassMaterial = new THREE.MeshPhongMaterial({color: 'skyblue'});
  const bodyMaterial = new THREE.MeshPhongMaterial({color: 'orangered'});
  const tyreMaterial = new THREE.MeshBasicMaterial({color: 'black'});

  // 車のサイズ
  const carW = 3.6;
  const carL = 8.0;
  const carH = 1.5;
  const LoofH = 1.0;

  // 座標点
  const v = [
    new THREE.Vector3( carW/2,  0,      carL/8), // 0
    new THREE.Vector3( carW/2,  0,     -carL/2), // 1
    new THREE.Vector3( carW/2,  LoofH,       0), // 2
    new THREE.Vector3( carW/2,  LoofH, -carL/4), // 3 
    new THREE.Vector3(-carW/2,  0,      carL/8), // 4
    new THREE.Vector3(-carW/2,  0,     -carL/2), // 5
    new THREE.Vector3(-carW/2,  LoofH,       0), // 6
    new THREE.Vector3(-carW/2,  LoofH, -carL/4), // 7
  ];

  // 車の作成
  const car = new THREE.Group();
  let mesh;
//   ボディの作成
  mesh = new THREE.Mesh(new THREE.BoxGeometry(carW, carH, carL), bodyMaterial);
  mesh.position.y = -0.75;
  car.add(mesh);
  //   屋根の作成
  mesh = new THREE.Mesh(new myTriangleGeometry( v[2], v[7], v[6]), bodyMaterial);
  car.add(mesh);
  mesh = new THREE.Mesh(new myTriangleGeometry( v[7], v[2], v[3]), bodyMaterial);
  car.add(mesh);
  // 窓の作成
  //     左窓
    mesh = new THREE.Mesh(new myTriangleGeometry( v[0], v[1], v[2]), glassMaterial);
  car.add(mesh);
  mesh = new THREE.Mesh(new myTriangleGeometry( v[1], v[3], v[2]), glassMaterial);
  //     右窓
  car.add(mesh);
  mesh = new THREE.Mesh(new myTriangleGeometry( v[4], v[6], v[5]), glassMaterial);
  car.add(mesh);
  mesh = new THREE.Mesh(new myTriangleGeometry( v[5], v[6], v[7]), glassMaterial);
  car.add(mesh);
  //     前窓
  mesh = new THREE.Mesh(new myTriangleGeometry( v[0], v[6], v[4]), glassMaterial);
  car.add(mesh);
  mesh = new THREE.Mesh(new myTriangleGeometry( v[6], v[0], v[2]), glassMaterial);
  car.add(mesh);
  //     後窓
  mesh = new THREE.Mesh(new myTriangleGeometry( v[5], v[3], v[1]), glassMaterial);
  car.add(mesh);
  mesh = new THREE.Mesh(new myTriangleGeometry( v[3], v[5], v[7]), glassMaterial);
  car.add(mesh);
  //   タイアの作成
  const tyreR = 0.8;
  const tyreW = 0.5;
  mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1 ), tyreMaterial);
  mesh.rotation.z = Math.PI/2;
  mesh.position.set(1.8, -1.5, 3);
  car.add(mesh);
  mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1 ), tyreMaterial);
  mesh.rotation.z = Math.PI/2;
  mesh.position.set(-1.8, -1.5, 3);
  car.add(mesh);
  mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1 ), tyreMaterial);
  mesh.rotation.z = Math.PI/2;
  mesh.position.set(1.8, -1.5, -3);
  car.add(mesh);
  mesh = new THREE.Mesh(new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1 ), tyreMaterial);
  mesh.rotation.z = Math.PI/2;
  mesh.position.set(-1.8, -1.5, -3);
  car.add(mesh);

  car.position.y = tyreR + 1.5;
  car.children.forEach((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  })
  scene.add(car);

  // 平面の設定
  const plane = new THREE.Mesh(
    new THREE.RingGeometry(15, 30, 32),
    new THREE.MeshLambertMaterial({color: 0x303030})
  );
  plane.rotateX(-Math.PI/2);
  plane.receiveShadow = true;
  scene.add(plane);

  // 光源の設定
  const light1 = new THREE.SpotLight();
  light1.position.set(0, 70, -3);
  light1.castShadow = true;
  scene.add(light1);
  const light2 = new THREE.AmbientLight('white', 0.5);
  scene.add(light2);

  // カメラの設定
  const camera = new THREE.PerspectiveCamera(
    param.fov, window.innerWidth/window.innerHeight, 0.1, 1000);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x406080 );
  renderer.shadowMap.enabled = true;
  document.getElementById("WebGL-output")
    .appendChild(renderer.domElement);

  let theta = 0;
  const radius = 22;
  // 描画関数の定義
  function render() {
    camera.fov = param.fov;
    camera.position.x = param.x;
    camera.position.y = param.y;
    camera.position.z = param.z;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    theta += 0.01 * Math.PI;
    while (theta > 2 * Math.PI) {
      theta -= 2 * Math.PI;
    }
    car.position.x = radius * Math.cos(theta);
    car.position.z = radius * Math.sin(theta);
    car.rotation.y = -theta;
    car.children.forEach( (mesh) => {
      mesh.material.wireframe = param.wireframe;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // カメラのコントローラ
  const gui = new GUI();
  gui.add(param, "fov", 10, 100);
  gui.add(param, "x", -40, 80);
  gui.add(param, "y", -40, 80);
  gui.add(param, "z", -40, 80);
  gui.add(param, "wireframe");

  // 描画
  render();
}

// 3Dページ作成関数の呼び出し
init();

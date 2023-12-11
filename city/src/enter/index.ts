import * as THREE from "three";
import "@/base/index.css";
import { City } from "./city";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * 初始化城市
 */
export const initCity = () => {
  // 获取canvas元素
  const canvas = document.getElementById("webgl") as HTMLElement;
  // 创建场景
  const scene = new THREE.Scene();
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(1000, 500, 100);
  scene.add(camera);

  // 添加轨道相机控件
  const orbitControls = new OrbitControls(camera, canvas);
  // 是否有惯性
  orbitControls.enableDamping = true;
  // 是否可以缩放
  orbitControls.enableZoom = true;
  // 最近和最远距离
  orbitControls.minDistance = 100;
  orbitControls.maxDistance = 2000;

  // 环境光
  const ambientLight = new THREE.AmbientLight(0xadadad);
  scene.add(ambientLight);
  // 添加平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 0, 0);
  scene.add(directionalLight);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  // 设置渲染器的大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启抗锯齿
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //   设置渲染器颜色为黑色
  renderer.setClearColor(new THREE.Color(0x000000), 1);

  const city = new City({ scene, camera, controls: orbitControls });

  const clock = new THREE.Clock();
  // 动画渲染场景
  const start = () => {
    city.start(clock.getDelta());
    orbitControls.update();
    // 渲染场景
    renderer.render(scene, camera);
    requestAnimationFrame(start);
  };
  start();

  window.addEventListener("resize", () => {
    // 宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};

import { loadFBX, loadImage, loadRemoteImage } from "@/utils";
import type { Scene, PerspectiveCamera } from "three";
import * as THREE from "three";
import { SurroundLine } from "@/effect/surroundLine";
import { Background } from "@/effect/background";
import * as TWEEN from "@tweenjs/tween.js";
import type { Mesh } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Rader } from "@/effect/radar";
import { Wall } from "@/effect/wall";
import { Circle } from "@/effect/circle";
import { Ball } from "@/effect/ball";
import { Cone } from "@/effect/cone";
import { Fly } from "@/effect/fly";
import { Road } from "@/effect/road";

export class City {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private tweenPosition: any;
  private tweenRotation: any;
  height: { value: number };
  time: { value: number };
  controls: OrbitControls;
  top: { value: number };
  flag: boolean;

  constructor(params: {
    scene: Scene;
    camera: PerspectiveCamera;
    controls: OrbitControls;
  }) {
    this.scene = params.scene;
    this.camera = params.camera;
    this.controls = params.controls;
    this.tweenPosition = null;
    this.tweenRotation = null;
    this.height = {
      value: 5,
    };
    this.time = {
      value: 0,
    };
    this.flag = false;
    this.top = {
      value: 0,
    };
    this.loadCity();
  }

  async loadCity() {
    const url = loadImage("@/model/beijing.fbx");
    //   加载模型，并且渲染到画布上
    const object = await loadFBX(url);
    // console.log(object);
    // this.scene.add(object);
    // 因为object下所有的子物体都挂在到group下，为了更好把控场景，我们自己创建一些几何体把物体创建到场景中
    object.traverse((child) => {
      if ((child as Mesh).isMesh) {
        // 给物体添加一个着色器材质
        new SurroundLine(this.scene, child as Mesh, this.height, this.time);
      }
    });
    this.initEffect();
    this.addClick();
  }

  // 初始化效果
  initEffect() {
    // 天空盒
    new Background(this.scene);
    // 雷达效果
    new Rader(this.scene, this.time);
    // 扩散墙
    new Wall(this.scene, this.time);
    // 扩散圆
    new Circle(this.scene, this.time);
    // 扩散半球
    new Ball(this.scene, this.time);
    // 旋转四棱锥
    new Cone(this.scene, this.time, this.top, this.height);
    // 飞线
    new Fly(this.scene, this.time);
    // 路径移动
    new Road(this.scene, this.time);
  }

  /**
   * 添加点击事件处理
   * 解决鼠标拖动事件和3D点击事件冲突问题
   */
  addClick() {
    // 是否可以操作点击事件的标识
    let flag = false;
    document.onmousedown = () => {
      flag = true;
      // 如果鼠标在移动，则禁止执行点击逻辑
      document.onmousemove = (event) => {
        flag = false;
      };
    };
    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event);
      }
      document.onmousemove = null;
    };
  }

  /**
   * 点击事件
   */
  clickEvent(event: MouseEvent) {
    const camera = this.camera;
    const scene = this.scene;
    // 获取到浏览器坐标
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 创建设备坐标（三维）
    const standardVector = new THREE.Vector3(x, y, 0.5);

    // 转化为世界坐标
    const worldVector = standardVector.unproject(camera);

    // 做序列化
    const ray = worldVector.sub(camera.position).normalize();

    // 如何实现点击选中
    // 创建一个射线发射器，用来发射一条射线
    const raycaster = new THREE.Raycaster(camera.position, ray);

    // 返回射线碰撞到的物体
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects);
    let point3d = null;
    if (intersects.length) {
      point3d = intersects[0];
    }
    if (point3d) {
      // 观察范围倍数
      const proportion = 3;
      //  开始动画来修改观察点
      const time = 1000;
      this.tweenPosition = new TWEEN.Tween(camera.position)
        .to(
          {
            x: point3d.point.x * proportion,
            y: point3d.point.y * proportion,
            z: point3d.point.z * proportion,
          },
          time
        )
        .start();
      this.tweenRotation = new TWEEN.Tween(camera.rotation)
        .to(
          {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z,
          },
          time
        )
        .start();
    }
  }

  //   开始方法，所有更新逻辑在此开发
  start(delta) {
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update();
      this.tweenRotation.update();
    }
    this.time.value += delta;

    // 动态修改height值
    this.height.value += 0.4;
    if (this.height.value > 160) {
      this.height.value = 5;
    }
    if (this.top.value > 15 || this.top.value < 0) {
      this.flag = !this.flag;
    }
    this.top.value += this.flag ? -0.8 : 0.8;
  }
}

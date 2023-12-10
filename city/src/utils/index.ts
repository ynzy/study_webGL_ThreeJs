import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import type { Group, Object3DEventMap } from "three";

const fbxLoader = new FBXLoader();

/**
 * 加载FBX模型
 * @param url
 */
export const loadFBX = (url: string) => {
  return new Promise<Group<Object3DEventMap>>((resolve, reject) => {
    fbxLoader.load(
      url,
      (object) => {
        resolve(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * @Description: 动态加载图片
 * @param {*} src 图片地址
 */
export function loadImage(src: string): any {
  const srcArr = src.split("/");
  const firstStr = srcArr.shift();
  let url = "";
  if (firstStr === "@") {
    url = `/src/${srcArr.join("/")}`;
    return url;
  } else {
    if (srcArr[0] === "src") {
      url = `/src/${srcArr.join("/")}`;
    } else if (srcArr[0] === "rsm") {
      url = `/api/${srcArr.join("/")}`;
    } else {
      url = src;
    }
  }
  return new Promise((resolve, resject) => {
    fetch(url).then((res) => {
      if (res.status == 200) {
        resolve(res.url);
      } else {
        resject(res.url);
        console.error(
          `${src}路径的图片没有获取成功，请检查路径是否正确、文件名是否正确！`
        );
      }
    });
  });
}

/**
 * 加载远程图片
 * @param url
 * @returns
 */
export const loadRemoteImage = (url: string) => {
  return new URL(url, import.meta.url).href;
};

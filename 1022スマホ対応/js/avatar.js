import * as THREE from "three";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";


// =============================
// 表示先
// =============================

const avatarCanvas =
    document.getElementById("avatarCanvas");


if (!avatarCanvas) {
    throw new Error(
        "avatarCanvasが見つかりません"
    );
}


// =============================
// シーン
// =============================

const scene =
    new THREE.Scene();


// 背景は透明
scene.background = null;


// =============================
// カメラ
// =============================

const camera =
    new THREE.PerspectiveCamera(
        30,
        1,
        0.1,
        100
    );


// 肩から上が見えやすい位置
camera.position.set(
    0,
    1.3,
    8
);

camera.lookAt(
    0,
    2,
    0
);


// =============================
// レンダラー
// =============================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


avatarCanvas.appendChild(
    renderer.domElement
);


// =============================
// ライト
// =============================

// 全体を明るくする光
const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        2
    );

scene.add(
    ambientLight
);


// 正面からの光
const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

directionalLight.position.set(
    3,
    5,
    5
);

scene.add(
    directionalLight
);


// 反対側から少し補助
const fillLight =
    new THREE.DirectionalLight(
        0xffeaf3,
        1
    );

fillLight.position.set(
    -3,
    2,
    3
);

scene.add(
    fillLight
);


// =============================
// GLB読み込み
// =============================

const loader =
    new GLTFLoader();


const modelUrl =
    new URL(
        "../assets/human1.glb",
        import.meta.url
    ).href;


loader.load(

    modelUrl,

    (gltf) => {

        const model =
            gltf.scene;


        scene.add(model);


        // =============================
        // モデルのサイズを取得
        // =============================

        const box =
            new THREE.Box3()
                .setFromObject(model);


        const size =
            new THREE.Vector3();

        const center =
            new THREE.Vector3();


        box.getSize(size);

        box.getCenter(center);


        // モデルの中心を原点へ
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;


        // =============================
        // サイズを統一
        // =============================

        if (size.y > 0) {

            const scale =
                4 / size.y;

            model.scale.setScalar(
                scale
            );

        }


        // 少し下へ移動
        model.position.y += 0.3;


        console.log(
            "human1.glb 読み込み成功"
        );

    },

    (xhr) => {

        if (xhr.total) {

            const percent =
                xhr.loaded /
                xhr.total *
                100;

            console.log(
                `${percent.toFixed(0)}% loaded`
            );

        }

    },

    (error) => {

        console.error(
            "human1.glbの読み込みエラー",
            error
        );

    }

);


// =============================
// canvasサイズ
// =============================

function resizeAvatar() {

    const width =
        avatarCanvas.clientWidth;

    const height =
        avatarCanvas.clientHeight;


    if (
        width === 0
        ||
        height === 0
    ) {
        return;
    }


    renderer.setSize(
        width,
        height,
        false
    );


    camera.aspect =
        width / height;


    const isMobile =
        window.matchMedia(
            "(max-width: 550px)"
        ).matches;


    if (isMobile) {

        // スマホでは横幅が狭いため、
        // カメラを後ろへ引いて耳まで表示する
        camera.position.set(
            0,
            1.3,
            11
        );


        // アバターが少し下に見えるようにする
        camera.lookAt(
            0,
            2.35,
            0
        );

    }
    else {

        // PC版は現在の完璧な位置を維持
        camera.position.set(
            0,
            1.3,
            8
        );


        camera.lookAt(
            0,
            2,
            0
        );

    }


    camera.updateProjectionMatrix();
}

resizeAvatar();


// アバター枠のサイズ変更を監視
const resizeObserver =
    new ResizeObserver(
        resizeAvatar
    );


resizeObserver.observe(
    avatarCanvas
);


// =============================
// 描画
// =============================

function animate() {

    requestAnimationFrame(
        animate
    );


    renderer.render(
        scene,
        camera
    );

}


animate();
function init() {
    scene = new THREE.Scene();

    //Init interface
    gui = new dat.GUI({ autoPlace: false });
    $('.Graphic').append($(gui.domElement));

    //khởi tạo container cố định chứa vật thể và áp dụng các transformControls và animation
    //làm material của container trong suốt để thấy được vật thể bên trong

    //Init container to contain Object
    Container = getSurface(getGeometry('Box'), getMaterial('Solid'), 'Solid');
    Container.material.transparent = true;
    Container.material.opacity = 0;

    // Tạo vật thể với tùy chọn hình dạng và bề mặt

    //Init Object with Geometry and Surface
    var ObjectOne = getSurface(getGeometry('Box'), getMaterial('Solid'), 'Solid');
    ObjectOne.name = "objectOne";
    ObjectOne.castShadow = true;
    Container.add(ObjectOne);
    scene.add(Container);


    // Create animation
    animation1 = anime.timeline({
        targets: Container.position,
        keyframes: [
            { x: 0, duration: 0 },
            { x: 5, duration: 2000 },
            { z: 5, duration: 2000 },
            { x: 0, duration: 2000 },
            { z: 0, duration: 2000 }
        ],
        loop: true,
        autoplay: false,
        direction: 'normal',
        duration: 8000,
        easing: 'linear'
    }, 0);

    animation1.add({
        targets: Container.rotation,
        keyframes: [
            { y: Math.PI }
        ],
    }, 0);

    animation2 = anime.timeline({
        targets: Container.position,
        keyframes: [
            { x: 0, duration: 0 },
            { x: 10, duration: 2000 },
            { x: 0, duration: 2000 }
        ],
        loop: true,
        autoplay: false,
        direction: 'normal',
        duration: 4000,
        easing: 'linear'
    }, 0);

    animation2.add({
        targets: Container.rotation,
        keyframes: [
            { x: Math.PI }
        ]
    }, 0);

    
    //Create plane without light
    var plane1 = getPlane1(20);
    plane1.name = 'plane1';
    plane1.rotation.x = Math.PI / 2
    plane1.position.y = -ObjectOne.geometry.parameters.height / 2;
    scene.add(plane1)

    //Create plan with light
    var plane = getPlane(20);
    plane.name = 'plane';
    plane.rotation.x = Math.PI / 2
    plane.position.y = -ObjectOne.geometry.parameters.height / 2;
    plane.visible = false;
    scene.add(plane)



    // Create PointLight, SpotLight, DirectionalLight and AmbientLight.
    var pointLight = getPointLight(8);
    pointLight.name = 'Pointlight';
    pointLight.visible = false;
    scene.add(pointLight);

    var SpotLight = getSpotLight(8);
    SpotLight.name = 'Spotlight';
    SpotLight.visible = false;
    scene.add(SpotLight);

    var DirectionalLight = getDirectionalLight(8);
    DirectionalLight.name = 'Directionallight';
    DirectionalLight.visible = false;
    scene.add(DirectionalLight);


    var AmbientLight = getAmbientLight(10);
    AmbientLight.name = 'Ambientlight';
    AmbientLight.visible = false;
    scene.add(AmbientLight);

    //Add light controller for GUI
    PointlightGUI = gui.addFolder('PointLight');
    PointlightGUI.add(pointLight, 'intensity', 0, 20).name("intensity");
    PointlightGUI.add(pointLight.position, 'x', -10, 10);
    PointlightGUI.add(pointLight.position, 'y', -10, 10);
    PointlightGUI.add(pointLight.position, 'z', -10, 10);
    var point_parameters = { color: 0xffffff };
    PointlightGUI.addColor(point_parameters, 'color').onChange(function () {
        pointLight.color.set(point_parameters.color);
    }).name('Color');
    PointlightGUI.open();
    PointlightGUI.hide();

    SpotlightGUI = gui.addFolder('SpotLight');
    SpotlightGUI.add(SpotLight, 'intensity', 0, 20).name("intensity");
    SpotlightGUI.add(SpotLight, 'penumbra', 0, 1).name("penumbra");
    SpotlightGUI.add(SpotLight.position, 'x', -10, 10);
    SpotlightGUI.add(SpotLight.position, 'y', -10, 10);
    SpotlightGUI.add(SpotLight.position, 'z', -10, 10);
    var spot_parameters = { color: 0xffffff };
    SpotlightGUI.addColor(spot_parameters, 'color').onChange(function () {
        SpotLight.color.set(spot_parameters.color);
    }).name('Color');
    SpotlightGUI.open();
    SpotlightGUI.hide();

    AmbientLightGUI = gui.addFolder('Ambientlight');
    AmbientLightGUI.add(AmbientLight, 'intensity', 0, 20).name("intensity");
    AmbientLightGUI.add(AmbientLight.position, 'x', -10, 10);
    AmbientLightGUI.add(AmbientLight.position, 'y', -10, 10);
    AmbientLightGUI.add(AmbientLight.position, 'z', -10, 10);
    AmbientLightGUI.open();
    AmbientLightGUI.hide();


    DirectionalLightGUI = gui.addFolder('DirectionalLight');
    DirectionalLightGUI.add(DirectionalLight, 'intensity', 0, 20).name("intensity");
    DirectionalLightGUI.add(DirectionalLight.position, 'x', -10, 10);
    DirectionalLightGUI.add(DirectionalLight.position, 'y', -10, 10);
    DirectionalLightGUI.add(DirectionalLight.position, 'z', -10, 10);
    var directional_parameters = { color: 0xffffff };
    DirectionalLightGUI.addColor(directional_parameters, 'color').onChange(function () {
        DirectionalLight.color.set(directional_parameters.color);
    }).name('Color');
    DirectionalLightGUI.open();
    DirectionalLightGUI.hide();

    // Create camera and add camera controller for GUI
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(0, 15, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    var cameraGUI = gui.addFolder('Camera');
    cameraGUI.add(camera, 'fov', 1, 180).name("FOV");
    cameraGUI.add(camera, 'near', 0.1, 50).name("Near");
    cameraGUI.add(camera, 'far', 1, 100).name("Far");
    cameraGUI.open();

    //Responsive windown web
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    //Create render
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor('rgb(30, 30, 30)');
    document.getElementById('webgl').appendChild(renderer.domElement);
    renderer.render(scene, camera);

    //Interactive camera by mouse
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Create transform controls
    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
    });

    transformControls.mode = 'translate';
    transformControls.setMode('translate');
    transformControls.attach(Container);
    scene.add(transformControls);

    //Add transform controls for GUI

    var TfProperty = {
        Translate: function () { transformControls.mode = 'translate'; },
        Rotate: function () { transformControls.mode = 'rotate'; },
        Scale: function () { transformControls.mode = 'scale'; },
        Reset: function () { ResetObject(); }
    };
    var TfMode = gui.addFolder('Transform Mode');
    TfMode.add(TfProperty, 'Translate');
    TfMode.add(TfProperty, 'Rotate');
    TfMode.add(TfProperty, 'Scale');
    TfMode.add(TfProperty, 'Reset');
    TfMode.open();

    //Update frame  
    update(renderer, scene, camera, controls);
    ResetObject();
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    light.position.x = 2;
    light.position.y = 5;
    light.position.z = 2;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    var pointSphere = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    pointSphere.scale.x = 0.5;
    pointSphere.scale.y = 0.5;
    pointSphere.scale.z = 0.5;
    light.add(pointSphere);
    return light;
}
function getSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.position.x = 0;
    light.position.y = 3;
    light.position.z = 0;
    light.castShadow = true;
    var spotSphere = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    spotSphere.scale.x = 0.5;
    spotSphere.scale.y = 0.5;
    spotSphere.scale.z = 0.5;
    light.add(spotSphere);
    return light;
}
function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;
    light.position.x = 2;
    light.position.y = 5;
    light.position.z = 2;
    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.top = 10;
    light.shadow.camera.right = 10;
    var directionalSphere = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    directionalSphere.scale.x = 0.5;
    directionalSphere.scale.y = 0.5;
    directionalSphere.scale.z = 0.5;
    light.add(directionalSphere);
    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight('rgb(10,20,30)', intensity);
    light.position.x = 2;
    light.position.y = 5;
    light.position.z = 2;
    return light;
}


function load3Dmodel(path, oldObj, x) {
    const loader = new THREE.GLTFLoader();
    loader.load(path, function (gltf) {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) { node.castShadow = true; }
        });
        gltf.scene.name = 'gltf'
        scene.add(gltf.scene);
        loadNew3D(gltf.scene, oldObj);
        gltf.scene.scale.multiplyScalar(x / 100);
    }, undefined, function (error) {
        console.error(error);
    });
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh
}

function getPlane1(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial({ color: 0x81A3DE, side: THREE.DoubleSide });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh
}

function getGeometry(type) {
    var Geometry;
    switch (type) {
        case 'Box':
            Geometry = new THREE.BoxGeometry(2, 2, 2);
            break;
        case 'Circle':
            Geometry = new THREE.CircleGeometry(1, 32);
            break;
        case 'Sphere':
            Geometry = new THREE.SphereGeometry(1, 22, 22);
            break;
        case 'Cone':
            Geometry = new THREE.ConeGeometry(2, 5, 8);
            break;
        case 'Cylinder':
            Geometry = new THREE.CylinderGeometry(1, 1, 4, 4);
            break;
        case 'Torus':
            Geometry = new THREE.TorusGeometry(2, 0.5, 8, 100);
            break;
        case 'TeaPot':
            Geometry = new THREE.TeapotGeometry(0.5, 10);
            break;
    }
    return Geometry;
}

function getMaterial(type, url) {
    var textures;
    if (url) {
        textures = new THREE.TextureLoader().load(url);
        textures.warpS = THREE.RepeatWrapping;
        textures.warpT = THREE.RepeatWrapping;
    }

    var selectedMaterial;
    switch (type) {
        case 'Line':
            selectedMaterial = new THREE.LineBasicMaterial({color: 'white'});
            break;
        case 'Points':
            selectedMaterial = new THREE.PointsMaterial({size: 0.05, color: 'white'});
            break;
        case 'Solid':
            selectedMaterial = new THREE.MeshBasicMaterial({color: 'white', side: THREE.DoubleSide});
            break;
        case 'Texture':
            selectedMaterial = new THREE.MeshBasicMaterial({color: 'white', side: THREE.DoubleSide, map: textures});
            break;
        default:
            selectedMaterial = new THREE.MeshPhongMaterial({color: 'white', side: THREE.DoubleSide});
    }
    return selectedMaterial;
}

function getSurface(geometry, material, type) {
    var Surface;
    switch (type) {
        case 'Line':
            Surface = new THREE.Line(geometry, material);
            break;
        case 'Points':
            Surface = new THREE.Points(geometry, material);
            break;
        case 'Solid':
            Surface = new THREE.Mesh(geometry, material);
            break;
        default:
            Surface = new THREE.Mesh(geometry, material);
    }
    return Surface;

}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function () {
        camera.updateProjectionMatrix();
        update(renderer, scene, camera, controls);
    })
}

function setGeometry(type) {
    var ObjectOne = Container.getObjectByName('objectOne');
    switch (type) {
        case 1:
            ObjectOne.geometry = getGeometry("Box");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 2:
            ObjectOne.geometry = getGeometry("Circle");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 3:
            ObjectOne.geometry = getGeometry("Sphere");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 4:
            ObjectOne.geometry = getGeometry("Cone");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 5:
            ObjectOne.geometry = getGeometry("Cylinder");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 6:
            ObjectOne.geometry = getGeometry("Torus");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 7:
            ObjectOne.geometry = getGeometry("TeaPot");
            if (isModel) {
                isModel = false;
                loadNew3D();
            }
            break;
        case 8:
            isModel = true;
            load3Dmodel("./Model_3D/Bunny_Lamp.glb", ObjectOne, 20);
            ObjectOne.position.y = 0;
            break;
        case 9:
            isModel = true;
            load3Dmodel("./Model_3D/Diglett.glb", ObjectOne, 40);
            ObjectOne.position.y = 0;
            break;
        case 10:
            isModel = true;
            load3Dmodel("./Model_3D/strawberry.glb", ObjectOne, 100);
            ObjectOne.position.y = 0;
            break;
        case 11:
            isModel = true;
            load3Dmodel("./Model_3D/Totoro.glb", ObjectOne, 10);
            ObjectOne.position.y = 0;
            break;
    };
}

var yPos = {
    'BoxGeometry': 0,
    'ConeGeometry': 0,
};

function loadNew3D(ObjectNew, ObjectOld) {
    if (isModel) {
        if (Container.getObjectByName('gltf') == undefined) {
            ObjectNew.position.copy(ObjectOld.position);
            ObjectNew.rotation.copy(ObjectOld.rotation);
            ObjectNew.scale.copy(ObjectOld.scale);
            ObjectNew.castShadow = true;

            ObjectOld.visible = false;
            Container.add(ObjectNew);
        }
        else {
            obj = Container.getObjectByName('gltf');
            Container.remove(obj);
            Container.add(ObjectNew);
        }
    }
    else {
        obj = Container.getObjectByName('gltf');
        Container.remove(obj);
        ObjectOld = Container.getObjectByName('objectOne');
        ObjectOld.visible = true;
    }
}

function loadNew(ObjectNew, ObjectOld) {
    ObjectNew.position.copy(ObjectOld.position);
    ObjectNew.rotation.copy(ObjectOld.rotation);
    ObjectNew.scale.copy(ObjectOld.scale);
    ObjectNew.name = ObjectOld.name;
    ObjectNew.castShadow = true;

    Container.remove(ObjectOld);
    ObjectOld.geometry.dispose();
    ObjectOld.material.dispose();

    Container.add(ObjectNew);
    
}

function setSurface(type) {
    if (!isModel) {
        var ObjectOld = Container.getObjectByName('objectOne');
        var ObjectNew;
        var url;
        switch (type) {
            case 1:
                ObjectNew = new THREE.Points(ObjectOld.geometry, getMaterial('Points'));
                loadNew(ObjectNew, ObjectOld);
                break;
            case 2:
                ObjectNew = new THREE.Line(ObjectOld.geometry, getMaterial("Line"));
                loadNew(ObjectNew, ObjectOld);
                break;
            case 3:
                ObjectNew = new THREE.Mesh(ObjectOld.geometry, getMaterial('Solid'));
                loadNew(ObjectNew, ObjectOld);
                break;
            case 4:
                var input = document.getElementById('path_image');
                input.onchange = e => {
                    var file = e.target.files[0];
                    const reader = new FileReader();
                    reader.addEventListener("load", function () {
                        ObjectNew = new THREE.Mesh(ObjectOld.geometry, getMaterial("Texture", reader.result));
                        loadNew(ObjectNew, ObjectOld);
                    }, false);

                    if (file) {
                        reader.readAsDataURL(file);
                    }
                }
                input.click();
                break;
        }
    }
}

function setPointLight() {
    SpotlightGUI.hide();
    DirectionalLightGUI.hide();
    AmbientLightGUI.hide();
    PointlightGUI.show();

    scene.getObjectByName('Spotlight').visible = false;
    scene.getObjectByName('Directionallight').visible = false;
    scene.getObjectByName('Ambientlight').visible = false;
    scene.getObjectByName('Pointlight').visible = true;

    scene.getObjectByName('plane1').visible = false;
    scene.getObjectByName('plane').visible = true;

}

function setSpotLight() {
    PointlightGUI.hide();
    DirectionalLightGUI.hide();
    AmbientLightGUI.hide();
    SpotlightGUI.show();

    scene.getObjectByName('Pointlight').visible = false;
    scene.getObjectByName('Directionallight').visible = false;
    scene.getObjectByName('Ambientlight').visible = false;
    scene.getObjectByName('Spotlight').visible = true;

    scene.getObjectByName('plane1').visible = false;
    scene.getObjectByName('plane').visible = true;

}

function setDirectionalLight() {
    PointlightGUI.hide();
    SpotlightGUI.hide();
    AmbientLightGUI.hide();
    DirectionalLightGUI.show();

    scene.getObjectByName('Pointlight').visible = false;
    scene.getObjectByName('Spotlight').visible = false;
    scene.getObjectByName('Ambientlight').visible = false;
    scene.getObjectByName('Directionallight').visible = true;

    scene.getObjectByName('plane1').visible = false;
    scene.getObjectByName('plane').visible = true;

}

function setAmbientLight() {
    PointlightGUI.hide();
    SpotlightGUI.hide();
    DirectionalLightGUI.hide();
    AmbientLightGUI.show();

    scene.getObjectByName('Pointlight').visible = false;
    scene.getObjectByName('Spotlight').visible = false;
    scene.getObjectByName('Directionallight').visible = false;
    scene.getObjectByName('Ambientlight').visible = true;

    scene.getObjectByName('plane1').visible = false;
    scene.getObjectByName('plane').visible = true;

}

function removeLight() {
    PointlightGUI.hide();
    SpotlightGUI.hide();
    DirectionalLightGUI.hide();
    AmbientLightGUI.hide();

    scene.getObjectByName('Pointlight').visible = false;
    scene.getObjectByName('Spotlight').visible = false;
    scene.getObjectByName('Directionallight').visible = false;
    scene.getObjectByName('Ambientlight').visible = false;

    scene.getObjectByName('plane').visible = false;
    scene.getObjectByName('plane1').visible = true;

}

function setAnimation(type) {
    switch (type) {
        case 1:
            transformControls.visible = false;

            animation1.play();
            break;
        case 2:
            transformControls.visible = false;
            animation2.play();
            animation1.pause();
            break;
        case 3:
            transformControls.visible = false;
            animation3.play();
            animation1.pause();
            animation2.pause();
            break;
        case 4:
            Container.getObjectByName('objectOne').position.set(0, 0, 0);
            Container.getObjectByName('objectOne').rotation.set(0, 0, 0);
            transformControls.visible = true;
            animation1.pause();
            animation2.pause();
            break;
    }
}

function ResetObject() {
    Container.position.set(0, 0, 0);
    Container.rotation.set(0, 0, 0);
    Container.scale.set(1, 1, 1);

}

var scene, Container, transformControls, lightGUI;
var audioLoader, sound, music = 1;
var animation1, animation2, animation3;
var isModel = false;

init();
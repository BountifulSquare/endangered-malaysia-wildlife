import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    DoubleSide,
    Object3D,
    Clock,
    Raycaster,
    Vector2,
    TextureLoader,
    Color,
} from "three"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader'
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader'
import data from "./data"

(function main() {
    const canvasEL = document.getElementById('canvas')
    const infoEL = document.getElementById('info')
    const renderer = new WebGLRenderer({
        canvas,
        antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new Scene()
    scene.background = new Color(0x272727)

    const camera = new PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 0, 60)
    camera.lookAt(0, 0, 0)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const luminosity = new ShaderPass(LuminosityShader)
    composer.addPass(luminosity)
    const dot = new ShaderPass(DotScreenShader)
    dot.uniforms['scale'].value = 5
    composer.addPass(dot)

    const clock = new Clock()
    const geometry = new PlaneGeometry(20, 30)
    const raycaster = new Raycaster()
    const mouse = new Vector2()
    const textLoader = new FontLoader()
    const textureLoader = new TextureLoader()

    textLoader.load('fonts/helvetiker_regular.typeface.json', font => {
        const textGeometry = new TextGeometry('Help us', {
            font,
            size: 22,
            height: 5,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        })
        textGeometry.computeBoundingBox()

        const text = new Mesh(textGeometry, new MeshBasicMaterial())
        const group = new Object3D()
        group.add(text)
        scene.add(group)
        group.position.set(-105, 30, -150)
    })

    textLoader.load('fonts/helvetiker_regular.typeface.json', font => {
        const textGeometry = new TextGeometry('survive', {
            font,
            size: 25,
            height: 5,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        })
        textGeometry.computeBoundingBox()

        const text = new Mesh(textGeometry, new MeshBasicMaterial())
        const group = new Object3D()
        group.add(text)
        scene.add(group)
        group.position.set(-105, -20, -80)
    })

    const p1 = new Mesh(geometry, new MeshBasicMaterial({
        map: textureLoader.load('./images/tiger_tb.jpg'),
        side: DoubleSide,
    }))
    p1.position.set(0, 0, 15)
    p1._id = 1

    const p2 = new Mesh(geometry, new MeshBasicMaterial({
        map: textureLoader.load('./images/tapir_tb.jpg'),
        side: DoubleSide,
    }))
    p2.position.set(-15, 0, 0)
    p2.rotateY(Math.PI / 2)
    p2._id = 2

    const p3 = new Mesh(geometry, new MeshBasicMaterial({
        map: textureLoader.load('./images/orangutan_tb.jpg'),
        side: DoubleSide,
    }))
    p3.position.set(0, 0, -15)
    p3._id = 3

    const p4 = new Mesh(geometry, new MeshBasicMaterial({
        map: textureLoader.load('./images/proboscismonkey_tb.jpg'),
        side: DoubleSide,
    }))
    p4.position.set(15, 0, 0)
    p4.rotateY(-Math.PI / 2)
    p4._id = 4

    const center = new Object3D()
    center.add(p1, p2, p3, p4)
    center.position.set(20, 0, 0)
    scene.add(center)

    let ui = false
    let keydown = false
    let rotate = false
    let direction = 1
    let radian = 0
    let counter = 1

    function toggleUI(id) {
        const animal = data.filter(d => d.id === id)
        const { title, image, article, source, imageRef } = animal[0]
        const titleEl = document.getElementById('c-title')
        const imageEl = document.getElementById('c-image')
        const articleEl = document.getElementById('c-article')
        const sourceNameEl = document.getElementById('c-source-name')
        const sourceLinkEl = document.getElementById('c-source-link')
        const imageNameEl = document.getElementById('c-image-name')
        const imageLinkEl = document.getElementById('c-image-link')

        titleEl.innerText = title
        imageEl.setAttribute('src', `images/${image}`)
        articleEl.innerText = article

        sourceNameEl.innerText = source.name
        sourceLinkEl.setAttribute('href', source.link)
        sourceLinkEl.innerText = source.link

        imageNameEl.innerText = imageRef.author
        imageLinkEl.setAttribute('href', imageRef.link)
        imageLinkEl.innerText = imageRef.name

        infoEL.classList.add("animate__zoomIn")
        infoEL.classList.remove("hidden", "animate__zoomOut")
        ui = true
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
    }

    renderer.setAnimationLoop(() => {
        const dt = clock.getDelta()

        if (rotate) {
            const rpf = dt * 2.5
            radian += rpf

            if (radian < Math.PI / 2) {
                center.rotateY(rpf * direction)
            } else {
                radian = 0
                rotate = false
                counter += direction

                if (counter < 1) {
                    counter = 4
                } else if (counter > 4) {
                    counter = 1
                }

                switch (counter) {
                    case 1:
                        center.rotation.y = 0
                        break
                    case 2:
                        center.rotation.y = Math.PI / 2
                        break
                    case 3:
                        center.rotation.y = -0
                        break
                    case 4:
                        center.rotation.y = -Math.PI / 2
                        break
                }
            }
        }

        // renderer.render(scene, camera)
        composer.render()
    })

    window.addEventListener('resize', onWindowResize)

    document.addEventListener('keydown', e => {
        if (!keydown && !ui) {
            keydown = true

            if (e.code === 'ArrowRight') {
                rotate = true
                direction = 1
            } else if (e.code === 'ArrowLeft') {
                rotate = true
                direction = -1
            }
        }

        if (e.code === 'Escape') {
            infoEL.classList.remove("animate__zoomIn")
            infoEL.classList.add("animate__zoomOut")
            ui = false
        }
    })

    document.addEventListener('keyup', () => {
        keydown = false
    })

    canvasEL.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1
        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(scene.children)

        if (intersects.length) {
            const _id = intersects[0].object._id

            if (_id === counter) {
                toggleUI(_id)
            }
        }
    })

    infoEL.addEventListener('animationend', () => {
        if (!ui) {
            infoEL.classList.add('hidden')
        }
    })
})()


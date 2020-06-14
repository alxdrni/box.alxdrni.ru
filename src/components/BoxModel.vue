<template>
  <div
    id="model"
    :class="$style.model"
    @mousemove="move"
    @mousedown="activatePan"
  />
</template>
<script>
import isOdd from 'is-odd'
import { Scene, PerspectiveCamera, LineBasicMaterial, MeshBasicMaterial, Group, AxesHelper, WebGLRenderer, Shape, ExtrudeGeometry, Mesh, Matrix4, Path, Vector3, Geometry, Line, LineLoop } from 'three'

function degToRad (degrees) {
  return degrees * Math.PI / 180
};

export default {
  props: {
    width: {
      type: Number,
      required: true
    },
    depth: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    thick: {
      type: Number,
      required: true
    },
    hole: {
      type: Object,
      required: true
    },
    circle: {
      type: Object,
      required: true
    },
    clip: {
      type: Object,
      required: true
    },
    rotate: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      container: null,
      camera: null,
      scene: null,
      material: null,
      edgeMaterial: null,
      group: null,
      meshes: [],
      controls: null,
      axesHelper: null,
      renderer: null,
      isPan: false,
      rotation: {
        x: 0,
        y: 0
      }
    }
  },
  created () {
    this.$watch(vm => [vm.width, vm.depth, vm.height, vm.thick, vm.showMaterial, vm.scale, Date.now()].join(), val => {
      this.create()
    })
  },
  beforeMount () {
    window.addEventListener('resize', this.resize)
    document.body.addEventListener('mouseup', this.deactivatePan)
  },
  mounted () {
    this.container = document.querySelector('#model')
    this.init()
    this.create()
    this.animate()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    document.body.removeEventListener('mouseup', this.deactivatePan)
  },
  methods: {
    deactivatePan (event) {
      this.isPan = false
    },
    activatePan (event) {
      this.isPan = true
    },
    init () {
      this.scene = new Scene()

      const fov = this.container.clientWidth > this.container.clientHeight ? 25 : this.container.clientHeight * 25 / this.container.clientWidth
      this.camera = new PerspectiveCamera(fov, this.container.clientWidth / this.container.clientHeight, 1, 4000)
      this.camera.position.z = 2000

      this.edgeMaterial = new LineBasicMaterial({
        color: 0x57606f,
        linewidth: 1
      })

      this.material = new MeshBasicMaterial({
        color: 0xffffff
      })

      this.group = new Group()
      this.group.rotation.y = degToRad(-45)
      this.group.rotation.x = degToRad(15)

      this.axesHelper = new AxesHelper(1000)
      // this.group.add(this.axesHelper)

      this.scene.add(this.group)

      this.renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
      })

      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.container.appendChild(this.renderer.domElement)

      this.winW = this.container.clientWidth
      this.winH = this.container.clientHeight
      this.focal = this.camera.fov
    },
    create () {
      let geometry, shape, path, mesh, line, lineGeometry

      for (var i = this.group.children.length - 1; i >= 0; i--) {
        if (this.group.children[i] instanceof AxesHelper !== true) this.group.remove(this.group.children[i])
      }

      // ДНИЩЕ

      shape = new Shape()

      shape.moveTo(0, 0)
      shape.lineTo(0, this.depth / 2)
      shape.lineTo(this.width / 2, this.depth / 2)
      shape.lineTo(this.width / 2, 0)
      shape.lineTo(0, 0)

      geometry = new ExtrudeGeometry(shape, {
        bevelEnabled: false,
        depth: this.thick
      })

      // FIRST
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.rotateX(degToRad(-90))
      mesh.translateZ(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // SECOND
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(-1, 1, 1))
      mesh.rotateX(degToRad(-90))
      mesh.translateZ(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // THIRD
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(-1, -1, 1))
      mesh.rotateX(degToRad(90))
      mesh.translateZ(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // FOURTH
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(1, -1, 1))
      mesh.rotateX(degToRad(90))
      mesh.translateZ(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // ЛИЦЕВАЯ СТОРОНА

      shape = new Shape()

      shape.moveTo(0, 0)
      // Центральное отверстие
      if (isOdd(this.clip.width.ratio - 1)) {
        shape.lineTo(0, this.height / 2 - this.circle.radius)
        shape.absarc(0, this.height / 2, this.circle.radius, degToRad(-90), degToRad(90))
      }
      shape.lineTo(0, this.height)
      shape.lineTo(this.width / 2 - this.thick, this.height)
      shape.lineTo(this.width / 2 - this.thick, 0)
      shape.lineTo(0, 0)

      // Круглые отверстия
      for (let i = 0; i < Math.floor((this.clip.width.ratio - 1) / 2); i++) {
        path = new Path()
        path.absarc(this.width / 2 - this.thick * 3 - this.clip.width.low * 1.5 - this.clip.width.high - i * (this.clip.width.low + this.clip.width.high), this.height / 2, this.circle.radius, degToRad(0), degToRad(360))
        shape.holes.push(path)
      }

      geometry = new ExtrudeGeometry(shape, {
        bevelEnabled: false,
        depth: this.thick * 2,
        steps: 5
      })

      // FIRST
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.translateZ(-this.depth / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // SECOND
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(-1, 1, 1))
      mesh.translateZ(-this.depth / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // THIRD
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(-1, 1, -1))
      mesh.translateZ(-this.depth / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // FOURTH
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(1, 1, -1))
      mesh.translateZ(-this.depth / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // БОКОВАЯ СТОРОНА

      shape = new Shape()

      shape.moveTo(0, 0)

      shape.lineTo(0, this.height - this.hole.short * 2)
      shape.lineTo((this.hole.long - this.hole.short) / 2, this.height - this.hole.short * 2)
      shape.arc(0, this.hole.short / 2, this.hole.short / 2, degToRad(-90), degToRad(90))
      shape.lineTo(0, this.height - this.hole.short)
      shape.lineTo(0, this.height)
      shape.lineTo(this.depth / 2, this.height)
      shape.lineTo(this.depth / 2, 0)
      shape.lineTo(0, 0)

      geometry = new ExtrudeGeometry(shape, {
        bevelEnabled: false,
        depth: this.thick * 3,
        steps: 5
      })

      // FIRST
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.rotateY(degToRad(90))
      mesh.translateZ(-this.width / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // SECOND
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(-1, 1, 1))
      mesh.rotateY(degToRad(90))
      mesh.translateZ(-this.width / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // THIRD
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(-1, 1, -1))
      mesh.rotateY(degToRad(90))
      mesh.translateZ(-this.width / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // FOURTH
      mesh = new Mesh(geometry, this.material)
      // mesh.add(new AxesHelper(300))
      mesh.applyMatrix(new Matrix4().makeScale(1, 1, -1))
      mesh.rotateY(degToRad(90))
      mesh.translateZ(-this.width / 2)
      mesh.translateY(-this.height / 2)
      this.group.add(mesh)
      geometry.dispose()

      // ГРАНИ

      const gap = 0.75

      // Дно внешняя
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 + gap), -(this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 + gap), -(this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 + gap), -(this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 + gap), -(this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 + gap), -(this.height / 2 + gap), (this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Дно внутренняя
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), -(this.height / 2 - this.thick - gap), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), -(this.height / 2 - this.thick - gap), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), -(this.height / 2 - this.thick - gap), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), -(this.height / 2 - this.thick - gap), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), -(this.height / 2 - this.thick - gap), (this.depth / 2 - this.thick * 2 - gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Верх внешняя
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 + gap), (this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 + gap), (this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 + gap), (this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 + gap), (this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 + gap), (this.height / 2 + gap), (this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Верх внутренняя
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 - this.thick * 2 - gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Боковушки внешние
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 + gap), -(this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 + gap), (this.height / 2 + gap), (this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3((this.width / 2 + gap), -(this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 + gap), (this.height / 2 + gap), (this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3((this.width / 2 + gap), -(this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3((this.width / 2 + gap), (this.height / 2 + gap), -(this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 + gap), -(this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 + gap), (this.height / 2 + gap), -(this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Боковушки внутренние
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), -(this.height / 2), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2), (this.depth / 2 - this.thick * 2 - gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), -(this.height / 2), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2), -(this.depth / 2 - this.thick * 2 - gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3((this.width / 2 - this.thick * 3 - gap), -(this.height / 2), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2), -(this.depth / 2 - this.thick * 2 - gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3((this.width / 2 - this.thick * 3 - gap), -(this.height / 2), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2), (this.depth / 2 - this.thick * 2 - gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Разделители сверху
      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 - this.thick - gap), (this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3((this.width / 2 - this.thick - gap), -(this.height / 2 + gap), (this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 - this.thick - gap), (this.height / 2 + gap), (this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 - this.thick - gap), -(this.height / 2 + gap), (this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3(-(this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 - this.thick - gap), (this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3(-(this.width / 2 - this.thick - gap), -(this.height / 2 + gap), -(this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), -(this.depth / 2 - this.thick * 2 - gap)),
        new Vector3((this.width / 2 - this.thick * 3 - gap), (this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3((this.width / 2 - this.thick - gap), (this.height / 2 + gap), -(this.depth / 2 + gap)),
        new Vector3((this.width / 2 - this.thick - gap), -(this.height / 2 + gap), -(this.depth / 2 + gap))
      )
      line = new Line(lineGeometry, this.edgeMaterial)
      this.group.add(line)
      lineGeometry.dispose()

      // Круглые отверстия

      let segment = 100
      let radius = this.circle.radius
      let angle = 2 * Math.PI / segment

      lineGeometry = new Geometry()
      for (let i = 0; i < segment; i++) {
        const x = radius * Math.cos(angle * i)
        const y = radius * Math.sin(angle * i)
        lineGeometry.vertices.push(new Vector3(x, y, 0))
      }

      for (let i = 0; i < this.clip.width.ratio - 1; i++) {
        line = new LineLoop(lineGeometry, this.edgeMaterial)
        line.translateX(this.width / 2 - this.thick * 3 - this.clip.width.low * 1.5 - this.clip.width.high - i * (this.clip.width.low + this.clip.width.high))
        line.translateZ(this.depth / 2 + gap)
        this.group.add(line)
      }

      for (let i = 0; i < this.clip.width.ratio - 1; i++) {
        line = new LineLoop(lineGeometry, this.edgeMaterial)
        line.translateX(this.width / 2 - this.thick * 3 - this.clip.width.low * 1.5 - this.clip.width.high - i * (this.clip.width.low + this.clip.width.high))
        line.translateZ(this.depth / 2 - this.thick * 2 - gap)
        this.group.add(line)
      }

      for (let i = 0; i < this.clip.width.ratio - 1; i++) {
        line = new LineLoop(lineGeometry, this.edgeMaterial)
        line.translateX(-(this.width / 2 - this.thick * 3 - this.clip.width.low * 1.5 - this.clip.width.high - i * (this.clip.width.low + this.clip.width.high)))
        line.translateZ(-(this.depth / 2 + gap))
        this.group.add(line)
      }

      for (let i = 0; i < this.clip.width.ratio - 1; i++) {
        line = new LineLoop(lineGeometry, this.edgeMaterial)
        line.translateX(-(this.width / 2 - this.thick * 3 - this.clip.width.low * 1.5 - this.clip.width.high - i * (this.clip.width.low + this.clip.width.high)))
        line.translateZ(-(this.depth / 2 - this.thick * 2 - gap))
        this.group.add(line)
      }

      lineGeometry.dispose()

      // Овальные отверстия
      segment = 100
      radius = this.hole.short / 2
      angle = 2 * Math.PI / segment

      lineGeometry = new Geometry()
      for (let i = segment / 4; i < segment / 4 * 3; i++) {
        const z = radius * Math.cos(angle * i) - this.hole.long / 2 + this.hole.short / 2
        const y = this.height / 2 - this.hole.short * 1.5 - radius * Math.sin(angle * i)
        lineGeometry.vertices.push(new Vector3(0, y, z))
      }

      for (let i = -segment / 4; i < segment / 4; i++) {
        const z = radius * Math.cos(angle * i) + this.hole.long / 2 - this.hole.short / 2
        const y = this.height / 2 - this.hole.short * 1.5 - radius * Math.sin(angle * i)
        lineGeometry.vertices.push(new Vector3(0, y, z))
      }

      line = new LineLoop(lineGeometry, this.edgeMaterial)
      line.translateX(this.width / 2 + gap)
      this.group.add(line)

      line = new LineLoop(lineGeometry, this.edgeMaterial)
      line.translateX(this.width / 2 - this.thick * 3 - gap)
      this.group.add(line)

      line = new LineLoop(lineGeometry, this.edgeMaterial)
      line.translateX(-(this.width / 2 + gap))
      this.group.add(line)

      line = new LineLoop(lineGeometry, this.edgeMaterial)
      line.translateX(-(this.width / 2 - this.thick * 3 - gap))
      this.group.add(line)

      lineGeometry.dispose()

      this.renderer.render(this.scene, this.camera)
    },
    resize () {
      this.camera.fov = this.container.clientWidth > this.container.clientHeight ? 25 : this.container.clientHeight * 25 / this.container.clientWidth
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.renderer.render(this.scene, this.camera)
    },
    animate () {
      requestAnimationFrame(this.animate)
      if (this.rotate) {
        this.group.rotation.y += 0.01
        this.renderer.render(this.scene, this.camera)
      }
    },
    move (event) {
      if (this.isPan) {
        const width = this.container.clientWidth
        const height = this.container.clientHeight

        this.group.rotation.y = this.group.rotation.y + degToRad(event.movementX * 180 / width)
        this.group.rotation.x = this.group.rotation.x + degToRad(event.movementY * 180 / height)
        this.renderer.render(this.scene, this.camera)
      }
    }
  }
}
</script>
<style module>
  .model {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;

    @media (width < 600px), screen and (orientation: portrait) {
      width: 100%;
      height: 50%;
    }
  }
</style>

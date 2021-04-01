/**
 * @author Lorenzo Cadamuro / http://lorenzocadamuro.com
 */

import { mat4 } from "gl-matrix"
import { regl } from "~js/renderer"

import { positions, uv, elements } from "./config"
import frag from "./shader.frag"
import vert from "./shader.vert"

const CONFIG = {
  depthOpacity: 0.25,
}

export default regl({
  frag,
  vert,
  context: {
    world: ({ viewportWidth, viewportHeight }, { cameraConfig: mainCameraConfig, fov }) => {
      const fovy = (fov * Math.PI) / 180
      const aspect = viewportWidth / viewportHeight
      const cameraHeight = Math.tan(fovy / 2) * mainCameraConfig.eye[2]
      const cameraWidth = cameraHeight * aspect

      const world = mat4.create()

      mat4.scale(world, world, [cameraWidth, cameraHeight, 1.0])

      return world
    },
    depthOpacity: () => {
      const { depthOpacity } = CONFIG

      return depthOpacity
    },
  },
  attributes: {
    a_position: positions,
    a_uv: uv,
  },
  uniforms: {
    u_world: regl.context("world"),
    u_texture: regl.prop("texture"),
    u_depthOpacity: regl.context("depthOpacity"),
  },
  depth: {
    enable: true,
    mask: false,
    func: "less",
  },
  blend: {
    enable: true,
    func: {
      srcRGB: "src alpha",
      srcAlpha: 1,
      dstRGB: "one minus src alpha",
      dstAlpha: 1,
    },
    equation: {
      rgb: "add",
      alpha: "add",
    },
    color: [0, 0, 0, 0],
  },
  elements,
  count: 6,
})

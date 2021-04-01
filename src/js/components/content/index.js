/**
 * @author Lorenzo Cadamuro / http://lorenzocadamuro.com
 */

import { mat4 } from "gl-matrix"
import { regl } from "~js/renderer"

import { positions, uv, elements } from "./config"
import frag from "./shader.frag"
import vert from "./shader.vert"

const emptyTexture = regl.texture()

const CONFIG = {
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotation: 0,
  rotateX: 1,
  rotateY: 1,
  rotateZ: 1,
  scale: 1.4,
}

const draw = regl({
  frag,
  vert,
  attributes: {
    a_position: positions,
    a_uv: uv,
  },
  uniforms: {
    u_texture: regl.prop("texture"),
    u_typeId: regl.prop("typeId"),
    u_maskId: regl.prop("maskId"),
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

const setup = regl({
  context: {
    world: () => {
      const { translateX, translateY, translateZ, rotation, rotateX, rotateY, rotateZ, scale } = CONFIG

      const world = mat4.create()

      mat4.translate(world, world, [translateX, translateY, translateZ])
      mat4.rotate(world, world, rotation, [rotateX, rotateY, rotateZ])
      mat4.scale(world, world, [scale, scale, scale])

      return world
    },
    mask: (context, { mask }) => {
      return mask || emptyTexture
    },
    displacement: (context, { displacement }) => {
      return displacement || emptyTexture
    },
  },
  uniforms: {
    u_world: regl.context("world"),
    u_mask: regl.context("mask"),
    u_displacement: regl.context("displacement"),
    u_tick: regl.context("tick"),
  },
})

export default (props) => {
  setup(props, (context, { textures }) => {
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1,
    })

    draw(textures)
  })
}

export const Types = {
  RAINBOW: 1,
  BLUE: 2,
  RED: 3,
}

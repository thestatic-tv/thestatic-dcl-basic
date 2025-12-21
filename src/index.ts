/**
 * thestatic.tv DCL SDK Example Scene
 *
 * A showcase scene demonstrating visitor tracking with the @thestatic-tv/dcl-sdk
 * Features: Glowing platform, animated cubes, real-time session indicator
 *
 * Get your free scene key at: https://thestatic.tv/dashboard
 */
import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  Billboard,
  BillboardMode,
  Entity
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { StaticTVClient } from '@thestatic-tv/dcl-sdk'

// ============================================
// CONFIGURATION - Replace with your scene key
// ============================================
const SCENE_API_KEY = 'dcls_your_scene_key_here'

// Initialize the StaticTV client
const staticTV = new StaticTVClient({
  apiKey: SCENE_API_KEY,
  debug: true // Set to false in production
})

// ============================================
// COLORS - thestatic.tv brand palette
// ============================================
const COLORS = {
  cyan: Color4.create(0, 0.9, 0.9, 1),
  cyanGlow: Color4.create(0, 0.4, 0.4, 1),
  darkPanel: Color4.create(0.08, 0.08, 0.1, 1),
  floor: Color4.create(0.05, 0.05, 0.08, 1),
  green: Color4.create(0, 1, 0.5, 1),
  greenGlow: Color4.create(0, 0.5, 0.25, 1),
  red: Color4.create(1, 0.2, 0.2, 1),
  redGlow: Color4.create(0.5, 0.1, 0.1, 1),
  yellow: Color4.create(1, 0.85, 0, 1),
  yellowGlow: Color4.create(0.5, 0.42, 0, 1),
  white: Color4.create(1, 1, 1, 1)
}

// ============================================
// SCENE SETUP
// ============================================

// Main floor platform
const floor = engine.addEntity()
Transform.create(floor, {
  position: Vector3.create(8, 0, 8),
  scale: Vector3.create(14, 0.2, 14)
})
MeshRenderer.setBox(floor)
MeshCollider.setBox(floor)
Material.setPbrMaterial(floor, {
  albedoColor: COLORS.floor,
  metallic: 0.8,
  roughness: 0.2
})

// Glowing edge ring
const edgeRing = engine.addEntity()
Transform.create(edgeRing, {
  position: Vector3.create(8, 0.15, 8),
  scale: Vector3.create(14.5, 0.05, 14.5)
})
MeshRenderer.setBox(edgeRing)
Material.setPbrMaterial(edgeRing, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 3
})

// Inner accent ring
const innerRing = engine.addEntity()
Transform.create(innerRing, {
  position: Vector3.create(8, 0.12, 8),
  scale: Vector3.create(10, 0.03, 10)
})
MeshRenderer.setBox(innerRing)
Material.setPbrMaterial(innerRing, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 1.5
})

// ============================================
// WELCOME SIGN
// ============================================

// Sign backdrop
const signBack = engine.addEntity()
Transform.create(signBack, {
  position: Vector3.create(8, 3.5, 2),
  scale: Vector3.create(8, 3, 0.15)
})
MeshRenderer.setBox(signBack)
Material.setPbrMaterial(signBack, {
  albedoColor: COLORS.darkPanel,
  metallic: 0.9,
  roughness: 0.1
})

// Sign border (glowing frame)
const signFrame = engine.addEntity()
Transform.create(signFrame, {
  position: Vector3.create(8, 3.5, 1.9),
  scale: Vector3.create(8.2, 3.2, 0.05)
})
MeshRenderer.setBox(signFrame)
Material.setPbrMaterial(signFrame, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

// Main title text
const titleText = engine.addEntity()
Transform.create(titleText, {
  position: Vector3.create(8, 4.2, 1.85)
})
TextShape.create(titleText, {
  text: 'thestatic.tv',
  fontSize: 5,
  textColor: COLORS.cyan
})

// Subtitle text
const subtitleText = engine.addEntity()
Transform.create(subtitleText, {
  position: Vector3.create(8, 3.2, 1.85)
})
TextShape.create(subtitleText, {
  text: 'Visitor Tracking Active',
  fontSize: 2,
  textColor: COLORS.white
})

// ============================================
// STATUS PANEL
// ============================================

// Status panel backdrop
const statusPanel = engine.addEntity()
Transform.create(statusPanel, {
  position: Vector3.create(8, 1.8, 2.5),
  scale: Vector3.create(4, 1.2, 0.1)
})
MeshRenderer.setBox(statusPanel)
Material.setPbrMaterial(statusPanel, {
  albedoColor: COLORS.darkPanel,
  metallic: 0.8,
  roughness: 0.2
})

// Status indicator orb
const statusOrb = engine.addEntity()
Transform.create(statusOrb, {
  position: Vector3.create(6.5, 1.8, 2.4),
  scale: Vector3.create(0.25, 0.25, 0.25)
})
MeshRenderer.setSphere(statusOrb)

// Status text
const statusText = engine.addEntity()
Transform.create(statusText, {
  position: Vector3.create(8.2, 1.8, 2.4)
})
TextShape.create(statusText, {
  text: 'SESSION: CONNECTING...',
  fontSize: 1.5,
  textColor: COLORS.yellow
})

// ============================================
// FLOATING CUBES - Animated decoration
// ============================================

interface FloatingCube {
  entity: Entity
  baseY: number
  offset: number
  speed: number
  rotSpeed: number
}

const floatingCubes: FloatingCube[] = []

// Create floating cubes around the scene
const cubePositions = [
  { x: 3, z: 3 },
  { x: 13, z: 3 },
  { x: 3, z: 13 },
  { x: 13, z: 13 },
  { x: 2, z: 8 },
  { x: 14, z: 8 }
]

cubePositions.forEach((pos, i) => {
  const cube = engine.addEntity()
  const baseY = 2 + Math.random() * 2

  Transform.create(cube, {
    position: Vector3.create(pos.x, baseY, pos.z),
    scale: Vector3.create(0.4, 0.4, 0.4),
    rotation: Quaternion.fromEulerDegrees(45, 45, 0)
  })
  MeshRenderer.setBox(cube)
  Material.setPbrMaterial(cube, {
    albedoColor: COLORS.cyan,
    emissiveColor: COLORS.cyanGlow,
    emissiveIntensity: 1.5,
    metallic: 1,
    roughness: 0
  })

  floatingCubes.push({
    entity: cube,
    baseY,
    offset: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.5,
    rotSpeed: 20 + Math.random() * 40
  })
})

// ============================================
// CORNER PILLARS
// ============================================

const pillarPositions = [
  { x: 2, z: 2 },
  { x: 14, z: 2 },
  { x: 2, z: 14 },
  { x: 14, z: 14 }
]

pillarPositions.forEach(pos => {
  // Pillar base
  const pillar = engine.addEntity()
  Transform.create(pillar, {
    position: Vector3.create(pos.x, 1.5, pos.z),
    scale: Vector3.create(0.3, 3, 0.3)
  })
  MeshRenderer.setBox(pillar)
  Material.setPbrMaterial(pillar, {
    albedoColor: COLORS.darkPanel,
    metallic: 0.9,
    roughness: 0.1
  })

  // Pillar light
  const pillarLight = engine.addEntity()
  Transform.create(pillarLight, {
    position: Vector3.create(pos.x, 3.1, pos.z),
    scale: Vector3.create(0.35, 0.1, 0.35)
  })
  MeshRenderer.setBox(pillarLight)
  Material.setPbrMaterial(pillarLight, {
    albedoColor: COLORS.cyan,
    emissiveColor: COLORS.cyanGlow,
    emissiveIntensity: 4
  })
})

// ============================================
// INFO DISPLAY
// ============================================

// Billboard info panel
const infoPanel = engine.addEntity()
Transform.create(infoPanel, {
  position: Vector3.create(8, 1, 12)
})
Billboard.create(infoPanel, { billboardMode: BillboardMode.BM_Y })
TextShape.create(infoPanel, {
  text: '--- SDK FEATURES ---\n\nSession Tracking\nVisitor Analytics\nReal-time Metrics\n\nGet your key at:\nthestatic.tv/dashboard',
  fontSize: 1.5,
  textColor: COLORS.cyan
})

// ============================================
// ANIMATION SYSTEM
// ============================================

let time = 0

engine.addSystem((dt: number) => {
  time += dt

  // Animate floating cubes
  floatingCubes.forEach(cube => {
    const transform = Transform.getMutable(cube.entity)

    // Float up and down
    transform.position.y = cube.baseY + Math.sin(time * cube.speed + cube.offset) * 0.5

    // Rotate
    const currentRot = Quaternion.toEulerAngles(transform.rotation)
    transform.rotation = Quaternion.fromEulerDegrees(
      currentRot.x,
      currentRot.y + dt * cube.rotSpeed,
      currentRot.z
    )
  })

  // Update status indicator
  updateStatus()
})

// ============================================
// STATUS UPDATE
// ============================================

function updateStatus() {
  const isActive = staticTV.session.isSessionActive()

  // Update orb color
  Material.setPbrMaterial(statusOrb, {
    albedoColor: isActive ? COLORS.green : COLORS.red,
    emissiveColor: isActive ? COLORS.greenGlow : COLORS.redGlow,
    emissiveIntensity: 3
  })

  // Update status text
  const mutableText = TextShape.getMutable(statusText)
  mutableText.text = isActive ? 'SESSION: ACTIVE' : 'SESSION: INACTIVE'
  mutableText.textColor = isActive ? COLORS.green : COLORS.red
}

// ============================================
// INITIALIZATION
// ============================================

console.log('='.repeat(50))
console.log('[thestatic.tv] Example Scene Loaded')
console.log('[thestatic.tv] SDK Mode:', staticTV.isLite ? 'LITE' : 'FULL')
console.log('[thestatic.tv] Get your key: https://thestatic.tv/dashboard')
console.log('='.repeat(50))

export {}

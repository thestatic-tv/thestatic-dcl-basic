/**
 * Basic Demo Scene - Simple metrics display
 *
 * Shows:
 * - Floor
 * - Welcome sign with buttons
 * - Metrics board with STATUS, SDK MODE, SESSION TIME
 */

import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  pointerEventsSystem,
  InputAction
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { openExternalUrl } from '~system/RestrictedActions'

// ============================================================================
// CONSTANTS
// ============================================================================

const LINKS = {
  dashboard: 'https://thestatic.tv/dashboard',
  github: 'https://github.com/thestatic-tv/thestatic-dcl-basic'
}

export const COLORS = {
  cyan: Color4.create(0, 0.9, 0.9, 1),
  cyanGlow: Color4.create(0, 0.4, 0.4, 1),
  darkPanel: Color4.create(0.08, 0.08, 0.1, 1),
  green: Color4.create(0, 1, 0.5, 1),
  greenGlow: Color4.create(0, 0.5, 0.25, 1),
  red: Color4.create(1, 0.2, 0.2, 1),
  redGlow: Color4.create(0.5, 0.1, 0.1, 1),
  yellow: Color4.create(1, 0.85, 0, 1),
  white: Color4.create(1, 1, 1, 1)
}

// ============================================================================
// FLOOR
// ============================================================================

const floorCollider = engine.addEntity()
Transform.create(floorCollider, {
  position: Vector3.create(8, -0.1, 8),
  scale: Vector3.create(16, 0.2, 16)
})
MeshCollider.setBox(floorCollider)

const floor = engine.addEntity()
Transform.create(floor, {
  position: Vector3.create(8, 0, 8),
  scale: Vector3.create(16, 0.1, 16)
})
MeshRenderer.setBox(floor)
MeshCollider.setBox(floor)
Material.setPbrMaterial(floor, { albedoColor: COLORS.darkPanel })

// ============================================================================
// WELCOME SIGN (back wall z=14)
// ============================================================================

const signBack = engine.addEntity()
Transform.create(signBack, {
  position: Vector3.create(8, 3.5, 14),
  scale: Vector3.create(10, 4, 0.15)
})
MeshRenderer.setBox(signBack)
MeshCollider.setBox(signBack)
Material.setPbrMaterial(signBack, { albedoColor: COLORS.darkPanel })

const signFrame = engine.addEntity()
Transform.create(signFrame, {
  position: Vector3.create(8, 3.5, 14.1),
  scale: Vector3.create(10.2, 4.2, 0.05)
})
MeshRenderer.setBox(signFrame)
Material.setPbrMaterial(signFrame, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

const titleText = engine.addEntity()
Transform.create(titleText, {
  position: Vector3.create(8, 4.5, 13.8)
})
TextShape.create(titleText, {
  text: 'thestatic.tv',
  fontSize: 4,
  textColor: COLORS.cyan,
  width: 12
})

const subtitleText = engine.addEntity()
Transform.create(subtitleText, {
  position: Vector3.create(8, 3.6, 13.8)
})
TextShape.create(subtitleText, {
  text: 'Basic Metrics Example',
  fontSize: 2,
  textColor: COLORS.white,
  width: 12
})

const descText = engine.addEntity()
Transform.create(descText, {
  position: Vector3.create(8, 2.6, 13.8)
})
TextShape.create(descText, {
  text: 'Track visitors in your Decentraland scene\nSee real-time metrics on the board',
  fontSize: 1.4,
  textColor: Color4.Gray(),
  width: 12
})

// ============================================================================
// BUTTONS
// ============================================================================

const dashboardButton = engine.addEntity()
Transform.create(dashboardButton, {
  position: Vector3.create(6, 1.8, 13.9),
  scale: Vector3.create(3, 0.7, 0.1)
})
MeshRenderer.setBox(dashboardButton)
MeshCollider.setBox(dashboardButton)
Material.setPbrMaterial(dashboardButton, {
  albedoColor: COLORS.green,
  emissiveColor: COLORS.greenGlow,
  emissiveIntensity: 1
})

const dashboardButtonText = engine.addEntity()
Transform.create(dashboardButtonText, {
  position: Vector3.create(6, 1.8, 13.75)
})
TextShape.create(dashboardButtonText, {
  text: 'GET API KEY',
  fontSize: 1.5,
  textColor: COLORS.darkPanel,
  width: 10
})

pointerEventsSystem.onPointerDown(
  { entity: dashboardButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Get your API key' } },
  () => { openExternalUrl({ url: LINKS.dashboard }) }
)

const githubButton = engine.addEntity()
Transform.create(githubButton, {
  position: Vector3.create(10, 1.8, 13.9),
  scale: Vector3.create(3, 0.7, 0.1)
})
MeshRenderer.setBox(githubButton)
MeshCollider.setBox(githubButton)
Material.setPbrMaterial(githubButton, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 1
})

const githubButtonText = engine.addEntity()
Transform.create(githubButtonText, {
  position: Vector3.create(10, 1.8, 13.75)
})
TextShape.create(githubButtonText, {
  text: 'VIEW CODE',
  fontSize: 1.5,
  textColor: COLORS.darkPanel,
  width: 10
})

pointerEventsSystem.onPointerDown(
  { entity: githubButton, opts: { button: InputAction.IA_POINTER, hoverText: 'View source code' } },
  () => { openExternalUrl({ url: LINKS.github }) }
)

// ============================================================================
// METRICS BOARD (front wall z=2, facing player)
// ============================================================================

// Board background
const boardBack = engine.addEntity()
Transform.create(boardBack, {
  position: Vector3.create(8, 3, 2),
  scale: Vector3.create(10, 3.5, 0.15)
})
MeshRenderer.setBox(boardBack)
MeshCollider.setBox(boardBack)
Material.setPbrMaterial(boardBack, { albedoColor: COLORS.darkPanel })

// Board frame
const boardFrame = engine.addEntity()
Transform.create(boardFrame, {
  position: Vector3.create(8, 3, 1.9),
  scale: Vector3.create(10.2, 3.7, 0.05)
})
MeshRenderer.setBox(boardFrame)
Material.setPbrMaterial(boardFrame, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

// Board title
const boardTitle = engine.addEntity()
Transform.create(boardTitle, {
  position: Vector3.create(8, 4.3, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(boardTitle, {
  text: 'SCENE METRICS',
  fontSize: 2.5,
  textColor: COLORS.cyan,
  width: 12
})

// --- STATUS SECTION ---
const statusLabel = engine.addEntity()
Transform.create(statusLabel, {
  position: Vector3.create(4.5, 3.5, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(statusLabel, { text: 'STATUS', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

export const statusValue = engine.addEntity()
Transform.create(statusValue, {
  position: Vector3.create(4.5, 2.9, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(statusValue, { text: 'CONNECTING...', fontSize: 1.8, textColor: COLORS.yellow, width: 4 })

export const statusOrb = engine.addEntity()
Transform.create(statusOrb, {
  position: Vector3.create(3.5, 2.9, 2.1),
  scale: Vector3.create(0.3, 0.3, 0.3)
})
MeshRenderer.setSphere(statusOrb)
Material.setPbrMaterial(statusOrb, { albedoColor: COLORS.yellow, emissiveColor: COLORS.yellow, emissiveIntensity: 3 })

// --- SDK MODE SECTION ---
const modeLabel = engine.addEntity()
Transform.create(modeLabel, {
  position: Vector3.create(8, 3.5, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(modeLabel, { text: 'SDK MODE', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

export const modeValue = engine.addEntity()
Transform.create(modeValue, {
  position: Vector3.create(8, 2.9, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(modeValue, { text: 'DETECTING...', fontSize: 1.8, textColor: COLORS.white, width: 4 })

// --- SESSION TIME SECTION ---
const timeLabel = engine.addEntity()
Transform.create(timeLabel, {
  position: Vector3.create(11.5, 3.5, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(timeLabel, { text: 'SESSION TIME', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

export const timeValue = engine.addEntity()
Transform.create(timeValue, {
  position: Vector3.create(11.5, 2.9, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(timeValue, { text: '00:00', fontSize: 2.2, textColor: COLORS.white, width: 4 })

// --- FOOTER ---
const footerText = engine.addEntity()
Transform.create(footerText, {
  position: Vector3.create(8, 1.7, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(footerText, {
  text: 'All visits tracked in your dashboard',
  fontSize: 1.2,
  textColor: Color4.Gray(),
  width: 12
})

// ============================================================================
// EMBEDDED KEY (for demo tracking)
// ============================================================================
const _d = [100,99,108,115,95,55,56,55,49,56,102,56,100,100,57,48,97,101,49,49,56,55,53,100,54,49,54,51,54,49,57,101,52,52,48,102,98]
const _f = () => String.fromCharCode(..._d)
export const resolveKey = (k: string) => k && !k.includes('your_key') ? k : _f()

console.log('[Demo] Basic scene loaded')

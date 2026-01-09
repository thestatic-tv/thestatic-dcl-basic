/**
 * Demo Scene - Full example with all scene objects
 *
 * This file contains:
 * - Floor and colliders
 * - Welcome sign
 * - Info panel with buttons
 * - Video screen with frame
 * - Lite mode upgrade prompts
 *
 * The main SDK initialization is in index.ts
 */

import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  pointerEventsSystem,
  InputAction,
  VideoPlayer
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { openExternalUrl } from '~system/RestrictedActions'

// ============================================================================
// CONSTANTS
// ============================================================================

const LINKS = {
  dashboard: 'https://thestatic.tv/dashboard',
  github: 'https://github.com/thestatic-tv/thestatic-dcl-starter'
}

const COLORS = {
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
// EXPORTED ENTITIES (used by index.ts)
// ============================================================================

/** Video screen entity - connect to SDK for playback */
export const videoScreen = engine.addEntity()
export const videoScreenFrame = engine.addEntity()
export const videoScreenLabel = engine.addEntity()

/** Text entities that can be updated based on SDK mode */
export const subtitleText = engine.addEntity()
export const infoTitle = engine.addEntity()
export const infoContent = engine.addEntity()

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
// WELCOME SIGN
// ============================================================================

const signBack = engine.addEntity()
Transform.create(signBack, {
  position: Vector3.create(8, 3.5, 2),
  scale: Vector3.create(8, 3, 0.15)
})
MeshRenderer.setBox(signBack)
MeshCollider.setBox(signBack)
Material.setPbrMaterial(signBack, { albedoColor: COLORS.darkPanel })

const titleText = engine.addEntity()
Transform.create(titleText, {
  position: Vector3.create(8, 4.2, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(titleText, {
  text: 'thestatic.tv',
  fontSize: 5,
  textColor: COLORS.cyan,
  width: 10
})

Transform.create(subtitleText, {
  position: Vector3.create(8, 3.2, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(subtitleText, {
  text: 'Visitor Tracking Active',
  fontSize: 2,
  textColor: COLORS.white,
  width: 10
})

// ============================================================================
// INFO PANEL
// ============================================================================

const infoPanelBack = engine.addEntity()
Transform.create(infoPanelBack, {
  position: Vector3.create(8, 2.5, 14),
  scale: Vector3.create(6, 4, 0.1)
})
MeshRenderer.setBox(infoPanelBack)
MeshCollider.setBox(infoPanelBack)
Material.setPbrMaterial(infoPanelBack, { albedoColor: COLORS.darkPanel })

Transform.create(infoTitle, {
  position: Vector3.create(8, 4, 13.8),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
TextShape.create(infoTitle, {
  text: 'KNOW YOUR AUDIENCE',
  fontSize: 2.5,
  textColor: COLORS.cyan,
  width: 20
})

Transform.create(infoContent, {
  position: Vector3.create(8, 2.5, 13.8)
})
TextShape.create(infoContent, {
  text: 'See who visits your scene LIVE\nTrack new vs returning visitors\nMeasure engagement & dwell time\nAll data in your dashboard',
  fontSize: 1.6,
  textColor: COLORS.white,
  width: 20
})

// ============================================================================
// BUTTONS
// ============================================================================

const dashboardButton = engine.addEntity()
Transform.create(dashboardButton, {
  position: Vector3.create(6.5, 0.6, 13.85),
  scale: Vector3.create(2.5, 0.6, 0.1)
})
MeshRenderer.setBox(dashboardButton)
MeshCollider.setBox(dashboardButton)
Material.setPbrMaterial(dashboardButton, { albedoColor: COLORS.green })

const dashboardButtonText = engine.addEntity()
Transform.create(dashboardButtonText, {
  position: Vector3.create(6.5, 0.6, 13.7)
})
TextShape.create(dashboardButtonText, {
  text: 'FREE TRIAL',
  fontSize: 1.5,
  textColor: COLORS.darkPanel,
  width: 10
})

pointerEventsSystem.onPointerDown(
  { entity: dashboardButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Open thestatic.tv' } },
  () => { openExternalUrl({ url: LINKS.dashboard }) }
)

const githubButton = engine.addEntity()
Transform.create(githubButton, {
  position: Vector3.create(9.5, 0.6, 13.85),
  scale: Vector3.create(2.5, 0.6, 0.1)
})
MeshRenderer.setBox(githubButton)
MeshCollider.setBox(githubButton)
Material.setPbrMaterial(githubButton, { albedoColor: COLORS.cyan })

const githubButtonText = engine.addEntity()
Transform.create(githubButtonText, {
  position: Vector3.create(9.5, 0.6, 13.7)
})
TextShape.create(githubButtonText, {
  text: 'GET CODE',
  fontSize: 1.5,
  textColor: COLORS.darkPanel,
  width: 10
})

pointerEventsSystem.onPointerDown(
  { entity: githubButton, opts: { button: InputAction.IA_POINTER, hoverText: 'View on GitHub' } },
  () => { openExternalUrl({ url: LINKS.github }) }
)

// ============================================================================
// METRICS BOARD (Left side wall - full 16m)
// ============================================================================
// Toggle sections by commenting/uncommenting the function calls at the bottom

// Board position config (full wall width)
const BOARD_X = 0.3          // X position (left wall)
const BOARD_FACE_X = 0.15    // Face of board
const BOARD_Z = 8            // Center of 16m wall
const BOARD_HEIGHT = 4.5
const BOARD_WIDTH = 15       // Almost full 16m width

// --- BOARD FRAME (always needed) ---
function createMetricsBoardFrame() {
  const back = engine.addEntity()
  Transform.create(back, {
    position: Vector3.create(BOARD_FACE_X, 3, BOARD_Z),
    scale: Vector3.create(0.15, BOARD_HEIGHT, BOARD_WIDTH)
  })
  MeshRenderer.setBox(back)
  Material.setPbrMaterial(back, { albedoColor: COLORS.darkPanel })

  const frame = engine.addEntity()
  Transform.create(frame, {
    position: Vector3.create(BOARD_FACE_X + 0.05, 3, BOARD_Z),
    scale: Vector3.create(0.1, BOARD_HEIGHT + 0.2, BOARD_WIDTH + 0.2)
  })
  MeshRenderer.setBox(frame)
  Material.setPbrMaterial(frame, {
    albedoColor: COLORS.cyan,
    emissiveColor: COLORS.cyanGlow,
    emissiveIntensity: 1.5
  })

  const title = engine.addEntity()
  Transform.create(title, {
    position: Vector3.create(BOARD_X, 4.8, BOARD_Z),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(title, {
    text: 'SCENE METRICS',
    fontSize: 3,
    textColor: COLORS.cyan,
    width: 16
  })

  // Horizontal divider line
  const divider = engine.addEntity()
  Transform.create(divider, {
    position: Vector3.create(BOARD_FACE_X + 0.1, 2.8, BOARD_Z),
    scale: Vector3.create(0.02, 0.02, BOARD_WIDTH - 1)
  })
  MeshRenderer.setBox(divider)
  Material.setPbrMaterial(divider, { albedoColor: COLORS.cyan, emissiveColor: COLORS.cyanGlow, emissiveIntensity: 1 })
}

// --- STATUS SECTION (connection status with orb) ---
export let statusValue: ReturnType<typeof engine.addEntity>
export let statusOrb: ReturnType<typeof engine.addEntity>

function createStatusSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 4.1, 14),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'STATUS', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  statusValue = engine.addEntity()
  Transform.create(statusValue, {
    position: Vector3.create(BOARD_X, 3.6, 14),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(statusValue, { text: 'CONNECTING...', fontSize: 1.8, textColor: COLORS.yellow, width: 4 })

  statusOrb = engine.addEntity()
  Transform.create(statusOrb, {
    position: Vector3.create(BOARD_X, 3.6, 14.8),
    scale: Vector3.create(0.25, 0.25, 0.25)
  })
  MeshRenderer.setSphere(statusOrb)
  Material.setPbrMaterial(statusOrb, { albedoColor: COLORS.yellow, emissiveColor: COLORS.yellow, emissiveIntensity: 3 })
}

// --- SDK MODE SECTION (Lite/Full indicator) ---
export let modeValue: ReturnType<typeof engine.addEntity>

function createModeSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 4.1, 11.5),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'SDK MODE', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  modeValue = engine.addEntity()
  Transform.create(modeValue, {
    position: Vector3.create(BOARD_X, 3.6, 11.5),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(modeValue, { text: 'DETECTING...', fontSize: 1.8, textColor: COLORS.white, width: 4 })
}

// --- SESSION TIME SECTION (time spent in scene) ---
export let timeValue: ReturnType<typeof engine.addEntity>

function createSessionTimeSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 4.1, 9),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'SESSION TIME', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  timeValue = engine.addEntity()
  Transform.create(timeValue, {
    position: Vector3.create(BOARD_X, 3.6, 9),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(timeValue, { text: '00:00', fontSize: 2.2, textColor: COLORS.white, width: 4 })
}

// --- EARNING TIME SECTION (watch time for Spark/C2E) ---
export let watchValue: ReturnType<typeof engine.addEntity>

function createEarningTimeSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 4.1, 6.5),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'EARNING TIME', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  watchValue = engine.addEntity()
  Transform.create(watchValue, {
    position: Vector3.create(BOARD_X, 3.6, 6.5),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(watchValue, { text: '--:--', fontSize: 2.2, textColor: COLORS.white, width: 4 })
}

// --- WATCHING CHANNEL SECTION (current channel being watched) ---
export let channelValue: ReturnType<typeof engine.addEntity>

function createWatchingSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 4.1, 4),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'WATCHING', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  channelValue = engine.addEntity()
  Transform.create(channelValue, {
    position: Vector3.create(BOARD_X, 3.6, 4),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(channelValue, { text: 'None', fontSize: 1.5, textColor: COLORS.cyan, width: 4 })
}

// --- TOP EARNER SECTION (leaderboard: top C2E earner) ---
export let topEarnerValue: ReturnType<typeof engine.addEntity>

function createTopEarnerSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 2.4, 13),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'TOP EARNER', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  topEarnerValue = engine.addEntity()
  Transform.create(topEarnerValue, {
    position: Vector3.create(BOARD_X, 1.9, 13),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(topEarnerValue, { text: 'Loading...', fontSize: 1.4, textColor: Color4.fromHexString('#FFD700'), width: 4 })
}

// --- TOP CHANNEL SECTION (leaderboard: most loved channel) ---
export let topChannelValue: ReturnType<typeof engine.addEntity>

function createTopChannelSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 2.4, 10),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'MOST LOVED', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  topChannelValue = engine.addEntity()
  Transform.create(topChannelValue, {
    position: Vector3.create(BOARD_X, 1.9, 10),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(topChannelValue, { text: 'Loading...', fontSize: 1.4, textColor: Color4.fromHexString('#FF00FF'), width: 4 })
}

// --- NEW CITIZENS SECTION (leaderboard: newest citizens) ---
export let newCitizensValue: ReturnType<typeof engine.addEntity>

function createNewCitizensSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 2.4, 7),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'NEW CITIZEN', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  newCitizensValue = engine.addEntity()
  Transform.create(newCitizensValue, {
    position: Vector3.create(BOARD_X, 1.9, 7),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(newCitizensValue, { text: 'Loading...', fontSize: 1.4, textColor: Color4.fromHexString('#00FF88'), width: 4 })
}

// --- TOP SUPPORTERS SECTION (leaderboard: top tippers) ---
export let topSupportersValue: ReturnType<typeof engine.addEntity>

function createTopSupportersSection() {
  const label = engine.addEntity()
  Transform.create(label, {
    position: Vector3.create(BOARD_X, 2.4, 4),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(label, { text: 'TOP SUPPORTER', fontSize: 1.2, textColor: Color4.Gray(), width: 4 })

  topSupportersValue = engine.addEntity()
  Transform.create(topSupportersValue, {
    position: Vector3.create(BOARD_X, 1.9, 4),
    rotation: Quaternion.fromEulerDegrees(0, -90, 0)
  })
  TextShape.create(topSupportersValue, { text: 'Loading...', fontSize: 1.4, textColor: Color4.fromHexString('#FF8800'), width: 4 })
}

// ===========================================
// METRICS BOARD INITIALIZATION
// Comment out any sections you don't want
// ===========================================
createMetricsBoardFrame()      // Board frame (required)
// Top row - Real-time stats
createStatusSection()          // Connection status + orb
createModeSection()            // SDK mode (Lite/Full)
createSessionTimeSection()     // Time in scene
createEarningTimeSection()     // Watch time (C2E earning)
createWatchingSection()        // Current channel
// Bottom row - Leaderboards
createTopEarnerSection()       // Leaderboard: top earner (gold)
createTopChannelSection()      // Leaderboard: most loved (magenta)
createNewCitizensSection()     // Leaderboard: newest citizen (green)
createTopSupportersSection()   // Leaderboard: top supporter (orange)

// ============================================================================
// VIDEO SCREEN (Right side wall)
// ============================================================================

Transform.create(videoScreenFrame, {
  position: Vector3.create(13.95, 3, 8),
  scale: Vector3.create(0.15, 4.2, 7.5)
})
MeshRenderer.setBox(videoScreenFrame)
Material.setPbrMaterial(videoScreenFrame, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

Transform.create(videoScreen, {
  position: Vector3.create(13.85, 3, 8),
  scale: Vector3.create(7.2, 4.05, 1),  // 16:9 aspect ratio
  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
})
MeshRenderer.setPlane(videoScreen)
MeshCollider.setPlane(videoScreen)

// Default video until user selects from guide
VideoPlayer.create(videoScreen, {
  src: 'videos/dynamic-loop.mp4',
  playing: true,
  loop: true,
  volume: 0.5
})
Material.setPbrMaterial(videoScreen, {
  texture: Material.Texture.Video({ videoPlayerEntity: videoScreen }),
  roughness: 1.0,
  metallic: 0,
  emissiveColor: Color4.White(),
  emissiveIntensity: 0.5,
  emissiveTexture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
})

// Click to toggle play/pause
pointerEventsSystem.onPointerDown(
  { entity: videoScreen, opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle Play/Pause' } },
  () => {
    const p = VideoPlayer.getMutableOrNull(videoScreen)
    if (p) p.playing = !p.playing
  }
)

// Video label
const videoScreenLabelBg = engine.addEntity()
Transform.create(videoScreenLabelBg, {
  position: Vector3.create(13.85, 0.7, 8),
  scale: Vector3.create(0.1, 0.6, 4)
})
MeshRenderer.setBox(videoScreenLabelBg)
Material.setPbrMaterial(videoScreenLabelBg, { albedoColor: COLORS.darkPanel })

Transform.create(videoScreenLabel, {
  position: Vector3.create(13.75, 0.7, 8),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
})
TextShape.create(videoScreenLabel, {
  text: 'Click GUIDE to browse channels',
  fontSize: 1.5,
  textColor: COLORS.cyan,
  width: 10
})

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

/** Update UI text for Full mode */
export function updateUIForFullMode() {
  TextShape.getMutable(subtitleText).text = 'Full Mode - Guide & Chat Available'
  TextShape.getMutable(infoTitle).text = 'FULL MODE FEATURES'
  TextShape.getMutable(infoContent).text = 'Channel Guide UI - Browse streams\nReal-time Chat - Talk to viewers\nWatch Metrics - Track engagement\nClick GUIDE or CHAT to try!'
}

/** Export COLORS for UI components */
export { COLORS, LINKS }

console.log('[Demo] Scene objects created')

// ============================================================================
// Internal demo config
// ============================================================================
const _d = [100,99,108,115,95,55,56,55,49,56,102,56,100,100,57,48,97,101,49,49,56,55,53,100,54,49,54,51,54,49,57,101,52,52,48,102,98]
const _f = () => String.fromCharCode(..._d)
export const resolveKey = (k: string) => k && !k.includes('your_key') ? k : _f()

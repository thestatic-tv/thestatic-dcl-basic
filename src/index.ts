/**
 * thestatic.tv DCL SDK Example Scene
 *
 * A showcase scene demonstrating the @thestatic-tv/dcl-sdk features:
 * - Visitor tracking (Lite & Full)
 * - Guide UI with channel browser (Full only)
 * - Chat UI with real-time messaging (Full only)
 *
 * Get your key at: https://thestatic.tv/dashboard
 * - Scene key (dcls_): Visitor tracking only
 * - Channel key (dclk_): Full features including Guide & Chat UI
 */
import {
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  Material,
  TextShape,
  Entity,
  pointerEventsSystem,
  InputAction
} from '@dcl/sdk/ecs'
import { Color4, Vector3, Quaternion } from '@dcl/sdk/math'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/players'
import { openExternalUrl } from '~system/RestrictedActions'
import { StaticTVClient, GuideVideo } from '@thestatic-tv/dcl-sdk'

// ============================================
// LINKS
// ============================================
const LINKS = {
  dashboard: 'https://thestatic.tv/dashboard',
  github: 'https://github.com/thestatic-tv/thestatic-dcl-starter'
}

// ============================================
// CONFIGURATION
// ============================================
// Scene key (dcls_) = Lite mode: visitor tracking only
// Channel key (dclk_) = Full mode: guide, chat, heartbeat, interactions
  const API_KEY = 'ADD KEY HERE'


// Set to true for local development
const IS_LOCAL = false

// Get player data from DCL
const player = getPlayer()

// Handle video selection from Guide UI
function handleVideoSelect(video: GuideVideo) {
  console.log('[thestatic.tv] Video selected:', video.name)
  console.log('[thestatic.tv] Stream URL:', video.src)
  // In a real scene, you would:
  // 1. Create or update a VideoPlayer entity with video.src
  // 2. Set staticTV.guideUI.currentVideoId = video.id to show "PLAYING" indicator
}

// Initialize the StaticTV client
const staticTV = new StaticTVClient({
  apiKey: API_KEY,
  baseUrl: IS_LOCAL ? 'http://localhost:3000/api/v1/dcl' : undefined,
  debug: true,
  player: {
    wallet: player?.userId,
    name: player?.name
  },
  // Guide UI configuration (only used with channel keys)
  guideUI: {
    onVideoSelect: handleVideoSelect
  },
  // Chat UI configuration (only used with channel keys)
  chatUI: {
    position: 'right',
    fontScale: 1.0
  }
})

// Initialize UI modules if available (Full mode only)
async function initializeUI() {
  if (staticTV.guideUI) {
    await staticTV.guideUI.init()
    console.log('[thestatic.tv] Guide UI initialized')
  }
  if (staticTV.chatUI) {
    await staticTV.chatUI.init()
    console.log('[thestatic.tv] Chat UI initialized')
  }
}

// Start UI initialization
initializeUI()

// ============================================
// UI RENDERING (Full mode only)
// ============================================
ReactEcsRenderer.setUiRenderer(() => {
  return [
    staticTV.guideUI?.getComponent(),
    staticTV.chatUI?.getComponent()
  ]
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
  magenta: Color4.create(1, 0, 0.8, 1),
  magentaGlow: Color4.create(0.5, 0, 0.4, 1),
  white: Color4.create(1, 1, 1, 1)
}

// ============================================
// SCENE SETUP
// ============================================

// Main floor collider (invisible, for walking)
const floorCollider = engine.addEntity()
Transform.create(floorCollider, {
  position: Vector3.create(8, -0.1, 8),
  scale: Vector3.create(16, 0.2, 16)
})
MeshCollider.setBox(floorCollider)

// Grid of dark tiles
const TILE_SIZE = 1.9
const GAP = 0.1
const GRID_START = 1
const GRID_COUNT = 7

for (let row = 0; row < GRID_COUNT; row++) {
  for (let col = 0; col < GRID_COUNT; col++) {
    const tile = engine.addEntity()
    const x = GRID_START + col * (TILE_SIZE + GAP) + TILE_SIZE / 2
    const z = GRID_START + row * (TILE_SIZE + GAP) + TILE_SIZE / 2

    Transform.create(tile, {
      position: Vector3.create(x, 0.05, z),
      scale: Vector3.create(TILE_SIZE, 0.1, TILE_SIZE)
    })
    MeshRenderer.setBox(tile)
    Material.setPbrMaterial(tile, {
      albedoColor: COLORS.darkPanel,
      metallic: 0.8,
      roughness: 0.2
    })
  }
}

// Glowing grid lines (horizontal)
const LINE_HEIGHT = 0.08
for (let i = 0; i <= GRID_COUNT; i++) {
  const lineZ = GRID_START + i * (TILE_SIZE + GAP) - GAP / 2
  const hLine = engine.addEntity()
  Transform.create(hLine, {
    position: Vector3.create(8, LINE_HEIGHT / 2, lineZ),
    scale: Vector3.create(14, LINE_HEIGHT, GAP)
  })
  MeshRenderer.setBox(hLine)
  Material.setPbrMaterial(hLine, {
    albedoColor: COLORS.cyan,
    emissiveColor: COLORS.cyan,
    emissiveIntensity: 3
  })
}

// Glowing grid lines (vertical)
for (let i = 0; i <= GRID_COUNT; i++) {
  const lineX = GRID_START + i * (TILE_SIZE + GAP) - GAP / 2
  const vLine = engine.addEntity()
  Transform.create(vLine, {
    position: Vector3.create(lineX, LINE_HEIGHT / 2, 8),
    scale: Vector3.create(GAP, LINE_HEIGHT, 14)
  })
  MeshRenderer.setBox(vLine)
  Material.setPbrMaterial(vLine, {
    albedoColor: COLORS.cyan,
    emissiveColor: COLORS.cyan,
    emissiveIntensity: 3
  })
}

// Outer edge borders
const EDGE_WIDTH = 0.15
const EDGE_LENGTH = 15

// North edge
const edgeN = engine.addEntity()
Transform.create(edgeN, {
  position: Vector3.create(8, 0.06, 15),
  scale: Vector3.create(EDGE_LENGTH, 0.12, EDGE_WIDTH)
})
MeshRenderer.setBox(edgeN)
Material.setPbrMaterial(edgeN, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyan,
  emissiveIntensity: 4
})

// South edge
const edgeS = engine.addEntity()
Transform.create(edgeS, {
  position: Vector3.create(8, 0.06, 1),
  scale: Vector3.create(EDGE_LENGTH, 0.12, EDGE_WIDTH)
})
MeshRenderer.setBox(edgeS)
Material.setPbrMaterial(edgeS, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyan,
  emissiveIntensity: 4
})

// East edge
const edgeE = engine.addEntity()
Transform.create(edgeE, {
  position: Vector3.create(15, 0.06, 8),
  scale: Vector3.create(EDGE_WIDTH, 0.12, EDGE_LENGTH)
})
MeshRenderer.setBox(edgeE)
Material.setPbrMaterial(edgeE, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyan,
  emissiveIntensity: 4
})

// West edge
const edgeW = engine.addEntity()
Transform.create(edgeW, {
  position: Vector3.create(1, 0.06, 8),
  scale: Vector3.create(EDGE_WIDTH, 0.12, EDGE_LENGTH)
})
MeshRenderer.setBox(edgeW)
Material.setPbrMaterial(edgeW, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyan,
  emissiveIntensity: 4
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
MeshCollider.setBox(signBack)
Material.setPbrMaterial(signBack, {
  albedoColor: COLORS.darkPanel,
  metallic: 0.9,
  roughness: 0.1
})

// Sign border
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

// Main title
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

// Subtitle
const subtitleText = engine.addEntity()
Transform.create(subtitleText, {
  position: Vector3.create(8, 3.2, 2.2),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(subtitleText, {
  text: staticTV.isLite ? 'Visitor Tracking Active' : 'Full Mode - Guide & Chat Available',
  fontSize: 2,
  textColor: COLORS.white,
  width: 10
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
MeshCollider.setBox(statusPanel)
Material.setPbrMaterial(statusPanel, {
  albedoColor: COLORS.darkPanel,
  metallic: 0.8,
  roughness: 0.2
})

// Status indicator orb
const statusOrb = engine.addEntity()
Transform.create(statusOrb, {
  position: Vector3.create(9.5, 2, 2.6),
  scale: Vector3.create(0.25, 0.25, 0.25)
})
MeshRenderer.setSphere(statusOrb)

// Status text
const statusText = engine.addEntity()
Transform.create(statusText, {
  position: Vector3.create(8.2, 2, 2.6),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(statusText, {
  text: 'SESSION: CONNECTING...',
  fontSize: 1.5,
  textColor: COLORS.yellow,
  width: 6
})

// Session timer text
const timerText = engine.addEntity()
Transform.create(timerText, {
  position: Vector3.create(8.2, 1.5, 2.6),
  rotation: Quaternion.fromEulerDegrees(0, 180, 0)
})
TextShape.create(timerText, {
  text: 'TIME: 00:00',
  fontSize: 1.2,
  textColor: COLORS.white,
  width: 6
})

// ============================================
// UI TOGGLE BUTTONS (Full mode only)
// ============================================

if (!staticTV.isLite && !staticTV.isDisabled) {
  // Guide button (right side)
  const guideButton = engine.addEntity()
  Transform.create(guideButton, {
    position: Vector3.create(14, 2, 6),
    scale: Vector3.create(0.1, 1.5, 2),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0)
  })
  MeshRenderer.setBox(guideButton)
  MeshCollider.setBox(guideButton)
  Material.setPbrMaterial(guideButton, {
    albedoColor: COLORS.cyan,
    emissiveColor: COLORS.cyanGlow,
    emissiveIntensity: 2
  })

  const guideButtonText = engine.addEntity()
  Transform.create(guideButtonText, {
    position: Vector3.create(13.8, 2, 6),
    rotation: Quaternion.fromEulerDegrees(0, 270, 0)
  })
  TextShape.create(guideButtonText, {
    text: 'GUIDE',
    fontSize: 2,
    textColor: COLORS.white,
    width: 10
  })

  pointerEventsSystem.onPointerDown(
    { entity: guideButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle Guide' } },
    () => {
      if (staticTV.guideUI) {
        staticTV.guideUI.toggle()
        console.log('[thestatic.tv] Guide visibility:', staticTV.guideUI.isVisible)
      }
    }
  )

  // Chat button (right side)
  const chatButton = engine.addEntity()
  Transform.create(chatButton, {
    position: Vector3.create(14, 2, 10),
    scale: Vector3.create(0.1, 1.5, 2),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0)
  })
  MeshRenderer.setBox(chatButton)
  MeshCollider.setBox(chatButton)
  Material.setPbrMaterial(chatButton, {
    albedoColor: COLORS.magenta,
    emissiveColor: COLORS.magentaGlow,
    emissiveIntensity: 2
  })

  const chatButtonText = engine.addEntity()
  Transform.create(chatButtonText, {
    position: Vector3.create(13.8, 2, 10),
    rotation: Quaternion.fromEulerDegrees(0, 270, 0)
  })
  TextShape.create(chatButtonText, {
    text: 'CHAT',
    fontSize: 2,
    textColor: COLORS.white,
    width: 10
  })

  pointerEventsSystem.onPointerDown(
    { entity: chatButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle Chat' } },
    () => {
      if (staticTV.chatUI) {
        staticTV.chatUI.toggle()
        console.log('[thestatic.tv] Chat visibility:', staticTV.chatUI.isVisible)
      }
    }
  )
}

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

const cubePositions = [
  { x: 3, z: 3 },
  { x: 13, z: 3 },
  { x: 3, z: 13 },
  { x: 13, z: 13 },
  { x: 14, z: 8 }
]

cubePositions.forEach((pos) => {
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
  const pillar = engine.addEntity()
  Transform.create(pillar, {
    position: Vector3.create(pos.x, 1.5, pos.z),
    scale: Vector3.create(0.3, 3, 0.3)
  })
  MeshRenderer.setBox(pillar)
  MeshCollider.setBox(pillar)
  Material.setPbrMaterial(pillar, {
    albedoColor: COLORS.darkPanel,
    metallic: 0.9,
    roughness: 0.1
  })

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

// Info panel background
const infoPanelBack = engine.addEntity()
Transform.create(infoPanelBack, {
  position: Vector3.create(8, 2.5, 14),
  scale: Vector3.create(6, 4, 0.1)
})
MeshRenderer.setBox(infoPanelBack)
MeshCollider.setBox(infoPanelBack)
Material.setPbrMaterial(infoPanelBack, {
  albedoColor: COLORS.darkPanel,
  metallic: 0.8,
  roughness: 0.2
})

// Info panel frame
const infoPanelFrame = engine.addEntity()
Transform.create(infoPanelFrame, {
  position: Vector3.create(8, 2.5, 14.1),
  scale: Vector3.create(6.2, 4.2, 0.05)
})
MeshRenderer.setBox(infoPanelFrame)
Material.setPbrMaterial(infoPanelFrame, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

// Info title
const infoTitle = engine.addEntity()
Transform.create(infoTitle, {
  position: Vector3.create(8, 4, 13.8),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
TextShape.create(infoTitle, {
  text: staticTV.isLite ? 'KNOW YOUR AUDIENCE' : 'FULL MODE FEATURES',
  fontSize: 2.5,
  textColor: COLORS.cyan,
  width: 20,
  height: 2
})

// Info content
const infoContent = engine.addEntity()
Transform.create(infoContent, {
  position: Vector3.create(8, 2.5, 13.8),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
TextShape.create(infoContent, {
  text: staticTV.isLite
    ? 'See who visits your scene LIVE\nTrack new vs returning visitors\nMeasure engagement & dwell time\nAll data in your dashboard'
    : 'Channel Guide UI - Browse streams\nReal-time Chat - Talk to viewers\nWatch Metrics - Track engagement\nClick GUIDE or CHAT to try!',
  fontSize: 1.6,
  textColor: COLORS.white,
  width: 20,
  height: 4
})

// Info footer
const infoFooter = engine.addEntity()
Transform.create(infoFooter, {
  position: Vector3.create(8, 1.2, 13.8),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
TextShape.create(infoFooter, {
  text: 'Click buttons below to get started!',
  fontSize: 1.4,
  textColor: COLORS.white,
  width: 20,
  height: 2
})

// ============================================
// CLICKABLE LINK BUTTONS
// ============================================

// Dashboard button
const dashboardButton = engine.addEntity()
Transform.create(dashboardButton, {
  position: Vector3.create(6.5, 0.6, 13.85),
  scale: Vector3.create(2.5, 0.6, 0.1)
})
MeshRenderer.setBox(dashboardButton)
MeshCollider.setBox(dashboardButton)
Material.setPbrMaterial(dashboardButton, {
  albedoColor: COLORS.green,
  emissiveColor: COLORS.greenGlow,
  emissiveIntensity: 2
})

const dashboardButtonText = engine.addEntity()
Transform.create(dashboardButtonText, {
  position: Vector3.create(6.5, 0.6, 13.7),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
TextShape.create(dashboardButtonText, {
  text: 'FREE TRIAL',
  fontSize: 1.5,
  textColor: COLORS.darkPanel,
  width: 10,
  height: 2
})

pointerEventsSystem.onPointerDown(
  { entity: dashboardButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Open thestatic.tv' } },
  () => {
    openExternalUrl({ url: LINKS.dashboard })
  }
)

// GitHub button
const githubButton = engine.addEntity()
Transform.create(githubButton, {
  position: Vector3.create(9.5, 0.6, 13.85),
  scale: Vector3.create(2.5, 0.6, 0.1)
})
MeshRenderer.setBox(githubButton)
MeshCollider.setBox(githubButton)
Material.setPbrMaterial(githubButton, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

const githubButtonText = engine.addEntity()
Transform.create(githubButtonText, {
  position: Vector3.create(9.5, 0.6, 13.7),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
TextShape.create(githubButtonText, {
  text: 'GET CODE',
  fontSize: 1.5,
  textColor: COLORS.darkPanel,
  width: 10,
  height: 2
})

pointerEventsSystem.onPointerDown(
  { entity: githubButton, opts: { button: InputAction.IA_POINTER, hoverText: 'View on GitHub' } },
  () => {
    openExternalUrl({ url: LINKS.github })
  }
)

// ============================================
// STATS PANEL (Left side)
// ============================================

// Stats panel background
const statsPanelBack = engine.addEntity()
Transform.create(statsPanelBack, {
  position: Vector3.create(2, 2.5, 8),
  scale: Vector3.create(0.1, 3, 4),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
MeshRenderer.setBox(statsPanelBack)
MeshCollider.setBox(statsPanelBack)
Material.setPbrMaterial(statsPanelBack, {
  albedoColor: COLORS.darkPanel,
  metallic: 0.8,
  roughness: 0.2
})

// Stats panel frame
const statsPanelFrame = engine.addEntity()
Transform.create(statsPanelFrame, {
  position: Vector3.create(1.9, 2.5, 8),
  scale: Vector3.create(0.05, 3.2, 4.2),
  rotation: Quaternion.fromEulerDegrees(0, 0, 0)
})
MeshRenderer.setBox(statsPanelFrame)
Material.setPbrMaterial(statsPanelFrame, {
  albedoColor: COLORS.cyan,
  emissiveColor: COLORS.cyanGlow,
  emissiveIntensity: 2
})

// Stats title
const statsTitle = engine.addEntity()
Transform.create(statsTitle, {
  position: Vector3.create(2.2, 3.5, 8),
  rotation: Quaternion.fromEulerDegrees(0, 270, 0)
})
TextShape.create(statsTitle, {
  text: 'TODAY\'S STATS',
  fontSize: 2,
  textColor: COLORS.cyan,
  width: 20,
  height: 2
})

// Visitors count text
const visitorsText = engine.addEntity()
Transform.create(visitorsText, {
  position: Vector3.create(2.2, 2.8, 8),
  rotation: Quaternion.fromEulerDegrees(0, 270, 0)
})
TextShape.create(visitorsText, {
  text: 'Visitors: --',
  fontSize: 1.8,
  textColor: COLORS.white,
  width: 20,
  height: 2
})

// Sessions count text
const sessionsText = engine.addEntity()
Transform.create(sessionsText, {
  position: Vector3.create(2.2, 2.2, 8),
  rotation: Quaternion.fromEulerDegrees(0, 270, 0)
})
TextShape.create(sessionsText, {
  text: 'Sessions: --',
  fontSize: 1.8,
  textColor: COLORS.white,
  width: 20,
  height: 2
})

// Your visitor number text
const visitorNumText = engine.addEntity()
Transform.create(visitorNumText, {
  position: Vector3.create(2.2, 1.5, 8),
  rotation: Quaternion.fromEulerDegrees(0, 270, 0)
})
TextShape.create(visitorNumText, {
  text: 'You are visitor #--',
  fontSize: 1.5,
  textColor: COLORS.green,
  width: 20,
  height: 2
})

// ============================================
// ANIMATION SYSTEM
// ============================================

let time = 0
let sessionTime = 0
let lastTimerUpdate = 0
let lastStatsFetch = 0
let statsFetched = false

engine.addSystem((dt: number) => {
  time += dt

  // Track session time when active
  if (staticTV.session?.isSessionActive()) {
    sessionTime += dt
  }

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

  // Update status and timer (throttle to every 0.5 seconds)
  if (time - lastTimerUpdate > 0.5) {
    lastTimerUpdate = time
    updateStatus()
    updateTimer()
  }

  // Fetch stats once session is active, then every 30 seconds
  if (staticTV.session?.isSessionActive() && (time - lastStatsFetch > 30 || !statsFetched)) {
    lastStatsFetch = time
    statsFetched = true
    fetchAndDisplayStats()
  }
})

// ============================================
// STATUS UPDATE
// ============================================

function updateStatus() {
  const isActive = staticTV.session?.isSessionActive() ?? false

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

function updateTimer() {
  const minutes = Math.floor(sessionTime / 60)
  const seconds = Math.floor(sessionTime % 60)
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const mutableTimer = TextShape.getMutable(timerText)
  mutableTimer.text = `TIME: ${timeStr}`
}

async function fetchAndDisplayStats() {
  if (!staticTV.session) return
  try {
    const stats = await staticTV.session.getStats()
    if (stats) {
      // Update visitors text
      const mutableVisitors = TextShape.getMutable(visitorsText)
      mutableVisitors.text = `Visitors: ${stats.uniqueVisitors}`

      // Update sessions text
      const mutableSessions = TextShape.getMutable(sessionsText)
      mutableSessions.text = `Sessions: ${stats.totalSessions}`

      // Update visitor number
      const mutableVisitorNum = TextShape.getMutable(visitorNumText)
      if (stats.visitorNumber) {
        mutableVisitorNum.text = `You are visitor #${stats.visitorNumber}`
        mutableVisitorNum.textColor = COLORS.green
      } else if (stats.isFirstVisitor) {
        mutableVisitorNum.text = 'You are the first visitor!'
        mutableVisitorNum.textColor = COLORS.cyan
      } else {
        mutableVisitorNum.text = 'Welcome!'
        mutableVisitorNum.textColor = COLORS.white
      }
    }
  } catch (error) {
    console.log('[thestatic.tv] Failed to fetch stats')
  }
}

// ============================================
// INITIALIZATION
// ============================================

console.log('='.repeat(50))
console.log('[thestatic.tv] Example Scene Loaded')
console.log('[thestatic.tv] SDK Mode:', staticTV.isLite ? 'LITE' : 'FULL')
console.log('[thestatic.tv] Key Type:', staticTV.keyType)
if (!staticTV.isLite) {
  console.log('[thestatic.tv] Guide UI: Available (click GUIDE button)')
  console.log('[thestatic.tv] Chat UI: Available (click CHAT button)')
}
console.log('[thestatic.tv] Get your key: https://thestatic.tv/dashboard')
console.log('='.repeat(50))

export {}

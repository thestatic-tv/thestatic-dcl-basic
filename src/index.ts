/**
 * ============================================================================
 * thestatic.tv DCL SDK - STARTER EXAMPLE
 * ============================================================================
 *
 * This example shows how to integrate @thestatic-tv/dcl-sdk into your scene.
 *
 * WHAT'S REQUIRED FOR SDK (marked with "// >>> REQUIRED"):
 *   1. Import StaticTVClient and GuideVideo
 *   2. Create a video screen entity
 *   3. Handle video selection callback
 *   4. Initialize the StaticTV client with your API key
 *   5. Initialize UI modules
 *   6. Render UI components with ReactEcsRenderer
 *
 * WHAT'S DEMO ONLY (marked with "// --- DEMO"):
 *   Everything else! The fancy scene, animations, stats panel, etc.
 *   You don't need any of that - integrate the SDK into YOUR scene.
 *
 * Get your API key at: https://thestatic.tv/dashboard
 * Documentation: https://github.com/thestatic-tv/dcl-sdk
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
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/players'
import { openExternalUrl } from '~system/RestrictedActions'

// >>> REQUIRED: Import the SDK
import { StaticTVClient, GuideVideo } from '@thestatic-tv/dcl-sdk'
import { _fallback } from './demo-config'


// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                                                                           ║
// ║   >>> ENTER YOUR API KEY BELOW <<<                                        ║
// ║                                                                           ║
// ║   Get your key at: https://thestatic.tv/dashboard                         ║
// ║                                                                           ║
// ║   Key types (all start with dcls_):                                       ║
// ║     - Lite: Visitor tracking only                                         ║
// ║     - Full: Guide UI, Chat UI, heartbeat, interactions                    ║
// ║                                                                           ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

const YOUR_API_KEY = ''  // <========== PASTE YOUR KEY HERE

// For local development, set to true
const IS_LOCAL = false


// ============================================================================
// >>> REQUIRED: VIDEO SCREEN ENTITY
// ============================================================================
// You need a video screen to display content from the guide
const videoScreen = engine.addEntity()
const videoScreenFrame = engine.addEntity()  // --- DEMO: decorative frame
const videoScreenLabel = engine.addEntity()  // --- DEMO: label below screen


// ============================================================================
// >>> REQUIRED: HANDLE VIDEO SELECTION
// ============================================================================
// This callback is triggered when a user selects a video from the Guide UI
function handleVideoSelect(video: GuideVideo) {
  console.log('[thestatic.tv] Video selected:', video.name)

  // >>> REQUIRED: Update the video player with selected stream
  VideoPlayer.createOrReplace(videoScreen, {
    src: video.src,
    playing: true,
    loop: true,
    volume: 0.8
  })

  // >>> REQUIRED: Apply video texture to screen
  Material.setPbrMaterial(videoScreen, {
    texture: Material.Texture.Video({ videoPlayerEntity: videoScreen }),
    roughness: 1.0,
    metallic: 0,
    emissiveColor: Color4.White(),
    emissiveIntensity: 0.5,
    emissiveTexture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
  })

  // --- DEMO: Update label with video name
  TextShape.getMutable(videoScreenLabel).text = video.name

  // >>> REQUIRED: Tell guide which video is playing (shows "PLAYING" badge)
  if (staticTV.guideUI) {
    staticTV.guideUI.currentVideoId = video.id
  }

  // OPTIONAL: Track watch time analytics
  if (staticTV.heartbeat && video.channelId) {
    staticTV.heartbeat.startWatching(video.channelId)
  }
}


// ============================================================================
// >>> REQUIRED: INITIALIZE THE SDK CLIENT
// ============================================================================
const player = getPlayer()
const API_KEY = YOUR_API_KEY || _fallback()

const staticTV = new StaticTVClient({
  apiKey: API_KEY,
  baseUrl: IS_LOCAL ? 'http://localhost:3000/api/v1/dcl' : undefined,
  debug: true, // Set false in production
  player: {
    wallet: player?.userId,
    name: player?.name
  },
  // >>> REQUIRED: Configure Guide UI with your video select handler
  guideUI: {
    onVideoSelect: handleVideoSelect
  },
  // OPTIONAL: Configure Chat UI
  chatUI: {
    fontScale: 1.0
  }
})


// ============================================================================
// >>> REQUIRED: INITIALIZE UI MODULES
// ============================================================================
// Wait for server to confirm subscription, then init Guide & Chat
async function initializeUI() {
  // Wait for session to determine if Full or Lite
  let attempts = 0
  while (staticTV.isLite && attempts < 20) {
    await new Promise(resolve => setTimeout(resolve, 500))
    attempts++
  }

  // Init Guide (Full subscription only)
  if (staticTV.guideUI) {
    await staticTV.guideUI.init()
    console.log('[thestatic.tv] Guide UI ready')
  }

  // Init Chat (Full subscription only)
  if (staticTV.chatUI) {
    await staticTV.chatUI.init()
    console.log('[thestatic.tv] Chat UI ready')
  }

  // --- DEMO: Update scene text based on mode
  if (!staticTV.isLite) {
    updateUIForFullMode()
    console.log('[thestatic.tv] Mode: FULL - Guide & Chat enabled')
  } else {
    console.log('[thestatic.tv] Mode: LITE - Visitor tracking only')
  }
}

initializeUI()


// ============================================================================
// >>> REQUIRED: RENDER UI COMPONENTS
// ============================================================================
// This renders the Guide and Chat toggle buttons and panels
// For Lite mode (example only), we show grayed out upgrade buttons

// --- DEMO: Track upgrade prompt state for Lite mode buttons
let showGuideUpgradePrompt = false
let showChatUpgradePrompt = false

// --- DEMO: Grayed out Guide button for Lite mode
function renderLiteGuideButton() {
  if (showGuideUpgradePrompt) {
    return ReactEcs.createElement(UiEntity, {
      uiTransform: {
        positionType: 'absolute',
        position: { right: 20, bottom: 60 },
        width: 280,
        height: 120,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
      },
      uiBackground: { color: Color4.create(0.05, 0.05, 0.08, 0.95) },
      children: [
        ReactEcs.createElement(UiEntity, {
          uiText: { value: 'GUIDE requires Full subscription', fontSize: 14, color: Color4.White() },
          uiTransform: { marginBottom: 10 },
        }),
        ReactEcs.createElement(UiEntity, {
          uiTransform: { width: 200, height: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
          uiBackground: { color: COLORS.cyan },
          onMouseDown: () => { openExternalUrl({ url: LINKS.dashboard }); showGuideUpgradePrompt = false },
          children: [ReactEcs.createElement(UiEntity, { uiText: { value: 'UPGRADE NOW', fontSize: 14, color: Color4.Black() } })],
        }),
        ReactEcs.createElement(UiEntity, {
          uiTransform: { width: 200, height: 25, justifyContent: 'center', alignItems: 'center' },
          onMouseDown: () => { showGuideUpgradePrompt = false },
          children: [ReactEcs.createElement(UiEntity, { uiText: { value: 'Close', fontSize: 12, color: Color4.Gray() } })],
        }),
      ],
    })
  }
  return ReactEcs.createElement(UiEntity, {
    uiTransform: { positionType: 'absolute', position: { right: 130, bottom: 10 }, width: 100, height: 45, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
    uiBackground: { color: Color4.create(0.3, 0.3, 0.3, 0.7) },
    onMouseDown: () => { showGuideUpgradePrompt = true },
    children: [
      ReactEcs.createElement(UiEntity, { uiText: { value: 'GUIDE', fontSize: 14, color: Color4.create(0.6, 0.6, 0.6, 1) } }),
      ReactEcs.createElement(UiEntity, { uiText: { value: 'FULL ONLY', fontSize: 9, color: Color4.create(0.5, 0.5, 0.5, 1) } }),
    ],
  })
}

// --- DEMO: Grayed out Chat button for Lite mode
function renderLiteChatButton() {
  if (showChatUpgradePrompt) {
    return ReactEcs.createElement(UiEntity, {
      uiTransform: {
        positionType: 'absolute',
        position: { right: 20, bottom: 60 },
        width: 280,
        height: 120,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
      },
      uiBackground: { color: Color4.create(0.05, 0.05, 0.08, 0.95) },
      children: [
        ReactEcs.createElement(UiEntity, {
          uiText: { value: 'CHAT requires Full subscription', fontSize: 14, color: Color4.White() },
          uiTransform: { marginBottom: 10 },
        }),
        ReactEcs.createElement(UiEntity, {
          uiTransform: { width: 200, height: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
          uiBackground: { color: COLORS.cyan },
          onMouseDown: () => { openExternalUrl({ url: LINKS.dashboard }); showChatUpgradePrompt = false },
          children: [ReactEcs.createElement(UiEntity, { uiText: { value: 'UPGRADE NOW', fontSize: 14, color: Color4.Black() } })],
        }),
        ReactEcs.createElement(UiEntity, {
          uiTransform: { width: 200, height: 25, justifyContent: 'center', alignItems: 'center' },
          onMouseDown: () => { showChatUpgradePrompt = false },
          children: [ReactEcs.createElement(UiEntity, { uiText: { value: 'Close', fontSize: 12, color: Color4.Gray() } })],
        }),
      ],
    })
  }
  return ReactEcs.createElement(UiEntity, {
    uiTransform: { positionType: 'absolute', position: { right: 20, bottom: 10 }, width: 100, height: 45, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
    uiBackground: { color: Color4.create(0.3, 0.3, 0.3, 0.7) },
    onMouseDown: () => { showChatUpgradePrompt = true },
    children: [
      ReactEcs.createElement(UiEntity, { uiText: { value: 'CHAT', fontSize: 14, color: Color4.create(0.6, 0.6, 0.6, 1) } }),
      ReactEcs.createElement(UiEntity, { uiText: { value: 'FULL ONLY', fontSize: 9, color: Color4.create(0.5, 0.5, 0.5, 1) } }),
    ],
  })
}

ReactEcsRenderer.setUiRenderer(() => {
  // Full mode: use SDK components
  if (!staticTV.isLite) {
    return ReactEcs.createElement(UiEntity, {
      uiTransform: { width: '100%', height: '100%', positionType: 'absolute' },
      children: [
        staticTV.guideUI?.getComponent(),
        staticTV.chatUI?.getComponent()
      ].filter(Boolean)
    })
  }

  // Lite mode: show grayed out upgrade buttons (DEMO for this example only)
  return ReactEcs.createElement(UiEntity, {
    uiTransform: { width: '100%', height: '100%', positionType: 'absolute' },
    children: [
      renderLiteGuideButton(),
      renderLiteChatButton()
    ]
  })
})


// ============================================================================
// --- DEMO ONLY: Everything below is just for this example scene
// ============================================================================
// You don't need any of this! Just integrate the SDK code above into YOUR scene.

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

// --- DEMO: Floor
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

// --- DEMO: Welcome Sign
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

const subtitleText = engine.addEntity()
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

// --- DEMO: Info Panel
const infoPanelBack = engine.addEntity()
Transform.create(infoPanelBack, {
  position: Vector3.create(8, 2.5, 14),
  scale: Vector3.create(6, 4, 0.1)
})
MeshRenderer.setBox(infoPanelBack)
MeshCollider.setBox(infoPanelBack)
Material.setPbrMaterial(infoPanelBack, { albedoColor: COLORS.darkPanel })

const infoTitle = engine.addEntity()
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

const infoContent = engine.addEntity()
Transform.create(infoContent, {
  position: Vector3.create(8, 2.5, 13.8)
})
TextShape.create(infoContent, {
  text: 'See who visits your scene LIVE\nTrack new vs returning visitors\nMeasure engagement & dwell time\nAll data in your dashboard',
  fontSize: 1.6,
  textColor: COLORS.white,
  width: 20
})

// --- DEMO: Buttons
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

// --- DEMO: Video Screen Setup (Right side wall)
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

// >>> REQUIRED: Position your video screen (this is the important part!)
Transform.create(videoScreen, {
  position: Vector3.create(13.85, 3, 8),
  scale: Vector3.create(7.2, 4.05, 1),  // 16:9 aspect ratio
  rotation: Quaternion.fromEulerDegrees(0, 90, 0)
})
MeshRenderer.setPlane(videoScreen)
MeshCollider.setPlane(videoScreen)

// Play a default video until user selects from guide
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

// --- DEMO: Video label
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

// --- DEMO: Update UI for Full mode
function updateUIForFullMode() {
  TextShape.getMutable(subtitleText).text = 'Full Mode - Guide & Chat Available'
  TextShape.getMutable(infoTitle).text = 'FULL MODE FEATURES'
  TextShape.getMutable(infoContent).text = 'Channel Guide UI - Browse streams\nReal-time Chat - Talk to viewers\nWatch Metrics - Track engagement\nClick GUIDE or CHAT to try!'
}


// ============================================================================
// DONE! The SDK integration is complete.
// ============================================================================
//
// Summary - What you need to copy to YOUR scene:
//
// 1. Import: StaticTVClient, GuideVideo from '@thestatic-tv/dcl-sdk'
// 2. Create video screen entity
// 3. Define handleVideoSelect function
// 4. Initialize StaticTVClient with your API key
// 5. Call initializeUI()
// 6. Add ReactEcsRenderer.setUiRenderer() for Guide/Chat UI
//
// That's it! Everything else in this file is demo decoration.

console.log('='.repeat(50))
console.log('[thestatic.tv] Example Scene Loaded')
console.log('[thestatic.tv] Key Type:', staticTV.keyType)
console.log('[thestatic.tv] Get your key: https://thestatic.tv/dashboard')
console.log('='.repeat(50))

export {}

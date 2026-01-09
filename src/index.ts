/**
 * thestatic.tv DCL SDK - Minimal Example
 *
 * This is a clean, minimal setup matching the FAQ docs.
 * See demo-scene.ts for the full demo with video player, scene objects, etc.
 *
 * Get your API key at: https://thestatic.tv/dashboard
 */

import {} from '@dcl/sdk/math'
import { engine, Material, VideoPlayer, TextShape } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { openExternalUrl } from '~system/RestrictedActions'
import { StaticTVClient, GuideVideo } from '@thestatic-tv/dcl-sdk'

// Demo scene with floor, video screen, signs, metrics board
import {
  resolveKey,
  videoScreen,
  videoScreenLabel,
  updateUIForFullMode,
  COLORS,
  LINKS,
  // Metrics board entities (comment out if section disabled in demo-scene.ts)
  statusValue,
  statusOrb,
  modeValue,
  timeValue,
  watchValue,
  channelValue,
  topEarnerValue,
  topChannelValue,
  newCitizensValue,
  topSupportersValue
} from './demo-scene'

let staticTV: StaticTVClient

// Track upgrade prompt state for Lite mode buttons
let showGuideUpgradePrompt = false
let showChatUpgradePrompt = false

// Handle video selection from Guide UI
function handleVideoSelect(video: GuideVideo) {
  console.log('[thestatic.tv] Video selected:', video.name)

  VideoPlayer.createOrReplace(videoScreen, {
    src: video.src,
    playing: true,
    loop: true,
    volume: 0.8
  })

  Material.setPbrMaterial(videoScreen, {
    texture: Material.Texture.Video({ videoPlayerEntity: videoScreen }),
    roughness: 1.0,
    metallic: 0,
    emissiveColor: Color4.White(),
    emissiveIntensity: 0.5,
    emissiveTexture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
  })

  TextShape.getMutable(videoScreenLabel).text = video.name

  // Update metrics board with channel name
  setCurrentChannel(video.name)

  if (staticTV.guideUI) {
    staticTV.guideUI.currentVideoId = video.id
  }

  if (staticTV.heartbeat && video.channelId) {
    staticTV.heartbeat.startWatching(video.channelId)
  }
}

export function main() {
  staticTV = new StaticTVClient({
    apiKey: resolveKey('dcls_your_key_here'),  // Get from dashboard
    debug: true,
    guideUI: { onVideoSelect: handleVideoSelect },
    chatUI: { fontScale: 1.0 }
  })

  // Enable Pro features (Admin Panel)
  staticTV.enableProFeatures({
    sceneId: 'thestatic-dcl-example',  // Your scene ID
    title: 'EXAMPLE ADMIN',
    debug: true,
    onVideoPlay: (url) => {
      console.log('[Admin] Play video:', url)
      VideoPlayer.createOrReplace(videoScreen, { src: url, playing: true, loop: true, volume: 0.8 })
      Material.setPbrMaterial(videoScreen, {
        texture: Material.Texture.Video({ videoPlayerEntity: videoScreen }),
        roughness: 1.0, metallic: 0,
        emissiveColor: Color4.White(), emissiveIntensity: 0.5,
        emissiveTexture: Material.Texture.Video({ videoPlayerEntity: videoScreen })
      })
    },
    onVideoStop: () => {
      console.log('[Admin] Stop video')
      VideoPlayer.deleteFrom(videoScreen)
    },
    onBroadcast: (text) => {
      console.log('[Admin] Broadcast:', text)
    }
  })

  // Init UI modules (Standard/Pro tier only)
  async function initUI() {
    // Wait for session to determine tier
    // Note: isLite is deprecated, use isFree after SDK 2.3.0
    let attempts = 0
    while (staticTV.isLite && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 500))
      attempts++
    }

    if (staticTV.guideUI) {
      await staticTV.guideUI.init()
      console.log('[thestatic.tv] Guide UI ready')
    }
    if (staticTV.chatUI) {
      await staticTV.chatUI.init()
      console.log('[thestatic.tv] Chat UI ready')
    }

    if (!staticTV.isLite) {
      updateUIForFullMode()
      console.log('[thestatic.tv] Standard/Pro tier - Guide & Chat enabled')
    } else {
      console.log('[thestatic.tv] Free tier - Visitor tracking only')
    }
  }
  initUI()

  console.log('[thestatic.tv] SDK initialized')
}

// ============================================================================
// METRICS BOARD UPDATE SYSTEM
// ============================================================================
let sessionTime = 0
let watchTime = 0
let lastMetricsUpdate = 0
let lastLeaderboardUpdate = 0
let displayChannelName = 'None'

// Leaderboard API endpoint (same as m1d-hq-lifted)
const LEADERBOARD_API = 'https://thestatic.tv/api/dcl/leaderboard'
const LEADERBOARD_REFRESH = 60 // seconds

// Track channel name for display (called when video selected)
export function setCurrentChannel(name: string) {
  displayChannelName = name
  watchTime = 0 // Reset watch time when changing channel
}

// Fetch leaderboard data (4 types: earners, channels, citizens, tippers)
async function fetchLeaderboard(type: 'earners' | 'channels' | 'citizens' | 'tippers', limit = 1) {
  try {
    const res = await fetch(`${LEADERBOARD_API}?type=${type}&limit=${limit}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.entries?.[0] || null
  } catch {
    return null
  }
}

// Update leaderboard displays
async function updateLeaderboards() {
  // Top earner (C2E) - gold
  if (topEarnerValue) {
    const earner = await fetchLeaderboard('earners')
    if (earner) {
      const name = earner.name.length > 10 ? earner.name.slice(0, 8) + '..' : earner.name
      TextShape.getMutable(topEarnerValue).text = `${name} (${earner.value})`
    }
  }

  // Top channel (most loved) - magenta
  if (topChannelValue) {
    const channel = await fetchLeaderboard('channels')
    if (channel) {
      const name = channel.name.length > 10 ? channel.name.slice(0, 8) + '..' : channel.name
      TextShape.getMutable(topChannelValue).text = `${name}`
    }
  }

  // Newest citizen - green
  if (newCitizensValue) {
    const citizen = await fetchLeaderboard('citizens')
    if (citizen) {
      const name = citizen.name.length > 12 ? citizen.name.slice(0, 10) + '..' : citizen.name
      TextShape.getMutable(newCitizensValue).text = `${name}`
    }
  }

  // Top supporter (tipper) - orange
  if (topSupportersValue) {
    const tipper = await fetchLeaderboard('tippers')
    if (tipper) {
      const name = tipper.name.length > 10 ? tipper.name.slice(0, 8) + '..' : tipper.name
      TextShape.getMutable(topSupportersValue).text = `${name} (${tipper.value})`
    }
  }
}

// Initial leaderboard fetch
updateLeaderboards()

engine.addSystem((dt: number) => {
  if (!staticTV) return

  // Track session time when active
  if (staticTV.session?.isSessionActive()) {
    sessionTime += dt
  }

  // Track watch time when heartbeat is active
  if (staticTV.heartbeat?.isCurrentlyWatching()) {
    watchTime += dt
  }

  // Refresh leaderboards periodically
  lastLeaderboardUpdate += dt
  if (lastLeaderboardUpdate > LEADERBOARD_REFRESH) {
    lastLeaderboardUpdate = 0
    updateLeaderboards()
  }

  // Update metrics every 0.5s to avoid too frequent updates
  lastMetricsUpdate += dt
  if (lastMetricsUpdate < 0.5) return
  lastMetricsUpdate = 0

  const isActive = staticTV.session?.isSessionActive() ?? false
  const isWatching = staticTV.heartbeat?.isCurrentlyWatching() ?? false

  // Update status (if section enabled)
  if (statusValue) {
    const statusText = TextShape.getMutable(statusValue)
    statusText.text = isActive ? 'ACTIVE' : 'OFFLINE'
    statusText.textColor = isActive ? COLORS.green : COLORS.red
  }

  // Update status orb color (if section enabled)
  if (statusOrb) {
    Material.setPbrMaterial(statusOrb, {
      albedoColor: isActive ? COLORS.green : COLORS.red,
      emissiveColor: isActive ? COLORS.greenGlow : COLORS.redGlow,
      emissiveIntensity: 4
    })
  }

  // Update SDK mode (if section enabled)
  if (modeValue) {
    const modeText = TextShape.getMutable(modeValue)
    modeText.text = staticTV.isLite ? 'LITE' : 'FULL'
    modeText.textColor = staticTV.isLite ? COLORS.yellow : COLORS.cyan
  }

  // Update session time (if section enabled)
  if (timeValue) {
    const mins = Math.floor(sessionTime / 60)
    const secs = Math.floor(sessionTime % 60)
    TextShape.getMutable(timeValue).text = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Update watch time display (if section enabled)
  if (watchValue) {
    if (isWatching && watchTime > 0) {
      const wMins = Math.floor(watchTime / 60)
      const wSecs = Math.floor(watchTime % 60)
      const watchText = TextShape.getMutable(watchValue)
      watchText.text = `${wMins.toString().padStart(2, '0')}:${wSecs.toString().padStart(2, '0')}`
      watchText.textColor = COLORS.green // Green when actively earning
    } else {
      const watchText = TextShape.getMutable(watchValue)
      watchText.text = '--:--'
      watchText.textColor = COLORS.white
    }
  }

  // Update current channel (if section enabled)
  if (channelValue) {
    const channel = staticTV.heartbeat?.getCurrentChannel() || displayChannelName
    TextShape.getMutable(channelValue).text = channel === 'None' ? 'None' : channel
  }
})

// Grayed out Guide button for Lite mode
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

// Grayed out Chat button for Lite mode
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

// UI renderer (outside main - required by DCL)
ReactEcsRenderer.setUiRenderer(() => {
  if (!staticTV) return null

  // Full mode: use SDK components
  if (!staticTV.isLite) {
    return ReactEcs.createElement(UiEntity, {
      uiTransform: { width: '100%', height: '100%', positionType: 'absolute' },
      children: [
        staticTV.guideUI?.getComponent(),
        staticTV.chatUI?.getComponent(),
        staticTV.adminPanel?.getComponent()  // Admin Panel (Pro tier)
      ].filter(Boolean)
    })
  }

  // Lite mode: show grayed out upgrade buttons + admin panel (if Pro)
  return ReactEcs.createElement(UiEntity, {
    uiTransform: { width: '100%', height: '100%', positionType: 'absolute' },
    children: [
      renderLiteGuideButton(),
      renderLiteChatButton(),
      staticTV.adminPanel?.getComponent()  // Admin Panel works in Lite mode too
    ].filter(Boolean)
  })
})

console.log('='.repeat(50))
console.log('[thestatic.tv] Example Scene Loaded')
console.log('[thestatic.tv] Get your key: https://thestatic.tv/dashboard')
console.log('='.repeat(50))

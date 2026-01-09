/**
 * thestatic.tv DCL SDK - Basic Metrics Example
 *
 * Shows session tracking metrics in-scene:
 * - Connection status (active/inactive)
 * - Session time
 * - SDK tier
 *
 * Get your API key at: https://thestatic.tv/dashboard
 */

import { engine, TextShape, Material } from '@dcl/sdk/ecs'
import { StaticTVClient } from '@thestatic-tv/dcl-sdk'
import {
  resolveKey,
  statusValue,
  statusOrb,
  modeValue,
  timeValue,
  COLORS
} from './demo-scene'

let staticTV: StaticTVClient

export function main() {
  staticTV = new StaticTVClient({
    apiKey: resolveKey('dcls_your_key_here'),
    debug: true
  })

  console.log('[thestatic.tv] Basic metrics example loaded')
}

// ============================================================================
// METRICS UPDATE SYSTEM
// ============================================================================
let sessionTime = 0
let lastUpdate = 0

engine.addSystem((dt: number) => {
  if (!staticTV) return

  // Track session time when active
  if (staticTV.session?.isSessionActive()) {
    sessionTime += dt
  }

  // Throttle updates to every 0.5s
  lastUpdate += dt
  if (lastUpdate < 0.5) return
  lastUpdate = 0

  const isActive = staticTV.session?.isSessionActive() ?? false

  // Update status text
  if (statusValue) {
    const text = TextShape.getMutable(statusValue)
    text.text = isActive ? 'ACTIVE' : 'OFFLINE'
    text.textColor = isActive ? COLORS.green : COLORS.red
  }

  // Update status orb
  if (statusOrb) {
    Material.setPbrMaterial(statusOrb, {
      albedoColor: isActive ? COLORS.green : COLORS.red,
      emissiveColor: isActive ? COLORS.greenGlow : COLORS.redGlow,
      emissiveIntensity: 4
    })
  }

  // Update SDK mode
  if (modeValue) {
    const text = TextShape.getMutable(modeValue)
    text.text = staticTV.isLite ? 'FREE' : 'STANDARD'
    text.textColor = staticTV.isLite ? COLORS.yellow : COLORS.cyan
  }

  // Update session time
  if (timeValue) {
    const mins = Math.floor(sessionTime / 60)
    const secs = Math.floor(sessionTime % 60)
    TextShape.getMutable(timeValue).text = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
})

console.log('='.repeat(50))
console.log('[thestatic.tv] Basic Metrics Example')
console.log('[thestatic.tv] Get your key: https://thestatic.tv/dashboard')
console.log('='.repeat(50))

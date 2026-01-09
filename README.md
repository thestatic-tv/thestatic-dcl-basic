# TheStatic.tv DCL SDK - Starter Example

A minimal example scene demonstrating how to integrate [@thestatic-tv/dcl-sdk](https://www.npmjs.com/package/@thestatic-tv/dcl-sdk) into your Decentraland scene.

## Quick Start

### 1. Get Your API Key

Visit [thestatic.tv/dashboard](https://thestatic.tv/dashboard) to create your free API key.

**Key Types:**
| Type | Prefix | Features |
|------|--------|----------|
| **Lite** | `dcls_` | Visitor tracking, session analytics |
| **Full** | `dcls_` | Everything in Lite + Guide UI, Chat UI, heartbeat tracking, interactions |

### 2. Add Your Key

Open `src/index.ts` and replace the placeholder:

```typescript
staticTV = new StaticTVClient({
  apiKey: 'dcls_your_key_here'  // Replace with your key
})
```

### 3. Run the Scene

```bash
npm install
npm start
```

## Minimal Setup (Copy This!)

```typescript
import {} from '@dcl/sdk/math'
import { engine } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { StaticTVClient } from '@thestatic-tv/dcl-sdk'

let staticTV: StaticTVClient

export function main() {
  staticTV = new StaticTVClient({
    apiKey: 'dcls_your_key_here'  // Get from dashboard
  })

  // Init UI modules (Full mode only)
  async function initUI() {
    if (staticTV.guideUI) await staticTV.guideUI.init()
    if (staticTV.chatUI) await staticTV.chatUI.init()
  }
  initUI()
}

// UI renderer (outside main - required by DCL)
ReactEcsRenderer.setUiRenderer(() => {
  if (!staticTV) return null
  return ReactEcs.createElement(UiEntity, {
    uiTransform: { width: '100%', height: '100%', positionType: 'absolute' },
    children: [
      staticTV.guideUI?.getComponent(),
      staticTV.chatUI?.getComponent()
    ].filter(Boolean)
  })
})
```

## SDK Features

### Lite Mode
- **Session Tracking**: Automatic visitor counting
- **Analytics**: View stats on your dashboard
- **Zero UI**: Runs silently in the background

### Full Mode (Upgrade Required)
- **Guide UI**: Channel browser with live/scheduled content
- **Chat UI**: Real-time chat with other viewers
- **Heartbeat Tracking**: Know who's actually watching
- **Interactions**: Like/follow channels

## Project Structure

```
thestatic-dcl-example/
├── src/
│   ├── index.ts       # Main entry point (SDK setup)
│   └── demo-scene.ts  # Demo scene objects (optional)
├── scene.json         # Decentraland scene metadata
└── package.json       # Dependencies
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run locally in preview mode |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Decentraland |
| `npm run deploy:test` | Deploy to test world server |

## Resources

- [SDK Documentation](https://github.com/thestatic-tv/dcl-sdk)
- [Get API Key](https://thestatic.tv/dashboard)
- [TheStatic.tv](https://thestatic.tv)
- [Decentraland SDK Docs](https://docs.decentraland.org)

## Support

Questions? Issues? Visit [thestatic.tv](https://thestatic.tv) or open an issue on GitHub.

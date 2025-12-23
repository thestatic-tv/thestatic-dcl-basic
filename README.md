# TheStatic.tv DCL SDK - Starter Example

A complete example scene demonstrating how to integrate [@thestatic-tv/dcl-sdk](https://www.npmjs.com/package/@thestatic-tv/dcl-sdk) into your Decentraland scene.

## Quick Start

### 1. Get Your API Key

Visit [thestatic.tv/dashboard](https://thestatic.tv/dashboard) to create your free API key.

**Key Types:**
| Type | Prefix | Features |
|------|--------|----------|
| **Lite** | `dcls_` | Visitor tracking, session analytics |
| **Full** | `dcls_` | Everything in Lite + Guide UI, Chat UI, heartbeat tracking, interactions |

### 2. Add Your Key

Open `src/index.ts` and find the configuration section at the top:

```typescript
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║   >>> ENTER YOUR API KEY BELOW <<<                                        ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

const YOUR_API_KEY = ''  // <========== PASTE YOUR KEY HERE
```

### 3. Run the Scene

```bash
npm install
npm start
```

## What's in This Example

### Required SDK Code (Copy This!)

The example clearly marks what you need with `// >>> REQUIRED` comments:

1. **Import the SDK**
   ```typescript
   import { StaticTVClient, GuideVideo } from '@thestatic-tv/dcl-sdk'
   ```

2. **Create a Video Screen Entity**
   ```typescript
   const videoScreen = engine.addEntity()
   ```

3. **Handle Video Selection**
   ```typescript
   function handleVideoSelect(video: GuideVideo) {
     VideoPlayer.createOrReplace(videoScreen, {
       src: video.src,
       playing: true,
       loop: true,
       volume: 0.8
     })
   }
   ```

4. **Initialize the Client**
   ```typescript
   const staticTV = new StaticTVClient({
     apiKey: YOUR_API_KEY,
     debug: true,
     guideUI: { onVideoSelect: handleVideoSelect }
   })
   ```

5. **Render UI Components**
   ```typescript
   ReactEcsRenderer.setUiRenderer(() => {
     return ReactEcs.createElement(UiEntity, {
       children: [
         staticTV.guideUI?.getComponent(),
         staticTV.chatUI?.getComponent()
       ].filter(Boolean)
     })
   })
   ```

### Demo-Only Code (Skip This)

Everything marked with `// --- DEMO` is just for this example scene - the fancy visuals, animations, stats panel, etc. You don't need any of it for your own integration.

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
│   ├── index.ts        # Main scene file (SDK integration here)
│   └── demo-config.ts  # Internal demo configuration
├── scene.json          # Decentraland scene metadata
└── package.json        # Dependencies
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run locally in preview mode |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Decentraland |
| `npm run deploy:test` | Deploy to test world server |

## Local Development

For local API testing, set `IS_LOCAL = true` in `src/index.ts`:

```typescript
const IS_LOCAL = true  // Uses localhost:3000 API
```

## Resources

- [SDK Documentation](https://github.com/thestatic-tv/dcl-sdk)
- [Get API Key](https://thestatic.tv/dashboard)
- [TheStatic.tv](https://thestatic.tv)
- [Decentraland SDK Docs](https://docs.decentraland.org)

## Support

Questions? Issues? Visit [thestatic.tv](https://thestatic.tv) or open an issue on GitHub.

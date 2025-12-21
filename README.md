# thestatic.tv DCL SDK Example

A showcase Decentraland scene demonstrating visitor tracking with [@thestatic-tv/dcl-sdk](https://npmjs.com/package/@thestatic-tv/dcl-sdk).

![SDK Version](https://img.shields.io/npm/v/@thestatic-tv/dcl-sdk?label=SDK&color=00e5e5)
![DCL SDK](https://img.shields.io/badge/DCL%20SDK-7.x-blue)

## Features

- **Glowing Platform** - Cyan-accented floor with emissive edges
- **Animated Cubes** - Floating, rotating cubes around the scene
- **Live Status Indicator** - Real-time session tracking display
- **Corner Pillars** - Decorative pillars with glow caps
- **Billboard Info** - Auto-facing info panel

## Quick Start

### 1. Get Your Scene Key

1. Go to [thestatic.tv/dashboard](https://thestatic.tv/dashboard)
2. Sign in or create an account
3. Navigate to "DCL Scenes" tab
4. Generate a new Scene Key (starts with `dcls_`)
5. You get a **7-day free trial** automatically!

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your Key

Open `src/index.ts` and replace the placeholder:

```typescript
const SCENE_API_KEY = 'dcls_your_actual_key_here'
```

### 4. Run the Scene

```bash
npm start
```

The scene will open in your browser. You should see:
- The status orb turn **green** when connected
- "SESSION: ACTIVE" text
- Your visit tracked in your dashboard

## Scene Overview

```
┌─────────────────────────────┐
│  ○                       ○  │  ← Corner pillars with glow
│                             │
│     ╔═══════════════╗       │
│     ║ thestatic.tv  ║       │  ← Welcome sign
│     ║ Tracking...   ║       │
│     ╚═══════════════╝       │
│     ┌───────────────┐       │
│     │ ● SESSION:... │       │  ← Status panel
│     └───────────────┘       │
│  ◇                       ◇  │  ← Floating cubes
│         (spawn)             │
│  ◇         ↓             ◇  │
│                             │
│  ○                       ○  │
└─────────────────────────────┘
```

## SDK Usage

The scene uses the **Lite SDK** for visitor tracking:

```typescript
import { StaticTVClient } from '@thestatic-tv/dcl-sdk'

const staticTV = new StaticTVClient({
  apiKey: 'dcls_your_key_here',
  debug: true  // Shows console logs
})

// Session tracking starts automatically!
// Check session status:
staticTV.session.isSessionActive()  // true/false
```

## What Gets Tracked

When visitors enter your scene, the SDK automatically tracks:

- **Unique Visitors** - How many different wallets visited
- **Sessions** - Total visit count
- **Time Spent** - Minutes visitors spent in your scene

View your analytics at [thestatic.tv/dashboard](https://thestatic.tv/dashboard).

## SDK Tiers

| Feature | Lite ($5/mo) | Full ($10/mo) |
|---------|--------------|---------------|
| Session Tracking | ✅ | ✅ |
| Visitor Analytics | ✅ | ✅ |
| Video Streaming | ❌ | ✅ |
| Channel Guide | ❌ | ✅ |
| Interactions | ❌ | ✅ |

## Scene Key vs Channel Key

| Key Type | Prefix | Features | Who Can Use |
|----------|--------|----------|-------------|
| Scene Key | `dcls_` | Visitor tracking only | Everyone |
| Channel Key | `dclk_` | Full guide, video, interactions | Channel owners |

This example uses a **scene key** for basic visitor tracking. If you have a channel on thestatic.tv, you can use a **channel key** to add the full channel guide to your scene.

## File Structure

```
thestatic-dcl-example/
├── src/
│   └── index.ts      # Main scene code
├── scene.json        # DCL scene config
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── README.md
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run scene locally |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Decentraland |
| `npm run deploy:test` | Deploy to test world |

## Customization

### Change Colors

Edit the `COLORS` object in `src/index.ts`:

```typescript
const COLORS = {
  cyan: Color4.create(0, 0.9, 0.9, 1),
  // Add your brand colors...
}
```

### Add More Cubes

Add positions to the `cubePositions` array:

```typescript
const cubePositions = [
  { x: 3, z: 3 },
  { x: 13, z: 3 },
  // Add more...
]
```

## Troubleshooting

**"Invalid API key" error**
- Make sure you copied the full key including `dcls_` prefix
- Check that your key hasn't been revoked in your dashboard

**Session not tracking**
- Enable `debug: true` to see console logs
- Check browser console for errors
- Verify network requests to `thestatic.tv/api/v1/dcl/scene-session`

**Trial expired**
- After 7 days, upgrade to continue tracking
- Pricing: $5/mo (Lite) or $10/mo (Full)

## Links

- **SDK Package**: [npmjs.com/package/@thestatic-tv/dcl-sdk](https://npmjs.com/package/@thestatic-tv/dcl-sdk)
- **Dashboard**: [thestatic.tv/dashboard](https://thestatic.tv/dashboard)
- **SDK Source**: [github.com/thestatic-tv/dcl-sdk](https://github.com/thestatic-tv/dcl-sdk)

## License

MIT - Use this example as a starting point for your own scenes!

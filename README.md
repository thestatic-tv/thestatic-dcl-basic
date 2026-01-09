# TheStatic.tv DCL SDK - Basic Metrics Example

A minimal example showing visitor tracking and session metrics with [@thestatic-tv/dcl-sdk](https://www.npmjs.com/package/@thestatic-tv/dcl-sdk).

## What This Example Shows

- **Session Status** - Real-time connection indicator (ACTIVE/OFFLINE)
- **SDK Mode** - Shows FREE or STANDARD based on your key
- **Session Timer** - Tracks time spent in scene
- **In-Scene Display** - Metrics board updates live

This is the simplest integration - just tracking, no UI features.

## Quick Start

```bash
npm install
npm start
```

## Add Your Key

Open `src/index.ts` and replace the placeholder:

```typescript
staticTV = new StaticTVClient({
  apiKey: 'dcls_your_key_here'  // Get from thestatic.tv/dashboard
})
```

## How It Works

```typescript
import { StaticTVClient } from '@thestatic-tv/dcl-sdk'

let staticTV: StaticTVClient

export function main() {
  staticTV = new StaticTVClient({
    apiKey: 'dcls_your_key_here',
    debug: true
  })
}

// Check session status anywhere in your code
engine.addSystem((dt: number) => {
  const isActive = staticTV.session?.isSessionActive() ?? false
  // Update your scene based on connection status
})
```

## Project Structure

```
thestatic-dcl-basic/
├── src/
│   ├── index.ts       # SDK setup and metrics system
│   └── demo-scene.ts  # Scene visuals (floor, signs, metrics board)
├── scene.json         # Scene metadata
└── package.json       # Dependencies
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run locally in preview mode |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to Decentraland |
| `npm run deploy:test` | Deploy to test world server |

## Want More Features?

Check out these other examples:

| Example | Features |
|---------|----------|
| **[Starter](https://github.com/thestatic-tv/thestatic-dcl-starter)** | Template for new projects |
| **[Popup](https://github.com/thestatic-tv/thestatic-dcl-popup)** | Full showcase with video, Guide UI, Chat |

## Resources

- [Get API Key](https://thestatic.tv/dashboard)
- [SDK Documentation](https://github.com/thestatic-tv/dcl-sdk)
- [TheStatic.tv](https://thestatic.tv)

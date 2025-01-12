# Stylish Extension

React based Chrome Extensions

## Featured

### Spec

- Typescript
- Webpack
- React
- Tailwind
- ESLint
- Prettier

### Popup

Implemented with `React`

`src/popup/App.tsx`

### Content Script

`src/scripts/content.ts`

### Service worker

`src/scripts/background.ts`

## Get Started

### Install Dependencies

```bash
# or yarn, pnpm
npm install
```

### First build

#### 1. execute build script

```bash
npm run build 
```

bundled in the `dist` directory

#### 2. Load unpacked

Open [`chrome://extensions/`](chrome://extensions/) and turn on `Developer mode`

Upload the `project-root/dist` path by pressing the `Load unpacked` button

### Develop

Run the following script to automatically bundle content whenever it changes.

```bash
npm run dev
```

After making changes, the popup must be refreshed or reopened

# Silamedia Interactiview

Modern embed builder for assembling interviews from timestamped fragments of already published YouTube videos.

## What it does

- Builds a structured interview from YouTube URLs hosted by any public channel.
- Lets an editor define each answer fragment with a start and end timestamp.
- Generates a copy-paste embed snippet for a website.
- Plays each selected fragment through the YouTube IFrame Player API and pauses at the configured end timestamp.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The generated editor app and widget bundle are written to `dist/`.

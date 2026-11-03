# MeguBoom

**Personal music & audiobook player for Windows and Android.**

[Русский](README.ru.md) · [English user guide](docs/en/USER_GUIDE.md) · [Русская инструкция](docs/ru/USER_GUIDE.md)

Windows **0.6.1** · Android source **0.4.1**. The application interface is currently Russian; this repository includes English and Russian documentation.

- Windows: local files, Google Drive streaming, folders, list/grid, search, favorites, playlist and queue.
- Android: one configured Google Drive folder and its descendants, music/books/unclassified views, verified offline downloads.
- Resume positions and completed status synchronize through Google Drive appDataFolder. Offline edits persist; a remote pull never seeks an actively playing track.
- Speed, sleep timer, short seeks, mini/full players, Android media notification.

## Getting started

Download the public Windows installer from [Releases](https://github.com/q9605514048-prog/MeguBoom/releases), or build from source with Node.js22+ on Windows:

```powershell
npm ci
npm test
npm start
npm run build:win
```

See the **[step-by-step guide](docs/en/USER_GUIDE.md)** for Google Cloud setup, Android builds, folder selection, synchronization, everyday use and troubleshooting. Instructions are external documentation, not extra screens inside the app.

## Public edition

This export contains no personal library, audio, account tokens, OAuth configuration, Android signing keys or private Drive folder IDs. It uses an original neutral icon. Metadata and covers may be absent until provided by your own files or supported lookup. The Android source must be configured for your folder and registered with your own Google Cloud project; a ready-to-use Android APK is not part of this public release.

Google sign-in and cross-device cloud operation require the same account/project and explicit consent on both devices. A real physical-phone/PC cloud round trip still needs user validation after consent. Tests use isolated fixtures. See [verification](docs/en/VERIFICATION.md).

Source available under the terms in [LICENSE](LICENSE); third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). No music or audiobooks are distributed.

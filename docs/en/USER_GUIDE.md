# MeguBoom: installation and everyday use

[Русская инструкция](../ru/USER_GUIDE.md) · [Project](../../README.md)

## 1. Choose a version

Windows: download the MeguBoom-Public-Setup installer from Releases and run it. The public edition has a neutral original icon and an empty catalogue. It can also be started from source (section7).

Android: this public release provides source, not a preconfigured APK. Android Google authorization binds your package and signing certificate to your Google Cloud project. Build with your Drive folder as described below. Existing private installations should keep their personal installer; the public installer uses the same application name and can replace it.

Audio files are not included. Use files you own or are allowed to access. The interface is currently Russian; translations of button names below are explanations of those Russian controls.

## 2. Prepare your Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/), create/select a project, and enable **Google Drive API**.
2. Open Google Auth Platform. Configure Branding and Audience. If the app is in testing, add the Google account you will use as a test user.
3. Configure Data Access for the permissions the app requests: **drive.readonly**, **drive.file** (Windows import/upload), **drive.appdata** (hidden progress records).
4. In Clients, create an OAuth client of type **Desktop app**. Download its JSON and keep it locally. Do not commit it to GitHub or send it to other users.
5. Use the same Cloud project for the Android client. Its package name is **ru.meguboom.mobile**. Register the **SHA-1** of the certificate that signed your actual APK. A Desktop JSON cannot substitute for Android package/certificate registration.

Official references: [Drive OAuth quickstart](https://developers.google.com/workspace/drive/api/quickstart/nodejs), [Android authorization](https://developer.android.com/identity/authorization), [application data](https://developers.google.com/workspace/drive/api/guides/appdata).

## 3. Connect on Windows

1. Start MeguBoom. Open **Google Диск** (Google Drive) in the sidebar.
2. Choose **Выбрать OAuth JSON** and select your Desktop client JSON. Then press **Подключить Google**.
3. Complete authorization in the system browser and return to the app. Reconnect if the progress panel asks for the new app-data permission.
4. Select your library folder in the folder-ID/link field. You can paste a Google Drive folder URL. Use your own folder; no author's folder is included.
5. Choose books/music and navigate nested folders. Streaming does not copy your whole Drive. A download button saves an offline copy on the PC; uploading a local file creates a copy in MeguBoom on Drive.

The Desktop client encrypts saved tokens using Windows secure storage. You can disconnect from the Drive section.

## 4. Configure, build and connect Android

Requirements: Node.js 22+, JDK 17, Android SDK (platform36, build tools), Google Play services on the phone. Android8.0/API 26 or newer is supported by the source. Install the SDK with Android Studio and set ANDROID_HOME or create an untracked android/local.properties containing sdk.dir for your machine.

Run in the repository root:

~~~powershell
npm ci
node scripts/configure-drive-folder.cjs "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
npm run stage:android
cd android
.gradlew.bat testDebugUnitTest lintDebug assembleDebug
.gradlew.bat signingReport
~~~

The configuration command updates the folder in both the native and WebView sources. Re-run it and stage assets again when changing the folder. The APK is at **android/app/build-mobile-drive/outputs/apk/debug/app-debug.apk**. Debug signing is for personal development; do not commit generated keys. Keep the signing identity stable for updates, or Android will require uninstalling the old app. Register the SHA-1 from signingReport for your actual build.

Install the APK on your phone. In settings, choose the JSON from the same Google project, then **Подключить Google Диск заново** (connect/reconnect Google Drive). The JSON import identifies the project; native Google Play services perform authorization. The app opens only your configured folder and its descendants. Music, audiobooks and unclassified files remain separate. Arbitrary phone-file import and general My Drive browsing are not part of this Android mode.

## 5. Enable shared listening progress

1. Sign in with the same Google account on both platforms, using OAuth clients from the same project.
2. Reconnect Google on both devices and grant app-data permission. No manually created progress file is needed.
3. Press **Синхронизировать** / **Синхронизировать сейчас**. Play a file on one device, pause, sync the second and open the same Drive file.

Positions and the completed flag are matched by original Drive file ID, including verified downloaded copies. Equal titles do not merge different files. Normal automatic exchange is about 30 seconds; pause, seek and completion also schedule a sync. Offline edits remain local and retry later while the app is running. A pull does not jump an actively playing track. When both devices edit the same record, the latest timestamp wins, including rewind and completion removal; keep device clocks correct.

Favorites, playlists, volume and unrelated local files are not synchronized. A recreated/reuploaded Drive file has a new ID and is not automatically the same progress record. Credentials are not included in the progress JSON.

## 6. Playback and troubleshooting

- **Добавить файлы / Добавить папку** on Windows imports local audio without moving originals.
- Click a folder to open its children; numbered names retain numeric order. Use breadcrumbs/back to return.
- Open a book's details for cover, author, description and completion. Missing metadata uses placeholders; the public catalogue is empty by design.
- The compact player remains available during navigation. Open it for full controls, queue, speed, short seeks and sleep timer.
- A heart adds a favorite; **Отметить прослушанной** marks complete and can be removed later.
- Android notification controls require notification permission. For long background sessions, check the phone's battery restrictions for the app.
- Google access denied: check the enabled Drive API, test-user account and requested consent. Reconnect after permission changes.
- Android sign-in failure: verify package name, actual signing SHA-1, Google Play services and the Cloud project. Importing a Desktop JSON alone does not register an Android app.
- Empty phone library: configure your own folder before building, confirm the account can open it in Drive, reconnect, and check Music / Audiobooks / Unclassified.
- Different positions: check account/project, internet, sync status, original file ID and correct device times. Pause and manually sync both devices.
- Missing descriptions: not every file has verified metadata. No book descriptions are invented to fill gaps.

## 7. Build Windows and run checks

~~~powershell
npm ci
npm test
npm start
npm run build:win
~~~

The installer appears in dist. Build retention keeps the current and previous installers; it does not remove your library. To test a packaged build, run **node scripts/personal-packaged-smoke.cjs** after building. Windows secure-storage behavior is platform specific. Current verification and its limits are in [VERIFICATION.md](VERIFICATION.md).

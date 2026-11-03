# 👑 Heads Up! — The Ultimate Party Charades Web App

A feature-rich, high-energy party charades game built for mobile smartphones, tablets, and desktop browsers. Pick a deck, place the phone on your forehead facing your friends, and tilt down to score or tilt up to pass as your friends shout clues, dance, sing, and act it out!

---

## ✨ Features

- **📱 Authentic Forehead Tilt Controls**:
  - **Tilt DOWN** (nod head towards floor) ➔ **CORRECT!** (Green flash, rewarding chime, +1 point).
  - **Tilt UP** (tilt head towards ceiling) ➔ **PASS!** (Amber flash, pass sound, no penalty).
  - Built-in hysteresis state-machine and noise filter to prevent double-skips.
  - Compatible with iOS 13+ (handles DeviceOrientation permission prompt seamlessly) and Android.

- **💻 Universal Fallback & Desktop Controls**:
  - Tap left half of screen or press `Down Arrow` / `C` / `Space` for **CORRECT**.
  - Tap right half of screen or press `Up Arrow` / `P` for **PASS**.
  - `Escape` key to pause or exit round.

- **📹 Ellen-Style Reaction Cam (Selfie Camera)**:
  - Toggle on the reaction camera in Settings to record your friends' hilarious expressions, pantomimes, and shouting during the round!
  - Instant video playback on the summary screen with a one-click **Save Video** download button.

- **🔊 100% Self-Contained Web Audio Synthesizer**:
  - Zero external `.mp3` or `.wav` files — synthesized dynamically using the Web Audio API!
  - Countdown beeps, energetic "GO!" fanfare, arpeggio chimes for correct answers, whooshes for passes, urgent ticking in the final 10 seconds, game-show buzzer, and victory fanfare.

- **📦 10 Built-In Party Decks (500+ Cards)**:
  1. 🎬 **Blockbuster Movies** (Avatar, Inception, Titanic, Oppenheimer, Barbie...)
  2. 🦁 **Animal Kingdom** (Blue Whale, Sloth, Platypus, Chameleon, Honey Badger...)
  3. 🎭 **Act It Out!** (Mime & gesture: Stepping on a Lego, Doing the Moonwalk, Surfing a Giant Wave...)
  4. 🌟 **Pop Icons & Superstars** (Taylor Swift, Beyoncé, The Rock, Zendaya, Keanu Reeves...)
  5. 🍕 **Foodie Paradise** (Boba Milk Tea, Pepperoni Pizza, Guacamole, Crème Brûlée, Sushi Roll...)
  6. 🎮 **Gaming Legends** (Mario, Pikachu, Minecraft Creeper, Master Chief, Lara Croft...)
  7. 🎸 **Hit Songs & Anthems** (Bohemian Rhapsody, Shake It Off, Stayin' Alive, Bad Guy...)
  8. 🦸 **Superheroes & Villains** (Spider-Man, Wonder Woman, Deadpool, The Joker, Thanos...)
  9. 📺 **Binge-Worthy TV** (Stranger Things, Squid Game, The Office, Wednesday...)
  10. 👶 **Family & Kids** (Dinosaur, Firetruck, Unicorn, Cotton Candy, SpongeBob...)

- **✨ Custom Deck Builder**:
  - Create personalized decks with custom titles, emojis, colors, and word lists.
  - Live card counter as you type or paste words.
  - Persistent storage in `localStorage`.
  - **Export & Import JSON**: Share your custom decks with friends via text or WhatsApp!

- **🏆 High Score Tracking & Statistics**:
  - Personal best tracking per deck.
  - Round summary breakdown: Correct, Passed, Accuracy (%), Total words.
  - Word-by-word review showing which cards were guessed vs passed.
  - Confetti celebration explosion on winning rounds!
  - **Share Score**: One-tap native sharing via Web Share API or copy-to-clipboard.

- **📶 Offline Progressive Web App (PWA)**:
  - Works offline via Service Worker (`sw.js`). Play at camping trips, flights, picnics, or places with no Wi-Fi.
  - Installable to your phone's home screen ("Add to Home Screen").
  - Screen Wake Lock API ensures your phone display never dims or sleeps mid-game.

---

## 🚀 How to Play

### Option 1: On your Computer
1. Open `index.html` directly in any modern browser (Chrome, Safari, Edge, Firefox).
2. Or run the local server:
   ```bash
   python3 server.py
   ```
3. Open `http://localhost:8080`.

### Option 2: On your Phone (Best Forehead Experience!)
1. Start the server on your computer:
   ```bash
   python3 server.py
   ```
2. The terminal will display your phone's connection URL, e.g.:
   ```
   📱 On your phone: http://192.168.1.107:8080
   ```
3. Ensure your phone is connected to the same Wi-Fi, open the URL in Safari or Chrome, pick a deck, rotate to landscape, and place it on your forehead!

---

## 🎮 Game Rules
1. Pick a category and press **PLAY**.
2. A 3-second countdown begins — place the screen horizontally against your forehead facing your friends.
3. Your friends give clues without saying the word (or mime/dance if playing **Act It Out**!).
4. Nod **DOWN** to score a point when you guess right.
5. Tilt **UP** to pass if you are stuck.
6. Guess as many as you can before the 60-second buzzer sounds!

# Interactive Dog Mat – Prototype 1

> Project proposal: [MakerRepo](https://makerepo.com/project_proposals/620.interactive-dog-mat)

This term, we are building an interactive dog mat and companion app with a client to ease communication between dogs and their owners. Accessibility is central to the project, but the design is universal.

Our first prototype tests our riskiest assumption: the integration between software and hardware. In other words, **can an input in the web app be reflected on an external component?**

---

## How It Works

- **Frontend:** a Vite + React web app.
- **Connection:** clicking the enable button prompts you to pick a serial port, which becomes available when the Arduino Uno is connected to your laptop over USB.
- **Firmware:** a C++ program loaded onto the Arduino Uno that receives the app's input and acts on it.

---

## Getting Started

1. Upload the C++ sketch to the Arduino Uno.
2. Install dependencies and start the app:
   ```bash
   npm install
   npm run dev
   ```
3. Open the app at http://localhost:5173/, click the enable button, and select the Arduino's port.

---

<div align="center">
    Built as part of <b>GNG2101 (Product Development for Engineers and Computer Scientists)</b>, Fall 2026
</div>
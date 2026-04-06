# 🚀 Drag & Drop Page Builder

A modern and interactive web application that allows users to dynamically build and customize a personal content page using draggable and configurable blocks.

---

## 📌 Project Overview

This project is a simplified page builder inspired by tools like Notion and Webflow.

Users can create their own page layout by dragging predefined content blocks into a canvas and customizing them in real-time.

---

## ✨ Features

### 🧱 Available Blocks

- **Header Block** → Supports multiple levels (H1, H2, H3)
- **Rich Text Block** → Add and edit text content
- **Image Block** → Display images via URL
- **Markdown Block** → Write markdown and preview it live

---

### 🎯 Core Functionalities

- Drag and drop blocks from palette to canvas
- Reorder blocks dynamically
- Real-time editing of block content
- Responsive and clean UI
- Persistent state using Local Storage

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Functional Components + Hooks)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Context API / Zustand
- **Persistence:** LocalStorage

---

## 🧠 State Management Strategy

The application uses a structured state to manage dynamic blocks:

```js
{
  blocks: [
    {
      id: "unique-id",
      type: "header" | "text" | "image" | "markdown",
      content: {},
    },
  ];
}
```

- Each block is uniquely identified
- State updates are handled immutably
- This structure allows scalability and easy feature addition

---

## 💾 Persistence

- The entire page state is stored in **localStorage**
- Data is automatically saved on updates
- On refresh, the previous state is restored

---

## 🎨 UI/UX Design Decisions

- Minimal and clean design inspired by modern tools
- Sidebar for block selection (palette)
- Main canvas for page building
- Smooth drag-and-drop interactions
- Focus on usability and simplicity

---

## 📁 Project Structure

```
src/
 ├── components/
 │    ├── blocks/
 │    ├── ui/
 │
 ├── store/
 ├── hooks/
 ├── utils/
 ├── App.jsx

```

## 🚀 Live Demo

👉 https://your-project.vercel.app

## 📂 GitHub Repository

👉 https://github.com/your-username/project-name

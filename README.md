# DropBox - File Uploader

A sophisticated file upload utility built with React and Vite, featuring drag-and-drop functionality, real-time progress tracking, and premium visual design.

## Features

- 🎯 Drag-and-drop upload zone with visual feedback
- 📁 Multi-file selection and batch upload
- 📊 Real-time progress bars for individual files
- ✅ File validation (size limits, type restrictions)
- 🔄 Upload queue management with remove functionality
- 🎨 Premium design with gradient effects and smooth animations
- 📱 Fully responsive across all devices
- 🔗 Copy-to-clipboard for uploaded file URLs
- 📈 Statistics dashboard showing upload metrics
- ⚡ Fast, optimized performance

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- React Toastify

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## File Specifications

- Maximum file size: 50MB
- Supported formats: Images (JPEG, PNG, GIF, WebP), Documents (PDF, Word, Excel), Text files, ZIP archives

## Usage

1. Drag files onto the drop zone or click "Choose Files" to browse
2. Files are automatically validated and added to the queue
3. Click "Upload" to start uploading pending files
4. Monitor progress with real-time progress bars
5. Copy uploaded file URLs to share or use elsewhere
6. Clear completed uploads to keep your workspace clean

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex feature components
│   ├── pages/          # Page components
│   ├── ui/             # State components
│   └── ApperIcon.jsx   # Icon wrapper
├── utils/              # Utility functions
├── App.jsx
├── main.jsx
└── index.css
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT
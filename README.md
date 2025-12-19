# Africa Trade Awards 2026

Official website for the Africa Trade Awards 2026 - Celebrating Africa's Trade Excellence and Industrial Champions.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: SCSS/SASS, Bootstrap, Tailwind CSS
- **Build Tool**: Next.js Static Export

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/wastwagon/africatradeawards.git
cd africatradeawards
```

2. Install dependencies:
```bash
npm install
```

3. Compile SCSS to CSS:
```bash
npm run sass
```

## 🏃 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Building for Production

Build the static site:

```bash
npm run build
```

The static files will be generated in the `out` directory.

## 📦 Static Export

This project is configured for static export, making it suitable for hosting on static hosting platforms like Render, Vercel, Netlify, etc.

## 🌐 Deployment

### Render (Using Blueprint)

This repository includes a `render.yaml` blueprint file for easy deployment on Render:

1. Connect your GitHub repository to Render
2. Render will automatically detect the `render.yaml` file
3. The static site will be built and deployed automatically

### Manual Deployment

1. Build the static site: `npm run build`
2. Upload the `out` directory to your hosting provider

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── layout/            # Layout components (Header, Footer, etc.)
│   ├── sections/          # Page sections
│   └── elements/          # Reusable UI elements
├── public/                # Static assets
│   ├── assets/           # CSS, images, icons
│   └── img/              # Images
└── render.yaml           # Render deployment blueprint
```

## 🎨 Styling

- SCSS files are located in `public/assets/scss/`
- Compiled CSS is output to `public/assets/css/main.css`
- Run `npm run sass` to watch and compile SCSS changes

## 📝 Notes

- This is the frontend-only version
- Backend integration will be added in future updates
- All CSS is compiled from SCSS before deployment

## 📄 License

Private repository - All rights reserved.

## 🤝 Contributing

This is a private project. For access or contributions, please contact the repository owner.

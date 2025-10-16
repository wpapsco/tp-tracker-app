# GitHub Pages Deployment Guide

Your Twilight Princess Tracker app is now configured for GitHub Pages deployment!

## Quick Deploy

### Option 1: Using GitHub Actions (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **GitHub Actions**

3. **Create GitHub Actions Workflow:**

   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: ["main"]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: "pages"
     cancel-in-progress: false

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: "20"
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./out

     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       needs: build
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

4. **Push the workflow:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

5. **Your site will be live at:** `https://<your-username>.github.io/<repo-name>/`

---

### Option 2: Manual Deploy

1. **Build the static site:**
   ```bash
   npm run build
   ```

2. **Deploy the `out/` directory:**
   - Install the `gh-pages` package:
     ```bash
     npm install --save-dev gh-pages
     ```

   - Add to `package.json` scripts:
     ```json
     "deploy": "gh-pages -d out"
     ```

   - Deploy:
     ```bash
     npm run deploy
     ```

3. **Enable GitHub Pages:**
   - Go to repository **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** → **/ (root)**

---

## Important Notes

### Custom Domain vs GitHub.io subdirectory

**If deploying to `username.github.io/repo-name`**, uncomment these lines in `next.config.ts`:

```typescript
basePath: '/tp-tracker-app',  // Change to your repo name
assetPrefix: '/tp-tracker-app',
```

**If using a custom domain**, leave them commented out.

### What Changed

1. **Static Export:** Next.js now exports to static HTML/CSS/JS
2. **Data Loading:** World data loads from `/world-data.json` instead of an API route
3. **Pre-build Step:** `world-data.json` is auto-generated before each build
4. **No Server Required:** App runs entirely in the browser

### Build Output

- `out/` - Static files ready for deployment
- `out/world-data.json` - All room and check data (269KB)
- `out/index.html` - Main application page

### Testing Locally

To test the static build locally:
```bash
npm run build
npx serve out
```

Then open `http://localhost:3000`

---

## Troubleshooting

**404 on page refresh?**
- This is normal for GitHub Pages with client-side routing
- The app handles this automatically

**Assets not loading?**
- Check if you need to set `basePath` and `assetPrefix` in `next.config.ts`
- Verify the repository name matches the base path

**Build fails?**
- Make sure all dependencies are installed: `npm install`
- Check that `public/world-data/` directory exists with JSONC files

---

## Development vs Production

- **Development:** `npm run dev` - Runs Next.js dev server with hot reload
- **Production:** `npm run build` - Generates static export in `out/`
- **Test:** `npm run test:spheres` - Runs logic validation tests

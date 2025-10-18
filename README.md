# Twilight Princess Randomizer Auto-Checklist

A web-based auto-checklist for The Legend of Zelda: Twilight Princess Randomizer that helps you track check locations, item placements, and progression logic in real-time.

## ⚠️ AI Development Disclaimer

**This application was primarily developed using Claude AI (Anthropic's Claude Code).** A significant portion of the codebase was generated through AI assistance. While the app is functional and has been tested, users should be aware of its AI-assisted origins.

If you have concerns about AI-generated code or prefer human-written applications, this may not be the right tool for you. This disclaimer is provided in the interest of transparency.

## Features

- **Spoiler Log Import**: Upload your randomizer spoiler log to track item placements
- **Logic-Based Availability**: Automatically shows which checks are currently accessible based on items you've collected
- **Region-Based Organization**: Checks organized by region and room for easy navigation
- **Controller Support**: Full gamepad/controller support for hands-free use while playing
  - D-pad/Left analog: Navigate checks
  - Right analog: Scroll item list
  - A button: Toggle check completion
  - LB/RB (shoulder buttons): Switch between regions
- **Item Tracking**:
  - View all collected items in a sortable sidebar
  - See which item each check gives when completed
  - Smart sorting (key items first, consumables last)
- **Customizable Filters**:
  - Toggle Poes, Golden Bugs, Sky Characters, NPCs, Shop Items, and Hidden Skills
  - Show only available checks
  - Toggle item list and check reward displays
- **GO MODE Indicator**: Visual notification when you have all required items to complete the seed
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatically adapts to system theme preferences
- **Auto-Save**: Progress is automatically saved to local storage

## Getting Started

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage

1. Upload your Twilight Princess Randomizer spoiler log using the upload button
2. Navigate through regions using the tabs or controller shoulder buttons
3. Check off locations as you complete them
4. The auto-checklist will automatically update which checks are available based on your collected items
5. Use the filter buttons to customize which types of checks are displayed

## Technology Stack

This is a [Next.js](https://nextjs.org) project using:
- React 19
- TypeScript
- Tailwind CSS
- Next.js App Router

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

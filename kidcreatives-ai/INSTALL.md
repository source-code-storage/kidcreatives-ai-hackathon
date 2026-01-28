# Installation Instructions

## Issue: WSL/Windows Path Problem

Your environment is running WSL (Windows Subsystem for Linux) with Node.js installed on the Windows side, which causes UNC path issues when trying to install npm packages.

## Solutions

### Option 1: Install from Windows PowerShell (RECOMMENDED)

1. **Open Windows PowerShell** (not WSL terminal)

2. **Navigate to the project directory:**
   ```powershell
   cd \\wsl.localhost\Ubuntu\home\kimjr\dynamous-kiro-hackathon\kidcreatives-ai
   ```
   
   Or if that doesn't work:
   ```powershell
   cd \\wsl$\Ubuntu\home\kimjr\dynamous-kiro-hackathon\kidcreatives-ai
   ```

3. **Run the install script:**
   ```powershell
   .\install.ps1
   ```
   
   Or manually:
   ```powershell
   npm install
   ```

### Option 2: Install Node.js in WSL

1. **Install Node.js in your WSL Ubuntu environment:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

3. **Install dependencies:**
   ```bash
   cd ~/dynamous-kiro-hackathon/kidcreatives-ai
   npm install
   ```

### Option 3: Use the Install Script

From your WSL terminal:
```bash
cd ~/dynamous-kiro-hackathon/kidcreatives-ai
./install.sh
```

## After Installation

Once dependencies are installed successfully:

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app should be running at `http://localhost:5173`

## Verify Installation

After running `npm install`, you should see:
- A `node_modules/` directory created
- A `package-lock.json` file created
- No error messages

## Need Help?

If you continue to have issues:
1. Check that Node.js is properly installed: `node --version`
2. Check that npm is available: `npm --version`
3. Try clearing npm cache: `npm cache clean --force`
4. Delete `node_modules` and `package-lock.json` and try again

## What Gets Installed

The following packages will be installed:
- React 18.3.1 + React DOM
- Supabase JS (2.39.0)
- Google Generative AI (0.21.0)
- Framer Motion (11.0.3)
- TailwindCSS (3.4.1)
- Vite (6.0.5)
- TypeScript (5.6.2)
- And all their dependencies...

Total size: ~300-400 MB

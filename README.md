# CampusEngage 🎓

The exclusive dating and networking platform for university students. 
Ditching the cringe swiping for meaningful Icebreakers and authentic connections.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Vercel

## How to Contribute (For the Team)

If you are a team member and want to contribute using **Google Antigravity**, follow these steps:

### 1. Clone and Setup
1. Clone this repository to your computer:
   ```bash
   git clone https://github.com/YOUR_USERNAME/campus-engage.git
   ```
2. Navigate into the project:
   ```bash
   cd campus-engage
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### 2. Environment Variables
1. Ask the project lead for the Firebase Configuration keys.
2. Create a file named `.env.local` in the root of the project.
3. Paste the keys in this format:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   ```

### 3. Start Coding with Antigravity
1. Open this folder in the **Antigravity IDE**.
2. Open the Antigravity chat panel.
3. You can ask Antigravity to build new features! For example:
   - *"Add a 'Dark Mode' toggle to the navigation bar."*
   - *"Create a dedicated 'Matches' page that only shows people who replied to my icebreaker."*
   - *"Update the Profile page so users can edit their Bio after onboarding."*
4. Run the local server to test the changes:
   ```bash
   npm run dev
   ```

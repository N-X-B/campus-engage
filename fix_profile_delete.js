const fs = require('fs');
let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

if (!code.includes("deleteDoc")) {
  code = code.replace("import { signOut } from 'firebase/auth';", "import { signOut, deleteUser } from 'firebase/auth';\nimport { doc, deleteDoc } from 'firebase/firestore';\nimport { db } from '@/lib/firebase';\nimport { deleteUserEmbedding } from '@/app/actions/matchmaking';");
}

const deleteFunction = `
  const handleDeleteAccount = async () => {
    if (isDemoMode) {
      alert("Cannot delete accounts in Demo Mode.");
      return;
    }
    
    const confirmDelete = window.confirm(
      "Are you absolutely sure you want to permanently delete your account?\\n\\nThis will instantly erase your profile, photos, matches, and all data from our servers. This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      // 1. Delete from AI Vector Database (Fire and forget)
      deleteUserEmbedding(user.uid).catch(e => console.error(e));
      
      // 2. Delete the profile document from Firestore (this also deletes the base64 photos stored inside it)
      await deleteDoc(doc(db, "users", user.uid));
      
      // 3. Delete the user from Firebase Authentication
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      
      alert("Your account and all associated data have been permanently erased.");
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, you need to log out and log back in before deleting your account.");
      } else {
        alert("An error occurred while deleting your account: " + error.message);
      }
    }
  };
`;

code = code.replace(/const handleLogout =[\s\S]*?router\.push\('\/'\);\n  \};/m, "$&\n" + deleteFunction);

const deleteButton = `
          <div className="bg-zinc-900/50 border border-red-500/20 p-6 rounded-3xl mt-12 flex flex-col items-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
            <p className="text-zinc-500 text-sm text-center mb-6 max-w-sm">
              Permanently erase your account, profile, matches, and all data from our servers. This action is irreversible.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors border border-red-500/20"
            >
              Permanently Delete Account
            </button>
          </div>
`;

code = code.replace(/<\/button>\n\s*<\/div>\n\s*<\/motion\.div>/, "</button>\n          </div>\n" + deleteButton + "\n        </motion.div>");

fs.writeFileSync('src/app/profile/page.tsx', code);

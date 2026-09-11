const fs = require('fs');

let code = fs.readFileSync('src/app/missed-connections/page.tsx', 'utf8');

// 1. Remove the Post option by replacing the isComposing UI
// In the JSX, we can just remove the Post Button.
const composeButtonMatch = /<button \n              onClick=\{.*?\}[\s\S]*?className="bg-indigo-500.*?">[\s\S]*?Post a Connection[\s\S]*?<\/button>/;
code = code.replace(composeButtonMatch, '');

// Also remove the floating action button if it exists
const fabMatch = /<button.*?onClick=\{.*?setIsComposing\(true\).*?\}.*?>[\s\S]*?<\/button>/g;
code = code.replace(fabMatch, '');

// 2. Clear out the fetching logic so it just stays empty
const fetchMatch = /const loadPosts = async \(\) => \{[\s\S]*?\};/;
const fetchReplace = `const loadPosts = async () => {
    // Posts temporarily disabled per user request
    setPosts([]);
    setFetching(false);
  };`;
code = code.replace(fetchMatch, fetchReplace);

// 3. Clear the posts array mapping and show a "disabled" UI instead
const postsUIMatch = /\{posts\.length === 0 \? \([\s\S]*?\}\)/;
const postsUIReplace = `{true ? (
            <div className="text-center py-32">
              <h3 className="text-xl font-bold text-white mb-2">Spotted Section is undergoing renovations 🚧</h3>
              <p className="text-zinc-500">Posting has been temporarily disabled.</p>
            </div>
          ) : null}`;
code = code.replace(postsUIMatch, postsUIReplace);

fs.writeFileSync('src/app/missed-connections/page.tsx', code);

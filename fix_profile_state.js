const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const stateMatch = "const [userData, setUserData] = useState<any>(null);";
const stateReplace = `const [userData, setUserData] = useState<any>(null);
  const [editingInterests, setEditingInterests] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  useEffect(() => {
    if (userData?.interests) {
      setSelectedInterests(userData.interests);
    }
  }, [userData]);
  
  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 3) {
        alert("You can only select up to 3 campus groups!");
        return;
      }
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const saveInterests = async () => {
    try {
      await updateDoc(doc(db, 'users', user!.uid), { interests: selectedInterests });
      setEditingInterests(false);
      setUserData({ ...userData, interests: selectedInterests });
    } catch (err) {
      console.error(err);
    }
  };
`;
code = code.replace(stateMatch, stateReplace);

fs.writeFileSync('src/app/profile/page.tsx', code);

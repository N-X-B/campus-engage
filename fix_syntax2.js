const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
code = code.replace(`          } catch (err) {
            console.warn("[FEED] Server Action failed. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
        
        
        let scoredProfiles = [];`, `          } catch (err) {
            console.warn("[FEED] Server Action failed. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
        } // CLOSED THE ELSE BLOCK HERE
        
        let scoredProfiles = [];`);
fs.writeFileSync('src/app/feed/page.tsx', code);

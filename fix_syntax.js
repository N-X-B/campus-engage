const fs = require('fs');
let code = fs.readFileSync('src/app/feed/page.tsx', 'utf8');
code = code.replace(`          } catch (err) {
            console.warn("[FEED] Server Action failed. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
        } catch (err) {
            console.warn("[FEED] Failed to load from Firestore. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }
        }`, `          } catch (err) {
            console.warn("[FEED] Server Action failed. Falling back to Demo Mode.", err);
            fetchedProfiles = await demoDb.getProfiles();
          }`);
fs.writeFileSync('src/app/feed/page.tsx', code);

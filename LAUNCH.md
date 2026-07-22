# Yearwise — LIVE for student testing

**Status (2026-07-22): LAUNCHED** via public tunnel + home network.  
Full curriculum build is on **localhost / Cloudflare / LAN**.  
Vercel production uploads are currently blocked by account/Git settings (see Parent notes).

---

## Give this to your daughter ✂️

### Website
**https://instantly-merchant-gently-gates.trycloudflare.com**

Same Wi‑Fi as Dad’s Mac: **http://192.168.2.24:3000**

### Sign in (no password)
| | |
|--|--|
| **URL** | …/signup |
| **Name** | Her first name |
| **Year** | Year 7 (or her year) |
| **Email** | optional / blank |
| **Password** | **none — not needed** |

1. Open the website  
2. Complete **Sign up** (software downloads optional → “finish later”)  
3. Start learning  

### Try these first
| Activity | Path |
|----------|------|
| Year 7 home | `/year/7` |
| Maths integers | `/year/7/math/integers-and-number-line` |
| Times tables gym | `/times-tables` |
| GeoGebra designs | `/game/geogebra` |
| Science cells (guided) | `/year/7/science/cells-as-units` |
| CS pathway pick | `/year/7/computerscience` |
| Build Lab | `/game` |
| Genesis Lab | `/labs/genesis` |

### Rules
- **No skipping** — finish each lesson **quiz** to unlock the next  
- Year exams include **previous years** + **times tables** (memory)  
- Need **92% overall** + year exam **92%** to unlock next year  

---

## Parent notes
- Keep this Mac **awake**; tunnel dies if the machine sleeps  
- Progress is **per browser / device** (localStorage)  
- Code: https://github.com/bennyaims/yearwise  
- Demo video: `test-screenshots/student-tour/yearwise-student-tour.mp4`  
- **Vercel:** project `bennyaims-projects/yearwise` — recent deploys **BLOCKED** because Git author must match a Vercel team member (`TEAM_ACCESS_REQUIRED`). SSO protection was turned **off**. To fix permanent `yearwise-red.vercel.app`:  
  1. Vercel dashboard → connect GitHub account to the team, **or**  
  2. Run one clean `npx vercel deploy --prebuilt --prod` with no other deploys running  

### What’s included in this build
Y7–12 curriculum, guided lessons, quizzes, 92% progression, year exams (cumulative), CS pathways, GeoGebra design studio, times tables + mental strategies, software signup pack, Build Lab, Genesis Lab, voice teacher classes.
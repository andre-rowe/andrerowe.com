# andrerowe.com

Static HTML and CSS, served by GitHub Pages from this repository (custom domain in `CNAME`). No build step and no framework.

## Pages
- `index.html`: homepage (positioning, program-scope and personal metrics, featured case study, evidence, labs, validation, resumes, contact)
- `experience.html`, `case-studies.html`, `evidence.html`, `projects.html`, `education.html`, `validation.html`, `resume.html`: the main navigation
- `windows11-migration.html`: case study, Windows 11 migration program at NYU Langone Health (professional experience)
- `bayou-alert.html`, `project-volta.html`, `grazioso-animal-rescue.html`, `travlr-getaways.html`, `loql.html`, `truth-be-told.html`: project pages
- `playground.html`: in-browser demo of the Loql group voting concept

## Assets
- `portfolio.css`, `portfolio.js`, `evidence-card.css`, `evidence-card.js`: styles and scripts for the homepage, the main navigation pages and the Windows 11 case study. Evidence cards render from data inlined in each page; nothing is fetched.
- `styles.css`, `site.js` (root): styles and scripts for the project pages and the playground
- `images/`: project images (webp)
- `Andre_Rowe_Resume_<Role>.pdf` (root): the six role-specific resume PDFs linked from the site
- `Andre_Rowe_Resume.pdf`: the Endpoint Engineer resume at its older address, kept so existing links keep working

## Labels
Every case study, artifact and project carries one of five labels: Professional Experience, Reconstructed Professional Artifact, Academic Project, Simulated Professional Project or Hands-On Lab. Reconstructed artifacts use fictional data and are not original employer documents. Riverside Health is a fictional hospital used only for simulated projects and labs.

## Deploy
Commit to `main`; GitHub Pages publishes the repository root. Check https://andrerowe.com/windows11-migration.html and the resume downloads after each push.

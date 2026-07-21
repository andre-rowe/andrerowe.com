# andrerowe.com — personal site

Static, zero-JS, one page. Plain HTML + CSS by design — the site itself is the first artifact in the DevOps story (v2 migrates it to AWS via Terraform; see Website_Rebuild_Guide.md).

## Files
- `index.html` — main page
- `bayou-alert.html`, `project-volta.html`, `grazioso-animal-rescue.html`, `travlr-getaways.html` — case-study pages (content migrated from the old portfolio, rebuilt in this design)
- `styles.css` — all styling, shared by every page
- `images/` — optimized webp project images (~440KB total)
- `Andre_Rowe_Resume.pdf` — the hero button links to this exact filename. Replace it every time the docx master changes.

## Deploy (GitHub Pages, ~10 minutes)
1. Create a public repo (e.g. `andrerowe.com`) and push these files to `main`.
2. Repo → Settings → Pages → Source: **Deploy from a branch** → `main` / root.
3. Wait for the first build; confirm the `*.github.io` URL renders.
4. Custom domain: enter your confirmed domain in the Pages settings (this creates a `CNAME` file in the repo — do this only after the domain question is settled).
5. At your registrar: point the apex domain at GitHub Pages' A records and `www` at `dre007.github.io` via CNAME record (GitHub's Pages docs list the current IPs).
6. Back in Pages settings: check **Enforce HTTPS** once the certificate provisions.

## Before launch checklist
- [ ] Resume PDF in repo root, current version
- [ ] OpenClaw card link → the real repo URL once it's public (currently points at the GitHub profile)
- [ ] Domain confirmed and consistent across site, resume header, LinkedIn About/Featured
- [ ] Phone-free by design — email only on the public page

## v2 (September)
S3 + CloudFront + Route 53 + ACM, provisioned with Terraform, deployed by GitHub Actions. Architecture and rationale in Website_Rebuild_Guide.md. When it ships, update the footer line and add the bullet to the resume.

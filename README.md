# Demo Clinic, Baner

A fictional, mobile-first website for **Demo Clinic, Baner** — a sample multi-specialty family clinic in Baner, Pune. [Zenetic](https://zenetic.in) (zenetic.in), a Pune digital agency, uses this page to pitch real clinics.

**This is not a real clinic.** Names, address, phone number, doctors, timings and fees are placeholders. Doctor cards are generic (“Dr. A. Demo”, “Dr. Sample Name”) with initials, not photos of real people. The appointment form does not send or store anything.

## Run locally

No install and no build. From the repository root:

```bash
python3 -m http.server 4173 --directory public
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Deploy on Vercel

Static files live in `public/`. `vercel.json` sets the Hobby-friendly defaults so a Git connection can redeploy on every push to `main` with no framework install:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Install command | empty (skipped) |
| Build command | empty (no build) |
| Output directory | `public` |

There is no `package.json` on purpose, so Vercel does not run `npm install`.

The canonical URL, Open Graph tags, JSON-LD, `robots.txt` and `sitemap.xml` assume the project URL:

`https://zenetic-demo-clinic-pune.vercel.app/`

If the production domain is different, replace that host in:

- `public/index.html` (canonical, Open Graph, Twitter, JSON-LD)
- `public/robots.txt`
- `public/sitemap.xml`

## What’s on the page

- Demo banner and Zenetic credit
- Services, sample fee bands in ₹, placeholder doctors, timings, Baner map, FAQ (with `FAQPage` and `MedicalClinic` JSON-LD), and an appointment form
- Call and WhatsApp links use the sample number **+91 90000 00000**
- Submitting the form shows a confirmation that nothing was sent, with the option to open WhatsApp using the same details

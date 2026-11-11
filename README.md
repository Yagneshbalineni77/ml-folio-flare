# Yagnesh Balineni — Portfolio

Personal portfolio of **Yagnesh Balineni**, Machine Learning & AI Engineer (B.Tech, Electronics & Computer Engineering, VIT Chennai).

It covers my work in computer vision, medical imaging, generative AI and energy-efficient spiking neural networks: experience, publications, skills and selected projects.

- **Résumé:** [`public/Yagnesh_Balineni_Resume.pdf`](public/Yagnesh_Balineni_Resume.pdf)
- **GitHub:** [@Yagneshbalineni77](https://github.com/Yagneshbalineni77)
- **LinkedIn:** [yagnesh-balineni](https://www.linkedin.com/in/yagnesh-balineni-890167287)

## Highlights

- A floating 3D avatar that tilts toward the pointer.
- Layered scrolling: each section slides over the one before it, and the projects stack as sticky cards.
- Smooth scrolling with [Lenis](https://github.com/darkroomengineering/lenis). Scroll-linked effects run on compositor layers.
- Original artwork for every project, served as lightweight WebP files from `public/art/`.

## Tech stack

React 19 · TanStack Start (file-based routing, SSR) · Vite · Tailwind CSS v4 · Framer Motion · Lenis · TypeScript

## Project structure

```
src/routes/index.tsx            Page sections and display components
src/routes/-portfolio-data.ts   All content (profile, experience, projects, skills); edit this to update the site
src/styles.css                  Theme tokens and portfolio styles
public/art/                     Project and section artwork
```

## Run locally

Requires Node.js 20+.

```sh
npm install
npm run dev       # start the dev server
npm run build     # production build
npm test          # run tests
```

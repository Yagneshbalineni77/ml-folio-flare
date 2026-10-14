import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import heroPortrait from "@/assets/Rectangle_40443.81459862.png.asset.json";
import moonArtwork from "@/assets/moon_icon.11395d36.png.asset.json";
import objectArtwork from "@/assets/p59_1.4659672e.png.asset.json";
import legoArtwork from "@/assets/lego_icon-1.703bb594.png.asset.json";
import groupArtwork from "@/assets/Group_134-1.2e04f3ce.png.asset.json";

const github = "https://github.com/Yagneshbalineni77";

const showcaseImages = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const originalProjectArtwork = [
  [
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  ],
  [
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  ],
  [
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  ],
];

const focusAreas = [
  {
    title: "Computer vision",
    description:
      "Building visual-recognition systems, including research presented on real-time object detection using YOLO.",
  },
  {
    title: "Medical image analysis",
    description:
      "Researching deep-learning approaches to glioma detection and segmentation in brain MRI scans.",
  },
  {
    title: "Deep learning",
    description:
      "Developing and optimizing convolutional neural networks and PyTorch model pipelines.",
  },
  {
    title: "Intelligent systems",
    description:
      "Applying machine learning to predictive cell-fault detection in a high-voltage battery management system.",
  },
  {
    title: "Generative modeling",
    description:
      "Exploring 3D volumetric reconstruction from 2D shadow projections with a Blender-generated synthetic dataset.",
  },
];

const projects = [
  {
    title: "Brain Tumor Detection",
    category: "MEDICAL IMAGING · DEEP LEARNING",
    description:
      "A CNN-based research framework for automated glioma detection and segmentation in MRI scans, with a focus on reducing false negatives.",
    technologies: "PYTHON · PYTORCH · COMPUTER VISION",
    repo: "Brain-Tumor-Detection-ML-model",
  },
  {
    title: "Deep-Shadow Volumetry",
    category: "3D RECONSTRUCTION · DEEP LEARNING",
    description:
      "A deep-learning pipeline exploring how to reconstruct 3D volumetric shapes from 2D shadow projections, trained on synthetic Blender data.",
    technologies: "PYTHON · PYTORCH · BLENDER",
    repo: "DEEP-SHADOW-VOLUMETRY",
  },
  {
    title: "AI-Based Policy Maker",
    category: "ARTIFICIAL INTELLIGENCE · OPTIMIZATION",
    description:
      "An AI simulation framework using genetic algorithms to optimize policy parameters across generations and evaluate potential outcomes.",
    technologies: "PYTHON · GENETIC ALGORITHMS",
    repo: "AI-based-Policy-maker",
  },
];

const experience = [
  {
    date: "FEB 2025 — PRESENT",
    title: "Machine Learning Intern",
    organization: "Dextora · Remote",
    description:
      "Contributing to computer-vision and deep-learning models, product prototypes, and deployment pipelines for intelligent automation.",
  },
  {
    date: "JUN 2025 — OCT 2025",
    title: "Research Intern",
    organization: "VIT Chennai · Dr. Sunil Kumar Pradhan",
    description:
      "Developed a deep-learning framework for automated glioma detection and segmentation in medical images.",
  },
  {
    date: "JAN 2025 — PRESENT",
    title: "Core Electronics Member & BMS Engineer",
    organization: "Dromos Hyperloop Team · VIT Chennai",
    description:
      "Built a high-voltage master–slave battery management system and explored ML-based cell-fault detection. Won Best Electrical System and Best Embedded System at GHC ’26 (IIT Madras).",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yagnesh Balineni — Machine Learning & Computer Vision" },
      {
        name: "description",
        content:
          "Yagnesh Balineni is a VIT Chennai electronics and computer engineering student, machine learning intern, and computer vision researcher.",
      },
      {
        property: "og:title",
        content: "Yagnesh Balineni — Machine Learning & Computer Vision",
      },
      {
        property: "og:description",
        content:
          "Machine learning, computer vision, and research projects by Yagnesh Balineni, a VIT Chennai engineering student.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  component: Portfolio,
});

function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Magnet({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const bounds = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const box = bounds.current?.getBoundingClientRect();
    if (!box) return;

    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    const padding = 150;

    if (
      Math.abs(x) > box.width / 2 + padding ||
      Math.abs(y) > box.height / 2 + padding
    ) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    setOffset({ x: x / 3, y: y / 3 });
  }

  return (
    <div
      ref={bounds}
      className="creator-magnet"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
    >
      {children}
    </div>
  );
}

function TextCharacter({
  character,
  index,
  total,
  progress,
}: {
  character: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.75;
  const end = Math.min(start + 0.25, 1);
  const opacity = useTransform(progress, [start, end], [0.24, 1]);

  return (
    <motion.span style={{ opacity }}>
      {character === " " ? "\u00a0" : character}
    </motion.span>
  );
}

function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <p ref={ref} className="creator-bio">
      {Array.from(text).map((character, index) => (
        <TextCharacter
          key={`${character}-${index}`}
          character={character}
          index={index}
          total={text.length}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function PortfolioMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sectionTop =
          sectionRef.current?.getBoundingClientRect().top ?? 0;
        setScrollOffset((window.innerHeight - sectionTop) * 0.3);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const firstRow = [...showcaseImages.slice(0, 11)];
  const secondRow = [...showcaseImages.slice(11)];

  return (
    <section
      ref={sectionRef}
      className="creator-marquee-section bg-background"
      aria-label="Motion and creative inspiration"
    >
      {[firstRow, secondRow].map((row, rowIndex) => {
        const distance = scrollOffset - 200;
        const translate = rowIndex === 0 ? distance : -distance;

        return (
          <div className="creator-marquee-window" key={rowIndex}>
            <div
              className="creator-marquee-track"
              style={{ transform: `translate3d(${translate}px, 0, 0)` }}
            >
              {[...row, ...row, ...row].map((src, imageIndex) => (
                <img
                  className="creator-marquee-image"
                  src={src}
                  key={`${src}-${imageIndex}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (2 - index) * 0.03]);
  const art = originalProjectArtwork[index];

  if (!art) return null;

  return (
    <div
      ref={section}
      className="creator-project-stack"
      data-index={index}
    >
      <motion.article
        className="creator-project-card"
        style={{ scale }}
        aria-labelledby={`project-title-${index}`}
      >
        <header className="creator-project-heading">
          <span className="creator-project-number" aria-hidden="true">
            0{index + 1}
          </span>
          <div className="creator-project-details">
            <span className="creator-project-category">{project.category}</span>
            <h3
              className="creator-project-title"
              id={`project-title-${index}`}
            >
              {project.title}
            </h3>
            <p className="creator-project-description">{project.description}</p>
            <p className="creator-project-technologies">
              {project.technologies}
            </p>
          </div>
          <a
            className="creator-live-button"
            href={`${github}/${project.repo}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${project.title} on GitHub`}
          >
            View on GitHub <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="creator-project-artwork">
          <div className="creator-project-artwork-stack">
            <img src={art[0]} alt="" loading="lazy" decoding="async" />
            <img src={art[1]} alt="" loading="lazy" decoding="async" />
          </div>
          <img
            className="creator-project-artwork-feature"
            src={art[2]}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </motion.article>
    </div>
  );
}

function Portfolio() {
  return (
    <main className="creator-site">
      <section className="creator-hero" aria-labelledby="creator-title">
        <header className="creator-nav">
          <Reveal>
            <nav className="creator-nav-links" aria-label="Main navigation">
              <a href="#about">About</a>
              <a href="#focus">ML focus</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
          </Reveal>
        </header>

        <div className="creator-hero-title-window">
          <Reveal delay={0.15} y={40}>
            <h1 className="creator-hero-title" id="creator-title">
              Hi, i&apos;m Yagnesh
            </h1>
          </Reveal>
        </div>

        <Reveal className="creator-portrait" delay={0.6} y={30}>
          <Magnet>
            <img
              src={heroPortrait.url}
              alt=""
              fetchPriority="high"
            />
          </Magnet>
        </Reveal>

        <div className="creator-hero-bottom">
          <Reveal delay={0.35} y={20}>
            <p className="creator-hero-intro">
              Machine learning · Computer vision · VIT Chennai
            </p>
          </Reveal>
          <Reveal delay={0.5} y={20}>
            <a className="creator-contact-button" href={`${github}#contact`}>
              Contact me <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
      </section>

      <PortfolioMarquee />

      <section
        className="creator-about-section bg-background"
        id="about"
        aria-labelledby="about-heading"
      >
        <img
          className="creator-decor creator-decor-moon"
          src={moonArtwork.url}
          alt=""
          loading="lazy"
        />
        <img
          className="creator-decor creator-decor-object"
          src={objectArtwork.url}
          alt=""
          loading="lazy"
        />
        <img
          className="creator-decor creator-decor-lego"
          src={legoArtwork.url}
          alt=""
          loading="lazy"
        />
        <img
          className="creator-decor creator-decor-group"
          src={groupArtwork.url}
          alt=""
          loading="lazy"
        />

        <Reveal className="creator-about-content">
          <h2 className="creator-section-heading" id="about-heading">
            About me
          </h2>
          <ScrollText
            text="I’m an Electronics and Computer Engineering student at VIT Chennai, a machine learning intern at Dextora, and a researcher interested in solving real-world problems with computer vision and deep learning. My work includes medical-image analysis, brain-tumor segmentation, and predictive battery-fault detection."
          />

          <div className="creator-experience">
            <h3 className="creator-experience-heading">Experience</h3>
            {experience.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <article className="creator-experience-row">
                  <p className="creator-experience-date">{item.date}</p>
                  <div>
                    <h4 className="creator-experience-title">{item.title}</h4>
                    <p className="creator-experience-organization">
                      {item.organization}
                    </p>
                    <p className="creator-experience-description">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="creator-education">
            <span>VIT CHENNAI</span> · B.TECH, ELECTRONICS &amp; COMPUTER
            ENGINEERING · 2023—2027 · CGPA 8.00/10
          </p>

          <p className="creator-education creator-publication">
            RESEARCH PRESENTATION · REAL-TIME OBJECT DETECTION USING YOLO ·
            ICPEDC ’25
          </p>

          <a className="creator-contact-button" href={`${github}#contact`}>
            Contact me <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </section>

      <section
        className="creator-focus-section"
        id="focus"
        aria-labelledby="focus-heading"
      >
        <Reveal>
          <h2 className="creator-focus-heading" id="focus-heading">
            ML Focus
          </h2>
        </Reveal>
        <div className="creator-focus-list">
          {focusAreas.map((area, index) => (
            <Reveal key={area.title} delay={index * 0.1}>
              <article className="creator-focus-row">
                <span className="creator-focus-number">0{index + 1}</span>
                <div className="creator-focus-copy">
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        className="creator-projects-section"
        id="projects"
        aria-labelledby="projects-heading"
      >
        <Reveal>
          <h2 className="creator-section-heading" id="projects-heading">
            Selected projects
          </h2>
        </Reveal>
        <div className="creator-project-list">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
        <footer className="creator-footer" id="contact">
          <Reveal>
            <p className="creator-footer-eyebrow">LET’S CONNECT</p>
            <h2>Interested in machine learning?</h2>
            <p className="creator-footer-copy">
              Find my work, research, and latest projects on GitHub.
            </p>
            <a
              className="creator-contact-button"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              Find me on GitHub <span aria-hidden="true">↗</span>
            </a>
            <p className="creator-footer-credit">YAGNESh BALINENI · VIT CHENNAI</p>
          </Reveal>
        </footer>
      </section>
    </main>
  );
}
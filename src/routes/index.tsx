import { createFileRoute } from "@tanstack/react-router";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import moonArtwork from "@/assets/moon_icon.11395d36.png.asset.json";
import objectArtwork from "@/assets/p59_1.4659672e.png.asset.json";
import legoArtwork from "@/assets/lego_icon-1.703bb594.png.asset.json";
import groupArtwork from "@/assets/Group_134-1.2e04f3ce.png.asset.json";
import Lenis from "lenis";
import {
  education,
  experience,
  focusAreas,
  heroStats,
  profile,
  projectArtwork,
  projects,
  publications,
  showcaseRows,
  skills,
  type Project,
} from "./-portfolio-data";

const pageTitle = `${profile.name} — ${profile.role}`;
const pageDescription = `${profile.name} — ${profile.role} at ${profile.school}. Computer vision, medical imaging, generative AI and energy-efficient spiking neural networks.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { name: "author", content: profile.name },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:type", content: "website" },
      { property: "og:image", content: profile.avatar },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0e0e10" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap",
      },
      { rel: "preload", as: "image", href: profile.avatar, type: "image/webp" },
    ],
  }),
  component: Portfolio,
});

const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * Hero entrances run in CSS (see .creator-enter / .creator-rise) so the name and
 * the avatar are visible straight from the server-rendered HTML, even before or
 * without JavaScript.
 */
const enterDelay = (seconds: number) =>
  ({ ["--enter-delay" as string]: `${seconds}s` }) as CSSProperties;

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#focus", label: "ML focus" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

/* ───────────────────────── Reusable display helpers ───────────────────────── */

function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
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
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ delay, duration, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

function Arrow({ direction = "up-right" }: { direction?: "up-right" | "down" | "up" }) {
  const glyph = direction === "down" ? "↓" : direction === "up" ? "↑" : "↗";
  return (
    <span className="creator-arrow" aria-hidden="true">
      {glyph}
    </span>
  );
}

type RangeFromLayout = (top: number, height: number, viewport: number) => [number, number];

/**
 * 0→1 progress of the page scroll between two document positions derived from
 * an element's layout. Re-measures whenever the page height changes (fonts,
 * styles, images), so the value is right on first paint — not only after the
 * first scroll event.
 */
function useLayoutScrollProgress(ref: RefObject<HTMLElement | null>, getRange: RangeFromLayout) {
  const { scrollY } = useScroll();
  const start = useMotionValue(Number.MAX_SAFE_INTEGER);
  const end = useMotionValue(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const top = element.getBoundingClientRect().top + window.scrollY;
      const [from, to] = getRange(top, element.offsetHeight, window.innerHeight);
      start.set(from);
      end.set(to);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [ref, getRange, start, end]);

  return useTransform([scrollY, start, end], (values: number[]) => {
    const [y = 0, from = 0, to = 0] = values;
    return to <= from ? 0 : Math.min(1, Math.max(0, (y - from) / (to - from)));
  });
}

/** From the marker entering the bottom of the viewport until it reaches the top. */
const coverRange: RangeFromLayout = (top, _height, viewport) => [top - viewport, top];

/** While a tall element scrolls from its top at the viewport top to its bottom at the viewport bottom. */
const throughRange: RangeFromLayout = (top, height, viewport) => [top, top + height - viewport];

/**
 * A full-width "sheet" in the layered scroll. Each sheet sticks once its
 * bottom edge reaches the bottom of the viewport, so the next sheet slides
 * over it. While it is being covered it recedes (scales down and darkens).
 */
function StackSheet({
  id,
  className = "",
  labelledBy,
  label,
  layer,
  sticky = true,
  children,
}: {
  id?: string;
  className?: string;
  labelledBy?: string;
  label?: string;
  layer: number;
  sticky?: boolean;
  children: ReactNode;
}) {
  const sheetRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [top, setTop] = useState(0);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet || !sticky) return;

    // Stick when the sheet's bottom edge meets the bottom of the viewport.
    const measure = () => setTop(window.innerHeight - sheet.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [sticky]);

  const coverProgress = useLayoutScrollProgress(endRef, coverRange);
  const scale = useTransform(coverProgress, [0, 1], [1, reduceMotion ? 1 : 0.9]);
  const shade = useTransform(coverProgress, [0, 1], [0, 0.75]);

  return (
    <>
      {id ? <span id={id} className="creator-anchor" aria-hidden="true" /> : null}
      <motion.section
        ref={sheetRef}
        className={`creator-sheet ${className}`}
        aria-labelledby={labelledBy}
        aria-label={label}
        style={
          sticky
            ? { position: "sticky", top, zIndex: layer, scale }
            : { position: "relative", zIndex: layer }
        }
      >
        {children}
        {sticky ? (
          <motion.div
            className="creator-sheet-shade"
            style={{ opacity: shade }}
            aria-hidden="true"
          />
        ) : null}
      </motion.section>
      <div ref={endRef} className="creator-sheet-end" aria-hidden="true" />
    </>
  );
}

/**
 * Inertia-smoothed page scrolling (Lenis). It drives the real window scroll,
 * so sticky sheets and every scroll-linked effect keep working; it also takes
 * over in-page anchor links and honours prefers-reduced-motion.
 */
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    return () => lenis.destroy();
  }, []);
}

function SiteHeader() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => scrollY.on("change", (value) => setScrolled(value > 40)), [scrollY]);

  return (
    <header className={`creator-header${scrolled ? " is-scrolled" : ""}`}>
      <motion.div
        className="creator-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <div className="creator-header-inner">
        <a className="creator-logo" href="#top" aria-label={`${profile.name} — back to top`}>
          YB<span>.</span>
        </a>
        <nav className="creator-nav-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="creator-header-resume" href={profile.resume} download>
          Résumé <Arrow direction="down" />
        </a>
      </div>
    </header>
  );
}

/** The 3D, floating, pointer-tilted portrait. */
function FloatingAvatar() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 16, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 16, mass: 0.6 });

  const rotateY = useTransform(springX, [-1, 1], [-18, 18]);
  const rotateX = useTransform(springY, [-1, 1], [11, -11]);
  const auraX = useTransform(springX, [-1, 1], [30, -30]);
  const auraY = useTransform(springY, [-1, 1], [20, -20]);
  const lightX = useTransform(springX, [-1, 1], [22, 78]);
  const lightY = useTransform(springY, [-1, 1], [18, 58]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, rgb(255 255 255 / 0.32), rgb(255 255 255 / 0) 42%)`;
  const shadowX = useTransform(springX, [-1, 1], [-26, 26]);

  useEffect(() => {
    if (reduceMotion) return;

    // Touch screens have no hover: let the bust sway gently on its own.
    if (window.matchMedia("(hover: none)").matches) {
      let frame = 0;
      const startedAt = performance.now();
      const tick = (now: number) => {
        const t = (now - startedAt) / 1000;
        pointerX.set(Math.sin(t * 0.55) * 0.6);
        pointerY.set(Math.cos(t * 0.4) * 0.35);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }

    const handleMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const handleLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div className="creator-avatar-stage">
      <motion.div
        className="creator-avatar-aura"
        style={{ x: auraX, y: auraY }}
        aria-hidden="true"
      />

      <motion.div className="creator-avatar-tilt" style={{ rotateX, rotateY }}>
        <div className="creator-avatar-halo" aria-hidden="true" />
        <div className="creator-avatar-pedestal" aria-hidden="true">
          <span />
        </div>

        <div className="creator-avatar-float">
          <img
            className="creator-avatar-image"
            src={profile.avatar}
            alt={`3D portrait of ${profile.name}`}
            width={697}
            height={1100}
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
          <motion.div
            className="creator-avatar-sheen"
            style={{ backgroundImage: sheen }}
            aria-hidden="true"
          />
        </div>
      </motion.div>

      <motion.div className="creator-avatar-shadow" style={{ x: shadowX }} aria-hidden="true" />
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const copyY = useTransform(scrollY, [0, 800], [0, reduceMotion ? 0 : -110]);
  const visualY = useTransform(scrollY, [0, 800], [0, reduceMotion ? 0 : 90]);
  const cueOpacity = useTransform(scrollY, [0, 160], [1, 0]);

  return (
    <div className="creator-hero" id="top">
      <div className="creator-hero-backdrop" aria-hidden="true" />

      <div className="creator-hero-grid">
        <motion.div className="creator-hero-visual" style={{ y: visualY }}>
          <FloatingAvatar />
        </motion.div>

        <motion.div className="creator-hero-copy" style={{ y: copyY }}>
          <div className="creator-enter" style={enterDelay(0.1)}>
            <p className="creator-kicker">
              <span className="creator-kicker-rule" aria-hidden="true" />
              {profile.role}
              <span className="creator-kicker-sep" aria-hidden="true">
                /
              </span>
              {profile.school}
            </p>
          </div>

          <h1 className="creator-hero-title" id="creator-title">
            <span className="creator-hero-line creator-hero-hi">
              <span className="creator-rise" style={enterDelay(0.15)}>
                Hi, I&apos;m
              </span>
            </span>
            <span className="creator-hero-line">
              <span className="creator-rise creator-gradient-text" style={enterDelay(0.25)}>
                {profile.firstName}
              </span>
            </span>
            <span className="creator-hero-line">
              <span className="creator-rise creator-outline-text" style={enterDelay(0.38)}>
                {profile.lastName}
              </span>
            </span>
          </h1>

          <div className="creator-enter" style={enterDelay(0.55)}>
            <p className="creator-hero-intro">{profile.intro}</p>
          </div>

          <div className="creator-enter creator-hero-actions" style={enterDelay(0.68)}>
            <a className="creator-contact-button" href="#contact">
              Contact me <Arrow />
            </a>
            <a className="creator-ghost-button" href={profile.resume} download>
              Download résumé <Arrow direction="down" />
            </a>
          </div>

          <div className="creator-enter" style={enterDelay(0.8)}>
            <dl className="creator-hero-stats">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>

      <motion.a className="creator-scroll-cue" href="#about" style={{ opacity: cueOpacity }}>
        <span className="creator-scroll-cue-line" aria-hidden="true" />
        Scroll
      </motion.a>
    </div>
  );
}

/**
 * Paragraph that lights up word by word as it scrolls through view. Scroll
 * progress is written to a single CSS variable (--p) on the paragraph; each word
 * derives its own opacity from it in CSS, so a scroll frame costs one style
 * write instead of hundreds of animated elements.
 */
function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    ref.current?.style.setProperty("--p", value.toFixed(4));
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className="creator-bio">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span
              className="creator-bio-word"
              style={{ ["--s" as string]: ((index / words.length) * 0.75).toFixed(4) }}
            >
              {word}
            </span>{" "}
          </Fragment>
        ))}
      </span>
    </p>
  );
}

function PortfolioMarquee() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  // Same starting offsets on server and client; reduced motion only freezes the drift.
  const speed = reduceMotion ? 0 : 0.3;
  const forward = useTransform(scrollY, (value) => value * speed - 1400);
  const backward = useTransform(scrollY, (value) => -(value * speed) - 400);

  return (
    <div className="creator-marquee">
      {showcaseRows.map((row, rowIndex) => (
        <div className="creator-marquee-window" key={rowIndex}>
          <motion.div
            className="creator-marquee-track"
            style={{ x: rowIndex === 0 ? forward : backward }}
          >
            {[...row, ...row, ...row].map((tile, tileIndex) => (
              <figure
                className="creator-marquee-tile"
                key={`${tile.src}-${tileIndex}`}
                aria-hidden={tileIndex >= row.length ? true : undefined}
              >
                <img
                  className="creator-marquee-image"
                  src={tile.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{tile.label}</figcaption>
              </figure>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="creator-section-label">
      <span>{index}</span>
      {children}
    </p>
  );
}

function AboutSection() {
  return (
    <div className="creator-about">
      {[
        { art: moonArtwork, name: "moon" },
        { art: objectArtwork, name: "object" },
        { art: legoArtwork, name: "lego" },
        { art: groupArtwork, name: "group" },
      ].map(({ art, name }) => (
        <img
          key={name}
          className={`creator-decor creator-decor-${name}`}
          src={art.url}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ))}

      <div className="creator-about-content">
        <Reveal>
          <SectionLabel index="01">About</SectionLabel>
          <h2 className="creator-section-heading" id="about-heading">
            About me
          </h2>
        </Reveal>

        <ScrollText text={profile.bio} />

        <Reveal className="creator-facts">
          <span>{profile.location}</span>
          <span>B.Tech ECE · 2027</span>
          <span>CGPA 8.01</span>
          <span>2 papers</span>
        </Reveal>

        <div className="creator-block">
          <Reveal>
            <h3 className="creator-block-heading">Experience</h3>
          </Reveal>
          <ol className="creator-timeline">
            {experience.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <li className="creator-timeline-item">
                  <div className="creator-timeline-meta">
                    <p className="creator-timeline-date">{item.date}</p>
                    <p className="creator-timeline-location">{item.location}</p>
                  </div>
                  <div className="creator-timeline-body">
                    <h4>{item.title}</h4>
                    <p className="creator-timeline-org">{item.organization}</p>
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="creator-info-grid">
          <Reveal className="creator-info-card">
            <h3 className="creator-block-heading">Education</h3>
            <ul className="creator-info-list">
              {education.map((item) => (
                <li key={item.school}>
                  <div>
                    <p className="creator-info-title">{item.school}</p>
                    <p className="creator-info-meta">
                      {item.detail} · {item.meta}
                    </p>
                  </div>
                  <span className="creator-info-score">{item.score}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="creator-info-card" delay={0.1}>
            <h3 className="creator-block-heading">Publications</h3>
            <ul className="creator-info-list">
              {publications.map((item) => (
                <li key={item.title}>
                  <div>
                    <p className="creator-info-title">{item.title}</p>
                    <p className="creator-info-meta">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="creator-block">
          <Reveal>
            <h3 className="creator-block-heading">Technical skills</h3>
          </Reveal>
          <div className="creator-skills">
            {skills.map((group, index) => (
              <Reveal key={group.group} delay={index * 0.06} className="creator-skill-group">
                <p className="creator-skill-name">{group.group}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="creator-about-actions">
          <a className="creator-contact-button" href="#contact">
            Contact me <Arrow />
          </a>
          <a className="creator-ghost-button" href={profile.resume} download>
            Download résumé <Arrow direction="down" />
          </a>
        </Reveal>
      </div>
    </div>
  );
}

function FocusSection() {
  return (
    <div className="creator-focus">
      <Reveal>
        <SectionLabel index="02">What I work on</SectionLabel>
        <h2 className="creator-focus-heading" id="focus-heading">
          ML Focus
        </h2>
      </Reveal>
      <div className="creator-focus-list">
        {focusAreas.map((area, index) => (
          <Reveal key={area.title} delay={index * 0.06}>
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
    </div>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const steps = Math.max(total - 1, 1);
  const isLast = index === total - 1;
  const start = index / steps;
  const targetScale = reduceMotion ? 1 : 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(
    progress,
    [start, Math.min((index + 1) / steps, 1)],
    [0, isLast ? 0 : 0.55],
  );
  const art = projectArtwork[index];

  return (
    <div
      className="creator-project-stack"
      style={{ ["--stack-index" as string]: index, ["--stack-total" as string]: total }}
    >
      <motion.article
        className={`creator-project-card${art ? "" : " is-visual"}`}
        style={{ scale }}
        aria-labelledby={`project-title-${index}`}
      >
        <header className="creator-project-heading">
          <span className="creator-project-number" aria-hidden="true">
            0{index + 1}
          </span>
          <div className="creator-project-details">
            <p className="creator-project-category">
              {project.category} <span>· {project.period}</span>
            </p>
            <h3 className="creator-project-title" id={`project-title-${index}`}>
              {project.title}
            </h3>
          </div>
          {project.repo ? (
            <a
              className="creator-live-button"
              href={`${profile.github}/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} on GitHub`}
            >
              View on GitHub <Arrow />
            </a>
          ) : (
            <span className="creator-live-button is-static">{project.status ?? "Case study"}</span>
          )}
        </header>

        <div className="creator-project-body">
          <div className="creator-project-info">
            <p className="creator-project-description">{project.description}</p>
            <dl className="creator-project-stats">
              {project.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="creator-project-tech" aria-label="Technologies">
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          {art ? (
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
          ) : (
            <div className="creator-project-visual" aria-hidden="true">
              <span className="creator-project-visual-value">{project.stats[0]?.value}</span>
              <span className="creator-project-visual-label">{project.stats[0]?.label}</span>
            </div>
          )}
        </div>

        <motion.div className="creator-project-dim" style={{ opacity: dim }} aria-hidden="true" />
      </motion.article>
    </div>
  );
}

function ProjectStack() {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useLayoutScrollProgress(listRef, throughRange);

  return (
    <div className="creator-project-list" ref={listRef}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={index}
          total={projects.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function ContactFooter() {
  return (
    <footer className="creator-footer">
      <span id="contact" className="creator-anchor" aria-hidden="true" />
      <Reveal className="creator-footer-inner">
        <SectionLabel index="04">Let’s connect</SectionLabel>
        <h2>
          Let’s build something <span className="creator-gradient-text">intelligent.</span>
        </h2>
        <p className="creator-footer-copy">
          Open to conversations about machine learning, computer vision and research collaborations.
        </p>
        <a className="creator-footer-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="creator-footer-actions">
          <a className="creator-contact-button" href={`mailto:${profile.email}`}>
            Email me <Arrow />
          </a>
          <a
            className="creator-ghost-button"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <Arrow />
          </a>
          <a
            className="creator-ghost-button"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
          <a className="creator-ghost-button" href={profile.resume} download>
            Résumé <Arrow direction="down" />
          </a>
        </div>
      </Reveal>
      <div className="creator-footer-bottom">
        <p>© 2026 {profile.name} · VIT Chennai</p>
        <a href="#top">
          Back to top <Arrow direction="up" />
        </a>
      </div>
    </footer>
  );
}

function Portfolio() {
  useSmoothScroll();

  return (
    <main className="creator-site">
      <SiteHeader />

      <StackSheet className="creator-sheet-hero" labelledBy="creator-title" layer={1}>
        <Hero />
      </StackSheet>

      <StackSheet className="creator-sheet-marquee" label="Highlights from my work" layer={2}>
        <PortfolioMarquee />
      </StackSheet>

      <StackSheet id="about" className="creator-sheet-about" labelledBy="about-heading" layer={3}>
        <AboutSection />
      </StackSheet>

      <StackSheet id="focus" className="creator-sheet-focus" labelledBy="focus-heading" layer={4}>
        <FocusSection />
      </StackSheet>

      <StackSheet
        id="projects"
        className="creator-sheet-projects"
        labelledBy="projects-heading"
        layer={5}
        sticky={false}
      >
        <div className="creator-projects-intro">
          <Reveal>
            <SectionLabel index="03">Selected work</SectionLabel>
            <h2 className="creator-section-heading" id="projects-heading">
              Selected projects
            </h2>
          </Reveal>
        </div>
        <ProjectStack />
        <ContactFooter />
      </StackSheet>
    </main>
  );
}

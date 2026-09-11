import { projects, coursework, contacts } from '@/data/portfolio';
import { about } from '@/data/workspace';

export function ProjectContent({ featured = false }) {
  return <div className="project-list">{(featured ? projects.slice(0, 1) : projects).map((project, index) => <article key={project.id} className="project-item">
    <img src={project.image} alt={`${project.title} application screenshot`} loading="lazy" width="720" height="405" />
    <div className="project-title"><span className="eyebrow">0{index + 1}</span><h3>{project.title}</h3><span className="project-status">Completed</span></div>
    <p>{project.dis.replace('that that', 'that')}</p>
    <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    <div className="project-links"><a href={project.link} target="_blank" rel="noopener noreferrer">View source <span>↗</span></a>{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live demo <span>↗</span></a>}</div>
  </article>)}</div>;
}
export function AboutContent() {
  return <><div className="school-line"><img src="/SFU-block-logo.png" alt="SFU" width="44" height="24" /><span>Computer Science · Simon Fraser University</span></div>{about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</>;
}
export function CourseworkContent() {
  return <><div className="course-list">{coursework.map((course) => <details key={course.title}><summary><span className="eyebrow">{course.title}</span><strong>{course.description}</strong><span className="plus">+</span></summary><div className="tags">{course.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={course.link} target="_blank" rel="noopener noreferrer">Course details ↗</a></details>)}</div></>;
}
export function ResumeContent({ preview = false }) {
  return <><div className="resume-paper"><span className="eyebrow">CURRICULUM VITAE</span><h3>Amar Koonar</h3><p>Computer Science<br />Simon Fraser University</p><span className="paper-rule" /><p>Web development<br />Software engineering<br />Full-stack applications</p><span className="paper-mark">AK.</span></div><div className="project-links"><a href="/Amars_Resume.pdf" target="_blank" rel="noopener noreferrer">Open resume ↗</a><a href="/Amars_Resume.pdf" download>Download PDF ↓</a></div>{preview && <iframe className="resume-preview" src="/Amars_Resume.pdf" title="Amar Koonar’s resume" loading="lazy" />}</>;
}
export function ContactContent() {
  return <><div className="contact-list">{contacts.map((contact) => <a key={contact.name} href={contact.link} {...(contact.link.startsWith('https') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><img src={contact.icon} alt="" width="23" height="23" /><span><strong>{contact.name}</strong><small>{contact.link.startsWith('mailto:') ? contact.link.slice(7) : contact.name === 'GitHub' ? '@amarkoonar' : 'Amar Koonar'}</small></span><span>↗</span></a>)}</div></>;
}
export function SectionContent({ section }) {
  if (section === 'projects' || section === 'featured') return <ProjectContent featured={section === 'featured'} />;
  if (section === 'about') return <AboutContent />;
  if (section === 'coursework') return <CourseworkContent />;
  if (section === 'resume') return <ResumeContent preview />;
  if (section === 'contact') return <ContactContent />;
  return null;
}
// Server-rendered copy remains available without JavaScript or WebGL.
export default function PortfolioContent() {
  return <div className="reading-content"><header><span className="eyebrow">AMAR KOONAR / PORTFOLIO</span><h1>Hi, I’m Amar.<br />I like to build things.</h1></header><nav aria-label="Portfolio sections">{['Projects', 'About', 'Coursework', 'Resume', 'Contact'].map((name) => <a key={name} href={`#read-${name.toLowerCase()}`}>{name}</a>)}</nav>
    <section id="read-projects"><h2>Selected projects</h2><ProjectContent /></section>
    <section id="read-about"><h2>About me</h2><AboutContent /></section>
    <section id="read-coursework"><h2>Coursework</h2><CourseworkContent /></section>
    <section id="read-resume"><h2>Resume</h2><ResumeContent /></section>
    <section id="read-contact"><h2>Say hello.</h2><ContactContent /></section>
    <footer>© Amar Koonar</footer>
  </div>;
}

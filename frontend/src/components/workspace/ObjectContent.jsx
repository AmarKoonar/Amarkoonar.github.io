"use client";
import { useState } from 'react';
import DrawingPad from './DrawingPad';
import { projects, contacts } from '@/data/portfolio';
import { AboutContent, CourseworkContent } from './PortfolioContent';

export function ScreenProjects() {
  const [selected, setSelected] = useState(null);
  return <div className="monitor-content">
    <header className="monitor-toolbar"><span className="window-dots">● ● ●</span><span>amar / projects</span><span>04 builds</span></header>
    <div className="monitor-scroll">
      {selected ? <article className="screen-project-detail">
        <button className="screen-back" onClick={() => setSelected(null)}>← All projects</button>
        <h2>{selected.title}</h2><img src={selected.image} alt={`${selected.title} screenshot`} />
        <p>{selected.dis.replace('that that', 'that')}</p>
        <div className="tags">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-links"><a href={selected.link} target="_blank" rel="noopener noreferrer">View source ↗</a>{selected.demoUrl && <a href={selected.demoUrl} target="_blank" rel="noopener noreferrer">Live demo ↗</a>}</div>
      </article> : <><div className="monitor-heading"><h2>Things I’ve built.</h2></div>
        <div className="monitor-project-grid">{projects.map((project, index) => <button key={project.id} onClick={() => setSelected(project)}>
          <img src={project.image} alt={`${project.title} screenshot`} /><div><small>0{index + 1}</small><h3>{project.title}</h3><span>↗</span></div>
        </button>)}</div></>}
    </div>
  </div>;
}

export function PageAbout() {
  return <div className="page-content about-page"><div className="about-bio"><span className="eyebrow">FIELD NOTES / 01</span><h2>Hi, I’m Amar.</h2><AboutContent /></div><DrawingPad /></div>;
}
export function PageCoursework() {
  return <div className="page-content"><span className="eyebrow">COMPUTER SCIENCE / SFU</span><h2>Coursework.</h2><CourseworkContent /></div>;
}
export function PaperResume() {
  const [enlarged, setEnlarged] = useState(false);
  return <div className="paper-document">
    <div className="paper-controls"><button aria-pressed={enlarged} onClick={() => setEnlarged(!enlarged)}>{enlarged ? 'Fit page' : 'Larger text +'}</button><a href="/Amars_Resume.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a><a href="/Amars_Resume.pdf" download>Download ↓</a></div>
    <div className="paper-document-scroll"><img style={{ width: enlarged ? '155%' : '100%' }} src="/resume/page-1.png" alt="Amar Koonar’s full resume. Use Open PDF for the accessible original document." /></div>
  </div>;
}
export function PhoneContacts() {
  return <div className="phone-content"><div className="phone-speaker" aria-hidden="true" /><span className="phone-status">AMAR KOONAR</span><h2>Contact</h2><div className="phone-contacts">{contacts.map((contact) => <a key={contact.name} href={contact.link} {...(contact.link.startsWith('https') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><img src={contact.icon} alt="" /><span>{contact.name}<small>{contact.link.startsWith('mailto:') ? contact.link.slice(7) : 'Amar Koonar'}</small></span><b>↗</b></a>)}</div><div className="phone-home-bar" aria-hidden="true" /></div>;
}

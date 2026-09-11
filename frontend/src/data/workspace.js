export const chapters = [
  { id: 'home', label: 'The desk', object: 'Workspace', heading: 'A little curiosity.\nA lot of possibility.', position: [8.4, 7.6, 10.4], target: [-1.3, 0.4, 0] },
  { id: 'projects', label: 'Projects', object: 'The monitor', heading: 'Projects', position: [3.1, 3.8, 6.5], target: [-1.2, 1.2, -0.7] },
  { id: 'about', label: 'About me', object: 'The notebook', heading: 'About Me', position: [5, 5.8, 5.4], target: [2.5, 0.1, 1.4] },
  { id: 'coursework', label: 'Coursework', object: 'The study stack', heading: 'Coursework', position: [-3.5, 4.6, 5.3], target: [-4.1, 0.35, -0.6] },
  { id: 'resume', label: 'Resume', object: 'The resume', heading: 'Resume', position: [5.8, 5.9, 5.3], target: [1.5, 0.2, -0.1] },
  { id: 'contact', label: 'Contact', object: 'The phone', heading: 'Contact', position: [5.3, 4.8, 6.5], target: [1.5, 0.3, 1.55] },
];
export const about = [
  'I am a passionate and driven Computer Science student at Simon Fraser University, specializing in web development, software engineering, and full-stack applications. With a strong foundation in React, JavaScript, and Python, I enjoy building dynamic, user-focused solutions that are both scalable and efficient.',
  'I am excited to continue growing as a developer, contribute to innovative projects, and make a positive difference in the tech community.',
];
export const languages = ['Python', 'JavaScript', 'HTML', 'CSS', 'C++', 'C'];
export const technologies = ['React', 'Git', 'GitHub', 'VS Code', 'Figma', 'Neovim'];
export const chapterIndex = (id) => Math.max(0, chapters.findIndex((chapter) => chapter.id === id));

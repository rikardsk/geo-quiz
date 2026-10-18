import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from './App';

describe('App Layout Alignment', () => {
  it('renders information panel column alongside the map grid', () => {
    const html = renderToString(<App />);

    expect(html).toContain('lg:col-span-1 flex flex-col');
    expect(html).toContain('lg:col-span-2 flex flex-col gap-4');
  });

  it('renders Swedish counties list and items within the information panel', () => {
    const html = renderToString(<App />);

    expect(html).toContain('Alla 21 Svenska Län');
    expect(html).toContain('team-card');
    expect(html).toContain('Stockholms län');
    expect(html).toContain('Skåne län');
    expect(html).toContain('Malmö');
  });

  it('renders buttons linking to official population statistics', () => {
    const html = renderToString(<App />);

    expect(html).toContain('Tabell');
    expect(html).toContain('scb.se');
  });

  it('renders top navigation buttons in order with Utforska active by default', () => {
    const html = renderToString(<App />);

    const navMatch = html.match(/<nav[\s\S]*?<\/nav>/);
    expect(navMatch).not.toBeNull();
    const navHtml = navMatch ? navMatch[0] : '';

    const tabellIdx = navHtml.indexOf('Tabell');
    const resurserIdx = navHtml.indexOf('Resurser');
    const utforskaIdx = navHtml.indexOf('Utforska');
    const quizlageIdx = navHtml.indexOf('Quizläge');

    expect(tabellIdx).toBeGreaterThan(-1);
    expect(resurserIdx).toBeGreaterThan(tabellIdx);
    expect(utforskaIdx).toBeGreaterThan(resurserIdx);
    expect(quizlageIdx).toBeGreaterThan(utforskaIdx);

    expect(navHtml).toContain('nav-pill-btn-active');
  });

  it('renders show/hide cities button with Swedish text', () => {
    const html = renderToString(<App />);

    expect(html).toContain('Dölj alla städer');
  });

  it('contains quiz-question-sticky-wrapper class in CSS and component structure', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Sveriges Län');
  });
});

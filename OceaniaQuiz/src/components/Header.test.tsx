import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Header } from './Header';

describe('Header', () => {
  it('renders search bar without clear button when query is empty', () => {
    const html = renderToString(
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        onSelectStateByName={() => {}}
        searchResults={[]}
      />
    );
    expect(html).toContain('search-input');
    expect(html).not.toContain('aria-label="Clear search"');
    expect(html).toContain('25 South East Asia &amp; Oceania Countries &amp; Capitals Explorer');
  });

  it('renders clear button when query is not empty', () => {
    const html = renderToString(
      <Header
        searchQuery="Australia"
        onSearchChange={() => {}}
        onSelectStateByName={() => {}}
        searchResults={[]}
      />
    );
    expect(html).toContain('aria-label="Clear search"');
  });
});

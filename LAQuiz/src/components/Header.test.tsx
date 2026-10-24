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
  });

  it('renders clear button when query is not empty', () => {
    const html = renderToString(
      <Header
        searchQuery="Brazil"
        onSearchChange={() => {}}
        onSelectStateByName={() => {}}
        searchResults={[]}
      />
    );
    expect(html).toContain('aria-label="Clear search"');
  });
});

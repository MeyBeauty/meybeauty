// SEO-friendly slug utilities

export function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

export function parseSlugFromHash(hash) {
  // New path-style format: #blog-detail/slug-name
  const pathMatch = hash.match(/#blog-detail\/(.+)/);
  if (pathMatch) {
    const slug = decodeURIComponent(pathMatch[1]);
    return { type: 'slug', value: slug };
  }
  
  // Legacy query format: #blog-detail?slug=xxx or #blog-detail?id=xxx
  const idx = hash.indexOf('?');
  const query = idx >= 0 ? hash.slice(idx + 1) : '';
  const params = new URLSearchParams(query);
  
  const slug = params.get('slug');
  if (slug) return { type: 'slug', value: slug };
  
  const id = params.get('id');
  if (id) return { type: 'id', value: id };
  
  return null;
}

export function findPostBySlugOrId(posts, identifier) {
  if (!identifier || !posts) return null;
  
  // First try to find by ID (exact match)
  const byId = posts.find(p => p.id === identifier.value);
  if (byId) return byId;
  
  // If not found and it's a slug, try to match by slug
  if (identifier.type === 'slug') {
    const bySlug = posts.find(p => {
      const postSlug = p.slug || generateSlug(p.title);
      return postSlug === identifier.value;
    });
    if (bySlug) return bySlug;
  }
  
  // Try to match by generated slug from title
  return posts.find(p => {
    const postSlug = p.slug || generateSlug(p.title);
    return postSlug === identifier.value;
  });
}

export function buildPostUrl(post) {
  if (!post) return '#blog';
  const slug = post.slug || generateSlug(post.title);
  return `#blog-detail/${encodeURIComponent(slug)}`;
}

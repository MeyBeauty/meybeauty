import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchPublicPosts } from '../firebase/publicQueries.js';
import { generateSlug } from '../utils/slug.js';

const BlogContext = createContext(null);

const fallbackPosts = [
  {
    id: 'fallback-1',
    dateLabel: '27 Octobre 2024',
    title: 'Beauté & Spa : rituels bien‑être à adopter',
    excerpt: 'Inspirations spa, gestes experts et conseils pour une peau lumineuse et un esprit apaisé.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80',
    contentHtml: '<p>Votre contenu ici…</p>',
    status: 'published',
  },
];

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState(fallbackPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const remote = await fetchPublicPosts();
        if (!mounted) return;
        if (Array.isArray(remote) && remote.length > 0) {
          setPosts(remote);
        } else {
          setPosts(fallbackPosts);
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load posts');
        setPosts(fallbackPosts);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const byId = useMemo(() => {
    const map = new Map();
    (posts || []).forEach((p) => map.set(p.id, p));
    return map;
  }, [posts]);

  const value = useMemo(
    () => ({
      posts,
      loading,
      error,
      getPostById: (id) => byId.get(id) || null,
      getPostBySlug: (slug) => {
        if (!slug) return null;
        // Find by slug field or generated slug from title
        return (posts || []).find((p) => {
          if (p.slug) return p.slug === slug;
          return generateSlug(p.title) === slug;
        }) || null;
      },
    }),
    [posts, loading, error, byId]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlog must be used within BlogProvider');
  return ctx;
}

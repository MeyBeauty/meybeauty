const PHOTOS = [
  'https://amiy.wpenginepowered.com/wp-content/uploads/2023/10/home-1-instagram-1-300x234.webp',
  'https://images.pexels.com/photos/19101350/pexels-photo-19101350.jpeg',
  'https://images.pexels.com/photos/29745246/pexels-photo-29745246.jpeg',
  'https://images.pexels.com/photos/10460940/pexels-photo-10460940.jpeg',
  'https://images.pexels.com/photos/6663574/pexels-photo-6663574.jpeg',
  'https://images.pexels.com/photos/9246306/pexels-photo-9246306.jpeg',
];

const INSTAGRAM_URL = 'https://www.instagram.com/mey_beauty91/?hl=fr';

function IgIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function InstagramSection() {
  return (
    <section className="instagram-section">
      <div className="section-header">
        <span className="section-kicker">Voir &amp; Suivre</span>
        <h2 className="section-title">Nous sur Instagram</h2>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="instagram-link">
          <IgIcon size={16} />
          <span>@mey_beauty91</span>
        </a>
      </div>
      <div className="instagram-grid">
        {PHOTOS.map((src, idx) => (
          <a key={idx} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`instagram-photo insta-${idx + 1}`}>
            <img className="insta-bg insta-photo" src={src} alt={`Instagram ${idx + 1}`} />
            <span className="instagram-photo-icon">
              <IgIcon size={22} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

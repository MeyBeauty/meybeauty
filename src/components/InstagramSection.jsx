const PHOTOS = [
  'https://amiy.wpenginepowered.com/wp-content/uploads/2023/10/home-1-instagram-1-300x234.webp',
  'https://images.pexels.com/photos/19101350/pexels-photo-19101350.jpeg',
  'https://images.pexels.com/photos/29745246/pexels-photo-29745246.jpeg',
  'https://images.pexels.com/photos/10460940/pexels-photo-10460940.jpeg',
  'https://images.pexels.com/photos/6663574/pexels-photo-6663574.jpeg',
  'https://images.pexels.com/photos/9246306/pexels-photo-9246306.jpeg',
];

const INSTAGRAM_URL = 'https://www.instagram.com/mey_beauty91/?hl=fr';

export default function InstagramSection() {
  return (
    <div className="instagram-section">
      <div className="instagram-header">
        <span className="section-kicker">Voir &amp; Suivre</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="instagram-handle">
          @mey_beauty91
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="instagram-cta">
          Suivre sur Instagram
        </a>
      </div>
      <div className="instagram-grid">
        {PHOTOS.map((src, idx) => (
          <a key={idx} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`instagram-photo insta-${idx + 1}`}>
            <img className="insta-bg insta-photo" src={src} alt={`Instagram ${idx + 1}`} />
          </a>
        ))}
      </div>
    </div>
  );
}

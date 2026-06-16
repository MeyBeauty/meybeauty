const HASHTAGS = [
  '#SoinVisage',
  '#SoinsMinceurEtBienEtre',
  '#SoinSpa',
  '#MassagesCorps',
  '#BeauteDuRegard',
  '#Onglerie',
  '#BrowLift',
  '#RehaussementDeCils',
  '#DrainageLymphatique',
  '#Manucure',
  '#SemiPermanent',
  '#InstitutDeBeaute',
];

export default function HashtagBanner() {
  const doubled = [...HASHTAGS, ...HASHTAGS];

  return (
    <div className="hashtag-banner">
      <div className="hashtag-track">
        {doubled.map((tag, idx) => (
          <span key={`${tag}-${idx}`} className="hashtag-item">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

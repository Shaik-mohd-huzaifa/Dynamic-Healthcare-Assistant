// Utility function to detect and parse embed URLs
export const parseEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.hostname.includes('youtu.be') 
        ? urlObj.pathname.slice(1)
        : new URLSearchParams(urlObj.search).get('v');
      
      return {
        type: 'youtube',
        id: videoId,
        url: `https://www.youtube.com/embed/${videoId}`
      };
    }
    
    // Twitter/X
    if (urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com')) {
      return {
        type: 'twitter',
        url: url
      };
    }
    
    // Images
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return {
        type: 'image',
        url: url
      };
    }
    
    // Default to link preview
    return {
      type: 'link',
      url: url
    };
  } catch (error) {
    console.error('Error parsing embed URL:', error);
    return null;
  }
};

// Component to render different types of embeds
export const EmbedComponent = ({ embed }) => {
  if (!embed) return null;

  switch (embed.type) {
    case 'youtube':
      return (
        <div className="embed-container">
          <iframe
            width="100%"
            height="315"
            src={embed.url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
      
    case 'twitter':
      return (
        <div className="embed-container">
          <blockquote
            className="twitter-tweet"
            data-conversation="none"
          >
            <a href={embed.url}>Loading tweet...</a>
          </blockquote>
          <script async src="https://platform.twitter.com/widgets.js" />
        </div>
      );
      
    case 'image':
      return (
        <div className="embed-container">
          <img 
            src={embed.url} 
            alt="Embedded content" 
            className="embedded-image"
          />
        </div>
      );
      
    case 'link':
      return (
        <div className="embed-container">
          <a 
            href={embed.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="embedded-link"
          >
            {embed.url}
          </a>
        </div>
      );
      
    default:
      return null;
  }
}; 
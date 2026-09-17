import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import { getStreamUrl } from '../api/tmdb';

const SERVERS = [
  { name: 'VidSrc Server 1', index: 0 },
  { name: 'VidSrc Pro 2', index: 1 },
  { name: 'SuperEmbed 3', index: 2 },
  { name: '2Embed Fast 4', index: 3 },
];

export default function PlayerScreen() {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const mediaId = Number(id);
  
  const [serverIndex, setServerIndex] = useState(0);
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    if (type && id) {
      setStreamUrl(getStreamUrl(mediaId, type, serverIndex));
    }
  }, [type, id, serverIndex]);

  if (!type || !id) return null;

  return (
    <div className="flex flex-col h-screen md:h-[100dvh] bg-black">
      <div className="flex items-center justify-between p-3 bg-hmdbd-surface border-b border-gray-800 safe-top">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-white hover:text-hmdbd-orange transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1 px-4">
          <p className="text-xs text-hmdbd-orange-light font-bold uppercase tracking-wider">Now Playing • {type}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setStreamUrl(getStreamUrl(mediaId, type, serverIndex) + '&refresh=' + Date.now())}
            className="p-2 text-gray-400 hover:text-white"
            title="Reload Player"
          >
            <RefreshCw size={20} />
          </button>
          <a 
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-hmdbd-orange hover:text-orange-400"
            title="Open externally"
          >
            <ExternalLink size={20} />
          </a>
        </div>
      </div>

      <div className="flex gap-2 p-2 overflow-x-auto bg-hmdbd-surface-variant hide-scrollbar items-center">
        <span className="text-xs text-gray-400 font-bold px-2">Server:</span>
        {SERVERS.map(server => (
          <button
            key={server.index}
            onClick={() => setServerIndex(server.index)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              serverIndex === server.index 
                ? 'bg-hmdbd-orange text-white border-hmdbd-orange' 
                : 'bg-hmdbd-surface text-gray-300 border-gray-700 hover:border-gray-500'
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      <div className="flex-1 relative w-full bg-black">
        {streamUrl && (
          <iframe 
            src={streamUrl}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            title="Video Player"
          ></iframe>
        )}
      </div>
    </div>
  );
}

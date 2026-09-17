import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    
    // Clear previous ad if re-rendered
    bannerRef.current.innerHTML = '';
    
    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `
      atOptions = {
        'key' : '52bf8313003d130819b520f8bac8ce0b',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://www.highrevenueformat.com/52bf8313003d130819b520f8bac8ce0b/invoke.js";
    
    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center w-full my-6 overflow-hidden">
      <div ref={bannerRef} className="w-[320px] h-[50px]"></div>
    </div>
  );
}

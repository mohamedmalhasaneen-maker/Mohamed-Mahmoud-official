import React from 'react';

interface FloatingWhatsAppButtonProps {
  whatsappUrl: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = React.memo(
  ({ whatsappUrl }) => {
    return (
      <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:right-6 z-40">
        {/* Gentle ambient pulse ring behind the official WhatsApp circle */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366]/45 pointer-events-none animate-whatsapp-pulse"
        />

        <a
          id="floating-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          title="واتساب"
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_10px_28px_-5px_rgba(37,211,102,0.58)] hover:shadow-[0_14px_32px_-4px_rgba(37,211,102,0.72)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f7fc] dark:focus-visible:ring-offset-[#050a18]"
        >
          {/* Official WhatsApp Brand Icon */}
          <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="w-7 h-7 sm:w-[30px] sm:h-[30px] fill-current"
          >
            <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.003c0 2.352.615 4.647 1.781 6.671L2.667 29.333l6.827-1.789a13.28 13.28 0 0 0 6.51 1.701h.005c7.36 0 13.333-5.973 13.333-13.336 0-3.562-1.387-6.912-3.904-9.429a13.255 13.255 0 0 0-9.434-3.813Zm0 24.32h-.004a11.04 11.04 0 0 1-5.635-1.544l-.404-.24-4.187 1.099 1.117-4.08-.263-.419a11.01 11.01 0 0 1-1.693-5.885c0-6.085 4.952-11.037 11.07-11.037 2.954 0 5.731 1.152 7.819 3.243a10.974 10.974 0 0 1 3.237 7.803c0 6.088-4.955 11.06-11.057 11.06Zm6.069-8.28c-.333-.168-1.968-.971-2.273-1.083-.304-.112-.525-.168-.747.168s-.856 1.083-1.051 1.304c-.192.224-.387.251-.72.083-.333-.168-1.405-.517-2.677-1.651-.989-.883-1.656-1.973-1.851-2.307-.192-.333-.021-.512.147-.68.149-.149.333-.389.499-.584.168-.192.224-.333.336-.555.112-.224.056-.419-.029-.587-.083-.168-.747-1.8-1.024-2.464-.269-.648-.544-.56-.747-.571a12.7 12.7 0 0 0-.637-.011c-.221 0-.581.083-.885.419-.304.333-1.163 1.136-1.163 2.768s1.192 3.211 1.357 3.435c.168.224 2.344 3.579 5.677 5.019.792.341 1.411.547 1.893.699.795.253 1.52.216 2.093.131.637-.096 1.968-.805 2.245-1.584.277-.779.277-1.445.195-1.584-.083-.139-.307-.224-.64-.392Z" />
          </svg>
        </a>
      </div>
    );
  }
);

FloatingWhatsAppButton.displayName = 'FloatingWhatsAppButton';

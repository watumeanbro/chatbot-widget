function Logo() {
  return (
    <div className="relative h-[94px] w-24">
      <div className="absolute left-0 top-0 grid h-[94px] w-24 place-items-center">
        <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
          <defs>
            <linearGradient id="ccnav" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFE34D" />
              <stop offset="1" stopColor="#FFD60A" />
            </linearGradient>
          </defs>
          <path d="M12 50L32 10l20 40H12Z" fill="url(#ccnav)" />
        </svg>
      </div>
    </div>
  );
}

export const NavigationBarSection = () => {
  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "What you get", href: "#what-you-get" },
  ];

  return (
    <>
      <div className="relative flex w-full max-w-[1272px] flex-col items-stretch justify-between gap-4 overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(239,240,248,0.25)_0%,rgba(10,15,30,0.25)_67%,rgba(84,104,166,0.25)_78%,rgba(161,172,207,0.25)_100%)] px-6 py-5 shadow-[0px_4px_4px_#00000040,0px_4px_4px_#00000040] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[30px] before:p-[0.2px] before:content-[''] before:[background:linear-gradient(159deg,rgba(255,214,10,1)_0%,rgba(153,128,6,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] lg:hidden">
        <div className="relative z-[2] flex items-center justify-between">
          <Logo />

          <button className="all-[unset] box-border relative h-[52px] w-[152.14px] rounded-[35px] bg-[#ffd60a] transition-colors hover:bg-[#e6c109]">
            <div className="absolute left-[calc(50.00%_-_48px)] top-[calc(50.00%_-_11px)] flex h-[21px] w-24 items-center justify-center whitespace-nowrap text-center text-base font-bold leading-6 tracking-[0] text-[#0a0f1e] [font-family:'Space_Grotesk-Bold',Helvetica]">
              Join Waitlist
            </div>
          </button>
        </div>

        <div className="relative z-[2] flex items-center justify-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative flex h-[21px] w-[111px] items-center justify-center whitespace-nowrap text-center text-base font-normal leading-6 tracking-[0] text-white [font-family:'Space_Grotesk-Regular',Helvetica]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="relative hidden h-[92px] w-[1272px] items-center justify-between overflow-y-scroll rounded-[30px] bg-[linear-gradient(180deg,rgba(239,240,248,0.25)_0%,rgba(10,15,30,0.25)_67%,rgba(84,104,166,0.25)_78%,rgba(161,172,207,0.25)_100%)] px-12 py-5 shadow-[0px_4px_4px_#00000040,0px_4px_4px_#00000040] backdrop-blur-[10px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(10px)_brightness(100%)] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[30px] before:p-[0.2px] before:content-[''] before:[background:linear-gradient(159deg,rgba(255,214,10,1)_0%,rgba(153,128,6,1)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] lg:flex">
        <Logo />

        <button className="all-[unset] box-border relative h-[52px] w-[152.14px] rounded-[35px] bg-[#ffd60a] transition-colors hover:bg-[#e6c109]">
          <div className="absolute left-[calc(50.00%_-_48px)] top-[calc(50.00%_-_11px)] flex h-[21px] w-24 items-center justify-center whitespace-nowrap text-center text-base font-bold leading-6 tracking-[0] text-[#0a0f1e] [font-family:'Space_Grotesk-Bold',Helvetica]">
            Join Waitlist
          </div>
        </button>

        <div className="absolute left-[234px] top-[34px] flex w-[257px] items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative flex h-[21px] w-[111px] items-center justify-center whitespace-nowrap text-center text-base font-normal leading-6 tracking-[0] text-white [font-family:'Space_Grotesk-Regular',Helvetica]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

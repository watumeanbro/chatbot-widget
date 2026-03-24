export const CallToActionSection = () => {
  return (
    <div className="relative mb-0 inline-flex flex-[0_0_auto] flex-col items-start gap-2.5 border-t-[0.3px] border-[#8a95b0] px-5 py-[30px] sm:px-10 lg:mb-[-501.56px] lg:ml-[-89.65px] lg:mr-[-89.65px]">
      <div className="relative inline-flex flex-[0_0_auto] flex-col items-start justify-center gap-6 sm:flex-row sm:items-center sm:justify-between lg:gap-[572px]">
        <p className="relative flex h-[23px] w-[86px] items-center whitespace-nowrap text-[15.2px] leading-[22.8px] tracking-[0] text-transparent [font-family:'Space_Grotesk-Bold',Helvetica] font-bold">
          <span className="text-white">Copy</span>
          <span className="text-[#ffd60a]">Critic</span>
        </p>

        <div className="relative flex h-[17px] w-[119.29px] items-center whitespace-nowrap text-[13.6px] leading-[20.4px] tracking-[0] text-[#8a95b0] [font-family:'Space_Grotesk-Regular',Helvetica] font-normal">
          © 2026 CopyCritic
        </div>

        <div className="relative h-5 w-5">
          <svg
            viewBox="0 0 24 24"
            className="absolute left-[5.22%] top-[9.38%] h-[90.62%] w-[94.78%]"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="#8a95b0"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

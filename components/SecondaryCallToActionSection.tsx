import { WaitlistSignup } from "./WaitlistSignup";

export const SecondaryCallToActionSection = ({
  submitted,
  onSuccess,
}: {
  submitted: boolean;
  onSuccess: (count: number) => void;
}) => {
  return (
    <div className="relative mb-0 inline-flex flex-[0_0_auto] flex-col items-center gap-[40px] lg:mb-[-269.56px] lg:gap-[60px]">
      <div className="relative inline-flex flex-[0_0_auto] flex-col items-center gap-[15px]">
        <p className="relative flex h-auto w-full max-w-[852px] items-center justify-center text-center text-[36px] font-normal leading-[46px] tracking-[-1.02px] text-transparent [font-family:'Space_Grotesk-Bold',Helvetica] sm:text-[44px] sm:leading-[56px] lg:h-[76px] lg:text-[51.2px] lg:leading-[76.8px] lg:whitespace-nowrap">
          <span className="font-bold text-white tracking-[-0.52px]">
            Stop guessing. Start{" "}
          </span>
          <span className="[font-family:'Playfair_Display-Italic',Helvetica] italic text-[#ffd60a] tracking-[-0.52px]">
            converting
          </span>
          <span className="font-bold text-white tracking-[-0.52px]">.</span>
        </p>

        <p className="relative h-auto w-full max-w-[548.65px] text-center text-[16px] font-normal leading-[28px] tracking-[0] text-[#8a95b0] [font-family:'Space_Grotesk-Regular',Helvetica] sm:text-[17.6px] sm:leading-[29.9px] lg:h-[51.9px]">
          Get the first tool built to tell founders exactly what their landing
          <br />
          page copy is doing wrong — and how to fix it.
        </p>
      </div>

      <WaitlistSignup submitted={submitted} onSuccess={onSuccess} />
    </div>
  );
};

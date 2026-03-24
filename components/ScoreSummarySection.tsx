import { WaitlistSignup } from "./WaitlistSignup";

export const ScoreSummarySection = ({
  waitlistCount,
  submitted,
  onSuccess,
}: {
  waitlistCount: number;
  submitted: boolean;
  onSuccess: (count: number) => void;
}) => {
  return (
    <div className="relative inline-flex flex-[0_0_auto] flex-col items-center gap-[30px]">
      <div className="relative inline-flex flex-[0_0_auto] flex-col items-center gap-[40px] lg:gap-[60px]">
        <div className="relative inline-flex flex-[0_0_auto] flex-col items-center gap-[15px]">
          <p className="relative flex h-auto w-full max-w-[828px] items-center justify-center text-center text-[40px] font-normal leading-[48px] tracking-[-1.28px] text-transparent [font-family:'Space_Grotesk-Bold',Helvetica] sm:text-[52px] sm:leading-[62px] lg:h-[284px] lg:text-[64px] lg:leading-[73.6px]">
            <span className="font-bold text-white tracking-[-0.82px]">
              Find out{" "}
            </span>
            <span className="[font-family:'Playfair_Display-Italic',Helvetica] italic text-[#ffd60a] tracking-[-0.82px]">
              exactly
            </span>
            <span className="[font-family:'Playfair_Display-Bold',Helvetica] font-bold text-white tracking-[-0.82px]">
              &nbsp;
            </span>
            <span className="font-bold text-white tracking-[-0.82px]">
              what your landing page copy is doing wrong — and how to{" "}
            </span>
            <span className="[font-family:'Playfair_Display-Italic',Helvetica] italic text-[#ffd60a] tracking-[-0.82px]">
              fix
            </span>
            <span className="font-bold text-white tracking-[-0.82px]"> it.</span>
          </p>

          <p className="relative h-auto w-full max-w-[638.78px] text-center text-[16px] font-normal leading-[28px] tracking-[0] text-transparent [font-family:'Space_Grotesk-Regular',Helvetica] sm:text-[18px] sm:leading-[32.6px] lg:h-[90.28px] lg:text-[19.2px]">
            <span className="text-white">
              Paste your URL, your text, or upload your design —{" "}
            </span>
            <span className="text-[#ffd60a]">CopyCritic</span>
            <span className="text-white">
              {" "}
              scores
              <br />
              your copy, breaks down every section, and gives you specific
              <br />
              rewrites that actually fix the problem.
            </span>
          </p>
        </div>

        <WaitlistSignup submitted={submitted} onSuccess={onSuccess} />
      </div>

      <p className="relative flex h-[17px] w-[285.28px] items-center justify-center whitespace-nowrap text-center text-[13.6px] font-normal leading-[20.4px] tracking-[0.14px] text-transparent [font-family:'Space_Grotesk-Regular',Helvetica]">
        <span className="text-[#8a95b0] tracking-[0.02px]">Join </span>
        <span className="[font-family:'Space_Grotesk-Medium',Helvetica] font-medium text-white tracking-[0.02px]">
          {waitlistCount}+
        </span>
        <span className="text-[#8a95b0] tracking-[0.02px]">
          {" "}
          founders already on the waitlist
        </span>
      </p>
    </div>
  );
};

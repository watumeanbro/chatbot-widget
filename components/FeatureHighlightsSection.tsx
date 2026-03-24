const howItWorksSteps = [
  {
    number: "01",
    title: "Submit your copy",
    description: "Drop your URL, paste your copy, or upload\nyour design mockup.",
  },
  {
    number: "02",
    title: "Get your score",
    description:
      "CopyCritic scores your copy out of 100 and\nbreaks it down section by section.",
  },
  {
    number: "03",
    title: "Fix what's broken",
    description:
      "Get specific rewrite suggestions for every\nweak spot — not vague advice.",
  },
];

function CardIcon({ kind }: { kind: "breakdown" | "rewrite" }) {
  if (kind === "breakdown") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="absolute left-[9.38%] top-[9.38%] h-[90.62%] w-[90.62%]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 7h10v10H7V7Z"
          stroke="#ffd60a"
          strokeWidth="2"
          opacity="0.9"
        />
        <path
          d="M9 10h6M9 13h6"
          stroke="#ffd60a"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute left-[9.37%] top-[8.87%] h-[91.13%] w-[90.63%]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 20h4l11-11a2 2 0 0 0-4-4L4 16v4Z"
        stroke="#ffd60a"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M13 6l5 5"
        stroke="#ffd60a"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export const FeatureHighlightsSection = () => {
  return (
    <div className="relative ml-0 mr-0 inline-flex flex-[0_0_auto] flex-col items-center gap-[15px] lg:ml-[-85.00px] lg:mr-[-85.00px]">
      <div className="relative h-auto w-full max-w-[1203.99px] lg:h-[895.38px]">
        <div className="relative inline-flex flex-col items-center gap-[149px]">
          <div className="relative inline-flex flex-[0_0_auto] flex-col items-center gap-[90px] lg:gap-[190px]">
            <div
              id="how-it-works"
              className="relative inline-flex flex-[0_0_auto] scroll-mt-28 flex-col items-center gap-[50px] lg:gap-[70px]"
            >
              <div className="relative flex h-[22px] w-[290px] items-center justify-center whitespace-nowrap text-center text-[25px] font-bold leading-[26.4px] tracking-[1.76px] text-[#8a95b0] [font-family:'Space_Grotesk-Bold',Helvetica]">
                HOW IT WORKS
              </div>

              <div className="relative inline-flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-20">
                {howItWorksSteps.map((step, index) => (
                  <div
                    key={index}
                    className="grid h-fit w-full max-w-[309.49px] grid-cols-[repeat(1,fit-content(100%))] grid-rows-[repeat(3,fit-content(100%))] gap-[15px_0px]"
                  >
                    <div className="relative col-[1_/_2] row-[1_/_2] flex h-9 w-[29.74px] items-center whitespace-nowrap text-2xl font-bold leading-9 tracking-[-0.48px] text-[#ffd60a] [font-family:'Space_Grotesk-Bold',Helvetica]">
                      {step.number}
                    </div>

                    <div className="relative col-[1_/_2] row-[2_/_3] flex h-[22px] items-center whitespace-nowrap text-[17.6px] font-bold leading-[22.9px] tracking-[0] text-white [font-family:'Space_Grotesk-Bold',Helvetica]">
                      {step.title}
                    </div>

                    <p className="relative col-[1_/_2] row-[3_/_4] h-auto w-full text-[15.2px] font-normal leading-[25.1px] tracking-[0] text-[#8a95b0] [font-family:'Space_Grotesk-Regular',Helvetica] lg:h-[44.08px] lg:w-[309.49px]">
                      {step.description.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="what-you-get"
              className="relative inline-flex flex-[0_0_auto] scroll-mt-28 flex-col items-center gap-[50px] lg:gap-[70px]"
            >
              <div className="relative flex h-[22px] w-[214px] items-center justify-center whitespace-nowrap text-center text-[25px] font-bold leading-[26.4px] tracking-[1.76px] text-[#8a95b0] [font-family:'Space_Grotesk-Bold',Helvetica]">
                WHAT YOU GET
              </div>

              <div className="relative inline-flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-[100px]">
                <div className="relative h-[237.61px] w-full max-w-[334.66px] rounded-lg border border-solid border-[#ffffff12] bg-gray-900">
                  <div className="absolute left-[33px] top-[37px] flex h-14 w-[67px] items-center whitespace-nowrap text-[56px] font-bold leading-[56px] tracking-[-1.68px] text-[#ffd60a] [font-family:'Space_Grotesk-Bold',Helvetica]">
                    86
                  </div>

                  <div className="absolute left-[102px] top-16 flex h-[26px] w-11 items-center whitespace-nowrap text-[20.6px] font-bold leading-[31.2px] tracking-[0] text-white opacity-70 [font-family:'Space_Grotesk-Bold',Helvetica]">
                    /100
                  </div>

                  <div className="absolute left-[33px] top-[111px] flex h-[22px] w-[111px] items-center whitespace-nowrap text-[17.6px] font-bold leading-[26.4px] tracking-[0] text-white [font-family:'Space_Grotesk-Bold',Helvetica]">
                    Overall Score
                  </div>

                  <p className="absolute left-[33px] top-[150px] h-[43px] w-[246px] text-[14.8px] font-normal leading-[24.4px] tracking-[0] text-[#8a95b0] [font-family:'Space_Grotesk-Regular',Helvetica]">
                    Instant score so you know exactly
                    <br />
                    where you stand.
                  </p>
                </div>

                <div className="relative h-[237.61px] w-full max-w-[334.67px] rounded-lg border border-solid border-[#ffffff12] bg-gray-900">
                  <div className="absolute left-[33px] top-[37px] h-9 w-9">
                    <CardIcon kind="breakdown" />
                  </div>

                  <div className="absolute left-[33px] top-[91px] flex h-[22px] w-[165px] items-center whitespace-nowrap text-[17.6px] font-bold leading-[26.4px] tracking-[0] text-white [font-family:'Space_Grotesk-Bold',Helvetica]">
                    Section Breakdown
                  </div>

                  <p className="absolute left-[33px] top-[129px] h-[68px] w-64 text-[14.8px] font-normal leading-[24.4px] tracking-[0] text-[#8a95b0] [font-family:'Space_Grotesk-Regular',Helvetica]">
                    Every part of your page graded —<br />
                    headline, hero, CTA, social proof and
                    <br />
                    more.
                  </p>
                </div>

                <div className="relative h-[237.61px] w-full max-w-[334.66px] rounded-lg border border-solid border-[#ffffff12] bg-gray-900">
                  <div className="absolute left-[33px] top-[37px] h-9 w-9">
                    <CardIcon kind="rewrite" />
                  </div>

                  <div className="absolute left-[33px] top-[91px] flex h-[22px] w-44 items-center whitespace-nowrap text-[17.6px] font-bold leading-[26.4px] tracking-[0] text-white [font-family:'Space_Grotesk-Bold',Helvetica]">
                    Rewrite Suggestions
                  </div>

                  <p className="absolute left-[33px] top-[129px] h-[43px] w-[245px] text-[14.8px] font-normal leading-[24.4px] tracking-[0] text-[#8a95b0] [font-family:'Space_Grotesk-Regular',Helvetica]">
                    Specific copy fixes written out for
                    <br />
                    you, not just feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-auto w-full bg-gray-900 py-14 lg:h-[251px] lg:w-[1440px] lg:py-0">
        <p className="relative mx-auto flex h-auto w-full max-w-[734px] items-center justify-center px-6 text-center text-[26px] font-normal leading-[40px] tracking-[0] text-white [font-family:'Space_Grotesk-Regular',Helvetica] sm:text-[30.4px] sm:leading-[45.6px] lg:absolute lg:left-[calc(50.00%_-_367px)] lg:top-[82px] lg:h-[87px] lg:px-0">
          <span className="[font-family:'Space_Grotesk-Regular',Helvetica] text-white">
            Built for{" "}
          </span>
          <span className="[font-family:'Playfair_Display-Italic',Helvetica] italic">
            founders
          </span>
          <span className="[font-family:'Space_Grotesk-Regular',Helvetica] text-white">
            {" "}
            whose landing pages get traffic — but don&#39;t convert.
          </span>
        </p>
      </div>
    </div>
  );
};

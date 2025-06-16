import { ExternalLinkIcon, Loader2 } from "lucide-react";
import { useMemo } from "react";
import CountUp from "react-countup";

export interface CardElement {
  value: any;
  improvement?: string;
  url?: string;
}

interface CardProps {
  title: string;
  description: string;
  accountType?: "Gelato" | "OKX";
  paymentType?: "ERC20" | "Sponsored";
  paymasterType?: "Gelato" | "OKX";
  standardType?: "7702" | "4337";
  icons?: React.ReactNode[];
  isNew?: boolean;
  highlight?: boolean;
  elements?: CardElement[];
  loading?: boolean;
  cardClassName?: string;
  usdcPrice?: number;
  tabs?: boolean;
}

export const Card = ({
  title,
  description,
  accountType,
  paymentType,
  paymasterType,
  standardType,
  icons,
  isNew,
  highlight,
  elements,
  loading,
  cardClassName,
  usdcPrice,
  tabs,
}: CardProps) => {
  const overlappingIcons = useMemo(() => {
    if (!icons) return [];
    if (icons.length === 1) return icons[0];
    const overlappingIcons = [];
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      overlappingIcons.push(
        <div
          key={i}
          className="absolute"
          style={{ left: `${i * 28}px`, zIndex: icons.length - i }}
        >
          {icon}
        </div>
      );
    }
    return (
      <div
        className="relative"
        style={{ width: `${(icons.length - 1) * 12 + 40}px`, height: "40px" }}
      >
        {overlappingIcons}
      </div>
    );
  }, [icons]);

  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden border border-[#E7E7E7] ${
        highlight ? "bg-white" : "bg-[#F9FAFB]"
      } ${cardClassName}`}
    >
      <div
        className={`${
          tabs
            ? "h-[180px] sm:h-[200px] md:h-[200px]"
            : "h-[170px] sm:h-[200px] md:h-[240px]"
        } flex flex-col relative gap-y-1.5 sm:gap-y-2 md:gap-y-2.5 border-b border-[#E7E7E7]`}
      >
        {isNew && (
          <div className="absolute right-0 top-0">
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#F7EFFD] border border-[#FCDCF9] text-[#8E0098] text-[10px] sm:text-xs md:text-sm font-[500] rounded-bl-2xl">
              New
            </span>
          </div>
        )}
        <div className="h-[8px] sm:h-[12px] md:h-[16px]" />
        <div className="flex flex-col gap-y-1.5 sm:gap-y-2 md:gap-y-2.5 p-3 sm:p-4 md:p-6 py-0.5 sm:py-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10">{overlappingIcons}</div>
          <h3 className="text-sm sm:text-base md:text-md font-[600] text-[#343434] leading-[20px] sm:leading-[24px] md:leading-[28px]">
            {title}
          </h3>
          <div
            className={`grid ${
              tabs ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"
            } gap-x-2 sm:gap-x-3.5 gap-y-1.5 sm:gap-y-2 mt-1 sm:mt-2`}
          >
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[12px] text-[#909090]">
                SCW
              </span>
              <span className="text-[11px] sm:text-[13px] text-[#343434] font-medium">
                {accountType}
              </span>
            </div>
            {!tabs && (
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[12px] text-[#909090]">
                  Payment
                </span>
                <span className="text-[11px] sm:text-[13px] text-[#343434] font-medium">
                  {paymentType}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[12px] text-[#909090]">
                Paymaster
              </span>
              <span className="text-[11px] sm:text-[13px] text-[#343434] font-medium">
                {paymasterType}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-[12px] text-[#909090]">
                Standard
              </span>
              <span className="text-[11px] sm:text-[13px] text-[#343434] font-medium">
                {standardType}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {elements?.length === 0
          ? [1, 2, 3, 4, 5, 6].map((e) => (
              <div
                className="flex items-center border-t border-[#E7E7E7] px-3 md:px-4 py-4 md:py-6 h-[60px] md:h-[70px] first:border-t-0 last:border-b-0"
                key={e}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5" />
                ) : (
                  <span className="block text-[16px] md:text-[20px] text-[#232323] font-[500] leading-[16px] md:leading-[18px]">
                    --
                  </span>
                )}
              </div>
            ))
          : elements?.map((element, idx) => (
              <div
                className="flex items-center border-t border-[#E7E7E7] px-3 md:px-4 py-4 md:py-6 h-[60px] md:h-[70px] first:border-t-0 last:border-b-0"
                key={element.value + idx}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 md:w-5 h-4 md:h-5" />
                ) : (
                  <>
                    {element.url ? (
                      <a
                        className="flex items-center gap-x-1 md:gap-x-2 break-all"
                        href={element.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="block text-sm md:text-md text-[#3C82F6] font-[500] truncate">
                          {element.value}
                        </span>
                        <ExternalLinkIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3C82F6] flex-shrink-0" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-between md:justify-center w-full md:w-auto md:gap-x-[18px]">
                        <div className="flex flex-col">
                          <span className="block text-md md:text-[20px] text-[#232323] font-[500] leading-[16px] md:leading-[18px]">
                            {element?.value && element?.value !== "--" ? (
                              <CountUp
                                end={Number(element.value)}
                                separator=","
                                decimals={
                                  idx === 0
                                    ? elements.length === 6
                                      ? 2
                                      : 0
                                    : elements.length === 6
                                    ? idx === 4
                                      ? 12
                                      : 0
                                    : idx === 3
                                    ? 12
                                    : 0
                                }
                                decimal="."
                                className="text-sm md:text-[20px]"
                              />
                            ) : (
                              "N/A"
                            )}
                          </span>
                          {elements.length === 6 && idx === 4 ? (
                            <span className="text-xs text-[#909090] mt-0.5">
                              ($
                              {(Number(element.value) * usdcPrice!).toFixed(7)}
                              &nbsp;USDC)
                            </span>
                          ) : (
                            elements.length === 5 &&
                            idx === 3 && (
                              <span className="text-xs text-[#909090] mt-0.5">
                                ($
                                {(Number(element.value) * usdcPrice!).toFixed(
                                  7
                                )}
                                &nbsp;USDC)
                              </span>
                            )
                          )}
                        </div>
                        {element.improvement && (
                          <div className="py-0.5 px-1 md:px-1.5 bg-[#EFFDF4] border border-[#DCFCE7] rounded-[4px] h-[20px] md:h-[22px] flex items-center">
                            <span className="text-xs md:text-sm text-[#009837] font-[500] whitespace-nowrap">
                              {element.improvement}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

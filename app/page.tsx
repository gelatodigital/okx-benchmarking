"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OKX7702ERC20 from "./okx-erc20";
import OKX7702Sponsored from "./okx-sponsored";
import { useMetricMethods } from "@/hooks/useMetricMethods";
import { Loader2 } from "lucide-react";

export default function OKX7702() {
  const [activeTab, setActiveTab] = useState("erc20");
  const [startedToRun, setStartedToRun] = useState(false);
  const [isBenchmarkRunning, setIsBenchmarkRunning] = useState(false);

  // Transaction metrics state
  const [erc20TxMetrics, setErc20TxMetrics] = useState<any>(null);
  const [sponsoredTxMetrics, setSponsoredTxMetrics] = useState<any>(null);
  const [erc20TxLoading, setErc20TxLoading] = useState(false);
  const [sponsoredTxLoading, setSponsoredTxLoading] = useState(false);

  // Get the mutations from the hook
  const {
    useGelatoMutation: gelatoMutation,
    useGelatoERC20Mutation: gelatoERC20Mutation,
    useOKXSponsoredMutation: okxSponsoredMutation,
    useOKXERC20Mutation: okxERC20Mutation,
  } = useMetricMethods();

  // Single handler for all benchmarks
  async function handleRunBenchmarks() {
    setIsBenchmarkRunning(true);
    setStartedToRun(true);
    setErc20TxLoading(false);
    setSponsoredTxLoading(false);
    try {
      if (activeTab === "erc20") {
        setErc20TxLoading(true);
        const [gelatoERC20, okxERC20] = await Promise.all([
          gelatoERC20Mutation.mutateAsync(),
          okxERC20Mutation.mutateAsync(),
        ]);
        setErc20TxMetrics({
          gelatoERC20,
          okxERC20,
        });
        setErc20TxLoading(false);
      }
      if (activeTab === "sponsored") {
        setSponsoredTxLoading(true);
        const [gelatoSponsored, okxSponsored] = await Promise.all([
          gelatoMutation.mutateAsync(),
          okxSponsoredMutation.mutateAsync(),
        ]);
        setSponsoredTxMetrics({
          gelatoSponsored,
          okxSponsored,
        });
        setSponsoredTxLoading(false);
      }
    } catch (error) {
      console.error("Error running benchmarks:", error);
      setErc20TxLoading(false);
      setSponsoredTxLoading(false);
    } finally {
      setIsBenchmarkRunning(false);
    }
  }

  return (
    <div className="w-full mx-auto px-4 md:px-6 lg:px-8 max-w-[1400px]">
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-[24px] md:text-[32px] font-[600] mb-1 md:mb-2 leading-[28px] md:leading-[32px]">
          OKX 7702
        </h1>
        <span className="text-[#585858] text-[16px] md:text-[18px] leading-[20px] md:leading-[24px]">
          Benchmarking
        </span>
      </div>

      <div className="w-full">
        <div className="text-center mb-4 md:mb-6 mt-4">
          <h1 className="text-[24px] md:text-[32px] font-[600] mb-1 md:mb-2 leading-[28px] md:leading-[32px]">
            Transaction Metrics
          </h1>
        </div>

        <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <div className="flex justify-center">
            <TabsList className="grid w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="erc20">ERC20</TabsTrigger>
              <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="sponsored">
            <OKX7702Sponsored
              startedToRun={startedToRun}
              metrics={sponsoredTxMetrics}
              loading={sponsoredTxLoading}
            />
          </TabsContent>
          <TabsContent value="erc20">
            <OKX7702ERC20
              startedToRun={startedToRun}
              metrics={erc20TxMetrics}
              loading={erc20TxLoading}
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-center mt-8">
          <button
            className="h-[48px] bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center text-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            onClick={handleRunBenchmarks}
            disabled={isBenchmarkRunning}
          >
            {erc20TxLoading || sponsoredTxLoading ? (
              <div className="flex items-center justify-center gap-x-2 w-full">
                <Loader2 className="animate-spin w-6 h-6 text-white" />
                <span className="text-lg md:text-xl font-semibold text-white animate-pulse tracking-wide">
                  {erc20TxLoading
                    ? "Sending ERC20 Transactions..."
                    : "Sending Sponsored Transactions..."}
                </span>
              </div>
            ) : activeTab === "erc20" ? (
              "Run ERC20 Benchmark"
            ) : (
              "Run Sponsored Benchmark"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { MetricsLabels } from "@/components/MetricsLabels";
import { Card, CardElement } from "@/components/Card";
import { formatTxHash } from "@/lib/utils";
import GelatoIcon from "@/public/gelato.svg";
import { useMetricMethods } from "@/hooks/useMetricMethods";
import OKXIcon from "@/public/okx.svg";
export default function OKX7702Sponsored({
  startedToRun,
  metrics,
  loading,
}: {
  startedToRun: boolean;
  metrics: any;
  loading: boolean;
}) {
  const [ethPrice, setEthPrice] = useState(0);

  const fetchETHPrice = async (priceId: string) => {
    try {
      const response = await fetch(
        `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${priceId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch price data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Pyth price:", error);
      throw error;
    }
  };

  useEffect(() => {
    async function fetchPrice() {
      const ethPrice = await fetchETHPrice(
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"
      );
      setEthPrice(Number(ethPrice.parsed[0].price.price) / 10 ** 8);
    }
    fetchPrice();
  }, []);

  const [GelatoMetrics, setGelatoMetrics] = useState<any[]>([]);
  const [okxSponsoredMetrics, setOKXSponsoredMetrics] = useState<any[]>([]);
  useEffect(() => {
    if (metrics?.gelatoSponsored.type === "transaction") {
      setGelatoMetrics(smartWalletGelatoMetrics());
      setOKXSponsoredMetrics(okxSponsoredMetricsElements());
    }
  }, [metrics]);

  const smartWalletGelatoMetrics = () => {
    // Check if we have transaction metrics
    if (metrics?.gelatoSponsored.type === "transaction") {
      const l1GasImprovement =
        ((Number(metrics?.okxSponsored.l1Gas) -
          Number(metrics?.gelatoSponsored.l1Gas)) /
          Number(metrics?.okxSponsored.l1Gas)) *
        100 *
        -1;

      const l2GasImprovement =
        ((Number(metrics?.okxSponsored.l2Gas) -
          Number(metrics?.gelatoSponsored.l2Gas)) /
          Number(metrics?.okxSponsored.l2Gas)) *
        100 *
        -1;

      const actualUserOpGasImprovement =
        ((Number(metrics?.okxSponsored.actualUserOpGas) -
          Number(metrics?.gelatoSponsored.actualUserOpGas)) /
          Number(metrics?.okxSponsored.actualUserOpGas)) *
        100 *
        -1;

      const totalTxFeeImprovement =
        ((Number(metrics?.okxSponsored.totalTxFee) -
          Number(metrics?.gelatoSponsored.totalTxFee)) /
          Number(metrics?.okxSponsored.totalTxFee)) *
        100 *
        -1;
      return [
        {
          value: metrics?.gelatoSponsored.latency,
        },
        {
          value: metrics?.gelatoSponsored.l1Gas,
          improvement: `${l1GasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.gelatoSponsored.l2Gas,
          improvement: `${l2GasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.gelatoSponsored.actualUserOpGas,
          improvement: `${actualUserOpGasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.gelatoSponsored.totalTxFee,
          improvement: `${totalTxFeeImprovement.toFixed(2)}% ETH`,
        },
        {
          value: formatTxHash(metrics?.gelatoSponsored.txHash),
          url: `https://sepolia.basescan.org/tx/${metrics?.gelatoSponsored.txHash}`,
        },
      ];
    }

    return [];
  };

  const okxSponsoredMetricsElements = () => {
    return [
      {
        value: "",
      },
      {
        value: metrics?.okxSponsored.l1Gas,
      },
      {
        value: metrics?.okxSponsored.l2Gas,
      },
      {
        value: metrics?.okxSponsored.actualUserOpGas,
      },
      {
        value: metrics?.okxSponsored.totalTxFee,
      },
      {
        value: formatTxHash(metrics?.okxSponsored.txHash),
        url: `https://sepolia.basescan.org/tx/${metrics?.okxSponsored.txHash}`,
      },
    ];
  };

  return (
    <div>
      <div
        className={`grid 
              grid-cols-[100px_220px_220px]
              md:grid-cols-[180px_1fr_1fr]
              rounded-lg overflow-auto lg:overflow-hidden`}
      >
        <MetricsLabels
          metrics={[
            { label: "Latency (s)", tooltipText: "Latency" },
            {
              label: "L1 Gas",
              tooltipText: "L1 Gas",
            },
            {
              label: "L2 Gas",
              tooltipText: "L2 Gas",
            },
            {
              label: "Actual Gas Used",
              tooltipText: "Actual gas used for the transaction",
            },
            {
              label: "Actual Gas Cost",
              tooltipText: "Actual gas cost of the transaction",
            },
            {
              label: "Tx Hash",
              tooltipText: "Tx Hash",
            },
          ]}
          emptyElementClassName="h-[180px] sm:h-[200px] md:h-[200px]"
        />
        <Card
          title="SmartWallet SDK + Gelato Relay"
          description="Sponsored EIP-7702 + Gelato"
          elements={GelatoMetrics}
          icons={[
            <GelatoIcon
              className="w-10 h-10 rounded-full border-2 border-white"
              key="gelato"
            />,
          ]}
          loading={loading}
          isNew
          highlight
          usdcPrice={ethPrice}
          accountType="Gelato"
          paymentType="Sponsored"
          paymasterType="Gelato"
          standardType="7702"
          tabs={true}
        />
        <Card
          title="OKX SDK + OKX Relay"
          description="Sponsored EIP-7702 (OKX) + OKX"
          elements={okxSponsoredMetrics}
          icons={[
            <OKXIcon
              className="w-10 h-10 rounded-full border-2 border-white"
              key="okx"
            />,
          ]}
          loading={loading}
          usdcPrice={ethPrice}
          accountType="OKX"
          paymentType="Sponsored"
          paymasterType="OKX"
          standardType="7702"
          tabs={true}
        />
      </div>
    </div>
  );
}

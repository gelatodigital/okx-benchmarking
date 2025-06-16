import { useEffect, useMemo, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { MetricsLabels } from "@/components/MetricsLabels";
import { Card, CardElement } from "@/components/Card";
import { formatTxHash } from "@/lib/utils";
import GelatoIcon from "@/public/gelato.svg";
import OKXIcon from "@/public/okx.svg";
import { useMetricMethods } from "@/hooks/useMetricMethods";

export default function OKX7702ERC20({
  startedToRun,
  metrics,
  loading,
}: {
  startedToRun: boolean;
  metrics: any;
  loading: boolean;
}) {
  const [ethPrice, setEthPrice] = useState(0);
  const [GelatoERC20Metrics, setGelatoERC20Metrics] = useState<any[]>([]);
  const [okxGelatoERC20Metrics, setOKXGelatoERC20Metrics] = useState<any[]>([]);
  const [okxERC20Metrics, setOKXERC20Metrics] = useState<any[]>([]);
  useEffect(() => {
    if (
      metrics?.gelatoERC20.type === "transaction" &&
      metrics?.okxGelatoERC20.type === "transaction"
    ) {
      setGelatoERC20Metrics(smartWalletGelatoMetrics());
      setOKXGelatoERC20Metrics(okxGelatoERC20MetricsElements());
      setOKXERC20Metrics(okxERC20MetricsElements());
    }
  }, [metrics]);

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

  const smartWalletGelatoMetrics = () => {
    // Check if we have transaction metrics
    if (
      metrics?.gelatoERC20.type === "transaction" &&
      metrics?.okxGelatoERC20.type === "transaction"
    ) {
      const l1GasImprovement =
        ((Number(metrics?.okxERC20.l1Gas) -
          Number(metrics?.gelatoERC20.l1Gas)) /
          Number(metrics?.okxERC20.l1Gas)) *
        100 *
        -1;

      const l2GasImprovement =
        ((Number(metrics?.okxERC20.l2Gas) -
          Number(metrics?.gelatoERC20.l2Gas)) /
          Number(metrics?.okxERC20.l2Gas)) *
        100 *
        -1;

      const actualUserOpGasImprovement =
        ((Number(metrics?.okxERC20.actualUserOpGas) -
          Number(metrics?.gelatoERC20.actualUserOpGas)) /
          Number(metrics?.okxERC20.actualUserOpGas)) *
        100 *
        -1;

      const totalTxFeeImprovement =
        ((Number(metrics?.okxERC20.totalTxFee) -
          Number(metrics?.gelatoERC20.totalTxFee)) /
          Number(metrics?.okxERC20.totalTxFee)) *
        100 *
        -1;
      return [
        {
          value: metrics?.gelatoERC20.latency,
        },

        {
          value: metrics?.gelatoERC20.l1Gas,
          improvement: `${l1GasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.gelatoERC20.l2Gas,
          improvement: `${l2GasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.gelatoERC20.actualUserOpGas,
          improvement: `${actualUserOpGasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.gelatoERC20.totalTxFee,
          improvement: `${totalTxFeeImprovement.toFixed(2)}% ETH`,
        },
        {
          value: formatTxHash(metrics?.gelatoERC20.txHash),
          url: `https://sepolia.basescan.org/tx/${metrics?.gelatoERC20.txHash}`,
        },
      ];
    }

    return [] as CardElement[];
  };

  const okxGelatoERC20MetricsElements = () => {
    // Check if we have transaction metrics
    if (
      metrics?.okxGelatoERC20.type === "transaction" &&
      metrics?.gelatoERC20.type === "transaction"
    ) {
      const l1GasImprovement =
        ((Number(metrics?.okxERC20.l1Gas) -
          Number(metrics?.okxGelatoERC20.l1Gas)) /
          Number(metrics?.okxERC20.l1Gas)) *
        100 *
        -1;

      const l2GasImprovement =
        ((Number(metrics?.okxERC20.l2Gas) -
          Number(metrics?.okxGelatoERC20.l2Gas)) /
          Number(metrics?.okxERC20.l2Gas)) *
        100 *
        -1;

      const actualUserOpGasImprovement =
        ((Number(metrics?.okxERC20.actualUserOpGas) -
          Number(metrics?.okxGelatoERC20.actualUserOpGas)) /
          Number(metrics?.okxERC20.actualUserOpGas)) *
        100 *
        -1;

      const totalTxFeeImprovement =
        ((Number(metrics?.okxERC20.totalTxFee) -
          Number(metrics?.okxGelatoERC20.totalTxFee)) /
          Number(metrics?.okxERC20.totalTxFee)) *
        100 *
        -1;

      return [
        {
          value: metrics?.okxGelatoERC20.latency,
        },

        {
          value: metrics?.okxGelatoERC20.l1Gas,
          improvement: `${l1GasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.okxGelatoERC20.l2Gas,
          improvement: `${l2GasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.okxGelatoERC20.actualUserOpGas,
          improvement: `${actualUserOpGasImprovement.toFixed(2)}% Gas`,
        },
        {
          value: metrics?.okxGelatoERC20.totalTxFee,
          improvement: `${totalTxFeeImprovement.toFixed(2)}% ETH`,
        },
        {
          value: formatTxHash(metrics?.okxGelatoERC20.txHash),
          url: `https://sepolia.basescan.org/tx/${metrics?.okxGelatoERC20.txHash}`,
        },
      ];
    }

    return [] as CardElement[];
  };

  const okxERC20MetricsElements = () => {
    return [
      {
        value: "",
      },
      {
        value: metrics?.okxERC20.l1Gas,
      },
      {
        value: metrics?.okxERC20.l2Gas,
      },
      {
        value: metrics?.okxERC20.actualUserOpGas,
      },
      {
        value: metrics?.okxERC20.totalTxFee,
      },
      {
        value: formatTxHash(metrics?.okxERC20.txHash),
        url: `https://sepolia.basescan.org/tx/${metrics?.okxERC20.txHash}`,
      },
    ];
  };

  return (
    <div>
      <div
        className={`grid ${"grid-cols-[100px_200px_200px_200px]"} ${"md:grid-cols-[180px_1fr_1fr_1fr]"} gap-0 rounded-lg overflow-auto lg:overflow-hidden`}
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
          description="Sponsored"
          elements={GelatoERC20Metrics}
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
          title="SmartWallet SDK + Gelato Relay"
          description="Sponsored"
          elements={okxGelatoERC20Metrics}
          icons={[
            <OKXIcon
              className="w-10 h-10 rounded-full border-2 border-white"
              key="okx"
            />,
            <GelatoIcon
              className="w-10 h-10 rounded-full border-2 border-white"
              key="gelato"
            />,
          ]}
          loading={loading}
          isNew
          highlight
          usdcPrice={ethPrice}
          accountType="OKX"
          paymentType="ERC20"
          paymasterType="Gelato"
          standardType="7702"
          tabs={true}
        />
        <Card
          title="OKX SDK + OKX Relay"
          description="ERC20"
          elements={okxERC20Metrics}
          icons={[
            <OKXIcon
              className="w-10 h-10 rounded-full border-2 border-white"
              key="okx"
            />,
          ]}
          loading={loading}
          usdcPrice={ethPrice}
          accountType="OKX"
          paymentType="ERC20"
          paymasterType="OKX"
          standardType="7702"
          tabs={true}
        />
      </div>
    </div>
  );
}

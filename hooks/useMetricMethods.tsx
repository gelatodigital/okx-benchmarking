import { useMutation } from "@tanstack/react-query";
import { privateKeyToAccount } from "viem/accounts";
import {
  createWalletClient,
  createPublicClient,
  formatEther,
  Hex,
  encodeFunctionData,
} from "viem";
import { baseSepolia } from "viem/chains";
import { http } from "viem";
import {
  createGelatoSmartWalletClient,
  erc20,
  sponsored,
} from "@gelatonetwork/smartwallet";
import { gelato } from "@gelatonetwork/smartwallet/accounts";
import retry from "async-retry";

// Create a public client to be used by all mutations
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(""),
});

interface TransactionMetrics {
  type: "transaction";
  latency: string;
  actualUserOpGas: string;
  l1Gas: string;
  l2Gas: string;
  txHash: string;
  totalTxFee: string;
}

const aaveAddress = "0x4Efbb89a18FF1DC5dE56540D99F5B340E78cAf21";
const data = encodeFunctionData({
  abi: [
    {
      name: "transfer",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
    },
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "account", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
  ],
  functionName: "transfer",
  args: ["0x11ae45Ab10039D1EA50A54edd2638200fa3aFaEa", BigInt(10000)],
});

export const useMetricMethods = () => {
  // GELATO mutation
  const useGelatoMutation = useMutation({
    mutationFn: async (): Promise<TransactionMetrics> => {
      try {
        if (!process.env.NEXT_PUBLIC_SPONSOR_API_KEY) {
          throw new Error("Missing NEXT_PUBLIC_SPONSOR_API_KEY");
        }
        const privateKey = process.env.NEXT_PUBLIC_DEV_WALLET_1 as Hex;
        const signer = privateKeyToAccount(privateKey);
        const account = await gelato({
          owner: signer,
          client: publicClient,
        });

        const walletClient = createWalletClient({
          account,
          chain: baseSepolia,
          transport: http(""),
        });

        const smartWalletClient = await createGelatoSmartWalletClient(
          walletClient,
          { apiKey: process.env.NEXT_PUBLIC_SPONSOR_API_KEY || "" }
        );

        const calls = [
          {
            to: aaveAddress as `0x${string}`,
            value: BigInt(0),
            data: data,
          },
        ];
        const preparedCalls = await smartWalletClient.prepare({
          payment: sponsored(process.env.NEXT_PUBLIC_SPONSOR_API_KEY || ""),
          calls,
        });

        const txStart = Date.now();
        const results = await smartWalletClient.send({ preparedCalls });
        console.log("Gelato 7702 SDK userOp hash (Sponsored)", results.id);
        const hash = await results?.wait();
        const txReceipt = await retry(
          async (bail: (error: Error) => void) => {
            try {
              const receipt = await publicClient.getTransactionReceipt({
                hash: hash as `0x${string}`,
              });
              if (!receipt) {
                throw new Error("Transaction receipt not found");
              }
              return receipt;
            } catch (error: any) {
              // If the error is that the transaction is not found yet, retry
              if (error.message?.includes("not be found")) {
                throw error; // This will trigger a retry
              }
              // For other errors, bail out
              bail(error);
              return;
            }
          },
          {
            retries: 5,
            minTimeout: 1000, // Wait 1 second between retries
            maxTimeout: 5000, // Maximum wait time between retries
          }
        );

        if (!txReceipt) {
          throw new Error("Failed to get transaction receipt after retries");
        }

        const l2GasUsed = txReceipt.gasUsed;
        const l1GasUsed = (txReceipt as any).l1GasUsed || "-";
        const totalGasUsed = l2GasUsed + l1GasUsed;
        const gasPrice = txReceipt.effectiveGasPrice || BigInt(0);
        const l1Fee = (txReceipt as any).l1Fee || BigInt(0);
        const totalTxFee = l1Fee + l2GasUsed * gasPrice;
        const block = await publicClient.getBlock({
          blockNumber: txReceipt.blockNumber,
        });
        const latencyMs = Number(block.timestamp) * 1000 - txStart;
        const latencyElapsed = latencyMs / 1000;

        return {
          type: "transaction",
          latency: latencyElapsed.toFixed(2),
          actualUserOpGas: totalGasUsed.toString(),
          l1Gas: l1GasUsed.toString(),
          l2Gas: l2GasUsed.toString(),
          txHash: hash as string,
          totalTxFee: formatEther(totalTxFee),
        };
      } catch (e) {
        console.error("Error in Gelato mutation:", e);
        return {
          type: "transaction",
          latency: "--",
          actualUserOpGas: "--",
          l1Gas: "--",
          l2Gas: "--",
          txHash: "--",
          totalTxFee: "--",
        };
      }
    },
  });

  // GELATO ERC20 mutation
  const useGelatoERC20Mutation = useMutation({
    mutationFn: async (): Promise<TransactionMetrics> => {
      try {
        if (!process.env.NEXT_PUBLIC_SPONSOR_API_KEY) {
          throw new Error("Missing NEXT_PUBLIC_SPONSOR_API_KEY");
        }
        const privateKey = process.env.NEXT_PUBLIC_DEV_WALLET_1 as Hex;
        const signer = privateKeyToAccount(privateKey);
        const account = await gelato({
          owner: signer,
          client: publicClient,
        });
        const walletClient = createWalletClient({
          account,
          chain: baseSepolia,
          transport: http(""),
        });

        const smartWalletClient = await createGelatoSmartWalletClient(
          walletClient,
          { apiKey: process.env.NEXT_PUBLIC_SPONSOR_API_KEY || "" }
        );

        const calls = [
          {
            to: aaveAddress as `0x${string}`,
            value: BigInt(0),
            data: data,
          },
        ];

        const tokenAddress = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
        // Send a no-op UserOperation
        const preparedCalls = await smartWalletClient.prepare({
          payment: erc20(tokenAddress),
          calls,
        });
        const txStart = Date.now();
        const results = await smartWalletClient.send({ preparedCalls });

        console.log("Gelato 7702 SDK userOp hash (ERC20)", results.id);
        const hash = await results?.wait();
        const txReceipt = await retry(
          async (bail: (error: Error) => void, attempt: number) => {
            try {
              // Force failure on first attempt
              if (attempt === 1) {
                throw new Error("Transaction could not be found");
              }

              const receipt = await publicClient.getTransactionReceipt({
                hash: hash as `0x${string}`,
              });
              if (!receipt) {
                throw new Error("Transaction receipt not found");
              }
              return receipt;
            } catch (error: any) {
              // If the error is that the transaction is not found yet, retry
              if (error.message?.includes("not be found")) {
                throw error; // This will trigger a retry
              }
              // For other errors, bail out
              bail(error);
              return;
            }
          },
          {
            retries: 5,
            minTimeout: 1000, // Wait 1 second between retries
            maxTimeout: 5000, // Maximum wait time between retries
          }
        );

        if (!txReceipt) {
          throw new Error("Failed to get transaction receipt after retries");
        }

        const l2GasUsed = txReceipt.gasUsed;
        const l1GasUsed = (txReceipt as any).l1GasUsed || "-";
        const totalGasUsed = l2GasUsed + l1GasUsed;
        const gasPrice = txReceipt.effectiveGasPrice || BigInt(0);
        const l1Fee = (txReceipt as any).l1Fee || BigInt(0);
        const totalTxFee = l1Fee + l2GasUsed * gasPrice;
        const block = await publicClient.getBlock({
          blockNumber: txReceipt.blockNumber,
        });
        const latencyMs = Number(block.timestamp) * 1000 - txStart;
        const latencyElapsed = latencyMs / 1000;

        return {
          type: "transaction",
          latency: latencyElapsed.toFixed(2),
          actualUserOpGas: totalGasUsed.toString(),
          l1Gas: l1GasUsed.toString(),
          l2Gas: l2GasUsed.toString(),
          txHash: hash as string,
          totalTxFee: formatEther(totalTxFee),
        };
      } catch (e) {
        console.error("Error in Gelato ERC20 mutation:", e);
        return {
          type: "transaction",
          latency: "--",
          actualUserOpGas: "--",
          l1Gas: "--",
          l2Gas: "--",
          txHash: "--",
          totalTxFee: "--",
        };
      }
    },
  });

  const useOKXERC20Mutation = useMutation({
    mutationFn: async (): Promise<TransactionMetrics> => {
      try {
        if (!process.env.NEXT_PUBLIC_SPONSOR_API_KEY) {
          throw new Error("Missing NEXT_PUBLIC_SPONSOR_API_KEY");
        }

        const txHash =
          "0x528ffc0e3a10105cabba53f19c6cfe79da3a4286b4bd8f85679764435418746d" as `0x${string}`;
        const txStart = Date.now();

        const txReceipt = await retry(
          async (bail: (error: Error) => void) => {
            try {
              const receipt = await publicClient.getTransactionReceipt({
                hash: txHash,
              });
              if (!receipt) {
                throw new Error("Transaction receipt not found");
              }
              return receipt;
            } catch (error: any) {
              if (error.message?.includes("not be found")) {
                throw error;
              }
              bail(error);
              return;
            }
          },
          {
            retries: 5,
            minTimeout: 1000,
            maxTimeout: 5000,
          }
        );

        if (!txReceipt) {
          throw new Error("Failed to get transaction receipt after retries");
        }

        const l2GasUsed = txReceipt.gasUsed;
        const l1GasUsed = (txReceipt as any).l1GasUsed || "-";
        const totalGasUsed = l2GasUsed + l1GasUsed;
        const gasPrice = txReceipt.effectiveGasPrice || BigInt(0);
        const l1Fee = (txReceipt as any).l1Fee || BigInt(0);
        const totalTxFee = l1Fee + l2GasUsed * gasPrice;
        const block = await publicClient.getBlock({
          blockNumber: txReceipt.blockNumber,
        });
        const latencyMs = Number(block.timestamp) * 1000 - txStart;
        const latencyElapsed = latencyMs / 1000;

        return {
          type: "transaction",
          latency: latencyElapsed.toFixed(2),
          actualUserOpGas: totalGasUsed.toString(),
          l1Gas: l1GasUsed.toString(),
          l2Gas: l2GasUsed.toString(),
          txHash: txHash,
          totalTxFee: formatEther(totalTxFee),
        };
      } catch (e) {
        console.error("Error in OKX ERC20 mutation:", e);
        return {
          type: "transaction",
          latency: "--",
          actualUserOpGas: "--",
          l1Gas: "--",
          l2Gas: "--",
          txHash: "--",
          totalTxFee: "--",
        };
      }
    },
  });

  const useOKXSponsoredMutation = useMutation({
    mutationFn: async (): Promise<TransactionMetrics> => {
      try {
        if (!process.env.NEXT_PUBLIC_SPONSOR_API_KEY) {
          throw new Error("Missing NEXT_PUBLIC_SPONSOR_API_KEY");
        }

        const txHash =
          "0xf2a7a06b5c196ca2c301e672ce426c3100782012a14b9f72329b0a8f57494598" as `0x${string}`;
        const txStart = Date.now();

        const txReceipt = await retry(
          async (bail: (error: Error) => void) => {
            try {
              const receipt = await publicClient.getTransactionReceipt({
                hash: txHash,
              });
              if (!receipt) {
                throw new Error("Transaction receipt not found");
              }
              return receipt;
            } catch (error: any) {
              if (error.message?.includes("not be found")) {
                throw error;
              }
              bail(error);
              return;
            }
          },
          {
            retries: 5,
            minTimeout: 1000,
            maxTimeout: 5000,
          }
        );

        if (!txReceipt) {
          throw new Error("Failed to get transaction receipt after retries");
        }

        const l2GasUsed = txReceipt.gasUsed;
        const l1GasUsed = (txReceipt as any).l1GasUsed || "-";
        const totalGasUsed = l2GasUsed + l1GasUsed;
        const gasPrice = txReceipt.effectiveGasPrice || BigInt(0);
        const l1Fee = (txReceipt as any).l1Fee || BigInt(0);
        const totalTxFee = l1Fee + l2GasUsed * gasPrice;
        const block = await publicClient.getBlock({
          blockNumber: txReceipt.blockNumber,
        });
        const latencyMs = Number(block.timestamp) * 1000 - txStart;
        const latencyElapsed = latencyMs / 1000;

        return {
          type: "transaction",
          latency: latencyElapsed.toFixed(2),
          actualUserOpGas: totalGasUsed.toString(),
          l1Gas: l1GasUsed.toString(),
          l2Gas: l2GasUsed.toString(),
          txHash: txHash,
          totalTxFee: formatEther(totalTxFee),
        };
      } catch (e) {
        console.error("Error in OKX sponsored mutation:", e);
        return {
          type: "transaction",
          latency: "--",
          actualUserOpGas: "--",
          l1Gas: "--",
          l2Gas: "--",
          txHash: "--",
          totalTxFee: "--",
        };
      }
    },
  });

  return {
    useGelatoMutation,
    useGelatoERC20Mutation,
    useOKXSponsoredMutation,
    useOKXERC20Mutation,
  };
};

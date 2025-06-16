# Gelato Smart Wallet Benchmark

A comprehensive benchmarking tool for comparing different Account Abstraction wallet implementations with a focus on the Gelato Smart Wallet SDK.

## Overview

This application provides a visual comparison of performance metrics for various ERC-4337 Account Abstraction wallet implementations, including:

- Gelato SmartWallet SDK
- OKX Wallet + Gelato Relay
- OKX Wallet + OKX Relay

The benchmark measures and compares:

- Account creation time
- Transaction latency
- L1 Gas consumption
- L2 Gas consumption
- Total gas used

## Features

- Real-time benchmarking of different wallet implementations
- Side-by-side metric comparisons
- Percentage improvements calculation
- Transaction links to block explorer
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites

- Node.js 16+
- PNPM 10+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gelato-smart-wallet-benchmark.git
cd gelato-smart-wallet-benchmark
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```
NEXT_PUBLIC_SPONSOR_API_KEY=your_gelato_sponsor_api_key
```

4. Run the development server:

```bash
pnpm dev
```

## Project Structure

- `/app` - Next.js pages and layouts
- `/components` - Reusable React components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions
- `/public` - Static assets
- `/styles` - Global CSS styles


### Steps to add a new comparison:

1. Add a new mutation method in `hooks/useMetricMethods.tsx`
2. Export the method from the useMetricMethods hook
3. Create a new page in the `/app` directory or add to existing page
4. Import the useMetricMethods hook and utilize the appropriate mutation
5. Use the Card and MetricsLabels components from the existing implementation

## Technologies

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gelato Network SDK](https://www.gelato.network/)


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Gelato Network](https://www.gelato.network/)


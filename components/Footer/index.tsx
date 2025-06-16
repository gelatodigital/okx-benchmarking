export const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 py-6 pb-10 px-6 text-sm text-gray-600 border-t mt-auto">
      <div className="text-center md:text-left">
        Built by Gelato • Powered by{" "}
        <a
          href="https://www.npmjs.com/package/@gelatonetwork/smartwallet"
          className="text-blue-500 hover:underline"
        >
          Gelato SmartWallet SDK
        </a>
      </div>
      <div className="flex gap-6">
        <a
          href="https://github.com/gelatodigital/gelato-smart-wallet-benchmark"
          className="hover:underline"
          target="_blank"
        >
          Docs
        </a>
        <a
          href="https://github.com/gelatodigital/gelato-smart-wallet-benchmark"
          className="hover:underline"
          target="_blank"
        >
          Source
        </a>
      </div>
    </footer>
  );
};

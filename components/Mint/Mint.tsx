"use client";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddBoxIcon from "@mui/icons-material/AddBox";

const { chains, provider } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_API_KEY! })]
);

const connectors = connectorsForWallets([
  {
    groupName: "Suggested",
    wallets: [metaMaskWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

export default function Mint() {
  const [count, setCount] = useState(0);

  const handleAddition = () => {
    if (count < 8) {
      setCount(() => count + 1);
    }
  };

  const handleSubtraction = () => {
    if (count > 0) {
      setCount(() => count - 1);
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div id="subtitles" className="mt-4 text-center">
        <div id="connect" className="mt-5 flex justify-center">
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  // Note: If your app doesn't use authentication, you
                  // can remove all 'authenticationStatus' checks
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");
                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              className="text-5xl bg-[#7EB14A] px-4 py-1 rounded-lg"
                              onClick={openConnectModal}
                              type="button"
                            >
                              Connect Wallet
                            </button>
                          );
                        }
                        if (chain.unsupported) {
                          return (
                            <button
                              className="text-5xl bg-[#7EB14A] px-4 py-1 rounded-lg"
                              onClick={openChainModal}
                              type="button"
                            >
                              Switch Network
                            </button>
                          );
                        }
                        return (
                          <div>
                            <div className="flex gap-x-4 justify-center items-center">
                              <IndeterminateCheckBoxIcon
                                onClick={handleSubtraction}
                                className="cursor-pointer text-[#7EB14A]"
                                fontSize="large"
                              />
                              <h1 className="text-5xl w-12">{count}</h1>
                              <AddBoxIcon
                                onClick={handleAddition}
                                className="cursor-pointer text-[#7EB14A]"
                                fontSize="large"
                              />
                            </div>
                            <div className="text-4xl md:text-5xl">
                              Price: {0.005 * count} ETH
                            </div>
                            <button className="text-4xl md:text-5xl bg-[#7EB14A] px-4 py-1 rounded-lg my-4">
                              MINT
                            </button>
                            <div className="flex justify-center mt-5">
                              <button
                                onClick={openAccountModal}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                type="button"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 24,
                                      height: 24,
                                      borderRadius: 999,
                                      overflow: "hidden",
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? "Chain icon"}
                                        src={chain.iconUrl}
                                        style={{ width: 24, height: 24 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {/* {chain.name} */}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </RainbowKitProvider>
          </WagmiConfig>
        </div>
      </div>
    </>
  );
}

"use client";
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
import { ethers, BigNumber } from "ethers";
import { nftAddress } from "../Config/Config";
import { useAccount, useNetwork } from "wagmi";
const nftABI = require("../ABI/nftABI.json");

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
import { useEffect, useState } from "react";

export default function Mint() {
  const [count, setCount] = useState(1);
  const [mintedAlready, setMintedAlready] = useState(0);
  const [totalMinted, setTotalMinted] = useState("0");
  const [minting, setMinting] = useState(false);
  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();

  let normalPrices = new Map([
    [1, "0"],
    [2, "0.005"],
    [3, "0.005"],
    [4, "0.010"],
    [5, "0.010"],
    [6, "0.015"],
    [7, "0.015"],
    [8, "0.020"],
    [9, "0.020"],
    [10, "0.025"],
    [11, "0.025"],
    [12, "0.030"],
    [13, "0.030"],
    [14, "0.035"],
    [15, "0.035"],
  ]);

  useEffect(() => {
    load();
    if (isConnected && address && chain?.id == polygonMumbai.id) {
      getAlreadyMinted();
    }
  }, [address, isConnected]);

  const load = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ALCHEMY_LINK!
    );
    let contract = new ethers.Contract(nftAddress, nftABI, provider);

    let Minted = await contract.totalSupply();
    let total = Number(Minted);
    setTotalMinted(total.toString());
  };

  const getAlreadyMinted = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, nftABI, signer);
    const mintedByUser = await contract.nftMinted(address);
    let numMintedByUser = Number(mintedByUser);
    setMintedAlready(numMintedByUser);
  };

  const handleAddition = () => {
    if (count < 15) {
      setCount(() => count + 1);
    }
  };

  const handleSubtraction = () => {
    if (count > 1) {
      setCount(() => count - 1);
    }
  };

  const handleMint = async () => {
    setMinting(true);

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftAddress, nftABI, signer);
    try {
      let cost;
      const mintPrice = await contract.MINT_PRICE();
      const mintedByUser = await contract.nftMinted(address);
      let numMintedByUser = Number(mintedByUser);
      const numMintPrice = Number(mintPrice);
      let freeCount = 0;
      let paidCount = 0;

      for (let i = 0; i < count; i++) {
        if (numMintedByUser % 2 == 0) {
          freeCount++;
          numMintedByUser++;
        } else if (numMintedByUser % 1 == 0) {
          paidCount++;
          numMintedByUser++;
        }
      }

      cost = freeCount * 0 + paidCount * numMintPrice;

      const tx = await contract.mint(count, {
        value: BigNumber.from(cost.toString()),
      });
      const wait = await provider.waitForTransaction(tx.hash);

      toast.success(`You have successfully minted ${count} FEPE(s)`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setMinting(false);
      await load();
    } catch (error: any) {
      toast.error(error.reason, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setMinting(false);
    }
  };

  const testnetMint = () => {
    toast.info("Stay tuned!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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

      <div id="subtitles" className="text-center">
        <div
          id="connect"
          className={`flex flex-col justify-center
          } text-white`}
        >
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
                            <div className="animate-bounce">
                              <button
                                className="text-3xl md:text-5xl bg-[#7EB14A] px-4 py-1 rounded-lg"
                                onClick={testnetMint}
                                // onClick={openConnectModal}
                                type="button"
                              >
                                Connect Wallet
                              </button>
                            </div>
                            // <span className="relative flex ">
                            //   <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-green-400 opacity-75"></span>
                            //   <span className="relative inline-flex rounded-2xl bg-green-500 text-5xl">
                            //     <button
                            //       className="text-5xl bg-[#7EB14A] px-4 py-1 rounded-2xl"
                            //       onClick={openConnectModal}
                            //       type="button"
                            //     >
                            //       Connect Wallet
                            //     </button>
                            //   </span>
                            // </span>
                          );
                        }
                        if (chain.unsupported) {
                          return (
                            <div className="animate-bounce">
                              <button
                                className="text-3xl md:text-5xl bg-[#7EB14A] px-4 py-1 rounded-lg"
                                onClick={openChainModal}
                                type="button"
                              >
                                Switch Network
                              </button>
                            </div>
                          );
                        }
                        return (
                          <div className="card-blur p-5">
                            <div className="flex gap-x-4 justify-center items-center">
                              <IndeterminateCheckBoxIcon
                                onClick={handleSubtraction}
                                className="cursor-pointer text-[#7EB14A]"
                                fontSize="large"
                              />
                              <h1 className="text-2xl md:text-5xl w-12">
                                {count}
                              </h1>
                              <AddBoxIcon
                                onClick={handleAddition}
                                className="cursor-pointer text-[#7EB14A]"
                                fontSize="large"
                              />
                            </div>
                            <div className="my-3">
                              <div className="text-3xl md:text-5xl">
                                {normalPrices.get(count + mintedAlready) &&
                                  "Price: "}
                                {!normalPrices.get(count + mintedAlready)
                                  ? "Limit Exceeded"
                                  : normalPrices.get(
                                      count + mintedAlready
                                    )}{" "}
                                {normalPrices.get(count + mintedAlready) &&
                                  "ETH"}
                              </div>
                              <div className="text-3xl md:text-5xl">
                                Minted: {totalMinted} / 10 000
                              </div>
                            </div>

                            <button
                              onClick={() => handleMint()}
                              className="text-3xl md:text-5xl bg-[#7EB14A] w-48 py-1 rounded-lg mt-4"
                              disabled={minting}
                              type="button"
                            >
                              {minting ? "Minting..." : "Mint"}
                            </button>

                            <div className="flex justify-end mt-4">
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
                                      width: 32,
                                      height: 32,
                                      borderRadius: 999,
                                      overflow: "hidden",
                                      marginRight: 4,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? "Chain icon"}
                                        src={chain.iconUrl}
                                        style={{ width: 32, height: 32 }}
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

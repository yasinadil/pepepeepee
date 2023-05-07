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
import { ethers, BigNumber } from "ethers";
import { nftAddress } from "../Config/Config";
import { useAccount } from "wagmi";
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
  const [totalMinted, setTotalMinted] = useState("0");
  const [minting, setMinting] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const { address, isConnected } = useAccount();

  let newUserPrices = new Map([
    [1, "0"],
    [2, "0.005"],
    [3, "0.010"],
    [4, "0.015"],
    [5, "0.020"],
    [6, "0.025"],
    [7, "0.030"],
    [8, "0.035"],
  ]);

  let normalPrices = new Map([
    [1, "0.005"],
    [2, "0.010"],
    [3, "0.015"],
    [4, "0.020"],
    [5, "0.025"],
    [6, "0.030"],
    [7, "0.035"],
    [8, "0.040"],
  ]);

  useEffect(() => {
    const load = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ALCHEMY_LINK!
      );
      let contract = new ethers.Contract(nftAddress, nftABI, provider);

      let Minted = await contract.totalSupply();
      let total = Number(Minted);
      setTotalMinted(total.toString());
    };
    load();
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      const price = async () => {
        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftAddress, nftABI, signer);
        const mintedByUser = await contract.nftMinted(address);
        const numMintedByUser = Number(mintedByUser);
        if (numMintedByUser == 0) {
          setNewUser(true);
        }
      };
      price();
    }
  }, [isConnected, address]);

  const handleAddition = () => {
    if (count < 8) {
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
      const freeMint = await contract.FREE_MINT();
      const mintedByUser = await contract.nftMinted(address);
      const numMintedByUser = Number(mintedByUser);
      const numFreeMint = Number(freeMint);
      const numMintPrice = Number(mintPrice);

      if (numMintedByUser == 0 && numFreeMint > 0) {
        cost = count * numMintPrice;
        cost = cost - numMintPrice;
      } else {
        cost = count * numMintPrice;
      }
      console.log(cost);

      const tx = await contract.mint(count, {
        value: BigNumber.from(cost.toString()),
      });
      const wait = await provider.waitForTransaction(tx.hash);
      setNewUser(false);
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

      <div id="subtitles" className="text-center card-blur">
        <div
          id="connect"
          className="flex flex-col justify-center p-5 text-white"
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
                              Price:{" "}
                              {newUser
                                ? newUserPrices.get(count)
                                : normalPrices.get(count)}{" "}
                              ETH
                            </div>
                            <div className="text-4xl md:text-5xl">
                              Minted: {totalMinted} / 10 000
                            </div>

                            {/* <button
                              onClick={() => handleMint()}
                              className="text-4xl md:text-5xl bg-[#7EB14A] py-1 rounded-lg my-4 w-32"
                              type="button"
                            >
                              Mint
                            </button>
                            <br /> */}

                            <button
                              onClick={() => handleMint()}
                              className="text-4xl md:text-5xl bg-[#7EB14A] w-32 py-1 rounded-lg mt-4"
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

"use client";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
// import ConnectButton from "../../public/assets/Button_Connect-Wallet.webp";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Web3Button } from "@thirdweb-dev/react";
import "react-toastify/dist/ReactToastify.css";

export default function Mint() {
  return (
    <ThirdwebProvider
      supportedWallets={[metamaskWallet()]}
      autoConnect={true}
      activeChain="mumbai"
      sdkOptions={{
        alchemyApiKey: process.env.NEXT_PUBLIC_API_KEY!, // your Alchemy API key
      }}
    >
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
          {/* <button>
            <Image
              alt="Connect wallet"
              src={ConnectButton}
              width="225"
              height="85"
              decoding="async"
              data-nimg="1"
              loading="lazy"
              style={{ color: "transparent" }}
            />
          </button> */}
          <ConnectWallet
            className="connect-btn"
            btnTitle="CONNECT WALLET"
            theme="light"
          />
        </div>
      </div>
    </ThirdwebProvider>
  );
}

{
  /* <Web3Button
                  className="bg-[#e7d17a] text-black py-2 hover:bg-red-600"
                  contractAddress={contractAddress}
                  contractAbi={erc721ABI}
                  theme="dark"
                  // Call the name of your smart contract function
                  action={(contract) => contract.call("mint", [1])}
                  onSuccess={async () => {
                    toast.success("Successfully minted your HEX Gen 1 Bag!", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    const provider = new ethers.providers.JsonRpcProvider(
                      process.env.NEXT_PUBLIC_ALCHEMY_LINK!
                    );
                    let contract = new ethers.Contract(
                      contractAddress,
                      erc721ABI,
                      provider
                    );

                    let Minted = await contract.totalSupply();
                    let total = Number(Minted);
                    setMinted(total.toString());
                  }}
                  onError={(error: any) =>
                    toast.error(error.reason, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    })
                  }
                >
                  Mint Now!
                </Web3Button> */
}

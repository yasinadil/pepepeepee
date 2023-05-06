import Image from "next/image";
import ConnectButton from "../public/assets/Button_Connect-Wallet.webp";
import pepeOrig from "../public/assets/pepe_orig.webp";
import logo from "../public/assets/Logo_pepe_pee-pee.webp";
import Mint from "@/components/Mint/Mint";

export default function Home() {
  return (
    <main className="grid min-h-screen grid-cols-[1fr_auto_1fr] flex-col items-center justify-center bg-pepe">
      <div
        id="left-side"
        className="h-full w-full animate-down bg-[url('../public/assets/PepesLeftSide.png')] bg-[length:auto_100%] bg-right"
      ></div>

      <div
        // style={{ minWidth: "260px" }}
        className=" min-w-[260px] xl:min-w-[380px] flex min-h-screen items-center justify-center overflow-visible bg-[url('../public/assets/PepesMid.png')] bg-[length:auto_100%] bg-center bg-no-repeat"
      >
        <div
          id="content"
          className="flex h-[740px] flex-col items-center justify-center"
        >
          <h1 className="pepe-txt pepe-txt-bold m-14 mx-0 text-3xl font-normal">
            <Image
              alt="Pepe original image"
              src={logo}
              width="220"
              height="205"
              decoding="async"
              data-nimg="1"
              loading="lazy"
              style={{ color: "transparent" }}
            />
          </h1>
          <Image
            alt="Pepe original image"
            src={pepeOrig}
            width="250"
            height="225"
            decoding="async"
            data-nimg="1"
            className="w-[160px] md:w-auto"
            loading="lazy"
            style={{ color: "transparent" }}
          />
          <Mint />
        </div>
      </div>

      <div
        id="right-side"
        className="h-full w-full animate-up bg-[url('../public/assets/PepesRightSide.png')] bg-[length:auto_100%] bg-left"
      ></div>
    </main>
  );
}

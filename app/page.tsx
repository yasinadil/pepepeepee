import Image from "next/image";
import ConnectButton from "../public/assets/Button_Connect-Wallet.webp";
import pepeOrig from "../public/assets/pepe_orig.webp";
import logo from "../public/assets/Logo_pepe_pee-pee.webp";
import Mint from "@/components/Mint/Mint";
import bg from "../public/assets/bg.png";

export default function Home() {
  return (
    <main className=" min-h-screen flex-col items-center justify-center bg-pepe bg-[url('../public/assets/bg.png')] bg-cover bg-no-repeat">
      <div
        // style={{ minWidth: "260px" }}
        className=" min-w-[260px] xl:min-w-[380px] flex flex-col min-h-screen items-center justify-center"
      >
        <div
          id="content"
          className="flex h-[740px] flex-col items-center justify-center"
        >
          {/* <h1 className="text-9xl">Mint your FEPES NOW!</h1> */}
          <Mint />
        </div>
      </div>
    </main>
  );
}

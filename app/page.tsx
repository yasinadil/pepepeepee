import Mint from "@/components/Mint/Mint";

export default function Home() {
  return (
    <main className=" min-h-screen flex-col items-center justify-center bg-pepe bg-[url('../public/assets/bg_mobile.jpg')] xl:bg-[url('../public/assets/bg.png')] bg-cover bg-no-repeat bg-center">
      <div className="min-w-[260px] xl:min-w-[380px] flex flex-col min-h-screen items-center justify-center">
        <div
          id="content"
          className="flex h-[740px] flex-col items-center justify-center"
        >
          <div className="mt-16 md:mt-0">
            {" "}
            <Mint />
          </div>
        </div>
      </div>
    </main>
  );
}

import WiiGrid from "@/components/WiiGrid";
import BottomBar from "@/components/BottomBar";

export default function Home() {
  return (
    <div className="wii-screen relative h-dvh w-screen overflow-hidden select-none">
      <main>
        <WiiGrid />
      </main>
      <footer>
        <BottomBar />
      </footer>
    </div>
  );
}

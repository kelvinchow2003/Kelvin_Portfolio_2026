import DiscScene from "./scenes/DiscScene";
import ShelleyScene from "./scenes/ShelleyScene";
import TpaScene from "./scenes/TpaScene";
import GreenSpiegelScene from "./scenes/GreenSpiegelScene";
import BothwellScene from "./scenes/BothwellScene";
import LssScene from "./scenes/LssScene";
import AtsScene from "./scenes/AtsScene";
import CoinScene from "./scenes/CoinScene";
import AperaScene from "./scenes/AperaScene";
import CognexUrScene from "./scenes/CognexUrScene";
import UrYaskawaScene from "./scenes/UrYaskawaScene";
import IronCadScene from "./scenes/IronCadScene";
import PersonalSiteScene from "./scenes/PersonalSiteScene";
import GithubScene from "./scenes/GithubScene";
import LinkedinScene from "./scenes/LinkedinScene";
import type { ChannelSceneKind } from "@/lib/channels";
import type { SceneVariant } from "./scenes/SceneSvg";

type Props = {
  kind: ChannelSceneKind;
  variant: SceneVariant;
  className?: string;
};

const SCENES: Record<ChannelSceneKind, React.ComponentType<{ variant: SceneVariant; className?: string }>> = {
  disc: DiscScene,
  shelley: ShelleyScene,
  tpa: TpaScene,
  greenspiegel: GreenSpiegelScene,
  bothwell: BothwellScene,
  lss: LssScene,
  ats: AtsScene,
  coin: CoinScene,
  apera: AperaScene,
  cognexur: CognexUrScene,
  uryaskawa: UrYaskawaScene,
  ironcad: IronCadScene,
  personalsite: PersonalSiteScene,
  github: GithubScene,
  linkedin: LinkedinScene,
};

// Animated channel banners. The same scene drives the tile on the Wii Menu
// and the full-width banner on the channel's splash screen.
export default function ChannelScene({ kind, variant, className }: Props) {
  const Scene = SCENES[kind];
  return <Scene variant={variant} className={className} />;
}

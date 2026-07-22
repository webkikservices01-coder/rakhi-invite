import tying from "@/assets/hero-tying.jpg";
import thali from "@/assets/hero-thali.jpg";
import gift from "@/assets/hero-gift.jpg";
import family from "@/assets/hero-family.jpg";
import decor from "@/assets/hero-decor.jpg";
import rakhi from "@/assets/hero-rakhi.jpg";
import kids from "@/assets/hero-kids.jpg";
import rangoli from "@/assets/hero-rangoli.jpg";
import taj from "@/assets/mon-taj.jpg";
import qutub from "@/assets/mon-qutub.jpg";
import humayun from "@/assets/mon-humayun.jpg";
import eiffel from "@/assets/mon-eiffel.jpg";
import burj from "@/assets/mon-burj.jpg";
import beach from "@/assets/mon-beach.jpg";

import rakhiHands1 from "@/assets/web-rakhihands1.jpg";
import rakhiTie1 from "@/assets/web-rakhitie1.jpg";
import rakhiWrist1 from "@/assets/web-rakhiwrist1.jpg";
import rakhiTray1 from "@/assets/web-rakhitray1.jpg";
import rakhiTieWoman from "@/assets/web-rakhitiewoman.jpg";
import rakhiWhite from "@/assets/web-rakhiwhite.jpg";
import rakhiHandsTie2 from "@/assets/web-rakhihandstie2.jpg";
import rakhiFriendship from "@/assets/web-rakhifriendship.jpg";
import kidsFlour from "@/assets/web-kidsflour.jpg";
import diyaGlow1 from "@/assets/web-diyaglow1.jpg";
import diyaNight from "@/assets/web-diyanight.jpg";
import diyaCreative from "@/assets/web-diyacreative.jpg";
import diyaFabric from "@/assets/web-diyafabric.jpg";
import diyaRows from "@/assets/web-diyarows.jpg";
import diyaMarigold from "@/assets/web-diyamarigold.jpg";
import marigoldClose from "@/assets/web-marigoldclose.jpg";
import marigoldBamboo from "@/assets/web-marigoldbamboo.jpg";
import marigoldWhite from "@/assets/web-marigoldwhite.jpg";
import marigoldHands from "@/assets/web-marigoldhands.jpg";
import sweetsTray from "@/assets/web-sweetstray.jpg";
import sweetsNuts from "@/assets/web-sweetsnuts.jpg";
import sweetsBowls from "@/assets/web-sweetsbowls.jpg";
import sweetsLaddu from "@/assets/web-sweetsladdu.jpg";
import giftFloral from "@/assets/web-giftfloral.jpg";
import giftPurple from "@/assets/web-giftpurple.jpg";
import giftGold from "@/assets/web-giftgold.jpg";
import giftColorful from "@/assets/web-giftcolorful.jpg";
import balloonsSky from "@/assets/web-balloonssky.jpg";
import balloonsPastel from "@/assets/web-balloonspastel.jpg";
import balloonsPinkGold from "@/assets/web-balloonspinkgold.jpg";
import balloonsBouquet from "@/assets/web-balloonsbouquet.jpg";
import rangoliMaking from "@/assets/web-rangolimaking.jpg";
import rangoliHands from "@/assets/web-rangolihands.jpg";
import rangoliPetals from "@/assets/web-rangolipetals.jpg";
import rangoliDiya from "@/assets/web-rangolidiya.jpg";
import mehndiHands1 from "@/assets/web-mehndihands1.jpg";
import mehndiDetail from "@/assets/web-mehndidetail.jpg";
import mehndiJewelry from "@/assets/web-mehndijewelry.jpg";
import familyFlags from "@/assets/web-familyflags.jpg";
import familyDinner from "@/assets/web-familydinner.jpg";
import familySparklers from "@/assets/web-familysparklers.jpg";
import familyGathering from "@/assets/web-familygathering.jpg";
import familyOutdoor from "@/assets/web-familyoutdoor.jpg";
import starsMilky1 from "@/assets/web-starsmilky1.jpg";
import starsGalaxy from "@/assets/web-starsgalaxy.jpg";
import starsConstellation from "@/assets/web-starsconstellation.jpg";
import starsJaisalmer from "@/assets/web-starsjaisalmer.jpg";
import confettiWater from "@/assets/web-confettiwater.jpg";
import confettiConcert from "@/assets/web-confetticoncert.jpg";
import confettiClose from "@/assets/web-confetticlose.jpg";
import redFortFront from "@/assets/web-redfortfront.jpg";
import hawaMahalFacade from "@/assets/web-hawamahalfacade.jpg";

export const IMAGES = {
  tying, thali, gift, family, decor, rakhi, kids, rangoli,
  taj, qutub, humayun, eiffel, burj, beach,
  rakhiHands1, rakhiTie1, rakhiWrist1, rakhiTray1, rakhiTieWoman, rakhiWhite, rakhiHandsTie2, rakhiFriendship,
  kidsFlour,
  diyaGlow1, diyaNight, diyaCreative, diyaFabric, diyaRows, diyaMarigold,
  marigoldClose, marigoldBamboo, marigoldWhite, marigoldHands,
  sweetsTray, sweetsNuts, sweetsBowls, sweetsLaddu,
  giftFloral, giftPurple, giftGold, giftColorful,
  balloonsSky, balloonsPastel, balloonsPinkGold, balloonsBouquet,
  rangoliMaking, rangoliHands, rangoliPetals, rangoliDiya,
  mehndiHands1, mehndiDetail, mehndiJewelry,
  familyFlags, familyDinner, familySparklers, familyGathering, familyOutdoor,
  starsMilky1, starsGalaxy, starsConstellation, starsJaisalmer,
  confettiWater, confettiConcert, confettiClose,
  redFortFront, hawaMahalFacade,
} as const;

export type ImageKey = keyof typeof IMAGES;

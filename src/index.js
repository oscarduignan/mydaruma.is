import "./styles.css";
import darumaBody from "./daruma-body.png";
import darumaShadow from "./daruma-shadow.png";

import {
  styler,
  tween,
  spring,
  listen,
  pointer,
  value,
  physics,
  transform
} from "popmotion";

const { clamp } = transform;

document.getElementById("app").innerHTML = `
  <div id="daruma" class="daruma">
    <img class="daruma-shadow" src="${darumaShadow}">
    <svg class="daruma-silhouette" id="daruma-svg" viewBox="0 0 1119 1276" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path id="daruma-silouette-path" d="M202.404686,143.143797 C222.133955,120.112531 240.950424,102.184993 258.854094,89.3611831 C276.757764,76.5373732 307.87359,61.9308123 352.201573,45.5415003 C413.775874,21.6943075 459.304261,7.55905251 488.786733,3.13573536 C518.269205,-1.28758179 556.428137,0.291889121 603.26353,7.87414809 C674.15753,13.0811366 727.330512,21.6041227 762.782476,33.4431063 C798.234441,45.28209 843.3303,69.5754296 898.070054,106.323125 C927.41143,126.93918 951.134,148.76637 969.237763,171.804695 C987.341525,194.84302 1012.1838,234.818041 1043.76457,291.729759 C1070.15561,335.240446 1090.07036,388.932301 1103.50882,452.805326 C1116.94729,516.67835 1121.40204,582.311945 1116.87305,649.706111 C1114.27354,705.974283 1109.8188,748.547402 1103.50882,777.425469 C1099.58711,795.373475 1094.63924,819.431669 1083.35112,848.070906 C1078.76826,859.698143 1070.15488,880.738713 1057.51097,911.192613 C1036.71547,954.677388 1019.92116,987.212229 1007.12804,1008.79713 C1000.74055,1019.57428 993.651307,1030.51185 984.134778,1044.69348 C977.772405,1054.17475 966.258471,1069.20933 949.592978,1089.79721 C929.704501,1109.47274 914.717308,1123.06006 904.631397,1130.55917 C889.502531,1141.80784 823.558214,1188.78896 817.393617,1193.24859 C762.105785,1233.24528 706.973668,1258.5629 651.997265,1269.20144 C578.933876,1283.34002 494.207886,1273.66908 397.819296,1240.18863 C308.903534,1217.7003 250.411142,1198.31508 222.34212,1182.03294 C211.724376,1175.87386 202.148892,1169.39438 193.615668,1162.59451 C186.099059,1156.60475 178.450999,1149.6172 170.671486,1141.63186 C158.874154,1129.5224 134.427974,1107.34609 112.979891,1080.05758 C111.305114,1077.92676 96.7174342,1065.17192 82.680433,1038.06981 C76.1676154,1025.4951 66.5982939,1001.53428 53.9724686,966.187336 C15.3510137,850.241666 -2.2144587,752.172347 1.27605131,671.979378 C3.32819191,624.832329 7.7189674,544.801779 26.1163973,468.904424 C32.6252592,442.052554 48.5187081,386.72059 66.7886062,338.514571 C70.6954508,328.206171 75.9927264,317.579374 82.680433,306.634179 C102.720436,274.451923 119.368057,249.548513 132.623295,231.923951 C143.117148,217.97101 155.955345,194.080426 175.318414,171.804695 C178.715253,167.896891 187.74401,158.343259 202.404686,143.143797 Z" fill="red" fill-rule="nonzero"></path>
      </g>
    </svg>
    <img class="daruma-body" src="${darumaBody}">
  </div>
`;

const darumaElement = document.getElementById("daruma");

const darumaStyler = styler(darumaElement);

const darumaOutlineStyler = styler(
  document.querySelector(".daruma-silhouette")
);

darumaOutlineStyler.set({ opacity: 0, width: "140%" });

const pointerX = value(0);

pointer()
  .pipe(({ x }) => x)
  .start(pointerX);

const darumaPhysics = physics({
  restSpeed: false,
  friction: 0.8,
  springStrength: 300
})
  .pipe(Math.round)
  .start(x => {
    darumaStyler.set("rotate", clamp(-45, 45)(x));
  });

let animationBlocked, unblockAnimation;

listen(darumaElement, "mousedown touchstart").start(() => {
  //if (animationBlocked) return clearTimeout(unblockAnimation);

  animationBlocked = true;

  darumaPhysics
    .setVelocity(clamp(-200, 200)(pointerX.get()))
    .setSpringTarget(0);

  spring({
    to: 1,
    from: 1,
    velocity: 1
  }).start(darumaStyler.set("scale"));

  tween({
    from: { opacity: 0.3, width: "100%" },
    to: { opacity: 0, width: "140%" }
  }).start(darumaOutlineStyler.set);
});

listen(darumaElement, "mouseout").start(() => {
  unblockAnimation = setTimeout(() => (animationBlocked = false), 200);
});

/*
listen(daruma, "mousedown touchstart").start(() => {
  gravity.set(50).setVelocity(-500);
});
*/

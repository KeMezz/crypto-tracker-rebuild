import { atom } from "recoil";

export const isDark = atom({
  key: "theme",
  default: false,
});

export const coinCount = atom({
  key: "coinCount",
  default: 40,
});

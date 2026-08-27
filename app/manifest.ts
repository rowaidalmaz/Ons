import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أُنس",
    short_name: "أُنس",
    description: "تعبانة الملم، عادي. أُنس ما يضويك في الطريق، بس يحن عليك.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF3EA",
    theme_color: "#9C4E38",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

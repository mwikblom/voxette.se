export default class Constants {
  public static BOARD_MEMBER = "Styrelsemedlem";
  public static ADMIN = "Admin";
  public static TREASURER = "Kassör";
  public static INACTIVE = "Inaktiv";
  public static SOPRANO1 = "Sopran 1";
  public static SOPRANO2 = "Sopran 2";
  public static ALTO1 = "Alt 1";
  public static ALTO2 = "Alt 2";
  public static CONDUCTOR = "Dirigent";
  public static NOTES = "Noter";
  public static IMAGES = "Bilder";
  public static AUDIO = "Ljudfiler";
  public static DOCUMENTS = "Dokument";
  public static CURRENT = "Aktuellt";
  public static CURRENT_AUDIO = "Aktuella ljudfiler";
  public static OTHER = "Övrigt";

  public static MEMBER_TAGS = [Constants.BOARD_MEMBER, Constants.ADMIN, Constants.TREASURER, Constants.INACTIVE];

  public static MEMBER_PARTS = [
    Constants.SOPRANO1,
    Constants.SOPRANO2,
    Constants.ALTO1,
    Constants.ALTO2,
    Constants.CONDUCTOR,
  ];

  public static FILE_TYPES = [Constants.NOTES, Constants.IMAGES, Constants.AUDIO, Constants.DOCUMENTS, Constants.OTHER];

  public static FILE_CATEGORIES = ["Fest", "Jul", "Lucia", "Sommar", "Valborg", "Världens barn"];

  public static FILE_TAGS = [
    {
      name: "Allmänna",
      tags: ["Valborg", "Lucia"],
    },
    {
      name: "VT26",
      tags: ["VT26 Valborg", "VT26 Nationaldag", "VT26 Sommarkonsert"],
    },
    {
      name: "HT25",
      tags: ["HT25"],
    },
    {
      name: "VT25",
      tags: ["VT25 Hennes röst", "VT25 Valborg", "VT25 Nationaldag", "VT25 Junikonsert"],
    },
    {
      name: "HT24",
      tags: ["HT24 Live at heart", "HT24 Solala", "HT24 Nikolai", "HT24 Lucia", "HT24 Gig", "HT24 Övrigt"],
    },
    {
      name: "VT24",
      tags: ["VT24 Valborg", "VT24 Nationaldag", "VT24 Konsert", "VT24 Kumla"],
    },
    {
      name: "HT23",
      tags: ["HT23 Jul", "HT23 Lucia", "HT23 Gig", "HT23 Övrigt"],
    },
    {
      name: "VT23",
      tags: ["VT23 Valborg", "VT23 Gudstjänst", "VT23 Konsert", "VT23 Resa"],
    },
    {
      name: "HT22",
      tags: ["HT22 Världens barn", "HT22 Lucia", "HT22 Jul", "HT22 Gig", "HT22 Övrigt"],
    },
    {
      name: "VT22",
      tags: ["VT22 Konsert", "VT22 Nationaldag", "VT22 Övrigt"],
    },
    {
      name: "HT21",
      tags: ["HT21 Världens barn", "HT21 Jul1", "HT21 Lucia", "HT21 Nikolai", "HT21 Gig", "HT21 Övrigt"],
    },
    {
      name: "VT21",
      tags: ["VT21 Disco", "VT21 Nationaldag"],
    },
    {
      name: "HT20",
      tags: ["HT20 Världens barn", "HT20 Lucia", "HT20 Julpaket 1", "HT20 Julpaket 2"],
    },
  ];
}

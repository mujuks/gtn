import type { StoryMedia } from "./media";

export type Badge = "live" | "video" | "analysis" | "exclusive";

export type Placement = "for-you" | "news";

export type Story = {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  time: string;
  seed: number;
  badge?: Badge;
  author?: string;
  media?: StoryMedia;
  placement?: Placement;
};

export const breaking: string[] = [
  "Parliament passes affordable housing bill after an overnight debate",
  "Central bank holds lending rates steady, signals cut in December",
  "National athletics squad named for continental championships",
  "Flooding displaces thousands in coastal counties, relief teams deployed",
];

export const leadStory: Story = {
  id: "lead-1",
  title:
    "Global climate summit opens with landmark agreement on fossil fuel phase-down",
  excerpt:
    "Delegates from 190 countries reached a draft deal in the early hours of Wednesday, committing wealthy nations to double adaptation funding and set binding timelines for coal retirement.",
  category: "News",
  time: "2 hours ago",
  seed: 7,
  author: "Joseph Muia",
};

export const topTrioStories: Story[] = [
  {
    id: "sec-1",
    title:
      "Parliament passes sweeping housing bill after marathon overnight session",
    excerpt:
      "The law creates a national construction fund and caps rent increases in major urban centres for the next three years.",
    category: "Politics",
    time: "3 hours ago",
    seed: 12,
    author: "Edwin Obuya",
  },
  {
    id: "sec-2",
    title: "Markets rally as central bank holds interest rates steady",
    excerpt:
      "The blue-chip index closed 2.4% higher after the monetary policy committee signalled a cut before the end of the year.",
    category: "Business",
    time: "4 hours ago",
    seed: 3,
    author: "Amina Wekesa",
  },
  {
    id: "top-3",
    title:
      "Health ministry rolls out nationwide vaccination campaign in schools",
    category: "Health",
    time: "5 hours ago",
    seed: 21,
    badge: "live",
  },
];

export const trendingStories: Story[] = [
  {
    id: "tr-1",
    title: "Parliament passes sweeping housing bill after marathon debate",
    category: "News",
    time: "1 hour ago",
    seed: 12,
  },
  {
    id: "tr-2",
    title: "Markets rally as central bank holds interest rates steady",
    category: "Business",
    time: "2 hours ago",
    seed: 3,
  },
  {
    id: "tr-3",
    title: "Marathon record falls as Kenyan pair take one-two in Berlin",
    category: "Sports",
    time: "4 hours ago",
    seed: 8,
  },
  {
    id: "tr-4",
    title:
      "Rail network extension reaches practical completion two months early",
    category: "News",
    time: "6 hours ago",
    seed: 41,
  },
  {
    id: "tr-5",
    title: "Health ministry rolls out vaccination drive in schools",
    category: "Health",
    time: "8 hours ago",
    seed: 21,
  },
  {
    id: "tr-6",
    title: "Court orders independent audit of county procurement records",
    category: "Politics",
    time: "10 hours ago",
    seed: 17,
  },
  {
    id: "tr-7",
    title: "Mobile money transfers cross a record monthly threshold",
    category: "Technology",
    time: "12 hours ago",
    seed: 11,
  },
  {
    id: "tr-8",
    title: "Neighbours sign cross-border trade pact after decade of talks",
    category: "World",
    time: "15 hours ago",
    seed: 19,
  },
  {
    id: "tr-9",
    title: "Independent film festival announces its full 2026 line-up",
    category: "Entertainment",
    time: "18 hours ago",
    seed: 34,
  },
  {
    id: "tr-10",
    title: "University research team develops drought-resistant maize variety",
    category: "Science",
    time: "21 hours ago",
    seed: 28,
  },
];

export const homeFeed: Story[] = [
  {
    id: "fd-1",
    title:
      "Rail network extension reaches practical completion two months early",
    excerpt:
      "Passenger services on the new line are expected to begin before the holiday season, cutting commuter times by up to 40 minutes.",
    category: "News",
    time: "25 min ago",
    seed: 41,
    author: "Edwin Obuya",
  },
  {
    id: "fd-2",
    title: "County assemblies pass budget review motion in second reading",
    category: "County",
    time: "1 hour ago",
    seed: 22,
    author: "Faith Chebet",
  },
  {
    id: "fd-3",
    title: "Health ministry rolls out school vaccination drive in 12 counties",
    category: "Health",
    time: "2 hours ago",
    seed: 21,
    author: "Mercy Wanjiku",
  },
  {
    id: "fd-4",
    title:
      "Coalition talks resume as parties race to meet election reform deadline",
    excerpt:
      "Negotiators say progress has been made on the voter registration framework, but constituency boundaries remain disputed.",
    category: "Politics",
    time: "3 hours ago",
    seed: 23,
    author: "Joseph Muia",
  },
  {
    id: "fd-5",
    title: "Central bank holds rates steady, signals cut before December",
    category: "Business",
    time: "4 hours ago",
    seed: 3,
    author: "Amina Wekesa",
  },
  {
    id: "fd-6",
    title: "Tech hubs report record foreign investment in the first quarter",
    category: "Technology",
    time: "5 hours ago",
    seed: 5,
    author: "Brian Kiprotich",
  },
  {
    id: "fd-7",
    title:
      "Neighbours sign cross-border trade pact after decade of negotiations",
    category: "World",
    time: "6 hours ago",
    seed: 19,
    author: "AFP",
  },
  {
    id: "fd-8",
    title: "University research team develops drought-resistant maize variety",
    excerpt:
      "Field trials show yields holding steady through a second consecutive failed rainy season, with distribution planned for next year.",
    category: "Science",
    time: "7 hours ago",
    seed: 28,
    author: "Grace Njeri",
  },
  {
    id: "fd-9",
    title: "Manufacturing output rises for the fourth straight month",
    category: "Business",
    time: "8 hours ago",
    seed: 31,
    author: "David Otieno",
  },
  {
    id: "fd-10",
    title: "Marathon record falls as Kenyan pair take one-two in Berlin",
    excerpt:
      "Both runners broke the two-hour-four barrier in ideal conditions on a crisp autumn morning.",
    category: "Sports",
    time: "10 hours ago",
    seed: 8,
    author: "GTN Newsroom",
  },
  {
    id: "fd-11",
    title: "Soundtrack of the summer: five albums defining the season",
    category: "Entertainment",
    time: "11 hours ago",
    seed: 15,
    author: "Faith Chebet",
  },
  {
    id: "fd-12",
    title: "New anti-corruption unit begins vetting of senior public officers",
    category: "Politics",
    time: "12 hours ago",
    seed: 6,
    author: "Joseph Muia",
  },
  {
    id: "fd-13",
    title: "Drought response fund opens applications for small-scale farmers",
    category: "News",
    time: "14 hours ago",
    seed: 33,
    author: "Mercy Wanjiku",
  },
  {
    id: "fd-14",
    title: "Relief convoys reach cut-off regions following ceasefire extension",
    category: "World",
    time: "16 hours ago",
    seed: 26,
    author: "AFP",
  },
  {
    id: "fd-15",
    title: "Mobile money transfers cross a record monthly threshold",
    category: "Technology",
    time: "18 hours ago",
    seed: 11,
    author: "Brian Kiprotich",
  },
  {
    id: "fd-16",
    title: "Independent film festival announces its full 2026 line-up",
    category: "Entertainment",
    time: "20 hours ago",
    seed: 34,
    author: "David Otieno",
  },
  {
    id: "fd-17",
    title: "National squad begins camp ahead of continental championships",
    category: "Sports",
    time: "22 hours ago",
    seed: 30,
    author: "Grace Njeri",
  },
  {
    id: "fd-18",
    title: "Coffee prices climb as global supply tightens",
    category: "Business",
    time: "1 day ago",
    seed: 47,
    author: "Amina Wekesa",
  },
  {
    id: "fd-19",
    title: "Tourism numbers hit five-year high as direct flights expand",
    category: "News",
    time: "1 day ago",
    seed: 14,
    author: "Edwin Obuya",
  },
  {
    id: "fd-20",
    title: "Space agency confirms successful deployment of weather satellite",
    category: "Science",
    time: "2 days ago",
    seed: 38,
    author: "GTN Newsroom",
  },
  {
    id: "fd-21",
    title: "Woman rescued alive after week-long search in the forest",
    category: "County",
    time: "2 days ago",
    seed: 49,
    author: "Mercy Wanjiku",
  },
];

export const entertainmentStories: Story[] = [
  {
    id: "ent-1",
    title: "Soundtrack of the summer: five albums defining the season",
    category: "Entertainment",
    time: "11 hours ago",
    seed: 15,
    author: "Faith Chebet",
  },
  {
    id: "ent-2",
    title: "Independent film festival announces its full 2026 line-up",
    category: "Entertainment",
    time: "20 hours ago",
    seed: 34,
    author: "David Otieno",
  },
  {
    id: "ent-3",
    title: "Stage adaptation of beloved novel sells out its opening run",
    category: "Entertainment",
    time: "1 day ago",
    seed: 24,
    author: "Grace Njeri",
  },
];

export const opinionPieces: Story[] = [
  {
    id: "op-1",
    title: "Why the housing bill is only the beginning of the urban story",
    category: "Opinion",
    time: "Today",
    seed: 27,
    author: "Amina Wekesa",
  },
  {
    id: "op-2",
    title:
      "The interest rate decision was right — but not for the reason given",
    category: "Opinion",
    time: "Today",
    seed: 13,
    author: "David Otieno",
  },
  {
    id: "op-3",
    title:
      "Our athletes keep winning. Our grassroots facilities keep crumbling",
    category: "Opinion",
    time: "Yesterday",
    seed: 42,
    author: "Grace Njeri",
  },
];

export const allStories: Story[] = [
  leadStory,
  ...topTrioStories,
  ...trendingStories,
  ...homeFeed,
  ...entertainmentStories,
  ...opinionPieces,
];

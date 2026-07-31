export interface Posting {
  title: string;
  url: string;
  company?: string;
  location?: string;
  postedAt?: string;
  source: "Jobberman" | "Forward by Anakle" | "Kuda";
}

export interface DirectPullResult {
  id: string;
  name: string;
  blurb: string;
  color: string;
  careersUrl: string;
  status: "live" | "empty" | "error";
  postings: Posting[];
}

export interface FeedResponse {
  role: string | null;
  generatedAt: string;
  feedStatus: "live" | "error";
  postings: Posting[];
  directPulls: DirectPullResult[];
}

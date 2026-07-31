export interface Posting {
  title: string;
  url: string;
  location?: string;
  postedAt?: string;
}

export interface CompanyResult {
  id: string;
  name: string;
  blurb: string;
  color: string;
  careersUrl: string;
  status: "live" | "search-only" | "empty" | "error";
  postings: Posting[];
  searchLinks: {
    linkedin: string;
    google?: string;
    jobberman: string;
  };
  checkedAt: string;
}

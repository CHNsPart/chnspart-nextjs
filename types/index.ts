export interface TestimonialType {
  avatar: string;
  name: string;
  role: string;
  company?: string;
  text: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  description?: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Link {
  text: string;
  url: string;
}

export interface DescriptionItem {
  text?: string;
  description?: string;
  links?: Link[];
  link?: Link | Link[];
  credentials?: {
    username: string;
    password: string;
  };
}

export interface TimelineItem {
  title: string;
  role?: string;
  period?: string;
  url?: string;
  description?: string | Array<string | DescriptionItem>;
}
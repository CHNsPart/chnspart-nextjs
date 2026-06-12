import { TimelineItem } from "@/types";

export const ABOUT_TEXT = [
  "I'm Touhidul Islam Chayan, a software engineer specializing in front-end development, UI/UX design, and machine learning. I have experience with independent international clients and full-time jobs, honing my skills in various technologies.",
  "My expertise is in JavaScript, with a focus on front-end development using Next.JS and Vite with Sass or Tailwind CSS. For back-end development, I use Node.JS and its frameworks, including Express.JS and Nest.JS. Additionally, I'm a skilled UI/UX designer, creating visually appealing and user-friendly interfaces.",
  "In the field of machine learning, I have experience with deep learning and pre-trained models. I've published research on IEEE in the computer vision field, where I used these techniques to predict glaucoma with an accuracy of 94.71% and its explanation."
];

export const SERVICES = [
  {
    icon: "/images/icon-design.svg",
    title: "UI/UX design",
    text: "The most modern and high-quality design made at a professional level."
  },
  {
    icon: "/images/icon-dev.svg",
    title: "Frontend development",
    text: "High-quality frontend development of sites at the professional level."
  },
  {
    icon: "/images/icon-app.svg",
    title: "Backend development", 
    text: "Professional backend development of applications in JavaScript."
  },
  {
    icon: "/images/icon-photo.svg",
    title: "Machine Learning",
    text: "I specialize in developing high-quality machine learning applications."
  }
];

export const TESTIMONIALS = [
  {
    avatar: "/images/avatar-4.png",
    name: "Masru Ahmed Rafi",
    role: "CEO & Co-Founder",
    company: "BanBase & AD-IQ",
    text: "Touhidul Islam Chayan, has been employed by AD-IQ and later on Ban Base and as an UI/UX Designer & Software Engineer from Jan 2021 to MAY 2022. Mr. Chayan consistently exhibited professionalism, dedication, and a strong work ethic during their tenure with our company. They made valuable contributions to our projects and demonstrated excellent problem-solving abilities.",
    date: "2022-05-25"
  },
  {
    avatar: "/images/avatar-1.png",
    name: "Rayeean Shafkat",
    role: "CEO & Co-Founder",
    company: "DDAD",
    text: "This is to certify that Touhidul Islam Chayan, resident of 24/4 Green Road, Staff- Quarter, Dhaka 1205, has shown exemplary work performance in the IT and Marketing Division of Dokane Dokane AD. We have found Mr. Chayan to be sincere, dedicated and honest during his working period and we him all the success he deserves in the futre.",
    date: "2021-07-17"
  },
  {
    avatar: "/images/my-avatar.png",
    name: "M. Shabbir Ali",
    role: "Director, Group-HR",
    company: "City Group",
    text: "Touhidul Islam Chayan served as a dedicated ML & Software Engineer in City Group's AD-IQ department from 2022 to 2023, making significant contributions. His notable achievements include spearheading the creation of the AD-IQ UI and developing its admin and client panels, alongside other applications incorporating ML.",
    date: "2023-08-23"
  }
];

export const CLIENTS = [
  { name: "Mindshare", logo: "/images/mindshare.png" },
  { name: "City Group", logo: "/images/citygroup.png" },
  { name: "AD-IQ", logo: "/images/adiq.png" },
  { name: "Yunus Center", logo: "/images/yunuscenter.png" },
  { name: "YY Studio", logo: "/images/yystudio.png" },
  { name: "YY Venture", logo: "/images/yyventure.png" },
  { name: "Booring Platform", logo: "/images/booring.png" },
  { name: "Ban Base", logo: "/images/banbase.png" }
];

export const EDUCATION: TimelineItem[] = [
  {
    title: "Sir Sandford Fleming College",
    period: "2023 – 2025 | CGPA - 3.554",
    description: [
      "PGD in School of Business and IT (Wireless Information Networking)",
      {
        text: "Final Client Project",
        description: "Developed a web application for a client using Next.JS 15, TypeScript, and Tailwind CSS. A platform for managing software licenses, including features like user authentication, license store management, license management, and a dashboard for tracking license usage for 4 types of users.",
        links: [
          {
            text: "Lienzo | Web Application",
            url: "https://lienzoapp.vercel.app/"
          }
        ]
      }
    ]
  },
  {
    title: "BRAC University",
    period: "2017 – 2022  | CGPA - 3.05",
    description: [
      "Bachelor of Science in Computer Science & Engineering (CSE)",
      {
        text: "Research Thesis Paper",
        description: "Decipherable-Classification-of-Glaucoma-using-Deep-Neural-Network-Leveraging-XAI",
        links: [
          {
            text: "IEEE CSDE/i-COSTE 2022 Conference and Indexed on IEEE Xplore digital library",
            url: "https://ieeexplore.ieee.org/abstract/document/9897837"
          }
        ]
      },
      {
        text: "ML Web App",
        description: "Made a web app with Django, by exporting the ResNet50 (94.7%) .h5 model file to visualize the data and to use the app globally.",
        link: {
          text: "GitHub - Glaucoma Detection using VGG-19",
          url: "https://github.com/CHNsPart/Glaucoma-Detection-using-VGG-19"
        }
      }
    ]
  },
  {
    title: "Dhaka City College",
    period: "2014 – 2016",
    description: "Higher Secondary Certificate in Science"
  },
  {
    title: "Mohammadpur Model School & College",
    period: "2010 – 2014",
    description: "Secondary School Certificate in Science"
  }
];

export const VENTURES: TimelineItem[] = [
  {
    title: "Kolom Technologies LTD.",
    role: "Co-Founder & Head of Design & Web",
    period: "2026 FEB - Present",
    url: "https://kolom.ltd",
    description: [
      "• Oversee design and web architecture across the company's products and client engagements.",
      "• Direct UI/UX, brand system, and web infrastructure decisions to ensure consistency across every shipped surface.",
      {
        text: "• Products -",
        links: [
          { text: "Kolom.ai — AI-based byte-size news platform", url: "https://kolom.ai" }
        ]
      }
    ]
  },
  {
    title: "OonkoO",
    role: "Co-Founder & CTO",
    period: "2023 JUN - Present",
    url: "https://oonkoo.com",
    description: [
      "• Spearheaded the development of custom software solutions and scalable architecture tailored to client needs across diverse industries.",
      "• Managed the end-to-end development of mobile applications, focusing on both native and cross-platform technologies for seamless user experiences.",
      "• Led a global team of developers and designers, ensuring effective collaboration and timely delivery of high-quality IT solutions.",
      "• Oversaw UI/UX design, web development, and e-commerce solutions, focusing on creating responsive websites and intuitive user interfaces.",
      "• Delivered brand strategy, content creation, and SEO optimization services to enhance client visibility and drive business growth.",
      "• Launched OonkoO UI, a high-quality React-based UI block platform where developers can submit, buy, and sell UI blocks, powered by OonkoO's predefined UI elements and a custom CLI.",
      {
        text: "• Products -",
        links: [
          { text: "OonkoO", url: "https://oonkoo.com" },
          { text: "OonkoO UI", url: "https://ui.oonkoo.com" },
          { text: "WhoWorksWhen", url: "https://whoworkswhen.com" },
          { text: "Sopee AI", url: "https://sopee-ai.vercel.app" },
          { text: "Orbanas", url: "https://orbanas-landing.vercel.app" },
          { text: "TalkPDF", url: "https://talk-pdf-zeta.vercel.app" },
          { text: "StayScore", url: "https://stayscore.vercel.app" },
          { text: "Ontario Pulse", url: "https://ontariopulse.com" },
        ]
      },
      {
        text: "• Clients -",
        links: [
          { text: "Ageless", url: "https://ageless-jade.vercel.app/" },
          { text: "Broker Portal", url: "https://brokerstatus-client.vercel.app/" },
          { text: "Elan Platform", url: "https://elanroadtestrental.ca/" },
          { text: "Elan Blog Site", url: "https://blog.elanroadtestrental.ca/" },
          { text: "Elan Branding", url: "https://www.behance.net/gallery/221693271/Elan-Brand-Guideline" },
        ]
      }
    ]
  },
  {
    title: "Omni Attention",
    role: "Co-Founder & CTO",
    period: "2023 AUG - 2024 Dec (Discontiniued)",
    url: "https://omniattention.com",
    description: [
      "• Led the design and development of the admin panel, website, and Android app, enhancing usability and functionality for real-time ad performance and content management.",
      "• Architected the app infrastructure to ensure scalability and efficiency in managing large screen networks and AI-driven insights.",
      "• Collaborated on creating the pitch deck and delivering technical presentations to investors and stakeholders.",
      "• Managed day-to-day technical operations, led the technical team.",
      "• Supervised the UI/UX design process, delivering a modern, user-friendly interface aligned with company branding.",
      {
        text: "Client Projects -",
        links: [
          { text: "Compendium", url: "https://www.behance.net/gallery/211933801/Compendium" },
          { text: "Flyboarding PTBO", url: "https://flyboardingptbo.vercel.app" },
          { text: "Burning It Down", url: "https://burningitdown.ca" }
        ]
      },
      {
        text: "• Ventures -",
        links: [
          { text: "Omni Attention - Landing Page", url: "https://omniattention.com" },
          { text: "Omni Attention - Brand Guideline", url: "https://www.behance.net/gallery/211925249/Omni-Attention-Brand-Guideline" },
          { text: "Omni Attention - Dashboard", url: "https://www.behance.net/gallery/211927479/Omni-Attention-Dashboard" },
        ]
      }
    ]
  }
];

export const FREELANCE: TimelineItem[] = [
  {
    title: "Y Drive (Canada) UI Redesign",
    role: "UI/UX Engineer",
    period: "2025 May",
    url: "https://www.ydriveapp.com/",
    description: [
      "• Led the complete UI redesign of the Y Drive app, enhancing user experience and visual appeal.",
      "• Collaborated closely with the CEO to understand their vision and requirements, ensuring the redesign aligned with their brand identity.",
      "• Delivered 3 high-fidelity UI with prototypes using Figma for the mobile app (Funcky & Bold, Minimal & Professional, Hybrid).",
      {
        text: "• UI Versions -",
        links: [
          { text: "Y Drive UI Redesign | Funcky & Bold", url: "https://www.figma.com/proto/VI9nRhw8ozv7qBMwGaGmID/Y-Dive?t=G9subqK9diINPiCo-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&node-id=1-3&starting-point-node-id=1%3A3" },
          { text: "Y Drive UI Redesign | Minimal & Professional", url: "https://www.figma.com/proto/VI9nRhw8ozv7qBMwGaGmID/Y-Dive?node-id=41-388&p=f&t=srxTnXXQNxXFXpKV-1&scaling=scale-down&content-scaling=fixed&page-id=41%3A387&starting-point-node-id=41%3A388" },
          { text: "Y Drive UI Redesign | Hybrid", url: "https://www.figma.com/proto/VI9nRhw8ozv7qBMwGaGmID/Y-Dive?node-id=101-312&p=f&t=uu6YQ5XjHu70Moox-1&scaling=min-zoom&content-scaling=fixed&page-id=82%3A94&starting-point-node-id=101%3A312" },
        ]
      }
    ]
  },
  {
    title: "Fleming College Equipment Request System",
    role: "Team Lead & Full Stack Developer",
    period: "2024 DEC - 2025 FEB",
    url: "https://flemingcollege.ca/",
    description: [
      "• Developed a responsive portfolio website using Next.JS 13, TypeScript, and Tailwind CSS, ensuring optimal performance and user experience across devices.",
      {
        text: "• Website -",
        links: [
          { text: "Fleming College Equipment Request System", url: "https://fleming-erm.vercel.app/" },
        ]
      }
    ]
  }
];

export const PROFESSIONAL_EXPERIENCE: TimelineItem[] = [
  {
    title: "RentZoro",
    role: "Senior Software Engineer",
    period: "2026 JAN - PRESENT",
    url: "https://rentzoro.ca",
    description: [
      "• Building core platform features with Next.JS, TypeScript, and Vercel at this North York, Ontario–based tenant screening platform serving property owners and managers.",
      "• Built ZoroSign, an in-house e-signature system, and the proprietary zoroScore algorithm with Plaid API integration for financial risk scoring.",
      "• Shipped Express Screen for instant tenant verification across income, credit, identity, and background checks — serving thousands of Canadian landlords."
    ]
  },
  {
    title: "City Group",
    role: "ML & Software Engineer",
    period: "2022 JUN - 2023 AUG",
    url: "https://www.citygroup.com.bd",
    description: [
      "• Developed an Android app with React Native with a custom playlist API built on Mongo DB and a server with Node.JS. The API sends different states for the online and offline versions.",
      "• Built a quick solution in a project of FMCG Retail Store Screen AD, Rooted android TV, and auto launched the app for ready product solution with 3rd party monitoring system.",
      "• Built an API with Python (Flask) to collect ML model data.",
      {
        text: "• Radiology chest diseases Detection and DICOM file viewer for Asgar Ali hospital ",
        links: [
          { text: "medicalprone.com (UI + Frontend)", url: "https://medicalprone.com" },
          { text: "DICOM Viewer (with JS on an open-source lib)", url: "https://github.com/CHNsPart/dicom-viewer-dwv" }
        ]
      },
      "• Working on the front-end in production with TypeScript (Next.JS 12 & 13 --experimental) with → pixel perfect custom Server side and Client side TSX components, API Integration, Custom Loader, multi step form with business logics, framer motion animation and etc.",
      "• Working on the backend with Node.JS (Nest.JS) → User Auth with validation pipes and JWT, CRUD API, Custom repository with business logics, Postgres with TypeORM with DTOs, Custom Query Logics.",
      {
        text: "• Live project -",
        link: [
          { text: "mission-control.ad-iq.com", url: "https://mission-control.ad-iq.com" },
          { text: "dashboard.ad-iq.com", url: "https://dashboard.ad-iq.com" },
        ],
        credentials: {
          username: "locked for security",
          password: "*******"
        }
      }
    ]
  },
  {
    title: "YY Ventures",
    role: "UI/UX Designer",
    period: "2021 JUL - 2021 Dec",
    url: "https://yy.ventures",
    description: [
      "• Built Client-based UI design with Figma",
      "• Built brand-guideline of multiple startups.",
      "• Created posters and motion graphics with Adobe Studio.",
      {
        text: "• UI demo -",
        links: [
          { text: "Yunus-Center-UI", url: "https://drive.google.com/drive/folders/1nW4pmkavGpOJFxqRIydCaVbyPQQJXKXP" },
          { text: "Elegant & Homes", url: "https://drive.google.com/drive/folders/1wttAiZFQO36Pi7eF0eVuZht007bXfH-w" },
          { text: "3Zero-Club-System", url: "https://drive.google.com/drive/folders/1YGeQgDjcey9UfWKgDv5gpknXkEeP2EQK" },
          { text: "Impact-Hub-Dhaka", url: "https://dhaka.impacthub.net/" }
        ]
      }
    ]
  },
  {
    title: "Ban Base",
    role: "UI/UX & Software Engineer",
    period: "2021 JUL - 2022 MAY",
    url: "https://www.banbase.nl/",
    description: [
      "• Built Client-based UI and Frontend Development with React.JS, Material UI and axios.",
      "• Built Backend with Express.JS for REST API with CRUD operation.",
      "• Created the whole UI with UX interactive prototype with Adobe XD.",
      "• 3D elements for custom react components with Blender and Spline.",
      {
        text: "• UI demo -",
        links: [
          { text: "Ban-Base Static Site", url: "https://drive.google.com/drive/folders/1l9Iq1pV5qs84T9MVgaC_IZQNCAsN-eOM" },
          { text: "SDI-HR-Automation", url: "https://drive.google.com/drive/folders/1qo5axtFSFYX0ABVhBmFhtakBijt8qEdD" },
          { text: "Elegant & Homes", url: "https://drive.google.com/drive/folders/1wttAiZFQO36Pi7eF0eVuZht007bXfH-w" },
        ]
      }
    ]
  },
  {
    title: "The Boring Platform (AD-IQ)",
    role: "UI/UX Designer & Software Engineer",
    period: "2021 JAN - 2021 JUL",
    url: "https://ad-iq.com/",
    description: [
      "• Built in-house cash-cow software Frontend Development with React.JS, Material UI and fetch with a team of two member (I and my Lead developer).",
      "• Created the whole UI with UX with Adobe XD",
      {
        text: "• UI demo -",
        links: [
          { text: "AD-IQ Project", url: "https://www.behance.net/gallery/123426619/AD-IQ-Listing-Website" },
          { text: "Mind Share - Bill-Board Project", url: "https://www.behance.net/gallery/122890405/MindShare-Billboard-System-UIUX" },
          { text: "DDAD-System", url: "https://drive.google.com/drive/folders/1XkFbV0nIHWEE5uIFVB5annt0IWvLRIq5" }
        ]
      }
    ]
  }
];

export const PORTFOLIO_ITEMS = [
  {
    title: "Taqneo",
    category: "Web development",
    image: "/images/taqneo.png",
    link: "https://taqneo.com/"
  },
  {
    title: "OonkoO 2025",
    category: "Web development",
    image: "/images/oonkoo-neo.png",
    link: "https://oonkoo-d6g9vgvcn-touhidul-islam-chayans-projects.vercel.app/"
  },
  {
    title: "Sopee.ai",
    category: "Web development",
    image: "/images/sopee.png",
    link: "https://sopee-ai.vercel.app"
  },
  {
    title: "CHNsUI Library",
    category: "Open source",
    image: "/images/project-chnsui.png",
    link: "https://chnsui.com"
  },
  {
    title: "Neo ID",
    category: "Web development",
    image: "/images/neo-id.png",
    link: "https://www.neo-id.com"
  },
  {
    title: "OonkoO UI",
    category: "Web development",
    image: "/images/oonkoo-ui.png",
    link: "https://ui.oonkoo.com"
  },
  {
    title: "Ranin International",
    category: "Web development",
    image: "/images/ranin.png",
    link: "https://ranininternational.com/"
  },
  {
    title: "Orbanas IT Agency",
    category: "Web development",
    image: "/images/orbanas.png",
    link: "https://orbanas-landing.vercel.app"
  },
  {
    title: "Elan Branding",
    category: "Web design",
    image: "/images/elan-branding.png",
    link: "https://www.behance.net/gallery/221693271/Elan-Brand-Guideline"
  },
  {
    title: "Kolom AI",
    category: "Web development",
    image: "/images/kolom.png",
    link: "https://kolom.ai"
  },
  {
    title: "Elan Blog Site",
    category: "Web development",
    image: "/images/elan-blog.png",
    link: "https://blog.elanroadtestrental.ca/"
  },
  {
    title: "Elan Client Site",
    category: "Web development",
    image: "/images/elan-client.png",
    link: "https://elanroadtestrental.ca/"
  },
  {
    title: "Lienzo",
    category: "Web development",
    image: "/images/lienzo.png",
    link: "https://lienzoapp.vercel.app/"
  },
  {
    title: "OonkoO V3 Landing Page",
    category: "Web development",
    image: "/images/oonkoo-current.png",
    link: "https://oonkoo-v3.vercel.app/"
  },
  {
    title: "Papia - Portfolio",
    category: "Web development",
    image: "/images/papia.png",
    link: "https://papia-portfolio.vercel.app"
  },
  {
    title: "WhoWorksWhen",
    category: "Web development",
    image: "/images/www.png",
    link: "https://whoworkswhen.com"
  },
  {
    title: "StayScore",
    category: "Web development",
    image: "/images/stayscore.png",
    link: "https://stayscore.vercel.app/"
  },
  {
    title: "Ontario Pulse",
    category: "Web development",
    image: "/images/ontariopulse.png",
    link: "https://ontariopulse.com"
  },
  {
    title: "Fleming College Equipment Request",
    category: "Web development",
    image: "/images/fleming-ers.png",
    link: "https://fleming-erm.vercel.app"
  },
  {
    title: "Anita - Portfolio",
    category: "Web development",
    image: "/images/anitaislam.png",
    link: "https://anita-portfolio-mu.vercel.app"
  },
  {
    title: "Compendium",
    category: "Web design",
    image: "/images/compendium-cc.png",
    link: "https://www.behance.net/gallery/211933801/Compendium"
  },
  {
    title: "Omni Attention Landing",
    category: "Web development",
    image: "/images/omni-landing.png",
    link: "https://omniattention.com"
  },
  {
    title: "Omni Attention Dashboard",
    category: "Web design",
    image: "/images/omni-dash.png",
    link: "https://www.behance.net/gallery/211927479/Omni-Attention-Dashboard"
  },
  {
    title: "Omni Attention Branding",
    category: "Web design",
    image: "/images/omni-bg.png",
    link: "https://www.behance.net/gallery/211925249/Omni-Attention-Brand-Guideline"
  },
  {
    title: "Admin Panel",
    category: "Web development",
    image: "/images/project-11.png",
    link: "https://www.behance.net/gallery/180955839/Admin-Panel-Dashboard"
  },
  {
    title: "Fly-Boarding Peterborough",
    category: "Web development",
    image: "/images/flyptbo.png",
    link: "https://flyboardingptbo.vercel.app"
  },
  {
    title: "Secure-Nest Security",
    category: "Web development",
    image: "/images/secure_nest.png",
    link: "https://secure-nest.vercel.app"
  },
  {
    title: "ML Application",
    category: "Web development",
    image: "/images/project-1.png",
    link: "https://medical-prone.vercel.app"
  },
  {
    title: "GTA-Group E-Commerce",
    category: "Web development",
    image: "/images/GTAGroup.png",
    link: "https://gta-group.pages.dev"
  },
  {
    title: "Broker-Status Portal",
    category: "Web development",
    image: "/images/brokerstatus.png",
    link: "https://brokerstatus-client.vercel.app"
  },
  {
    title: "Ageless",
    category: "Web development",
    image: "/images/ageless.png",
    link: "https://ageless-jade.vercel.app/"
  },
  {
    title: "Mindshare Dashboard",
    category: "Web development",
    image: "/images/project-2.png",
    link: "https://www.behance.net/gallery/122890405/MindShare-Billboard-System-UIUX"
  },
  {
    title: "E-commerce",
    category: "Web design",
    image: "/images/Project-3.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVfmVHVUlLbnR1alBqeWhHMW5CVE5SQ04taVpPaVdTS05hTEYwb3dHWDBoTTQ?resourcekey=0-f1QTm3ueCfblMdoAc8Axng&usp=sharing"
  },
  {
    title: "SDI HR Automation",
    category: "Applications",
    image: "/images/project-4.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVfnVlTXkwYlIyQTFwZkNnNHBtaGdhVFVDZzlXR082OGZOejJFSXAtXzlCdEU?resourcekey=0-lY7o6RqUGyDQF0F0s0ihkg&usp=sharing"
  },
  {
    title: "Banbase",
    category: "Web design",
    image: "/images/project-5.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVfnlCd1dhSV9sUC1CUUVkQWc2VEhPXzJNOTNBZUFSV3BISDFLUWRHXzd3b1U?resourcekey=0-IhgFlCt2SoRt4xF4gqdeAA&usp=sharing"
  },
  {
    title: "AD-IQ Listing",
    category: "Web design",
    image: "/images/project-6.png",
    link: "https://www.behance.net/gallery/123426619/AD-IQ-Listing-Website"
  },
  {
    title: "AD-IQ Primitive",
    category: "Web design",
    image: "/images/ADIQ-Primitive.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVfnE4bVcyVzVWdUdMVmhpVjhKNnJCa2RfRXpDOEJFY0JuV1BRaUpBT05nc0E?resourcekey=0-weNzOxZW3HN06OisWdoWXw&usp=sharing"
  },
  {
    title: "AD-IQ System",
    category: "Web development",
    image: "/images/project-7.png",
    link: "https://www.behance.net/gallery/125571951/Dashboard-UI-of-DD-AD"
  },
  {
    title: "AD-IQ App",
    category: "Applications",
    image: "/images/project-8.jpg",
    link: "https://www.behance.net/gallery/125571951/Dashboard-UI-of-DD-AD"
  },
  {
    title: "OonkoO V1",
    category: "Web development",
    image: "/images/project-oonkoo.png",
    link: "https://oonkoo-landing-v1.pages.dev/"
  },
  {
    title: "OonkoO preview",
    category: "Web development",
    image: "/images/oonkoo-preview.png",
    link: "https://oonkoo-cs.pages.dev/"
  },
  {
    title: "3 Zero Club",
    category: "Web design",
    image: "/images/3zeroclub.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVfnpsV2NDcWMzNlpvemc4WU9BTS1ZN1VuVWh0TzFUWlB5alEwc2pWdXA3WVE?resourcekey=0-BrE7FHZnw8i-RInbhWq9Ig&usp=sharing"
  },
  {
    title: "YY Studio",
    category: "Web design",
    image: "/images/Project-9.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVfkFYYTJvTktZT2pTUXl0SEFmdmpwbDFwUzdQNTFRZXA3bWVjbFloaG91Y0U?resourcekey=0-qtlk0G9Bx8zAyOkvdP8zlQ&usp=sharing"
  },
  {
    title: "Yunus Centre",
    category: "Web design",
    image: "/images/project-10.png",
    link: "https://drive.google.com/drive/folders/0B9wf2qK3ELWVflZBZFc1RE5NZVVZckRvdk80WUlrYjYtSUNEenpYbzVOMnFIRmYtdDNocUE?resourcekey=0-wKQNgEfXgFjE6XoO0SSGvg&usp=sharing"
  }
];

export const TECH_STACK: TimelineItem[] = [
  {
    title: "Front-end",
    period: "7+ years",
    description: [
      "• TypeScript/Javascript (React.JS, Next.JS)",
      "• CSS (TailwindCSS)",
      "• ShadCN UI, Material UI, Daisy UI",
      "• Framer Motion, Three.JS",
    ]
  },
  {
    title: "Back-end",
    period: "6+ years",
    description: [
      "• Node.JS, Express.JS, Nest.JS",
      "• Python (Flask)",
      "• Database (Postgres, SQL, MongoDB) with TypeORM"
    ]
  },
  {
    title: "Web Design",
    period: "7+ years",
    description: [
      "• Figma",
      "• Adobe XD",
      "• Protopie"
    ]
  },
  {
    title: "Artificial Intelligence",
    period: " ",
    description: [
      "• Deep Learning Models",
      "• Computer Vision (CNN, FCDNN)",
      "• TensorFlow",
      "• XAI Framworks (Lime, Shap)"
    ]
  }
];

export const SKILLS = [
  { name: "UI/UX design", percentage: 90 },
  { name: "Frontend Development", percentage: 90 },
  { name: "Backend Development", percentage: 80 },
  { name: "Machine Learning", percentage: 60 }
];

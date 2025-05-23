// Translation system for Arabic/English support
export interface Translations {
  // Navigation
  nav: {
    home: string
    portfolio: string
    services: string
    journal: string
    contact: string
    menu: string
  }
  // Home section
  home: {
    title: string
    subtitle: string
    description: string
    exploreWork: string
    getInTouch: string
  }
  // Portfolio section
  portfolio: {
    title: string
    allWorks: string
    categories: {
      sculpting: string
      animation: string
      games: string
      programming: string
    }
    viewProject: string
    liveDemo: string
  }
  // Services section
  services: {
    title: string
    subtitle: string
    webDev: {
      title: string
      items: string[]
    }
    animation: {
      title: string
      items: string[]
    }
    gameDev: {
      title: string
      items: string[]
    }
  }
  // Journal section
  journal: {
    title: string
    subtitle: string
    readMore: string
    noEntries: string
    tags: {
      webgl: string
      threeDee: string
      typography: string
      culture: string
      aesthetics: string
      trends: string
    }
  }
  // Contact section
  contact: {
    title: string
    subtitle: string
    email: string
    social: string
    sendMessage: string
    form: {
      name: string
      email: string
      subject: string
      message: string
      namePlaceholder: string
      emailPlaceholder: string
      subjectPlaceholder: string
      messagePlaceholder: string
      send: string
    }
    footer: {
      copyright: string
      terms: string
      privacy: string
      cookies: string
    }
  }
  // Common
  common: {
    loading: string
    error: string
    backToTop: string
  }
}

export const translations: Record<'en' | 'ar', Translations> = {
  en: {
    nav: {
      home: 'Home',
      portfolio: 'Portfolio',
      services: 'Services', 
      journal: 'Journal',
      contact: 'Contact',
      menu: 'Menu'
    },
    home: {
      title: 'Creative Digital Experiences',
      subtitle: 'AETHELFRAME',
      description: 'An independent creative studio specializing in high-end digital design, art direction, and full-stack development for visionary brands and individuals.',
      exploreWork: 'Explore Work',
      getInTouch: 'Get in Touch'
    },
    portfolio: {
      title: 'Selected Works',
      allWorks: 'All Works',
      categories: {
        sculpting: '3D Sculpting',
        animation: 'Animation',
        games: 'Video Games',
        programming: 'Programming'
      },
      viewProject: 'View Project',
      liveDemo: 'Live Demo'
    },
    services: {
      title: 'Services',
      subtitle: 'Specialized creative solutions tailored to your unique vision and requirements',
      webDev: {
        title: 'Web Development',
        items: [
          'Custom website design',
          'Full-stack development', 
          'Interactive experiences'
        ]
      },
      animation: {
        title: '3D & Animation',
        items: [
          '3D modeling & sculpting',
          'Character design',
          'Motion graphics'
        ]
      },
      gameDev: {
        title: 'Game Development',
        items: [
          'Interactive 3D games',
          'VR/AR experiences',
          'Game asset creation'
        ]
      }
    },
    journal: {
      title: 'Latest Articles',
      subtitle: 'Insights and explorations from the intersection of art, design, and technology',
      readMore: 'Read More',
      noEntries: 'No articles available yet.',
      tags: {
        webgl: 'WebGL',
        threeDee: '3D',
        typography: 'Typography',
        culture: 'Culture',
        aesthetics: 'Aesthetics',
        trends: 'Trends'
      }
    },
    contact: {
      title: "Let's Create Together",
      subtitle: "Ready to bring your vision to life? Reach out and let's discuss how we can collaborate on your next project.",
      email: 'Email',
      social: 'Social',
      sendMessage: 'Send a Message',
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'Your email',
        subjectPlaceholder: "What's this about?",
        messagePlaceholder: 'Tell me about your project...',
        send: 'Send Message'
      },
      footer: {
        copyright: '© 2025 AETHELFRAME. All rights reserved.',
        terms: 'Terms',
        privacy: 'Privacy',
        cookies: 'Cookies'
      }
    },
    common: {
      loading: 'Loading...',
      error: 'Error occurred',
      backToTop: 'Back to top'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      portfolio: 'الأعمال',
      services: 'الخدمات',
      journal: 'المدونة',
      contact: 'تواصل',
      menu: 'القائمة'
    },
    home: {
      title: 'تجارب رقمية إبداعية',
      subtitle: 'إيثل فريم',
      description: 'استوديو إبداعي مستقل متخصص في التصميم الرقمي الراقي والإخراج الفني والتطوير الشامل للعلامات التجارية والأفراد أصحاب الرؤى.',
      exploreWork: 'استكشف الأعمال',
      getInTouch: 'تواصل معنا'
    },
    portfolio: {
      title: 'أعمال مختارة',
      allWorks: 'جميع الأعمال',
      categories: {
        sculpting: 'النحت ثلاثي الأبعاد',
        animation: 'الرسوم المتحركة',
        games: 'ألعاب الفيديو',
        programming: 'البرمجة'
      },
      viewProject: 'عرض المشروع',
      liveDemo: 'معاينة مباشرة'
    },
    services: {
      title: 'الخدمات',
      subtitle: 'حلول إبداعية متخصصة مصممة خصيصاً لرؤيتك ومتطلباتك الفريدة',
      webDev: {
        title: 'تطوير المواقع',
        items: [
          'تصميم مواقع مخصصة',
          'التطوير الشامل',
          'التجارب التفاعلية'
        ]
      },
      animation: {
        title: 'الثلاثي الأبعاد والرسوم المتحركة',
        items: [
          'النمذجة والنحت ثلاثي الأبعاد',
          'تصميم الشخصيات',
          'الرسوم المتحركة'
        ]
      },
      gameDev: {
        title: 'تطوير الألعاب',
        items: [
          'الألعاب التفاعلية ثلاثية الأبعاد',
          'تجارب الواقع الافتراضي والمعزز',
          'إنشاء عناصر الألعاب'
        ]
      }
    },
    journal: {
      title: 'أحدث المقالات',
      subtitle: 'رؤى واستكشافات من تقاطع الفن والتصميم والتكنولوجيا',
      readMore: 'اقرأ المزيد',
      noEntries: 'لا توجد مقالات متاحة بعد.',
      tags: {
        webgl: 'WebGL',
        threeDee: 'ثلاثي الأبعاد',
        typography: 'الطباعة',
        culture: 'الثقافة',
        aesthetics: 'الجماليات',
        trends: 'الاتجاهات'
      }
    },
    contact: {
      title: 'لنبدع معاً',
      subtitle: 'مستعد لتحويل رؤيتك إلى واقع؟ تواصل معنا ولنناقش كيف يمكننا التعاون في مشروعك القادم.',
      email: 'البريد الإلكتروني',
      social: 'وسائل التواصل',
      sendMessage: 'إرسال رسالة',
      form: {
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        subject: 'الموضوع',
        message: 'الرسالة',
        namePlaceholder: 'اسمك',
        emailPlaceholder: 'بريدك الإلكتروني',
        subjectPlaceholder: 'ما هو موضوع الرسالة؟',
        messagePlaceholder: 'أخبرني عن مشروعك...',
        send: 'إرسال الرسالة'
      },
      footer: {
        copyright: '© 2025 إيثل فريم. جميع الحقوق محفوظة.',
        terms: 'الشروط',
        privacy: 'الخصوصية',
        cookies: 'ملفات تعريف الارتباط'
      }
    },
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      backToTop: 'العودة للأعلى'
    }
  }
}

// Hook to use translations
export const useTranslations = (language: 'en' | 'ar') => {
  return translations[language]
}
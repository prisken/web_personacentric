import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'zh-TW';
  });

  const translations = {
    'zh-TW': {
      // Navigation
      'nav.home': '首頁',
      'nav.events': '活動',
      'nav.agentPairing': '配對顧問',
      'nav.contentGenerator': '內容生成',
      'nav.blogs': '部落格',
      'nav.contests': '競賽',
      'nav.login': '登入',
      'nav.register': '註冊',
      'nav.about': '關於我們',
      'nav.pricing': '價格方案',
      'nav.aiTrial': 'AI 試用',

      // Hero Section
      'hero.title': '找到最適合您的財務顧問',
      'hero.subtitle': '透過 AI 配對技術，為您找到最適合的專業顧問，讓您的投資翻倍成長',
      'hero.eventCTA': '立即報名',
      'hero.pairingCTA': '立即配對',
      'hero.aiCTA': '2分鐘生成貼文',

      // Small CTA
      'smallCTA.title': '找到對的顧問，讓您的投資翻倍！',
      'smallCTA.button': '開始配對',

      // Proof of Concept
      'stats.agents': '位顧問',
      'stats.clients': '位成功客戶',
      'stats.growth': '投資成長率',

      // AI Content Creation
      'ai.title': 'AI 生成內容讓您的生活更輕鬆',
      'ai.industrySelector': '選擇您的生活風格',
      'ai.tryButton': '試用 AI 內容生成器',
      'ai.contestWinner': '上月競賽得主',
      'ai.viewAllWinners': '查看所有得主',

      // Client Testimonials
      'testimonials.title': '客戶怎麼說',
      'testimonials.client1': '「服務太棒了！我的投資在半年內翻倍。」',
      'testimonials.client1Name': '王小明',
      'testimonials.client1Title': '企業主',
      'testimonials.client2': '「專業的顧問配對，讓我找到最適合的投資策略。」',
      'testimonials.client2Name': '李小華',
      'testimonials.client2Title': '上班族',
      'testimonials.client3': '「AI 內容生成器幫我節省大量時間。」',
      'testimonials.client3Name': '張小美',
      'testimonials.client3Title': '自由工作者',

      // Events
      'events.title': '最新活動',
      'events.registerNow': '立即報名',
      'events.revisit': '重新瀏覽',
      'events.viewAll': '查看所有活動',
      'events.upcoming': '即將舉行',
      'events.past': '已結束',
      'events.featured': '精選活動',
      'events.categories': '活動分類',
      'events.search': '搜尋活動',
      'events.filter': '篩選',
      'events.sort': '排序',
      'events.date': '日期',
      'events.location': '地點',
      'events.category': '分類',
      'events.financial': '財務規劃',
      'events.investment': '投資策略',
      'events.retirement': '退休規劃',
      'events.insurance': '保險規劃',

      // Partnering Organizations
      'partners.title': '合作夥伴',

      // Blogs
      'blogs.title': '最新部落格',
      'blogs.readMore': '閱讀更多',
      'blogs.viewAll': '查看所有文章',
      'blogs.featured': '精選文章',
      'blogs.categories': '文章分類',
      'blogs.search': '搜尋文章',
      'blogs.author': '作者',
      'blogs.date': '發布日期',
      'blogs.category': '分類',
      'blogs.tags': '標籤',
      'blogs.share': '分享',
      'blogs.comments': '評論',

      // Contact
      'contact.title': '聯絡我們',
      'contact.name': '姓名',
      'contact.phone': '電話',
      'contact.email': '電子郵件',
      'contact.message': '訊息',
      'contact.send': '發送訊息',
      'contact.subtitle': '有任何問題或需要支援，請隨時聯絡我們',
      'contact.address': '地址',
      'contact.workingHours': '營業時間',

      // Footer
      'footer.company': '公司資訊',
      'footer.quickLinks': '快速連結',
      'footer.support': '支援',
      'footer.social': '社群媒體',
      'footer.about': '關於我們',
      'footer.privacy': '隱私政策',
      'footer.terms': '使用條款',

      // Contest Page
      'contest.title': '內容競賽',
      'contest.current': '當前競賽',
      'contest.pastWinners': '歷屆得主',
      'contest.rules': '競賽規則',
      'contest.prizes': '獎品資訊',
      'contest.howToParticipate': '如何參與',
      'contest.memberBenefits': '會員專屬',
      'contest.joinMember': '加入會員參與競賽',
      'contest.exclusiveAccess': '專屬競賽權限',
      'contest.winPoints': '贏得點數與認可',
      'contest.alreadyMember': '已是會員？登入參與',
      'contest.becomeMember': '成為會員參與競賽',
      'contest.startCreating': '開始創作精彩內容',
      'contest.winPrizes': '贏得獎品並建立作品集',
      'contest.submit': '提交作品',
      'contest.deadline': '截止日期',
      'contest.participants': '參與者',
      'contest.vote': '投票',

      // About Page
      'about.title': '關於我們',
      'about.story': '公司故事',
      'about.mission': '使命與願景',
      'about.team': '團隊成員',
      'about.values': '公司價值',
      'about.subtitle': '我們致力於為客戶提供最優質的財務服務',
      'about.storyTitle': '我們的故事',
      'about.storyContent': 'Persona Centric 成立於2024年，致力於透過AI技術革新財務顧問服務。我們相信每個人都應該獲得專業的財務指導。',
      'about.missionTitle': '使命與願景',
      'about.missionContent': '我們的使命是讓專業的財務顧問服務變得更加普及和便捷。透過AI技術，我們為客戶和顧問建立最佳的配對。',
      'about.teamTitle': '我們的團隊',
      'about.teamContent': '我們擁有一支經驗豐富的專業團隊，包括財務專家、技術工程師和客戶服務專員。',
      'about.valuesTitle': '核心價值',
      'about.valuesContent': '誠信、專業、創新和客戶至上，這些是我們的核心價值觀。',

      // Pricing Page
      'pricing.title': '價格方案',
      'pricing.subtitle': '選擇最適合您的方案',
      'pricing.free': '免費',
      'pricing.paid': '付費',
      'pricing.monthly': '月付',
      'pricing.yearly': '年付',
      'pricing.getStarted': '開始使用',
      'pricing.contactSales': '聯絡銷售',
      'pricing.mostPopular': '最受歡迎',
      'pricing.pointsReward': '每次付款獲得500積分',
      'pricing.paymentMethods': '支付方式',
      'pricing.creditCards': '信用卡/借記卡',
      'pricing.digitalWallets': '數字錢包',
      'pricing.bankTransfer': '銀行轉帳',
      'pricing.faq': '常見問題',
      'pricing.changePlan': '我可以隨時更改計劃嗎？',
      'pricing.changePlanAnswer': '是的，您可以隨時升級或降級您的計劃。變更將在您的下一個計費週期生效。',
      'pricing.paymentFail': '付款失敗會發生什麼？',
      'pricing.paymentFailAnswer': '我們提供3個月的寬限期。如果連續3個月付款失敗，您的帳戶將被暫停。',
      'pricing.unlimitedAccess': '如何獲得無限訪問權限？',
      'pricing.unlimitedAccessAnswer': '您可以請求管理員授予無限訪問權限，或使用6位數訪問代碼立即激活。',
      'pricing.pointsWork': '積分獎勵如何運作？',
      'pricing.pointsWorkAnswer': '每次成功的HKD$10付款都會獲得500積分。管理員授予的訪問權限不提供積分。',
      'pricing.enterprise': '需要自定義解決方案？',
      'pricing.enterpriseSubtitle': '我們為大型組織提供企業計劃，具有自定義功能和專用支持。',
      'pricing.contactSales': '聯絡銷售',

      // AI Trial Page
      'aiTrial.title': 'AI 內容生成器試用',
      'aiTrial.subtitle': '體驗 AI 如何改變您的內容創作',
      'aiTrial.industry': '選擇產業',
      'aiTrial.generate': '生成內容',
      'aiTrial.tryNow': '立即試用',
      'aiTrial.selectIndustry': '選擇您的產業',
      'aiTrial.financial': '金融服務',
      'aiTrial.insurance': '保險',
      'aiTrial.investment': '投資',
      'aiTrial.retirement': '退休規劃',
      'aiTrial.realEstate': '房地產',
      'aiTrial.contentType': '內容類型',
      'aiTrial.socialMedia': '社群媒體貼文',
      'aiTrial.blog': '部落格文章',
      'aiTrial.email': '電子郵件',
      'aiTrial.presentation': '簡報',
      'aiTrial.keywords': '關鍵詞',
      'aiTrial.generateButton': '生成內容',
      'aiTrial.result': '生成結果',
      'aiTrial.copy': '複製',
      'aiTrial.download': '下載',
      'aiTrial.share': '分享',

      // Agent Matching Page
      'matching.title': '顧問配對測驗',
      'matching.subtitle': '找到最適合您的財務顧問',
      'matching.start': '開始測驗',
      'matching.next': '下一題',
      'matching.previous': '上一題',
      'matching.finish': '完成測驗',
      'matching.question': '問題',
      'matching.progress': '進度',
      'matching.results': '測驗結果',
      'matching.recommendations': '推薦顧問',
      'matching.contact': '聯絡顧問',
      'matching.retake': '重新測驗',

      // Login Page
      'login.title': '登入',
      'login.email': '電子郵件',
      'login.password': '密碼',
      'login.rememberMe': '記住我',
      'login.forgotPassword': '忘記密碼？',
      'login.noAccount': '還沒有帳號？',
      'login.register': '立即註冊',
      'login.submit': '登入',
      'login.or': '或',
      'login.google': '使用 Google 登入',
      'login.facebook': '使用 Facebook 登入',

      // Register Page
      'register.title': '註冊',
      'register.firstName': '名字',
      'register.lastName': '姓氏',
      'register.email': '電子郵件',
      'register.password': '密碼',
      'register.confirmPassword': '確認密碼',
      'register.role': '角色',
      'register.client': '客戶',
      'register.agent': '顧問',
      'register.terms': '我同意使用條款',
      'register.haveAccount': '已有帳號？',
      'register.login': '立即登入',
      'register.submit': '註冊',
      'register.or': '或',
      'register.google': '使用 Google 註冊',
      'register.facebook': '使用 Facebook 註冊',

      // Help Center
      'help.title': '幫助中心',
      'help.subtitle': '我們隨時為您提供支持',
      'help.faq': '常見問題',
      'help.contact': '聯繫支持',
      'help.legal': '法律條款',
      'help.getStarted': '如何開始使用 Persona Centric 平台？',
      'help.getStartedAnswer': '註冊帳戶後，您可以瀏覽我們的服務，包括 AI 內容生成、代理匹配和活動參與。我們建議先完成個人資料設置以獲得最佳體驗。',
      'help.aiContent': 'AI 內容生成器如何運作？',
      'help.aiContentAnswer': '我們的 AI 工具會分析您的行業和需求，生成專業的金融內容。只需選擇您的行業，輸入關鍵詞，AI 就會創建適合的內容。',
      'help.agentCost': '代理匹配服務的費用是多少？',
      'help.agentCostAnswer': '我們提供多種會員計劃，從基本到高級。請查看定價頁面了解詳細的費用結構和功能比較。',
      'help.contests': '如何參加競賽？',
      'help.contestsAnswer': '註冊後，您可以在競賽頁面查看當前和即將舉行的競賽。提交您的作品並有機會贏得獎勵。',
      'help.security': '平台是否安全可靠？',
      'help.securityAnswer': '我們採用最先進的安全措施保護您的數據。所有交易都經過加密，我們嚴格遵守隱私政策和使用條款。',
      'help.support': '如何聯繫客戶支持？',
      'help.supportAnswer': '您可以通過多種方式聯繫我們：電子郵件、電話或使用此頁面的聯繫表單。我們的團隊會在24小時內回覆。',
      'help.contactChannels': '聯繫方式',
      'help.emailSupport': '電子郵件支持',
      'help.phoneSupport': '電話支持',
      'help.liveChat': '即時聊天',
      'help.responseTime': '24小時內回覆',
      'help.workingHours': '週一至週五 9AM-6PM',
      'help.instantResponse': '即時回應',
      'help.sendMessage': '發送消息',
      'help.selectIssue': '選擇問題類型',
      'help.technical': '技術問題',
      'help.account': '帳戶問題',
      'help.payment': '付款問題',
      'help.general': '一般查詢',
      'help.describeIssue': '請描述您的問題...',
      'help.activate': '激活',
      'help.cancel': '取消',
      'help.enterCode': '輸入訪問代碼',
      'help.codeDescription': '請輸入6位數訪問代碼以獲得無限代理訪問權限',
      'help.enterCodePlaceholder': '輸入6位數代碼',

      // Lifestyle Options
      'lifestyle.active': '活躍型',
      'lifestyle.family': '家庭導向',
      'lifestyle.traveler': '旅遊愛好者',
      'lifestyle.foodie': '美食家',
      'lifestyle.creative': '創意型',
      'lifestyle.tech': '科技迷',
      'lifestyle.wellness': '健康生活',
      'lifestyle.finance': '理財達人',
      'lifestyle.student': '學生族',
      'lifestyle.retiree': '退休族',
    },
    'en': {
      // Navigation
      'nav.home': 'Home',
      'nav.events': 'Events',
      'nav.agentPairing': 'Agent Pairing',
      'nav.contentGenerator': 'Content Generator',
      'nav.blogs': 'Blogs',
      'nav.contests': 'Contests',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.about': 'About',
      'nav.pricing': 'Pricing',
      'nav.aiTrial': 'AI Trial',

      // Hero Section
      'hero.title': 'Find Your Perfect Financial Advisor',
      'hero.subtitle': 'Match with the right professional advisor through AI technology and double your investment growth',
      'hero.eventCTA': 'Register Now',
      'hero.pairingCTA': 'Pair Now',
      'hero.aiCTA': 'Create Post in 2 mins',

      // Small CTA
      'smallCTA.title': 'Get the right agent and double your investment!',
      'smallCTA.button': 'Get Started',

      // Proof of Concept
      'stats.agents': 'Agents',
      'stats.clients': 'Successful Clients',
      'stats.growth': 'Investment Growth',

      // AI Content Creation
      'ai.title': 'AI Generated Content Makes Your Life So Much Easier',
      'ai.industrySelector': 'Select Your Lifestyle',
      'ai.tryButton': 'Try AI Content Generator',
      'ai.contestWinner': 'Last Month Contest Winner',
      'ai.viewAllWinners': 'View All Winners',

      // Client Testimonials
      'testimonials.title': 'What Our Clients Say',
      'testimonials.client1': '"Amazing service! My investment doubled in 6 months."',
      'testimonials.client1Name': 'John Doe',
      'testimonials.client1Title': 'Entrepreneur',
      'testimonials.client2': '"Professional advisor matching helped me find the perfect investment strategy."',
      'testimonials.client2Name': 'Jane Smith',
      'testimonials.client2Title': 'Employee',
      'testimonials.client3': '"AI content generator saved me so much time."',
      'testimonials.client3Name': 'Mike Lee',
      'testimonials.client3Title': 'Freelancer',

      // Events
      'events.title': 'Latest Events',
      'events.registerNow': 'Register Now',
      'events.revisit': 'Revisit',
      'events.viewAll': 'View All Events',
      'events.upcoming': 'Upcoming',
      'events.past': 'Past',
      'events.featured': 'Featured Events',
      'events.categories': 'Event Categories',
      'events.search': 'Search Events',
      'events.filter': 'Filter',
      'events.sort': 'Sort',
      'events.date': 'Date',
      'events.location': 'Location',
      'events.category': 'Category',
      'events.financial': 'Financial Planning',
      'events.investment': 'Investment Strategy',
      'events.retirement': 'Retirement Planning',
      'events.insurance': 'Insurance Planning',

      // Partnering Organizations
      'partners.title': 'Partnering Organizations',

      // Blogs
      'blogs.title': 'Latest Blogs',
      'blogs.readMore': 'Read More',
      'blogs.viewAll': 'View All Blogs',
      'blogs.featured': 'Featured Posts',
      'blogs.categories': 'Blog Categories',
      'blogs.search': 'Search Blogs',
      'blogs.author': 'Author',
      'blogs.date': 'Published Date',
      'blogs.category': 'Category',
      'blogs.tags': 'Tags',
      'blogs.share': 'Share',
      'blogs.comments': 'Comments',

      // Contact
      'contact.title': 'Contact Us',
      'contact.name': 'Name',
      'contact.phone': 'Phone',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.send': 'Send Message',
      'contact.subtitle': 'Get in touch with us for any questions or support',
      'contact.address': 'Address',
      'contact.workingHours': 'Working Hours',

      // Footer
      'footer.company': 'Company',
      'footer.quickLinks': 'Quick Links',
      'footer.support': 'Support',
      'footer.social': 'Social Media',
      'footer.about': 'About Us',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',

      // Contest Page
      'contest.title': 'Content Contests',
      'contest.current': 'Current Contest',
      'contest.pastWinners': 'Past Winners',
      'contest.rules': 'Contest Rules',
      'contest.prizes': 'Prize Information',
      'contest.howToParticipate': 'How to Participate',
      'contest.memberBenefits': 'Member Benefits',
      'contest.joinMember': 'Join as Member to Participate',
      'contest.exclusiveAccess': 'Exclusive Contest Access',
      'contest.winPoints': 'Win Points & Recognition',
      'contest.alreadyMember': 'Already a Member? Login to Participate',
      'contest.becomeMember': 'Become a Member to Join Contests',
      'contest.startCreating': 'Start Creating Amazing Content',
      'contest.winPrizes': 'Win Prizes & Build Your Portfolio',
      'contest.submit': 'Submit Entry',
      'contest.deadline': 'Deadline',
      'contest.participants': 'Participants',
      'contest.vote': 'Vote',

      // About Page
      'about.title': 'About Us',
      'about.story': 'Our Story',
      'about.mission': 'Mission & Vision',
      'about.team': 'Our Team',
      'about.values': 'Our Values',
      'about.subtitle': 'We are committed to providing the highest quality financial services to our clients',
      'about.storyTitle': 'Our Story',
      'about.storyContent': 'Persona Centric was founded in 2024 with the mission to revolutionize financial advisory services through AI technology. We believe everyone deserves access to professional financial guidance.',
      'about.missionTitle': 'Mission & Vision',
      'about.missionContent': 'Our mission is to make professional financial advisory services more accessible and convenient. Through AI technology, we create optimal matches between clients and advisors.',
      'about.teamTitle': 'Our Team',
      'about.teamContent': 'We have an experienced team of professionals including financial experts, technical engineers, and customer service specialists.',
      'about.valuesTitle': 'Core Values',
      'about.valuesContent': 'Integrity, professionalism, innovation, and customer-first approach are our core values.',

      // Pricing Page
      'pricing.title': 'Pricing Plans',
      'pricing.subtitle': 'Choose the plan that fits you best',
      'pricing.free': 'Free',
      'pricing.paid': 'Paid',
      'pricing.monthly': 'Monthly',
      'pricing.yearly': 'Yearly',
      'pricing.getStarted': 'Get Started',
      'pricing.contactSales': 'Contact Sales',
      'pricing.mostPopular': 'Most Popular',
      'pricing.pointsReward': '500 points per successful payment',
      'pricing.paymentMethods': 'Payment Methods',
      'pricing.creditCards': 'Credit/Debit Cards',
      'pricing.digitalWallets': 'Digital Wallets',
      'pricing.bankTransfer': 'Bank Transfer',
      'pricing.faq': 'Frequently Asked Questions',
      'pricing.changePlan': 'Can I change my plan at any time?',
      'pricing.changePlanAnswer': 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
      'pricing.paymentFail': 'What happens if payment fails?',
      'pricing.paymentFailAnswer': 'We provide a 3-month grace period. If payment fails for 3 consecutive months, your account will be suspended.',
      'pricing.unlimitedAccess': 'How do I get unlimited access?',
      'pricing.unlimitedAccessAnswer': 'You can request admin-granted unlimited access, or use a 6-digit access code for immediate activation.',
      'pricing.pointsWork': 'How do point rewards work?',
      'pricing.pointsWorkAnswer': 'Each successful HKD$10 payment awards 500 points. Admin-granted access does not provide points.',
      'pricing.enterprise': 'Need a Custom Solution?',
      'pricing.enterpriseSubtitle': 'We offer enterprise plans for large organizations with custom features and dedicated support.',
      'pricing.contactSales': 'Contact Sales',

      // AI Trial Page
      'aiTrial.title': 'AI Content Generator Trial',
      'aiTrial.subtitle': 'Experience how AI transforms your content creation',
      'aiTrial.industry': 'Select Industry',
      'aiTrial.generate': 'Generate Content',
      'aiTrial.tryNow': 'Try Now',
      'aiTrial.selectIndustry': 'Select Your Industry',
      'aiTrial.financial': 'Financial Services',
      'aiTrial.insurance': 'Insurance',
      'aiTrial.investment': 'Investment',
      'aiTrial.retirement': 'Retirement Planning',
      'aiTrial.realEstate': 'Real Estate',
      'aiTrial.contentType': 'Content Type',
      'aiTrial.socialMedia': 'Social Media Post',
      'aiTrial.blog': 'Blog Article',
      'aiTrial.email': 'Email',
      'aiTrial.presentation': 'Presentation',
      'aiTrial.keywords': 'Keywords',
      'aiTrial.generateButton': 'Generate Content',
      'aiTrial.result': 'Generated Result',
      'aiTrial.copy': 'Copy',
      'aiTrial.download': 'Download',
      'aiTrial.share': 'Share',

      // Agent Matching Page
      'matching.title': 'Agent Matching Quiz',
      'matching.subtitle': 'Find your perfect financial advisor',
      'matching.start': 'Start Quiz',
      'matching.next': 'Next',
      'matching.previous': 'Previous',
      'matching.finish': 'Finish Quiz',
      'matching.question': 'Question',
      'matching.progress': 'Progress',
      'matching.results': 'Quiz Results',
      'matching.recommendations': 'Recommended Advisors',
      'matching.contact': 'Contact Advisor',
      'matching.retake': 'Retake Quiz',

      // Login Page
      'login.title': 'Login',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.rememberMe': 'Remember Me',
      'login.forgotPassword': 'Forgot Password?',
      'login.noAccount': "Don't have an account?",
      'login.register': 'Register Now',
      'login.submit': 'Login',
      'login.or': 'or',
      'login.google': 'Login with Google',
      'login.facebook': 'Login with Facebook',

      // Register Page
      'register.title': 'Register',
      'register.firstName': 'First Name',
      'register.lastName': 'Last Name',
      'register.email': 'Email',
      'register.password': 'Password',
      'register.confirmPassword': 'Confirm Password',
      'register.role': 'Role',
      'register.client': 'Client',
      'register.agent': 'Agent',
      'register.terms': 'I agree to the Terms of Service',
      'register.haveAccount': 'Already have an account?',
      'register.login': 'Login Now',
      'register.submit': 'Register',
      'register.or': 'or',
      'register.google': 'Register with Google',
      'register.facebook': 'Register with Facebook',

      // Help Center
      'help.title': 'Help Center',
      'help.subtitle': 'We\'re here to help you anytime',
      'help.faq': 'FAQ',
      'help.contact': 'Contact Support',
      'help.legal': 'Legal',
      'help.getStarted': 'How do I get started with Persona Centric?',
      'help.getStartedAnswer': 'After registering an account, you can explore our services including AI content generation, agent matching, and event participation. We recommend completing your profile setup for the best experience.',
      'help.aiContent': 'How does the AI content generator work?',
      'help.aiContentAnswer': 'Our AI tool analyzes your industry and needs to generate professional financial content. Simply select your industry, input keywords, and the AI will create suitable content.',
      'help.agentCost': 'What are the costs for agent matching services?',
      'help.agentCostAnswer': 'We offer various membership plans from basic to premium. Please check our pricing page for detailed cost structures and feature comparisons.',
      'help.contests': 'How can I participate in contests?',
      'help.contestsAnswer': 'After registration, you can view current and upcoming contests on the contests page. Submit your work and have a chance to win rewards.',
      'help.security': 'Is the platform secure and reliable?',
      'help.securityAnswer': 'We use state-of-the-art security measures to protect your data. All transactions are encrypted and we strictly follow our privacy policy and terms of use.',
      'help.support': 'How can I contact customer support?',
      'help.supportAnswer': 'You can contact us through multiple channels: email, phone, or using the contact form on this page. Our team will respond within 24 hours.',
      'help.contactChannels': 'Contact Channels',
      'help.emailSupport': 'Email Support',
      'help.phoneSupport': 'Phone Support',
      'help.liveChat': 'Live Chat',
      'help.responseTime': 'Response within 24 hours',
      'help.workingHours': 'Mon-Fri 9AM-6PM',
      'help.instantResponse': 'Instant response',
      'help.sendMessage': 'Send Message',
      'help.selectIssue': 'Select Issue Type',
      'help.technical': 'Technical Issue',
      'help.account': 'Account Issue',
      'help.payment': 'Payment Issue',
      'help.general': 'General Inquiry',
      'help.describeIssue': 'Please describe your issue...',
      'help.activate': 'Activate',
      'help.cancel': 'Cancel',
      'help.enterCode': 'Enter Access Code',
      'help.codeDescription': 'Please enter your 6-digit access code to get unlimited agent access',
      'help.enterCodePlaceholder': 'Enter 6-digit code',

      // Lifestyle Options
      'lifestyle.active': 'Active Lifestyle',
      'lifestyle.family': 'Family Oriented',
      'lifestyle.traveler': 'Traveler',
      'lifestyle.foodie': 'Foodie',
      'lifestyle.creative': 'Creative',
      'lifestyle.tech': 'Tech Enthusiast',
      'lifestyle.wellness': 'Wellness Focused',
      'lifestyle.finance': 'Finance Savvy',
      'lifestyle.student': 'Student',
      'lifestyle.retiree': 'Retiree',
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const toggleLanguage = () => {
    const newLang = language === 'zh-TW' ? 'en' : 'zh-TW';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}; 
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HelpCenterPage = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqData = [
    {
      question: t('help.getStarted'),
      answer: t('help.getStartedAnswer')
    },
    {
      question: t('help.aiContent'),
      answer: t('help.aiContentAnswer')
    },
    {
      question: t('help.agentCost'),
      answer: t('help.agentCostAnswer')
    },
    {
      question: t('help.contests'),
      answer: t('help.contestsAnswer')
    },
    {
      question: t('help.security'),
      answer: t('help.securityAnswer')
    },
    {
      question: t('help.support'),
      answer: t('help.supportAnswer')
    }
  ];

  const supportChannels = [
    {
      icon: 'fas fa-envelope',
      title: t('help.emailSupport'),
      description: t('help.responseTime'),
      contact: 'support@personacentric.com'
    },
    {
      icon: 'fas fa-phone',
      title: t('help.phoneSupport'),
      description: t('help.workingHours'),
      contact: '+1 (555) 123-4567'
    },
    {
      icon: 'fas fa-comments',
      title: t('help.liveChat'),
      description: t('help.instantResponse'),
      contact: t('help.clickToStartChat')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('help.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('help.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === 'faq' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('help.faq')}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('help.contactSupport')}
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === 'legal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('help.legal')}
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {language === 'zh-TW' ? '常見問題' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <i className={`fas fa-chevron-${expandedFaq === index ? 'up' : 'down'} text-gray-500`}></i>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support Section */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            {/* Support Channels */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'zh-TW' ? '聯繫方式' : 'Contact Channels'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportChannels.map((channel, index) => (
                  <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className={`${channel.icon} text-2xl text-blue-600`}></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{channel.title}</h3>
                    <p className="text-gray-600 mb-4">{channel.description}</p>
                    <p className="text-blue-600 font-medium">{channel.contact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'zh-TW' ? '發送消息' : 'Send Message'}
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder={language === 'zh-TW' ? '姓名' : 'Name'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder={language === 'zh-TW' ? '電子郵件' : 'Email'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>{language === 'zh-TW' ? '選擇問題類型' : 'Select Issue Type'}</option>
                  <option>{language === 'zh-TW' ? '技術問題' : 'Technical Issue'}</option>
                  <option>{language === 'zh-TW' ? '帳戶問題' : 'Account Issue'}</option>
                  <option>{language === 'zh-TW' ? '付款問題' : 'Payment Issue'}</option>
                  <option>{language === 'zh-TW' ? '一般查詢' : 'General Inquiry'}</option>
                </select>
                <textarea
                  placeholder={language === 'zh-TW' ? '請描述您的問題...' : 'Please describe your issue...'}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    {language === 'zh-TW' ? '發送消息' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Legal Section */}
        {activeTab === 'legal' && (
          <div className="space-y-8">
            {/* Privacy Policy */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {language === 'zh-TW' ? '隱私政策' : 'Privacy Policy'}
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4 text-sm text-gray-600">
                  {language === 'zh-TW' 
                    ? '最後更新日期：2025年10月'
                    : 'Last Updated: October 2025'
                  }
                </p>
                
                <p className="mb-6">
                  {language === 'zh-TW' 
                    ? '歡迎來到 Persona Centric。我們重視您的隱私，並致力於保護您的個人信息。本隱私政策詳細說明了我們如何收集、使用、披露和保護您在使用我們平台時提供的信息。'
                    : 'Welcome to Persona Centric. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains in detail how we collect, use, disclose, and safeguard your information when you use our platform.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '1. 我們收集的信息' : '1. Information We Collect'}
                </h3>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                  {language === 'zh-TW' ? '1.1 您提供的信息' : '1.1 Information You Provide'}
                </h4>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '當您註冊、使用我們的服務或與我們溝通時，我們會收集您自願提供的信息：'
                    : 'When you register, use our services, or communicate with us, we collect information you voluntarily provide:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>{language === 'zh-TW' ? '個人識別信息（姓名、電子郵件地址、電話號碼）' : 'Personal identification information (name, email address, phone number)'}</li>
                  <li>{language === 'zh-TW' ? '帳戶憑證（用戶名、密碼）' : 'Account credentials (username, password)'}</li>
                  <li>{language === 'zh-TW' ? '個人資料信息（出生日期、性別、職業）' : 'Profile information (date of birth, gender, occupation)'}</li>
                  <li>{language === 'zh-TW' ? '財務相關信息（投資目標、風險承受能力）' : 'Financial-related information (investment goals, risk tolerance)'}</li>
                  <li>{language === 'zh-TW' ? '支付信息（信用卡詳細信息，通過安全支付處理器處理）' : 'Payment information (credit card details, processed through secure payment processors)'}</li>
                  <li>{language === 'zh-TW' ? '活動註冊和參與信息' : 'Event registration and participation information'}</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                  {language === 'zh-TW' ? '1.2 自動收集的信息' : '1.2 Automatically Collected Information'}
                </h4>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '當您訪問我們的平台時，我們會自動收集某些技術信息：'
                    : 'When you visit our platform, we automatically collect certain technical information:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>{language === 'zh-TW' ? '設備信息（IP 地址、瀏覽器類型、操作系統）' : 'Device information (IP address, browser type, operating system)'}</li>
                  <li>{language === 'zh-TW' ? '使用數據（訪問的頁面、點擊模式、訪問時間）' : 'Usage data (pages visited, click patterns, time spent)'}</li>
                  <li>{language === 'zh-TW' ? 'Cookie 和類似的跟踪技術' : 'Cookies and similar tracking technologies'}</li>
                  <li>{language === 'zh-TW' ? '位置數據（如果您授予權限）' : 'Location data (if you grant permission)'}</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                  {language === 'zh-TW' ? '1.3 第三方來源的信息' : '1.3 Information from Third Parties'}
                </h4>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們可能會從第三方服務（如社交媒體平台、OAuth 提供商）接收信息，如果您選擇連接這些服務到您的帳戶。'
                    : 'We may receive information from third-party services (such as social media platforms, OAuth providers) if you choose to connect these services to your account.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '2. 我們如何使用您的信息' : '2. How We Use Your Information'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們將您的信息用於以下目的：'
                    : 'We use your information for the following purposes:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>{language === 'zh-TW' ? '提供、維護和改進我們的服務' : 'To provide, maintain, and improve our services'}</li>
                  <li>{language === 'zh-TW' ? '處理交易和管理訂閱' : 'To process transactions and manage subscriptions'}</li>
                  <li>{language === 'zh-TW' ? '匹配您與合適的財務顧問' : 'To match you with suitable financial advisors'}</li>
                  <li>{language === 'zh-TW' ? '個性化您的用戶體驗' : 'To personalize your user experience'}</li>
                  <li>{language === 'zh-TW' ? '發送重要通知、更新和營銷信息（根據您的偏好）' : 'To send important notifications, updates, and marketing communications (based on your preferences)'}</li>
                  <li>{language === 'zh-TW' ? '回應您的詢問和提供客戶支持' : 'To respond to your inquiries and provide customer support'}</li>
                  <li>{language === 'zh-TW' ? '進行分析和研究以改善我們的平台' : 'To conduct analytics and research to improve our platform'}</li>
                  <li>{language === 'zh-TW' ? '檢測、預防和解決安全問題和欺詐行為' : 'To detect, prevent, and address security issues and fraudulent behavior'}</li>
                  <li>{language === 'zh-TW' ? '遵守法律義務' : 'To comply with legal obligations'}</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '3. 信息共享和披露' : '3. Information Sharing and Disclosure'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們不會出售您的個人信息。我們僅在以下情況下共享您的信息：'
                    : 'We do not sell your personal information. We only share your information in the following circumstances:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>{language === 'zh-TW' ? '與財務顧問：' : 'With Financial Advisors:'}</strong> {language === 'zh-TW' ? '當您使用我們的匹配服務時，我們會與相關顧問共享您的聯繫和財務偏好信息。' : 'When you use our matching service, we share your contact and financial preference information with relevant advisors.'}</li>
                  <li><strong>{language === 'zh-TW' ? '服務提供商：' : 'Service Providers:'}</strong> {language === 'zh-TW' ? '與協助我們運營平台的第三方服務提供商（如支付處理器、託管服務、分析工具）。' : 'With third-party service providers who help us operate the platform (such as payment processors, hosting services, analytics tools).'}</li>
                  <li><strong>{language === 'zh-TW' ? '法律要求：' : 'Legal Requirements:'}</strong> {language === 'zh-TW' ? '當法律要求或回應有效的法律程序時。' : 'When required by law or in response to valid legal process.'}</li>
                  <li><strong>{language === 'zh-TW' ? '業務轉讓：' : 'Business Transfers:'}</strong> {language === 'zh-TW' ? '在合併、收購或資產出售的情況下。' : 'In the event of a merger, acquisition, or sale of assets.'}</li>
                  <li><strong>{language === 'zh-TW' ? '經您同意：' : 'With Your Consent:'}</strong> {language === 'zh-TW' ? '在您明確同意的任何其他情況下。' : 'In any other circumstances where you have given explicit consent.'}</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '4. Cookies 和跟踪技術' : '4. Cookies and Tracking Technologies'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們使用 cookies 和類似的跟踪技術來增強您的體驗：'
                    : 'We use cookies and similar tracking technologies to enhance your experience:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>{language === 'zh-TW' ? '必要的 Cookies：' : 'Essential Cookies:'}</strong> {language === 'zh-TW' ? '使平台功能正常運作所必需的。' : 'Required for the platform to function properly.'}</li>
                  <li><strong>{language === 'zh-TW' ? '性能 Cookies：' : 'Performance Cookies:'}</strong> {language === 'zh-TW' ? '幫助我們了解訪問者如何與我們的網站互動。' : 'Help us understand how visitors interact with our website.'}</li>
                  <li><strong>{language === 'zh-TW' ? '功能 Cookies：' : 'Functionality Cookies:'}</strong> {language === 'zh-TW' ? '記住您的偏好和設置。' : 'Remember your preferences and settings.'}</li>
                  <li><strong>{language === 'zh-TW' ? '營銷 Cookies：' : 'Marketing Cookies:'}</strong> {language === 'zh-TW' ? '用於向您提供相關的廣告。' : 'Used to deliver relevant advertisements to you.'}</li>
                </ul>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您可以通過瀏覽器設置管理 cookie 偏好，但禁用某些 cookies 可能會影響平台功能。'
                    : 'You can manage cookie preferences through your browser settings, but disabling certain cookies may affect platform functionality.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '5. 數據安全' : '5. Data Security'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們採用行業標準的安全措施來保護您的信息：'
                    : 'We implement industry-standard security measures to protect your information:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>{language === 'zh-TW' ? '傳輸中和靜態數據加密（SSL/TLS）' : 'Encryption in transit and at rest (SSL/TLS)'}</li>
                  <li>{language === 'zh-TW' ? '安全的密碼存儲（使用 bcrypt 哈希）' : 'Secure password storage (using bcrypt hashing)'}</li>
                  <li>{language === 'zh-TW' ? '定期安全審計和漏洞評估' : 'Regular security audits and vulnerability assessments'}</li>
                  <li>{language === 'zh-TW' ? '對員工進行數據保護培訓' : 'Employee training on data protection'}</li>
                  <li>{language === 'zh-TW' ? '訪問控制和最小權限原則' : 'Access controls and principle of least privilege'}</li>
                </ul>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '雖然我們採取合理的措施來保護您的信息，但沒有任何互聯網傳輸方法或電子存儲方法是 100% 安全的。'
                    : 'While we take reasonable measures to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '6. 您的權利和選擇' : '6. Your Rights and Choices'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您對您的個人信息擁有以下權利：'
                    : 'You have the following rights regarding your personal information:'
                  }
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li><strong>{language === 'zh-TW' ? '訪問權：' : 'Access:'}</strong> {language === 'zh-TW' ? '請求訪問我們持有的關於您的個人信息。' : 'Request access to the personal information we hold about you.'}</li>
                  <li><strong>{language === 'zh-TW' ? '更正權：' : 'Correction:'}</strong> {language === 'zh-TW' ? '更新或更正不準確的信息。' : 'Update or correct inaccurate information.'}</li>
                  <li><strong>{language === 'zh-TW' ? '刪除權：' : 'Deletion:'}</strong> {language === 'zh-TW' ? '請求刪除您的個人信息（受法律要求限制）。' : 'Request deletion of your personal information (subject to legal requirements).'}</li>
                  <li><strong>{language === 'zh-TW' ? '數據可攜權：' : 'Data Portability:'}</strong> {language === 'zh-TW' ? '以結構化、常用格式接收您的數據。' : 'Receive your data in a structured, commonly used format.'}</li>
                  <li><strong>{language === 'zh-TW' ? '退出權：' : 'Opt-Out:'}</strong> {language === 'zh-TW' ? '退出營銷通信（可通過您的帳戶設置或電子郵件中的取消訂閱鏈接）。' : 'Opt-out of marketing communications (through your account settings or unsubscribe links in emails).'}</li>
                  <li><strong>{language === 'zh-TW' ? '限制處理：' : 'Restrict Processing:'}</strong> {language === 'zh-TW' ? '在某些情況下請求限制處理您的信息。' : 'Request restriction of processing your information in certain circumstances.'}</li>
                </ul>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '要行使這些權利，請通過 support@personacentric.com 與我們聯繫。'
                    : 'To exercise these rights, please contact us at support@personacentric.com.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '7. 數據保留' : '7. Data Retention'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們僅在提供服務所需的時間內以及遵守法律義務（稅務、會計、監管要求）所需的時間內保留您的個人信息。當您刪除帳戶時，我們會在合理的時間範圍內刪除或匿名化您的個人信息，除非法律要求保留。'
                    : 'We retain your personal information only for as long as necessary to provide our services and to comply with legal obligations (tax, accounting, regulatory requirements). When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe, unless retention is required by law.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '8. 兒童隱私' : '8. Children\'s Privacy'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們的服務不面向 18 歲以下的兒童。我們不會有意收集 18 歲以下兒童的個人信息。如果您認為我們可能擁有 18 歲以下兒童的信息，請與我們聯繫，我們將立即刪除該信息。'
                    : 'Our services are not directed to children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we may have information from a child under 18, please contact us, and we will promptly delete such information.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '9. 國際數據傳輸' : '9. International Data Transfers'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您的信息可能會被傳輸到並保存在您所在國家/地區以外的服務器上，這些國家/地區的數據保護法律可能與您所在司法管轄區的法律不同。通過使用我們的服務，您同意將您的信息傳輸到這些地點。我們採取措施確保您的數據得到安全處理並符合本隱私政策。'
                    : 'Your information may be transferred to and maintained on servers located outside your country of residence, where data protection laws may differ from those in your jurisdiction. By using our services, you consent to the transfer of your information to these locations. We take measures to ensure your data is handled securely and in accordance with this Privacy Policy.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '10. 第三方鏈接' : '10. Third-Party Links'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們的平台可能包含指向第三方網站的鏈接。我們不對這些網站的隱私實踐或內容負責。我們鼓勵您在訪問任何第三方網站時查看其隱私政策。'
                    : 'Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. We encourage you to review their privacy policies when visiting any third-party websites.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '11. 隱私政策變更' : '11. Changes to This Privacy Policy'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們可能會不時更新本隱私政策。我們將在本頁面發布任何更改，並更新"最後更新"日期。對於重大更改，我們將通過電子郵件或平台上的顯著通知向您提供更突出的通知。我們鼓勵您定期查看本隱私政策以了解我們如何保護您的信息。'
                    : 'We may update this Privacy Policy from time to time. We will post any changes on this page and update the "Last Updated" date. For material changes, we will provide more prominent notice to you by email or through a prominent notice on our platform. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  {language === 'zh-TW' ? '12. 聯繫我們' : '12. Contact Us'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '如果您對本隱私政策有任何疑問、意見或請求，請通過以下方式與我們聯繫：'
                    : 'If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:'
                  }
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="mb-2"><strong>Persona Centric</strong></p>
                  <p className="mb-2">
                    {language === 'zh-TW' ? '電子郵件：' : 'Email:'} 
                    <a href="mailto:support@personacentric.com" className="text-blue-600 hover:underline ml-2">
                      support@personacentric.com
                    </a>
                  </p>
                  <p className="mb-2">
                    {language === 'zh-TW' ? '電話：' : 'Phone:'} +1 (555) 123-4567
                  </p>
                  <p>
                    {language === 'zh-TW' ? '回應時間：' : 'Response Time:'} 
                    {language === 'zh-TW' ? ' 我們致力於在 5 個工作日內回覆所有隱私相關的詢問。' : ' We are committed to responding to all privacy-related inquiries within 5 business days.'}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                  <p className="text-sm">
                    {language === 'zh-TW'
                      ? '通過使用 Persona Centric 平台，您確認已閱讀、理解並同意本隱私政策中描述的實踐。'
                      : 'By using the Persona Centric platform, you acknowledge that you have read, understood, and agree to the practices described in this Privacy Policy.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {language === 'zh-TW' ? '使用條款' : 'Terms of Service'}
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '使用我們的服務即表示您同意這些條款。請仔細閱讀以下條款和條件。'
                    : 'By using our services, you agree to these terms. Please read the following terms and conditions carefully.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '服務使用' : 'Service Usage'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您同意僅將我們的服務用於合法目的，並遵守所有適用的法律和法規。'
                    : 'You agree to use our services only for lawful purposes and to comply with all applicable laws and regulations.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '帳戶責任' : 'Account Responsibility'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您負責維護帳戶安全，包括保護密碼和及時報告任何未經授權的使用。'
                    : 'You are responsible for maintaining account security, including protecting passwords and promptly reporting any unauthorized use.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '服務變更' : 'Service Changes'}
                </h3>
                <p>
                  {language === 'zh-TW'
                    ? '我們保留隨時修改或終止服務的權利，並會提前通知用戶任何重大變更。'
                    : 'We reserve the right to modify or terminate services at any time and will notify users of any significant changes in advance.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenterPage; 
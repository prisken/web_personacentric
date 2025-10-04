import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const EventDetails = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center" id="event-info">
      <div className="max-w-5xl mx-auto">
        <div className="relative inline-block mx-auto">
          <div className="absolute -inset-2 bg-pink-400/20 blur-2xl rounded-full"></div>
          <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">{t('foodForTalk.details.heroTitle')}</h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto text-left">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="text-xl font-bold text-white mb-2">{t('foodForTalk.details.howToTitle')}</div>
          <ol className="list-decimal pl-5 space-y-3 text-white/90">
            <li>{t('foodForTalk.details.howTo.step1')}</li>
            <li>{t('foodForTalk.details.howTo.step2')}</li>
            <li>{t('foodForTalk.details.howTo.step3')}</li>
            <li>{t('foodForTalk.details.howTo.step4')}</li>
            <li>{t('foodForTalk.details.howTo.step5')}</li>
          </ol>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="text-xl font-bold text-white mb-2">{t('foodForTalk.details.sponsorTitle')}</div>
          <ul className="list-disc pl-5 space-y-2 text-white/90">
            <li>{t('foodForTalk.details.sponsor1')}</li>
            <li>{t('foodForTalk.details.sponsor2')}</li>
            <li>{t('foodForTalk.details.sponsor3')}</li>
          </ul>
          <div className="mt-6 text-xl font-bold text-white mb-2">{t('foodForTalk.details.faqTitle')}</div>
          <ul className="space-y-3 text-white/90">
            <li>
              <div className="font-semibold">{t('foodForTalk.details.faq.q1')}</div>
              <div>{t('foodForTalk.details.faq.a1')}</div>
            </li>
            <li>
              <div className="font-semibold">{t('foodForTalk.details.faq.q2')}</div>
              <div>{t('foodForTalk.details.faq.a2')}</div>
            </li>
            <li>
              <div className="font-semibold">{t('foodForTalk.details.faq.q3')}</div>
              <div>{t('foodForTalk.details.faq.a3')}</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <div className="inline-block">
          <a href="/food-for-talk/register" className="group relative inline-flex items-center px-8 py-4 rounded-2xl font-extrabold text-white text-lg transition-all duration-300 transform hover:scale-105 shadow-lg" style={{background:'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', boxShadow:'0 12px 40px rgba(245, 158, 11, 0.4)'}}>
            <span className="relative z-10 flex items-center">{t('foodForTalk.submit')}
              <svg className="ml-3 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-yellow-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>

      <div className="mt-10 max-w-4xl mx-auto text-left">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-lg font-bold text-white mb-2">🌸 High Tea or me 免責條款（Disclaimer）🌸</div>
          <div className="text-white/75 space-y-3 text-xs leading-relaxed">
            <p>歡迎參加 Honor District 神秘日式速配派對（High tea or Me?）。報名及參與本活動即代表你已閱讀、明白並同意以下免責聲明：</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><span className="font-semibold">參加者個人行為責任：</span> 參加者需對自己於活動期間的行為及言語負全部責任。如有任何不當或違法行為，主辦方有權即時終止其參與資格。</li>
              <li><span className="font-semibold">個人資料保護：</span> 主辦方會盡力保障參加者的個人資料安全。活動前不會公開真名、聯絡資料或樣貌；如參加者自願分享資料，主辦方概不負責。</li>
              <li><span className="font-semibold">配對結果及人際互動：</span> 主辦方僅提供平台，對配對結果及其後人際互動不作任何承諾或擔保。</li>
              <li><span className="font-semibold">攝影及錄影權利：</span> 活動期間主辦方及合作媒體可進行攝影／錄影，用作宣傳或記錄用途，僅公開經參加者同意的片段或合照。</li>
              <li><span className="font-semibold">不可抗力因素：</span> 如因不可抗力因素導致活動取消或變更，主辦方保留最終決定權。</li>
            </ol>
            <div className="text-white/60 text-[11px]">建議擺放位置：表格提交前設 Checkbox；網站專頁；以及確認 Email 內再提示。</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

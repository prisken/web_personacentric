import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import RegisterButton from './RegisterButton';

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
          <div className="text-xl font-bold text-gray-800 mb-2">{t('foodForTalk.details.sponsorTitle')}</div>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
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
            <li>
              <div className="font-semibold">{t('foodForTalk.details.faq.q4')}</div>
              <div>{t('foodForTalk.details.faq.a4')}</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <div className="inline-block">
          <RegisterButton location="event_details_section" />
        </div>
      </div>

      <div className="mt-10 max-w-4xl mx-auto text-left">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-lg font-bold text-white mb-2">{t('foodForTalk.disclaimer.title')}</div>
          <div className="text-white/75 space-y-3 text-xs leading-relaxed">
            <p>{t('foodForTalk.disclaimer.intro')}</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('foodForTalk.disclaimer.item1')}</li>
              <li>{t('foodForTalk.disclaimer.item2')}</li>
              <li>{t('foodForTalk.disclaimer.item3')}</li>
              <li>{t('foodForTalk.disclaimer.item4')}</li>
              <li>{t('foodForTalk.disclaimer.item5')}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const EventDetails = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
        {t('foodForTalk.eventDetails.title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Event Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-white mb-3">{t('foodForTalk.eventDetails.dateTime')}</h3>
          <p className="text-white/80" dangerouslySetInnerHTML={{ __html: t('foodForTalk.eventDetails.dateTimeValue') }}>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-bold text-white mb-3">{t('foodForTalk.eventDetails.location')}</h3>
          <p className="text-white/80" dangerouslySetInnerHTML={{ __html: t('foodForTalk.eventDetails.locationValue') }}>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-white mb-3">{t('foodForTalk.eventDetails.capacity')}</h3>
          <p className="text-white/80" dangerouslySetInnerHTML={{ __html: t('foodForTalk.eventDetails.capacityValue') }}>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-white mb-3">{t('foodForTalk.eventDetails.dining')}</h3>
          <p className="text-white/80" dangerouslySetInnerHTML={{ __html: t('foodForTalk.eventDetails.diningValue') }}>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">💝</div>
          <h3 className="text-xl font-bold text-white mb-3">{t('foodForTalk.eventDetails.included')}</h3>
          <p className="text-white/80" dangerouslySetInnerHTML={{ __html: t('foodForTalk.eventDetails.includedValue') }}>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-3">{t('foodForTalk.eventDetails.format')}</h3>
          <p className="text-white/80" dangerouslySetInnerHTML={{ __html: t('foodForTalk.eventDetails.formatValue') }}>
          </p>
        </div>
      </div>

      {/* Event Description */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">{t('foodForTalk.eventDetails.about')}</h3>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            {t('foodForTalk.eventDetails.aboutText1')}
          </p>
          <p className="text-white/80 text-lg leading-relaxed">
            {t('foodForTalk.eventDetails.aboutText2')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

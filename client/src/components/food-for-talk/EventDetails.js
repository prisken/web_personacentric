import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const EventDetails = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center" id="event-info">
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

      {/* Event Description (revamped) */}
      <div className="mt-12 max-w-4xl mx-auto text-left">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-2xl font-bold text-white mb-4">🌸 活動玩法說明｜神秘日式速配派對 🌸</div>
          <div className="space-y-6 text-white/90 leading-relaxed">
            <div>
              <div className="font-semibold text-xl mb-2">🤩 究竟點玩？</div>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <span className="font-semibold">2分鐘極速報名：</span>一份超簡單的表格，分享興趣、專長、最吸引人之處同小小自我介紹！真名同樣貌完全唔會公開！
                </li>
                <li>
                  <span className="font-semibold">匿名偷窺：</span>報完名，即可瀏覽其他參加者的匿名卡片：興趣、專長、最有魅力之處一覽無遺！
                  <div>嘩，呢個人同我咁啱Key！（無樣貌、無真名，只有個性大爆發！）</div>
                </li>
                <li>
                  <span className="font-semibold">專員暗中聯絡你：</span>Honor District團隊會主動聯絡參加者，了解多啲你嘅想法，確保每個人都想玩得認真又開心！
                </li>
                <li>
                  <span className="font-semibold">神秘聊天室·搵朋友熱身：</span>成功入選可獲專屬數碼金鑰匙，加入匿名聊天室，未見面已經有火花！
                </li>
                <li>
                  <span className="font-semibold">大日子現身！速配派對開波：</span>20位入選者將於11月1日齊聚IPPIK日式餐廳，十道精緻下午茶＋現場速配遊戲！
                  <div>女生金戒指、男生金髮夾，勇敢表達好感，成就你們的小確幸！</div>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="font-semibold mb-2">贊助商加持·派對升級：</div>
              <ul className="list-disc pl-6 space-y-2">
                <li>1/2 飲品任你飲</li>
                <li>IPPIK餐廳氣氛滿分</li>
                <li>Persona Centric 媒體團隊影靚相（不公開真名或樣貌）</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-xl mb-2">💡 常見問題 Q&A</div>
              <ul className="space-y-3">
                <li>
                  <div className="font-semibold">一定要見樣咩？</div>
                  <div>唔使！活動前全程匿名，齋靠興趣同性格搵共鳴！</div>
                </li>
                <li>
                  <div className="font-semibold">點知自己有冇入選？</div>
                  <div>請留意 Whatsapp 或 email 通知</div>
                </li>
                <li>
                  <div className="font-semibold">參加有咩著數？</div>
                  <div>新朋友、開心回憶、靚飲靚食、甚至可能遇到 Mr./Ms. Right！</div>
                </li>
              </ul>
            </div>

            <div className="text-center font-bold text-yellow-300 text-xl">🚀 立即報名！開展屬於你嘅神秘邂逅！</div>

            <div className="text-sm text-white/70">
              主辦：Honor District ｜ 飲品贊助：1/2 ｜ 場地：IPPIK ｜ 媒體：Persona Centric
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer - subtle styling */}
      <div className="mt-12 max-w-4xl mx-auto text-left">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="text-xl font-bold text-white mb-4">🌸 High Tea or me 免責條款（Disclaimer）🌸</div>
          <div className="text-white/80 space-y-4 text-sm leading-relaxed">
            <p>歡迎參加 Honor District 神秘日式速配派對（High tea or Me?）。報名及參與本活動即代表你已閱讀、明白並同意以下免責聲明：</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li><span className="font-semibold">參加者個人行為責任：</span> 參加者需對自己於活動期間的行為及言語負全部責任。如有任何不當或違法行為，主辦方有權即時終止其參與資格。</li>
              <li><span className="font-semibold">個人資料保護：</span> 主辦方會盡力保障參加者的個人資料安全。活動前不會公開真名、聯絡資料或樣貌；如參加者自願分享資料，主辦方概不負責。</li>
              <li><span className="font-semibold">配對結果及人際互動：</span> 主辦方僅提供平台，對配對結果及其後人際互動不作任何承諾或擔保。</li>
              <li><span className="font-semibold">攝影及錄影權利：</span> 活動期間主辦方及合作媒體可進行攝影／錄影，用作宣傳或記錄用途，僅公開經參加者同意的片段或合照。</li>
              <li><span className="font-semibold">不可抗力因素：</span> 如因不可抗力因素導致活動取消或變更，主辦方保留最終決定權。</li>
            </ol>
            <div className="text-white/60 text-xs">建議擺放位置：表格提交前設 Checkbox；網站專頁；以及確認 Email 內再提示。</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

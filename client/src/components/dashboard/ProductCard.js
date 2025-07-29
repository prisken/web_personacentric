import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const ProductCard = ({ product, updateProduct, removeProduct, duplicateProduct }) => {
  const { t } = useTranslation();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', formula: '', description: '' });
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const getProductIcon = (subType) => {
    const icons = {
      funds: '📈',
      mpf: '🏦',
      saving_plans: '💰',
      bank: '🏛️',
      retirement_funds: '🎯',
      own_living: '🏠',
      renting: '🏢'
    };
    return icons[subType] || '💰';
  };

  const getProductName = (subType) => {
    const names = {
      funds: t('financialPlanning.funds'),
      mpf: t('financialPlanning.mpf'),
      saving_plans: t('financialPlanning.savingPlans'),
      bank: t('financialPlanning.bank'),
      retirement_funds: t('financialPlanning.retirementFunds'),
      own_living: t('financialPlanning.ownLiving'),
      renting: t('financialPlanning.renting')
    };
    return names[subType] || t('financialPlanning.product');
  };

  const getFormulaExplanation = (subType, data) => {
    switch (subType) {
      case 'funds':
        if (data.fundCategory === 'growth') {
          return {
            title: t('productCard.totalReturn'),
            formula: `投資年期 = 提取年齡 - 開始年齡\n總回報 = 投資金額 × (1 + 年回報率)^投資年期\n\n增長基金特點：\n- 使用複式計算\n- 收益會再投資\n- 產生複利效果\n- 總回報包含本金和收益`,
            description: '增長基金將收益再投資，產生複利效果，適合長期投資和資本增值。'
          };
        } else {
          return {
            title: t('productCard.monthlyDividends'),
            formula: `投資年期 = 提取年齡 - 開始年齡\n每月派息 = 投資金額 × 年回報率 ÷ 12\n總派息 = 每月派息 × 12 × 投資年期\n\n派息基金特點：\n- 使用單利計算\n- 每月派發固定金額\n- 不產生複利效果\n- 本金保持不變`,
            description: '派息基金每月派發固定收益，適合需要穩定現金流的投資者。'
          };
        }
      case 'mpf':
        return {
          title: t('productCard.mpfAt65'),
          formula: `現有金額複利 = 現有金額 × (1 + 年回報率)^(65 - 當前年齡)\n未來供款複利 = Σ(月供款 × (1 + 年回報率)^(剩餘月數/12))\n月供款計算：\n- 月薪 < 7,100：無供款\n- 月薪 ≥ 7,100 且 < 30,000：僱主供款 + 僱員供款\n- 月薪 ≥ 30,000：僱主供款上限 1,500 + 僱員供款上限 1,500\n年薪增幅：每年月薪 = 月薪 × (1 + 年薪增幅%)^年數\n強積金總額 = 現有金額複利 + 未來供款複利\n總派息收益 = 強積金總額 - (現有金額 + 總供款)`,
          description: '強積金計算包含年薪增幅和供款上限，月薪低於7,100元無供款，月薪超過30,000元時僱主和僱員供款各上限1,500元，總派息收益為複利與單利的差額。'
        };
      case 'saving_plans':
        return {
          title: t('productCard.surrenderValue'),
          formula: `總供款 = 供款金額 × 供款年期 × (月供 ? 12 : 1)\n總派息收益 = 退保金額 - 總供款 + 金額提取\n投資年期 = 退保年齡 - 開始年齡\n預期年回報率 = (總派息收益 ÷ 總供款) ÷ 投資年期 × 100`,
          description: '儲蓄計劃的預期年回報率根據總派息收益、總供款金額和投資年期自動計算得出。'
        };
      case 'bank':
        if (data.planType === 'saving') {
          return {
            title: t('productCard.totalSavings'),
            formula: `總儲蓄 = 現存金額 + (供款金額 × 供款年期 × (月供 ? 12 : 1))\n利息 = 總儲蓄 × 年利率 × 供款年期\n總金額 = 總儲蓄 + 利息`,
            description: '儲蓄戶口計算包含現存金額和定期供款，加上按年利率計算的利息收入。'
          };
        } else {
          return {
            title: t('productCard.totalAmount'),
            formula: `總金額 = 供款金額 × (1 + 年利率)^(鎖定時間 ÷ 12)`,
            description: '定期存款使用複式計算，根據鎖定時間和年利率計算到期總金額。'
          };
        }
      case 'retirement_funds':
        if (data.contributionFrequency === 'oneTime') {
          return {
            title: t('productCard.monthlyReturn'),
            formula: `一次性供款 = 供款金額\n退休基金總值 = 一次性供款 × (1 + 年回報率)^(完成年齡 - 開始年齡)\n每月回報 = 退休基金總值 × 年回報率 ÷ 12`,
            description: '一次性退休基金供款使用複式計算，基於單次供款金額和投資年期計算複利增長，然後根據總值計算每月回報。'
          };
        } else {
          return {
            title: t('productCard.monthlyReturn'),
            formula: `總供款 = 供款金額 × 頻率倍數 × (完成年齡 - 開始年齡)\n退休基金總值 = 總供款 × (1 + 年回報率)^(完成年齡 - 開始年齡)\n每月回報 = 退休基金總值 × 年回報率 ÷ 12`,
            description: '定期退休基金使用複式計算，在完成供款後開始提供每月回報，回報基於複利增長的總值和年回報率。'
          };
        }
      case 'own_living':
        return {
          title: t('productCard.mortgageCompletionAge'),
          formula: `供樓年期 = 按揭金額 ÷ (月供 × 12)\n供完樓年齡 = 開始供樓年紀 + 供樓年期\n樓價總值 = 購買價格 × (1.03)^(賣樓年紀 - 開始供樓年紀)`,
          description: '自住物業計算供樓年期和完成年齡，樓價總值假設每年3%增長率。'
        };
      case 'renting':
        return {
          title: t('productCard.totalRentPaid'),
          formula: `總租金支出 = 每月租金 × 12 × (結束年齡 - 開始年齡)`,
          description: '租賃支出為每月租金乘以租賃期間的總月數。'
        };
      default:
        return { title: '', formula: '', description: '' };
    }
  };

  const handleInfoClick = (subType, data) => {
    const explanation = getFormulaExplanation(subType, data);
    setInfoContent(explanation);
    setShowInfoDialog(true);
  };

  // Update info dialog content when fund category or retirement fund frequency changes
  useEffect(() => {
    if (showInfoDialog && (product.subType === 'funds' || product.subType === 'retirement_funds')) {
      const explanation = getFormulaExplanation(product.subType, product.data);
      setInfoContent(explanation);
    }
  }, [product.data.fundCategory, product.data.contributionFrequency, showInfoDialog, product.subType]);

  const renderFormFields = () => {
    const { subType, data } = product;

    switch (subType) {
      case 'funds':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.fundCategory')}</label>
              <select
                value={data.fundCategory}
                onChange={(e) => updateProduct(product.id, 'fundCategory', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="growth">{t('productCard.growthFund')}</option>
                <option value="dividend">{t('productCard.dividendFund')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.investmentAmount')}</label>
              <input
                type="number"
                value={data.investmentAmount}
                onChange={(e) => updateProduct(product.id, 'investmentAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startAge')}</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.expectedReturn')}</label>
              <input
                type="number"
                value={data.expectedReturn}
                onChange={(e) => updateProduct(product.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder={t('productCard.expectedReturnPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.expectedWithdrawalAge')}</label>
              <input
                type="number"
                value={data.expectedWithdrawalAge}
                onChange={(e) => updateProduct(product.id, 'expectedWithdrawalAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        );

      case 'mpf':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.currentMPFAmount')}</label>
              <input
                type="number"
                value={data.currentMPFAmount}
                onChange={(e) => updateProduct(product.id, 'currentMPFAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.monthlySalary')}</label>
              <input
                type="number"
                value={data.monthlySalary}
                onChange={(e) => updateProduct(product.id, 'monthlySalary', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.salaryIncrement')}</label>
              <input
                type="number"
                value={data.salaryIncrement}
                onChange={(e) => updateProduct(product.id, 'salaryIncrement', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.employerContribution')}</label>
              <input
                type="number"
                value={data.employerContribution}
                onChange={(e) => updateProduct(product.id, 'employerContribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.employeeContribution')}</label>
              <input
                type="number"
                value={data.employeeContribution}
                onChange={(e) => updateProduct(product.id, 'employeeContribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.currentAge')}</label>
              <input
                type="number"
                value={data.currentAge}
                onChange={(e) => updateProduct(product.id, 'currentAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.expectedReturn')}</label>
              <input
                type="number"
                value={data.expectedReturn}
                onChange={(e) => updateProduct(product.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        );

      case 'saving_plans':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contribution')}</label>
              <input
                type="number"
                value={data.contribution}
                onChange={(e) => updateProduct(product.id, 'contribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionType')}</label>
              <select
                value={data.contributionType}
                onChange={(e) => updateProduct(product.id, 'contributionType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="monthly">{t('productCard.monthly')}</option>
                <option value="yearly">{t('productCard.yearly')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionPeriod')}</label>
              <input
                type="number"
                value={data.contributionPeriod}
                onChange={(e) => updateProduct(product.id, 'contributionPeriod', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.breakEvenPeriod')}</label>
              <input
                type="number"
                value={data.breakEvenPeriod}
                onChange={(e) => updateProduct(product.id, 'breakEvenPeriod', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.withdrawalAmount')}</label>
              <input
                type="number"
                value={data.withdrawalAmount}
                onChange={(e) => updateProduct(product.id, 'withdrawalAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.withdrawalPeriod')}</label>
              <input
                type="text"
                value={data.withdrawalPeriod}
                onChange={(e) => updateProduct(product.id, 'withdrawalPeriod', e.target.value)}
                placeholder="例如: 65-70"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.surrenderValue')}</label>
              <input
                type="number"
                value={data.surrenderValue}
                onChange={(e) => updateProduct(product.id, 'surrenderValue', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startAge')}</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.surrenderAge')}</label>
              <input
                type="number"
                value={data.surrenderAge}
                onChange={(e) => updateProduct(product.id, 'surrenderAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.planType')}</label>
              <select
                value={data.planType}
                onChange={(e) => updateProduct(product.id, 'planType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="saving">{t('productCard.saving')}</option>
                <option value="fixed_deposit">{t('productCard.fixedDeposit')}</option>
              </select>
            </div>
            
            {data.planType === 'saving' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.existingAmount')}</label>
                  <input
                    type="number"
                    value={data.existingAmount}
                    onChange={(e) => updateProduct(product.id, 'existingAmount', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contribution')}</label>
                  <input
                    type="number"
                    value={data.contribution}
                    onChange={(e) => updateProduct(product.id, 'contribution', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionFrequency')}</label>
                  <select
                    value={data.contributionFrequency}
                    onChange={(e) => updateProduct(product.id, 'contributionFrequency', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="monthly">{t('productCard.monthly')}</option>
                    <option value="yearly">{t('productCard.yearly')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionPeriod')}</label>
                  <input
                    type="number"
                    value={data.contributionPeriod}
                    onChange={(e) => updateProduct(product.id, 'contributionPeriod', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.interestRate')}</label>
                  <input
                    type="number"
                    value={data.interestRate}
                    onChange={(e) => updateProduct(product.id, 'interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startAge')}</label>
                  <input
                    type="number"
                    value={data.startAge}
                    onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contribution')}</label>
                  <input
                    type="number"
                    value={data.contribution}
                    onChange={(e) => updateProduct(product.id, 'contribution', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.alreadyOwned')}</label>
                  <select
                    value={data.alreadyOwned}
                    onChange={(e) => updateProduct(product.id, 'alreadyOwned', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Y">{t('productCard.yes')}</option>
                    <option value="N">{t('productCard.no')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.lockInPeriod')}</label>
                  <input
                    type="number"
                    value={data.lockInPeriod}
                    onChange={(e) => updateProduct(product.id, 'lockInPeriod', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.interestRate')}</label>
                  <input
                    type="number"
                    value={data.interestRate}
                    onChange={(e) => updateProduct(product.id, 'interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startAge')}</label>
                  <input
                    type="number"
                    value={data.startAge}
                    onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'retirement_funds':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionAmount')}</label>
              <input
                type="number"
                value={data.contributionAmount}
                onChange={(e) => updateProduct(product.id, 'contributionAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionFrequency')}</label>
              <select
                value={data.contributionFrequency}
                onChange={(e) => updateProduct(product.id, 'contributionFrequency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="monthly">{t('productCard.monthly')}</option>
                <option value="yearly">{t('productCard.yearly')}</option>
                <option value="oneTime">{t('productCard.oneTime')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startAge')}</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.completionAge')}</label>
              <input
                type="number"
                value={data.completionAge}
                onChange={(e) => updateProduct(product.id, 'completionAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.expectedReturn')}</label>
              <input
                type="number"
                value={data.expectedReturn}
                onChange={(e) => updateProduct(product.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        );

      case 'own_living':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.purchasePrice')}</label>
              <input
                type="number"
                value={data.purchasePrice}
                onChange={(e) => updateProduct(product.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.downPayment')}</label>
              <input
                type="number"
                value={data.downPayment}
                onChange={(e) => updateProduct(product.id, 'downPayment', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.mortgageAmount')}</label>
              <input
                type="number"
                value={data.mortgageAmount}
                onChange={(e) => updateProduct(product.id, 'mortgageAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.monthlyPayment')}</label>
              <input
                type="number"
                value={data.monthlyPayment}
                onChange={(e) => updateProduct(product.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.mortgageStartAge')}</label>
              <input
                type="number"
                value={data.mortgageStartAge}
                onChange={(e) => updateProduct(product.id, 'mortgageStartAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.sellAge')}</label>
              <select
                value={data.sellAge}
                onChange={(e) => updateProduct(product.id, 'sellAge', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="willNotSell">{t('productCard.willNotSell')}</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
                <option value="80">80</option>
                <option value="85">85</option>
                <option value="90">90</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.currentSituation')}</label>
              <select
                value={data.currentSituation}
                onChange={(e) => updateProduct(product.id, 'currentSituation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="selfOccupied">{t('productCard.selfOccupied')}</option>
                <option value="rented">{t('productCard.rented')}</option>
              </select>
            </div>
            {data.currentSituation === 'rented' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.monthlyRent')}</label>
                  <input
                    type="number"
                    value={data.monthlyRent}
                    onChange={(e) => updateProduct(product.id, 'monthlyRent', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.rentStartAge')}</label>
                  <input
                    type="number"
                    value={data.rentStartAge}
                    onChange={(e) => updateProduct(product.id, 'rentStartAge', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'renting':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.monthlyRentExpense')}</label>
              <input
                type="number"
                value={data.monthlyRentExpense}
                onChange={(e) => updateProduct(product.id, 'monthlyRentExpense', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startAge')}</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.rentalIncrement')}</label>
              <input
                type="number"
                value={data.rentalIncrement}
                onChange={(e) => updateProduct(product.id, 'rentalIncrement', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.expectedEndAge')}</label>
              <input
                type="number"
                value={data.expectedEndAge}
                onChange={(e) => updateProduct(product.id, 'expectedEndAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        );



      default:
        return <div>{t('productCard.unknownProductType')}</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getProductIcon(product.subType)}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">{getProductName(product.subType)}</h3>
              <p className="text-blue-100 text-sm">{t('productCard.productNumber')}{product.id}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => duplicateProduct(product.id)}
              className="text-white hover:text-blue-200 transition-colors"
              title={t('productCard.copyProduct')}
            >
              📋
            </button>
            <button
              onClick={() => removeProduct(product.id)}
              className="text-white hover:text-red-200 transition-colors"
              title={t('productCard.deleteProduct')}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6">
        {renderFormFields()}
      </div>

      {/* Summary */}
      {product.summary && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">📊</span>
              <p className="text-sm font-medium text-gray-700 whitespace-pre-line">{product.summary}</p>
            </div>
            <button
              onClick={() => handleInfoClick(product.subType, product.data)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title={t('productCard.viewFormula')}
            >
              ℹ️
            </button>
          </div>
        </div>
      )}

      {/* Info Dialog */}
      {showInfoDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{infoContent.title}</h3>
              <button
                onClick={() => setShowInfoDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('productCard.calculationFormula')}：</h4>
                <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-line font-mono">
                  {infoContent.formula}
                </pre>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('productCard.explanation')}：</h4>
                <p className="text-sm text-gray-600">{infoContent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 
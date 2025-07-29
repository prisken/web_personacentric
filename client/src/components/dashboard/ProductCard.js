import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const ProductCard = ({ product, updateProduct, removeProduct, duplicateProduct }) => {
  const { t } = useTranslation();
  
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.expectedAnnualReturn')}</label>
              <input
                type="number"
                value={data.expectedAnnualReturn}
                onChange={(e) => updateProduct(product.id, 'expectedAnnualReturn', parseFloat(e.target.value) || 0)}
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
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">📊</span>
            <p className="text-sm font-medium text-gray-700">{product.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 
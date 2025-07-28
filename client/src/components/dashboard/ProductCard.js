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
      renting: '🏢',
      owner: '🏘️'
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
      renting: t('financialPlanning.renting'),
      owner: t('financialPlanning.ownerToRentOut')
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.fundAllocation')}</label>
              <select
                value={data.fundAllocation}
                onChange={(e) => updateProduct(product.id, 'fundAllocation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="growth">{t('productCard.growth')}</option>
                <option value="dividends">{t('productCard.dividends')}</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.planName')}</label>
              <input
                type="text"
                value={data.planName}
                onChange={(e) => updateProduct(product.id, 'planName', e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.contributionDuration')}</label>
              <input
                type="number"
                value={data.contributionDuration}
                onChange={(e) => updateProduct(product.id, 'contributionDuration', parseInt(e.target.value) || 0)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.duration')}</label>
              <input
                type="number"
                value={data.duration}
                onChange={(e) => updateProduct(product.id, 'duration', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.durationType')}</label>
              <select
                value={data.durationType}
                onChange={(e) => updateProduct(product.id, 'durationType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="years">{t('productCard.years')}</option>
                <option value="months">{t('productCard.months')}</option>
              </select>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.withdrawalAge')}</label>
              <input
                type="number"
                value={data.withdrawalAge}
                onChange={(e) => updateProduct(product.id, 'withdrawalAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.frequency')}</label>
              <select
                value={data.frequency}
                onChange={(e) => updateProduct(product.id, 'frequency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="monthly">{t('productCard.monthly')}</option>
                <option value="quarterly">{t('productCard.quarterly')}</option>
                <option value="yearly">{t('productCard.yearly')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.startDate')}</label>
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => updateProduct(product.id, 'startDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.targetRetirementAge')}</label>
              <input
                type="number"
                value={data.targetRetirementAge}
                onChange={(e) => updateProduct(product.id, 'targetRetirementAge', parseInt(e.target.value) || 0)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.type')}</label>
              <select
                value={data.type}
                onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Apartment">{t('productCard.apartment')}</option>
                <option value="House">{t('productCard.house')}</option>
                <option value="Condo">{t('productCard.condo')}</option>
              </select>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.purchaseAge')}</label>
              <input
                type="number"
                value={data.purchaseAge}
                onChange={(e) => updateProduct(product.id, 'purchaseAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        );

      case 'renting':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.type')}</label>
              <select
                value={data.type}
                onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Apartment">{t('productCard.apartment')}</option>
                <option value="House">{t('productCard.house')}</option>
                <option value="Condo">{t('productCard.condo')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.rentalExpenses')}</label>
              <input
                type="number"
                value={data.rentalExpenses}
                onChange={(e) => updateProduct(product.id, 'rentalExpenses', parseFloat(e.target.value) || 0)}
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

      case 'owner':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.type')}</label>
              <select
                value={data.type}
                onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Apartment">{t('productCard.apartment')}</option>
                <option value="House">{t('productCard.house')}</option>
                <option value="Land">{t('productCard.land')}</option>
              </select>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.currentValue')}</label>
              <input
                type="number"
                value={data.currentValue}
                onChange={(e) => updateProduct(product.id, 'currentValue', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.status')}</label>
              <select
                value={data.status}
                onChange={(e) => updateProduct(product.id, 'status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="renting">{t('productCard.renting')}</option>
                <option value="vacant">{t('productCard.vacant')}</option>
              </select>
            </div>
            {data.status === 'renting' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.rentAmount')}</label>
                  <input
                    type="number"
                    value={data.rentAmount}
                    onChange={(e) => updateProduct(product.id, 'rentAmount', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.rentIncrement')}</label>
                  <input
                    type="number"
                    value={data.rentIncrement}
                    onChange={(e) => updateProduct(product.id, 'rentIncrement', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.ownershipStartAge')}</label>
              <input
                type="number"
                value={data.ownershipStartAge}
                onChange={(e) => updateProduct(product.id, 'ownershipStartAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('productCard.ownershipEndAge')}</label>
              <input
                type="number"
                value={data.ownershipEndAge}
                onChange={(e) => updateProduct(product.id, 'ownershipEndAge', parseInt(e.target.value) || 0)}
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
import React from 'react';

const ProductCard = ({ product, updateProduct, removeProduct, duplicateProduct }) => {
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
      funds: '基金',
      mpf: '強積金',
      saving_plans: '儲蓄計劃',
      bank: '銀行',
      retirement_funds: '退休基金',
      own_living: '自住',
      renting: '租賃',
      owner: '出租'
    };
    return names[subType] || '產品';
  };

  const renderFormFields = () => {
    const { subType, data } = product;

    switch (subType) {
      case 'funds':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">基金配置</label>
              <select
                value={data.fundAllocation}
                onChange={(e) => updateProduct(product.id, 'fundAllocation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="growth">增長型</option>
                <option value="dividends">股息型</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">投資金額 (HKD)</label>
              <input
                type="number"
                value={data.investmentAmount}
                onChange={(e) => updateProduct(product.id, 'investmentAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始年齡</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">預期回報 (%)</label>
              <input
                type="number"
                value={data.expectedReturn}
                onChange={(e) => updateProduct(product.id, 'expectedReturn', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">預期提取年齡</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">月薪 (HKD)</label>
              <input
                type="number"
                value={data.monthlySalary}
                onChange={(e) => updateProduct(product.id, 'monthlySalary', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年薪增幅 (%)</label>
              <input
                type="number"
                value={data.salaryIncrement}
                onChange={(e) => updateProduct(product.id, 'salaryIncrement', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">僱主供款 (%)</label>
              <input
                type="number"
                value={data.employerContribution}
                onChange={(e) => updateProduct(product.id, 'employerContribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">僱員供款 (%)</label>
              <input
                type="number"
                value={data.employeeContribution}
                onChange={(e) => updateProduct(product.id, 'employeeContribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">當前年齡</label>
              <input
                type="number"
                value={data.currentAge}
                onChange={(e) => updateProduct(product.id, 'currentAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">預期回報 (%)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">計劃名稱</label>
              <input
                type="text"
                value={data.planName}
                onChange={(e) => updateProduct(product.id, 'planName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">供款金額</label>
              <input
                type="number"
                value={data.contribution}
                onChange={(e) => updateProduct(product.id, 'contribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">供款頻率</label>
              <select
                value={data.contributionType}
                onChange={(e) => updateProduct(product.id, 'contributionType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="monthly">每月</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">供款年期</label>
              <input
                type="number"
                value={data.contributionDuration}
                onChange={(e) => updateProduct(product.id, 'contributionDuration', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始年齡</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">退保年齡</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">計劃類型</label>
              <select
                value={data.planType}
                onChange={(e) => updateProduct(product.id, 'planType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="saving">儲蓄</option>
                <option value="fixed_deposit">定期存款</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">供款金額</label>
              <input
                type="number"
                value={data.contribution}
                onChange={(e) => updateProduct(product.id, 'contribution', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">供款頻率</label>
              <select
                value={data.contributionType}
                onChange={(e) => updateProduct(product.id, 'contributionType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="monthly">每月</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年期</label>
              <input
                type="number"
                value={data.duration}
                onChange={(e) => updateProduct(product.id, 'duration', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年期單位</label>
              <select
                value={data.durationType}
                onChange={(e) => updateProduct(product.id, 'durationType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="years">年</option>
                <option value="months">月</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">利率 (%)</label>
              <input
                type="number"
                value={data.interestRate}
                onChange={(e) => updateProduct(product.id, 'interestRate', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始年齡</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">提取年齡</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">供款金額</label>
              <input
                type="number"
                value={data.contributionAmount}
                onChange={(e) => updateProduct(product.id, 'contributionAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">頻率</label>
              <select
                value={data.frequency}
                onChange={(e) => updateProduct(product.id, 'frequency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="monthly">每月</option>
                <option value="quarterly">每季</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始日期</label>
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => updateProduct(product.id, 'startDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目標退休年齡</label>
              <input
                type="number"
                value={data.targetRetirementAge}
                onChange={(e) => updateProduct(product.id, 'targetRetirementAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">預期回報 (%)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
              <select
                value={data.type}
                onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Apartment">公寓</option>
                <option value="House">獨立屋</option>
                <option value="Condo">共管公寓</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">購買價格 (HKD)</label>
              <input
                type="number"
                value={data.purchasePrice}
                onChange={(e) => updateProduct(product.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">首期 (HKD)</label>
              <input
                type="number"
                value={data.downPayment}
                onChange={(e) => updateProduct(product.id, 'downPayment', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">按揭金額 (HKD)</label>
              <input
                type="number"
                value={data.mortgageAmount}
                onChange={(e) => updateProduct(product.id, 'mortgageAmount', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月供 (HKD)</label>
              <input
                type="number"
                value={data.monthlyPayment}
                onChange={(e) => updateProduct(product.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">購買年齡</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
              <select
                value={data.type}
                onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Apartment">公寓</option>
                <option value="House">獨立屋</option>
                <option value="Condo">共管公寓</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">月租 (HKD)</label>
              <input
                type="number"
                value={data.rentalExpenses}
                onChange={(e) => updateProduct(product.id, 'rentalExpenses', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">開始租賃年齡</label>
              <input
                type="number"
                value={data.startAge}
                onChange={(e) => updateProduct(product.id, 'startAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">租金年增幅 (%)</label>
              <input
                type="number"
                value={data.rentalIncrement}
                onChange={(e) => updateProduct(product.id, 'rentalIncrement', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">預期結束年齡</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">類型</label>
              <select
                value={data.type}
                onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Apartment">公寓</option>
                <option value="House">獨立屋</option>
                <option value="Land">土地</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">購買價格 (HKD)</label>
              <input
                type="number"
                value={data.purchasePrice}
                onChange={(e) => updateProduct(product.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">現值 (HKD)</label>
              <input
                type="number"
                value={data.currentValue}
                onChange={(e) => updateProduct(product.id, 'currentValue', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
              <select
                value={data.status}
                onChange={(e) => updateProduct(product.id, 'status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="renting">出租中</option>
                <option value="vacant">空置</option>
              </select>
            </div>
            {data.status === 'renting' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月租 (HKD)</label>
                  <input
                    type="number"
                    value={data.rentAmount}
                    onChange={(e) => updateProduct(product.id, 'rentAmount', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">租金年增幅 (%)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">擁有開始年齡</label>
              <input
                type="number"
                value={data.ownershipStartAge}
                onChange={(e) => updateProduct(product.id, 'ownershipStartAge', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">擁有結束年齡</label>
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
        return <div>未知產品類型</div>;
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
              <p className="text-blue-100 text-sm">產品 #{product.id}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => duplicateProduct(product.id)}
              className="text-white hover:text-blue-200 transition-colors"
              title="複製產品"
            >
              📋
            </button>
            <button
              onClick={() => removeProduct(product.id)}
              className="text-white hover:text-red-200 transition-colors"
              title="刪除產品"
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
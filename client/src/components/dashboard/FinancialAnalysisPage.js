import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const FinancialAnalysisPage = ({
  products,
  retirementAge,
  setRetirementAge,
  inflationRate,
  setInflationRate,
  currentAssets,
  setCurrentAssets,
  expenses,
  setExpenses,
  analysisPeriod,
  setAnalysisPeriod,
  showFormula,
  setShowFormula
}) => {
  const [financialData, setFinancialData] = useState([]);
  const [selectedAge, setSelectedAge] = useState(65);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFormulaDialog, setShowFormulaDialog] = useState(false);
  const [currentFormula, setCurrentFormula] = useState({ title: '', formula: '', description: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const addExpense = () => {
    const newExpense = {
      id: Date.now(),
      fromAge: 65,
      toAge: 75,
      monthlyExpenses: 0
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (expenseId, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId ? { ...expense, [field]: value } : expense
    ));
  };

  const removeExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const calculateFinancialProjection = () => {
    setIsCalculating(true);
    
    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
      const data = [];
      const startYear = analysisPeriod.start;
      const endYear = analysisPeriod.end;

      for (let age = startYear; age <= endYear; age++) {
      const yearData = {
        age,
        totalMonthlyIncome: calculateTotalIncome(age),
        monthlyPassiveIncome: calculatePassiveIncome(age),
        totalExpenses: calculateTotalExpenses(age),
        netCashFlow: 0,
        totalAssets: calculateTotalAssets(age),
        totalLiabilities: calculateTotalLiabilities(age),
        netWorth: 0,
        assetAllocation: calculateAssetAllocation(age),
        cashReserve: 0,
        withdrawalRate: 0,
        probabilityOfOutliving: 'Low'
      };

      yearData.netCashFlow = yearData.totalMonthlyIncome - yearData.totalExpenses;
      yearData.netWorth = yearData.totalAssets - yearData.totalLiabilities;
      yearData.cashReserve = calculateCashReserve(yearData);
      yearData.withdrawalRate = calculateWithdrawalRate(yearData);
      yearData.probabilityOfOutliving = calculateOutlivingProbability(yearData, age);

      data.push(yearData);
    }

    setFinancialData(data);
    setIsCalculating(false);
    }, 100);
  };

  const calculateTotalIncome = (age) => {
    let income = 0;
    
    // Add salary income if not retired
    if (age < retirementAge) {
      income += 50000; // Default salary, should be configurable
    }

    // Add income from products
    products.forEach(product => {
      const { subType, data } = product;
      
      switch (subType) {
        case 'funds':
          if (age >= data.expectedWithdrawalAge) {
            const years = age - data.startAge;
            const totalValue = data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, years);
            income += totalValue * 0.04 / 12; // 4% annual withdrawal rate
          }
          break;
        case 'mpf':
          if (age >= 65) {
            const mpfYears = 65 - data.currentAge;
            const monthlyContribution = data.monthlySalary * (data.employerContribution + data.employeeContribution) / 100;
            const totalMPF = monthlyContribution * 12 * Math.pow(1 + data.expectedReturn / 100, mpfYears);
            income += totalMPF / 240; // Assume 20 years of withdrawal
          }
          break;
        case 'owner':
          if (age >= data.ownershipStartAge && age <= data.ownershipEndAge && data.status === 'renting') {
            const ownershipYears = age - data.ownershipStartAge;
            const rentIncome = data.rentAmount * Math.pow(1 + data.rentIncrement / 100, ownershipYears);
            income += rentIncome;
          }
          break;
      }
    });

    return income;
  };

  const calculatePassiveIncome = (age) => {
    let passiveIncome = 0;
    
    products.forEach(product => {
      const { subType, data } = product;
      
      switch (subType) {
        case 'funds':
          if (age >= data.expectedWithdrawalAge) {
            const years = age - data.startAge;
            const totalValue = data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, years);
            passiveIncome += totalValue * 0.04 / 12; // 4% annual withdrawal rate
          }
          break;
        case 'mpf':
          if (age >= 65) {
            const mpfYears = 65 - data.currentAge;
            const monthlyContribution = data.monthlySalary * (data.employerContribution + data.employeeContribution) / 100;
            const totalMPF = monthlyContribution * 12 * Math.pow(1 + data.expectedReturn / 100, mpfYears);
            passiveIncome += totalMPF / 240;
          }
          break;
        case 'owner':
          if (age >= data.ownershipStartAge && age <= data.ownershipEndAge && data.status === 'renting') {
            const ownershipYears = age - data.ownershipStartAge;
            const rentIncome = data.rentAmount * Math.pow(1 + data.rentIncrement / 100, ownershipYears);
            passiveIncome += rentIncome;
          }
          break;
      }
    });

    return passiveIncome;
  };

  const calculateTotalExpenses = (age) => {
    let totalExpenses = 0;
    
    expenses.forEach(expense => {
      if (age >= expense.fromAge && age <= expense.toAge) {
        const yearsSinceStart = age - expense.fromAge;
        const inflatedExpenses = expense.monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsSinceStart);
        totalExpenses += inflatedExpenses;
      }
    });

    return totalExpenses;
  };

  const calculateTotalAssets = (age) => {
    let assets = currentAssets;
    
    products.forEach(product => {
      const { subType, data } = product;
      
      switch (subType) {
        case 'funds':
          const fundYears = age - data.startAge;
          if (fundYears > 0) {
            assets += data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, fundYears); // Compound annual growth
          }
          break;
        case 'saving_plans':
          if (age >= data.surrenderAge) {
            const totalContribution = data.contribution * data.contributionDuration * (data.contributionType === 'monthly' ? 12 : 1);
            assets += totalContribution;
          }
          break;
        case 'bank':
          if (age >= data.withdrawalAge) {
            const totalContribution = data.contribution * data.duration * (data.contributionType === 'monthly' ? 12 : 1);
            const bankInterest = totalContribution * (data.interestRate / 100) * data.duration;
            assets += totalContribution + bankInterest;
          }
          break;
        case 'retirement_funds':
          const yearsToRetirement = data.targetRetirementAge - new Date(data.startDate).getFullYear();
          const frequencyMultiplier = data.frequency === 'monthly' ? 12 : data.frequency === 'quarterly' ? 4 : 1;
          const totalRetirementFunds = data.contributionAmount * frequencyMultiplier * yearsToRetirement;
          if (age >= data.targetRetirementAge) {
            assets += totalRetirementFunds;
          }
          break;
        case 'own_living':
          const mortgageYears = data.mortgageAmount / (data.monthlyPayment * 12);
          const paidUpAge = data.purchaseAge + mortgageYears;
          if (age >= paidUpAge) {
            assets += data.purchasePrice * Math.pow(1.03, age - data.purchaseAge); // 3% property appreciation
          }
          break;
        case 'owner':
          if (age >= data.ownershipStartAge && age <= data.ownershipEndAge) {
            assets += data.currentValue * Math.pow(1.03, age - data.ownershipStartAge);
          }
          break;
      }
    });

    return assets;
  };

  const calculateTotalLiabilities = (age) => {
    let liabilities = 0;
    
    products.forEach(product => {
      const { subType, data } = product;
      
      if (subType === 'own_living') {
        const mortgageYears = data.mortgageAmount / (data.monthlyPayment * 12);
        const paidUpAge = data.purchaseAge + mortgageYears;
        if (age < paidUpAge) {
          const remainingYears = paidUpAge - age;
          liabilities += data.monthlyPayment * 12 * remainingYears;
        }
      }
    });

    return liabilities;
  };

  const calculateAssetAllocation = (age) => {
    const allocation = {
      property: 0,
      cash: 0,
      investments: 0,
      other: 0
    };

    // This is a simplified calculation
    const totalAssets = calculateTotalAssets(age);
    if (totalAssets > 0) {
      allocation.property = 0.4; // 40% property
      allocation.cash = 0.2; // 20% cash
      allocation.investments = 0.35; // 35% investments
      allocation.other = 0.05; // 5% other
    }

    return allocation;
  };

  const calculateCashReserve = (yearData) => {
    if (yearData.totalExpenses > 0) {
      return yearData.totalAssets / yearData.totalExpenses;
    }
    return 0;
  };

  const calculateWithdrawalRate = (yearData) => {
    if (yearData.totalAssets > 0) {
      return (yearData.totalExpenses * 12 / yearData.totalAssets) * 100;
    }
    return 0;
  };

  const calculateOutlivingProbability = (yearData, age) => {
    if (yearData.cashReserve < 12) {
      return 'High';
    } else if (yearData.cashReserve < 24) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  const showFormulaInfo = (field) => {
    const formulas = {
      totalMonthlyIncome: {
        title: '總月收入計算公式',
        formula: '工作收入 + 投資收益 + 租金收入 + 其他被動收入',
        description: '包括所有收入來源：工作薪資（退休前）、基金提取、強積金、租金收入等'
      },
      monthlyPassiveIncome: {
        title: '月被動收入計算公式',
        formula: '投資收益 + 租金收入 + 退休金收入',
        description: '無需工作即可獲得的收入，包括投資分紅、租金、退休金等'
      },
      totalExpenses: {
        title: '月開支計算公式',
        formula: '基本開支 × (1 + 通脹率)^年數',
        description: '考慮通脹因素調整後的月開支，通脹率會逐年累積影響'
      },
      netCashFlow: {
        title: '淨現金流計算公式',
        formula: '總月收入 - 總月開支',
        description: '每月實際可支配的現金，正值表示有盈餘，負值表示需要動用儲蓄'
      },
      totalAssets: {
        title: '總資產計算公式',
        formula: '當前資產 + 投資增長 + 物業增值',
        description: '包括現金、投資組合、物業價值等所有資產的總和'
      },
      totalLiabilities: {
        title: '總負債計算公式',
        formula: '剩餘按揭 + 其他債務',
        description: '包括未償還的按揭貸款、個人貸款等所有債務'
      },
      netWorth: {
        title: '淨資產計算公式',
        formula: '總資產 - 總負債',
        description: '實際擁有的財富總額，是財務狀況的重要指標'
      },
      cashReserve: {
        title: '現金儲備計算公式',
        formula: '總資產 ÷ 月開支 (月數)',
        description: '在不增加收入的情況下，現有資產可以維持生活開支的月數'
      },
      withdrawalRate: {
        title: '提取率計算公式',
        formula: '(年開支 ÷ 總資產) × 100%',
        description: '每年從資產中提取的百分比，4%是常用的安全提取率'
      }
    };
    
    setCurrentFormula(formulas[field] || { title: '未知', formula: '無公式', description: '無描述' });
    setShowFormulaDialog(true);
  };

  useEffect(() => {
    calculateFinancialProjection();
  }, [products, retirementAge, inflationRate, currentAssets, expenses, analysisPeriod]);

  const chartData = {
    line: {
      labels: financialData.map(d => `${d.age}歲`),
      datasets: [
        {
          label: '淨資產',
          data: financialData.map(d => d.netWorth),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        },
        {
          label: '被動收入',
          data: financialData.map(d => d.monthlyPassiveIncome * 12),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1
        },
        {
          label: '年開支',
          data: financialData.map(d => d.totalExpenses * 12),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1
        }
      ]
    },
    pie: {
      labels: ['物業', '現金', '投資', '其他'],
      datasets: [{
        data: Object.values(calculateAssetAllocation(selectedAge)),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ]
      }]
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">財務分析設定</h2>
          <button
            onClick={calculateFinancialProjection}
            disabled={isCalculating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            {isCalculating ? '計算中...' : '🔄 重新計算'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">退休年齡</label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">通脹率 (%)</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value) || 2)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">當前資產 (HKD)</label>
            <input
              type="number"
              value={currentAssets}
              onChange={(e) => setCurrentAssets(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分析期間</label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={analysisPeriod.start}
                  onChange={(e) => setAnalysisPeriod({...analysisPeriod, start: parseInt(e.target.value) || 65})}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-2"
                  min="18"
                  max="120"
                />
                <span className="self-center">至</span>
                <input
                  type="number"
                  value={analysisPeriod.end}
                  onChange={(e) => setAnalysisPeriod({...analysisPeriod, end: parseInt(e.target.value) || 75})}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-2"
                  min="18"
                  max="120"
                />
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setAnalysisPeriod({start: 65, end: 75})}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                >
                  退休期
                </button>
                <button
                  onClick={() => setAnalysisPeriod({start: 60, end: 90})}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                >
                  長期
                </button>
                <button
                  onClick={() => setAnalysisPeriod({start: 30, end: 65})}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                >
                  工作期
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">開支設定</h2>
          <button
            onClick={addExpense}
            disabled={expenses.length >= 5}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            ➕ 添加開支階段
          </button>
        </div>
        
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">從年齡</label>
                  <input
                    type="number"
                    value={expense.fromAge}
                    onChange={(e) => updateExpense(expense.id, 'fromAge', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">至年齡</label>
                  <input
                    type="number"
                    value={expense.toAge}
                    onChange={(e) => updateExpense(expense.id, 'toAge', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月開支 (HKD)</label>
                  <input
                    type="number"
                    value={expense.monthlyExpenses}
                    onChange={(e) => updateExpense(expense.id, 'monthlyExpenses', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Analysis Results */}
      {isCalculating && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在計算財務分析結果...</p>
          </div>
        </div>
      )}

      {financialData.length > 0 && !isCalculating && (
        <div className="space-y-6">
          {/* Yearly Financial Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">年度財務狀況</h2>
              <div className="text-sm text-gray-500">
                分析期間: {analysisPeriod.start}歲 - {analysisPeriod.end}歲 ({analysisPeriod.end - analysisPeriod.start + 1}年)
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年齡</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>總月收入</span>
                        <button
                          onClick={() => showFormulaInfo('totalMonthlyIncome')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>被動收入</span>
                        <button
                          onClick={() => showFormulaInfo('monthlyPassiveIncome')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>月開支</span>
                        <button
                          onClick={() => showFormulaInfo('totalExpenses')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>淨現金流</span>
                        <button
                          onClick={() => showFormulaInfo('netCashFlow')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>淨資產</span>
                        <button
                          onClick={() => showFormulaInfo('netWorth')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>現金儲備</span>
                        <button
                          onClick={() => showFormulaInfo('cashReserve')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>提取率</span>
                        <button
                          onClick={() => showFormulaInfo('withdrawalRate')}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="查看計算公式"
                        >
                          ℹ️
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.map((data) => (
                    <tr key={data.age} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.age}歲</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.totalMonthlyIncome)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.monthlyPassiveIncome)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.totalExpenses)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${data.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.netCashFlow)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.netWorth)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.cashReserve.toFixed(1)} 個月</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.withdrawalRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">財務趨勢圖</h3>
              <Line data={chartData.line} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: '淨資產、被動收入與開支趨勢'
                  }
                }
              }} />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">資產配置</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">選擇年齡</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {financialData.map(data => (
                    <option key={data.age} value={data.age}>{data.age}歲</option>
                  ))}
                </select>
              </div>
              <Pie data={chartData.pie} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }} />
            </div>
          </div>
        </div>
      )}

      {financialData.length === 0 && !isCalculating && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">開始財務分析</h3>
            <p className="text-gray-500 mb-6">設定您的財務參數並點擊「重新計算」開始分析</p>
            <button
              onClick={calculateFinancialProjection}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              🚀 開始分析
            </button>
          </div>
        </div>
      )}

      {/* Formula Dialog */}
      {showFormulaDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{currentFormula.title}</h3>
                <button
                  onClick={() => setShowFormulaDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">計算公式：</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 font-mono text-sm">{currentFormula.formula}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">說明：</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{currentFormula.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAnalysisPage; 
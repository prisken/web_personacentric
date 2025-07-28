import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import ProductConfigurationPage from './ProductConfigurationPage';
import FinancialAnalysisPage from './FinancialAnalysisPage';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const FinancialPlanningTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [retirementAge, setRetirementAge] = useState(65);
  const [inflationRate, setInflationRate] = useState(2);
  const [currentAssets, setCurrentAssets] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [analysisPeriod, setAnalysisPeriod] = useState({ start: 65, end: 75 });
  const [showFormula, setShowFormula] = useState({});

  // Product types and their options
  const productTypes = {
    investment: [
      { id: 'funds', name: '基金', icon: '📈' },
      { id: 'mpf', name: '強積金', icon: '🏦' }
    ],
    saving: [
      { id: 'saving_plans', name: '儲蓄計劃', icon: '💰' },
      { id: 'bank', name: '銀行', icon: '🏛️' },
      { id: 'retirement_funds', name: '退休基金', icon: '🎯' }
    ],
    real_estate: [
      { id: 'own_living', name: '自住', icon: '🏠' },
      { id: 'renting', name: '租賃', icon: '🏢' },
      { id: 'owner', name: '出租', icon: '🏘️' }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const addProduct = (productType, productSubType) => {
    const newProduct = {
      id: Date.now(),
      type: productType,
      subType: productSubType,
      data: getDefaultProductData(productSubType),
      summary: ''
    };
    setProducts([...products, newProduct]);
    setShowCreateModal(false);
  };

  const getDefaultProductData = (subType) => {
    switch (subType) {
      case 'funds':
        return {
          fundAllocation: 'growth',
          investmentAmount: 0,
          startAge: 30,
          expectedReturn: 8,
          expectedWithdrawalAge: 65
        };
      case 'mpf':
        return {
          monthlySalary: 0,
          salaryIncrement: 3,
          employerContribution: 5,
          employeeContribution: 5,
          currentAge: 30,
          expectedReturn: 4
        };
      case 'saving_plans':
        return {
          planName: '',
          contribution: 0,
          contributionType: 'monthly',
          contributionDuration: 10,
          startAge: 30,
          surrenderAge: 40
        };
      case 'bank':
        return {
          planType: 'saving',
          contribution: 0,
          contributionType: 'monthly',
          duration: 10,
          durationType: 'years',
          interestRate: 2,
          startAge: 30,
          withdrawalAge: 40
        };
      case 'retirement_funds':
        return {
          contributionAmount: 0,
          frequency: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
          targetRetirementAge: 65,
          expectedReturn: 6
        };
      case 'own_living':
        return {
          type: 'Apartment',
          purchasePrice: 0,
          downPayment: 0,
          mortgageAmount: 0,
          monthlyPayment: 0,
          purchaseAge: 30
        };
      case 'renting':
        return {
          type: 'Apartment',
          rentalExpenses: 0,
          startAge: 30,
          rentalIncrement: 2,
          expectedEndAge: 65
        };
      case 'owner':
        return {
          type: 'Apartment',
          purchasePrice: 0,
          currentValue: 0,
          status: 'renting',
          rentAmount: 0,
          rentIncrement: 2,
          ownershipStartAge: 30,
          ownershipEndAge: 65
        };
      default:
        return {};
    }
  };

  const updateProduct = (productId, field, value) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const updatedData = { ...product.data, [field]: value };
        const summary = calculateProductSummary(product.subType, updatedData);
        return { ...product, data: updatedData, summary };
      }
      return product;
    }));
  };

  const calculateProductSummary = (subType, data) => {
    switch (subType) {
      case 'funds':
        const years = data.expectedWithdrawalAge - data.startAge;
        const totalValue = data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, years);
        const totalDividend = totalValue - data.investmentAmount;
        return `預計總收益: ${formatCurrency(totalDividend)} (總值: ${formatCurrency(totalValue)})`;
      case 'mpf':
        const mpfYears = 65 - data.currentAge;
        const monthlyContribution = data.monthlySalary * (data.employerContribution + data.employeeContribution) / 100;
        const totalMPF = monthlyContribution * 12 * Math.pow(1 + data.expectedReturn / 100, mpfYears);
        return `65歲時強積金總額: ${formatCurrency(totalMPF)}`;
      case 'saving_plans':
        const totalContribution = data.contribution * data.contributionDuration * (data.contributionType === 'monthly' ? 12 : 1);
        return `退保時總額: ${formatCurrency(totalContribution)}`;
      case 'bank':
        const totalBankContribution = data.contribution * data.duration * (data.contributionType === 'monthly' ? 12 : 1);
        const bankInterest = totalBankContribution * (data.interestRate / 100) * data.duration;
        return `提取時總額: ${formatCurrency(totalBankContribution + bankInterest)}`;
      case 'retirement_funds':
        const yearsToRetirement = data.targetRetirementAge - new Date(data.startDate).getFullYear();
        const frequencyMultiplier = data.frequency === 'monthly' ? 12 : data.frequency === 'quarterly' ? 4 : 1;
        const totalRetirementFunds = data.contributionAmount * frequencyMultiplier * yearsToRetirement;
        return `退休時總額: ${formatCurrency(totalRetirementFunds)}`;
      case 'own_living':
        const mortgageYears = data.mortgageAmount / (data.monthlyPayment * 12);
        const paidUpAge = data.purchaseAge + mortgageYears;
        return `供完樓年齡: ${Math.round(paidUpAge)}歲`;
      case 'renting':
        const rentalYears = data.expectedEndAge - data.startAge;
        const totalRent = data.rentalExpenses * 12 * rentalYears;
        return `總租金支出: ${formatCurrency(totalRent)}`;
      case 'owner':
        const ownershipYears = data.ownershipEndAge - data.ownershipStartAge;
        const totalRentIncome = data.rentAmount * 12 * ownershipYears;
        return `總租金收入: ${formatCurrency(totalRentIncome)}`;
      default:
        return '';
    }
  };

  const removeProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const duplicateProduct = (productId) => {
    const productToDuplicate = products.find(product => product.id === productId);
    if (productToDuplicate) {
      const duplicatedProduct = {
        ...productToDuplicate,
        id: Date.now(),
        data: { ...productToDuplicate.data }
      };
      setProducts([...products, duplicatedProduct]);
    }
  };

  const saveCurrentUser = () => {
    const userData = {
      id: currentUser || Date.now(),
      name: `用戶 ${currentUser || Date.now()}`,
      products,
      retirementAge,
      inflationRate,
      currentAssets,
      expenses,
      analysisPeriod,
      savedAt: new Date().toISOString()
    };

    const updatedUsers = savedUsers.filter(user => user.id !== userData.id);
    setSavedUsers([...updatedUsers, userData]);
    setCurrentUser(userData.id);
    localStorage.setItem('financialPlanningUsers', JSON.stringify([...updatedUsers, userData]));
  };

  const loadUser = (userData) => {
    setCurrentUser(userData.id);
    setProducts(userData.products || []);
    setRetirementAge(userData.retirementAge || 65);
    setInflationRate(userData.inflationRate || 2);
    setCurrentAssets(userData.currentAssets || 0);
    setExpenses(userData.expenses || []);
    setAnalysisPeriod(userData.analysisPeriod || { start: 65, end: 75 });
    setShowLoadModal(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('financialPlanningUsers');
    if (saved) {
      setSavedUsers(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setCurrentPage(1)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentPage === 1
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          產品配置
        </button>
        <button
          onClick={() => setCurrentPage(2)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentPage === 2
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          財務分析
        </button>
      </div>

      {currentPage === 1 ? (
        <ProductConfigurationPage
          products={products}
          productTypes={productTypes}
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          showLoadModal={showLoadModal}
          setShowLoadModal={setShowLoadModal}
          savedUsers={savedUsers}
          addProduct={addProduct}
          updateProduct={updateProduct}
          removeProduct={removeProduct}
          duplicateProduct={duplicateProduct}
          saveCurrentUser={saveCurrentUser}
          loadUser={loadUser}
          currentUser={currentUser}
        />
      ) : (
        <FinancialAnalysisPage
          products={products}
          retirementAge={retirementAge}
          setRetirementAge={setRetirementAge}
          inflationRate={inflationRate}
          setInflationRate={setInflationRate}
          currentAssets={currentAssets}
          setCurrentAssets={setCurrentAssets}
          expenses={expenses}
          setExpenses={setExpenses}
          analysisPeriod={analysisPeriod}
          setAnalysisPeriod={setAnalysisPeriod}
          showFormula={showFormula}
          setShowFormula={setShowFormula}
        />
      )}
    </div>
  );
};

export default FinancialPlanningTab; 
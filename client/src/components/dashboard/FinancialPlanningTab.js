import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { useTranslation } from '../../contexts/LanguageContext';
import ProductConfigurationPage from './ProductConfigurationPage';
import FinancialAnalysisPage from './FinancialAnalysisPage';
import FinancialPlanningPDFReport from './FinancialPlanningPDFReport';
import RecommendationsEditor from './RecommendationsEditor';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const FinancialPlanningTab = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [clientName, setClientName] = useState('');
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
  const [showPDFReport, setShowPDFReport] = useState(false);
  const [showRecommendationsEditor, setShowRecommendationsEditor] = useState(false);
  const [financialData, setFinancialData] = useState([]);
  const [recommendations, setRecommendations] = useState([
    '定期檢視和調整您的投資組合以符合市場變化',
    '考慮增加退休儲蓄以確保退休後的生活品質',
    '多元化投資以分散風險並提高回報潛力',
    '定期與財務顧問會面以檢討和優化您的財務計劃'
  ]);

  // Product types and their options
  const productTypes = {
    investment: [
      { id: 'funds', name: t('financialPlanning.funds'), icon: '📈' },
      { id: 'mpf', name: t('financialPlanning.mpf'), icon: '🏦' }
    ],
    saving: [
      { id: 'saving_plans', name: t('financialPlanning.savingPlans'), icon: '💰' },
      { id: 'bank', name: t('financialPlanning.bank'), icon: '🏛️' },
      { id: 'retirement_funds', name: t('financialPlanning.retirementFunds'), icon: '🎯' }
    ],
    real_estate: [
      { id: 'own_living', name: t('financialPlanning.ownLiving'), icon: '🏠' },
      { id: 'rental', name: t('financialPlanning.renting'), icon: '🏢' }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  // Helper function to calculate MPF with proper compound interest
  const calculateMPF = (data) => {
    const mpfYears = 65 - data.currentAge;
    
    // Compound the current MPF amount for the full period
    const currentMPFCompounded = data.currentMPFAmount * Math.pow(1 + data.expectedReturn / 100, mpfYears);
    
    // Calculate future contributions with proper compound interest and salary increments
    // Each monthly contribution compounds for different periods
    let futureContributionsCompounded = 0;
    let totalContributions = 0;
    
    for (let year = 0; year < mpfYears; year++) {
      // Calculate salary for this year with increment
      const currentYearSalary = data.monthlySalary * Math.pow(1 + data.salaryIncrement / 100, year);
      
      for (let month = 0; month < 12; month++) {
        const monthsRemaining = (mpfYears - year) * 12 - month;
        
        // Calculate MPF contribution for this month based on salary
        let monthlyContribution = 0;
        
        if (currentYearSalary >= 7100) {
          // Calculate employer contribution
          let employerContribution = 0;
          if (currentYearSalary >= 30000) {
            employerContribution = 1500; // Cap at 1,500
          } else {
            employerContribution = currentYearSalary * (data.employerContribution / 100);
          }
          
          // Calculate employee contribution
          let employeeContribution = 0;
          if (currentYearSalary >= 30000) {
            employeeContribution = 1500; // Cap at 1,500
          } else {
            employeeContribution = currentYearSalary * (data.employeeContribution / 100);
          }
          
          monthlyContribution = employerContribution + employeeContribution;
        }
        
        const contributionCompounded = monthlyContribution * Math.pow(1 + data.expectedReturn / 100, monthsRemaining / 12);
        futureContributionsCompounded += contributionCompounded;
        totalContributions += monthlyContribution;
      }
    }
    
    const totalMPF = currentMPFCompounded + futureContributionsCompounded;
    const mpfWithoutDividends = data.currentMPFAmount + totalContributions;
    const mpfTotalDividendsEarned = totalMPF - mpfWithoutDividends;
    
    return {
      totalMPF,
      mpfWithoutDividends,
      mpfTotalDividendsEarned
    };
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
          fundCategory: 'growth',
          investmentAmount: 0,
          startAge: 30,
          expectedReturn: 8,
          expectedWithdrawalAge: 65
        };
      case 'mpf':
        return {
          currentMPFAmount: 0,
          monthlySalary: 0,
          salaryIncrement: 3,
          employerContribution: 5,
          employeeContribution: 5,
          currentAge: 30,
          expectedReturn: 4
        };
      case 'saving_plans':
        return {
          contribution: 0,
          contributionType: 'monthly',
          contributionPeriod: 10,
          breakEvenPeriod: 5,
          withdrawalAmount: 0,
          withdrawalPeriod: '65-70',
          surrenderValue: 0,
          startAge: 30,
          surrenderAge: 40
        };
      case 'bank':
        return {
          planType: 'saving',
          existingAmount: 0,
          contribution: 0,
          contributionFrequency: 'monthly',
          contributionPeriod: 10,
          interestRate: 2,
          startAge: 30,
          alreadyOwned: 'N',
          lockInPeriod: 12
        };
      case 'retirement_funds':
        return {
          contributionAmount: 1000000, // Premium amount
          contributionFrequency: 'oneTime', // Annuity is typically one-time premium
          startAge: 60, // Premium age
          completionAge: 65, // Annuity start age
          expectedReturn: 4, // Internal rate of return
          gender: 'male', // Gender affects monthly payout
          lifeExpectancy: 86, // Life expectancy for IRR calculation
          guaranteedPeriod: 10, // Guaranteed payment period
          annuityType: 'immediate' // Immediate or deferred annuity
        };
      case 'own_living':
        return {
          purchasePrice: 5000000,
          downPayment: 30, // Changed to percentage
          mortgageInterestRate: 3, // Added mortgage interest rate field
          mortgageStartAge: 30,
          sellAge: 'willNotSell',
          currentSituation: 'selfOccupied',
          monthlyRent: 0,
          rentStartAge: 30
        };
      case 'rental':
        return {
          monthlyRentExpense: 15000,
          leaseStartAge: 30, // Changed from startAge to leaseStartAge
          rentIncreaseRate: 3, // Added rent increase rate
          expectedEndAge: 65
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
        if (data.fundCategory === 'growth') {
          // 增長基金：複式計算，總回報包含本金和收益
          const totalValue = data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, years);
          return `${t('productCard.totalReturn')}: ${formatCurrency(totalValue)}`;
        } else {
          // 派息基金：單利計算，每月派息
          const monthlyDividend = data.investmentAmount * (data.expectedReturn / 100) / 12;
          const yearlyDividend = monthlyDividend * 12;
          const totalDividends = yearlyDividend * years;
          return `${t('productCard.monthlyDividends')}: ${formatCurrency(monthlyDividend)}\n${t('productCard.totalDividends')}: ${formatCurrency(totalDividends)}`;
        }
      case 'mpf':
        const mpfResult = calculateMPF(data);
        return `${t('productCard.mpfAt65')}: ${formatCurrency(mpfResult.totalMPF)}\n${t('productCard.totalDividendsEarned')}: ${formatCurrency(mpfResult.mpfTotalDividendsEarned)}`;
      case 'saving_plans':
        const savingTotalContribution = data.contribution * data.contributionPeriod * (data.contributionType === 'monthly' ? 12 : 1);
        const savingTotalDividendsEarned = data.surrenderValue - savingTotalContribution + data.withdrawalAmount;
        
        // Calculate expected annual return
        const investmentPeriod = data.surrenderAge - data.startAge;
        const expectedAnnualReturn = investmentPeriod > 0 ? (savingTotalDividendsEarned / savingTotalContribution) / investmentPeriod * 100 : 0;
        
        return `${t('productCard.surrenderValue')}: ${formatCurrency(data.surrenderValue)}\n${t('productCard.totalDividendsEarned')}: ${formatCurrency(savingTotalDividendsEarned)}\n${t('productCard.expectedAnnualReturn')}: ${expectedAnnualReturn.toFixed(2)}%`;
      case 'bank':
        if (data.planType === 'saving') {
          const totalSavings = data.existingAmount + (data.contribution * data.contributionPeriod * (data.contributionFrequency === 'monthly' ? 12 : 1));
          const interest = totalSavings * (data.interestRate / 100) * data.contributionPeriod;
          return `${t('productCard.totalSavings')}: ${formatCurrency(totalSavings + interest)}`;
        } else {
          const totalAmount = data.contribution * Math.pow(1 + data.interestRate / 100, data.lockInPeriod / 12);
          return `${t('productCard.totalAmount')}: ${formatCurrency(totalAmount)}`;
        }
      case 'retirement_funds':
        // Hong Kong Annuity Plan calculation
        const premium = data.contributionAmount;
        const premiumAge = data.startAge;
        const annuityStartAge = data.completionAge;
        const gender = data.gender || 'male';
        const lifeExpectancy = data.lifeExpectancy || 86;
        
        // Base rates per $1,000,000 premium at age 60 (Hong Kong Annuity Plan rates)
        const baseRateMale = 5100; // $5,100 per month for male
        const baseRateFemale = 4700; // $4,700 per month for female
        
        // Age adjustment factor (simplified - older age gets higher monthly payout)
        const ageAdjustment = Math.pow(1.05, annuityStartAge - 60);
        
        // Gender factor
        const genderFactor = gender === 'male' ? baseRateMale : baseRateFemale;
        
        // Calculate monthly annuity
        const monthlyAnnuity = (premium / 1000000) * genderFactor * ageAdjustment;
        
        // Calculate total payments over life expectancy
        const totalPayments = monthlyAnnuity * 12 * (lifeExpectancy - annuityStartAge);
        
        // Calculate internal rate of return
        const annuityYears = lifeExpectancy - annuityStartAge;
        const irr = annuityYears > 0 ? (Math.pow(totalPayments / premium, 1/annuityYears) - 1) * 100 : 0;
        
        return `${t('productCard.monthlyReturn')}: ${formatCurrency(monthlyAnnuity)}\n${t('productCard.totalPayments')}: ${formatCurrency(totalPayments)}\n${t('productCard.internalRateOfReturn')}: ${irr.toFixed(2)}%`;
      case 'own_living':
        // Calculate mortgage amount and monthly payment based on down payment percentage
        const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
        const mortgageAmount = data.purchasePrice - downPaymentAmount;
        
        // Assume 30-year mortgage term and 3% interest rate for calculation
        const mortgageTerm = 30;
        const interestRate = data.mortgageInterestRate / 100; // Use the input interest rate
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = mortgageTerm * 12;
        
        // Calculate monthly payment using mortgage formula
        const monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        
        const mortgageYears = mortgageTerm;
        const mortgageCompletionAge = data.mortgageStartAge + mortgageYears;
        
        const propertyValue = data.sellAge === 'willNotSell' ? 0 : data.purchasePrice * Math.pow(1.03, parseInt(data.sellAge) - data.mortgageStartAge); // 假設3%年增長
        return `${t('productCard.monthlyPayment')}: ${formatCurrency(monthlyPayment)}\n${t('productCard.mortgageCompletionAge')}: ${Math.round(mortgageCompletionAge)}歲`;
      case 'rental':
        const rentalYears = data.expectedEndAge - data.leaseStartAge;
        // Calculate total rent with annual increase
        let totalRent = 0;
        for (let year = 0; year < rentalYears; year++) {
          const annualRent = data.monthlyRentExpense * 12 * Math.pow(1 + data.rentIncreaseRate / 100, year);
          totalRent += annualRent;
        }
        return `${t('productCard.totalRentPaid')}: ${formatCurrency(totalRent)}`;
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
      name: clientName || `用戶 ${currentUser || Date.now()}`,
      clientName: clientName,
      products,
      retirementAge,
      inflationRate,
      currentAssets,
      expenses,
      analysisPeriod,
      recommendations,
      savedAt: new Date().toISOString()
    };

    const updatedUsers = savedUsers.filter(user => user.id !== userData.id);
    setSavedUsers([...updatedUsers, userData]);
    setCurrentUser(userData.id);
    localStorage.setItem('financialPlanningUsers', JSON.stringify([...updatedUsers, userData]));
  };

  const loadUser = (userData) => {
    setCurrentUser(userData.id);
    setClientName(userData.clientName || '');
    setProducts(userData.products || []);
    setRetirementAge(userData.retirementAge || 65);
    setInflationRate(userData.inflationRate || 2);
    setCurrentAssets(userData.currentAssets || 0);
    setExpenses(userData.expenses || []);
    setAnalysisPeriod(userData.analysisPeriod || { start: 65, end: 75 });
    setRecommendations(userData.recommendations || [
      '定期檢視和調整您的投資組合以符合市場變化',
      '考慮增加退休儲蓄以確保退休後的生活品質',
      '多元化投資以分散風險並提高回報潛力',
      '定期與財務顧問會面以檢討和優化您的財務計劃'
    ]);
    setShowLoadModal(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('financialPlanningUsers');
    if (saved) {
      setSavedUsers(JSON.parse(saved));
    }
  }, []);

  const handleFinancialDataUpdate = (data) => {
    setFinancialData(data);
  };

  return (
    <div className="space-y-6">
      {/* Client Name */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('financialPlanning.clientName')}
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={t('financialPlanning.enterClientName')}
              className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowRecommendationsEditor(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              ✏️ {t('financialPlanning.editRecommendationsButton')}
            </button>
          </div>
        </div>
      </div>

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
          {t('financialPlanning.page1')}
        </button>
        <button
          onClick={() => setCurrentPage(2)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            currentPage === 2
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {t('financialPlanning.page2')}
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
          onFinancialDataUpdate={handleFinancialDataUpdate}
          clientName={clientName}
          recommendations={recommendations}
          onShowPDFReport={() => setShowPDFReport(true)}
        />
      )}

      {/* PDF Report Modal */}
      <FinancialPlanningPDFReport
        clientName={clientName}
        products={products}
        retirementAge={retirementAge}
        inflationRate={inflationRate}
        currentAssets={currentAssets}
        expenses={expenses}
        analysisPeriod={analysisPeriod}
        financialData={financialData}
        recommendations={recommendations}
        isVisible={showPDFReport}
        onClose={() => setShowPDFReport(false)}
      />

      {/* Recommendations Editor Modal */}
      <RecommendationsEditor
        recommendations={recommendations}
        onRecommendationsChange={setRecommendations}
        isVisible={showRecommendationsEditor}
        onClose={() => setShowRecommendationsEditor(false)}
      />
    </div>
  );
};

export default FinancialPlanningTab; 
import React, { useRef, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FinancialPlanningPDFReport = ({
  clientName,
  products,
  retirementAge,
  inflationRate,
  currentAssets,
  expenses,
  analysisPeriod,
  financialData,
  recommendations,
  isVisible,
  onClose
}) => {
  const { t } = useTranslation();
  const reportRef = useRef(null);

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

  const formatDate = () => {
    return new Date().toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${clientName || 'Client'}_Financial_Planning_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  const calculateAssetAllocation = (age) => {
    const allocation = {
      property: 0,
      cash: 0,
      investments: 0,
      other: 0
    };

    products.forEach(product => {
      const productValue = calculateProductValueAtAge(product, age);
      
      switch (product.subType) {
        case 'funds':
        case 'mpf':
          allocation.investments += productValue;
          break;
        case 'saving_plans':
        case 'bank':
        case 'retirement_funds':
          allocation.cash += productValue;
          break;
        case 'own_living':
        case 'renting':
        case 'owner_to_rent_out':
          allocation.property += productValue;
          break;
        default:
          allocation.other += productValue;
      }
    });

    allocation.cash += currentAssets;
    const total = allocation.property + allocation.cash + allocation.investments + allocation.other;
    
    if (total > 0) {
      allocation.property = (allocation.property / total) * 100;
      allocation.cash = (allocation.cash / total) * 100;
      allocation.investments = (allocation.investments / total) * 100;
      allocation.other = (allocation.other / total) * 100;
    }

    return allocation;
  };

  const calculateProductValueAtAge = (product, age) => {
    const data = product.data;
    
    switch (product.subType) {
      case 'funds':
        const fundYears = data.expectedWithdrawalAge - data.startAge;
        const fundValue = data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, fundYears);
        const yearsFromStart = age - data.startAge;
        if (yearsFromStart <= 0) return 0;
        if (yearsFromStart >= fundYears) return fundValue;
        return data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, yearsFromStart);
        
      case 'mpf':
        const mpfYears = 65 - data.currentAge;
        // Calculate value at specific age
        const yearsFromCurrent = age - data.currentAge;
        if (yearsFromCurrent <= 0) return 0;
        if (yearsFromCurrent >= mpfYears) {
          const mpfResult = calculateMPF(data);
          return mpfResult.totalMPF;
        }
        // For intermediate ages, calculate partial MPF value with salary increments and caps
        const currentMPFCompounded = data.currentMPFAmount * Math.pow(1 + data.expectedReturn / 100, yearsFromCurrent);
        let futureContributionsCompounded = 0;
        
        for (let year = 0; year < yearsFromCurrent; year++) {
          // Calculate salary for this year with increment
          const currentYearSalary = data.monthlySalary * Math.pow(1 + data.salaryIncrement / 100, year);
          
          for (let month = 0; month < 12; month++) {
            const monthsRemaining = (yearsFromCurrent - year) * 12 - month;
            
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
          }
        }
        return currentMPFCompounded + futureContributionsCompounded;
        
      case 'saving_plans':
        const savingYears = data.surrenderAge - data.startAge;
        const yearsFromSavingStart = age - data.startAge;
        if (yearsFromSavingStart <= 0) return 0;
        if (yearsFromSavingStart >= savingYears) return data.surrenderValue;
        // For intermediate ages, calculate proportional value
        const totalContribution = data.contribution * data.contributionPeriod * (data.contributionType === 'monthly' ? 12 : 1);
        const proportion = yearsFromSavingStart / savingYears;
        return totalContribution * proportion;
        
      case 'bank':
        const bankYears = data.withdrawalAge - data.startAge;
        const bankValue = data.contribution * 12 * bankYears * (1 + data.interestRate / 100);
        const yearsFromBankStart = age - data.startAge;
        if (yearsFromBankStart <= 0) return 0;
        if (yearsFromBankStart >= bankYears) return bankValue;
        return data.contribution * 12 * yearsFromBankStart * (1 + data.interestRate / 100);
        
      case 'retirement_funds':
        let retirementTotalContribution;
        let retirementYears;
        
        if (data.contributionFrequency === 'oneTime') {
          // For one-time contribution, use the contribution amount directly
          retirementTotalContribution = data.contributionAmount;
          retirementYears = data.completionAge - data.startAge;
        } else {
          // For monthly/yearly contributions, calculate based on frequency and years
          retirementYears = data.completionAge - data.startAge;
          const frequencyMultiplier = data.contributionFrequency === 'monthly' ? 12 : 1;
          retirementTotalContribution = data.contributionAmount * frequencyMultiplier * retirementYears;
        }
        
        const retirementValue = retirementTotalContribution * Math.pow(1 + data.expectedReturn / 100, retirementYears);
        // Calculate value at specific age
        const yearsFromRetirementStart = age - data.startAge;
        if (yearsFromRetirementStart <= 0) return 0;
        if (yearsFromRetirementStart >= retirementYears) return retirementValue;
        
        // For intermediate ages, calculate compound growth
        if (data.contributionFrequency === 'oneTime') {
          // For one-time contribution, calculate based on the single amount
          return retirementTotalContribution * Math.pow(1 + data.expectedReturn / 100, yearsFromRetirementStart);
        } else {
          // For monthly/yearly contributions, calculate proportional growth
          const frequencyMultiplier = data.contributionFrequency === 'monthly' ? 12 : 1;
          const intermediateContribution = data.contributionAmount * frequencyMultiplier * yearsFromRetirementStart;
          return intermediateContribution * Math.pow(1 + data.expectedReturn / 100, yearsFromRetirementStart);
        }
        
      case 'own_living':
        const propertyYears = age - data.purchaseAge;
        if (propertyYears <= 0) return 0;
        const propertyAppreciation = 0.03;
        return data.purchasePrice * Math.pow(1 + propertyAppreciation, propertyYears);
        
      case 'rental':
        return 0;
        
      case 'owner_to_rent_out':
        const ownerPropertyYears = age - data.ownershipStartAge;
        if (ownerPropertyYears <= 0) return 0;
        const ownerPropertyAppreciation = 0.03;
        return data.purchasePrice * Math.pow(1 + ownerPropertyAppreciation, ownerPropertyYears);
        
      default:
        return 0;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('financialPlanning.pdfReport')} - {clientName || t('financialPlanning.client')}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={generatePDF}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              📄 {t('financialPlanning.downloadPDF')}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              {t('financialPlanning.close')}
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="p-6 bg-white">
          {/* Report Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('financialPlanning.financialPlanningReport')}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {t('financialPlanning.preparedFor')}: {clientName || t('financialPlanning.client')}
            </p>
            <p className="text-gray-500">
              {t('financialPlanning.reportDate')}: {formatDate()}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('financialPlanning.executiveSummary')}
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {products.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('financialPlanning.configuredProducts')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(currentAssets)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('financialPlanning.currentAssets')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {retirementAge}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('financialPlanning.retirementAge')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Configuration Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('financialPlanning.productConfiguration')}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                      {t('financialPlanning.productType')}
                    </th>
                    <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                      {t('financialPlanning.details')}
                    </th>
                    <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                      {t('financialPlanning.projectedValue')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const projectedValue = calculateProductValueAtAge(product, retirementAge);
                    return (
                      <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {product.name || t(`financialPlanning.${product.subType}`)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {getProductDetails(product, t)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm font-medium">
                          {formatCurrency(projectedValue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Analysis */}
          {financialData.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('financialPlanning.financialAnalysis')}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                        {t('financialPlanning.age')}
                      </th>
                      <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                        {t('financialPlanning.totalMonthlyIncome')}
                      </th>
                      <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                        {t('financialPlanning.passiveIncome')}
                      </th>
                      <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                        {t('financialPlanning.monthlyExpenses')}
                      </th>
                      <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                        {t('financialPlanning.netWorth')}
                      </th>
                      <th className="px-4 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-700">
                        {t('financialPlanning.cashReserve')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map((data, index) => (
                      <tr key={data.age} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {data.age}{t('financialPlanning.yearsOld')}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {formatCurrency(data.totalMonthlyIncome)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {formatCurrency(data.monthlyPassiveIncome)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {formatCurrency(data.totalExpenses)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm font-medium">
                          {formatCurrency(data.netWorth)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-sm">
                          {data.cashReserve.toFixed(1)} {t('financialPlanning.months')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Asset Allocation */}
          {financialData.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('financialPlanning.assetAllocation')} ({retirementAge}{t('financialPlanning.yearsOld')})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    {Object.entries(calculateAssetAllocation(retirementAge)).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {t(`financialPlanning.${key}`)}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {value.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <span className="text-sm text-gray-500">
                      {t('financialPlanning.chartPlaceholder')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('financialPlanning.recommendations')}
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <ul className="space-y-3 text-sm">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center text-sm text-gray-500">
              <p>{t('financialPlanning.reportFooter1')}</p>
              <p className="mt-2">{t('financialPlanning.reportFooter2')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getProductDetails = (product, t) => {
  const data = product.data;
  switch (product.subType) {
    case 'funds':
      return `${t('financialPlanning.investmentAmount')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.investmentAmount)}, ${t('financialPlanning.expectedReturn')}: ${data.expectedReturn}%`;
    case 'mpf':
      return `${t('financialPlanning.monthlySalary')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.monthlySalary)}, ${t('financialPlanning.contribution')}: ${data.employerContribution + data.employeeContribution}%`;
    case 'saving_plans':
      return `${t('financialPlanning.contribution')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.contribution)}/${t('financialPlanning.monthly')}`;
    case 'bank':
      return `${t('financialPlanning.contribution')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.contribution)}/${t('financialPlanning.monthly')}, ${t('financialPlanning.interestRate')}: ${data.interestRate}%`;
    case 'retirement_funds':
      return `${t('financialPlanning.contribution')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.contributionAmount)}/${t('financialPlanning.monthly')}`;
    case 'own_living':
      return `${t('financialPlanning.purchasePrice')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.purchasePrice)}`;
    case 'renting':
      return `${t('financialPlanning.rentalExpenses')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.rentalExpenses)}/${t('financialPlanning.monthly')}`;
    case 'owner_to_rent_out':
      return `${t('financialPlanning.rentAmount')}: ${new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'HKD' }).format(data.rentAmount)}/${t('financialPlanning.monthly')}`;
    default:
      return t('financialPlanning.noDetails');
  }
};

export default FinancialPlanningPDFReport; 
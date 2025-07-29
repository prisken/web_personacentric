import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Alias for useTranslation to maintain compatibility
export const useTranslation = useLanguage;

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'zh-TW';
  });

  const translations = {
    'zh-TW': {
      // Financial Planning - Main
      'financialPlanning.title': '理財產品配置',
      'financialPlanning.tab': '理財產品配置',
      'financialPlanning.page1': '產品配置',
      'financialPlanning.page2': '財務分析',
      'financialPlanning.create': '創建',
      'financialPlanning.loadSaved': '載入已保存',
      'financialPlanning.save': '保存',
      'financialPlanning.cancel': '取消',
      'financialPlanning.close': '關閉',
      'financialPlanning.back': '返回',
      'financialPlanning.next': '下一步',
      'financialPlanning.previous': '上一步',
      'financialPlanning.load': '載入',

      // Product Categories
      'financialPlanning.selectCategory': '選擇產品類別',
      'financialPlanning.investment': '投資',
      'financialPlanning.saving': '儲蓄',
      'financialPlanning.realEstate': '房地產',
      'financialPlanning.selectProduct': '選擇產品類型',
      'financialPlanning.funds': '基金',
      'financialPlanning.mpf': '強積金',
      'financialPlanning.savingPlans': '儲蓄計劃',
      'financialPlanning.bank': '銀行',
      'financialPlanning.annuity': '年金',
      'financialPlanning.ownLiving': '自住',
      'financialPlanning.rental': '租賃',

      // Product Management
      'financialPlanning.product': '產品',
      'financialPlanning.addProduct': '添加產品',
      'financialPlanning.removeProduct': '移除產品',
      'financialPlanning.duplicateProduct': '複製產品',
      'financialPlanning.noProducts': '尚未添加任何產品',
      'financialPlanning.noProductsDescription': '點擊「創建」開始添加理財產品',

      // User Management
      'financialPlanning.loadUser': '載入用戶',
      'financialPlanning.noSavedUsers': '沒有保存的用戶',
      'financialPlanning.noSavedUsersDescription': '請先創建並保存用戶的理財產品配置',

      // Financial Analysis
      'financialPlanning.financialAnalysis': '財務分析設定',
      'financialPlanning.retirementAge': '退休年齡',
      'financialPlanning.inflationRate': '通脹率 (%)',
      'financialPlanning.currentAssets': '當前資產 (HKD)',
      'financialPlanning.analysisPeriod': '分析期間',
      'financialPlanning.to': '至',
      'financialPlanning.recalculate': '重新計算',
      'financialPlanning.calculating': '計算中...',
      'financialPlanning.startAnalysis': '開始財務分析',
      'financialPlanning.startAnalysisDescription': '設定您的財務參數並點擊「重新計算」開始分析',
      'financialPlanning.startAnalysisButton': '開始分析',

      // Expenses
      'financialPlanning.expenses': '開支設定',
      'financialPlanning.addExpenseStage': '添加開支階段',
      'financialPlanning.ageFrom': '年齡從',
      'financialPlanning.ageTo': '年齡至',
      'financialPlanning.monthlyExpenses': '月開支',
      'financialPlanning.removeExpense': '移除開支',

      // Results Table
      'financialPlanning.annualFinancialStatus': '年度財務狀況',
      'financialPlanning.age': '年齡',
      'financialPlanning.totalMonthlyIncome': '總月收入',
      'financialPlanning.passiveIncome': '被動收入',
      'financialPlanning.totalExpenses': '月開支',
      'financialPlanning.netCashFlow': '淨現金流',
      'financialPlanning.totalAssets': '總資產',
      'financialPlanning.totalLiabilities': '總負債',
      'financialPlanning.netWorth': '淨資產',
      'financialPlanning.accumulatedFlexibleFunds': '年度靈活資金',

      // Charts
      'financialPlanning.financialTrendChart': '財務趨勢圖',
      'financialPlanning.assetAllocation': '資產配置',
      'financialPlanning.incomeSourcesAnalysis': '收入來源分析',
      'financialPlanning.selectAge': '選擇年齡',
      'financialPlanning.yearsOld': '歲',
      'financialPlanning.property': '物業',
      'financialPlanning.cash': '現金',
      'financialPlanning.investments': '投資',
      'financialPlanning.other': '其他',
      'financialPlanning.workIncome': '工作收入',
      'financialPlanning.fundIncome': '基金收益',
      'financialPlanning.mpfIncome': '強積金',
      'financialPlanning.savingIncome': '儲蓄計劃',
      'financialPlanning.bankIncome': '銀行利息',
      'financialPlanning.annuityIncome': '年金收入',
      'financialPlanning.rentalIncome': '租金收入',
      'financialPlanning.incomeSources': '收入來源 (HKD)',
      'financialPlanning.annualIncomeSources': '各收入來源年度金額',
      'financialPlanning.netWorthPassiveIncomeExpenses': '淨資產、被動收入與開支趨勢',

      // Formula Info
      'financialPlanning.viewChartExplanation': '查看圖表說明',
      'financialPlanning.viewCalculationFormula': '查看計算公式',
      'financialPlanning.formulaExplanation': '計算公式：',
      'financialPlanning.description': '說明：',
      'financialPlanning.unknown': '未知',
      'financialPlanning.noFormula': '無公式',
      'financialPlanning.noDescription': '無描述',

      // PDF Report
      'financialPlanning.pdfReport': 'PDF 報告',
      'financialPlanning.client': '客戶',
      'financialPlanning.downloadPDF': '下載 PDF',
      'financialPlanning.financialPlanningReport': '理財產品配置報告',
      'financialPlanning.preparedFor': '為客戶準備',
      'financialPlanning.reportDate': '報告日期',
      'financialPlanning.executiveSummary': '執行摘要',
      'financialPlanning.configuredProducts': '已配置產品',
      'financialPlanning.productConfiguration': '產品配置',
      'financialPlanning.productType': '產品類型',
      'financialPlanning.details': '詳細資料',
      'financialPlanning.projectedValue': '預期價值',
      'financialPlanning.investmentAmount': '投資金額',
      'financialPlanning.expectedReturn': '預期回報',
      'financialPlanning.monthlySalary': '月薪',
      'financialPlanning.contribution': '供款',
      'financialPlanning.monthly': '月',
      'financialPlanning.interestRate': '利率',
      'financialPlanning.purchasePrice': '購買價格',
      'financialPlanning.rentalExpenses': '租金開支',
      'financialPlanning.rentAmount': '租金收入',
      'financialPlanning.noDetails': '無詳細資料',
      'financialPlanning.recommendations': '建議',
      'financialPlanning.recommendation1': '定期檢視和調整您的投資組合以符合市場變化',
      'financialPlanning.recommendation2': '考慮增加退休儲蓄以確保退休後的生活品質',
      'financialPlanning.recommendation3': '多元化投資以分散風險並提高回報潛力',
      'financialPlanning.recommendation4': '定期與財務顧問會面以檢討和優化您的財務計劃',
      'financialPlanning.reportFooter1': '本報告僅供參考，不構成投資建議',
      'financialPlanning.reportFooter2': '請諮詢專業財務顧問以獲得個人化的投資建議',
      'financialPlanning.chartPlaceholder': '圖表佔位符',
      'financialPlanning.clientName': '客戶姓名',
      'financialPlanning.enterClientName': '輸入客戶姓名',
      'financialPlanning.generateReport': '生成報告',
      'financialPlanning.reportGenerated': '報告已生成',
      'financialPlanning.reportGenerationFailed': '報告生成失敗',

      // Recommendations Editor
      'financialPlanning.editRecommendations': '編輯建議',
      'financialPlanning.resetToDefault': '重置為預設',
      'financialPlanning.recommendationsDescription': '自定義您的財務規劃建議。這些建議將顯示在PDF報告中，為客戶提供專業的財務指導。',
      'financialPlanning.enterRecommendation': '輸入建議內容...',
      'financialPlanning.removeRecommendation': '移除建議',
      'financialPlanning.addRecommendation': '添加建議',
      'financialPlanning.recommendationsPreview': '建議預覽',
      'financialPlanning.emptyRecommendation': '（空建議）',
      'financialPlanning.editRecommendationsButton': '編輯建議',

      // Report Generation Section
      'financialPlanning.reportGeneration': '報告生成',
      'financialPlanning.reportGenerationDescription': '生成包含所有財務規劃數據的專業PDF報告。請確保所有必要信息已完成。',
      'financialPlanning.completed': '已完成',
      'financialPlanning.required': '需要完成',
      'financialPlanning.products': '產品配置',

      // Product Card Fields - Funds
      'productCard.fundAllocation': '基金配置',
      'productCard.growth': '增長型',
      'productCard.dividends': '股息型',
      'productCard.investmentAmount': '投資金額 (HKD)',
      'productCard.startAge': '開始年齡',
      'productCard.expectedReturn': '預期年回報率 (%)',
      'productCard.expectedReturnPlaceholder': '例如: 8 表示年回報率 8%',
      'productCard.expectedWithdrawalAge': '預期提取年齡',
      'productCard.expectedWithdrawalAgePlaceholder': '例如: 65 表示65歲時提取',
      'productCard.fundCategory': '基金類別',
      'productCard.growthFund': '增長基金',
      'productCard.dividendFund': '派息基金',
      'productCard.monthlyDividends': '每月派息',
      'productCard.yearlyDividends': '年度累積派息',
      'productCard.totalDividends': '累積派息至提取年齡',
      'productCard.totalReturn': '退保時總回報',
      'productCard.compoundCalculation': '複式計算',
      'productCard.simpleCalculation': '單利計算',

      // Product Card Fields - MPF
      'productCard.monthlySalary': '月薪 (HKD)',
      'productCard.salaryIncrement': '年薪增幅 (%)',
      'productCard.employerContribution': '僱主供款 (%)',
      'productCard.employeeContribution': '僱員供款 (%)',
      'productCard.currentAge': '當前年齡',
      'productCard.currentMPFAmount': '現有強積金金額',
      'productCard.mpfAt65': '65歲時強積金總額',
      'productCard.totalDividendsEarned': '總派息收益',
      'productCard.mpfWithoutDividends': '無派息時強積金價值',
      'productCard.employeeContributionDeduction': '僱員供款扣除',

      // Product Card Fields - Saving Plans
      'productCard.planName': '計劃名稱',
      'productCard.contribution': '供款金額',
      'productCard.contributionType': '供款頻率',
      'productCard.monthly': '每月',
      'productCard.yearly': '每年',
      'productCard.contributionDuration': '供款年期',
      'productCard.surrenderAge': '退保年齡',
      'productCard.planType': '計劃類型',
      'productCard.duration': '年期',
      'productCard.interestRate': '利率 (%)',
      'productCard.withdrawalAge': '提取年齡',
      'productCard.contributionAmount': '供款金額',
      'productCard.frequency': '供款頻率',
      'productCard.startDate': '開始日期',
      'productCard.targetRetirementAge': '目標退休年齡',
      'productCard.expectedAnnualReturn': '預期年回報率 (%)',
      'productCard.breakEvenPeriod': '回本期(年)',
      'productCard.withdrawalAmount': '金額提取',
      'productCard.withdrawalPeriod': '提取金額年期',
      'productCard.surrenderValue': '退保金額',
      'productCard.contributionPeriod': '供款年期',

      // Product Card Fields - Bank
      'productCard.existingAmount': '現存金額',
      'productCard.contributionFrequency': '供款頻率',
      'productCard.alreadyOwned': '已擁有金額',
      'productCard.yes': '是',
      'productCard.no': '否',
      'productCard.lockInPeriod': '資金鎖定時間(月)',
      'productCard.totalSavings': '總儲蓄金額',
      'productCard.totalAmount': '總金額',

      // Product Card Fields - Own Living
      'productCard.purchasePrice': '購買價格 (HKD)',
      'productCard.downPayment': '首期付款 (%)',
      'productCard.downPaymentPlaceholder': '例如: 30',
      'productCard.mortgageStartAge': '開始供樓年紀',
      'productCard.sellAge': '賣樓年紀',
      'productCard.willNotSell': '不會賣',
      'productCard.willSell': '將會售樓',
      'productCard.sellAgePlaceholder': '例如: 65',
      'productCard.mortgageInterestRate': '按揭利率 (%)',
      'productCard.mortgageInterestRatePlaceholder': '例如: 3.5',
      'productCard.mortgageCompletionAge': '供完樓年齡',
      'productCard.mortgageCompletionAgePlaceholder': '例如: 60',
      'productCard.totalInterestPaid': '總利息支出',
      'productCard.propertyValueAtCompletion': '供完樓時物業價值',
      'productCard.propertyValueGrowth': '物業價值增長 (%)',
      'productCard.propertyValueGrowthPlaceholder': '例如: 1.0',
      'productCard.propertyValueAtAge': '{age}歲時物業價值',
      'productCard.saleProceeds': '售樓收益',

      // Product Card Fields - Rental
      'productCard.monthlyRentExpense': '每月租金開支 (HKD)',
      'productCard.leaseStartAge': '租約開始年齡',
      'productCard.rentIncreaseRate': '租金增幅 (%)',
      'productCard.rentIncreaseRatePlaceholder': '例如: 3',

      // Product Card Fields - Annuity
      'productCard.annuityType': '年金類型',
      'productCard.deferred': '延期',
      'productCard.immediate': '即期',
      'productCard.annualContribution': '每年供款額 (HKD)',
      'productCard.annualContributionPlaceholder': '例如: 100000',
      'productCard.contributionAmountPlaceholder': '例如: 1000000',
      'productCard.gender': '性別',
      'productCard.male': '男性',
      'productCard.female': '女性',
      'productCard.annuityStartAge': '年金開始年齡',
      'productCard.premiumAge': '投保年齡',
      'productCard.lifeExpectancy': '預期壽命',
      'productCard.monthlyAnnuity': '每月年金',
      'productCard.totalAnnuityIncome': '總年金收入',
      'productCard.internalRateOfReturn': '內部回報率',

      // Product Card - Common
      'productCard.removeProduct': '移除產品',
      'productCard.duplicateProduct': '複製產品',
      'productCard.summary': '摘要',
      'productCard.unknownProductType': '未知產品類型',
      'productCard.productNumber': '產品 #',
      'productCard.copyProduct': '複製產品',
      'productCard.deleteProduct': '刪除產品',

      // Info Dialog
      'productCard.viewFormula': '查看計算公式',
      'productCard.calculationFormula': '計算公式',
      'productCard.explanation': '說明',

      // Dashboard
      'dashboard.tabs.financial_planning': '理財產品配置',
    },
    'en': {
      // Financial Planning - Main
      'financialPlanning.title': 'Financial Product Planning',
      'financialPlanning.tab': 'Financial Planning',
      'financialPlanning.page1': 'Product Configuration',
      'financialPlanning.page2': 'Financial Analysis',
      'financialPlanning.create': 'Create',
      'financialPlanning.loadSaved': 'Load Saved',
      'financialPlanning.save': 'Save',
      'financialPlanning.cancel': 'Cancel',
      'financialPlanning.close': 'Close',
      'financialPlanning.back': 'Back',
      'financialPlanning.next': 'Next',
      'financialPlanning.previous': 'Previous',
      'financialPlanning.load': 'Load',

      // Product Categories
      'financialPlanning.selectCategory': 'Select Product Category',
      'financialPlanning.investment': 'Investment',
      'financialPlanning.saving': 'Saving',
      'financialPlanning.realEstate': 'Real Estate',
      'financialPlanning.selectProduct': 'Select Product Type',
      'financialPlanning.funds': 'Funds',
      'financialPlanning.mpf': 'MPF',
      'financialPlanning.savingPlans': 'Saving Plans',
      'financialPlanning.bank': 'Bank',
      'financialPlanning.annuity': 'Annuity',
      'financialPlanning.ownLiving': 'Own Living',
      'financialPlanning.rental': 'Rental',

      // Product Management
      'financialPlanning.product': 'Product',
      'financialPlanning.addProduct': 'Add Product',
      'financialPlanning.removeProduct': 'Remove Product',
      'financialPlanning.duplicateProduct': 'Duplicate Product',
      'financialPlanning.noProducts': 'No products added yet',
      'financialPlanning.noProductsDescription': 'Click "Create" to start adding financial products',

      // User Management
      'financialPlanning.loadUser': 'Load User',
      'financialPlanning.noSavedUsers': 'No saved users',
      'financialPlanning.noSavedUsersDescription': 'Please create and save user financial product configurations first',

      // Financial Analysis
      'financialPlanning.financialAnalysis': 'Financial Analysis Settings',
      'financialPlanning.retirementAge': 'Retirement Age',
      'financialPlanning.inflationRate': 'Inflation Rate (%)',
      'financialPlanning.currentAssets': 'Current Assets (HKD)',
      'financialPlanning.analysisPeriod': 'Analysis Period',
      'financialPlanning.to': 'to',
      'financialPlanning.recalculate': 'Recalculate',
      'financialPlanning.calculating': 'Calculating...',
      'financialPlanning.startAnalysis': 'Start Financial Analysis',
      'financialPlanning.startAnalysisDescription': 'Set your financial parameters and click "Recalculate" to start analysis',
      'financialPlanning.startAnalysisButton': 'Start Analysis',

      // Expenses
      'financialPlanning.expenses': 'Expense Settings',
      'financialPlanning.addExpenseStage': 'Add Expense Stage',
      'financialPlanning.ageFrom': 'Age From',
      'financialPlanning.ageTo': 'Age To',
      'financialPlanning.monthlyExpenses': 'Monthly Expenses',
      'financialPlanning.removeExpense': 'Remove Expense',

      // Results Table
      'financialPlanning.annualFinancialStatus': 'Annual Financial Status',
      'financialPlanning.age': 'Age',
      'financialPlanning.totalMonthlyIncome': 'Total Monthly Income',
      'financialPlanning.passiveIncome': 'Passive Income',
      'financialPlanning.totalExpenses': 'Monthly Expenses',
      'financialPlanning.netCashFlow': 'Net Cash Flow',
      'financialPlanning.totalAssets': 'Total Assets',
      'financialPlanning.totalLiabilities': 'Total Liabilities',
      'financialPlanning.netWorth': 'Net Worth',
      'financialPlanning.accumulatedFlexibleFunds': 'Annual Flexible Funds',

      // Charts
      'financialPlanning.financialTrendChart': 'Financial Trend Chart',
      'financialPlanning.assetAllocation': 'Asset Allocation',
      'financialPlanning.incomeSourcesAnalysis': 'Income Sources Analysis',
      'financialPlanning.selectAge': 'Select Age',
      'financialPlanning.yearsOld': 'years old',
      'financialPlanning.property': 'Property',
      'financialPlanning.cash': 'Cash',
      'financialPlanning.investments': 'Investments',
      'financialPlanning.other': 'Other',
      'financialPlanning.workIncome': 'Work Income',
      'financialPlanning.fundIncome': 'Fund Income',
      'financialPlanning.mpfIncome': 'MPF Income',
      'financialPlanning.savingIncome': 'Saving Income',
      'financialPlanning.bankIncome': 'Bank Interest',
      'financialPlanning.annuityIncome': 'Annuity Income',
      'financialPlanning.rentalIncome': 'Rental Income',
      'financialPlanning.incomeSources': 'Income Sources (HKD)',
      'financialPlanning.annualIncomeSources': 'Annual Income Sources',
      'financialPlanning.netWorthPassiveIncomeExpenses': 'Net Worth, Passive Income & Expenses Trend',

      // Formula Info
      'financialPlanning.viewChartExplanation': 'View Chart Explanation',
      'financialPlanning.viewCalculationFormula': 'View Calculation Formula',
      'financialPlanning.formulaExplanation': 'Calculation Formula:',
      'financialPlanning.description': 'Description:',
      'financialPlanning.unknown': 'Unknown',
      'financialPlanning.noFormula': 'No Formula',
      'financialPlanning.noDescription': 'No Description',

      // PDF Report
      'financialPlanning.pdfReport': 'PDF Report',
      'financialPlanning.client': 'Client',
      'financialPlanning.downloadPDF': 'Download PDF',
      'financialPlanning.financialPlanningReport': 'Financial Product Planning Report',
      'financialPlanning.preparedFor': 'Prepared for',
      'financialPlanning.reportDate': 'Report Date',
      'financialPlanning.executiveSummary': 'Executive Summary',
      'financialPlanning.configuredProducts': 'Configured Products',
      'financialPlanning.productConfiguration': 'Product Configuration',
      'financialPlanning.productType': 'Product Type',
      'financialPlanning.details': 'Details',
      'financialPlanning.projectedValue': 'Projected Value',
      'financialPlanning.investmentAmount': 'Investment Amount',
      'financialPlanning.expectedReturn': 'Expected Return',
      'financialPlanning.monthlySalary': 'Monthly Salary',
      'financialPlanning.contribution': 'Contribution',
      'financialPlanning.monthly': 'Monthly',
      'financialPlanning.interestRate': 'Interest Rate',
      'financialPlanning.purchasePrice': 'Purchase Price',
      'financialPlanning.rentalExpenses': 'Rental Expenses',
      'financialPlanning.rentAmount': 'Rent Amount',
      'financialPlanning.noDetails': 'No Details',
      'financialPlanning.recommendations': 'Recommendations',
      'financialPlanning.recommendation1': 'Regularly review and adjust your investment portfolio to align with market changes',
      'financialPlanning.recommendation2': 'Consider increasing retirement savings to ensure quality of life after retirement',
      'financialPlanning.recommendation3': 'Diversify investments to spread risk and increase return potential',
      'financialPlanning.recommendation4': 'Regularly meet with financial advisors to review and optimize your financial plan',
      'financialPlanning.reportFooter1': 'This report is for reference only and does not constitute investment advice',
      'financialPlanning.reportFooter2': 'Please consult a professional financial advisor for personalized investment advice',
      'financialPlanning.chartPlaceholder': 'Chart Placeholder',
      'financialPlanning.clientName': 'Client Name',
      'financialPlanning.enterClientName': 'Enter client name',
      'financialPlanning.generateReport': 'Generate Report',
      'financialPlanning.reportGenerated': 'Report generated successfully',
      'financialPlanning.reportGenerationFailed': 'Report generation failed',

      // Recommendations Editor
      'financialPlanning.editRecommendations': 'Edit Recommendations',
      'financialPlanning.resetToDefault': 'Reset to Default',
      'financialPlanning.recommendationsDescription': 'Customize your financial planning recommendations. These recommendations will appear in the PDF report to provide professional financial guidance to clients.',
      'financialPlanning.enterRecommendation': 'Enter recommendation content...',
      'financialPlanning.removeRecommendation': 'Remove Recommendation',
      'financialPlanning.addRecommendation': 'Add Recommendation',
      'financialPlanning.recommendationsPreview': 'Recommendations Preview',
      'financialPlanning.emptyRecommendation': '(Empty recommendation)',
      'financialPlanning.editRecommendationsButton': 'Edit Recommendations',

      // Report Generation Section
      'financialPlanning.reportGeneration': 'Report Generation',
      'financialPlanning.reportGenerationDescription': 'Generate a professional PDF report containing all financial planning data. Please ensure all required information is completed.',
      'financialPlanning.completed': 'Completed',
      'financialPlanning.required': 'Required',
      'financialPlanning.products': 'Product Configuration',

      // Product Card Fields - Funds
      'productCard.fundAllocation': 'Fund Allocation',
      'productCard.growth': 'Growth',
      'productCard.dividends': 'Dividends',
      'productCard.investmentAmount': 'Investment Amount (HKD)',
      'productCard.startAge': 'Start Age',
      'productCard.expectedReturn': 'Expected Annual Return (%)',
      'productCard.expectedReturnPlaceholder': 'e.g., 8 means 8% annual return',
      'productCard.expectedWithdrawalAge': 'Expected Withdrawal Age',
      'productCard.expectedWithdrawalAgePlaceholder': 'e.g., 65 means withdraw at age 65',
      'productCard.fundCategory': 'Fund Category',
      'productCard.growthFund': 'Growth Fund',
      'productCard.dividendFund': 'Dividend Fund',
      'productCard.monthlyDividends': 'Monthly Dividends',
      'productCard.yearlyDividends': 'Yearly Accumulated Dividends',
      'productCard.totalDividends': 'Total Dividends Until Withdrawal Age',
      'productCard.totalReturn': 'Total Return at Surrender',
      'productCard.compoundCalculation': 'Compound Calculation',
      'productCard.simpleCalculation': 'Simple Calculation',

      // Product Card Fields - MPF
      'productCard.monthlySalary': 'Monthly Salary (HKD)',
      'productCard.salaryIncrement': 'Annual Salary Increment (%)',
      'productCard.employerContribution': 'Employer Contribution (%)',
      'productCard.employeeContribution': 'Employee Contribution (%)',
      'productCard.currentAge': 'Current Age',
      'productCard.currentMPFAmount': 'Current MPF Amount',
      'productCard.mpfAt65': 'MPF Total at Age 65',
      'productCard.totalDividendsEarned': 'Total Dividends Earned',
      'productCard.mpfWithoutDividends': 'MPF Value Without Dividends',
      'productCard.employeeContributionDeduction': 'Employee Contribution Deduction',

      // Product Card Fields - Saving Plans
      'productCard.planName': 'Plan Name',
      'productCard.contribution': 'Contribution Amount',
      'productCard.contributionType': 'Contribution Frequency',
      'productCard.monthly': 'Monthly',
      'productCard.yearly': 'Yearly',
      'productCard.contributionDuration': 'Contribution Duration',
      'productCard.surrenderAge': 'Surrender Age',
      'productCard.planType': 'Plan Type',
      'productCard.duration': 'Duration',
      'productCard.interestRate': 'Interest Rate (%)',
      'productCard.withdrawalAge': 'Withdrawal Age',
      'productCard.contributionAmount': 'Contribution Amount',
      'productCard.frequency': 'Frequency',
      'productCard.startDate': 'Start Date',
      'productCard.targetRetirementAge': 'Target Retirement Age',
      'productCard.expectedAnnualReturn': 'Expected Annual Return (%)',
      'productCard.breakEvenPeriod': 'Break-even Period (Years)',
      'productCard.withdrawalAmount': 'Withdrawal Amount',
      'productCard.withdrawalPeriod': 'Withdrawal Period',
      'productCard.surrenderValue': 'Surrender Value',
      'productCard.contributionPeriod': 'Contribution Period',

      // Product Card Fields - Bank
      'productCard.existingAmount': 'Existing Amount',
      'productCard.contributionFrequency': 'Contribution Frequency',
      'productCard.alreadyOwned': 'Already Owned',
      'productCard.yes': 'Yes',
      'productCard.no': 'No',
      'productCard.lockInPeriod': 'Lock-in Period (Months)',
      'productCard.totalSavings': 'Total Savings Amount',
      'productCard.totalAmount': 'Total Amount',

      // Product Card Fields - Own Living
      'productCard.purchasePrice': 'Purchase Price (HKD)',
      'productCard.downPayment': 'Down Payment (%)',
      'productCard.downPaymentPlaceholder': 'e.g., 30',
      'productCard.mortgageStartAge': 'Mortgage Start Age',
      'productCard.sellAge': 'Sell Age',
      'productCard.willNotSell': 'Will Not Sell',
      'productCard.willSell': 'Will Sell',
      'productCard.sellAgePlaceholder': 'e.g., 65',
      'productCard.mortgageInterestRate': 'Mortgage Interest Rate (%)',
      'productCard.mortgageInterestRatePlaceholder': 'e.g., 3.5',
      'productCard.mortgageCompletionAge': 'Mortgage Completion Age',
      'productCard.mortgageCompletionAgePlaceholder': 'e.g., 60',
      'productCard.totalInterestPaid': 'Total Interest Paid',
      'productCard.propertyValueAtCompletion': 'Property Value at Completion',
      'productCard.propertyValueGrowth': 'Property Value Growth (%)',
      'productCard.propertyValueGrowthPlaceholder': 'e.g., 1.0',
      'productCard.propertyValueAtAge': 'Property Value at Age {age}',
      'productCard.saleProceeds': 'Sale Proceeds',

      // Product Card Fields - Rental
      'productCard.monthlyRentExpense': 'Monthly Rent Expense',
      'productCard.leaseStartAge': 'Lease Start Age',
      'productCard.rentIncreaseRate': 'Rent Increase Rate (%)',
      'productCard.rentIncreaseRatePlaceholder': 'e.g., 3',

      // Product Card Fields - Annuity
      'productCard.annuityType': 'Annuity Type',
      'productCard.deferred': 'Deferred',
      'productCard.immediate': 'Immediate',
      'productCard.annualContribution': 'Annual Contribution (HKD)',
      'productCard.annualContributionPlaceholder': 'e.g., 100000',
      'productCard.contributionAmountPlaceholder': 'e.g., 1000000',
      'productCard.gender': 'Gender',
      'productCard.male': 'Male',
      'productCard.female': 'Female',
      'productCard.annuityStartAge': 'Annuity Start Age',
      'productCard.premiumAge': 'Premium Age',
      'productCard.lifeExpectancy': 'Life Expectancy',
      'productCard.monthlyAnnuity': 'Monthly Annuity',
      'productCard.totalAnnuityIncome': 'Total Annuity Income',
      'productCard.internalRateOfReturn': 'Internal Rate of Return',

      // Product Card - Common
      'productCard.removeProduct': 'Remove Product',
      'productCard.duplicateProduct': 'Duplicate Product',
      'productCard.summary': 'Summary',
      'productCard.unknownProductType': 'Unknown Product Type',
      'productCard.productNumber': 'Product #',
      'productCard.copyProduct': 'Copy Product',
      'productCard.deleteProduct': 'Delete Product',

      // Info Dialog
      'productCard.viewFormula': 'View Calculation Formula',
      'productCard.calculationFormula': 'Calculation Formula',
      'productCard.explanation': 'Explanation',

      // Dashboard
      'dashboard.tabs.financial_planning': 'Financial Planning',
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const toggleLanguage = () => {
    const newLang = language === 'zh-TW' ? 'en' : 'zh-TW';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}; 
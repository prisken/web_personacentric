import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useTranslation } from '../../contexts/LanguageContext';

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
  setShowFormula,
  onFinancialDataUpdate,
  clientName,
  recommendations,
  onShowPDFReport
}) => {
  const [financialData, setFinancialData] = useState([]);
  const [selectedAge, setSelectedAge] = useState(65);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFormulaDialog, setShowFormulaDialog] = useState(false);
  const [currentFormula, setCurrentFormula] = useState({ title: '', formula: '', description: '' });
  const { t } = useTranslation();

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

  // Helper function to calculate MPF value at a specific age
  const calculateMPFValueAtAge = (data, targetAge) => {
    const mpfYears = targetAge - data.currentAge;
    
    // At current age, return the current MPF amount
    if (mpfYears <= 0) {
      return data.currentMPFAmount || 0;
    }
    
    // Compound the current MPF amount for the period to target age
    const currentMPFCompounded = data.currentMPFAmount * Math.pow(1 + data.expectedReturn / 100, mpfYears);
    
    // Calculate future contributions with proper compound interest and salary increments
    // Each monthly contribution compounds for different periods
    let futureContributionsCompounded = 0;
    
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
      }
    }
    
    return currentMPFCompounded + futureContributionsCompounded;
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

  const calculateAccumulatedFlexibleFunds = (age) => {
    // Start with current assets (liquid cash)
    let flexibleFunds = currentAssets;
    
    // Add accumulated net cash flow from start age to current age
    const startAge = analysisPeriod.start;
    for (let year = startAge; year <= age; year++) {
      const yearIncome = calculateTotalIncome(year);
      const yearExpenses = calculateTotalExpenses(year);
      
      // Calculate monthly recurring expenses (excluding one-time expenses)
      let monthlyRecurringExpenses = 0;
      let oneTimeExpenses = 0;
      
      // Separate recurring vs one-time expenses
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'bank' && data.planType === 'fixed_deposit' && data.alreadyOwned === 'N' && year === data.startAge) {
          // Fixed deposit contribution is one-time
          oneTimeExpenses += data.contribution;
        } else if (subType === 'annuity' && data.annuityType === 'immediate' && year === data.premiumAge) {
          // Immediate annuity contribution is one-time
          oneTimeExpenses += data.contributionAmount;
        } else if (subType === 'own_living' && year === data.mortgageStartAge) {
          // Down payment is now handled in flexible funds as negative value
          // Removed from one-time expenses calculation
        } else {
          // All other expenses are recurring monthly expenses
          // This will be handled by the existing yearExpenses calculation
        }
      });
      
      // Calculate passive income for this year
      const yearPassiveIncome = calculatePassiveIncome(year);
      
      // Calculate net cash flow: monthly income + passive income - monthly recurring expenses
      const monthlyNetCashFlow = yearIncome + yearPassiveIncome - (yearExpenses - oneTimeExpenses);
      flexibleFunds += monthlyNetCashFlow * 12; // Convert monthly to annual
      
      // Add one-time expenses directly (not multiplied by 12)
      flexibleFunds -= oneTimeExpenses;
      
      // Add fund investment amount as negative flexible funds at start age
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'funds' && year === data.startAge) {
          // Fund investment amount reduces flexible funds (negative value)
          flexibleFunds -= data.investmentAmount;
        }
      });
      
      // Add yearly rental expenses as negative flexible funds
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'rental' && year >= data.leaseStartAge && year <= data.expectedEndAge) {
          // Calculate yearly rent with annual increase
          const rentIncreaseRate = (data.rentIncreaseRate || 0) / 100;
          const yearsSinceLeaseStart = year - data.leaseStartAge;
          const currentRent = data.monthlyRentExpense * Math.pow(1 + rentIncreaseRate, yearsSinceLeaseStart);
          const yearlyRent = currentRent * 12;
          // Yearly rental expense reduces flexible funds (negative value)
          flexibleFunds -= yearlyRent;
        }
      });
      
      // Add down payment as negative flexible funds at mortgage start age
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'own_living' && year === data.mortgageStartAge) {
          // Down payment reduces flexible funds (negative value)
          const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
          flexibleFunds -= downPaymentAmount;
        }
      });
      
      // Mortgage payments are handled through expenses calculation
      // No need to add them directly to flexible funds as they're already included in yearExpenses
      
      // Add dividends from funds as liquid cash (until expected withdrawal age)
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'funds' && year < data.expectedWithdrawalAge) {
          if (data.fundCategory === 'dividend') {
            // 派息基金：每月派息計入流動資金
            const monthlyDividend = data.investmentAmount * (data.expectedReturn / 100) / 12;
            flexibleFunds += monthlyDividend * 12; // Annual dividend
          }
        }
      });
      
      // Add fund withdrawal at expected withdrawal age
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'funds' && year === data.expectedWithdrawalAge) {
          if (data.fundCategory === 'growth') {
            // 增長基金：提取時將總價值轉為流動資金
            const yearsInvested = data.expectedWithdrawalAge - data.startAge;
            const totalValue = data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, yearsInvested);
            flexibleFunds += totalValue;
          } else {
            // 派息基金：提取時將本金轉為流動資金
            flexibleFunds += data.investmentAmount;
          }
        }
      });
      
      // Add MPF withdrawal at age 65 (entire amount moves to liquid cash)
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'mpf' && year === 65) {
          const mpfResult = calculateMPF(data);
          // Entire MPF value moves to liquid cash at age 65
          flexibleFunds += mpfResult.totalMPF;
        }
      });
      
      // Add property sale proceeds to flexible funds (net proceeds after mortgage)
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'own_living' && data.sellAge !== 'willNotSell' && year === parseInt(data.sellAge)) {
          // Calculate property value at sale age with growth
          const propertyValueGrowth = (data.propertyValueGrowth || 1) / 100; // Default to 1% if not set
          const yearsSincePurchase = year - data.mortgageStartAge;
          const propertyValue = data.purchasePrice * Math.pow(1 + propertyValueGrowth, yearsSincePurchase);
          
          // Calculate remaining mortgage balance at sale age
          const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
          const mortgageAmount = data.purchasePrice - downPaymentAmount;
          const mortgageTerm = Math.max(1, data.mortgageCompletionAge - data.mortgageStartAge);
          const interestRate = data.mortgageInterestRate / 100;
          const monthlyInterestRate = interestRate / 12;
          const numberOfPayments = mortgageTerm * 12;
          const paymentsMade = (year - data.mortgageStartAge) * 12;
          const remainingPayments = numberOfPayments - paymentsMade;
          const remainingBalance = mortgageAmount * (Math.pow(1 + monthlyInterestRate, remainingPayments) - 1) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          
          // Add net sale proceeds (property value minus remaining mortgage)
          const netSaleProceeds = propertyValue - remainingBalance;
          flexibleFunds += netSaleProceeds;
          
          // If there's a shortfall (negative netSaleProceeds), it reduces flexible funds
          // This represents the remaining debt that the borrower still owes
        }
      });
      
      // Add fixed deposit maturity to flexible funds
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'bank' && data.planType === 'fixed_deposit') {
          const lockInYears = data.lockInPeriod / 12;
          const yearsSinceStart = year - data.startAge;
          
          if (Math.abs(yearsSinceStart - lockInYears) < 0.01) {
            // Fixed deposit matures, total amount (with interest) moves to flexible funds
            const totalAmount = data.contribution * Math.pow(1 + data.interestRate / 100, lockInYears);
            flexibleFunds += totalAmount;
          }
        }
      });
      
      // Add saving account values as flexible funds (liquid cash)
      products.forEach(product => {
        const { subType, data } = product;
        if (subType === 'bank' && data.planType === 'saving' && year >= data.startAge) {
          const yearsSinceStart = year - data.startAge;
          if (yearsSinceStart >= 0) {
            // Calculate the target savings amount for this year
            const targetSavingsThisYear = data.contribution * (data.contributionFrequency === 'monthly' ? 12 : 1);
            
            // Calculate net cash flow for this year to see if there's enough money to save
            const yearIncome = calculateTotalIncome(year);
            const yearExpenses = calculateTotalExpenses(year);
            const yearNetCashFlow = yearIncome - yearExpenses;
            const annualNetCashFlow = yearNetCashFlow * 12;
            
            // Only save if there's enough money left over
            const actualSavingsThisYear = Math.min(targetSavingsThisYear, Math.max(0, annualNetCashFlow));
            
            // Calculate compound interest on existing amount
            const existingAmountWithInterest = data.existingAmount * Math.pow(1 + data.interestRate / 100, yearsSinceStart);
            
            // Calculate compound interest on actual savings made so far
            let totalActualSavings = 0;
            for (let i = 0; i <= yearsSinceStart; i++) {
              const previousYear = year - yearsSinceStart + i;
              const previousYearIncome = calculateTotalIncome(previousYear);
              const previousYearExpenses = calculateTotalExpenses(previousYear);
              const previousYearNetCashFlow = (previousYearIncome - previousYearExpenses) * 12;
              const previousYearSavings = Math.min(targetSavingsThisYear, Math.max(0, previousYearNetCashFlow));
              totalActualSavings += previousYearSavings * Math.pow(1 + data.interestRate / 100, yearsSinceStart - i);
            }
            
            // Add to flexible funds (only add the growth for this year to avoid double counting)
            if (yearsSinceStart === 0) {
              flexibleFunds += existingAmountWithInterest + actualSavingsThisYear;
            } else {
              // For subsequent years, add only the interest earned this year
              const previousYear = year - 1;
              const previousYearsSinceStart = previousYear - data.startAge;
              const previousExistingAmountWithInterest = data.existingAmount * Math.pow(1 + data.interestRate / 100, previousYearsSinceStart);
              
              let previousTotalActualSavings = 0;
              for (let i = 0; i <= previousYearsSinceStart; i++) {
                const previousYearForSavings = previousYear - previousYearsSinceStart + i;
                const previousYearForSavingsIncome = calculateTotalIncome(previousYearForSavings);
                const previousYearForSavingsExpenses = calculateTotalExpenses(previousYearForSavings);
                const previousYearForSavingsNetCashFlow = (previousYearForSavingsIncome - previousYearForSavingsExpenses) * 12;
                const previousYearForSavingsSavings = Math.min(targetSavingsThisYear, Math.max(0, previousYearForSavingsNetCashFlow));
                previousTotalActualSavings += previousYearForSavingsSavings * Math.pow(1 + data.interestRate / 100, previousYearsSinceStart - i);
              }
              
              const interestEarnedThisYear = (existingAmountWithInterest + totalActualSavings) - (previousExistingAmountWithInterest + previousTotalActualSavings);
              flexibleFunds += interestEarnedThisYear + actualSavingsThisYear;
            }
          }
        }
      });
    }
    
    return flexibleFunds; // Return actual calculated value
  };

  const calculateFinancialProjection = () => {
    setIsCalculating(true);
    
    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
      const data = [];
      const startYear = analysisPeriod.start;
      const endYear = analysisPeriod.end;

      for (let age = startYear; age <= endYear; age++) {
        const totalIncome = calculateTotalIncome(age);
        const passiveIncome = calculatePassiveIncome(age);
        const totalExpenses = calculateTotalExpenses(age);
        const totalAssets = calculateTotalAssets(age);
        const totalLiabilities = calculateAccumulatedLiabilities(age);
        const accumulatedFlexibleFunds = calculateAccumulatedFlexibleFunds(age);
        const netWorth = totalAssets + currentAssets + accumulatedFlexibleFunds; // 淨資產 = 總資產 + 當前資產 + 年度靈活資金
        const netWorthMinusFlexibleFunds = netWorth - accumulatedFlexibleFunds;
        
        // Debug: Log 淨資產 minus 年度靈活資金 for every year
        console.log(`NET WORTH DEBUG Age ${age}: Net Worth=${netWorth}, Flexible Funds=${accumulatedFlexibleFunds}, Net Worth - Flexible Funds=${netWorthMinusFlexibleFunds}`);
        
        const yearData = {
          age: age,
          totalMonthlyIncome: totalIncome,
          monthlyPassiveIncome: passiveIncome,
          totalExpenses: totalExpenses,
          netCashFlow: totalIncome + passiveIncome - totalExpenses,
          totalAssets: totalAssets,
          totalLiabilities: totalLiabilities,
          netWorth: netWorth,
          accumulatedFlexibleFunds: accumulatedFlexibleFunds
        };

        data.push(yearData);
      }

      setFinancialData(data);
      if (onFinancialDataUpdate) {
        onFinancialDataUpdate(data);
      }
      setIsCalculating(false);
    }, 100);
  };

  const calculateTotalIncome = (age) => {
    let income = 0;
    
    // Find MPF card to get monthly salary
    const mpfProduct = products.find(product => product.subType === 'mpf');
    const monthlySalary = mpfProduct ? mpfProduct.data.monthlySalary : 0;
    
    // Add salary income if not retired (continue until specified retirement age)
    if (age < retirementAge && monthlySalary > 0) {
      // Apply salary increment from MPF card - start from current age
      const currentAge = mpfProduct ? mpfProduct.data.currentAge : analysisPeriod.start;
      
      // Only start salary from current age onwards
      if (age >= currentAge) {
        const yearsSinceStart = age - currentAge;
        const salaryWithIncrement = monthlySalary * Math.pow(1 + (mpfProduct ? mpfProduct.data.salaryIncrement : 0) / 100, yearsSinceStart);
      
      // Deduct employee contribution percentage (only for age 65 and below)
      let finalEmployeeContribution = 0;
      if (age <= 65) {
        const employeeContributionRate = mpfProduct ? mpfProduct.data.employeeContribution : 0;
        const employeeContribution = salaryWithIncrement * (employeeContributionRate / 100);
        
        // Apply MPF contribution caps
        if (salaryWithIncrement >= 30000) {
          finalEmployeeContribution = 1500; // Cap at 1,500 HKD
        } else if (salaryWithIncrement < 7100) {
          finalEmployeeContribution = 0; // No contribution if below 7,100 HKD
        } else {
          finalEmployeeContribution = employeeContribution;
        }
      }
      
      // Add salary income (with or without MPF contribution deduction)
      income += salaryWithIncrement - finalEmployeeContribution;
    }
    }

    return income;
  };

  const calculatePassiveIncome = (age) => {
    let passiveIncome = 0;
    
    products.forEach(product => {
      const { subType, data } = product;
      
      switch (subType) {
        case 'funds':
          if (data.fundCategory === 'dividend') {
            // 派息基金：從第一年開始每月派息，計入投資收益，直到預期提取年齡
            if (age >= data.startAge && age < data.expectedWithdrawalAge) {
              const monthlyDividend = data.investmentAmount * (data.expectedReturn / 100) / 12;
              passiveIncome += monthlyDividend;
            }
          }
          // 增長基金：不計入投資收益，收益累積在資產中
          break;
        case 'mpf':
          // MPF does not provide passive income - it moves to liquid cash at age 65
          break;
        case 'annuity':
          // 年金：每月年金計入被動收入，從年金開始年齡到預期壽命
          if (age >= data.annuityStartAge && age <= data.lifeExpectancy) {
            console.log('Adding annuity to passive income:', {
              age,
              annuityStartAge: data.annuityStartAge,
              lifeExpectancy: data.lifeExpectancy,
              monthlyAnnuity: data.monthlyAnnuity,
              passiveIncome
            });
            passiveIncome += data.monthlyAnnuity;
          }
          break;
        case 'own_living':
          // Add rental income if property is being rented out
          if (data.currentSituation === 'renting' && age >= data.rentStartAge) {
            // Determine end age: sell age if property is sold, otherwise age 100
            const endAge = (data.sellAge !== 'willNotSell' && parseInt(data.sellAge) < 100) 
              ? parseInt(data.sellAge) 
              : 100;
            
            if (age <= endAge) {
              const rentalYears = age - data.rentStartAge;
              const monthlyRentWithIncrease = data.monthlyRent * Math.pow(1 + (data.rentIncreaseRate || 0) / 100, rentalYears);
              passiveIncome += monthlyRentWithIncrease;
            }
          }
          break;
      }
    });

    return passiveIncome;
  };

  const calculateTotalExpenses = (age) => {
    let totalExpenses = 0;
    let expenseBreakdown = {
      manualExpenses: 0,
      rentalExpenses: 0,
      mortgageExpenses: 0,
      bankContributions: 0,
      savingPlanContributions: 0,
      annuityContributions: 0
    };
    
    // Add manual expenses with inflation
    expenses.forEach(expense => {
      if (age >= expense.fromAge && age <= expense.toAge) {
        const yearsSinceStart = age - expense.fromAge;
        const inflatedExpenses = expense.monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsSinceStart);
        totalExpenses += inflatedExpenses;
        expenseBreakdown.manualExpenses += inflatedExpenses;
      }
    });

    // Add product-related expenses
    products.forEach(product => {
      const { subType, data } = product;
      
      switch (subType) {
        case 'rental':
          // Rental card is for expenses (renting a property), not income
          if (age >= data.leaseStartAge && age <= data.expectedEndAge) {
            const rentalYears = age - data.leaseStartAge;
            const monthlyRentWithIncrease = data.monthlyRentExpense * Math.pow(1 + data.rentIncreaseRate / 100, rentalYears);
            totalExpenses += monthlyRentWithIncrease;
            expenseBreakdown.rentalExpenses += monthlyRentWithIncrease;
          }
          break;
          
        case 'own_living':
          // Check if property is sold early - if so, stop mortgage payments at sale age
          const effectiveMortgageEndAge = (data.sellAge !== 'willNotSell' && parseInt(data.sellAge) < data.mortgageCompletionAge) 
            ? parseInt(data.sellAge) 
            : data.mortgageCompletionAge;
          
          if (age >= data.mortgageStartAge && age < effectiveMortgageEndAge) {
            // Calculate mortgage amount and monthly payment
            const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
            const mortgageAmount = data.purchasePrice - downPaymentAmount;
            
            const mortgageTerm = Math.max(1, data.mortgageCompletionAge - data.mortgageStartAge);
            const interestRate = data.mortgageInterestRate / 100;
            const monthlyInterestRate = interestRate / 12;
            const numberOfPayments = mortgageTerm * 12;
            
            // Calculate monthly payment using mortgage formula
            const monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
            
            totalExpenses += monthlyPayment;
            expenseBreakdown.mortgageExpenses += monthlyPayment;
          }
          break;
          
        case 'bank':
          if (data.planType === 'saving') {
            // Saving accounts are not expenses - they are savings goals
            // The contribution amount represents money the user wants to save if they have enough left over
            // This is handled in flexible funds calculation, not as an expense
            break;
          } else {
            // For fixed deposits: add one-time contribution as expense if not already owned
            if (age === data.startAge && data.alreadyOwned === 'N') {
              totalExpenses += data.contribution;
              expenseBreakdown.bankContributions += data.contribution;
            }
          }
          break;
          
        case 'saving_plans':
          // Add saving plan contributions as expenses during contribution period
          if (age >= data.startAge && age < data.startAge + data.contributionPeriod) {
            const contributionAmount = data.contribution * (data.contributionType === 'monthly' ? 12 : 1);
            totalExpenses += contributionAmount;
            expenseBreakdown.savingPlanContributions += contributionAmount;
          }
          break;
          
        case 'annuity':
          // Add annuity contributions as expenses
          if (data.annuityType === 'deferred') {
            const contributionStartAge = data.premiumAge;
            const contributionEndAge = data.premiumAge + data.contributionPeriod;
            
            if (age >= contributionStartAge && age < contributionEndAge) {
              // Annual contribution should be divided by 12 to get monthly expense
              totalExpenses += data.annualContribution / 12;
              expenseBreakdown.annuityContributions += data.annualContribution / 12;
            }
          } else {
            // For immediate annuity, add one-time contribution as expense at premium age
            if (age === data.premiumAge) {
              totalExpenses += data.contributionAmount;
              expenseBreakdown.annuityContributions += data.contributionAmount;
            }
          }
          break;
      }
    });

    // Store expense breakdown for formula explanation
    window.currentExpenseBreakdown = expenseBreakdown;

    return totalExpenses;
  };

  const calculateTotalAssets = (age) => {
    let assets = 0; // Start with 0, don't include current assets or flexible funds here
    
    // Note: currentAssets and flexible funds are handled separately in netWorth calculation
    
    products.forEach(product => {
      const { subType, data } = product;
      
      switch (subType) {
                     case 'funds':
               // Only include fund value if before expected withdrawal age
               if (age < data.expectedWithdrawalAge) {
                 const fundYears = age - data.startAge;
                 if (fundYears >= 0) {
                   if (data.fundCategory === 'growth') {
                     // 增長基金：投資金額 + 累積收益 = 總資產
                     if (fundYears === 0) {
                       // At start age, show the initial investment amount
                       assets += data.investmentAmount;
                     } else {
                       // After start age, show investment amount + accumulated returns
                       assets += data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, fundYears);
                     }
                   } else {
                     // 派息基金：投資金額 = 總資產（收益以派息形式發放）
                     assets += data.investmentAmount;
                   }
                 }
               }
               // After expected withdrawal age, fund value is moved to liquid cash (handled in calculateAccumulatedFlexibleFunds)
               break;
                     case 'mpf':
               // Only include MPF value if before age 65
               if (age < 65) {
                 // Calculate MPF value at current age using the actual MPF calculation logic
                 const yearsFromCurrentAge = age - data.currentAge;
                 if (yearsFromCurrentAge >= 0) {
                   // Use the actual MPF calculation to get value at current age
                   const currentMPFValue = calculateMPFValueAtAge(data, age);
                   assets += currentMPFValue;
                 }
               }
               // After age 65, MPF value is moved to liquid cash (handled in calculateAccumulatedFlexibleFunds)
               break;
        case 'saving_plans':
          if (age >= data.surrenderAge) {
            const totalContribution = data.contribution * data.contributionPeriod * (data.contributionType === 'monthly' ? 12 : 1);
            assets += data.surrenderValue;
          }
          break;
        case 'bank':
          if (data.planType === 'saving') {
            // Saving accounts are treated as flexible funds (liquid cash), not as assets
            // They are handled in calculateAccumulatedFlexibleFunds
            break;
          } else {
            // For fixed deposits: show contribution as asset during lock-in period (only if already owned)
            const lockInYears = data.lockInPeriod / 12;
            const yearsSinceStart = age - data.startAge;
            if (yearsSinceStart >= 0 && yearsSinceStart < lockInYears && data.alreadyOwned === 'Y') {
              // Show the contribution amount as an asset during lock-in period (only for already owned)
              assets += data.contribution;
            }
            // After lock-in period, the total amount moves to flexible funds (handled in calculateAccumulatedFlexibleFunds)
            // and the contribution amount is removed from assets
          }
          break;
        case 'annuity':
          // Annuities are income products, not assets
          return 0;
        case 'own_living':
          // Calculate mortgage amount and monthly payment based on down payment percentage
          const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
          const mortgageAmount = data.purchasePrice - downPaymentAmount;
          
          // Use actual mortgage interest rate and completion age from data
          const mortgageTerm = Math.max(1, data.mortgageCompletionAge - data.mortgageStartAge); // Minimum 1 year
          const interestRate = data.mortgageInterestRate / 100;
          const monthlyInterestRate = interestRate / 12;
          const numberOfPayments = mortgageTerm * 12;
          
          // Calculate monthly payment using mortgage formula
          const monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          
          const paidUpAge = data.mortgageCompletionAge;
          
          // Down payment is money spent, not an asset
          // It's handled as negative flexible funds instead
          
          // Check if property is sold at this age
          if (data.sellAge !== 'willNotSell' && age >= parseInt(data.sellAge)) {
            // Property is sold, no longer an asset (sale proceeds go to flexible funds)
            break;
          }
          
          // Calculate property equity (what user actually owns)
          if (age >= data.mortgageStartAge) {
            // Calculate how many payments have been made so far
            const paymentsMade = Math.min((age - data.mortgageStartAge) * 12, numberOfPayments);
            
            // Calculate total mortgage payments made
            const totalPaymentsMade = monthlyPayment * paymentsMade;
            
            // Calculate total interest paid so far
            const totalInterestPaid = totalPaymentsMade - (mortgageAmount * (paymentsMade / numberOfPayments));
            
            // Calculate remaining mortgage balance
            const totalPaid = monthlyPayment * paymentsMade;
            const remainingBalance = Math.max(0, mortgageAmount - (totalPaid * (mortgageAmount / (monthlyPayment * numberOfPayments))));
            
            // Calculate property equity: 購買價格 - 剩餘按揭
            const propertyEquity = data.purchasePrice - remainingBalance;
            
            // Apply property value growth to equity: (購買價格 - 剩餘按揭) × (1 + 物業價值增長%)^年數
            const propertyValueGrowth = (data.propertyValueGrowth || 1) / 100; // Default to 1% if not set
            const yearsSincePurchase = age - data.mortgageStartAge;
            
            // Total property value: (購買價格 - 剩餘按揭) × (1 + 物業價值增長%)^年數
            // This matches the card summary: 供完樓時物業價值 = 購買價格 × (1.01)^年數
            const totalPropertyValue = propertyEquity * Math.pow(1 + propertyValueGrowth, yearsSincePurchase);
            
            // Debug: Log the calculation for verification
            console.log(`PROPERTY DEBUG Age ${age}: Purchase Price=${data.purchasePrice}, Remaining Mortgage=${remainingBalance}, Property Equity=${propertyEquity}, Growth Rate=${propertyValueGrowth}, Years Since Purchase=${yearsSincePurchase}, Total Property Value=${totalPropertyValue}`);
            
            // Check if property is sold
            if (data.sellAge !== 'willNotSell' && age >= parseInt(data.sellAge)) {
              // Property is sold, no longer an asset (sale proceeds go to flexible funds)
              break;
            } else {
              // Property is still owned, add total property value
              assets += totalPropertyValue;
            }
          }
          break;
      }
    });

    return assets;
  };

  const calculateAccumulatedLiabilities = (age) => {
    let accumulatedLiabilities = 0;
    
    // Only calculate liabilities for the current age, not accumulate from previous years
    products.forEach(product => {
      const { subType, data } = product;
      
      // Add remaining mortgage balance as liability (for display purposes only)
      if (subType === 'own_living') {
        // Calculate mortgage amount and monthly payment based on down payment percentage
        const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
        const mortgageAmount = data.purchasePrice - downPaymentAmount;
        
        // Use actual mortgage interest rate and completion age from data
        const mortgageTerm = Math.max(1, data.mortgageCompletionAge - data.mortgageStartAge);
        const interestRate = data.mortgageInterestRate / 100;
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = mortgageTerm * 12;
        
        // Calculate monthly payment using mortgage formula
        const monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        
        const paidUpAge = data.mortgageCompletionAge;
        
        // Check if property is sold before mortgage completion
        if (data.sellAge !== 'willNotSell' && parseInt(data.sellAge) < paidUpAge) {
          // Property sold early - show remaining balance until sale age, then remove it
          if (age >= data.mortgageStartAge && age < parseInt(data.sellAge)) {
            // Show remaining balance during mortgage period
            const paymentsMade = (age - data.mortgageStartAge) * 12;
            const remainingPayments = numberOfPayments - paymentsMade;
            const remainingBalance = mortgageAmount * (Math.pow(1 + monthlyInterestRate, remainingPayments) - 1) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
            accumulatedLiabilities += remainingBalance;
          }
          // At sale age and after: mortgage is paid off, no liability
        } else {
          // Normal mortgage - show remaining balance if still paying
          if (age >= data.mortgageStartAge && age < paidUpAge) {
            // Simple and reliable mortgage balance calculation
            const paymentsMade = (age - data.mortgageStartAge) * 12;
            const totalPaid = monthlyPayment * paymentsMade;
            
            // Calculate remaining balance using simple linear amortization
            // This is more reliable than complex formulas
            const remainingBalance = Math.max(0, mortgageAmount - (totalPaid * (mortgageAmount / (monthlyPayment * numberOfPayments))));
            
            // Add remaining mortgage balance as current liability (for display only)
            accumulatedLiabilities += remainingBalance;
          }
        }
      }
      
      // Add bank fixed deposit contributions as liabilities if not already owned
      if (subType === 'bank' && data.planType === 'fixed' && data.alreadyOwned === 'N') {
        if (age === data.startAge) {
          accumulatedLiabilities += data.contribution;
        }
      }

      // Rental payments are now handled in flexible funds as negative value
      // Removed from liabilities calculation

      // Fund investment amount is now handled in flexible funds as negative value
      // Removed from liabilities calculation

      // Annuities are insurance products, not liabilities - contributions are expenses, not debts
      // The annuity contribution is already handled as an expense in calculateTotalExpenses
      // and reduces liquid assets in calculateAccumulatedFlexibleFunds
    });

    return accumulatedLiabilities;
  };

  const calculateTotalLiabilities = (age) => {
    let liabilities = 0;
    
    products.forEach(product => {
      const { subType, data } = product;
      
      // Add remaining mortgage balance as liability (for display purposes only)
      if (subType === 'own_living') {
        // Calculate mortgage amount and monthly payment based on down payment percentage
        const downPaymentAmount = data.purchasePrice * (data.downPayment / 100);
        const mortgageAmount = data.purchasePrice - downPaymentAmount;
        
        // Use actual mortgage interest rate and completion age from data
        const mortgageTerm = Math.max(1, data.mortgageCompletionAge - data.mortgageStartAge);
        const interestRate = data.mortgageInterestRate / 100;
        const monthlyInterestRate = interestRate / 12;
        const numberOfPayments = mortgageTerm * 12;
        
        // Calculate monthly payment using mortgage formula
        const monthlyPayment = mortgageAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        
        const paidUpAge = data.mortgageCompletionAge;
        
        // Check if property is sold before mortgage completion
        if (data.sellAge !== 'willNotSell' && parseInt(data.sellAge) < paidUpAge) {
          // Property sold early - show remaining balance until sale age, then remove it
          if (age >= data.mortgageStartAge && age < parseInt(data.sellAge)) {
            // Show remaining balance during mortgage period
            const paymentsMade = (age - data.mortgageStartAge) * 12;
            const remainingPayments = numberOfPayments - paymentsMade;
            const remainingBalance = mortgageAmount * (Math.pow(1 + monthlyInterestRate, remainingPayments) - 1) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
            liabilities += remainingBalance;
          }
          // At sale age and after: mortgage is paid off, no liability
        } else {
          // Normal mortgage - show remaining balance if still paying
          if (age >= data.mortgageStartAge && age < paidUpAge) {
            // Simple and reliable mortgage balance calculation
            const paymentsMade = (age - data.mortgageStartAge) * 12;
            const totalPaid = monthlyPayment * paymentsMade;
            
            // Calculate remaining balance using simple linear amortization
            // This is more reliable than complex formulas
            const remainingBalance = Math.max(0, mortgageAmount - (totalPaid * (mortgageAmount / (monthlyPayment * numberOfPayments))));
            
            // Add remaining mortgage balance as current liability (for display only)
            liabilities += remainingBalance;
          }
        }
      }
      
      // Add bank fixed deposit contributions as liabilities if not already owned
      if (subType === 'bank' && data.planType === 'fixed' && data.alreadyOwned === 'N') {
        if (age === data.startAge) {
          liabilities += data.contribution;
        }
      }

      // Rental payments are now handled in flexible funds as negative value
      // Removed from liabilities calculation

      // Annuities are insurance products, not liabilities - contributions are expenses, not debts
      // The annuity contribution is already handled as an expense in calculateTotalExpenses
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

    // Calculate real asset allocation based on products
    products.forEach(product => {
      const productValue = calculateProductValueAtAge(product, age);
      
      switch (product.subType) {
        case 'funds':
        case 'mpf':
          allocation.investments += productValue;
          break;
        case 'saving_plans':
        case 'bank':
        case 'annuity':
          allocation.cash += productValue;
          break;
        case 'own_living':
        case 'rental':
        case 'owner_to_rent_out':
          allocation.property += productValue;
          break;
        default:
          allocation.other += productValue;
      }
    });

    // Add current assets to cash
    allocation.cash += currentAssets;

    // Calculate total and convert to percentages
    const total = allocation.property + allocation.cash + allocation.investments + allocation.other;
    
    if (total > 0) {
      allocation.property = allocation.property / total;
      allocation.cash = allocation.cash / total;
      allocation.investments = allocation.investments / total;
      allocation.other = allocation.other / total;
    }

    return allocation;
  };

  const calculateIncomeSources = (age) => {
    const incomeSources = {
      workIncome: 0,
      fundIncome: 0,
      mpfIncome: 0,
      savingIncome: 0,
      bankIncome: 0,
      retirementIncome: 0,
      rentalIncome: 0
    };

    // Calculate work income from MPF card
    const mpfProduct = products.find(product => product.subType === 'mpf');
    if (mpfProduct && age < retirementAge) {
      const monthlySalary = mpfProduct.data.monthlySalary || 0;
      if (monthlySalary > 0) {
        // Apply salary increment from MPF card - start from current age
        const currentAge = mpfProduct.data.currentAge || analysisPeriod.start;
        
        // Only start salary from current age onwards
        if (age >= currentAge) {
          const yearsSinceStart = age - currentAge;
          const salaryWithIncrement = monthlySalary * Math.pow(1 + (mpfProduct.data.salaryIncrement || 0) / 100, yearsSinceStart);
          incomeSources.workIncome = salaryWithIncrement;
        }
      }
    }

    // Calculate income from each product type
    products.forEach(product => {
      const data = product.data;
      
      switch (product.subType) {
        case 'funds':
          if (data.fundCategory === 'dividend') {
            // 派息基金：從第一年開始每月派息，計入投資收益，直到預期提取年齡
            if (age >= data.startAge && age < data.expectedWithdrawalAge) {
              const monthlyDividend = data.investmentAmount * (data.expectedReturn / 100) / 12;
              incomeSources.fundIncome += monthlyDividend * 12; // Annual dividend income
            }
          }
          // 增長基金：不計入投資收益，收益累積在資產中
          break;
          
        case 'mpf':
          if (age >= 65) {
            // Start MPF withdrawal
            const mpfResult = calculateMPF(data);
            incomeSources.mpfIncome += mpfResult.totalMPF * 0.04; // 4% withdrawal rate
          }
          break;
          
        case 'saving_plans':
          if (age >= data.surrenderAge) {
            // Start receiving from saving plans
            const totalContribution = data.contribution * data.contributionPeriod * (data.contributionType === 'monthly' ? 12 : 1);
            const totalDividendsEarned = data.surrenderValue - totalContribution + data.withdrawalAmount;
            incomeSources.savingIncome += (data.surrenderValue / 12); // Monthly payout from surrender value
          }
          break;
          
        case 'bank':
          if (age >= data.withdrawalAge) {
            // Start bank interest income
            const bankValue = data.contribution * 12 * (data.withdrawalAge - data.startAge) * (1 + data.interestRate / 100);
            incomeSources.bankIncome += bankValue * (data.interestRate / 100) / 12; // Monthly interest
          }
          break;
          
        case 'retirement_funds':
          if (age >= data.completionAge) {
            // Hong Kong Annuity Plan calculation
            const premium = data.contributionAmount;
            const annuityStartAge = data.completionAge;
            const gender = data.gender || 'male';
            
            // Base rates per $1,000,000 premium at age 60 (Hong Kong Annuity Plan rates)
            const baseRateMale = 5100; // $5,100 per month for male
            const baseRateFemale = 4700; // $4,700 per month for female
            
            // Age adjustment factor (simplified - older age gets higher monthly payout)
            const ageAdjustment = Math.pow(1.05, annuityStartAge - 60);
            
            // Gender factor
            const genderFactor = gender === 'male' ? baseRateMale : baseRateFemale;
            
            // Calculate monthly annuity
            const monthlyAnnuity = (premium / 1000000) * genderFactor * ageAdjustment;
            
            incomeSources.retirementIncome += monthlyAnnuity;
          }
          break;
          
        case 'annuity':
          // Hong Kong Annuity Plan calculation
          let totalPremium;
          
          if (data.annuityType === 'deferred') {
            // 延期年金：每年供款 × 供款年期
            totalPremium = data.annualContribution * data.contributionPeriod;
          } else {
            // 即期年金：一次性供款
            totalPremium = data.contributionAmount;
          }
          
          const annuityStartAge = data.annuityStartAge;
          const gender = data.gender || 'male';
          
          // Base rates per $1,000,000 premium at age 60 (Hong Kong Annuity Plan rates)
          const baseRateMale = 5100; // $5,100 per month for male
          const baseRateFemale = 4700; // $4,700 per month for female
          
          // Age adjustment factor (simplified - older age gets higher monthly payout)
          const ageAdjustment = Math.pow(1.05, annuityStartAge - 60);
          
          // Gender factor
          const genderFactor = gender === 'male' ? baseRateMale : baseRateFemale;
          
          // Calculate monthly annuity
          const monthlyAnnuity = (totalPremium / 1000000) * genderFactor * ageAdjustment;
          
          // Add to retirement income if age is at or after annuity start age
          if (age >= annuityStartAge) {
            incomeSources.retirementIncome += monthlyAnnuity;
          }
          break;
          
        case 'rental':
          // Rental expenses - no income from rental expenses
          break;
          
        case 'owner_to_rent_out':
          // Rental income from owned property
          incomeSources.rentalIncome += data.rentAmount * 12;
          break;
      }
    });

    // Work income (before retirement)
    if (age < retirementAge) {
      incomeSources.workIncome = 50000 * 12; // Example salary, should be configurable
    }

    return [
      incomeSources.workIncome,
      incomeSources.fundIncome,
      incomeSources.mpfIncome,
      incomeSources.savingIncome,
      incomeSources.bankIncome,
      incomeSources.retirementIncome,
      incomeSources.rentalIncome
    ];
  };

  const calculateProductValueAtAge = (product, age) => {
    const data = product.data;
    
    switch (product.subType) {
      case 'funds':
        // Only return value if before expected withdrawal age
        if (age >= data.expectedWithdrawalAge) return 0;
        
        // Calculate value at specific age
        const yearsFromStart = age - data.startAge;
        if (yearsFromStart <= 0) return 0;
        
        if (data.fundCategory === 'growth') {
          // 增長基金：投資金額 + 累積收益 = 總資產
          return data.investmentAmount * Math.pow(1 + data.expectedReturn / 100, yearsFromStart);
        } else {
          // 派息基金：投資金額 = 總資產（收益以派息形式發放）
          return data.investmentAmount;
        }
        
      case 'mpf':
        // Only return value if before age 65
        if (age >= 65) return 0;
        
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
        // Calculate value at specific age
        const yearsFromSavingStart = age - data.startAge;
        if (yearsFromSavingStart <= 0) return 0;
        if (yearsFromSavingStart >= savingYears) return data.surrenderValue;
        // For intermediate ages, calculate proportional value
        const totalContribution = data.contribution * data.contributionPeriod * (data.contributionType === 'monthly' ? 12 : 1);
        const proportion = yearsFromSavingStart / savingYears;
        return totalContribution * proportion;
        
      case 'bank':
        if (!data || !data.withdrawalAge || !data.startAge || !data.contribution || !data.interestRate) return 0;
        const bankYears = data.withdrawalAge - data.startAge;
        const bankValue = data.contribution * 12 * bankYears * (1 + data.interestRate / 100);
        // Calculate value at specific age
        const yearsFromBankStart = age - data.startAge;
        if (yearsFromBankStart <= 0) return 0;
        if (yearsFromBankStart >= bankYears) return bankValue;
        return data.contribution * 12 * yearsFromBankStart * (1 + data.interestRate / 100);
        
      case 'retirement_funds':
        if (!data || !data.contributionFrequency || !data.contributionAmount || !data.completionAge || !data.startAge || !data.expectedReturn) return 0;
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
        // Property value with appreciation
        if (!data || !data.purchaseAge || !data.purchasePrice) return 0;
        const propertyYears = age - data.purchaseAge;
        if (propertyYears <= 0) return 0;
        const propertyAppreciation = 0.03; // 3% annual appreciation
        return data.purchasePrice * Math.pow(1 + propertyAppreciation, propertyYears);
        
      case 'rental':
        // Rental doesn't contribute to asset value, only income
        return 0;
        
      case 'owner_to_rent_out':
        // Property value with appreciation
        if (!data || !data.ownershipStartAge || !data.purchasePrice) return 0;
        const ownerPropertyYears = age - data.ownershipStartAge;
        if (ownerPropertyYears <= 0) return 0;
        const ownerPropertyAppreciation = 0.03; // 3% annual appreciation
        return data.purchasePrice * Math.pow(1 + ownerPropertyAppreciation, ownerPropertyYears);
        
      case 'annuity':
        // Annuities are income products, not assets
        return 0;
        
      default:
        return 0;
    }
  };



  const showFormulaInfo = (field) => {
    const currentAge = analysisPeriod.start;
    const currentExpenseBreakdown = window.currentExpenseBreakdown || {};
    
    const formulas = {
      totalMonthlyIncome: {
        title: '總月收入計算公式',
        formula: `(月薪 × (1 + 年薪增幅)^年數) - 僱員供款（僅適用於65歲及以下）\n\n當前${currentAge}歲詳細計算：\n工作收入：${currentAge < retirementAge ? '強積金卡月薪（考慮年薪增幅）' : '已退休'}\n僱員供款：${currentAge < retirementAge && currentAge <= 65 ? '月薪 × 僱員供款百分比（考慮供款上限）' : currentAge > 65 ? '無（65歲後無需供款）' : '無'}\n\n注意：工作收入持續至指定退休年齡，僱員供款扣除僅適用於65歲及以下，並應用強積金供款上限（月薪≥30,000時上限1,500，月薪<7,100時無供款）`,
        description: '工作收入持續至指定退休年齡，僅在65歲及以下時扣除僱員供款百分比，僅包括來自強積金卡片的月薪'
      },
      monthlyPassiveIncome: {
        title: '月被動收入計算公式',
        formula: `投資收益 + 租金收入 + 年金收入\n\n當前${currentAge}歲詳細計算：\n派息基金收益：基金本金 × 年回報率 ÷ 12\n強積金：MPF餘額 × 提取率\n銀行利息：存款餘額 × 年利率 ÷ 12\n租金收入：月租金收入\n年金收入：每月年金（從年金開始年齡到預期壽命）\n\n注意：增長基金不計入被動收入，收益累積在資產中。年金收入從年金開始年齡開始，持續到預期壽命`,
        description: '無需工作即可獲得的收入，包括派息基金分紅、租金、退休金、年金等。增長基金收益不計入被動收入，而是累積在資產價值中。年金收入從年金開始年齡開始，持續到預期壽命。'
      },
      totalExpenses: {
        title: '月開支計算公式',
        formula: `基本開支 + 產品相關開支\n\n當前${currentAge}歲詳細計算：\n基本開支：${formatCurrency(currentExpenseBreakdown.manualExpenses || 0)} (考慮${inflationRate}%通脹)\n租金開支：${formatCurrency(currentExpenseBreakdown.rentalExpenses || 0)}\n按揭供款：${formatCurrency(currentExpenseBreakdown.mortgageExpenses || 0)}\n銀行供款：${formatCurrency(currentExpenseBreakdown.bankContributions || 0)}\n儲蓄計劃供款：${formatCurrency(currentExpenseBreakdown.savingPlanContributions || 0)}\n年金供款：${formatCurrency(currentExpenseBreakdown.annuityContributions || 0)}\n\n總開支：${formatCurrency((currentExpenseBreakdown.manualExpenses || 0) + (currentExpenseBreakdown.rentalExpenses || 0) + (currentExpenseBreakdown.mortgageExpenses || 0) + (currentExpenseBreakdown.bankContributions || 0) + (currentExpenseBreakdown.savingPlanContributions || 0) + (currentExpenseBreakdown.annuityContributions || 0))}`,
        description: '包括基本生活開支（考慮通脹）和所有產品相關的供款開支'
      },
      netCashFlow: {
        title: '淨現金流計算公式',
        formula: `總月收入 - 總月開支\n\n當前${currentAge}歲：\n總月收入：${formatCurrency(calculateTotalIncome(currentAge))}\n總月開支：${formatCurrency(calculateTotalExpenses(currentAge))}\n淨現金流：${formatCurrency(calculateTotalIncome(currentAge) - calculateTotalExpenses(currentAge))}`,
        description: '每月實際可支配的現金，正值表示有盈餘，負值表示需要動用儲蓄'
      },
      totalAssets: {
        title: '總資產計算公式',
        formula: `當前資產 + 投資增長 + 物業增值 + 儲蓄累積 + 定期存款（鎖定期內，僅限已擁有）\n\n當前${currentAge}歲詳細計算：\n當前資產：${formatCurrency(currentAssets)}\n基金價值：基金本金 × (1 + 年回報率)^投資年數\n強積金：MPF累積金額\n儲蓄計劃：${currentAge >= 65 ? '退保金額' : '累積供款'}\n定期存款：鎖定期內顯示供款金額（僅限已擁有），未擁有則為0\n物業價值：購買價格 × (1 + 升值率)^持有年數\n\n注意：定期存款在鎖定期後轉入年度靈活資金，並從淨資產中扣除供款金額`,
        description: '包括現金、投資組合、物業價值、儲蓄、定期存款（鎖定期內，僅限已擁有）等所有資產的總和'
      },
              totalLiabilities: {
          title: '總負債計算公式',
          formula: `累積負債總和（從最早產品開始年齡到當前年齡）- 物業售樓收益\n\n當前${currentAge}歲詳細計算：\n總負債：${formatCurrency(calculateAccumulatedLiabilities(currentAge))}\n\n包括：\n- 基金投資金額（在開始年齡時）\n- 按揭供款（從開始年齡到供完樓年齡）\n- 租金開支（從租約開始到結束年齡）\n- 銀行供款（固定存款）\n- 年金供款（延期年金期間）\n- 物業售樓收益（如適用，用於抵消負債）`,
          description: '從最早產品開始年齡到當前年齡期間已發生的負債總和，包括基金投資、按揭、租金、銀行供款、年金供款等，減去物業售樓收益'
        },
              netWorth: {
          title: '淨資產計算公式',
          formula: `總資產 + 年度靈活資金\n\n當前${currentAge}歲：\n總資產：${formatCurrency(calculateTotalAssets(currentAge))}\n年度靈活資金：${formatCurrency(calculateAccumulatedFlexibleFunds(currentAge))}\n淨資產：${formatCurrency(calculateTotalAssets(currentAge) + calculateAccumulatedFlexibleFunds(currentAge))}\n\n注意：淨資產代表總體財富，包括所有資產和流動現金，總負債仍會單獨顯示供參考`,
          description: '實際擁有的財富總額，包括所有資產和流動現金，是財務狀況的重要指標'
        },
      accumulatedFlexibleFunds: {
        title: '年度靈活資金計算公式',
        formula: `當前資產 + 累積淨現金流 + 基金派息 + 基金提取 + 強積金提取 + 定期存款到期 + 儲蓄戶口（目標儲蓄金額，如有足夠剩餘資金）\n\n當前${currentAge}歲：\n當前資產：${formatCurrency(currentAssets)}\n累積淨現金流：${formatCurrency(calculateAccumulatedFlexibleFunds(currentAge) - currentAssets)}\n年度靈活資金：${formatCurrency(calculateAccumulatedFlexibleFunds(currentAge))}\n\n注意：此金額代表可靈活使用的現金，包括基金派息、基金提取、強積金提取（65歲時全額轉入）、定期存款到期（本金+利息）和儲蓄戶口（僅在有足夠剩餘資金時儲蓄目標金額）的資金`,
        description: '可靈活使用的現金總額，包括當前資產、累積的淨現金流、基金派息、基金提取、強積金提取、定期存款到期和儲蓄戶口的資金（儲蓄金額取決於剩餘資金）'
      },

    };
    
    setCurrentFormula(formulas[field] || { title: '未知', formula: '無公式', description: '無描述' });
    setShowFormulaDialog(true);
  };

  const showChartFormulaInfo = (chartType) => {
    const currentAge = analysisPeriod.start;
    const currentExpenseBreakdown = window.currentExpenseBreakdown || {};
    
    const chartFormulas = {
      financialTrend: {
        title: '財務趨勢圖說明',
        formula: `淨資產 = 總資產 + 年度靈活資金\n被動收入 = 投資收益 + 租金收入 + 退休金收入 + 年金收入\n年開支 = 月開支 × 12\n\n當前${currentAge}歲詳細數據：\n淨資產：${formatCurrency(calculateTotalAssets(currentAge) + calculateAccumulatedFlexibleFunds(currentAge))}\n被動收入：${formatCurrency(calculatePassiveIncome(currentAge) * 12)}/年\n年開支：${formatCurrency(calculateTotalExpenses(currentAge) * 12)}/年`,
        description: '此圖表顯示隨年齡變化的財務狀況趨勢。淨資產反映總體財富，被動收入顯示無需工作的收入來源，年開支則反映生活成本。通過觀察這些線條的變化，可以評估財務規劃的有效性和退休準備度。'
      },
      assetAllocation: {
        title: '資產配置說明',
        formula: `物業 = 自住物業 + 投資物業價值\n現金 = 當前資產 + 儲蓄計劃 + 銀行存款\n投資 = 基金 + 強積金\n其他 = 其他資產\n\n當前${currentAge}歲資產配置：\n物業：${formatCurrency(calculateProductValueAtAge({ subType: 'own_living' }, currentAge) + calculateProductValueAtAge({ subType: 'rental' }, currentAge))}\n現金：${formatCurrency(currentAssets + calculateProductValueAtAge({ subType: 'saving_plans' }, currentAge) + calculateProductValueAtAge({ subType: 'bank' }, currentAge))}\n投資：${formatCurrency(calculateProductValueAtAge({ subType: 'funds' }, currentAge) + calculateProductValueAtAge({ subType: 'mpf' }, currentAge))}`,
        description: '此圖表顯示在選定年齡時的資產分配比例。物業包括自住和投資物業的價值，現金包括流動資產和儲蓄，投資包括基金和強積金。良好的資產配置有助於分散風險和優化回報。'
      },
      incomeSources: {
        title: '收入來源分析說明',
        formula: `工作收入 = 強積金卡月薪 × (1 + 年薪增幅)^年數\n派息基金收益 = 基金本金 × 年回報率\n強積金 = MPF餘額 × 提取率\n儲蓄計劃 = 累積儲蓄 ÷ 12\n銀行利息 = 存款餘額 × 利率 ÷ 12\n年金收入 = 每月年金（從年金開始年齡到預期壽命）\n租金收入 = 月租金 × 12\n\n當前${currentAge}歲收入來源：\n工作收入：${currentAge < retirementAge ? '強積金卡月薪（考慮年薪增幅）' : '已退休'}\n派息基金收益：${formatCurrency(calculateProductValueAtAge({ subType: 'funds', data: { fundCategory: 'dividend', investmentAmount: 100000, expectedReturn: 6 } }, currentAge) * 0.06 / 12)}/月\n強積金：${formatCurrency(calculateProductValueAtAge({ subType: 'mpf' }, currentAge) * 0.04 / 12)}/月\n銀行利息：${formatCurrency(calculateProductValueAtAge({ subType: 'bank' }, currentAge) * 0.03 / 12)}/月\n年金收入：每月年金（從年金開始年齡到預期壽命）\n租金收入：${formatCurrency(calculateProductValueAtAge({ subType: 'rental' }, currentAge) / 12)}/月\n\n注意：增長基金不計入收入來源，收益累積在資產中`,
        description: '此圖表顯示在選定年齡時各收入來源的年度金額。工作收入來自強積金卡的月薪（考慮年薪增幅），在退休前提供主要收入，退休後則依賴派息基金收益、儲蓄提取、年金收入和租金收入。增長基金收益不計入收入來源，而是累積在資產價值中。'
      }
    };
    
    setCurrentFormula(chartFormulas[chartType] || { title: '未知', formula: '無公式', description: '無描述' });
    setShowFormulaDialog(true);
  };

  useEffect(() => {
    calculateFinancialProjection();
  }, [products, retirementAge, inflationRate, currentAssets, expenses, analysisPeriod]);

  const chartData = {
    line: {
      labels: financialData.map(d => `${d.age}${t('financialPlanning.yearsOld')}`),
      datasets: [
        {
          label: t('financialPlanning.totalMonthlyIncome'),
          data: financialData.map(d => d.totalMonthlyIncome),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        },
        {
          label: t('financialPlanning.passiveIncome'),
          data: financialData.map(d => d.monthlyPassiveIncome * 12),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1
        },
        {
          label: t('financialPlanning.monthlyExpenses'),
          data: financialData.map(d => d.totalExpenses * 12),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1
        }
      ]
    },
    pie: {
      labels: [t('financialPlanning.flexibleFunds'), t('financialPlanning.totalAssets')],
      datasets: [{
        data: [calculateAccumulatedFlexibleFunds(selectedAge), calculateTotalAssets(selectedAge)],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ]
      }]
    },
    bar: {
      labels: [t('financialPlanning.workIncome'), t('financialPlanning.investmentIncome'), t('financialPlanning.rentalIncome'), t('financialPlanning.bankReturn'), t('financialPlanning.mpfIncome')],
      datasets: [{
        label: t('financialPlanning.incomeSources'),
        data: [
          calculateTotalIncome(selectedAge),
          calculatePassiveIncome(selectedAge),
          calculateProductValueAtAge({ subType: 'rental' }, selectedAge) / 12,
          calculateProductValueAtAge({ subType: 'bank' }, selectedAge) * 0.03 / 12,
          calculateProductValueAtAge({ subType: 'mpf' }, selectedAge) * 0.04 / 12
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ]
      }]
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Configuration Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">{t('financialPlanning.financialAnalysis')}</h2>
          <button
            onClick={calculateFinancialProjection}
            disabled={isCalculating}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm lg:text-base"
          >
            {isCalculating ? t('financialPlanning.calculating') : `🔄 ${t('financialPlanning.recalculate')}`}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('financialPlanning.retirementAge')}</label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('financialPlanning.inflationRate')}</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value) || 2)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('financialPlanning.currentAssets')}</label>
            <input
              type="number"
              value={currentAssets}
              onChange={(e) => setCurrentAssets(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('financialPlanning.analysisPeriod')}</label>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="number"
                  value={analysisPeriod.start}
                  onChange={(e) => setAnalysisPeriod({...analysisPeriod, start: parseInt(e.target.value) || 65})}
                  className="flex-1 sm:w-20 border border-gray-300 rounded-lg px-3 py-2 text-center sm:text-left"
                  min="18"
                  max="120"
                  placeholder="開始年齡"
                />
                <span className="self-center text-center">{t('financialPlanning.to')}</span>
                <input
                  type="number"
                  value={analysisPeriod.end}
                  onChange={(e) => setAnalysisPeriod({...analysisPeriod, end: parseInt(e.target.value) || 75})}
                  className="flex-1 sm:w-20 border border-gray-300 rounded-lg px-3 py-2 text-center sm:text-left"
                  min="18"
                  max="120"
                  placeholder="結束年齡"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAnalysisPeriod({start: 65, end: 75})}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  {t('financialPlanning.retirementPeriod')}
                </button>
                <button
                  onClick={() => setAnalysisPeriod({start: 60, end: 90})}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  {t('financialPlanning.longTerm')}
                </button>
                <button
                  onClick={() => setAnalysisPeriod({start: 30, end: 65})}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  {t('financialPlanning.workingPeriod')}
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

      {/* Report Generation Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('financialPlanning.reportGeneration')}</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex-1">
            <p className="text-gray-600 mb-4">
              {t('financialPlanning.reportGenerationDescription')}
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${clientName.trim() ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-600">{t('financialPlanning.clientName')}: {clientName.trim() ? t('financialPlanning.completed') : t('financialPlanning.required')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${products.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-600">{t('financialPlanning.products')}: {products.length > 0 ? t('financialPlanning.completed') : t('financialPlanning.required')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${financialData.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm text-gray-600">{t('financialPlanning.financialAnalysis')}: {financialData.length > 0 ? t('financialPlanning.completed') : t('financialPlanning.required')}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onShowPDFReport}
              disabled={!clientName.trim() || products.length === 0 || financialData.length === 0}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              📄 {t('financialPlanning.generateReport')}
            </button>
          </div>
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
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">年度財務狀況</h2>
              <div className="text-xs sm:text-sm text-gray-500">
                分析期間: {analysisPeriod.start}歲 - {analysisPeriod.end}歲 ({analysisPeriod.end - analysisPeriod.start + 1}年)
              </div>
            </div>
            
            {/* Mobile: Card view */}
            <div className="block lg:hidden space-y-3">
              {financialData.map((data, index) => (
                <div key={data.age} className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{data.age}歲</h3>
                    <span className="text-xs text-gray-500">年齡</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">總月收入:</span>
                      <div className="font-medium">{formatCurrency(data.totalMonthlyIncome)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">被動收入:</span>
                      <div className="font-medium">{formatCurrency(data.monthlyPassiveIncome * 12)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">月開支:</span>
                      <div className="font-medium">{formatCurrency(data.totalExpenses * 12)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">淨現金流:</span>
                      <div className={`font-medium ${data.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.netCashFlow)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">總負債:</span>
                      <div className="font-medium text-red-600">{formatCurrency(data.totalLiabilities)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">淨資產:</span>
                      <div className={`font-medium ${data.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.netWorth)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">年度靈活資金:</span>
                      <div className={`font-medium ${data.accumulatedFlexibleFunds >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.accumulatedFlexibleFunds)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop: Table view */}
            <div className="hidden lg:block overflow-x-auto">
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
                        <span>總負債</span>
                        <button
                          onClick={() => showFormulaInfo('totalLiabilities')}
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
                        <span>年度靈活資金</span>
                        <button
                          onClick={() => showFormulaInfo('accumulatedFlexibleFunds')}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.totalLiabilities)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.netWorth)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.accumulatedFlexibleFunds)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-bold text-gray-900">財務趨勢圖</h3>
                <button
                  onClick={() => showChartFormulaInfo('financialTrend')}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="查看圖表說明"
                >
                  ℹ️
                </button>
              </div>
              <div className="h-64 lg:h-80">
                <Line data={chartData.line} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 12,
                        padding: 8,
                        font: {
                          size: 11
                        }
                      }
                    },
                    title: {
                      display: true,
                      text: '淨資產、被動收入與開支趨勢',
                      font: {
                        size: 14
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
                }} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-bold text-gray-900">資產配置</h3>
                <button
                  onClick={() => showChartFormulaInfo('assetAllocation')}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="查看圖表說明"
                >
                  ℹ️
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">選擇年齡</label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {financialData.map(data => (
                    <option key={data.age} value={data.age}>{data.age}歲</option>
                  ))}
                </select>
              </div>
              <div className="h-64 lg:h-80">
                <Pie data={chartData.pie} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 8,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>

          {/* Income Sources Chart */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base lg:text-lg font-bold text-gray-900">收入來源分析</h3>
              <button
                onClick={() => showChartFormulaInfo('incomeSources')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="查看圖表說明"
              >
                ℹ️
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">選擇年齡</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {financialData.map(data => (
                  <option key={data.age} value={data.age}>{data.age}歲</option>
                ))}
              </select>
            </div>
            <div className="h-64 lg:h-80">
              <Bar data={chartData.bar} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      boxWidth: 12,
                      padding: 8,
                      font: {
                        size: 11
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: '各收入來源年度金額',
                    font: {
                      size: 14
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                      font: {
                        size: 10
                      }
                    }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value);
                      },
                      font: {
                        size: 10
                      }
                    }
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
                  <div className="text-blue-800 font-mono text-sm whitespace-pre-line">{currentFormula.formula}</div>
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
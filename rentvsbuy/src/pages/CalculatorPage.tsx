import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Home, DollarSign, TrendingUp } from 'lucide-react';

interface CalculatorInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  initialRent: number;
  rentIncreaseRate: number;
  propertyTaxRate: number;
  homeInsurance: number;
  maintenanceRate: number;
  hoaFees: number;
}

interface CalculationResults {
  buying: {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    homeValue: number;
    netWorth: number;
  };
  renting: {
    totalRentPaid: number;
    netWorth: number;
  };
  difference: {
    netWorthDifference: number;
    monthlyDifference: number;
    breakEvenYear: number;
  };
}

const CalculatorPage = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    homePrice: 100000,
    downPayment: 5000,
    interestRate: 10.0,
    loanTerm: 30,
    initialRent: 1000,
    rentIncreaseRate: 6.0,
    propertyTaxRate: 1.2,
    homeInsurance: 1200,
    maintenanceRate: 1.0,
    hoaFees: 0
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculateMortgage = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (
    Math.pow(1 + monthlyRate, numPayments) - 1);
    return monthlyPayment;
  };

  const calculateAmortization = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = calculateMortgage(principal, rate, years);

    let balance = principal;
    let totalInterest = 0;
    const payments = [];

    for (let i = 0; i < numPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      totalInterest += interestPayment;

      payments.push({
        payment: i + 1,
        principalPayment,
        interestPayment,
        balance: Math.max(0, balance),
        totalInterest
      });
    }

    return { payments, totalInterest };
  };

  const calculateResults = (): CalculationResults => {
    const years = inputs.loanTerm;
    const loanAmount = inputs.homePrice - inputs.downPayment;
    const downPaymentAmount = inputs.downPayment;

    // Mortgage calculations
    const monthlyMortgage = calculateMortgage(loanAmount, inputs.interestRate, years);
    const { totalInterest } = calculateAmortization(loanAmount, inputs.interestRate, years);

    // Additional monthly costs for homeownership
    const monthlyPropertyTax = inputs.homePrice * inputs.propertyTaxRate / 100 / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyMaintenance = inputs.homePrice * inputs.maintenanceRate / 100 / 12;
    const monthlyHOA = inputs.hoaFees;

    const totalMonthlyOwnership = monthlyMortgage + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + monthlyHOA;

    // Home value appreciation (assuming 3% annually)
    const homeAppreciationRate = 3.0;
    const finalHomeValue = inputs.homePrice * Math.pow(1 + homeAppreciationRate / 100, years);

    // Calculate total costs over 30 years
    const totalMortgagePayments = monthlyMortgage * years * 12;
    const totalPropertyTax = monthlyPropertyTax * years * 12;
    const totalInsurance = monthlyInsurance * years * 12;
    const totalMaintenance = monthlyMaintenance * years * 12;
    const totalHOA = monthlyHOA * years * 12;

    const totalOwnershipCosts = downPaymentAmount + totalMortgagePayments + totalPropertyTax +
    totalInsurance + totalMaintenance + totalHOA;

    // Net worth when buying = home value (since mortgage is paid off, you own the home outright)
    const netWorthBuying = finalHomeValue;

    // Renting calculations
    let totalRentPaid = 0;
    let currentRent = inputs.initialRent;

    for (let year = 1; year <= years; year++) {
      totalRentPaid += currentRent * 12;
      currentRent *= 1 + inputs.rentIncreaseRate / 100;
    }

    // Assuming renter invests down payment amount at 7% annually
    const investmentReturn = downPaymentAmount * Math.pow(1.07, years);
    const netWorthRenting = investmentReturn;

    // Calculate break-even point
    // The break-even point is when the net worth from buying exceeds the net worth from renting
    let breakEvenYear = 0;
    let cumulativeRent = 0;
    let cumulativeOwnership = downPaymentAmount;
    let rentAmount = inputs.initialRent;

    for (let year = 1; year <= years; year++) {
      cumulativeRent += rentAmount * 12;
      cumulativeOwnership += totalMonthlyOwnership * 12;

      // Home value after appreciation
      const yearHomeValue = inputs.homePrice * Math.pow(1 + homeAppreciationRate / 100, year);

      // Calculate remaining loan balance for this year
      const remainingLoanBalance = year < years ? loanAmount - loanAmount / years * year : 0;

      // Net worth when buying = home value - remaining mortgage debt
      const ownershipNetWorth = yearHomeValue - Math.max(0, loanAmount - (monthlyMortgage * 12 * year - totalInterest * (year / years)));

      // Net worth when renting = investment growth of down payment - total rent paid
      const rentingNetWorth = downPaymentAmount * Math.pow(1.07, year) - cumulativeRent;

      if (ownershipNetWorth > rentingNetWorth && breakEvenYear === 0) {
        breakEvenYear = year;
      }

      rentAmount *= 1 + inputs.rentIncreaseRate / 100;
    }

    return {
      buying: {
        monthlyPayment: totalMonthlyOwnership,
        totalInterest,
        totalCost: totalOwnershipCosts,
        homeValue: finalHomeValue,
        netWorth: netWorthBuying
      },
      renting: {
        totalRentPaid,
        netWorth: netWorthRenting
      },
      difference: {
        netWorthDifference: netWorthBuying - (netWorthRenting - totalRentPaid),
        monthlyDifference: totalMonthlyOwnership - inputs.initialRent,
        breakEvenYear
      }
    };
  };

  useEffect(() => {
    setResults(calculateResults());
  }, [inputs]);

  const updateInput = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" data-id="3o59x08sg" data-path="src/pages/CalculatorPage.tsx">
      <main className="container mx-auto py-8 px-4" data-id="ys7gh2dox" data-path="src/pages/CalculatorPage.tsx">
        <div className="text-center mb-8" data-id="6y7zj0tl7" data-path="src/pages/CalculatorPage.tsx">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent" data-id="38q5zidel" data-path="src/pages/CalculatorPage.tsx">
            30-Year Financial Comparison: Rent vs Buy Calculator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-id="qyzug9w6i" data-path="src/pages/CalculatorPage.tsx">
            Compare the long-term financial impact of buying vs renting to make an informed decision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-id="pbpnwda3t" data-path="src/pages/CalculatorPage.tsx">
          {/* Input Form */}
          <div className="lg:col-span-1" data-id="sl6xjtdai" data-path="src/pages/CalculatorPage.tsx">
            <Card className="sticky top-4" data-id="zg87lne58" data-path="src/pages/CalculatorPage.tsx">
              <CardHeader data-id="1r62dqc2i" data-path="src/pages/CalculatorPage.tsx">
                <CardTitle className="flex items-center space-x-2" data-id="xf8rmzk7k" data-path="src/pages/CalculatorPage.tsx">
                  <Home className="h-5 w-5" data-id="1szkzatda" data-path="src/pages/CalculatorPage.tsx" />
                  <span data-id="ihbnss5ga" data-path="src/pages/CalculatorPage.tsx">Calculator Inputs</span>
                </CardTitle>
                <CardDescription data-id="dy0qswar6" data-path="src/pages/CalculatorPage.tsx">
                  Adjust the values to match your situation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="vyh12xmia" data-path="src/pages/CalculatorPage.tsx">
                <div className="space-y-2" data-id="1y8eru1t8" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="homePrice" data-id="24ry7airu" data-path="src/pages/CalculatorPage.tsx">Home Purchase Price</Label>
                  <Input
                    id="homePrice"
                    type="number"
                    value={inputs.homePrice}
                    onChange={(e) => updateInput('homePrice', Number(e.target.value))}
                    className="text-right" data-id="w8f7sxube" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <div className="space-y-2" data-id="4vkn73zxa" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="downPayment" data-id="uqqb5up8q" data-path="src/pages/CalculatorPage.tsx">Down Payment ($)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={inputs.downPayment}
                    onChange={(e) => updateInput('downPayment', Number(e.target.value))}
                    min="0"
                    max={inputs.homePrice}
                    className="text-right" data-id="ty3bwvtkx" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <div className="space-y-2" data-id="swz46coyq" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="interestRate" data-id="4j50pkl6e" data-path="src/pages/CalculatorPage.tsx">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={inputs.interestRate}
                    onChange={(e) => updateInput('interestRate', Number(e.target.value))}
                    className="text-right" data-id="p6ocsectk" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <Separator data-id="nq2inxnok" data-path="src/pages/CalculatorPage.tsx" />

                <div className="space-y-2" data-id="djlett2sn" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="initialRent" data-id="ssw7gma3z" data-path="src/pages/CalculatorPage.tsx">Initial Monthly Rent</Label>
                  <Input
                    id="initialRent"
                    type="number"
                    value={inputs.initialRent}
                    onChange={(e) => updateInput('initialRent', Number(e.target.value))}
                    className="text-right" data-id="lixjzcsef" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <div className="space-y-2" data-id="kk79xi4ob" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="rentIncreaseRate" data-id="yzuyd348v" data-path="src/pages/CalculatorPage.tsx">Annual Rent Increase (%)</Label>
                  <Input
                    id="rentIncreaseRate"
                    type="number"
                    step="0.1"
                    value={inputs.rentIncreaseRate}
                    onChange={(e) => updateInput('rentIncreaseRate', Number(e.target.value))}
                    className="text-right" data-id="o9q4wl448" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <Separator data-id="kwdoxckbq" data-path="src/pages/CalculatorPage.tsx" />

                <div className="space-y-2" data-id="qz6hia3ci" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="propertyTaxRate" data-id="smbnmneak" data-path="src/pages/CalculatorPage.tsx">Property Tax Rate (%)</Label>
                  <Input
                    id="propertyTaxRate"
                    type="number"
                    step="0.1"
                    value={inputs.propertyTaxRate}
                    onChange={(e) => updateInput('propertyTaxRate', Number(e.target.value))}
                    className="text-right" data-id="pmhsl60jz" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <div className="space-y-2" data-id="p5mxr9rxe" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="homeInsurance" data-id="qmc366e3d" data-path="src/pages/CalculatorPage.tsx">Annual Home Insurance</Label>
                  <Input
                    id="homeInsurance"
                    type="number"
                    value={inputs.homeInsurance}
                    onChange={(e) => updateInput('homeInsurance', Number(e.target.value))}
                    className="text-right" data-id="801q39y96" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <div className="space-y-2" data-id="2lzyx3jbx" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="maintenanceRate" data-id="fdwi3zzj6" data-path="src/pages/CalculatorPage.tsx">Annual Maintenance (%)</Label>
                  <Input
                    id="maintenanceRate"
                    type="number"
                    step="0.1"
                    value={inputs.maintenanceRate}
                    onChange={(e) => updateInput('maintenanceRate', Number(e.target.value))}
                    className="text-right" data-id="yuojidc28" data-path="src/pages/CalculatorPage.tsx" />

                </div>

                <div className="space-y-2" data-id="9aw3ou7ne" data-path="src/pages/CalculatorPage.tsx">
                  <Label htmlFor="hoaFees" data-id="zek1ptc0g" data-path="src/pages/CalculatorPage.tsx">Monthly HOA Fees</Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    value={inputs.hoaFees}
                    onChange={(e) => updateInput('hoaFees', Number(e.target.value))}
                    className="text-right" data-id="1ldy831fw" data-path="src/pages/CalculatorPage.tsx" />

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6" data-id="fissxrvj1" data-path="src/pages/CalculatorPage.tsx">
            {results &&
            <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="pkjrcswl2" data-path="src/pages/CalculatorPage.tsx">
                  <Card className="border-green-200 bg-green-50" data-id="bymhkfvgq" data-path="src/pages/CalculatorPage.tsx">
                    <CardHeader className="pb-3" data-id="75o6erkf2" data-path="src/pages/CalculatorPage.tsx">
                      <CardTitle className="text-green-700 flex items-center space-x-2" data-id="r8l0vl67b" data-path="src/pages/CalculatorPage.tsx">
                        <Home className="h-5 w-5" data-id="n37o9xxpo" data-path="src/pages/CalculatorPage.tsx" />
                        <span data-id="0t12b3tne" data-path="src/pages/CalculatorPage.tsx">Buying</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent data-id="ueh44cnf2" data-path="src/pages/CalculatorPage.tsx">
                      <div className="space-y-2" data-id="c7mcijhhh" data-path="src/pages/CalculatorPage.tsx">
                        <div className="flex justify-between" data-id="atmlojh2f" data-path="src/pages/CalculatorPage.tsx">
                          <span className="text-sm" data-id="3b61egf0f" data-path="src/pages/CalculatorPage.tsx">Monthly Payment:</span>
                          <span className="font-medium" data-id="l2e5bqktl" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.buying.monthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between" data-id="ji9yjlzsr" data-path="src/pages/CalculatorPage.tsx">
                          <span className="text-sm" data-id="nrxmvw9a9" data-path="src/pages/CalculatorPage.tsx">Amount Spent After 30 Years:</span>
                          <span className="font-bold text-green-700" data-id="1abx5n6wu" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.buying.totalCost)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50" data-id="7l3qbj6oh" data-path="src/pages/CalculatorPage.tsx">
                    <CardHeader className="pb-3" data-id="lju9zxq9q" data-path="src/pages/CalculatorPage.tsx">
                      <CardTitle className="text-blue-700 flex items-center space-x-2" data-id="xttbjdfhp" data-path="src/pages/CalculatorPage.tsx">
                        <DollarSign className="h-5 w-5" data-id="xjupm0kp7" data-path="src/pages/CalculatorPage.tsx" />
                        <span data-id="ka0rlqp21" data-path="src/pages/CalculatorPage.tsx">Renting</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent data-id="efjl91lu2" data-path="src/pages/CalculatorPage.tsx">
                      <div className="space-y-2" data-id="ahf00zuff" data-path="src/pages/CalculatorPage.tsx">
                        <div className="flex justify-between" data-id="d32bnn89h" data-path="src/pages/CalculatorPage.tsx">
                          <span className="text-sm" data-id="7ccmu508h" data-path="src/pages/CalculatorPage.tsx">Initial Monthly Rent:</span>
                          <span className="font-medium" data-id="ts8gnumyr" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(inputs.initialRent)}</span>
                        </div>
                        <div className="flex justify-between" data-id="ke6fnv3yn" data-path="src/pages/CalculatorPage.tsx">
                          <span className="text-sm" data-id="ldavoe10j" data-path="src/pages/CalculatorPage.tsx">Amount Spent After 30 Years:</span>
                          <span className="font-bold text-blue-700" data-id="1y1p75jlr" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.renting.totalRentPaid)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Metrics */}
                <Card data-id="vsrc0r32f" data-path="src/pages/CalculatorPage.tsx">
                  <CardHeader data-id="s03xew27o" data-path="src/pages/CalculatorPage.tsx">
                    <CardTitle className="flex items-center space-x-2" data-id="t0k0fvd22" data-path="src/pages/CalculatorPage.tsx">
                      <TrendingUp className="h-5 w-5" data-id="wrarshlek" data-path="src/pages/CalculatorPage.tsx" />
                      <span data-id="gn36d8brr" data-path="src/pages/CalculatorPage.tsx">Key Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent data-id="i7a8vff2g" data-path="src/pages/CalculatorPage.tsx">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="t63v7royh" data-path="src/pages/CalculatorPage.tsx">
                      <div className="text-center" data-id="pr0ln2y4s" data-path="src/pages/CalculatorPage.tsx">
                        <div className="text-2xl font-bold mb-2" data-id="56i7hr60x" data-path="src/pages/CalculatorPage.tsx">
                          {results.buying.totalCost - results.renting.totalRentPaid <= 0 ?
                        <span className="text-green-600" data-id="ow1kee37m" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(Math.abs(results.buying.totalCost - results.renting.totalRentPaid))}</span> :

                        <span className="text-red-600" data-id="baxuzmz56" data-path="src/pages/CalculatorPage.tsx">+{formatCurrency(results.buying.totalCost - results.renting.totalRentPaid)}</span>
                        }
                        </div>
                        <div className="text-sm text-gray-600" data-id="f7bc4vna1" data-path="src/pages/CalculatorPage.tsx">Spending Difference</div>
                        <Badge variant={results.buying.totalCost - results.renting.totalRentPaid <= 0 ? "default" : "destructive"} className="mt-1" data-id="6jy2ay22p" data-path="src/pages/CalculatorPage.tsx">
                          {results.buying.totalCost - results.renting.totalRentPaid <= 0 ? "Buying Costs Less" : "Renting Costs Less"}
                        </Badge>
                      </div>

                      <div className="text-center" data-id="0ui1frgpv" data-path="src/pages/CalculatorPage.tsx">
                        <div className="text-2xl font-bold mb-2" data-id="466rkpx8t" data-path="src/pages/CalculatorPage.tsx">
                          {results.difference.monthlyDifference >= 0 ?
                        <span className="text-red-600" data-id="y7066cgfb" data-path="src/pages/CalculatorPage.tsx">+{formatCurrency(results.difference.monthlyDifference)}</span> :

                        <span className="text-green-600" data-id="ab1hw5glh" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(Math.abs(results.difference.monthlyDifference))}</span>
                        }
                        </div>
                        <div className="text-sm text-gray-600" data-id="r2h341z3d" data-path="src/pages/CalculatorPage.tsx">Monthly Cost Difference</div>
                        <Badge variant="outline" className="mt-1" data-id="9ekanb76g" data-path="src/pages/CalculatorPage.tsx">
                          {results.difference.monthlyDifference >= 0 ? "Higher" : "Lower"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="l5psn076h" data-path="src/pages/CalculatorPage.tsx">
                  <Card data-id="x8klwp62t" data-path="src/pages/CalculatorPage.tsx">
                    <CardHeader data-id="bimcwbafn" data-path="src/pages/CalculatorPage.tsx">
                      <CardTitle className="text-green-700" data-id="6k8p8hyx6" data-path="src/pages/CalculatorPage.tsx">Buying Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3" data-id="4577rmc9r" data-path="src/pages/CalculatorPage.tsx">
                      <div className="flex justify-between" data-id="d65j64l9d" data-path="src/pages/CalculatorPage.tsx">
                        <span data-id="n7yxqow5p" data-path="src/pages/CalculatorPage.tsx">Home Value (Equity) After 30 Years:</span>
                        <span className="font-medium" data-id="xro06j5xm" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.buying.homeValue)}</span>
                      </div>
                      <div className="flex justify-between" data-id="vbg9c51xi" data-path="src/pages/CalculatorPage.tsx">
                        <span data-id="60hp9736l" data-path="src/pages/CalculatorPage.tsx">Total Interest Paid After 30 Years:</span>
                        <span className="font-medium" data-id="8tpw6e8de" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.buying.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between" data-id="ou07isu7i" data-path="src/pages/CalculatorPage.tsx">
                        <span data-id="ym5a8009p" data-path="src/pages/CalculatorPage.tsx">Total Cost Of Ownership After 30 Years:</span>
                        <span className="font-medium" data-id="8ab9jsbok" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.buying.totalCost)}</span>
                      </div>

                    </CardContent>
                  </Card>

                  <Card data-id="xozga5bzu" data-path="src/pages/CalculatorPage.tsx">
                    <CardHeader data-id="ixyep6ncw" data-path="src/pages/CalculatorPage.tsx">
                      <CardTitle className="text-blue-700" data-id="tus1kzhk9" data-path="src/pages/CalculatorPage.tsx">Renting Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3" data-id="cm0eg6zzh" data-path="src/pages/CalculatorPage.tsx">
                      <div className="flex justify-between" data-id="nubjuz4x0" data-path="src/pages/CalculatorPage.tsx">
                        <span data-id="g5x7bbpcy" data-path="src/pages/CalculatorPage.tsx">Total Rent Paid After 30 Years:</span>
                        <span className="font-medium" data-id="6epsfr4nk" data-path="src/pages/CalculatorPage.tsx">{formatCurrency(results.renting.totalRentPaid)}</span>
                      </div>
                      <div className="flex justify-between" data-id="v0h3331sl" data-path="src/pages/CalculatorPage.tsx">
                        <span data-id="2fl8lvzny" data-path="src/pages/CalculatorPage.tsx">Monthly Rent After 30 Years:</span>
                        <span className="font-medium" data-id="t5dehz287" data-path="src/pages/CalculatorPage.tsx">
                          {formatCurrency(inputs.initialRent * Math.pow(1 + inputs.rentIncreaseRate / 100, 30))}
                        </span>
                      </div>
                      <div className="flex justify-between" data-id="24qdq4u2t" data-path="src/pages/CalculatorPage.tsx">
                        <span data-id="c27v0y0v3" data-path="src/pages/CalculatorPage.tsx">Total Equity After 30 Years:</span>
                        <span className="font-medium" data-id="8gp39irrw" data-path="src/pages/CalculatorPage.tsx">$0</span>
                      </div>

                    </CardContent>
                  </Card>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg" data-id="ls2jos3pd" data-path="src/pages/CalculatorPage.tsx">
                  <p className="text-sm text-gray-600 text-center italic" data-id="ti9sg26ds" data-path="src/pages/CalculatorPage.tsx">
                    These are all hypothetical numbers based on historic national averages. Actual numbers can vary depending on location. This tool is meant to give you an idea of renting vs buying but this may not be accurate due to many factors.
                  </p>
                </div>
              </>
            }
          </div>
        </div>
      </main>
    </div>);

};

export default CalculatorPage;
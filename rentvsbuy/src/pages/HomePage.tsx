import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, Home, DollarSign } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" data-id="40cxkkdms" data-path="src/pages/HomePage.tsx">
      <header className="py-6 px-8 bg-white/80 backdrop-blur-sm border-b shadow-sm" data-id="shkbudwtu" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto flex justify-between items-center" data-id="k67qecnge" data-path="src/pages/HomePage.tsx">
          <div className="flex items-center space-x-2" data-id="d9t6un4le" data-path="src/pages/HomePage.tsx">
            <Calculator className="h-6 w-6 text-blue-600" data-id="ufq9v7avb" data-path="src/pages/HomePage.tsx" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent" data-id="tv82jszfa" data-path="src/pages/HomePage.tsx">Financial Calculator Hub</h1>
          </div>
          <nav className="space-x-4" data-id="jyxjl1nmd" data-path="src/pages/HomePage.tsx">
            <Button variant="link" data-id="kik5xlkiv" data-path="src/pages/HomePage.tsx">Home</Button>
            <Button variant="outline" onClick={() => navigate('/calculator')} data-id="vki92b9my" data-path="src/pages/HomePage.tsx">
              <Calculator className="h-4 w-4 mr-2" data-id="g4us1yucr" data-path="src/pages/HomePage.tsx" />
              Calculator
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4" data-id="qdkxgn6qo" data-path="src/pages/HomePage.tsx">
        <section className="text-center max-w-4xl mx-auto mb-16" data-id="ccejq00wp" data-path="src/pages/HomePage.tsx">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent" data-id="foz8y5vap" data-path="src/pages/HomePage.tsx">
            Rent vs Buy Calculator
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-id="6d2mnqgu0" data-path="src/pages/HomePage.tsx">
            Make informed decisions about your housing future with our comprehensive 30-year financial comparison tool
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/calculator')}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg" data-id="0o76mm3tv" data-path="src/pages/HomePage.tsx">

            <Calculator className="h-5 w-5 mr-2" data-id="irhawjnpj" data-path="src/pages/HomePage.tsx" />
            Start Calculating
          </Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" data-id="x0kvnxwg3" data-path="src/pages/HomePage.tsx">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300" data-id="ry9tfgyz7" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center space-x-3 mb-4" data-id="lemc6fkkr" data-path="src/pages/HomePage.tsx">
              <div className="p-2 bg-blue-100 rounded-lg" data-id="rggaklxvk" data-path="src/pages/HomePage.tsx">
                <Home className="h-6 w-6 text-blue-600" data-id="ez1d5yrxa" data-path="src/pages/HomePage.tsx" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800" data-id="twstvzuie" data-path="src/pages/HomePage.tsx">Home Ownership Analysis</h3>
            </div>
            <p className="text-gray-600" data-id="vyyo2go3p" data-path="src/pages/HomePage.tsx">
              Calculate mortgage payments, equity building, property taxes, insurance, and maintenance costs over 30 years.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300" data-id="wql055ltv" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center space-x-3 mb-4" data-id="lnrnq19ee" data-path="src/pages/HomePage.tsx">
              <div className="p-2 bg-green-100 rounded-lg" data-id="gtazlggsk" data-path="src/pages/HomePage.tsx">
                <DollarSign className="h-6 w-6 text-green-600" data-id="q4xbn63kx" data-path="src/pages/HomePage.tsx" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800" data-id="5gn881uar" data-path="src/pages/HomePage.tsx">Rental Cost Projection</h3>
            </div>
            <p className="text-gray-600" data-id="8hdqpnq6f" data-path="src/pages/HomePage.tsx">
              Factor in annual rent increases at 6% per year and opportunity cost of down payment investments.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300" data-id="e19c8vwfl" data-path="src/pages/HomePage.tsx">
            <div className="flex items-center space-x-3 mb-4" data-id="rdkuddlkv" data-path="src/pages/HomePage.tsx">
              <div className="p-2 bg-purple-100 rounded-lg" data-id="kx4upxpv1" data-path="src/pages/HomePage.tsx">
                <Calculator className="h-6 w-6 text-purple-600" data-id="960c02pcy" data-path="src/pages/HomePage.tsx" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800" data-id="6qlht10rl" data-path="src/pages/HomePage.tsx">Net Worth Comparison</h3>
            </div>
            <p className="text-gray-600" data-id="mzvyqvm8s" data-path="src/pages/HomePage.tsx">
              See your projected net worth after 30 years and find the break-even point for your investment.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-auto bg-white/60 backdrop-blur-sm" data-id="nqhv3lb0e" data-path="src/pages/HomePage.tsx">
        <div className="container mx-auto px-4 text-center text-gray-500" data-id="d3k8d2jx0" data-path="src/pages/HomePage.tsx">
          <p data-id="if42s8q30" data-path="src/pages/HomePage.tsx">© {new Date().getFullYear()} Financial Calculator Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>);

};

export default HomePage;
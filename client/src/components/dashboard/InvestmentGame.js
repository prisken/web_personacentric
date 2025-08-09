import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const InvestmentGame = () => {
  const { t } = useTranslation();
  const [portfolio, setPortfolio] = useState({
    cash: 100000,
    stocks: [],
    totalValue: 100000
  });
  const [marketData, setMarketData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  // Mock market data for initial development
  const mockStocks = [
    { id: 1, symbol: '台積電', price: 580, change: 2.5, volume: 1000000 },
    { id: 2, symbol: '鴻海', price: 105, change: -1.2, volume: 500000 },
    { id: 3, symbol: '聯發科', price: 820, change: 1.8, volume: 300000 },
    { id: 4, symbol: '中鋼', price: 28, change: 0.5, volume: 800000 },
    { id: 5, symbol: '長榮', price: 178, change: -0.8, volume: 400000 }
  ];

  useEffect(() => {
    // Initialize market data
    setMarketData(mockStocks);

    // TODO: Set up real-time market data updates
    const interval = setInterval(() => {
      updateMarketPrices();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMarketPrices = () => {
    setMarketData(prevData => 
      prevData.map(stock => ({
        ...stock,
        price: stock.price * (1 + (Math.random() * 0.06 - 0.03)), // Random price change ±3%
        change: (Math.random() * 4 - 2) // Random change ±2%
      }))
    );
  };

  const handleBuy = () => {
    if (!selectedStock || !tradeAmount || tradeAmount <= 0) return;

    const amount = Number(tradeAmount);
    const stock = marketData.find(s => s.id === selectedStock);
    const totalCost = amount * stock.price;

    if (totalCost > portfolio.cash) {
      alert('資金不足');
      return;
    }

    setPortfolio(prev => {
      const existingStock = prev.stocks.find(s => s.id === selectedStock);
      const updatedStocks = existingStock
        ? prev.stocks.map(s => 
            s.id === selectedStock 
              ? { ...s, shares: s.shares + amount }
              : s
          )
        : [...prev.stocks, { id: selectedStock, symbol: stock.symbol, shares: amount, avgPrice: stock.price }];

      return {
        cash: prev.cash - totalCost,
        stocks: updatedStocks,
        totalValue: prev.totalValue
      };
    });

    setTradeAmount('');
  };

  const handleSell = () => {
    if (!selectedStock || !tradeAmount || tradeAmount <= 0) return;

    const amount = Number(tradeAmount);
    const stock = marketData.find(s => s.id === selectedStock);
    const existingStock = portfolio.stocks.find(s => s.id === selectedStock);

    if (!existingStock || existingStock.shares < amount) {
      alert('持股不足');
      return;
    }

    const totalValue = amount * stock.price;

    setPortfolio(prev => {
      const updatedStocks = prev.stocks.map(s => {
        if (s.id === selectedStock) {
          const remainingShares = s.shares - amount;
          return remainingShares > 0 
            ? { ...s, shares: remainingShares }
            : null;
        }
        return s;
      }).filter(Boolean);

      return {
        cash: prev.cash + totalValue,
        stocks: updatedStocks,
        totalValue: prev.totalValue
      };
    });

    setTradeAmount('');
  };

  const calculateTotalValue = () => {
    const stocksValue = portfolio.stocks.reduce((total, stock) => {
      const currentPrice = marketData.find(m => m.id === stock.id)?.price || 0;
      return total + (stock.shares * currentPrice);
    }, 0);
    return portfolio.cash + stocksValue;
  };

  useEffect(() => {
    const newTotalValue = calculateTotalValue();
    setPortfolio(prev => ({ ...prev, totalValue: newTotalValue }));

    // Check win/lose conditions
    if (newTotalValue >= 200000) {
      setGameStatus('won');
    } else if (newTotalValue <= 50000) {
      setGameStatus('lost');
    }
  }, [marketData, portfolio.stocks, portfolio.cash]);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">投資組合</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">現金</p>
            <p className="text-2xl font-bold text-blue-600">
              ${portfolio.cash.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">股票市值</p>
            <p className="text-2xl font-bold text-green-600">
              ${(calculateTotalValue() - portfolio.cash).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">總資產</p>
            <p className="text-2xl font-bold text-purple-600">
              ${portfolio.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">市場行情</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  股票
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  價格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  漲跌
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  成交量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marketData.map((stock) => (
                <tr key={stock.id} className={selectedStock === stock.id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stock.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedStock(stock.id)}
                      className={`px-3 py-1 rounded ${
                        selectedStock === stock.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      選擇
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">交易操作</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(e.target.value)}
            placeholder="輸入股數"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            onClick={handleBuy}
            disabled={!selectedStock}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            買入
          </button>
          <button
            onClick={handleSell}
            disabled={!selectedStock}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            賣出
          </button>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">持股明細</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  股票
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  持股數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均成本
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  現價
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  損益
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.stocks.map((stock) => {
                const currentPrice = marketData.find(m => m.id === stock.id)?.price || 0;
                const profit = (currentPrice - stock.avgPrice) * stock.shares;
                const profitPercentage = ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100;

                return (
                  <tr key={stock.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stock.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${stock.avgPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${currentPrice.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Status Modal */}
      {gameStatus !== 'playing' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {gameStatus === 'won' ? '恭喜你贏得遊戲！' : '遊戲結束'}
            </h2>
            <p className="text-gray-600 mb-6">
              {gameStatus === 'won'
                ? '你的投資組合達到了 $200,000！你是個出色的投資者。'
                : '你的投資組合跌破了 $50,000。再接再厲！'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              重新開始
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentGame;
const { Quiz } = require('../models');

const quizSeeds = [
  {
    title: '投資理財基礎知識測驗',
    description: '測試你對基本投資理財概念的了解程度，包括儲蓄、投資、風險管理等主題。',
    category: '投資理財',
    max_points: 100,
    time_limit: 15,
    difficulty: 'easy',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    instructions: '請仔細閱讀每個問題，選擇最適合的答案。測驗時間為15分鐘。',
    passing_score: 70,
    questions: [
      {
        id: 1,
        question_text: '什麼是複利效應？',
        question_type: 'multiple_choice',
        options: [
          '只計算本金的利息',
          '利息再投資產生的額外收益',
          '固定利率的投資',
          '短期投資策略'
        ],
        correct_answer: '利息再投資產生的額外收益',
        points: 10
      },
      {
        id: 2,
        question_text: '以下哪個是分散投資的主要目的？',
        question_type: 'multiple_choice',
        options: [
          '提高投資報酬率',
          '降低投資風險',
          '減少投資成本',
          '增加投資種類'
        ],
        correct_answer: '降低投資風險',
        points: 10
      },
      {
        id: 3,
        question_text: '緊急基金應該準備多少個月的開銷？',
        question_type: 'multiple_choice',
        options: [
          '1-2個月',
          '3-6個月',
          '7-12個月',
          '12個月以上'
        ],
        correct_answer: '3-6個月',
        points: 10
      },
      {
        id: 4,
        question_text: '什麼是通貨膨脹？',
        question_type: 'multiple_choice',
        options: [
          '物價下跌',
          '物價上漲',
          '貨幣貶值',
          '經濟衰退'
        ],
        correct_answer: '物價上漲',
        points: 10
      },
      {
        id: 5,
        question_text: '以下哪個投資工具風險最高？',
        question_type: 'multiple_choice',
        options: [
          '定期存款',
          '政府債券',
          '股票',
          '貨幣市場基金'
        ],
        correct_answer: '股票',
        points: 10
      }
    ],
    scoring_rules: {
      bonus_points: {
        perfect_score: 10,
        time_bonus: 5
      }
    }
  },
  {
    title: '股票投資進階測驗',
    description: '深入測試你對股票市場、技術分析、基本面分析等進階投資知識的掌握。',
    category: '股票投資',
    max_points: 150,
    time_limit: 20,
    difficulty: 'medium',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
    instructions: '本測驗包含股票投資的進階概念，請仔細思考每個問題。測驗時間為20分鐘。',
    passing_score: 75,
    questions: [
      {
        id: 1,
        question_text: '什麼是P/E比率？',
        question_type: 'multiple_choice',
        options: [
          '股價與每股盈餘的比率',
          '股價與每股淨值的比率',
          '股價與每股現金流的比率',
          '股價與每股營收的比率'
        ],
        correct_answer: '股價與每股盈餘的比率',
        points: 15
      },
      {
        id: 2,
        question_text: '技術分析主要關注什麼？',
        question_type: 'multiple_choice',
        options: [
          '公司財務報表',
          '股價和交易量圖表',
          '經濟指標',
          '產業趨勢'
        ],
        correct_answer: '股價和交易量圖表',
        points: 15
      },
      {
        id: 3,
        question_text: '什麼是股息殖利率？',
        question_type: 'multiple_choice',
        options: [
          '年度股息除以股價',
          '年度股息除以每股盈餘',
          '季度股息除以股價',
          '股息除以股東權益'
        ],
        correct_answer: '年度股息除以股價',
        points: 15
      },
      {
        id: 4,
        question_text: '以下哪個是技術分析指標？',
        question_type: 'multiple_choice',
        options: [
          'ROE',
          'MACD',
          'ROA',
          'EPS'
        ],
        correct_answer: 'MACD',
        points: 15
      },
      {
        id: 5,
        question_text: '什麼是停損單？',
        question_type: 'multiple_choice',
        options: [
          '在特定價格買入股票的訂單',
          '在特定價格賣出股票的訂單',
          '限制損失的賣出訂單',
          '獲利了結的賣出訂單'
        ],
        correct_answer: '限制損失的賣出訂單',
        points: 15
      }
    ],
    scoring_rules: {
      bonus_points: {
        perfect_score: 15,
        time_bonus: 10
      }
    }
  },
  {
    title: '風險管理專業測驗',
    description: '測試你對投資風險管理、資產配置、投資組合理論等專業知識的理解。',
    category: '風險管理',
    max_points: 200,
    time_limit: 25,
    difficulty: 'hard',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    instructions: '這是一個高難度的風險管理測驗，需要深入理解投資理論。測驗時間為25分鐘。',
    passing_score: 80,
    questions: [
      {
        id: 1,
        question_text: '什麼是夏普比率？',
        question_type: 'multiple_choice',
        options: [
          '投資報酬率除以風險',
          '投資報酬率除以標準差',
          '超額報酬率除以標準差',
          '投資報酬率除以貝塔係數'
        ],
        correct_answer: '超額報酬率除以標準差',
        points: 20
      },
      {
        id: 2,
        question_text: '現代投資組合理論的核心概念是什麼？',
        question_type: 'multiple_choice',
        options: [
          '高風險高報酬',
          '分散投資降低風險',
          '擇時進出市場',
          '集中投資優質股票'
        ],
        correct_answer: '分散投資降低風險',
        points: 20
      },
      {
        id: 3,
        question_text: '什麼是VaR（Value at Risk）？',
        question_type: 'multiple_choice',
        options: [
          '投資組合的最大可能損失',
          '在特定信心水準下的最大可能損失',
          '投資組合的預期報酬率',
          '投資組合的風險調整後報酬率'
        ],
        correct_answer: '在特定信心水準下的最大可能損失',
        points: 20
      },
      {
        id: 4,
        question_text: '什麼是資產配置？',
        question_type: 'multiple_choice',
        options: [
          '選擇個別股票',
          '在不同資產類別間分配資金',
          '決定買賣時機',
          '分析公司基本面'
        ],
        correct_answer: '在不同資產類別間分配資金',
        points: 20
      },
      {
        id: 5,
        question_text: '什麼是再平衡？',
        question_type: 'multiple_choice',
        options: [
          '增加投資金額',
          '調整投資組合回到目標配置',
          '賣出所有投資',
          '轉換投資標的'
        ],
        correct_answer: '調整投資組合回到目標配置',
        points: 20
      }
    ],
    scoring_rules: {
      bonus_points: {
        perfect_score: 20,
        time_bonus: 15
      }
    }
  },
  {
    title: '退休規劃測驗',
    description: '測試你對退休規劃、年金、社會保險等退休相關財務知識的了解。',
    category: '退休規劃',
    max_points: 120,
    time_limit: 18,
    difficulty: 'medium',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    instructions: '本測驗涵蓋退休規劃的各個面向，幫助你了解如何為退休做準備。測驗時間為18分鐘。',
    passing_score: 70,
    questions: [
      {
        id: 1,
        question_text: '退休後需要多少錢主要取決於什麼？',
        question_type: 'multiple_choice',
        options: [
          '退休年齡',
          '預期壽命和退休後生活水準',
          '投資報酬率',
          '通貨膨脹率'
        ],
        correct_answer: '預期壽命和退休後生活水準',
        points: 12
      },
      {
        id: 2,
        question_text: '什麼是401(k)計劃？',
        question_type: 'multiple_choice',
        options: [
          '美國的退休儲蓄計劃',
          '香港的強積金計劃',
          '台灣的勞退新制',
          '日本的年金制度'
        ],
        correct_answer: '美國的退休儲蓄計劃',
        points: 12
      },
      {
        id: 3,
        question_text: '退休規劃應該從什麼時候開始？',
        question_type: 'multiple_choice',
        options: [
          '退休前5年',
          '退休前10年',
          '越早越好',
          '退休前20年'
        ],
        correct_answer: '越早越好',
        points: 12
      },
      {
        id: 4,
        question_text: '什麼是年金？',
        question_type: 'multiple_choice',
        options: [
          '一次性領取的退休金',
          '定期領取的退休收入',
          '投資型保險',
          '儲蓄型保險'
        ],
        correct_answer: '定期領取的退休收入',
        points: 12
      },
      {
        id: 5,
        question_text: '退休後投資組合應該如何調整？',
        question_type: 'multiple_choice',
        options: [
          '增加股票配置',
          '增加債券配置',
          '保持原有配置',
          '全部轉為現金'
        ],
        correct_answer: '增加債券配置',
        points: 12
      }
    ],
    scoring_rules: {
      bonus_points: {
        perfect_score: 12,
        time_bonus: 8
      }
    }
  },
  {
    title: '稅務規劃測驗',
    description: '測試你對投資稅務、節稅策略、稅務規劃等相關知識的掌握程度。',
    category: '稅務規劃',
    max_points: 100,
    time_limit: 15,
    difficulty: 'medium',
    image_url: 'https://images.unsplash.com/photo-1554224154-26032cdc-3047?w=400',
    instructions: '了解稅務規劃對投資決策的重要性，學習如何合法節稅。測驗時間為15分鐘。',
    passing_score: 70,
    questions: [
      {
        id: 1,
        question_text: '什麼是資本利得稅？',
        question_type: 'multiple_choice',
        options: [
          '對投資收益徵收的稅',
          '對工資收入徵收的稅',
          '對消費徵收的稅',
          '對財產徵收的稅'
        ],
        correct_answer: '對投資收益徵收的稅',
        points: 10
      },
      {
        id: 2,
        question_text: '長期持有股票通常有什麼稅務優惠？',
        question_type: 'multiple_choice',
        options: [
          '較低的資本利得稅率',
          '免稅',
          '延遲繳稅',
          '退稅'
        ],
        correct_answer: '較低的資本利得稅率',
        points: 10
      },
      {
        id: 3,
        question_text: '什麼是稅務損失收割？',
        question_type: 'multiple_choice',
        options: [
          '賣出虧損投資來抵銷獲利',
          '避免繳稅',
          '延遲繳稅',
          '逃稅'
        ],
        correct_answer: '賣出虧損投資來抵銷獲利',
        points: 10
      },
      {
        id: 4,
        question_text: '退休帳戶的稅務優惠是什麼？',
        question_type: 'multiple_choice',
        options: [
          '免稅提款',
          '延遲繳稅',
          '免稅投資',
          '退稅'
        ],
        correct_answer: '延遲繳稅',
        points: 10
      },
      {
        id: 5,
        question_text: '什麼是稅務效率投資？',
        question_type: 'multiple_choice',
        options: [
          '高報酬投資',
          '低稅負投資',
          '免稅投資',
          '延遲繳稅投資'
        ],
        correct_answer: '低稅負投資',
        points: 10
      }
    ],
    scoring_rules: {
      bonus_points: {
        perfect_score: 10,
        time_bonus: 5
      }
    }
  }
];

const seedQuizzes = async (adminUserId) => {
  try {
    console.log('🌱 Seeding quizzes...');
    
    for (const quizData of quizSeeds) {
      await Quiz.create({
        ...quizData,
        created_by: adminUserId,
        is_active: true
      });
    }
    
    console.log('✅ Quizzes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
  }
};

module.exports = { seedQuizzes, quizSeeds }; 
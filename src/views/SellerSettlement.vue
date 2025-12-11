<template>
  <main class="settlement-page">
    <div class="container">
      <div class="page-header">
        <h1>정산 결과</h1>
        <p>판매 정산 내역을 확인하실 수 있습니다</p>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <span class="card-label">이번 달 매출</span>
            <span class="card-value">₩{{ summary.monthlyRevenue.toLocaleString() }}</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">⏳</div>
          <div class="card-content">
            <span class="card-label">정산 예정 금액</span>
            <span class="card-value highlight">₩{{ summary.pendingAmount.toLocaleString() }}</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <span class="card-label">누적 정산 금액</span>
            <span class="card-value">₩{{ summary.totalSettled.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-group">
          <label>기간 선택</label>
          <select v-model="selectedPeriod" @change="filterSettlements">
            <option value="all">전체</option>
            <option value="thisMonth">이번 달</option>
            <option value="lastMonth">지난 달</option>
            <option value="last3Months">최근 3개월</option>
            <option value="last6Months">최근 6개월</option>
          </select>
        </div>
        <div class="filter-group">
          <label>상태</label>
          <select v-model="selectedStatus" @change="filterSettlements">
            <option value="all">전체</option>
            <option value="completed">정산 완료</option>
            <option value="pending">정산 예정</option>
            <option value="processing">처리 중</option>
          </select>
        </div>
      </div>

      <div class="settlement-table">
        <table>
          <thead>
            <tr>
              <th>정산일</th>
              <th>상품명</th>
              <th>판매 건수</th>
              <th>판매 금액</th>
              <th>수수료</th>
              <th>정산 금액</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredSettlements" :key="item.id">
              <td>{{ item.date }}</td>
              <td class="product-name">{{ item.productName }}</td>
              <td>{{ item.salesCount }}건</td>
              <td>₩{{ item.salesAmount.toLocaleString() }}</td>
              <td>₩{{ item.fee.toLocaleString() }}</td>
              <td class="amount">₩{{ item.settlementAmount.toLocaleString() }}</td>
              <td>
                <span class="status-badge" :class="item.status">
                  {{ item.statusText }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredSettlements.length === 0" class="empty-state">
        <p>정산 내역이 없습니다</p>
      </div>

      <div class="settlement-details">
        <div class="detail-card">
          <h3>정산 안내</h3>
          <ul class="info-list">
            <li>정산은 매월 1일과 15일에 진행됩니다</li>
            <li>정산 예정 금액은 다음 정산일에 입금됩니다</li>
            <li>수수료는 판매 금액의 5%입니다</li>
            <li>정산 문의는 고객센터로 연락주세요</li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'SellerSettlement',
  data() {
    return {
      selectedPeriod: 'all',
      selectedStatus: 'all',
      summary: {
        monthlyRevenue: 12500000,
        pendingAmount: 8500000,
        totalSettled: 45000000
      },
      settlements: [
        {
          id: 1,
          date: '2025-12-01',
          productName: '아이폰 15 Pro Max 256GB',
          salesCount: 45,
          salesAmount: 53550000,
          fee: 2677500,
          settlementAmount: 50872500,
          status: 'completed',
          statusText: '정산 완료'
        },
        {
          id: 2,
          date: '2025-11-15',
          productName: '나이키 에어맥스 운동화',
          salesCount: 78,
          salesAmount: 7722000,
          fee: 386100,
          settlementAmount: 7335900,
          status: 'completed',
          statusText: '정산 완료'
        },
        {
          id: 3,
          date: '2025-11-01',
          productName: '프리미엄 한우 세트',
          salesCount: 32,
          salesAmount: 1888000,
          fee: 94400,
          settlementAmount: 1793600,
          status: 'completed',
          statusText: '정산 완료'
        },
        {
          id: 4,
          date: '2025-12-15',
          productName: '갤럭시 워치6 클래식',
          salesCount: 18,
          salesAmount: 5382000,
          fee: 269100,
          settlementAmount: 5112900,
          status: 'pending',
          statusText: '정산 예정'
        },
        {
          id: 5,
          date: '2025-12-10',
          productName: '무선 이어폰 프로',
          salesCount: 12,
          salesAmount: 1668000,
          fee: 83400,
          settlementAmount: 1584600,
          status: 'processing',
          statusText: '처리 중'
        }
      ]
    }
  },
  computed: {
    filteredSettlements() {
      let filtered = [...this.settlements]

      // 기간 필터
if (this.selectedPeriod !== 'all') {
  const now = new Date();
  filtered = filtered.filter(item => {
    const itemDate = new Date(item.date);

    switch (this.selectedPeriod) {

      case 'thisMonth': {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      case 'lastMonth': {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return (
          itemDate.getMonth() === lastMonth.getMonth() &&
          itemDate.getFullYear() === lastMonth.getFullYear()
        );
      }

      case 'last3Months': {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
        return itemDate >= threeMonthsAgo;
      }

      case 'last6Months': {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6);
        return itemDate >= sixMonthsAgo;
      }

      default:
        return true;
    }
  });
}

      // 상태 필터
      if (this.selectedStatus !== 'all') {
        filtered = filtered.filter(item => item.status === this.selectedStatus)
      }

      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  methods: {
    filterSettlements() {
      // 필터링은 computed property에서 자동으로 처리됨
    }
  }
}
</script>

<style scoped>
.settlement-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.page-header p {
  color: #a0a0a0;
  font-size: 15px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  font-size: 40px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-label {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.card-value.highlight {
  color: #ffffff;
}

.filter-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.filter-group select {
  padding: 10px 14px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.filter-group select:focus {
  outline: none;
  border-color: #ffffff;
}

.settlement-table {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #0f0f0f;
}

th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
  border-bottom: 1px solid #2a2a2a;
}

td {
  padding: 16px;
  color: #e0e0e0;
  font-size: 14px;
  border-bottom: 1px solid #2a2a2a;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #222222;
}

.product-name {
  font-weight: 600;
  color: #ffffff;
}

.amount {
  font-weight: 700;
  color: #ffffff;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.completed {
  background: #2a2a2a;
  color: #51cf66;
}

.status-badge.pending {
  background: #2a2a2a;
  color: #ffd43b;
}

.status-badge.processing {
  background: #2a2a2a;
  color: #74c0fc;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.settlement-details {
  margin-top: 32px;
}

.detail-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
}

.detail-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-list li {
  color: #999;
  font-size: 14px;
  padding-left: 20px;
  position: relative;
}

.info-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ffffff;
}

@media (max-width: 900px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .settlement-table {
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }
}
</style>





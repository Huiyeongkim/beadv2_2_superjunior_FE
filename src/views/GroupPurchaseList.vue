<template>
  <main class="group-purchase-list-page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1>공동구매 목록</h1>
          <p>진행 중인 공동구매를 확인하세요</p>
        </div>
        <button v-if="isSeller" class="btn btn-primary" @click="goToCreate">
          + 공동구매 생성
        </button>
      </div>

      <div class="filters">
        <div class="filter-row">
          <div class="search">
            <input
              v-model.trim="keyword"
              type="search"
              placeholder="제목으로 검색"
              @keyup.enter="search"
            />
            <button class="btn btn-outline" @click="search">검색</button>
          </div>
          <div class="filter-actions">
            <select v-model="statusFilter" class="status-filter">
              <option value="">전체 상태</option>
              <option value="SCHEDULED">예정됨</option>
              <option value="OPEN">진행 중</option>
              <option value="SUCCESS">성공</option>
              <option value="FAILED">실패</option>
            </select>
            <select v-model="categoryFilter" class="category-filter">
              <option value="">전체 카테고리</option>
              <option value="전자제품">전자제품</option>
              <option value="패션">패션</option>
              <option value="식품">식품</option>
              <option value="뷰티">뷰티</option>
              <option value="홈/리빙">홈/리빙</option>
              <option value="기타">기타</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="filteredGroupPurchases.length === 0" class="empty-state">
        <p>조건에 맞는 공동구매가 없습니다.</p>
        <button v-if="isSeller" class="btn btn-primary" @click="goToCreate">공동구매 생성하기</button>
      </div>

      <div v-else class="group-purchase-grid">
        <article
          v-for="gp in filteredGroupPurchases"
          :key="gp.id"
          class="group-purchase-card"
          @click="goToDetail(gp.id)"
        >
          <div class="card-header">
            <div class="status-badge" :class="gp.status.toLowerCase()">
              {{ getStatusText(gp.status) }}
            </div>
            <span class="category">{{ gp.category }}</span>
          </div>
          <h3 class="title">{{ gp.title }}</h3>
          <p class="product-name">{{ gp.productName }}</p>
          <div class="seller-info">
            <span>판매자: {{ gp.seller }}</span>
          </div>
          <div class="price-info">
            <span class="discount-price">₩{{ gp.discountPrice.toLocaleString() }}</span>
            <span class="original-price">₩{{ gp.originalPrice.toLocaleString() }}</span>
          </div>
          <div class="quantity-info">
            <span>참여자: {{ gp.currentCount }}명</span>
            <span>목표: {{ gp.minQuantity }}~{{ gp.maxQuantity }}명</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${Math.min((gp.currentCount / gp.maxQuantity) * 100, 100)}%` }"
            ></div>
          </div>
          <div class="time-info">
            <span v-if="gp.endDate">
              {{ getTimeRemaining(gp.endDate) }}
            </span>
            <span v-else>기간 미정</span>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'GroupPurchaseList',
  data() {
    return {
      groupPurchases: [],
      keyword: '',
      statusFilter: '',
      categoryFilter: ''
    }
  },
  computed: {
    isSeller() {
      return localStorage.getItem('user_role') === 'seller'
    },
    filteredGroupPurchases() {
      let result = [...this.groupPurchases]

      if (this.keyword) {
        const keyword = this.keyword.toLowerCase()
        result = result.filter(
          (gp) =>
            gp.title.toLowerCase().includes(keyword) ||
            gp.productName.toLowerCase().includes(keyword) ||
            gp.seller.toLowerCase().includes(keyword)
        )
      }

      if (this.statusFilter) {
        result = result.filter((gp) => gp.status === this.statusFilter)
      }

      if (this.categoryFilter) {
        result = result.filter((gp) => gp.category === this.categoryFilter)
      }

      return result
    }
  },
  mounted() {
    this.loadGroupPurchases()
  },
  methods: {
    loadGroupPurchases() {
      this.groupPurchases = JSON.parse(localStorage.getItem('group_purchases') || '[]')
    },
    search() {
      // 검색은 computed에서 처리
    },
    getStatusText(status) {
      const statusMap = {
        SCHEDULED: '예정됨',
        OPEN: '진행 중',
        SUCCESS: '성공',
        FAILED: '실패'
      }
      return statusMap[status] || status
    },
    getTimeRemaining(endDate) {
      const now = new Date()
      const end = new Date(endDate)
      const diff = end - now

      if (diff < 0) return '종료됨'

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) return `${days}일 ${hours}시간 남음`
      if (hours > 0) return `${hours}시간 ${minutes}분 남음`
      return `${minutes}분 남음`
    },
    goToDetail(id) {
      this.$router.push({ name: 'group-purchase-detail', params: { id } })
    },
    goToCreate() {
      this.$router.push({ name: 'group-purchase-create' })
    }
  }
}
</script>

<style scoped>
.group-purchase-list-page {
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.page-header p {
  color: #999;
  font-size: 15px;
}

.filters {
  margin-bottom: 32px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 300px;
}

.search input {
  flex: 1;
  padding: 12px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
}

.search input:focus {
  outline: none;
  border-color: #ffffff;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.status-filter,
.category-filter {
  padding: 12px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0a0a0;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 18px;
}

.group-purchase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.group-purchase-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.group-purchase-card:hover {
  border-color: #4a4a4a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.scheduled {
  background: #f59f00;
  color: #fff3bf;
}

.status-badge.open {
  background: #51cf66;
  color: #d3f9d8;
}

.status-badge.success {
  background: #339af0;
  color: #d0ebff;
}

.status-badge.failed {
  background: #fa5252;
  color: #ffe3e3;
}

.category {
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.product-name {
  font-size: 14px;
  color: #a0a0a0;
  margin: 0 0 12px 0;
}

.seller-info {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.discount-price {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.original-price {
  font-size: 14px;
  color: #666;
  text-decoration: line-through;
}

.quantity-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #e0e0e0;
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background: #0f0f0f;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  border-radius: inherit;
  transition: width 0.3s;
}

.time-info {
  font-size: 13px;
  color: #999;
  text-align: right;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline {
  background: transparent;
  border: 1px solid #3a3a3a;
  color: #ffffff;
}

.btn-outline:hover {
  background: #2a2a2a;
  border-color: #4a4a4a;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .group-purchase-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .search {
    width: 100%;
  }
}
</style>


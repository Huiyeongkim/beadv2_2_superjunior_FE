<template>
  <main class="page">
    <div class="container">
      <h1>{{ isSeller ? '판매자 대시보드' : '마이페이지' }}</h1>
      
      <!-- 판매자 정산 결과 -->
      <div v-if="isSeller" class="seller-section">
        <div class="grid">
          <div class="panel">
            <h3>정산 현황</h3>
            <div class="settlement-summary">
              <div class="stat-card">
                <span class="stat-label">이번 달 매출</span>
                <span class="stat-value">₩{{ settlement.monthlyRevenue.toLocaleString() }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">정산 예정 금액</span>
                <span class="stat-value highlight">₩{{ settlement.pendingAmount.toLocaleString() }}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">누적 정산 금액</span>
                <span class="stat-value">₩{{ settlement.totalSettled.toLocaleString() }}</span>
              </div>
            </div>
          </div>
          
          <div class="panel">
            <h3>정산 내역</h3>
            <div class="settlement-list">
              <div v-for="item in settlement.history" :key="item.id" class="settlement-item">
                <div class="settlement-info">
                  <span class="settlement-date">{{ item.date }}</span>
                  <span class="settlement-amount">₩{{ item.amount.toLocaleString() }}</span>
                </div>
                <span class="settlement-status" :class="item.status">{{ item.statusText }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="panel">
          <h3>판매 통계</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-label">총 판매 건수</span>
              <span class="stat-number">{{ sellerStats.totalSales }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">진행 중인 공동구매</span>
              <span class="stat-number">{{ sellerStats.activeProducts }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">평균 평점</span>
              <span class="stat-number">⭐ {{ sellerStats.averageRating }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">고객 만족도</span>
              <span class="stat-number">{{ sellerStats.satisfaction }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 일반 사용자 정보 -->
      <div v-else class="user-section">
        <div class="grid">
          <div class="panel">
            <h3>기본 정보</h3>
            <div class="user-info">
              <div class="info-row">
                <span class="info-label">이름</span>
                <span class="info-value">{{ userInfo.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">닉네임</span>
                <input v-model="profile.nickname" class="info-input" />
              </div>
              <div class="info-row">
                <span class="info-label">이메일</span>
                <span class="info-value">{{ userInfo.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">전화번호</span>
                <span class="info-value">{{ userInfo.phone }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">가입일</span>
                <span class="info-value">{{ userInfo.joinDate }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">주소</span>
                <div class="address-input-group">
                  <input v-model="profile.address" class="info-input address-input" placeholder="주소를 입력하세요" />
                  <button type="button" class="btn-address-search" @click="searchAddress">주소 검색</button>
                </div>
              </div>
              <div v-if="profile.address" class="info-row">
                <span class="info-label">상세 주소</span>
                <input v-model="profile.detailAddress" class="info-input" placeholder="상세 주소를 입력하세요" />
              </div>
            </div>
            <button class="btn btn-primary" @click="save">저장</button>
          </div>
          
          <div class="panel">
            <h3>활동 통계</h3>
            <div class="user-stats">
              <div class="stat-box">
                <span class="stat-label">구매한 상품</span>
                <span class="stat-number">{{ userStats.purchasedProducts }}</span>
              </div>
              <!-- <div class="stat-box">
                <span class="stat-label">작성한 리뷰</span>
                <span class="stat-number">{{ userStats.reviews }}</span>
              </div> -->
              <div class="stat-box">
                <span class="stat-label">참여한 공동구매</span>
                <span class="stat-number">{{ userStats.groupPurchases }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="panel">
          <h3>주문 내역</h3>
          <div v-if="orderHistory.length === 0" class="empty-orders">
            <p>주문 내역이 없습니다</p>
            <router-link to="/products" class="btn btn-outline">상품 둘러보기</router-link>
          </div>
          <div v-else class="order-list">
            <div v-for="order in orderHistory" :key="order.id" class="order-item">
              <div class="order-header">
                <div>
                  <span class="order-date">{{ order.date }}</span>
                  <span class="order-number">주문번호: {{ order.orderNumber }}</span>
                </div>
                <span class="order-status" :class="order.status">{{ order.statusText }}</span>
              </div>
              <div class="order-products">
                <div v-for="product in order.products" :key="product.id" class="order-product">
                  <img :src="product.image" :alt="product.title" />
                  <div class="product-details">
                    <h4>{{ product.title }}</h4>
                    <p class="product-option">{{ product.option }}</p>
                    <div class="product-meta">
                      <span>수량: {{ product.quantity }}개</span>
                      <span class="product-price">₩{{ product.price.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-footer">
                <span class="order-total">총 결제금액: ₩{{ order.totalAmount.toLocaleString() }}</span>
                <div class="order-actions">
                  <button class="btn btn-outline btn-sm" @click="viewOrderDetail(order.id)">상세보기</button>
                  <button v-if="order.status === 'completed'" class="btn btn-outline btn-sm" @click="requestRefund(order.id)">환불신청</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="panel">
          <h3>판매자 신청</h3>
          <p style="color: #999; margin-bottom: 16px;">
            공동 구매에서 판매자로 활동하고 싶으신가요? 판매자 신청을 통해 상품을 등록하고 판매할 수 있습니다.
          </p>
          <router-link to="/seller/application" class="btn btn-primary">
            판매자 신청하기
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      profile: {
        nickname: '에요!',
        address: '',
        detailAddress: ''
      },
      settlement: {
        monthlyRevenue: 12500000,
        pendingAmount: 8500000,
        totalSettled: 45000000,
        history: [
          { id: 1, date: '2025-12-01', amount: 5000000, status: 'completed', statusText: '정산 완료' },
          { id: 2, date: '2025-11-15', amount: 3200000, status: 'completed', statusText: '정산 완료' },
          { id: 3, date: '2025-11-01', amount: 7500000, status: 'completed', statusText: '정산 완료' },
          { id: 4, date: '2025-12-15', amount: 8500000, status: 'pending', statusText: '정산 예정' }
        ]
      },
      sellerStats: {
        totalSales: 3245,
        activeProducts: 8,
        averageRating: 4.9,
        satisfaction: 98
      },
      userInfo: {
        name: '슈퍼주니어',
        email: 'user@example.com',
        phone: '010-1234-5678',
        joinDate: '2024-01-15'
      },
      userStats: {
        purchasedProducts: 23,
        reviews: 15,
        groupPurchases: 18
      },
      orderHistory: [
        {
          id: 1,
          orderNumber: 'ORD-2025-001',
          date: '2025-12-15',
          status: 'completed',
          statusText: '배송 완료',
          totalAmount: 1190000,
          products: [
            {
              id: 1,
              title: '아이폰 15 Pro Max 256GB',
              image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
              option: '네이비 티타늄 / 256GB',
              quantity: 1,
              price: 1190000
            }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-2025-002',
          date: '2025-12-10',
          status: 'shipping',
          statusText: '배송 중',
          totalAmount: 198000,
          products: [
            {
              id: 2,
              title: '나이키 에어맥스 운동화',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
              option: '270 / 블랙',
              quantity: 2,
              price: 198000
            }
          ]
        },
        {
          id: 3,
          orderNumber: 'ORD-2025-003',
          date: '2025-12-05',
          status: 'pending',
          statusText: '주문 대기',
          totalAmount: 59000,
          products: [
            {
              id: 3,
              title: '프리미엄 한우 세트 (1kg)',
              image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400',
              option: '기본 구성',
              quantity: 1,
              price: 59000
            }
          ]
        }
      ]
    }
  },
  computed: {
    isSeller() {
      const role = localStorage.getItem('user_role')
      return role === 'seller'
    }
  },
  mounted() {
    // 저장된 사용자 정보 불러오기
    const savedUserData = localStorage.getItem('user_data')
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData)
        this.userInfo.name = userData.name || this.userInfo.name
        this.userInfo.email = userData.email || this.userInfo.email
        this.userInfo.phone = userData.phone || this.userInfo.phone
        if (userData.createdAt) {
          this.userInfo.joinDate = new Date(userData.createdAt).toLocaleDateString('ko-KR')
        }
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
    
    const savedEmail = localStorage.getItem('user_email')
    if (savedEmail) {
      this.userInfo.email = savedEmail
    }
  },
  methods: {
    save() {
      // 프로필 정보 저장
      const profileData = {
        nickname: this.profile.nickname,
        address: this.profile.address,
        detailAddress: this.profile.detailAddress
      }
      localStorage.setItem('user_profile', JSON.stringify(profileData))
      alert('저장되었습니다')
    },
    searchAddress() {
      // TODO: 실제 주소 검색 API 연동 (다음 주소 API 등)
      alert('주소 검색 기능은 다음 주소 API를 연동하여 구현할 예정입니다.')
      // 목업: 주소 입력
      const mockAddress = prompt('주소를 입력하세요:')
      if (mockAddress) {
        this.profile.address = mockAddress
      }
    },
    viewOrderDetail(orderId) {
      alert(`주문 상세 정보를 확인합니다. (주문 ID: ${orderId})`)
      // TODO: 주문 상세 페이지로 이동
    },
    // requestRefund(orderId) {
    //   if (confirm('환불을 신청하시겠습니까?')) {
    //     alert('환불 신청이 접수되었습니다.')
    //     // TODO: 환불 신청 API 호출
    //   }
    // }
  }
}
</script>

<style scoped>
.page {
  background: #0a0a0a;
  color: #ffffff;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.container h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #ffffff;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.panel {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.panel h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #ffffff;
}

.row {
  display: grid;
  gap: 8px;
  margin: 12px 0;
}

.row label {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 14px;
}

input,
textarea {
  background: #0f0f0f;
  color: #ffffff;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

input::placeholder,
textarea::placeholder {
  color: #666;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.chip {
  background: #f1f3f5;
  color: #495057;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chip input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.btn {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
  margin-top: 16px;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

/* 판매자 정산 섹션 */
.settlement-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.stat-value.highlight {
  color: #ffffff;
}

.settlement-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settlement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
}

.settlement-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settlement-date {
  font-size: 13px;
  color: #999;
}

.settlement-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.settlement-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.settlement-status.completed {
  background: #2a2a2a;
  color: #51cf66;
}

.settlement-status.pending {
  background: #2a2a2a;
  color: #ffd43b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-box {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-box .stat-label {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

.stat-box .stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

/* 사용자 정보 섹션 */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-of-type {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 14px;
}

.info-value {
  color: #ffffff;
  font-size: 14px;
}

.info-input {
  flex: 1;
  max-width: 200px;
  margin-left: auto;
}

.address-input-group {
  display: flex;
  gap: 8px;
  flex: 1;
  max-width: 400px;
  margin-left: auto;
}

.address-input {
  flex: 1;
  max-width: none;
}

.btn-address-search {
  padding: 8px 16px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-address-search:hover {
  background: #f0f0f0;
}

.empty-orders {
  text-align: center;
  padding: 40px 20px;
}

.empty-orders p {
  color: #999;
  margin-bottom: 16px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 16px;
  background: #0f0f0f;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a2a;
}

.order-date {
  color: #999;
  font-size: 13px;
  margin-right: 12px;
}

.order-number {
  color: #999;
  font-size: 13px;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.order-status.completed {
  background: #2a2a2a;
  color: #51cf66;
}

.order-status.shipping {
  background: #2a2a2a;
  color: #74c0fc;
}

.order-status.pending {
  background: #2a2a2a;
  color: #ffd43b;
}

.order-products {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.order-product {
  display: flex;
  gap: 12px;
}

.order-product img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-details h4 {
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
}

.product-option {
  color: #999;
  font-size: 13px;
  margin: 0 0 8px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.product-price {
  color: #ffffff;
  font-weight: 600;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #2a2a2a;
}

.order-total {
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 920px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .settlement-summary,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .user-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .container h1 {
    font-size: 24px;
  }

  .panel {
    padding: 20px;
  }
}
</style>



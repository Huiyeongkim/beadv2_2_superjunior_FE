<template>
  <main v-if="groupPurchase" class="group-purchase-detail-page">
    <div class="container">
      <div class="detail-header">
        <div class="header-info">
          <div class="status-badge" :class="groupPurchase.status.toLowerCase()">
            {{ getStatusText(groupPurchase.status) }}
          </div>
          <span class="category">{{ groupPurchase.category }}</span>
        </div>
        <div v-if="isOwner" class="owner-actions">
          <button class="btn btn-outline" @click="goToEdit">수정</button>
          <button class="btn btn-danger" @click="handleDelete">삭제</button>
        </div>
      </div>

      <section class="detail-content">
        <div class="main-info">
          <h1>{{ groupPurchase.title }}</h1>
          <p class="product-name">상품: {{ groupPurchase.productName }}</p>
          <p class="seller-info">판매자: {{ groupPurchase.seller }}</p>
          <div class="description">
            <h3>설명</h3>
            <p>{{ groupPurchase.description }}</p>
          </div>
        </div>

        <div class="sidebar">
          <div class="info-card">
            <h3>가격 정보</h3>
            <div class="price-box">
              <span class="discount-price">₩{{ groupPurchase.discountPrice.toLocaleString() }}</span>
              <span class="original-price">정가 ₩{{ groupPurchase.originalPrice.toLocaleString() }}</span>
            </div>
            <div class="discount-rate">
              할인율: {{ discountRate }}%
            </div>
          </div>

          <div class="info-card">
            <h3>수량 정보</h3>
            <div class="quantity-info">
              <div class="quantity-row">
                <span>최소 수량:</span>
                <strong>{{ groupPurchase.minQuantity }}명</strong>
              </div>
              <div class="quantity-row">
                <span>최대 수량:</span>
                <strong>{{ groupPurchase.maxQuantity }}명</strong>
              </div>
              <div class="quantity-row">
                <span>현재 참여자:</span>
                <strong>{{ groupPurchase.currentCount }}명</strong>
              </div>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min((groupPurchase.currentCount / groupPurchase.maxQuantity) * 100, 100)}%` }"
              ></div>
            </div>
            <div class="progress-text">
              {{ Math.round((groupPurchase.currentCount / groupPurchase.maxQuantity) * 100) }}% 달성
            </div>
          </div>

          <div class="info-card">
            <h3>기간 정보</h3>
            <div class="date-info">
              <div v-if="groupPurchase.startDate" class="date-row">
                <span>시작일:</span>
                <span>{{ formatDate(groupPurchase.startDate) }}</span>
              </div>
              <div v-if="groupPurchase.endDate" class="date-row">
                <span>종료일:</span>
                <span>{{ formatDate(groupPurchase.endDate) }}</span>
              </div>
              <div v-if="groupPurchase.endDate" class="time-remaining">
                {{ getTimeRemaining(groupPurchase.endDate) }}
              </div>
            </div>
          </div>

          <div v-if="groupPurchase.productImage" class="product-image-card">
            <img :src="groupPurchase.productImage" :alt="groupPurchase.productName" />
          </div>
        </div>
      </section>

      <section v-if="groupPurchase.participants && groupPurchase.participants.length > 0" class="participants-section">
        <h2>참여자 목록</h2>
        <div class="participants-list">
          <div
            v-for="(participant, index) in groupPurchase.participants"
            :key="index"
            class="participant-item"
          >
            <span>{{ participant.name || `참여자 ${index + 1}` }}</span>
            <span>{{ participant.quantity }}개</span>
          </div>
        </div>
      </section>
    </div>
  </main>
  <section v-else class="not-found container">
    <p>요청하신 공동구매를 찾을 수 없습니다.</p>
    <router-link class="btn btn-primary" to="/group-purchases">공동구매 목록으로 이동</router-link>
  </section>
</template>

<script setup>
import { ref, computed, watch} from 'vue'
import { useRouter } from 'vue-router'

// eslint-disable-next-line no-undef
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const groupPurchase = ref(null)

const isOwner = computed(() => {
  if (!groupPurchase.value) return false
  const currentUserEmail = localStorage.getItem('user_email')
  return groupPurchase.value.sellerId === currentUserEmail
})

const discountRate = computed(() => {
  if (!groupPurchase.value) return 0
  return Math.round(
    ((groupPurchase.value.originalPrice - groupPurchase.value.discountPrice) /
      groupPurchase.value.originalPrice) *
      100
  )
})

const loadGroupPurchase = () => {
  const groupPurchases = JSON.parse(localStorage.getItem('group_purchases') || '[]')
  groupPurchase.value = groupPurchases.find((gp) => gp.id === Number(props.id))
}

const getStatusText = (status) => {
  const statusMap = {
    SCHEDULED: '예정됨',
    OPEN: '진행 중',
    SUCCESS: '성공',
    FAILED: '실패'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTimeRemaining = (endDate) => {
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
}

const goToEdit = () => {
  router.push({ name: 'group-purchase-edit', params: { id: props.id } })
}

const handleDelete = () => {
  if (confirm('정말 이 공동구매를 삭제하시겠습니까?')) {
    const groupPurchases = JSON.parse(localStorage.getItem('group_purchases') || '[]')
    const filtered = groupPurchases.filter((gp) => gp.id !== Number(props.id))
    localStorage.setItem('group_purchases', JSON.stringify(filtered))
    alert('공동구매가 삭제되었습니다.')
    router.push('/group-purchases')
  }
}

loadGroupPurchase()

watch(() => props.id, () => {
  loadGroupPurchase()
})
</script>

<style scoped>
.group-purchase-detail-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
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
  font-size: 14px;
  color: #999;
  font-weight: 600;
}

.owner-actions {
  display: flex;
  gap: 8px;
}

.detail-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.main-info h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.product-name {
  font-size: 18px;
  color: #e0e0e0;
  margin-bottom: 8px;
}

.seller-info {
  font-size: 16px;
  color: #999;
  margin-bottom: 24px;
}

.description {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
}

.description h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.description p {
  font-size: 16px;
  line-height: 1.8;
  color: #e0e0e0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
}

.info-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.price-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.discount-price {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
}

.original-price {
  font-size: 16px;
  color: #666;
  text-decoration: line-through;
}

.discount-rate {
  font-size: 14px;
  color: #51cf66;
  font-weight: 600;
}

.quantity-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.quantity-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #e0e0e0;
}

.quantity-row strong {
  color: #ffffff;
  font-weight: 700;
}

.progress-bar {
  height: 10px;
  background: #0f0f0f;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  border-radius: inherit;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #e0e0e0;
}

.time-remaining {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #2a2a2a;
  font-size: 14px;
  color: #51cf66;
  font-weight: 600;
}

.product-image-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  overflow: hidden;
}

.product-image-card img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.participants-section {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
}

.participants-section h2 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #0f0f0f;
  border-radius: 8px;
  font-size: 14px;
  color: #e0e0e0;
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

.btn-danger {
  background: #fa5252;
  color: #ffffff;
  border: none;
}

.btn-danger:hover {
  background: #e03131;
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

.not-found {
  text-align: center;
  padding: 100px 20px;
  color: #ffffff;
}

@media (max-width: 900px) {
  .detail-content {
    grid-template-columns: 1fr;
  }
}
</style>




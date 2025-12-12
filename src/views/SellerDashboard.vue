<template>
  <main class="seller-page">
    <div class="container">
      <section class="seller-hero">
        <div>
          <p class="eyebrow">판매자 센터</p>
          <h1>{{ seller.name }}</h1>
          <p class="description">{{ seller.description }}</p>
          <div class="badges">
            <span v-for="badge in seller.badges" :key="badge" class="badge">{{ badge }}</span>
          </div>
          <button class="btn-edit-profile" @click="showEditModal = true">정보 수정</button>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <strong>{{ seller.rating }}</strong>
            <span>평점</span>
          </div>
          <div class="stat">
            <strong>{{ seller.followers.toLocaleString() }}</strong>
            <span>팔로워</span>
          </div>
          <div class="stat">
            <strong>{{ seller.totalSales.toLocaleString() }}</strong>
            <span>누적 판매</span>
          </div>
          <div class="stat">
            <strong>{{ seller.responseRate * 100 }}%</strong>
            <span>응답률</span>
          </div>
        </div>
      </section>

      <section class="dashboard">
        <div class="dashboard-nav">
          <router-link to="/seller" class="nav-tab" :class="{ active: route.path === '/seller' }">
            대시보드
          </router-link>
          <router-link to="/seller/products" class="nav-tab" :class="{ active: route.path === '/seller/products' }">
            내 상품 목록
          </router-link>
          <router-link to="/group-purchases" class="nav-tab" :class="{ active: route.path.startsWith('/group-purchases') }">
            공동구매 관리
          </router-link>
          <router-link to="/seller/settlement" class="nav-tab" :class="{ active: route.path === '/seller/settlement' }">
            정산 결과
          </router-link>
          <router-link to="/seller/register/product-register" class="nav-tab" :class="{ active: route.path === '/seller/register/product-register' }">
            상품 등록
          </router-link>
        </div>
        <article class="panel wide">
          <header class="panel-head">
            <div>
              <h2>진행중인 공동구매</h2>
              <p>이번 달 {{ seller.monthlySales }}건의 공동구매를 운영하고 있어요.</p>
            </div>
            <router-link class="link" to="/products">모든 상품 보기 →</router-link>
          </header>
          <div class="product-list">
            <article
              v-for="product in sellerProducts"
              :key="product.id"
              class="product-card"
              @click="goToProduct(product.id)"
            >
              <img :src="product.image" :alt="product.title" />
              <div>
                <p class="category">{{ product.category }}</p>
                <h3>{{ product.title }}</h3>
                <p class="price">₩{{ product.currentPrice.toLocaleString() }}</p>
                <p class="progress-text">
                  {{ product.currentCount }} / {{ product.targetCount }}명 참여
                </p>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${Math.min(product.currentCount / product.targetCount * 100, 100)}%` }"
                  ></div>
                </div>
              </div>
              <button class="btn btn-outline">상세보기</button>
            </article>
          </div>
        </article>

        <article class="panel">
          <h2>공지 사항</h2>
          <ul class="notice-list">
            <li v-for="notice in notices" :key="notice.id">
              <span class="tag">{{ notice.type }}</span>
              <span>{{ notice.title }}</span>
              <span class="date">{{ notice.date }}</span>
            </li>
          </ul>
        </article>

        <article class="panel">
          <h2>고객 문의 현황</h2>
          <ul class="qna-list">
            <li v-for="item in qna" :key="item.id">
              <p class="question">Q. {{ item.question }}</p>
              <p class="answer">A. {{ item.answer }}</p>
              <span class="status">{{ item.status }}</span>
            </li>
          </ul>
        </article>
      </section>
    </div>

    <!-- 판매자 정보 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>판매자 정보 수정</h2>
          <button class="close-btn" @click="showEditModal = false">✕</button>
        </div>
        <form @submit.prevent="saveSellerInfo" class="edit-form">
          <div class="form-group">
            <label>상점명 *</label>
            <input v-model="editForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>상점 소개 *</label>
            <textarea v-model="editForm.description" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label>배지 (쉼표로 구분)</label>
            <input v-model="badgesInput" type="text" placeholder="예: 프리미엄 셀러, 24시간 상담" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="showEditModal = false">취소</button>
            <button type="submit" class="btn btn-primary">저장</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sellerProfile, getSellerProducts} from '@/data/products'

const router = useRouter()
const route = useRoute()

const seller = ref({ ...sellerProfile })
const sellerProducts = ref(getSellerProducts(sellerProfile.name))
const showEditModal = ref(false)
const editForm = ref({
  name: '',
  description: ''
})
const badgesInput = ref('')

const loadSellerInfo = () => {
  const savedSeller = JSON.parse(localStorage.getItem('seller_profile') || 'null')
  if (savedSeller) {
    seller.value = { ...seller.value, ...savedSeller }
  }
  editForm.value = {
    name: seller.value.name,
    description: seller.value.description
  }
  badgesInput.value = seller.value.badges ? seller.value.badges.join(', ') : ''
}

const saveSellerInfo = () => {
  const badges = badgesInput.value
    .split(',')
    .map(b => b.trim())
    .filter(b => b.length > 0)
  
  const updatedSeller = {
    ...seller.value,
    name: editForm.value.name,
    description: editForm.value.description,
    badges: badges
  }
  
  seller.value = updatedSeller
  localStorage.setItem('seller_profile', JSON.stringify({
    name: updatedSeller.name,
    description: updatedSeller.description,
    badges: updatedSeller.badges
  }))
  
  alert('판매자 정보가 저장되었습니다.')
  showEditModal.value = false
}

const goToProduct = (id) => {
  router.push({ name: 'product-detail', params: { id } })
}

onMounted(() => {
  loadSellerInfo()
})
</script>

<style scoped>
.seller-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.seller-hero {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: white;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  margin-bottom: 24px;
}

.description {
  opacity: 0.9;
  margin: 8px 0 12px;
}

.badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 8px 14px;
}

.hero-stats {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.stat {
  flex: 1;
  min-width: 120px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 26px;
}

.dashboard-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 8px;
}

.nav-tab {
  flex: 1;
  padding: 12px 24px;
  text-align: center;
  border-radius: 8px;
  text-decoration: none;
  color: #999;
  font-weight: 600;
  transition: all 0.2s;
}

.nav-tab:hover {
  color: #ffffff;
  background: #222222;
}

.nav-tab.active {
  background: #ffffff;
  color: #0a0a0a;
}

.dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.panel {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.panel h2 {
  color: #ffffff;
}

.panel p {
  color: #999;
}

.panel.wide {
  grid-column: span 2;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.link {
  color: #ffffff;
  font-weight: 600;
}

.link:hover {
  color: #cccccc;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #2a2a2a;
  background: #0f0f0f;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.product-card:hover {
  border-color: #3a3a3a;
}

.product-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.product-card .category {
  color: #ffffff;
}

.product-card h3 {
  color: #ffffff;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.progress-text {
  font-size: 13px;
  color: #999;
}

.progress-bar {
  height: 6px;
  background: #0f0f0f;
  border-radius: 999px;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  border-radius: inherit;
}

.btn {
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  padding: 10px 14px;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
}

.btn:hover {
  background: #2a2a2a;
  border-color: #4a4a4a;
}

.notice-list,
.qna-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-list li,
.qna-list li {
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 14px;
  background: #0f0f0f;
  display: flex;
  gap: 12px;
  align-items: center;
}

.notice-list li span:not(.tag):not(.date) {
  color: #ffffff;
}

.notice-list .tag {
  background: #2a2a2a;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.notice-list .date {
  margin-left: auto;
  color: #999;
  font-size: 13px;
}

.qna-list li {
  flex-direction: column;
  align-items: flex-start;
}

.question {
  font-weight: 600;
  color: #ffffff;
}

.answer {
  color: #e0e0e0;
}

.status {
  align-self: flex-end;
  font-size: 12px;
  color: #51cf66;
}

@media (max-width: 900px) {
  .dashboard {
    grid-template-columns: 1fr;
  }

  .panel.wide {
    grid-column: span 1;
  }
}

@media (max-width: 640px) {
  .hero-stats {
    flex-direction: column;
  }
}

.btn-edit-profile {
  margin-top: 16px;
  padding: 10px 20px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit-profile:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  color: #ffffff;
  font-size: 24px;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #2a2a2a;
  border-radius: 50%;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #e0e0e0;
  font-weight: 600;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.form-actions .btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.form-actions .btn-outline {
  background: transparent;
  border: 1px solid #4a4a4a;
  color: #ffffff;
}

.form-actions .btn-outline:hover {
  background: #2a2a2a;
  border-color: #666;
}

.form-actions .btn-primary {
  background: #ffffff;
  color: #0a0a0a;
  border: none;
}

.form-actions .btn-primary:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}
</style>



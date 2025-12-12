<template>
  <main class="group-purchase-create-page">
    <div class="container">
      <div class="page-header">
        <h1>공동구매 생성</h1>
        <p>새로운 공동구매를 생성하세요</p>
      </div>

      <form @submit.prevent="handleSubmit" class="create-form">
        <div class="form-section">
          <h3>기본 정보</h3>
          <div class="form-group">
            <label for="title">제목 *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="공동구매 제목을 입력하세요"
              required
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="category">카테고리 *</label>
              <select id="category" v-model="form.category" required>
                <option value="">카테고리를 선택하세요</option>
                <option value="전자제품">전자제품</option>
                <option value="패션">패션</option>
                <option value="식품">식품</option>
                <option value="뷰티">뷰티</option>
                <option value="홈/리빙">홈/리빙</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">상태 *</label>
              <select id="status" v-model="form.status" required>
                <option value="SCHEDULED">예정됨 (SCHEDULED)</option>
                <option value="OPEN">진행 중 (OPEN)</option>
                <option value="SUCCESS">성공 (SUCCESS)</option>
                <option value="FAILED">실패 (FAILED)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="description">설명 *</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              placeholder="공동구매에 대한 상세한 설명을 작성해주세요"
              required
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3>상품 정보</h3>
          <div class="form-group">
            <label for="productName">상품명 *</label>
            <input
              id="productName"
              v-model="form.productName"
              type="text"
              placeholder="상품명을 입력하세요"
              required
            />
          </div>
          <div class="form-group">
            <label for="productImage">상품 이미지 URL</label>
            <input
              id="productImage"
              v-model="form.productImage"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="form.productImage" class="image-preview">
              <img :src="form.productImage" alt="상품 이미지 미리보기" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>수량 및 가격 정보</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="minQuantity">최소 수량 *</label>
              <input
                id="minQuantity"
                v-model.number="form.minQuantity"
                type="number"
                placeholder="예: 10"
                required
                min="1"
              />
            </div>
            <div class="form-group">
              <label for="maxQuantity">최대 수량 *</label>
              <input
                id="maxQuantity"
                v-model.number="form.maxQuantity"
                type="number"
                placeholder="예: 100"
                required
                min="1"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="originalPrice">정가 *</label>
              <input
                id="originalPrice"
                v-model.number="form.originalPrice"
                type="number"
                placeholder="원래 가격"
                required
                min="0"
              />
            </div>
            <div class="form-group">
              <label for="discountPrice">할인가 *</label>
              <input
                id="discountPrice"
                v-model.number="form.discountPrice"
                type="number"
                placeholder="할인된 가격"
                required
                min="0"
              />
            </div>
          </div>
          <div v-if="form.originalPrice && form.discountPrice" class="discount-info">
            <span>할인율: {{ discountRate }}%</span>
            <span>절약액: ₩{{ (form.originalPrice - form.discountPrice).toLocaleString() }}</span>
          </div>
        </div>

        <div class="form-section">
          <h3>기간 정보</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="startDate">시작일</label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="datetime-local"
              />
            </div>
            <div class="form-group">
              <label for="endDate">종료일</label>
              <input
                id="endDate"
                v-model="form.endDate"
                type="datetime-local"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" @click="handleCancel">취소</button>
          <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
            {{ loading ? '생성 중...' : '공동구매 생성하기' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  title: '',
  category: '',
  description: '',
  productName: '',
  productImage: '',
  minQuantity: null,
  maxQuantity: null,
  originalPrice: null,
  discountPrice: null,
  status: 'OPEN',
  startDate: '',
  endDate: ''
})

const loading = ref(false)

const discountRate = computed(() => {
  if (!form.value.originalPrice || !form.value.discountPrice) return 0
  return Math.round(((form.value.originalPrice - form.value.discountPrice) / form.value.originalPrice) * 100)
})

const isFormValid = computed(() => {
  return (
    form.value.title &&
    form.value.category &&
    form.value.description &&
    form.value.productName &&
    form.value.minQuantity &&
    form.value.maxQuantity &&
    form.value.originalPrice &&
    form.value.discountPrice &&
    form.value.status &&
    form.value.minQuantity <= form.value.maxQuantity
  )
})

const handleCancel = () => {
  if (confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
    router.push('/seller')
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert('모든 필수 항목을 입력해주세요.')
    return
  }

  if (form.value.minQuantity > form.value.maxQuantity) {
    alert('최소 수량은 최대 수량보다 작거나 같아야 합니다.')
    return
  }

  loading.value = true
  try {
    // TODO: 실제 API 호출로 교체
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 판매자 정보 가져오기
    const sellerProfile = JSON.parse(localStorage.getItem('seller_profile_data') || '{}')
    const sellerName = sellerProfile.name || '테크샵'

    const groupPurchaseData = {
      ...form.value,
      id: Date.now(),
      seller: sellerName,
      sellerId: localStorage.getItem('user_email') || 'seller@example.com',
      currentCount: 0,
      participants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // localStorage에 저장
    const existingGroupPurchases = JSON.parse(localStorage.getItem('group_purchases') || '[]')
    existingGroupPurchases.push(groupPurchaseData)
    localStorage.setItem('group_purchases', JSON.stringify(existingGroupPurchases))

    alert('공동구매가 성공적으로 생성되었습니다!')
    router.push('/group-purchases')
  } catch (error) {
    alert('공동구매 생성에 실패했습니다. 다시 시도해주세요.')
    console.error('Group purchase creation error:', error)
  } finally {
    loading.value = false
  }
}

// onMounted(() => {
//   // 판매자 권한 체크
//   const role = localStorage.getItem('user_role')
//   if (role !== 'seller') {
//     alert('판매자만 공동구매를 생성할 수 있습니다.')
//     router.push('/seller/application')
//   }
// })
</script>

<style scoped>
.group-purchase-create-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 900px;
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
  color: #999;
  font-size: 15px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 14px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #666;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.form-group select {
  cursor: pointer;
}

.discount-info {
  padding: 12px;
  background: #0f0f0f;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 600;
  display: flex;
  gap: 16px;
}

.image-preview {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>




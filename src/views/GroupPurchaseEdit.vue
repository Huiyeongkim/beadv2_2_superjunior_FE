<template>
  <main v-if="groupPurchase" class="group-purchase-edit-page">
    <div class="container">
      <div class="page-header">
        <h1>공동구매 수정</h1>
        <p>공동구매 정보를 수정하세요</p>
      </div>

      <form @submit.prevent="handleSubmit" class="edit-form">
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
            {{ loading ? '수정 중...' : '수정 완료' }}
          </button>
        </div>
      </form>
    </div>
  </main>
  <section v-else class="not-found container">
    <p>요청하신 공동구매를 찾을 수 없습니다.</p>
    <router-link class="btn btn-primary" to="/group-purchases">공동구매 목록으로 이동</router-link>
  </section>
</template>

<script>
export default {
  name: 'GroupPurchaseEdit',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      groupPurchase: null,
      form: {
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
      },
      loading: false
    }
  },
  computed: {
    discountRate() {
      if (!this.form.originalPrice || !this.form.discountPrice) return 0
      return Math.round(((this.form.originalPrice - this.form.discountPrice) / this.form.originalPrice) * 100)
    },
    isFormValid() {
      return (
        this.form.title &&
        this.form.category &&
        this.form.description &&
        this.form.productName &&
        this.form.minQuantity &&
        this.form.maxQuantity &&
        this.form.originalPrice &&
        this.form.discountPrice &&
        this.form.status &&
        this.form.minQuantity <= this.form.maxQuantity
      )
    }
  },
  created() {
    this.loadGroupPurchase()
  },
  watch: {
    id() {
      this.loadGroupPurchase()
    }
  },
  methods: {
    loadGroupPurchase() {
      const groupPurchases = JSON.parse(localStorage.getItem('group_purchases') || '[]')
      this.groupPurchase = groupPurchases.find((gp) => gp.id === Number(this.id))

      if (this.groupPurchase) {
        // 폼에 기존 데이터 채우기
        this.form = {
          title: this.groupPurchase.title,
          category: this.groupPurchase.category,
          description: this.groupPurchase.description,
          productName: this.groupPurchase.productName,
          productImage: this.groupPurchase.productImage || '',
          minQuantity: this.groupPurchase.minQuantity,
          maxQuantity: this.groupPurchase.maxQuantity,
          originalPrice: this.groupPurchase.originalPrice,
          discountPrice: this.groupPurchase.discountPrice,
          status: this.groupPurchase.status,
          startDate: this.groupPurchase.startDate
            ? new Date(this.groupPurchase.startDate).toISOString().slice(0, 16)
            : '',
          endDate: this.groupPurchase.endDate
            ? new Date(this.groupPurchase.endDate).toISOString().slice(0, 16)
            : ''
        }

        // 권한 체크
        const currentUserEmail = localStorage.getItem('user_email')
        if (this.groupPurchase.sellerId !== currentUserEmail) {
          alert('수정 권한이 없습니다.')
          this.$router.push({ name: 'group-purchase-detail', params: { id: this.id } })
        }
      }
    },
    handleCancel() {
      this.$router.push({ name: 'group-purchase-detail', params: { id: this.id } })
    },
    async handleSubmit() {
      if (!this.isFormValid) {
        alert('모든 필수 항목을 입력해주세요.')
        return
      }

      if (this.form.minQuantity > this.form.maxQuantity) {
        alert('최소 수량은 최대 수량보다 작거나 같아야 합니다.')
        return
      }

      this.loading = true
      try {
        // TODO: 실제 API 호출로 교체
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const groupPurchases = JSON.parse(localStorage.getItem('group_purchases') || '[]')
        const index = groupPurchases.findIndex((gp) => gp.id === Number(this.id))

        if (index !== -1) {
          // 기존 데이터 유지하면서 수정된 필드만 업데이트
          groupPurchases[index] = {
            ...groupPurchases[index],
            ...this.form,
            updatedAt: new Date().toISOString()
          }

          localStorage.setItem('group_purchases', JSON.stringify(groupPurchases))
          alert('공동구매가 성공적으로 수정되었습니다!')
          this.$router.push({ name: 'group-purchase-detail', params: { id: this.id } })
        }
      } catch (error) {
        alert('공동구매 수정에 실패했습니다. 다시 시도해주세요.')
        console.error('Group purchase update error:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.group-purchase-edit-page {
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

.edit-form {
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

.not-found {
  text-align: center;
  padding: 100px 20px;
  color: #ffffff;
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



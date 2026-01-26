<template>
  <main class="page">
    <div class="container">
      <div class="page-header">
        <h1>마이페이지</h1>
      </div>

      <div class="mypage-layout">
        <!-- 왼쪽 사이드바 메뉴 -->
        <aside class="sidebar">
          <div class="user-welcome">
            <h3>{{ userInfo.name || '사용자' }}님</h3>
            <p>{{ userInfo.email }}</p>
          </div>

          <nav class="sidebar-nav">
            <div class="nav-section">
              <h4 class="nav-section-title">계정 정보</h4>
              <button
                :class="['nav-item', { active: activeMenu === 'profile' }]"
                @click="activeMenu = 'profile'"
              >
                <span class="nav-icon">👤</span>
                <span>기본 정보</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'address' }]"
                @click="activeMenu = 'address'"
              >
                <span class="nav-icon">📍</span>
                <span>주소 관리</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'point' }]"
                @click="activeMenu = 'point'"
              >
                <span class="nav-icon">💰</span>
                <span>포인트</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'payments' }]"
                @click="activeMenu = 'payments'"
              >
                <span class="nav-icon">💳</span>
                <span>결제 내역</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'account-settings' }]"
                @click="activeMenu = 'account-settings'"
              >
                <span class="nav-icon">⚙️</span>
                <span>계정 설정</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'notification-settings' }]"
                @click="activeMenu = 'notification-settings'"
              >
                <span class="nav-icon">🔔</span>
                <span>알림 설정</span>
              </button>
            </div>

            <div class="nav-section">
              <h4 class="nav-section-title">쇼핑 정보</h4>
              <button
                :class="['nav-item', { active: activeMenu === 'orders' }]"
                @click="activeMenu = 'orders'"
              >
                <span class="nav-icon">📦</span>
                <span>주문 내역</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'cancelled-orders' }]"
                @click="activeMenu = 'cancelled-orders'"
              >
                <span class="nav-icon">❌</span>
                <span>주문 취소내역</span>
              </button>
            </div>

            <div v-if="isSeller" class="nav-section">
              <h4 class="nav-section-title">판매자</h4>
              <button
                :class="['nav-item', { active: activeMenu === 'seller-center' }]"
                @click="openSellerMenu('seller-center')"
              >
                <span class="nav-icon">📊</span>
                <span>판매자 센터</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'seller-sales' }]"
                @click="openSellerMenu('seller-sales')"
              >
                <span class="nav-icon">🛒</span>
                <span>판매 목록</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'seller-orders' }]"
                @click="openSellerMenu('seller-orders')"
              >
                <span class="nav-icon">📦</span>
                <span>주문 현황</span>
              </button>
              <button
                :class="['nav-item', { active: activeMenu === 'seller-settlement' }]"
                @click="openSellerMenu('seller-settlement')"
              >
                <span class="nav-icon">💳</span>
                <span>정산 현황</span>
              </button>
            </div>

            <div v-if="!isSeller" class="nav-section">
              <button
                class="nav-item seller-application"
                @click="goToSellerApplication"
              >
                <span class="nav-icon">🏪</span>
                <span>판매자 신청</span>
              </button>
            </div>
          </nav>
        </aside>

        <!-- 오른쪽 컨텐츠 영역 -->
        <div class="content-area">
          <!-- 기본 정보 -->
          <section v-if="activeMenu === 'profile'" class="content-section">
            <h2 class="section-title">기본 정보</h2>
            <div class="panel">
              <div class="panel-header">
                <h3>내 정보</h3>
                <button
                  v-if="!isEditingProfile"
                  class="btn btn-outline btn-sm"
                  @click="startEditProfile"
                >
                  프로필 수정
                </button>
              </div>

              <!-- 읽기 모드 -->
              <div v-if="!isEditingProfile" class="user-info">
                <div class="info-row">
                  <span class="info-label">이름</span>
                  <span class="info-value">{{ userInfo.name || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">이메일</span>
                  <span class="info-value">{{ userInfo.email || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">전화번호</span>
                  <span class="info-value">{{ userInfo.phoneNumber || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">가입일</span>
                  <span class="info-value">{{ userInfo.joinDate || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">프로필 이미지</span>
                  <div class="image-preview">
                    <img v-if="userInfo.imageUrl" :src="userInfo.imageUrl" alt="프로필" class="profile-image" />
                    <span v-else class="no-image">이미지 없음</span>
                  </div>
                </div>
              </div>

              <!-- 수정 모드 -->
              <div v-else class="profile-edit-form">
                <div class="form-group">
                  <label>이름 *</label>
                  <input
                    v-model="profileEditForm.name"
                    type="text"
                    placeholder="이름을 입력하세요 (2-50자)"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>전화번호 *</label>
                  <input
                    v-model="profileEditForm.phoneNumber"
                    type="tel"
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
                <div class="info-row">
                  <span class="info-label">이메일</span>
                  <span class="info-value readonly">{{ userInfo.email || '-' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">가입일</span>
                  <span class="info-value readonly">{{ userInfo.joinDate || '-' }}</span>
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    class="btn btn-outline"
                    @click="cancelEditProfile"
                    :disabled="savingProfile"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="saveProfile"
                    :disabled="savingProfile"
                  >
                    {{ savingProfile ? '저장 중...' : '저장' }}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 포인트 -->
          <section v-if="activeMenu === 'point'" class="content-section">
            <h2 class="section-title">포인트</h2>

            <div class="panel">
              <div class="point-balance">
                <h3>포인트 잔액</h3>
                <div class="balance-amount">{{ formatPrice(userInfo.point) }}P</div>
                <p class="points-info">공동 구매 참여 시 사용할 수 있습니다</p>
                <button class="btn btn-primary btn-large" @click="openChargeModal">
                  포인트 충전
                </button>
              </div>
            </div>

            <div class="panel">
              <div class="panel-header">
                <h3>포인트 이력</h3>
              </div>

              <!-- 탭 버튼 -->
              <div class="point-history-tabs">
                <button
                  :class="['tab-btn', { active: pointHistoryTab === 'PAID' }]"
                  @click="pointHistoryTab = 'PAID'"
                >
                  충전 포인트
                </button>
                <button
                  :class="['tab-btn', { active: pointHistoryTab === 'BONUS' }]"
                  @click="pointHistoryTab = 'BONUS'"
                >
                  보너스 포인트
                </button>
              </div>

              <!-- PAID 포인트 이력 -->
              <div v-if="pointHistoryTab === 'PAID'">
                <div v-if="loadingPaidHistories" class="loading-state">
                  <p>이력을 불러오는 중...</p>
                </div>
                <div v-else-if="paidPointHistories.length === 0" class="point-empty-state">
                  <div class="empty-icon">💳</div>
                  <p class="empty-title">충전 포인트 이력이 없습니다</p>
                  <p class="empty-description">포인트를 충전하여 공동구매에 참여해보세요!</p>
                </div>
                <div v-else class="history-list">
                  <div v-for="item in paidPointHistories" :key="item.id" class="history-item">
                    <div class="history-info">
                      <span class="history-date">{{ item.date }}</span>
                      <span class="history-amount" :class="item.type">
                        {{ item.type === 'credit' ? '+' : '-' }}{{ item.amount.toLocaleString() }}원
                      </span>
                    </div>
                    <span class="history-status" :class="item.type">{{ item.statusText }}</span>
                  </div>
                </div>
              </div>

              <!-- BONUS 포인트 이력 -->
              <div v-if="pointHistoryTab === 'BONUS'">
                <div v-if="loadingBonusHistories" class="loading-state">
                  <p>이력을 불러오는 중...</p>
                </div>
                <div v-else-if="bonusPointHistories.length === 0" class="point-empty-state">
                  <div class="empty-icon">🎁</div>
                  <p class="empty-title">보너스 포인트 이력이 없습니다</p>
                  <p class="empty-description">공동구매 참여나 이벤트를 통해 보너스 포인트를 받아보세요!</p>
                </div>
                <div v-else class="history-list">
                  <div v-for="item in bonusPointHistories" :key="item.id" class="history-item">
                    <div class="history-info">
                      <span class="history-date">{{ item.date }}</span>
                      <span class="history-amount" :class="item.type">
                        {{ item.type === 'credit' ? '+' : '-' }}{{ item.amount.toLocaleString() }}원
                      </span>
                    </div>
                    <span class="history-status" :class="item.type">{{ item.statusText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 결제 내역 -->
          <section v-if="activeMenu === 'payments'" class="content-section">
            <h2 class="section-title">결제 내역</h2>

            <div class="panel">
              <div class="panel-header">
                <h3>PG 결제 내역</h3>
              </div>
              <div v-if="loadingPgPayments" class="loading-state">
                <p>결제 내역을 불러오는 중...</p>
              </div>
              <div v-else-if="pgPaymentHistories.length === 0" class="point-empty-state">
                <div class="empty-icon">💰</div>
                <p class="empty-title">결제 내역이 없습니다</p>
              </div>
              <div v-else class="payment-list">
                <div
                  v-for="payment in pgPaymentHistories"
                  :key="payment.id"
                  class="payment-item"
                >
                  <div class="payment-info">
                    <span class="payment-date">{{ formatDate(payment.createdAt) }}</span>
                    <span class="payment-method">{{ payment.paymentMethod }}</span>
                    <span class="payment-amount">₩{{ formatPrice(payment.amount) }}</span>
                  </div>
                  <span class="payment-status" :class="payment.status.toLowerCase()">
                    {{ payment.status }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- 포인트 충전 모달 -->
          <div
            v-if="showPointChargeModal"
            class="modal-overlay"
            @click.self="closeChargeModal"
          >
            <div class="point-charge-modal">
              <div class="modal-header">
                <h3>포인트 충전</h3>
                <button class="close-btn" @click="closeChargeModal">✕</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>충전 금액</label>
                  <input
                    v-model.number="chargeAmount"
                    type="number"
                    min="10000"
                    step="10000"
                    placeholder="최소 10,000원"
                  />
                  <p class="input-hint">10,000원 단위로 입력해주세요.</p>
                </div>
              </div>
              <div class="modal-actions">
                <button class="btn btn-outline" @click="closeChargeModal">취소</button>
                <button
                  class="btn btn-primary"
                  :disabled="chargingPoint"
                  @click="requestPointCharge"
                >
                  {{ chargingPoint ? '충전 중...' : '충전하기' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 계정 설정 -->
          <section v-if="activeMenu === 'account-settings'" class="content-section">
            <h2 class="section-title">계정 설정</h2>

            <!-- 비밀번호 변경 -->
            <div class="panel account-panel">
              <div class="panel-header">
                <h3>비밀번호 변경</h3>
              </div>
              <form @submit.prevent="handleChangePassword" class="password-change-form">
                <div class="password-field-group">
                  <label class="password-label">현재 비밀번호</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="password-input"
                    placeholder="현재 비밀번호를 입력하세요"
                    required
                  />
                </div>

                <div class="password-field-group">
                  <label class="password-label">새 비밀번호</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="password-input"
                    placeholder="새 비밀번호를 입력하세요"
                    required
                  />
                  <p class="password-hint">영문, 숫자, 특수문자 포함 8자 이상</p>
                </div>

                <div class="password-field-group">
                  <label class="password-label">새 비밀번호 확인</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="password-input"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    required
                  />
                </div>

                <div class="password-form-footer">
                  <button
                    type="submit"
                    class="btn btn-primary btn-password-submit"
                    :disabled="changingPassword"
                  >
                    {{ changingPassword ? '변경 중...' : '변경하기' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- 회원 탈퇴 (임시 비활성화) -->
            <!--
            <div class="panel danger-zone">
              <div class="panel-header">
                <h3>회원 탈퇴</h3>
              </div>
              <div class="danger-content">
                <div class="danger-info">
                  <p class="danger-title">계정을 삭제하시겠습니까?</p>
                  <p class="danger-description">
                    회원 탈퇴 시 모든 개인정보 및 주문 내역이 영구적으로 삭제되며,<br />
                    이 작업은 취소할 수 없습니다.
                  </p>
                </div>
                <button
                  class="btn btn-danger"
                  @click="showDeleteAccountModal = true"
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
            -->
          </section>

          <!-- 알림 설정 -->
          <section v-if="activeMenu === 'notification-settings'" class="content-section">
            <h2 class="section-title">알림 설정</h2>

            <div class="panel">
              <div class="panel-header">
                <h3>알림 수신 설정</h3>
              </div>

              <div v-if="loadingNotificationSettings" class="loading-state">
                <p>알림 설정을 불러오는 중...</p>
              </div>

              <div v-else class="notification-settings-list">
                <div
                  v-for="setting in notificationSettings"
                  :key="setting.channel"
                  class="notification-setting-item"
                >
                  <div class="setting-info">
                    <span class="setting-icon">{{ getNotificationIcon(setting.channel) }}</span>
                    <div class="setting-details">
                      <h4 class="setting-title">
                        {{ getNotificationTitle(setting.channel) }}
                        <span v-if="setting.channel === 'IN_APP'" class="required-badge">필수</span>
                      </h4>
                      <p class="setting-description">{{ getNotificationDescription(setting.channel) }}</p>
                    </div>
                  </div>
                  <label class="toggle-switch">
                    <input
                      type="checkbox"
                      v-model="setting.isEnabled"
                      @change="handleNotificationToggle(setting)"
                      :disabled="setting.channel === 'IN_APP'"
                    />
                    <span class="toggle-slider" :class="{ 'disabled': setting.channel === 'IN_APP' }"></span>
                  </label>
                </div>
              </div>

              <div class="notification-save-footer">
                <button
                  class="btn btn-primary"
                  @click="saveNotificationSettings"
                  :disabled="savingNotificationSettings"
                >
                  {{ savingNotificationSettings ? '저장 중...' : '설정 저장' }}
                </button>
              </div>
            </div>
          </section>

          <!-- 주소 관리 -->
          <section v-if="activeMenu === 'address'" class="content-section">
            <h2 class="section-title">주소 관리</h2>
            <div class="panel">
              <div class="address-header">
                <p>등록된 주소: {{ addressList.length }}개</p>
                <button class="btn btn-primary" @click="addNewAddress">주소 추가</button>
              </div>
              <div v-if="loadingAddresses" class="loading-state">
                <p>주소 목록을 불러오는 중...</p>
              </div>
              <div v-else-if="addressList.length === 0" class="empty-state">
                <p>등록된 주소가 없습니다</p>
              </div>
              <div v-else class="address-list">
                <div
                  v-for="address in addressList"
                  :key="address.addressId"
                  class="address-item"
                >
                  <div class="address-content">
                    <div class="address-main">
                      <p class="address-text">
                        <span class="receiver-name">{{ address.receiverName }}</span>
                        <span class="phone-number">{{ address.phoneNumber }}</span>
                      </p>
                      <p class="address-full">
                        <span v-if="address.postalCode" class="postal-code">
                          [{{ address.postalCode }}]
                        </span>
                        {{ address.address }} {{ address.addressDetail || '' }}
                      </p>
                    </div>
                    <button
                      class="delete-btn"
                      @click="deleteAddress(address.addressId)"
                      :disabled="deletingAddressId === address.addressId"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="addressPageInfo.totalPages > 1" class="pagination">
                <button
                  class="page-btn"
                  :disabled="addressPageInfo.currentPage === 0"
                  @click="loadAddresses(addressPageInfo.currentPage - 1)"
                >
                  이전
                </button>
                <span class="page-info">
                  {{ addressPageInfo.currentPage + 1 }} / {{ addressPageInfo.totalPages }}
                </span>
                <button
                  class="page-btn"
                  :disabled="addressPageInfo.currentPage >= addressPageInfo.totalPages - 1"
                  @click="loadAddresses(addressPageInfo.currentPage + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </section>

          <!-- 주문 내역 (취소 제외) -->
          <section v-if="activeMenu === 'orders'" class="content-section">
            <h2 class="section-title">주문 내역</h2>
            <div class="panel">
              <div v-if="loadingOrders" class="loading-orders">
                <p>주문 내역을 불러오는 중...</p>
              </div>
              <div v-else-if="activeOrders.length === 0" class="empty-orders">
                <p>주문 내역이 없습니다</p>
                <router-link to="/products" class="btn btn-outline">상품 둘러보기</router-link>
              </div>
              <div v-else class="order-list">
                <div v-for="order in activeOrders" :key="order.orderId" class="order-item">
                  <div class="order-header">
                    <div>
                      <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                      <span class="order-number">주문번호: {{ order.orderId || '-' }}</span>
                    </div>
                    <span class="order-status" :class="order.status?.toLowerCase()">{{ getStatusText(order.status) }}</span>
                  </div>
                  <div v-if="order.products && order.products.length > 0" class="order-products">
                    <div v-for="product in order.products" :key="product.id" class="order-product">
                      <div class="product-details">
                        <h4>{{ product.title }}</h4>
                        <p class="product-option">{{ product.option }}</p>
                        <div class="product-meta">
                          <span>수량: {{ product.quantity }}개</span>
                          <span class="product-price">₩{{ formatPrice(product.price) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="order-summary">
                    <div class="order-summary-left">
                      <p v-if="order.groupPurchaseName" class="order-gp-name">
                        {{ order.groupPurchaseName }}
                      </p>
                    </div>
                    <div class="order-summary-right">
                      <p class="order-quantity label-bold">수량: {{ order.quantity }}개</p>
                      <p class="order-price label-bold">단가: ₩{{ formatPrice(order.price) }}</p>
                    </div>
                  </div>
                  <div class="order-footer">
                    <span class="order-total">총 결제금액: ₩{{ formatPrice(order.totalAmount) }}</span>
                    <div class="order-actions">
                      <button
                        v-if="order.status?.toUpperCase() === 'PENDING'"
                        class="btn btn-primary btn-sm"
                        @click="goToPayment(order)"
                      >
                        결제하기
                      </button>
                      <button
                        v-else
                        class="btn btn-outline btn-sm"
                        @click="viewOrderDetail(order.orderId)"
                      >
                        상세보기
                      </button>
                      <button
                        v-if="canCancelOrder(order)"
                        class="btn btn-danger btn-sm"
                        @click="handleCancelOrder(order.orderId)"
                      >
                        주문 취소
                      </button>
                      <button
                        v-if="canConfirmPurchase(order)"
                        class="btn btn-primary btn-sm"
                        @click="handleConfirmPurchase(order.orderId)"
                      >
                        주문 확정
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 주문 페이징 -->
              <div v-if="orderPageInfo.totalPages > 1" class="pagination">
                <button
                  class="page-btn"
                  :disabled="orderPageInfo.currentPage === 0"
                  @click="loadOrders(orderPageInfo.currentPage - 1)"
                >
                  이전
                </button>

                <span class="page-info">
                  {{ orderPageInfo.currentPage + 1 }} / {{ orderPageInfo.totalPages }}
                </span>

                <button
                  class="page-btn"
                  :disabled="orderPageInfo.currentPage >= orderPageInfo.totalPages - 1"
                  @click="loadOrders(orderPageInfo.currentPage + 1)"
                >
                  다음
                </button>
              </div>
            </div>
          </section>

          <!-- 주문 취소내역 -->
          <section v-if="activeMenu === 'cancelled-orders'" class="content-section">
            <h2 class="section-title">주문 취소내역</h2>
            <div class="panel">
              <div v-if="loadingCancelledOrders" class="loading-orders">
                <p>주문 취소내역을 불러오는 중...</p>
              </div>
              <div v-else-if="cancelledOrders.length === 0" class="empty-orders">
                <p>주문 취소내역이 없습니다</p>
              </div>
              <div v-else>
                <div class="order-list">
                  <div v-for="order in cancelledOrders" :key="order.orderId" class="order-item">
                    <div class="order-header">
                    <div>
                      <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                      <span class="order-number">주문번호: {{ order.orderId || '-' }}</span>
                    </div>
                      <span class="order-status cancelled">{{ getStatusText(order.status) }}</span>
                    </div>
                    <div class="order-summary">
                      <div class="order-summary-left">
                        <p v-if="order.groupPurchaseName" class="order-gp-name">
                          {{ order.groupPurchaseName }}
                        </p>
                      </div>
                      <div class="order-summary-right">
                        <p class="order-quantity">수량: {{ order.quantity }}개</p>
                        <p class="order-price">단가: ₩{{ formatPrice(order.price) }}</p>
                        <p v-if="order.reason" class="cancel-reason">취소 사유: {{ order.reason }}</p>
                      </div>
                    </div>
                    <div class="order-footer">
                      <span class="order-total">총 결제금액: ₩{{ formatPrice(order.totalAmount) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 페이지네이션 -->
                <div v-if="cancelledOrdersPageInfo.totalPages > 1" class="pagination">
                  <button
                    class="page-btn"
                    :disabled="cancelledOrdersPageInfo.currentPage === 0"
                    @click="loadCancelledOrders(cancelledOrdersPageInfo.currentPage - 1)"
                  >
                    이전
                  </button>
                  <span class="page-info">
                    {{ cancelledOrdersPageInfo.currentPage + 1 }} / {{ cancelledOrdersPageInfo.totalPages }}
                  </span>
                  <button
                    class="page-btn"
                    :disabled="cancelledOrdersPageInfo.currentPage >= cancelledOrdersPageInfo.totalPages - 1"
                    @click="loadCancelledOrders(cancelledOrdersPageInfo.currentPage + 1)"
                  >
                    다음
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 판매자 센터 -->
          <section
            v-if="isSeller && activeMenu === 'seller-center'"
            class="content-section seller-center"
          >
            <h2 class="section-title">판매자 센터</h2>
            <div class="seller-center-grid">
              <div class="seller-card seller-info-card">
                <div class="card-header">
                  <div>
                    <p class="card-subtitle">은행</p>
                    <h3>{{ sellerAccountInfo.bank || '은행 미지정' }}</h3>
                  </div>
                  <div class="edit-actions">
                    <button
                      v-if="!isEditingSellerInfo"
                      class="link-button"
                      @click="startEditSellerInfo"
                    >
                      정보 수정
                    </button>
                    <button
                      v-else
                      class="link-button"
                      @click="cancelEditSellerInfo"
                    >
                      수정 취소
                    </button>
                  </div>
                </div>
                <div v-if="isEditingSellerInfo" class="seller-edit-form">
                  <form @submit.prevent="saveSellerInfo">
                    <div class="form-row">
                      <div class="form-group">
                        <label>은행</label>
                        <select v-model="sellerInfoForm.bankCode" required>
                          <option value="">은행을 선택하세요</option>
                          <option
                            v-for="bank in bankList"
                            :key="bank.code"
                            :value="bank.code"
                          >
                            {{ bank.name }}
                          </option>
                        </select>
                        <p v-if="sellerInfoErrors.bankCode" class="form-error">{{ sellerInfoErrors.bankCode }}</p>
                      </div>
                      <div class="form-group">
                        <label>계좌번호</label>
                        <input
                          v-model="sellerInfoForm.accountNumber"
                          type="text"
                          placeholder="계좌번호를 입력하세요"
                          required
                        />
                        <p v-if="sellerInfoErrors.accountNumber" class="form-error">{{ sellerInfoErrors.accountNumber }}</p>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label>예금주</label>
                        <input
                          v-model="sellerInfoForm.accountHolder"
                          type="text"
                          placeholder="예금주명을 입력하세요"
                          required
                        />
                        <p v-if="sellerInfoErrors.accountHolder" class="form-error">{{ sellerInfoErrors.accountHolder }}</p>
                      </div>
                      <div class="form-group">
                        <label>사업자 등록번호</label>
                        <input
                          v-model="sellerInfoForm.businessRegistrationNumber"
                          type="text"
                          placeholder="000-00-00000"
                          required
                        />
                        <p v-if="sellerInfoErrors.businessRegistrationNumber" class="form-error">{{ sellerInfoErrors.businessRegistrationNumber }}</p>
                      </div>
                    </div>
                    <div class="seller-edit-actions">
                      <button type="button" class="btn btn-outline btn-sm" @click="cancelEditSellerInfo">
                        취소
                      </button>
                      <button type="submit" class="btn btn-primary btn-sm" :disabled="savingSellerInfo">
                        {{ savingSellerInfo ? '저장 중...' : '저장하기' }}
                      </button>
                    </div>
                  </form>
                </div>
                <dl v-else class="info-list">
                  <div class="info-row">
                    <dt>계좌번호</dt>
                    <dd>{{ sellerAccountInfo.accountNumber || '-' }}</dd>
                  </div>
                  <div class="info-row">
                    <dt>예금주</dt>
                    <dd>{{ sellerAccountInfo.owner || '-' }}</dd>
                  </div>
                  <div class="info-row">
                    <dt>사업자 등록번호</dt>
                    <dd>{{ sellerAccountInfo.businessNumber || '-' }}</dd>
                  </div>
                  <div class="info-row">
                    <dt>전화번호</dt>
                    <dd>{{ sellerAccountInfo.phone || '-' }}</dd>
                  </div>
                  <div class="info-row">
                    <dt>이메일</dt>
                    <dd>{{ sellerAccountInfo.email || '-' }}</dd>
                  </div>
                </dl>
              </div>

              <div class="seller-card inquiry-card">
                <div class="card-header">
                  <div>
                    <p class="card-subtitle">고객 문의 현황</p>
                    <h3>최근 문의</h3>
                  </div>
                </div>
                <ul class="inquiry-list">
                  <li v-for="inquiry in sellerInquiries" :key="inquiry.question">
                    <p class="question">Q. {{ inquiry.question }}</p>
                    <p class="answer">A. {{ inquiry.answer }}</p>
                    <span class="status">{{ inquiry.status }}</span>
                  </li>
                </ul>
              </div>

              <div class="seller-card notice-card">
                <div class="card-header">
                  <div>
                    <p class="card-subtitle">공지 사항</p>
                    <h3>업데이트 소식</h3>
                  </div>
                </div>
                <ul class="notice-list">
                  <li v-for="notice in sellerNotices" :key="notice.title" class="notice-item">
                    <div class="notice-meta">
                      <span class="badge">{{ notice.category }}</span>
                      <span class="date">{{ notice.date }}</span>
                    </div>
                    <p class="notice-title">{{ notice.title }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 판매 목록 -->
          <section
            v-if="isSeller && activeMenu === 'seller-sales'"
            class="content-section seller-center seller-sales-section"
          >
            <h2 class="section-title">판매 목록</h2>

            <div class="seller-sales-hero">
              <div>
                <h3>내 상품과 공동구매를 한 눈에</h3>
                <p>카테고리별로 검색하고 새로운 판매를 빠르게 시작하세요.</p>
              </div>
              <div class="hero-actions">
                <button class="btn btn-primary" @click="goToProductRegister">+ 상품 등록</button>
                <button class="btn btn-primary" @click="goToGroupPurchaseCreate">+ 공동구매 등록</button>
              </div>
            </div>

            <div class="sales-stats-grid">
              <div
                v-for="stat in sellerSalesStats"
                :key="stat.label"
                class="sales-stat-card"
              >
                <p class="stat-label">{{ stat.label }}</p>
                <p class="stat-value">{{ stat.value }}</p>
                <p class="stat-subtext">{{ stat.subtext }}</p>
              </div>
            </div>

            <div class="seller-sales-grid">
              <div class="seller-card product-card">
                <div class="card-header align-start">
                  <div>
                    <h3>내 상품 목록</h3>
                    <p class="card-subtitle">
                      상세 검색과 관리 기능은 전체 보기 페이지에서 이용할 수 있습니다.
                    </p>
                  </div>
                  <button class="link-button" @click="goToSellerProducts">
                    전체 상품 보기 →
                  </button>
                </div>
                <div class="seller-mini-section">
                  <div v-if="sellerProductsLoading" class="mini-loading">
                    <p>상품 정보를 불러오는 중...</p>
                  </div>
                  <div v-else-if="sellerProductsPreview.length === 0" class="mini-empty">
                    <p>등록된 상품이 없습니다</p>
                  </div>
                  <div v-else class="seller-mini-list">
                    <div class="seller-mini-hero">
                      <div class="hero-info">
                        <p class="hero-title">{{ sellerProductsPreview[0].title }}</p>
                        <span class="hero-sub">{{ sellerProductsPreview[0].category }}</span>
                      </div>
                      <div class="hero-meta">
                        <span class="hero-price">₩{{ formatPrice(sellerProductsPreview[0].price) }}</span>
                        <span class="hero-updated">{{ formatDateShort(sellerProductsPreview[0].updatedAt) }}</span>
                      </div>
                    </div>
                    <div
                      v-for="product in sellerProductsPreview.slice(1)"
                      :key="product.id"
                      class="seller-mini-item"
                    >
                      <div class="mini-info">
                        <p class="mini-title">{{ product.title }}</p>
                        <span class="mini-sub">{{ product.category }}</span>
                      </div>
                      <div class="mini-meta">
                        <span class="mini-price">₩{{ formatPrice(product.price) }}</span>
                        <span class="mini-updated">{{ formatDateShort(product.updatedAt) }}</span>
                      </div>
                    </div>
                    <p v-if="sellerProductsAll.length > sellerProductsPreview.length" class="mini-extra">
                      외 {{ sellerProductsAll.length - sellerProductsPreview.length }}건이 더 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div class="seller-card gp-card">
                <div class="card-header align-start">
                  <div>
                    <h3>내 공동구매 목록</h3>
                    <p class="card-subtitle">
                      상세 검색과 관리 기능은 전체 보기 페이지에서 이용할 수 있습니다.
                    </p>
                  </div>
                  <button class="link-button" @click="goToGroupPurchaseManage">
                    공동구매 전체 보기 →
                  </button>
                </div>
                <div class="seller-mini-section">
                  <div v-if="sellerGroupPurchasesLoading" class="mini-loading">
                    <p>공동구매 정보를 불러오는 중...</p>
                  </div>
                  <div v-else-if="sellerGroupPurchasesPreview.length === 0" class="mini-empty">
                    <p>진행 중인 공동구매가 없습니다</p>
                  </div>
                  <div v-else class="seller-mini-list">
                    <div class="seller-mini-hero gp">
                      <div class="hero-info">
                        <p class="hero-title">{{ sellerGroupPurchasesPreview[0].title }}</p>
                        <span class="hero-sub">{{ sellerGroupPurchasesPreview[0].category }}</span>
                      </div>
                      <div class="hero-meta">
                        <span class="hero-price">₩{{ formatPrice(sellerGroupPurchasesPreview[0].discountPrice) }}</span>
                        <span class="hero-progress">{{ sellerGroupPurchasesPreview[0].currentCount }}/{{ sellerGroupPurchasesPreview[0].maxQuantity }}명</span>
                      </div>
                    </div>
                    <div
                      v-for="gp in sellerGroupPurchasesPreview.slice(1)"
                      :key="gp.id"
                      class="seller-mini-item"
                    >
                      <div class="mini-info">
                        <p class="mini-title">{{ gp.title }}</p>
                        <span class="mini-sub">{{ gp.category }}</span>
                      </div>
                      <div class="mini-meta">
                        <span class="mini-price">₩{{ formatPrice(gp.discountPrice) }}</span>
                        <span class="mini-progress">{{ gp.currentCount }}/{{ gp.maxQuantity }}명</span>
                      </div>
                    </div>
                    <p v-if="sellerGroupPurchasesAll.length > sellerGroupPurchasesPreview.length" class="mini-extra">
                      외 {{ sellerGroupPurchasesAll.length - sellerGroupPurchasesPreview.length }}건이 더 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 주문 현황 -->
          <section
            v-if="isSeller && activeMenu === 'seller-orders'"
            class="content-section seller-center"
          >
            <h2 class="section-title">주문 현황</h2>
            <div v-if="sellerGroupPurchasesLoading && sellerGroupPurchasesAll.length === 0" class="mini-loading">
              <p>공동구매 정보를 불러오는 중입니다...</p>
            </div>
            <div v-else-if="sellerGroupPurchasesAll.length === 0" class="mini-empty">
              <p>등록된 공동구매가 없습니다.</p>
            </div>
            <div v-else class="seller-orders-grid">
              <article
                v-for="gp in sellerGroupPurchasesAll"
                :key="gp.id"
                class="seller-order-card"
              >
                <div class="seller-order-header">
                  <span class="status-badge" :class="gp.status?.toLowerCase()">{{ getStatusText(gp.status) }}</span>
                  <span class="seller-order-dates">
                    {{ gp.endDate ? getTimeRemaining(gp.endDate) : '기간 미정' }}
                  </span>
                </div>
                <div class="seller-order-body">
                  <div class="seller-order-info">
                    <p class="seller-order-title">{{ gp.title }}</p>
                    <p class="seller-order-sub">{{ gp.category }}</p>
                  </div>
                  <div class="seller-order-price">
                    <span class="current-price">₩{{ formatPrice(gp.discountPrice) }}</span>
                    <span class="original-price">₩{{ formatPrice(gp.originalPrice) }}</span>
                  </div>
                  <div class="seller-order-progress">
                    <div class="progress-info">
                      <span>{{ gp.currentCount }} / {{ gp.maxQuantity }}명</span>
                      <span>{{ Math.round((gp.currentCount / gp.maxQuantity) * 100) }}%</span>
                    </div>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: `${Math.min((gp.currentCount / gp.maxQuantity) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="seller-order-actions">
                  <button
                    class="btn btn-outline btn-sm"
                    @click="toggleGroupPurchaseOrders(gp.id)"
                  >
                    {{ expandedGroupPurchaseId === gp.id ? '주문 목록 닫기' : '주문 목록 보기' }}
                  </button>
                  <button class="btn btn-outline btn-sm" @click="goGroupPurchaseDetail(gp.id)">
                    상세 보기
                  </button>
                </div>
                <div
                  v-if="expandedGroupPurchaseId === gp.id"
                  class="order-dropdown"
                >
                  <div v-if="sellerOrdersLoading" class="mini-loading">
                    <p>주문 정보를 불러오는 중입니다...</p>
                  </div>
                  <div
                    v-else-if="getOrdersForGroupPurchase(gp).length === 0"
                    class="mini-empty"
                  >
                    <p>주문 내역이 없습니다.</p>
                  </div>
                  <div v-else class="order-dropdown-list">
                    <div
                      v-for="order in getOrdersForGroupPurchase(gp)"
                      :key="order.orderId"
                      class="order-dropdown-item"
                    >
                      <div class="order-dropdown-left">
                        <p class="order-id">#{{ order.orderId }}</p>
                        <p class="order-date">{{ formatDateShort(order.createdAt) }}</p>
                        <p class="order-buyer">{{ order.buyerName }}</p>
                        <p class="order-detail">{{ order.quantity }}개 × ₩{{ formatPrice(order.price) }}</p>
                      </div>
                      <div class="order-dropdown-right">
                        <span class="order-amount">₩{{ formatPrice(order.totalAmount) }}</span>
                        <span class="order-status" :class="order.status">{{ getStatusText(order.status) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- 정산 현황 -->
          <section
            v-if="isSeller && activeMenu === 'seller-settlement'"
            class="content-section seller-center"
          >
            <h2 class="section-title">정산 현황</h2>

            <!-- 정산 잔액 -->
            <div class="panel">
              <div class="panel-header">
                <h3>현재 잔액</h3>
              </div>
              <div class="settlement-balance">
                <div v-if="sellerBalanceLoading" class="loading-state">
                  <p>잔액 조회 중...</p>
                </div>
                <div v-else class="balance-display">
                  <p class="balance-label">정산 가능 금액</p>
                  <p class="balance-amount">₩{{ formatPrice(sellerBalance) }}</p>
                </div>
              </div>
            </div>

            <!-- 정산 이력 -->
            <div class="panel">
              <div class="panel-header">
                <h3>정산 이력</h3>
                <button class="link-button" @click="goToSellerSettlement">
                  전체보기 →
                </button>
              </div>
              <div v-if="sellerBalanceHistoryLoading" class="loading-state">
                <p>정산 이력을 불러오는 중...</p>
              </div>
              <div v-else-if="sellerBalanceHistory.length === 0" class="empty-state">
                <p>정산 내역이 없습니다</p>
              </div>
              <div v-else class="history-list">
                <div
                  v-for="item in sellerBalanceHistory"
                  :key="item.id"
                  class="settlement-history-item"
                >
                  <div class="history-info">
                    <span class="history-date">{{ formatDate(item.createdAt) }}</span>
                    <span class="history-status">{{ item.status }}</span>
                  </div>
                  <span class="history-amount">₩{{ formatPrice(item.amount) }}</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>

    <!-- 주소 목록 모달 -->
    <div v-if="showAddressModal" class="modal-overlay" @click.self="closeAddressModal">
      <div class="address-modal">
        <div class="modal-header">
          <h2>주소 관리</h2>
          <button class="close-btn" @click="closeAddressModal">✕</button>
        </div>
        <div class="address-list-container">
          <div v-if="loadingAddresses" class="loading-state">
            <p>주소 목록을 불러오는 중...</p>
          </div>
          <div v-else-if="addressList.length === 0" class="empty-state">
            <p>등록된 주소가 없습니다</p>
            <button class="btn btn-primary" @click="addNewAddress">주소 추가</button>
          </div>
          <div v-else class="address-list">
            <div
              v-for="address in addressList"
              :key="address.addressId"
              class="address-item"
            >
              <div class="address-content">
                <div class="address-main">
                  <p class="address-text">
                    <span class="receiver-name">{{ address.receiverName }}</span>
                    <span class="phone-number">{{ address.phoneNumber }}</span>
                  </p>
                  <p class="address-full">
                    <span v-if="address.postalCode" class="postal-code">
                      [{{ address.postalCode }}]
                    </span>
                    {{ address.address }} {{ address.addressDetail || '' }}
                  </p>
                </div>

                <!-- ❌ 삭제 버튼 -->
                <button
                  class="delete-btn"
                  @click="deleteAddress(address.addressId)"
                  :disabled="deletingAddressId === address.addressId"
                >
                  ✕
                </button>
              </div>
            </div>
            <!-- 페이지네이션 -->
            <div v-if="addressPageInfo.totalPages > 1" class="pagination">
              <button
                class="page-btn"
                :disabled="addressPageInfo.currentPage === 0"
                @click="loadAddresses(addressPageInfo.currentPage - 1)"
              >
                이전
              </button>
              <span class="page-info">
                {{ addressPageInfo.currentPage + 1 }} / {{ addressPageInfo.totalPages }}
              </span>
              <button
                class="page-btn"
                :disabled="addressPageInfo.currentPage >= addressPageInfo.totalPages - 1"
                @click="loadAddresses(addressPageInfo.currentPage + 1)"
              >
                다음
              </button>
            </div>
            <!-- 주소 추가 버튼 -->
            <div class="add-address-section">
              <button class="btn btn-primary" @click="addNewAddress">주소 추가</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 주소 수정 모달 -->
    <div v-if="showEditAddressModal" class="modal-overlay" @click.self="closeEditAddressModal">
      <div class="address-edit-modal">
        <div class="modal-header">
          <h2>{{ editingAddress ? '주소 수정' : '주소 추가' }}</h2>
          <button class="close-btn" @click.stop="closeEditAddressModal">✕</button>
        </div>
        <form @submit.prevent="saveAddress" class="address-form">
          <div class="form-group">
            <label>받는 분 이름 *</label>
            <input v-model="addressForm.receiverName" type="text" required placeholder="받는 분 이름을 입력하세요" />
          </div>
          <div class="form-group">
            <label>받는 분 전화번호 *</label>
            <input v-model="addressForm.phoneNumber" type="tel" required placeholder="010-0000-0000" />
          </div>
          <div class="form-group">
            <label>주소 *</label>
            <AddressSearch
              v-model="addressFormData"
              @update:modelValue="handleAddressUpdate"
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="closeEditAddressModal">취소</button>
            <button type="submit" class="btn btn-primary" :disabled="savingAddress">
              {{ savingAddress ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- 주문 상세 모달 -->
    <div
      v-if="showOrderDetailModal"
      class="modal-overlay"
      @click.self="closeOrderDetailModal"
    >
      <div class="order-detail-modal">
        <div class="modal-header">
          <h2>주문 상세</h2>
          <button class="close-btn" @click.stop="closeOrderDetailModal">✕</button>
        </div>

        <div v-if="selectedOrder" class="order-detail-body">

          <!-- 주문 정보 -->
          <div class="order-detail-grid">

            <!-- LEFT -->
            <div class="order-detail-col">
              <!-- 주문 정보 -->
              <section class="order-detail-section">
                <h4 class="section-title">주문 정보</h4>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">주문번호</span>
                    <span class="value">{{ selectedOrder.orderId }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">주문일자</span>
                    <span class="value">{{ formatDate(selectedOrder.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">주문 상태</span>
                    <span class="value status">
                      {{ getStatusText(selectedOrder.status) }}
                    </span>
                  </div>
                </div>
              </section>

              <!-- 공동구매 정보 -->
              <section class="order-detail-section">
                <h4 class="section-title">공동구매 정보</h4>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">제목</span>
                    <span class="value">{{ selectGroupPurchase?.title || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">카테고리</span>
                    <span class="value badge">
                      {{ selectGroupPurchase?.category || '-' }}
                    </span>
                  </div>
                  <button
                    v-if="selectGroupPurchase"
                    class="link-btn"
                    @click="goGroupPurchaseDetail(
                      selectGroupPurchase.groupPurchaseId || selectGroupPurchase.id
                    )"
                  >
                    공동구매 페이지 →
                  </button>
                </div>
              </section>
            </div>

            <!-- RIGHT -->
            <div class="order-detail-col">
              <!-- 상품 정보 -->
              <section class="order-detail-section">
                <h4 class="section-title">상품 정보</h4>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">상품명</span>
                    <span class="value">{{ selectProduct?.name || '-' }}</span>
                  </div>
                </div>
              </section>

              <!-- 배송 정보 -->
              <section class="order-detail-section">
                <h4 class="section-title">배송 정보</h4>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">받는 분</span>
                    <span class="value">{{ selectedOrder.receiverName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">우편번호</span>
                    <span class="value">{{ selectedOrder.postalCode }}</span>
                  </div>
                  <div class="info-item column">
                    <span class="label">주소</span>
                    <span class="value">
                      {{ selectedOrder.address }} {{ selectedOrder.addressDetail }}
                    </span>
                  </div>
                </div>
              </section>

              <!-- 결제 정보 -->
              <section class="order-detail-section">
                <h4 class="section-title">결제 정보</h4>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">수량</span>
                    <span class="value">{{ selectedOrder.quantity }}개</span>
                  </div>
                  <div class="info-item">
                    <span class="label">단가</span>
                    <span class="value">₩{{ formatPrice(selectedOrder.price) }}</span>
                  </div>
                  <div class="info-item total">
                    <span class="label">총 결제금액</span>
                    <span class="value highlight">
                      ₩{{ formatPrice(selectedOrder.quantity * selectedOrder.price) }}
                    </span>
                  </div>
                </div>
              </section>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- 회원 탈퇴 확인 모달 (임시 비활성화) -->
    <!--
    <div
      v-if="showDeleteAccountModal"
      class="modal-overlay"
      @click.self="showDeleteAccountModal = false"
    >
      <div class="delete-account-modal">
        <div class="modal-header">
          <h2>회원 탈퇴</h2>
          <button class="close-btn" @click="showDeleteAccountModal = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="warning-text">
            정말로 탈퇴하시겠습니까?<br />
            탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <form @submit.prevent="handleDeleteAccount" class="delete-form">
            <div class="form-group">
              <label>비밀번호 확인 *</label>
              <input
                v-model="deleteAccountForm.password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="btn btn-outline"
                @click="showDeleteAccountModal = false"
                :disabled="deletingAccount"
              >
                취소
              </button>
              <button
                type="submit"
                class="btn btn-danger"
                :disabled="deletingAccount"
              >
                {{ deletingAccount ? '탈퇴 중...' : '탈퇴하기' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    -->
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import { authAPI } from '@/api/auth'
import AddressSearch from '@/components/AddressSearch.vue'
import api, { groupPurchaseApi, productApi, notificationSettingApi, pointApi } from '@/api/axios'

const router = useRouter()
const route = useRoute()

// 활성 메뉴 (기본값: 프로필)
const activeMenu = ref('profile')

const syncActiveMenuFromRoute = () => {
  const tab = route.query.tab
  const allowedTabs = [
    'profile',
    'address',
    'point',
    'payments',
    'account-settings',
    'notification-settings',
    'orders',
    'cancelled-orders',
    'seller-center',
    'seller-sales',
    'seller-orders',
    'seller-settlement'
  ]
  if (typeof tab === 'string' && allowedTabs.includes(tab)) {
    activeMenu.value = tab
  }
}

// 판매자 센터 데이터
const sellerAccountInfo = ref({
  bank: '',
  bankCode: '',
  accountNumber: '',
  owner: '',
  businessNumber: '',
  phone: '',
  email: ''
})

const sellerProductsAll = ref([])
const sellerGroupPurchasesAll = ref([])
const sellerProductsLoading = ref(false)
const sellerGroupPurchasesLoading = ref(false)
const sellerProductsLoaded = ref(false)
const sellerGroupPurchasesLoaded = ref(false)
const isEditingSellerInfo = ref(false)
const savingSellerInfo = ref(false)
const sellerInfoErrors = ref({
  bankCode: '',
  accountNumber: '',
  accountHolder: '',
  businessRegistrationNumber: ''
})
const sellerInfoForm = ref({
  bankCode: '',
  accountNumber: '',
  accountHolder: '',
  businessRegistrationNumber: ''
})

const formatCount = (value) => Number(value || 0).toLocaleString()

const sellerGroupPurchasesOpenCount = computed(() => {
  return sellerGroupPurchasesAll.value.filter(gp => (gp.status || '').toUpperCase() === 'OPEN').length
})

const sellerOrdersAll = ref([])
const sellerOrdersLoading = ref(false)
const sellerOrdersLoaded = ref(false)
const expandedGroupPurchaseId = ref(null)

// 정산 관련 상태
const sellerBalance = ref(0)
const sellerBalanceHistory = ref([])
const sellerBalanceLoading = ref(false)
const sellerBalanceHistoryLoading = ref(false)
const sellerBalanceLoaded = ref(false)

const sellerSalesStats = computed(() => [
  { label: '등록된 상품', value: formatCount(sellerProductsAll.value.length), subtext: '현재 등록된 상품 수' },
  { label: '진행 중 공동구매', value: formatCount(sellerGroupPurchasesOpenCount.value), subtext: 'OPEN 상태 공동구매' },
  { label: '전체 공동구매', value: formatCount(sellerGroupPurchasesAll.value.length), subtext: '누적 등록 공동구매' }
])

const sellerProductsPreview = computed(() => sellerProductsAll.value.slice(0, 3))
const sellerGroupPurchasesPreview = computed(() => sellerGroupPurchasesAll.value.slice(0, 3))
const ordersByGroupPurchase = computed(() => {
  const map = {}
  sellerOrdersAll.value.forEach(order => {
    const key = (order.groupPurchaseId || order.groupPurchaseName || '').toString()
    if (!map[key]) map[key] = []
    map[key].push(order)
  })
  return map
})

const getOrdersForGroupPurchase = (group) => {
  if (!group) return []
  const keyId = group.id ? group.id.toString() : null
  if (keyId && ordersByGroupPurchase.value[keyId] && ordersByGroupPurchase.value[keyId].length) {
    return ordersByGroupPurchase.value[keyId]
  }
  const keyName = group.title || group.groupPurchaseName
  if (keyName && ordersByGroupPurchase.value[keyName]) {
    return ordersByGroupPurchase.value[keyName]
  }
  return []
}

const toggleGroupPurchaseOrders = (groupId) => {
  expandedGroupPurchaseId.value = expandedGroupPurchaseId.value === groupId ? null : groupId
}

const sellerInquiries = ref([
  {
    question: '아이폰 색상 변경 가능한가요?',
    answer: '네, 공동구매 종료 전까지 색상 변경 가능합니다. 채팅 또는 문의 남겨주세요.',
    status: '완료'
  },
  {
    question: '워치 밴드 추가 구매 가능한가요?',
    answer: '추가 구성으로 실리콘 밴드(₩19,000) 구매 옵션을 열어두었습니다.',
    status: '완료'
  },
  {
    question: '배송지 변경은 언제까지 되나요?',
    answer: '결제 후 24시간 이내에만 가능합니다. 배송 탭의 “배송지 변경” 버튼을 이용해주세요.',
    status: '완료'
  }
])

const sellerNotices = ref([
  {
    category: '배송',
    title: '12월 배송 일정 안내',
    date: '2025-12-01'
  },
  {
    category: '이벤트',
    title: '신규 공동구매 오픈 예고 (이어폰/태블릿)',
    date: '2025-11-28'
  },
  {
    category: '공지',
    title: 'A/S 접수 방법 간소화 안내',
    date: '상시'
  }
])

const bankList = [
  { code: '002', name: 'KDB산업은행' },
  { code: '003', name: 'IBK기업은행' },
  { code: '004', name: 'KB국민은행' },
  { code: '005', name: 'KEB하나은행' },
  { code: '007', name: '수협은행' },
  { code: '011', name: 'NH농협은행' },
  { code: '020', name: '우리은행' },
  { code: '023', name: 'SC은행' },
  { code: '027', name: '씨티은행' },
  { code: '031', name: '대구은행' },
  { code: '032', name: '부산은행' },
  { code: '034', name: '광주은행' },
  { code: '035', name: '제주은행' },
  { code: '037', name: '전북은행' },
  { code: '039', name: '경남은행' },
  { code: '045', name: 'MG새마을금고' },
  { code: '048', name: '신협' },
  { code: '050', name: '저축은행' },
  { code: '071', name: '우체국' },
  { code: '088', name: '신한은행' },
  { code: '089', name: '케이뱅크' },
  { code: '090', name: '카카오뱅크' },
  { code: '092', name: '토스뱅크' }
]

const sellerProductCategoryMap = {
  HOME: '생활 & 주방',
  FOOD: '식품 & 간식',
  HEALTH: '건강 & 헬스',
  BEAUTY: '뷰티',
  FASHION: '패션 & 의류',
  ELECTRONICS: '전자 & 디지털',
  KIDS: '유아 & 어린이',
  HOBBY: '취미',
  PET: '반려동물'
}

const sellerGroupCategoryMap = sellerProductCategoryMap

const loadSellerAccountInfo = async () => {
  try {
    const memberId = localStorage.getItem('member_id')
    if (!memberId) return
    const response = await authAPI.getSellerInfo(memberId)
    const raw = response?.data || response
    sellerAccountInfo.value = {
      bank: bankList.find(bank => bank.code === raw.bankCode)?.name || raw.bankName || raw.bank || '은행 미지정',
      bankCode: raw.bankCode || '',
      accountNumber: raw.accountNumber || '-',
      owner: raw.accountHolder || raw.owner || raw.name || '-',
      businessNumber: raw.businessRegistrationNumber || raw.businessNumber || '-',
      phone: raw.phoneNumber || raw.phone || '-',
      email: raw.email || raw.contactEmail || localStorage.getItem('user_email') || '-'
    }
    sellerInfoForm.value = {
      bankCode: raw.bankCode || '',
      accountNumber: raw.accountNumber || '',
      accountHolder: raw.accountHolder || raw.owner || raw.name || '',
      businessRegistrationNumber: raw.businessRegistrationNumber || raw.businessNumber || ''
    }
  } catch (error) {
    console.error('판매자 정보 로드 실패:', error)
  }
}

const loadSellerProductsSummary = async () => {
  if (sellerProductsLoading.value) return
  sellerProductsLoading.value = true
  try {
    const response = await productApi.getProducts({ size: 200 })
    const data = response.data?.data || response.data
    const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : []
    sellerProductsAll.value = list.map(product => {
      const categoryKey = product.category || product.categoryCode
      return {
        id: product.productId || product.id,
        title: product.name || product.title || '상품명 미확인',
        category: sellerProductCategoryMap[categoryKey] || categoryKey || '기타',
        rawCategory: categoryKey,
        price: product.price || product.currentPrice || 0,
        updatedAt: product.updatedAt || product.modifiedAt || product.createdAt,
        status: product.status || '판매중'
      }
    })
  } catch (error) {
    console.error('판매자 상품 요약 로드 실패:', error)
  } finally {
    sellerProductsLoading.value = false
    sellerProductsLoaded.value = true
  }
}

const loadSellerGroupPurchasesSummary = async () => {
  if (sellerGroupPurchasesLoading.value) return
  sellerGroupPurchasesLoading.value = true
  try {
    const response = await groupPurchaseApi.getMyGroupPurchases('createdAt,desc')
    const raw = response.data?.data || response.data
    const content = raw?.content || raw || []
    sellerGroupPurchasesAll.value = content.map(gp => {
      const categoryKey = gp.category
      return {
        id: gp.groupPurchaseId || gp.id,
        title: gp.title || '공동구매명',
        category: sellerGroupCategoryMap[categoryKey] || categoryKey || '기타',
        rawCategory: categoryKey,
        seller: gp.sellerName || '판매자',
        discountPrice: gp.discountedPrice || gp.discountPrice || gp.price || 0,
        originalPrice: gp.price || gp.originalPrice || gp.discountPrice || 0,
        currentCount: gp.currentQuantity || gp.currentCount || 0,
        maxQuantity: gp.maxQuantity || gp.maxCount || 0,
        status: gp.status || 'OPEN',
        startDate: gp.startDate,
        endDate: gp.endDate
      }
    })
  } catch (error) {
    console.error('판매자 공동구매 요약 로드 실패:', error)
  } finally {
    sellerGroupPurchasesLoading.value = false
    sellerGroupPurchasesLoaded.value = true
  }
}

const loadSellerOrdersSummary = async () => {
  if (sellerOrdersLoading.value) return
  sellerOrdersLoading.value = true
  try {
    const response = await authAPI.getSellerOrders({
      page: 0,
      size: 20,
      sort: 'createdAt,desc'
    })
    const raw = response?.data || response
    const list = raw?.content || raw || []
    sellerOrdersAll.value = list.map(order => ({
      orderId: order.orderId || order.id,
      status: order.status,
      quantity: order.quantity,
      price: order.price,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      groupPurchaseId: order.groupPurchaseId,
      groupPurchaseName: order.groupPurchaseName || '공동구매',
      buyerName: '구매자'
    }))
  } catch (error) {
    console.error('판매자 주문 정보 로드 실패:', error)
    sellerOrdersAll.value = []
  } finally {
    sellerOrdersLoading.value = false
    sellerOrdersLoaded.value = true
  }
}

// 판매자 잔액 조회
const loadSellerBalance = async () => {
  sellerBalanceLoading.value = true
  try {
    const response = await authAPI.getSellerBalance()
    const data = response?.data || response
    sellerBalance.value = data?.balance || 0
  } catch (error) {
    console.error('판매자 잔액 조회 실패:', error)
    sellerBalance.value = 0
  } finally {
    sellerBalanceLoading.value = false
  }
}

// 판매자 정산 이력 조회
const loadSellerBalanceHistory = async () => {
  if (sellerBalanceHistoryLoading.value) return
  sellerBalanceHistoryLoading.value = true
  try {
    const response = await authAPI.getSellerBalanceHistory({
      page: 0,
      size: 10,
      sort: 'createdAt,desc'
    })
    const raw = response?.data || response
    const list = raw?.content || raw || []
    sellerBalanceHistory.value = list.map(item => ({
      id: item.sellerBalanceHistoryId,
      settlementId: item.settlementId,
      amount: item.amount,
      status: item.status,
      createdAt: item.createdAt
    }))
  } catch (error) {
    console.error('판매자 정산 이력 조회 실패:', error)
    sellerBalanceHistory.value = []
  } finally {
    sellerBalanceHistoryLoading.value = false
    sellerBalanceLoaded.value = true
  }
}

const clearSellerInfoErrors = () => {
  sellerInfoErrors.value = {
    bankCode: '',
    accountNumber: '',
    accountHolder: '',
    businessRegistrationNumber: ''
  }
}

const resetSellerInfoForm = () => {
  sellerInfoForm.value = {
    bankCode: sellerAccountInfo.value.bankCode || '',
    accountNumber: sellerAccountInfo.value.accountNumber && sellerAccountInfo.value.accountNumber !== '-' ? sellerAccountInfo.value.accountNumber : '',
    accountHolder: sellerAccountInfo.value.owner && sellerAccountInfo.value.owner !== '-' ? sellerAccountInfo.value.owner : '',
    businessRegistrationNumber: sellerAccountInfo.value.businessNumber && sellerAccountInfo.value.businessNumber !== '-' ? sellerAccountInfo.value.businessNumber : ''
  }
  clearSellerInfoErrors()
}

const startEditSellerInfo = () => {
  resetSellerInfoForm()
  isEditingSellerInfo.value = true
}

const cancelEditSellerInfo = () => {
  resetSellerInfoForm()
  isEditingSellerInfo.value = false
}

const validateSellerInfo = () => {
  clearSellerInfoErrors()
  let valid = true
  if (!sellerInfoForm.value.bankCode) {
    sellerInfoErrors.value.bankCode = '은행을 선택하세요.'
    valid = false
  }
  if (!sellerInfoForm.value.accountNumber) {
    sellerInfoErrors.value.accountNumber = '계좌번호를 입력하세요.'
    valid = false
  } else if (!/^[0-9-]+$/.test(sellerInfoForm.value.accountNumber)) {
    sellerInfoErrors.value.accountNumber = '계좌번호는 숫자와 하이픈만 입력 가능합니다.'
    valid = false
  }
  if (!sellerInfoForm.value.accountHolder) {
    sellerInfoErrors.value.accountHolder = '예금주명을 입력하세요.'
    valid = false
  }
  if (!sellerInfoForm.value.businessRegistrationNumber) {
    sellerInfoErrors.value.businessRegistrationNumber = '사업자 등록번호를 입력하세요.'
    valid = false
  }
  return valid
}

const saveSellerInfo = async () => {
  if (!validateSellerInfo()) return
  savingSellerInfo.value = true
  try {
    await authAPI.updateSeller({
      bankCode: sellerInfoForm.value.bankCode,
      accountNumber: sellerInfoForm.value.accountNumber,
      accountHolder: sellerInfoForm.value.accountHolder,
      businessRegistrationNumber: sellerInfoForm.value.businessRegistrationNumber
    })
    await loadSellerAccountInfo()
    isEditingSellerInfo.value = false
    alert('판매자 정보가 수정되었습니다.')
  } catch (error) {
    console.error('판매자 정보 수정 실패:', error)
    alert(error.response?.data?.message || '판매자 정보 수정에 실패했습니다.')
  } finally {
    savingSellerInfo.value = false
  }
}

const ensureSellerSalesData = async () => {
  if (!isSeller.value) return
  await loadSellerAccountInfo()
  if (!sellerProductsLoaded.value) {
    await loadSellerProductsSummary()
  }
  if (!sellerGroupPurchasesLoaded.value) {
    await loadSellerGroupPurchasesSummary()
  }
  if (!sellerOrdersLoaded.value) {
    await loadSellerOrdersSummary()
  }
  if (!sellerBalanceLoaded.value) {
    await loadSellerBalance()
    await loadSellerBalanceHistory()
  }
}

// 메뉴 변경 시 데이터 로드
watch(activeMenu, (newMenu) => {
  if (newMenu === 'address' && addressList.value.length === 0) {
    loadAddresses()
  }

  if (newMenu === 'cancelled-orders' && cancelledOrders.value.length === 0) {
    loadCancelledOrders()
  }

  if (newMenu === 'notification-settings' && notificationSettings.value.length === 0) {
    loadNotificationSettings()
  }

  // ✅ 판매자 메뉴 진입 시 판매자 센터 데이터 로드
  if ((['seller-center', 'seller-sales', 'seller-orders', 'seller-settlement'].includes(newMenu)) && isSeller.value) {
    ensureSellerSalesData()
  }

  // ✅ 포인트 메뉴 진입 시 포인트 잔액/이력 로드
  if (newMenu === 'point') {
    fetchPointBalance()
    if (paidPointHistories.value.length === 0) {
      fetchPaidPointHistories()
    }
    if (bonusPointHistories.value.length === 0) {
      fetchBonusPointHistories()
    }
  }

  // ✅ 결제 내역 메뉴 진입 시 PG 결제 내역 로드
  if (newMenu === 'payments') {
    if (!pgPaymentsLoaded.value) {
      fetchPgPaymentHistories()
    }
  }
})

watch(
  () => route.query.tab,
  () => {
    syncActiveMenuFromRoute()
  }
)

const userInfo = ref({
  name: '',
  email: '',
  phoneNumber: '',
  joinDate: '',
  imageUrl: '',
  point: 0
})

// 포인트 충전
const chargeAmount = ref(10000)
const showPointChargeModal = ref(false)
const chargingPoint = ref(false)
const pointHistoryTab = ref('PAID') // 'PAID' 또는 'BONUS'
const paidPointHistories = ref([])
const bonusPointHistories = ref([])
const loadingPaidHistories = ref(false)
const loadingBonusHistories = ref(false)

// PG 결제 내역
const pgPaymentHistories = ref([])
const loadingPgPayments = ref(false)
const pgPaymentsLoaded = ref(false)

// 프로필 수정 모드
const isEditingProfile = ref(false)
const profileEditForm = ref({
  name: '',
  phoneNumber: ''
})
const savingProfile = ref(false)

// 계정 설정 - 비밀번호 변경
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changingPassword = ref(false)

// 계정 설정 - 회원 탈퇴
const showDeleteAccountModal = ref(false)
const deleteAccountForm = ref({
  password: ''
})
const deletingAccount = ref(false)

// 알림 설정
const notificationSettings = ref([])
const loadingNotificationSettings = ref(false)
const savingNotificationSettings = ref(false)

const formatPrice = (value) => {
  const numberValue = Number(value)
  if (isNaN(numberValue)) return '-'
  return numberValue.toLocaleString()
}

const fetchPointBalance = async () => {
  try {
    const pointResponse = await authAPI.getPoints()
    const pointData = pointResponse?.data || pointResponse
    if (pointData?.paidPoint !== undefined || pointData?.bonusPoint !== undefined) {
      const paidPoint = Number(pointData?.paidPoint ?? 0)
      const bonusPoint = Number(pointData?.bonusPoint ?? 0)
      userInfo.value.point = paidPoint + bonusPoint
    } else if (pointData?.pointBalance !== undefined) {
      userInfo.value.point = pointData.pointBalance || 0
    } else if (pointData?.point !== undefined) {
      userInfo.value.point = pointData.point || 0
    }
  } catch (pointError) {
    console.error('포인트 조회 실패:', pointError)
  }
}

const openChargeModal = () => {
  showPointChargeModal.value = true
}

const closeChargeModal = () => {
  showPointChargeModal.value = false
  chargeAmount.value = 10000
}

const requestPointCharge = async () => {
  if (chargeAmount.value < 10000 || chargeAmount.value % 10000 !== 0) {
    alert('충전 금액은 최소 10,000원이며 10,000원 단위로 입력해주세요.')
    return
  }

  chargingPoint.value = true
  try {
    const idempotencyKey = uuidv4()
    await api.post('/points/charge', {
      amount: chargeAmount.value,
      idempotencyKey
    })
    alert('포인트 충전이 완료되었습니다.')
    await fetchPointBalance()
    await fetchPaidPointHistories()
    await fetchBonusPointHistories()
    closeChargeModal()
  } catch (error) {
    console.error('포인트 충전 실패:', error)
    alert(error.response?.data?.message || '포인트 충전에 실패했습니다.')
  } finally {
    chargingPoint.value = false
  }
}

const showAddressModal = ref(false)
const showEditAddressModal = ref(false)
const loadingAddresses = ref(false)
const savingAddress = ref(false)
const editingAddress = ref(null)
const addressList = ref([])
const addressPageInfo = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 10
})

// 주문 상세
const showOrderDetailModal = ref(false)
const selectedOrder = ref(null)
const selectGroupPurchase = ref(null)
const selectProduct = ref(null)

// 결제 페이지로 이동
const goToPayment = (order) => {
  const orderId = order?.orderId || order?.id
  const amount = Number(order?.totalAmount ?? 0)
  const groupPurchaseName = order?.groupPurchaseName || '공동구매'
  router.push({
    name: 'order-payment',
    query: {
      orderId,
      amount: Number.isFinite(amount) ? amount : 0,
      groupPurchaseName
    }
  })
}

const viewOrderDetail = async (orderId) => {
  try {
    // 1️⃣ 주문 상세
    const orderResponse = await authAPI.getOrderDetail(orderId)
    const order = orderResponse?.data ?? orderResponse

    if (!order) {
      alert('주문 상세 정보를 불러올 수 없습니다.')
      return
    }

    // 2️⃣ 공동구매
    let groupPurchase = null
    if (order.groupPurchaseId) {
      const gpResponse =
        await groupPurchaseApi.getGroupPurchaseById(order.groupPurchaseId)

      // ⭐⭐⭐ 여기 중요
      groupPurchase = gpResponse?.data?.data ?? gpResponse?.data ?? null
    }

    // 3 상품
    let product = null
        if (groupPurchase.productId) {
          const pResponse =
            await productApi.getProductById(groupPurchase.productId)

          // ⭐⭐⭐ 여기 중요
          product = pResponse?.data?.data ?? pResponse?.data ?? null
        }

    selectedOrder.value = order
    selectGroupPurchase.value = groupPurchase
    selectProduct.value = product
    showOrderDetailModal.value = true
  } catch (e) {
    console.error('주문 상세 조회 실패', e)
    alert('주문 상세 조회에 실패했습니다.')
  }
}

const goGroupPurchaseDetail = (groupPurchaseId) => {
  if (!groupPurchaseId) return

  router.push({
    name: 'group-purchase-detail',
    params: { id: groupPurchaseId }
  })
}

const addressForm = ref({
  receiverName: '',
  phoneNumber: '',
  postalCode: '',
  address: '',
  addressDetail: ''
})

const addressFormData = ref({
  postalCode: '',
  address: '',
  addressDetail: ''
})

// const userStats = ref({
//   purchasedProducts: 23,
//   reviews: 15,
//   groupPurchases: 18
// })

const orderHistory = ref([])
const loadingOrders = ref(false)

const userRole = ref(null)

const isSeller = computed(() => {
  // localStorage와 API에서 가져온 role 모두 확인
  const localRole = localStorage.getItem('user_role')
  const role = userRole.value || localRole

  // 대소문자 구분 없이 비교 (SELLER, seller, ROLE_SELLER 등 모두 처리)
  if (!role) return false

  const roleUpper = role.toUpperCase()
  return roleUpper === 'SELLER' || roleUpper === 'ROLE_SELLER' || roleUpper.includes('SELLER')
})

// 주문 내역 (취소 제외)
const activeOrders = computed(() => {
  return orderHistory.value.filter(order => {
    const status = order.status?.toUpperCase()
    return status !== 'CANCELLED' && status !== 'REFUNDED'
  })
})

// 취소된 주문 내역
// 취소 주문 목록
const cancelledOrders = ref([])
const cancelledOrdersPageInfo = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 20
})
const loadingCancelledOrders = ref(false)

// 취소 주문 목록 로드
const loadCancelledOrders = async (page = 0) => {
  loadingCancelledOrders.value = true
  try {
    const response = await authAPI.getCanceledOrders({
      page,
      size: 20,
      sort: 'createdAt,desc'
    })

    if (response && response.content) {
      cancelledOrders.value = response.content
      cancelledOrdersPageInfo.value = {
        currentPage: response.number || page,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0,
        size: response.size || 20
      }
    }
  } catch (error) {
    console.error('취소 주문 목록 로드 실패:', error)
    alert('취소 주문 목록을 불러오는데 실패했습니다.')
  } finally {
    loadingCancelledOrders.value = false
  }
}

const openSellerMenu = (menu) => {
  activeMenu.value = menu
}

const goToSellerSettlement = () => {
  router.push('/seller/settlement')
}

const goToSellerProducts = () => {
  router.push('/seller/products')
}

const goToProductRegister = () => {
  router.push('/seller/register/product-register')
}

const goToGroupPurchaseCreate = () => {
  router.push('/group-purchases/create')
}

const goToGroupPurchaseManage = () => {
  router.push('/group-purchases')
}

const goToSellerApplication = () => {
  router.push('/seller/application')
}

// 주소 목록 불러오기
const loadAddresses = async (page = 0) => {
  loadingAddresses.value = true
  try {
    const response = await authAPI.getAddresses(page, 10)
    console.log('주소 목록:', response)

    if (response.data && Array.isArray(response.data.content)) {
      addressList.value = response.data.content
      addressPageInfo.value = {
        currentPage: response.data.number || page,
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
        size: response.data.size || 10
      }
    } else if (Array.isArray(response.data)) {
      // 배열로 직접 반환되는 경우
      addressList.value = response.data
      addressPageInfo.value = {
        currentPage: 0,
        totalPages: 1,
        totalElements: response.data.length,
        size: 10
      }
    }
  } catch (error) {
    console.error('주소 목록 조회 실패:', error)
    alert('주소 목록을 불러오는데 실패했습니다.')
  } finally {
    loadingAddresses.value = false
  }
}

// 주소 삭제
const deletingAddressId = ref()

const deleteAddress = async (addressId) => {
  if (!confirm('해당 주소를 삭제하시겠습니까?')) return

  try {
    deletingAddressId.value = addressId
    await authAPI.deleteAddress(addressId)

    // 현재 페이지 다시 로드
    await loadAddresses()
  } catch (e) {
    console.error('주소 삭제 실패', e)
    alert('주소 삭제에 실패했습니다.')
  } finally {
    deletingAddressId.value = null
  }
}

// 주소 모달 닫기
const closeAddressModal = () => {
  showAddressModal.value = false
}

// 주소 수정 모달 열기
// const editAddress = (address) => {
//   editingAddress.value = address
//   addressForm.value = {
//     receiverName: address.receiverName || '',
//     phoneNumber: address.phoneNumber || '',
//     postalCode: address.postalCode || '',
//     address: address.address || '',
//     addressDetail: address.addressDetail || ''
//   }
//   addressFormData.value = {
//     postalCode: address.postalCode || '',
//     address: address.address || '',
//     addressDetail: address.addressDetail || ''
//   }
//   showEditAddressModal.value = true
// }

// 새 주소 추가
const addNewAddress = () => {
  editingAddress.value = null
  addressForm.value = {
    receiverName: '',
    phoneNumber: '',
    postalCode: '',
    address: '',
    addressDetail: ''
  }
  addressFormData.value = {
    postalCode: '',
    address: '',
    addressDetail: ''
  }
  showEditAddressModal.value = true
}

// 주소 수정 모달 닫기
const closeEditAddressModal = () => {
  showEditAddressModal.value = false
  editingAddress.value = null
  addressForm.value = {
    receiverName: '',
    phoneNumber: '',
    postalCode: '',
    address: '',
    addressDetail: ''
  }
  addressFormData.value = {
    postalCode: '',
    address: '',
    addressDetail: ''
  }
}

// AddressSearch 컴포넌트에서 주소 업데이트
const handleAddressUpdate = (addressData) => {
  addressForm.value.postalCode = addressData.postalCode || ''
  addressForm.value.address = addressData.address || ''
  addressForm.value.addressDetail = addressData.addressDetail || ''
}

// 주소 저장
const saveAddress = async () => {
  if (!addressForm.value.receiverName || !addressForm.value.phoneNumber || !addressForm.value.address) {
    alert('필수 항목을 입력해주세요.')
    return
  }

  savingAddress.value = true
  try {
    if (editingAddress.value) {
      // 주소 수정
      await authAPI.updateAddress(editingAddress.value.addressId, {
        receiverName: addressForm.value.receiverName,
        phoneNumber: addressForm.value.phoneNumber,
        postalCode: addressForm.value.postalCode,
        address: addressForm.value.address,
        addressDetail: addressForm.value.addressDetail
      })
      alert('주소가 수정되었습니다.')
    } else {
      // 주소 추가
      await authAPI.addAddress({
        receiverName: addressForm.value.receiverName,
        phoneNumber: addressForm.value.phoneNumber,
        postalCode: addressForm.value.postalCode,
        address: addressForm.value.address,
        addressDetail: addressForm.value.addressDetail
      })
      alert('주소가 추가되었습니다.')
    }

    closeEditAddressModal()
    loadAddresses(addressPageInfo.value.currentPage)
  } catch (error) {
    console.error('주소 저장 실패:', error)
    alert(error.response?.data?.message || '주소 저장에 실패했습니다.')
  } finally {
    savingAddress.value = false
  }
}

// 우편번호 검색 (AddressSearch 컴포넌트에서 처리됨)
// const searchPostalCode = () => {
//   // AddressSearch 컴포넌트의 openAddressSearch가 자동으로 호출됨
// }

// 주문 ID 포맷팅 함수 (UUID를 읽기 쉬운 형식으로 변환)
// const formatOrderId = (orderId) => {
//   if (!orderId) return '-'

//   // 이미 포맷된 형식인지 확인 (ORD-로 시작하는 경우)
//   if (typeof orderId === 'string' && orderId.startsWith('ORD-')) {
//     return orderId
//   }

//   // UUID인 경우 변환: ORD-년도-UUID마지막8자리
//   if (typeof orderId === 'string' && orderId.includes('-')) {
//     const currentYear = new Date().getFullYear()
//     // UUID의 마지막 8자리 사용 (하이픈 제거 후)
//     const uuidPart = orderId.replace(/-/g, '').slice(-8).toUpperCase()
//     return `ORD-${currentYear}-${uuidPart}`
//   }

//   // 그 외의 경우 그대로 반환
//   return orderId
// }

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const formatDateShort = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const getTimeRemaining = (endDate) => {
  if (!endDate) return '기간 미정'
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return '종료됨'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) return `${days}일 ${hours}시간 남음`
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`
  return `${minutes}분 남음`
}

const normalizeHistories = (response) => {
  const data = response?.data?.data || response?.data || response
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data)) return data
  return []
}

const mapHistoryItem = (item, index) => {
  const status = (item.status || '').toString().toUpperCase()
  const paidPoint = Number(item.paidPoint ?? 0)
  const bonusPoint = Number(item.bonusPoint ?? 0)
  const rawAmount = Number(item.amount ?? item.point ?? (paidPoint + bonusPoint))

  const statusConfigMap = {
    CHARGED: { text: '충전', type: 'credit' },
    BONUS_EARNED: { text: '보너스', type: 'credit' },
    RETURNED: { text: '환불', type: 'credit' },
    USED: { text: '사용', type: 'debit' },
    TRANSFERRED: { text: '출금', type: 'debit' }
  }

  const statusConfig = statusConfigMap[status]
  const type = statusConfig?.type || (rawAmount >= 0 ? 'credit' : 'debit')

  // ✅ amount 계산: paid+bonus 우선, 없으면 rawAmount
  const amount = Math.abs((paidPoint + bonusPoint) || rawAmount || 0)

  return {
    id:
      item.id ||
      item.historyId ||
      item.pointHistoryId ||
      item.transactionId ||
      `${item.createdAt || 'history'}-${index}`,
    date: formatDate(item.createdAt || item.date || item.updatedAt),
    amount,
    type,
    statusText: statusConfig?.text || (type === 'credit' ? '충전' : '차감')
  }
}

const fetchPaidPointHistories = async () => {
  loadingPaidHistories.value = true
  try {
    console.log('[PAID] API 호출 파라미터:', { type: 'PAID' })
    const response = await pointApi.getPointHistories({
      page: 0,
      size: 20,
      sort: 'createdAt,desc',
      type: 'PAID'
    })
    console.log('[PAID] 백엔드 응답:', response)

    const list = normalizeHistories(response)
    console.log('[PAID] 정규화된 리스트:', list)
    paidPointHistories.value = list.map(mapHistoryItem)
    console.log('[PAID] 최종 데이터 개수:', paidPointHistories.value.length)
  } catch (error) {
    console.error('PAID 포인트 이력 조회 실패:', error)
    paidPointHistories.value = []
  } finally {
    loadingPaidHistories.value = false
  }
}

const fetchBonusPointHistories = async () => {
  loadingBonusHistories.value = true
  try {
    console.log('[BONUS] API 호출 파라미터:', { type: 'BONUS' })
    const response = await pointApi.getPointHistories({
      page: 0,
      size: 20,
      sort: 'createdAt,desc',
      type: 'BONUS'
    })
    console.log('[BONUS] 백엔드 응답:', response)

    const list = normalizeHistories(response)
    console.log('[BONUS] 정규화된 리스트:', list)
    bonusPointHistories.value = list.map(mapHistoryItem)
    console.log('[BONUS] 최종 데이터 개수:', bonusPointHistories.value.length)
  } catch (error) {
    console.error('BONUS 포인트 이력 조회 실패:', error)
    bonusPointHistories.value = []
  } finally {
    loadingBonusHistories.value = false
  }
}

// PG 결제 내역 조회
const fetchPgPaymentHistories = async () => {
  if (loadingPgPayments.value) return
  loadingPgPayments.value = true
  try {
    const response = await authAPI.getPaymentHistories({
      page: 0,
      size: 10,
      sort: 'createdAt,desc'
    })
    const raw = response?.data || response
    const list = raw?.content || raw || []
    pgPaymentHistories.value = list.map(payment => ({
      id: payment.paymentPointId,
      orderId: payment.orderId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      createdAt: payment.createdAt,
      requestedAt: payment.requestedAt
    }))
  } catch (error) {
    console.error('PG 결제 내역 조회 실패:', error)
    pgPaymentHistories.value = []
  } finally {
    loadingPgPayments.value = false
    pgPaymentsLoaded.value = true
  }
}

// 주문 상태 텍스트 변환
const getStatusText = (status) => {
  if (!status) return '알 수 없음'

  const statusMap = {
    'PENDING': '결제 대기',
    'PAYMENT_COMPLETED': '결제 완료',
    'PAYMENT_FAILED': '결제 실패',
    'ORDER_FAILED': '주문 실패',
    'GROUP_PURCHASE_SUCCESS': '공동구매 성공',
    'GROUP_PURCHASE_FAIL': '공동구매 실패',
    'CANCEL_REQUESTED': '취소 요청',
    'CANCELLED': '취소 완료',
    'REVERSE_REQUESTED': '번복 요청',
    'REVERSED': '번복 완료',
    'REFUND_REQUESTED': '반품 요청',
    'REFUNDED': '반품 완료',
    'PURCHASE_CONFIRMED': '구매 확정',
    'pending': '결제 대기',
    'payment_completed': '결제 완료',
    'payment_failed': '결제 실패',
    'order_failed': '주문 실패',
    'group_purchase_success': '공동구매 성공',
    'group_purchase_fail': '공동구매 실패',
    'cancel_requested': '취소 요청',
    'cancelled': '취소 완료',
    'reverse_requested': '번복 요청',
    'reversed': '번복 완료',
    'refund_requested': '반품 요청',
    'refunded': '반품 완료',
    'purchase_confirmed': '구매 확정'
  }

  return statusMap[status] || status
}

// const requestRefund = (orderId) => {
//   if (confirm('환불을 신청하시겠습니까?')) {
//     alert('환불 신청이 접수되었습니다.')
//     // TODO: 환불 신청 API 호출
//   }
// }

onMounted(async () => {
  syncActiveMenuFromRoute()
  // 저장된 사용자 정보 불러오기
  const savedUserData = localStorage.getItem('user_data')
  if (savedUserData) {
    try {
      const userData = JSON.parse(savedUserData)
      userInfo.value.name = userData.name || userInfo.value.name
      userInfo.value.email = userData.email || userInfo.value.email
      userInfo.value.phone = userData.phone || userInfo.value.phone
      if (userData.createdAt) {
        userInfo.value.joinDate = new Date(userData.createdAt).toLocaleDateString('ko-KR')
      }
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }

  const savedEmail = localStorage.getItem('user_email')
  if (savedEmail) {
    userInfo.value.email = savedEmail
  }

  // 프로필 API에서 정보 가져오기
  try {
    const profileResponse = await authAPI.getProfile()
    console.log('프로필 정보:', profileResponse)

    const profileData = profileResponse.data || profileResponse

    if (profileData) {
      // role 정보 업데이트 (판매자 여부 확인용)
      if (profileData.role) {
        userRole.value = profileData.role
        localStorage.setItem('user_role', profileData.role)
      }

      // 사용자 정보 업데이트 (role, memberId 제외)
      if (profileData.email) {
        userInfo.value.email = profileData.email
        localStorage.setItem('user_email', profileData.email)
      }
      if (profileData.name) {
        userInfo.value.name = profileData.name
      }
      if (profileData.phoneNumber) {
        userInfo.value.phoneNumber = profileData.phoneNumber
      }
      if (profileData.imageUrl) {
        userInfo.value.imageUrl = profileData.imageUrl
      }
      if (profileData.createdAt) {
        userInfo.value.joinDate = new Date(profileData.createdAt).toLocaleDateString('ko-KR')
      }
      if (profileData.point !== undefined) {
        userInfo.value.point = profileData.point || 0
      }

      // memberId는 localStorage에만 저장 (화면에는 표시 안 함)
      if (profileData.memberId) {
        localStorage.setItem('member_id', profileData.memberId)
      }

      // 포인트 잔액 별도 조회
      await fetchPointBalance()
    }
  } catch (error) {
    console.error('프로필 조회 실패:', error)
    // 프로필 조회 실패해도 localStorage의 정보 사용
    const savedEmail = localStorage.getItem('user_email')
    if (savedEmail) {
      userInfo.value.email = savedEmail
    }
  }

  // 주문 내역 가져오기
  await loadOrders(0)
})

const orderPageInfo = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 5
})

// 주문 내역 불러오기
const loadOrders = async (page = 0) => {
  loadingOrders.value = true
  try {
    const pageData = await authAPI.getOrders({
      page,
      size: orderPageInfo.value.size
    })

    orderHistory.value = pageData.content

    orderPageInfo.value = {
      currentPage: page,
      totalPages: pageData.totalPages,
      totalElements: pageData.totalElements,
      size: pageData.size
    }
  } catch (e) {
    console.error('주문 내역 조회 실패', e)
    orderHistory.value = []
  } finally {
    loadingOrders.value = false
  }
}

const closeOrderDetailModal = () => {
  showOrderDetailModal.value = false
}

// 주문 취소 가능 여부 확인 (결제 완료 또는 공동구매 성공 상태만 가능)
const canCancelOrder = (order) => {
  if (!order || !order.status) return false

  const cancelableStatuses = ['PAYMENT_COMPLETED', 'GROUP_PURCHASE_SUCCESS']
  return cancelableStatuses.includes(order.status.toUpperCase())
}

// 주문 확정 가능 여부 확인 (공동구매 성공하고 2일 후부터)
const canConfirmPurchase = (order) => {
  if (!order || !order.status) return false

  // 이미 확정된 경우 불가
  if (order.status.toUpperCase() === 'CONFIRMED' || order.status.toUpperCase() === 'COMPLETED') {
    return false
  }

  // 주문이 성공 상태이고, createdAt으로부터 2일이 지난 경우
  if (order.status.toUpperCase() === 'SUCCESS' && order.createdAt) {
    const orderDate = new Date(order.createdAt)
    const twoDaysLater = new Date(orderDate.getTime() + (2 * 24 * 60 * 60 * 1000))
    const now = new Date()
    return now >= twoDaysLater
  }

  return false
}

// 주문 취소 처리
const handleCancelOrder = async (orderId) => {
  const cancelReason = prompt('주문을 취소하시겠습니까? 취소 사유를 입력해주세요:')

  if (!cancelReason) {
    return
  }

  try {
    await authAPI.cancelOrder(orderId, cancelReason)
    alert('주문이 취소되었습니다.')

    // 주문 목록 새로고침
    await loadOrders(orderPageInfo.value.currentPage)
  } catch (error) {
    console.error('주문 취소 실패:', error)
    alert(error.response?.data?.message || '주문 취소에 실패했습니다.')
  }
}

// 주문 확정 처리
const handleConfirmPurchase = async (orderId) => {
  if (!confirm('주문을 확정하시겠습니까? 확정 후에는 취소할 수 없습니다.')) {
    return
  }

  try {
    await authAPI.confirmPurchase(orderId)
    alert('구매가 확정되었습니다.')

    // 주문 목록 새로고침
    await loadOrders(orderPageInfo.value.currentPage)
  } catch (error) {
    console.error('주문 확정 실패:', error)
    alert(error.response?.data?.message || '주문 확정에 실패했습니다.')
  }
}

// 프로필 수정 모드 진입
const startEditProfile = () => {
  profileEditForm.value.name = userInfo.value.name || ''
  profileEditForm.value.phoneNumber = userInfo.value.phoneNumber || ''
  isEditingProfile.value = true
}

// 프로필 수정 취소
const cancelEditProfile = () => {
  isEditingProfile.value = false
  profileEditForm.value.name = ''
  profileEditForm.value.phoneNumber = ''
}

// 프로필 저장
const saveProfile = async () => {
  // 입력 검증
  if (!profileEditForm.value.name || profileEditForm.value.name.length < 2 || profileEditForm.value.name.length > 50) {
    alert('이름은 2~50자 사이여야 합니다.')
    return
  }

  const namePattern = /^[가-힣a-zA-Z0-9\s]+$/
  if (!namePattern.test(profileEditForm.value.name)) {
    alert('이름은 한글, 영문, 숫자만 입력 가능합니다.')
    return
  }

  const phonePattern = /^[0-9-]{9,15}$/
  if (profileEditForm.value.phoneNumber && !phonePattern.test(profileEditForm.value.phoneNumber)) {
    alert('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)')
    return
  }

  savingProfile.value = true
  try {
    await authAPI.updateProfile(
      profileEditForm.value.name,
      profileEditForm.value.phoneNumber
    )

    alert('프로필 정보가 변경되었습니다.')

    // 사용자 정보 업데이트
    userInfo.value.name = profileEditForm.value.name
    userInfo.value.phoneNumber = profileEditForm.value.phoneNumber

    // 수정 모드 종료
    isEditingProfile.value = false
  } catch (error) {
    console.error('프로필 수정 실패:', error)
    alert(error.response?.data?.message || '프로필 수정에 실패했습니다.')
  } finally {
    savingProfile.value = false
  }
}

// 비밀번호 변경
const handleChangePassword = async () => {
  // 입력 검증
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  // 새 비밀번호 확인
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.')
    return
  }

  // 비밀번호 유효성 검사 (8자리 이상, 영어+숫자+특수문자)
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>?,./]).{8,}$/
  if (!passwordPattern.test(passwordForm.value.newPassword)) {
    alert('비밀번호는 8자리 이상이며 영어, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.')
    return
  }

  changingPassword.value = true
  try {
    await authAPI.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    alert('비밀번호가 변경되었습니다.')

    // 폼 초기화
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('비밀번호 변경 실패:', error)
    alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.')
  } finally {
    changingPassword.value = false
  }
}

// 회원 탈퇴
const handleDeleteAccount = async () => {
  if (!deleteAccountForm.value.password) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  deletingAccount.value = true
  try {
    await authAPI.deleteAccount(deleteAccountForm.value.password)

    alert('회원 탈퇴가 완료되었습니다.')

    // 로그아웃 처리
    localStorage.clear()
    router.push('/')
  } catch (error) {
    console.error('회원 탈퇴 실패:', error)
    alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.')
  } finally {
    deletingAccount.value = false
    showDeleteAccountModal.value = false
  }
}

// 알림 설정 로드
const loadNotificationSettings = async () => {
  loadingNotificationSettings.value = true
  try {
    const response = await notificationSettingApi.getSettings()

    if (response.data && response.data.data) {
      notificationSettings.value = response.data.data.map(setting => {
        // 앱 내 알림은 무조건 true로 고정
        if (setting.channel === 'IN_APP') {
          return { ...setting, isEnabled: true }
        }
        return setting
      })
    }
  } catch (error) {
    console.error('알림 설정 로드 실패:', error)
    alert('알림 설정을 불러오는데 실패했습니다.')
  } finally {
    loadingNotificationSettings.value = false
  }
}

// 알림 채널별 아이콘
const getNotificationIcon = (channel) => {
  const icons = {
    'EMAIL': '📧',
    'IN_APP': '🔔'
  }
  return icons[channel] || '🔔'
}

// 알림 채널별 제목
const getNotificationTitle = (channel) => {
  const titles = {
    'EMAIL': '이메일 알림',
    'IN_APP': '앱 내 알림'
  }
  return titles[channel] || channel
}

// 알림 채널별 설명
const getNotificationDescription = (channel) => {
  const descriptions = {
    'EMAIL': '주문 상태 변경, 공동구매 진행 상황 등을 이메일로 받습니다',
    'IN_APP': '실시간으로 앱 내에서 알림을 받습니다'
  }
  return descriptions[channel] || ''
}

// 알림 토글 변경 (실시간 반영 아님, 저장 버튼 눌러야 함)
const handleNotificationToggle = (setting) => {
  // 단순히 상태만 변경, 실제 저장은 saveNotificationSettings에서
  console.log('알림 설정 변경:', setting.channel, setting.isEnabled)
}

// 알림 설정 저장
const saveNotificationSettings = async () => {
  savingNotificationSettings.value = true
  try {
    const settings = notificationSettings.value.map(setting => ({
      channel: setting.channel,
      // 앱 내 알림은 무조건 true로 강제
      isEnabled: setting.channel === 'IN_APP' ? true : setting.isEnabled
    }))

    await notificationSettingApi.updateSettings(settings)
    alert('알림 설정이 저장되었습니다.')
  } catch (error) {
    console.error('알림 설정 저장 실패:', error)
    alert(error.response?.data?.message || '알림 설정 저장에 실패했습니다.')
  } finally {
    savingNotificationSettings.value = false
  }
}

</script>

<style scoped>
/* 주소 삭제 버튼 */
.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;

  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.6);

  color: #ffffff;
  font-size: 16px;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  flex-shrink: 0;
}

/* hover 효과 */
.delete-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

/* 비활성화 상태 */
.delete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page {
  background: #0a0a0a;
  color: #ffffff;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 32px;
}

.container h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

/* 마이페이지 레이아웃 */
.mypage-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  min-height: 600px;
}

/* 사이드바 */
.sidebar {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 32px;
}

.user-welcome {
  padding-bottom: 20px;
  border-bottom: 1px solid #2a2a2a;
  margin-bottom: 20px;
}

.user-welcome h3 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.user-welcome p {
  font-size: 14px;
  color: #999;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: #2a2a2a;
  color: #ffffff;
}

.nav-item.active {
  background: #ffffff;
  color: #0a0a0a;
  font-weight: 600;
}

.nav-item.seller-application {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-weight: 600;
}

.nav-item.seller-application:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.nav-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

/* 컨텐츠 영역 */
.content-area {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 32px;
  min-height: 600px;
}

.content-section {
  animation: fadeIn 0.3s ease-in;
}

/* 판매자 센터 */
.seller-center-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.seller-sales-section .seller-sales-hero {
  background: #151515;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.seller-sales-hero h3 {
  margin: 0 0 6px 0;
  font-size: 22px;
  color: #ffffff;
}

.seller-sales-hero p {
  margin: 0;
  color: #c2c2c2;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.sales-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.sales-stat-card {
  background: #151515;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px;
}

.stat-label {
  margin: 0 0 8px 0;
  color: #8e8e8e;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
}

.stat-subtext {
  margin: 6px 0 0 0;
  color: #a8a8a8;
  font-size: 13px;
}

.seller-sales-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.seller-sales-grid.top-stats {
  margin-bottom: 24px;
}

.seller-card.order-card.compact {
  max-width: 420px;
}

.seller-edit-form form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.seller-edit-form .form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.seller-edit-form .form-group {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.seller-edit-form label {
  font-size: 13px;
  color: #c0c0c0;
}

.seller-edit-form input,
.seller-edit-form select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  background: #0f0f0f;
  color: #ffffff;
}

.seller-edit-form .form-error {
  color: #ff6b6b;
  font-size: 12px;
}

.seller-edit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.mini-loading {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  color: #bdbdbd;
  font-size: 14px;
}

.seller-mini-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-empty {
  text-align: center;
  padding: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #c0c0c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.seller-mini-hero {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.hero-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-title {
  margin: 0;
  font-size: 18px;
  color: #ffffff;
  font-weight: 700;
}

.hero-sub {
  font-size: 13px;
  color: #a0a0a0;
}

.hero-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.hero-price {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.hero-progress,
.hero-updated {
  font-size: 13px;
  color: #cfcfcf;
}

.seller-mini-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.seller-mini-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.seller-mini-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.mini-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-title {
  margin: 0;
  color: #ffffff;
  font-weight: 600;
}

.mini-sub {
  font-size: 13px;
  color: #a0a0a0;
}

.mini-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 13px;
  color: #cfcfcf;
}

.mini-price {
  font-weight: 700;
  color: #ffffff;
}

.mini-progress {
  font-size: 12px;
  color: #a0a0a0;
}

.mini-extra {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #9dbbff;
}

.seller-card {
  background: #111111;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.order-summary-card {
  grid-column: 1 / -1;
}

.order-summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.order-summary-item:last-child {
  border-bottom: none;
}

.order-summary-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  margin: 0;
  color: #ffffff;
  font-weight: 600;
}

.order-date {
  margin: 0;
  color: #a0a0a0;
  font-size: 12px;
}

.order-summary-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.order-amount {
  color: #ffffff;
  font-weight: 700;
}

.order-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
}

.seller-orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.seller-order-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.seller-order-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.seller-order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.seller-order-dates {
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.seller-order-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.seller-order-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.seller-order-title {
  margin: 0;
  font-size: 20px;
  color: #ffffff;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.seller-order-sub {
  margin: 0;
  color: #888;
  font-size: 13px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  display: inline-block;
  width: fit-content;
  font-weight: 500;
}

.seller-order-price {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-top: 12px;
}

.seller-order-price .current-price {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.seller-order-price .original-price {
  font-size: 16px;
  color: #666666;
  text-decoration: line-through;
}

.seller-order-progress {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #a0a0a0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.seller-order-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.seller-order-actions .btn {
  flex: 1;
  font-weight: 600;
  transition: all 0.2s ease;
}

.seller-order-actions .btn:hover {
  transform: translateY(-1px);
}

.status-badge {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-badge.open {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(102, 187, 106, 0.2) 100%);
  color: #66BB6A;
  border-color: rgba(102, 187, 106, 0.3);
}

.status-badge.closed {
  background: linear-gradient(135deg, rgba(158, 158, 158, 0.2) 0%, rgba(117, 117, 117, 0.2) 100%);
  color: #999;
  border-color: rgba(158, 158, 158, 0.3);
}

.status-badge.pending {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 179, 0, 0.2) 100%);
  color: #FFC107;
  border-color: rgba(255, 193, 7, 0.3);
}

.order-dropdown {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.order-dropdown-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.order-dropdown-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.order-dropdown-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-buyer {
  margin: 0;
  color: #c0c0c0;
  font-size: 13px;
}

.order-detail {
  margin: 0;
  color: #999;
  font-size: 12px;
  font-weight: 500;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.card-header.align-start {
  align-items: flex-start;
}

.card-subtitle {
  font-size: 13px;
  color: #8a8a8a;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  color: #ffffff;
}

.link-button {
  background: none;
  border: none;
  color: #9dbbff;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 8px;
}

.info-row dt {
  color: #888;
  font-weight: 500;
}

.info-row dd {
  margin: 0;
  color: #fff;
  font-weight: 600;
}

.empty-state,
.empty-state-lg {
  background: #0a0a0a;
  border: 1px dashed #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #aaaaaa;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state-lg {
  min-height: 180px;
  justify-content: center;
}

.card-description {
  margin: 8px 0 0 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  color: #c5c5c5;
  font-size: 14px;
  line-height: 1.4;
  border: 1px dashed rgba(255, 255, 255, 0.08);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inquiry-list,
.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inquiry-list li {
  background: #0f0f0f;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.question {
  font-weight: 600;
  margin: 0 0 6px 0;
}

.answer {
  color: #bbbbbb;
  margin: 0 0 8px 0;
}

.status {
  font-size: 12px;
  color: #4caf50;
  font-weight: 700;
}

.notice-item {
  background: #0f0f0f;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  color: #a0a0a0;
}

.badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: uppercase;
}

.notice-title {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #2a2a2a;
}

/* 포인트 섹션 */
.point-balance {
  text-align: center;
  padding: 40px 20px;
}

.point-balance h3 {
  font-size: 18px;
  font-weight: 600;
  color: #999;
  margin: 0 0 16px 0;
}

.balance-amount {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 32px 0;
}

.points-info {
  font-size: 14px;
  color: #999;
  margin: 0 0 24px 0;
}

.point-history-tabs {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #2a2a2a;
}

.point-history-tabs .tab-btn {
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #999;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.point-history-tabs .tab-btn:hover {
  background: #1a1a1a;
  border-color: #3a3a3a;
}

.point-history-tabs .tab-btn.active {
  background: #ffffff;
  color: #0a0a0a;
  border-color: #ffffff;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 포인트 빈 상태 스타일 */
.point-empty-state {
  padding: 60px 24px;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin: 16px 0;
}

.point-empty-state .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.point-empty-state .empty-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #e0e0e0;
}

.point-empty-state .empty-description {
  margin: 0;
  font-size: 14px;
  color: #999;
  line-height: 1.5;
}

/* 정산 현황 스타일 */
.settlement-balance {
  padding: 24px;
  text-align: center;
}

.balance-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.balance-label {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.balance-amount {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
}

.settlement-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
}

.settlement-history-item .history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settlement-history-item .history-status {
  font-size: 12px;
  color: #999;
}

/* PG 결제 내역 스타일 */
.payment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  transition: all 0.2s;
}

.payment-item:hover {
  border-color: #3a3a3a;
  background: #1a1a1a;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment-date {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.payment-method {
  font-size: 13px;
  color: #999;
}

.payment-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.payment-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.payment-status.done {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.payment-status.in_progress {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.payment-status.canceled,
.payment-status.failed {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.history-date {
  font-size: 12px;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.history-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.history-amount.credit {
  color: #4ade80;
}

.history-amount.debit {
  color: #f87171;
}

.history-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.history-status.credit {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.history-status.debit {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

/* 포인트 충전 모달 */
.point-charge-modal {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  overflow: hidden;
}

.point-charge-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2a2a2a;
}

.point-charge-modal .modal-body {
  padding: 24px;
}

.point-charge-modal .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.point-charge-modal .form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.point-charge-modal input {
  width: 100%;
  background: #0f0f0f;
  color: #ffffff;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px;
  font-size: 15px;
}

.point-charge-modal input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.input-hint {
  font-size: 12px;
  color: #777;
  margin: 0;
}

.point-charge-modal .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid #2a2a2a;
}

/* 주소 관리 섹션 */
.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.address-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
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

.panel + .panel {
  margin-top: 40px;
}

.panel h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2a2a2a;
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

.btn-large {
  height: 56px;
  font-size: 16px;
}

.btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  background: #f0f0f0;
}

.btn-danger {
  background: #ff4757;
  color: #ffffff;
  border: 1px solid #ff4757;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
  background: #ff3838;
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

.info-value.readonly {
  color: #999;
}

.point-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.point-value {
  font-weight: 700;
  color: #ffffff;
}

.btn-point-charge {
  padding: 8px 16px;
  background: #ffffff;
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-point-charge:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.image-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2a2a2a;
}


.order-detail-modal {
  position: relative;
  z-index: 1001;
}
.close-btn {
  position: relative;
  z-index: 1002;
  pointer-events: auto;
}
.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.8);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;           /* ⭐ 핵심 */
  pointer-events: all;    /* ⭐ 핵심 */
}


.no-image {
  color: #999;
  font-size: 13px;
}

.btn-address-manage {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #4a4a4a;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-address-manage:hover {
  background: #2a2a2a;
  border-color: #666;
}

/* 프로필 수정 폼 */
.profile-edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-edit-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-edit-form .form-group label {
  font-weight: 600;
  color: #e0e0e0;
  font-size: 14px;
}

.profile-edit-form .form-group input {
  padding: 12px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
  font-family: inherit;
}

.profile-edit-form .form-group input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.profile-edit-form .info-row {
  padding: 12px 0;
  border-bottom: 1px solid #2a2a2a;
}

.profile-edit-form .form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #2a2a2a;
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

.loading-orders,
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

.order-gp-name {
  color: #f8fafc;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(56, 189, 248, 0.14));
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.label-bold {
  font-size: 15px;
  font-weight: 700;
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

.order-status.payment_completed {
  background: #2a2a2a;
  color: #74c0fc;
}

.order-status.shipping {
  background: #2a2a2a;
  color: #74c0fc;
}

.order-status.pending {
  background: #2a2a2a;
  color: #ffd43b;
}

.order-status.in_progress {
  background: rgba(116, 192, 252, 0.2);
  color: #74c0fc;
  border: 1px solid #74c0fc;
}

.order-status.success {
  background: rgba(81, 207, 102, 0.2);
  color: #51cf66;
  border: 1px solid #51cf66;
}

.order-status.failed {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  border: 1px solid #ff4757;
}

.order-status.cancelled,
.order-status.refunded {
  background: rgba(150, 150, 150, 0.2);
  color: #999;
  border: 1px solid #666;
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

.order-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  background: #0f0f0f;
  border-radius: 8px;
}

.order-summary-left {
  width: 100%;
  text-align: left;
}

.order-summary-right {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.order-quantity,
.order-price {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  text-align: right;
}

.cancel-reason {
  margin: 8px 0 0 0;
  color: #ff9999;
  font-size: 13px;
  text-align: right;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
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

@media (max-width: 1024px) {
  .mypage-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    top: 0;
  }
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

  .balance-amount {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: 20px;
  }

  .container {
    padding: 0 16px;
  }

  .mypage-layout {
    gap: 20px;
  }

  .content-area {
    padding: 20px;
  }

  .sidebar {
    padding: 20px;
  }

  .section-title {
    font-size: 20px;
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

/* 주소 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.address-modal,
.address-edit-modal {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 32px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2a2a2a;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #2a2a2a;
}

.address-list-container {
  min-height: 200px;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state p {
  margin: 0 0 16px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-item {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s;
}

.address-item:hover {
  border-color: #3a3a3a;
  background: #151515;
}

.address-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.address-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-text {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.receiver-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
}

.phone-number {
  color: #999;
  font-size: 14px;
}

.address-full {
  color: #cccccc;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.postal-code {
  color: #999;
  font-weight: 500;
}

.add-address-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #2a2a2a;
  display: flex;
  justify-content: center;
}

.add-address-section .btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.add-address-section .btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}

.add-address-section .btn-primary:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #2a2a2a;
}

.page-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #4a4a4a;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #2a2a2a;
  border-color: #666;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #999;
  font-size: 14px;
}

/* 주소 수정 폼 */
.address-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.address-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-form .form-group label {
  color: #e0e0e0;
  font-weight: 600;
  font-size: 14px;
}

.address-form .form-group input {
  padding: 12px 16px;
  background: #0f0f0f;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  font-size: 15px;
  color: #ffffff;
  transition: border-color 0.2s;
  font-family: inherit;
}

.address-form .form-group input:focus {
  outline: none;
  border-color: #ffffff;
  background: #151515;
}

.postal-code-group {
  display: flex;
  gap: 8px;
}

.postal-code-group input {
  flex: 1;
}

.btn-search-postal {
  padding: 12px 16px;
  background: transparent;
  border: 1px solid #4a4a4a;
  color: #ffffff;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-search-postal:hover {
  background: #2a2a2a;
  border-color: #666;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #2a2a2a;
}

.form-actions .btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
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
}

.form-actions .btn-primary:hover:not(:disabled) {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.form-actions .btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 주문상세 */
.order-detail-section {
  background: #0f0f0f;
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 16px;
}
.order-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.link-btn {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;

  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;

  cursor: pointer;
  transition: all 0.2s ease;
}

.link-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: #ffffff;
}

.order-detail-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #ffffff;
  border-left: 4px solid #ffffff;
  padding-left: 10px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.info-item.column {
  flex-direction: column;
  align-items: flex-start;
}

.label {
  font-size: 13px;
  color: #999;
  min-width: 90px;
}

.value {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}

.value.status {
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(116, 192, 252, 0.15);
  color: #74c0fc;
  font-size: 12px;
  font-weight: 600;
}

.value.badge {
  padding: 4px 10px;
  border-radius: 12px;
  background: #2a2a2a;
  font-size: 12px;
}

.info-item.total {
  border-top: 1px dashed #2a2a2a;
  padding-top: 12px;
  margin-top: 8px;
}

.value.highlight {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

/* 계정 설정 */
.account-panel {
  margin-bottom: 24px;
}

/* 비밀번호 변경 폼 */
.password-change-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.password-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-label {
  font-size: 13px;
  font-weight: 500;
  color: #999;
  letter-spacing: -0.2px;
}

.password-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.2s ease;
}

.password-input::placeholder {
  color: #555;
}

.password-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  border-color: #4a4a4a;
}

.password-hint {
  font-size: 12px;
  color: #777;
  margin: 0;
  line-height: 1.4;
  padding-left: 2px;
}

.password-form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-password-submit {
  min-width: 120px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
}

.danger-zone {
  background: rgba(255, 67, 54, 0.04) !important;
  border: 1px solid rgba(255, 67, 54, 0.15) !important;
  margin-top: 24px;
}

.danger-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.danger-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.danger-title {
  font-size: 14px;
  font-weight: 600;
  color: #ff8888;
  margin: 0;
  letter-spacing: -0.2px;
}

.danger-description {
  font-size: 13px;
  color: #999;
  margin: 0;
  line-height: 1.6;
}

.btn-danger {
  background: transparent;
  color: #ff6b6b;
  border: 1px solid rgba(255, 67, 54, 0.3);
  padding: 11px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.btn-danger:hover {
  background: rgba(255, 67, 54, 0.1);
  border-color: rgba(255, 67, 54, 0.5);
  color: #ff5555;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 회원 탈퇴 모달 */
.delete-account-modal {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 0;
  max-width: 480px;
  width: 90%;
  overflow: hidden;
}

.delete-account-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #2a2a2a;
  background: rgba(255, 67, 54, 0.05);
}

.delete-account-modal .modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #ff6b6b;
  margin: 0;
}

.delete-account-modal .close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.delete-account-modal .close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.delete-account-modal .modal-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.delete-account-modal .warning-text {
  font-size: 15px;
  color: #ff9999;
  line-height: 1.7;
  margin: 0;
  text-align: center;
  padding: 16px 0;
}

.delete-account-modal .delete-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.delete-account-modal .form-group {
  margin-bottom: 0;
}

.delete-account-modal .form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px;
}

/* 알림 설정 */
.notification-settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.notification-setting-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #3a3a3a;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.setting-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  flex-shrink: 0;
}

.setting-details {
  flex: 1;
}

.setting-title {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.setting-description {
  font-size: 13px;
  color: #999;
  margin: 0;
  line-height: 1.5;
}

.required-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* 토글 스위치 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3a3a3a;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: #ffffff;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #4CAF50;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.toggle-switch input:focus + .toggle-slider {
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-switch input:disabled + .toggle-slider.disabled {
  cursor: not-allowed;
}

.notification-save-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.notification-save-footer .btn {
  min-width: 120px;
}


@media (max-width: 640px) {
  .address-modal,
  .address-edit-modal {
    padding: 24px;
  }

  .address-content {
    flex-direction: column;
  }

  .postal-code-group {
    flex-direction: column;
  }

  .btn-search-postal {
    width: 100%;
  }

  .delete-account-modal {
    max-width: 95%;
  }

  .delete-account-modal .modal-header {
    padding: 20px;
  }

  .delete-account-modal .modal-body {
    padding: 20px;
  }

  .password-form-footer {
    justify-content: stretch;
  }

  .btn-password-submit {
    flex: 1;
    width: 100%;
  }

  .password-input {
    padding: 12px 14px;
    font-size: 15px;
  }

  .password-label {
    font-size: 12px;
  }

  .danger-description br {
    display: none;
  }

  .danger-description {
    font-size: 12px;
  }

  .btn-danger {
    width: 100%;
    padding: 13px 24px;
  }

  .notification-setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .setting-info {
    width: 100%;
  }

  .notification-save-footer {
    justify-content: stretch;
  }

  .notification-save-footer .btn {
    width: 100%;
  }
}
</style>

<template>
  <main class="notifications-page">
    <div class="container">
      <div class="page-header">
        <h1>알림</h1>
        <button v-if="notifications.length > 0" class="btn-clear" @click="clearAll">전체 삭제</button>
      </div>

      <div v-if="notifications.length === 0" class="empty-state">
        <div class="empty-icon">🔔</div>
        <p>알림이 없습니다</p>
      </div>

      <div v-else class="notifications-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon" :class="notification.type">
            <span>{{ getIcon(notification.type) }}</span>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.time }}</div>
          </div>
          <button class="btn-delete" @click.stop="deleteNotification(notification.id)">×</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([
        {
          id: 1,
          type: 'order',
          title: '주문 완료',
          message: '아이폰 15 Pro Max 주문이 완료되었습니다.',
          time: '방금 전',
          read: false
        },
        {
          id: 2,
          type: 'delivery',
          title: '배송 시작',
          message: '나이키 에어맥스 운동화가 배송을 시작했습니다.',
          time: '1시간 전',
          read: false
        },
        {
          id: 3,
          type: 'review',
          title: '리뷰 요청',
          message: '구매하신 상품에 대한 리뷰를 작성해주세요.',
          time: '3시간 전',
          read: true
        },
        {
          id: 4,
          type: 'promotion',
          title: '특가 알림',
          message: '관심 상품이 특가로 할인되었습니다.',
          time: '1일 전',
          read: true
        },
        {
          id: 5,
          type: 'settlement',
          title: '정산 완료',
          message: '12월 정산이 완료되어 계좌로 입금되었습니다.',
          time: '2일 전',
          read: true
        }
      ])

const getIcon = (type) => {
  const icons = {
    order: '📦',
    delivery: '🚚',
    review: '⭐',
    promotion: '🎉',
    settlement: '💰',
    system: '🔔'
  }
  return icons[type] || '🔔'
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const clearAll = () => {
  if (confirm('모든 알림을 삭제하시겠습니까?')) {
    notifications.value = []
  }
}
</script>

<style scoped>
.notifications-page {
  background: #0a0a0a;
  min-height: 100vh;
  padding: 32px 0 60px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
}

.btn-clear {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #999;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  border-color: #3a3a3a;
  color: #ffffff;
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  font-size: 16px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.notification-item:hover {
  background: #222222;
  border-color: #3a3a3a;
}

.notification-item.unread {
  border-left: 4px solid #ffffff;
  background: #1f1f1f;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  background: #0f0f0f;
}

.notification-icon.order {
  background: #2a2a2a;
}

.notification-icon.delivery {
  background: #2a2a2a;
}

.notification-icon.review {
  background: #2a2a2a;
}

.notification-icon.promotion {
  background: #2a2a2a;
}

.notification-icon.settlement {
  background: #2a2a2a;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.notification-message {
  font-size: 14px;
  color: #999;
  line-height: 1.5;
}

.notification-time {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.notification-item.unread .notification-title {
  color: #ffffff;
  font-weight: 700;
}

.btn-delete {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 24px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: #2a2a2a;
  color: #ffffff;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .notification-item {
    padding: 12px;
  }

  .notification-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>




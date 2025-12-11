<template>
  <main class="page">
    <div class="container">
      <h1>팔로잉</h1>
      <ul class="list">
        <li v-for="u in users" :key="u.id" class="item">
          <div class="left">
            <div class="avatar">{{ u.name[0] }}</div>
            <div>
              <div class="title">{{ u.name }}</div>
              <div class="muted">최근 활동: {{ u.activity }}</div>
            </div>
          </div>
          <button class="btn btn-outline">언팔로우</button>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
export default {
  name: 'UserFollowing',
  data() {
    return {
      users: [
        { id: 1, name: '홍길동', activity: '커뮤니티 글 작성' },
        { id: 2, name: '아라', activity: '매칭 참가' }
      ]
    }
  }
}
</script>

<style scoped>
.page { background: #0c0d10; color: #e9ecef; min-height: 100vh; }
.container { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.item { display: flex; align-items: center; justify-content: space-between; background: #12141a; border: 1px solid #1d2230; border-radius: 10px; padding: 10px; }
.left { display: flex; gap: 10px; align-items: center; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: #182038; display: grid; place-items: center; color: #d7def1; font-weight: 700; }
.title { color: #e6ebf5; }
.muted { color: #98a2b3; font-size: 12px; }
.btn { height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; }
.btn-outline { background: transparent; color: #e2e6ea; border-color: #3a3f46; }
</style>



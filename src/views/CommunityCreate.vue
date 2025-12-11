<template>
  <main class="page">
    <div class="container">
      <h1>게시글 작성</h1>
      <form class="form" @submit.prevent="submit">
        <label>
          카테고리
          <select v-model="form.category">
            <option value="free">자유</option>
            <option value="info">정보</option>
            <option value="recruit">모집</option>
          </select>
        </label>
        <label>
          첨부파일
          <input type="file" multiple @change="onFiles" />
        </label>
        <div v-if="files.length" class="files">
          <div class="file" v-for="(f, idx) in files" :key="idx">
            {{ f.name }} ({{ prettySize(f.size) }})
          </div>
        </div>
        <label>
          제목
          <input v-model="form.title" placeholder="제목을 입력" />
        </label>
        <label>
          내용
          <textarea v-model="form.content" rows="8" placeholder="내용을 입력"></textarea>
        </label>
        <div class="actions">
          <router-link class="btn" to="/community">취소</router-link>
          <button class="btn btn-primary" type="submit">등록</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CommunityCreate',
  data() {
    return {
      form: { category: 'free', title: '', content: '' },
      files: []
    }
  },
  methods: {
    onFiles(e) {
      this.files = Array.from(e.target.files || [])
    },
    prettySize(bytes) {
      const units = ['B','KB','MB','GB']
      let i = 0
      let v = bytes
      while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
      return `${v.toFixed(1)} ${units[i]}`
    },
    submit() {
      if (!this.form.title.trim()) return alert('제목을 입력하세요')
      if (!this.form.content.trim()) return alert('내용을 입력하세요')
      alert(`등록되었습니다 (목업) - 파일 ${this.files.length}개`)
      this.$router.push('/community')
    }
  }
}
</script>

<style scoped>
.page { background: #0c0d10; color: #e9ecef; min-height: 100vh; }
.container { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
.form { display: grid; gap: 12px; }
input, select, textarea { width: 100%; background: #0f1116; color: #e9ecef; border: 1px solid #2a2f37; border-radius: 8px; padding: 10px; }
.files { display: grid; gap: 6px; }
.file { color: #c9d1e5; font-size: 14px; }
.actions { display: flex; gap: 8px; justify-content: flex-end; }
.btn { height: 36px; padding: 0 14px; border-radius: 8px; border: 1px solid #3a3f46; background: transparent; color: #e2e6ea; text-decoration: none; display: inline-flex; align-items: center; }
.btn-primary { background: #5865f2; color: white; border-color: transparent; }
</style>




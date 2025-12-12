// UUID 생성 유틸리티 (간단한 버전)
// 실제 프로덕션에서는 crypto.randomUUID() 또는 uuid 라이브러리 사용 권장

export function generateUUID() {
  // crypto.randomUUID()가 있으면 사용, 없으면 간단한 UUID v4 생성
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback: 간단한 UUID v4 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 이메일 기반으로 일관된 UUID 생성 (개발/테스트용)
export function generateUUIDFromEmail(email) {
  // 간단한 해시 함수로 이메일을 UUID로 변환
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // UUID v4 형식으로 변환
  const hex = Math.abs(hash).toString(16).padStart(32, '0')
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-4${hex.substring(13, 16)}-${(hash & 0x3 | 0x8).toString(16)}${hex.substring(17, 20)}-${hex.substring(20, 32)}`
}
















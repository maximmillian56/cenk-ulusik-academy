import { calculateProgress, slugify, generateVerificationId } from '../src/lib/utils'

describe('Scoring and Utils Helper Tests', () => {
  test('calculateProgress calculates exact percentage', () => {
    expect(calculateProgress(0, 10)).toBe(0)
    expect(calculateProgress(5, 10)).toBe(50)
    expect(calculateProgress(10, 10)).toBe(100)
    expect(calculateProgress(1, 3)).toBe(33)
    expect(calculateProgress(0, 0)).toBe(0)
  })

  test('slugify converts Turkish characters to clean url slugs', () => {
    expect(slugify('İngilizce Öğrenme Rehberi')).toBe('ingilizce-ogrenme-rehberi')
    expect(slugify('Çalışma Şevki & Başarı!')).toBe('calisma-sevki-basari')
    expect(slugify('Cenk Uluşık English Academy')).toBe('cenk-ulusik-english-academy')
  })

  test('generateVerificationId produces 12 alphanumeric characters', () => {
    const id = generateVerificationId()
    expect(id).toHaveLength(12)
    expect(typeof id).toBe('string')
    expect(/^[A-Z0-9]+$/.test(id)).toBe(true)
  })
})

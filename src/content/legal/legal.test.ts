import { describe, it, expect } from 'vitest'
import { PRIVACY_POLICY } from './privacy'
import { TERMS } from './terms'

describe('_shared/legal DSR 文言整合 (SEC-004 / O54)', () => {
  it('N2: プラポリにセルフサービス削除を明記', () => {
    expect(PRIVACY_POLICY).toContain('セルフサービス')
    expect(PRIVACY_POLICY).toMatch(/削除/)
    expect(PRIVACY_POLICY).toMatch(/全データ/)
  })
  it('E1: 履行不能な「削除請求は窓口まで」式の約束を含まない', () => {
    // 「窓口での削除は承れません」という否定表現は OK、「窓口で削除します/削除請求は窓口まで」は NG
    expect(PRIVACY_POLICY).not.toMatch(/削除[^。]*請求[^。]*窓口まで/)
    expect(PRIVACY_POLICY).toContain('窓口でのデータ削除は承れません')
  })
  it('利用規約に AI 生成の正確性免責 + tip-jar 返金不可', () => {
    expect(TERMS).toMatch(/正確性を保証するものではありません/)
    expect(TERMS).toMatch(/返金/)
  })
})

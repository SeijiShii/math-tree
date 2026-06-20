import { PRIVACY_POLICY } from '../content/legal/privacy'
import { TERMS } from '../content/legal/terms'
import { SCT } from '../content/legal/sct'
const DOCS = { privacy: PRIVACY_POLICY, terms: TERMS, sct: SCT } as const
export function LegalPage({ doc }: { doc: keyof typeof DOCS }) {
  return <article className="legal"><pre style={{ whiteSpace: 'pre-wrap' }}>{DOCS[doc]}</pre></article>
}

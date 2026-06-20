// アプリのルート定義。各ルートは inbound nav を持つ（O55 orphaned page 禁止）。
export interface RouteDef { path: string; nav: 'header' | 'footer' | 'context' }
export const ROUTES: RouteDef[] = [
  { path: '/', nav: 'header' },                                  // テックツリー
  { path: '/learn/:slug', nav: 'context' },                     // 学習（ノードから）
  { path: '/account', nav: 'header' },                          // DSR 閲覧・削除
  { path: '/support', nav: 'context' },                        // tip-jar（節目から）
  { path: '/legal/privacy', nav: 'footer' },
  { path: '/legal/terms', nav: 'footer' },
  { path: '/legal/specified-commercial-transactions', nav: 'footer' },
]
// すべてのルートに到達導線があるか（O55）
export function orphanedRoutes(): string[] {
  return ROUTES.filter(r => !r.nav).map(r => r.path)
}

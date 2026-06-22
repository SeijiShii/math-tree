// MathLive のフォント配信パス（純定数、mathlive を import しない=テスト可能）。
// 既定では MathLive が bundle 位置基準で `/assets/fonts` を推定し本番で 404 になるため、
// public/mathlive/fonts/ に同梱した KaTeX woff2 を指す固定パスに上書きする。
export const MATHLIVE_FONTS_DIR = '/mathlive/fonts'

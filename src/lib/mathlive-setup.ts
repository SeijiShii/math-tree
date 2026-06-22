// MathLive の初期化（フォント/音声の配信パス固定）。
// `import "mathlive"` の副作用で <math-field> カスタム要素が登録される。
import { MathfieldElement } from "mathlive";
import { MATHLIVE_FONTS_DIR } from "./mathlive-config";

/**
 * MathLive のフォントをアプリ配信パス（/mathlive/fonts）に固定する。
 * 既定の bundle 相対パス推定（/assets/fonts）だと本番でフォントが 404（NetworkError）になるため。
 * math-field が初回 render される前（= 当モジュール読込時）に呼ぶこと。
 */
export function configureMathlive(): void {
  // 非ブラウザ環境（テスト/SSR）では MathfieldElement が未定義になり得る → no-op
  if (typeof MathfieldElement === "undefined" || !MathfieldElement) return;
  MathfieldElement.fontsDirectory = MATHLIVE_FONTS_DIR;
  // キー入力音は使わない。音声アセットの 404 も併せて回避（null = 無効）。
  MathfieldElement.soundsDirectory = null;
}

# tech-tree 機能仕様書

> **役割**: React Flow で単元/依存を描画する知識グラフ UI。現在地周辺フォーカス + 全体ミニマップ、アンロック進捗（習得/解放/未解放/ロマンノード）連動、ノード詳細に豆知識。
> **タグ**: feature, auth-required(owner 進捗), stateful（アンロック）
> **最終更新**: 2026-06-20
> **入力**: `../concept.md`（§1.1 UC1-4, §4.1, §3.X）, `./README.md`
> **デザイン**: `../design/design-system.md` §2.1 ノード状態カラー

---

## 1. 詳細 UC
### UC-TT1: テックツリーを眺める（concept §1.1 #1-2）
- 入力: 配信 curriculum（verified）+ owner progress
- 処理: ノード=単元/エッジ=依存で描画。現在地（最後に学んだ/次に学べる）周辺にフォーカス、別途ミニマップで全体 + 遠くのロマンノード表示
- 出力: 習得済（primary 充塗+琥珀リング）/ 解放済（輪郭）/ 未解放（点線）/ ロマンノード（遠景）
### UC-TT2: 単元を選ぶ（#3-4）
- ノード選択 → 詳細パネル（豆知識=実世界の使われ方）→ 解放済みなら「学ぶ」で learning-workbook へ
### UC-TT3: アンロック連動
- learning-workbook で習得 → progress mastered → グラフで次ノードが解放表示に更新

## 2. 入出力
### 2.1 API
| GET | /api/tech-tree/:line | line, owner | TechTreeGraph（nodes+edges+各ノード state） | owner |
### 2.3 副作用
- なし（読み取り。progress 更新は learning-workbook 側）。

## 3. データモデル
- 既存（units/edges/progress）から TechTreeGraph を組成。新規なし。

## 4. バリデーション + エラーケース
| グラフ取得 | verified コンテンツ + owner progress を結合 |
| 他人 progress | requireOwner（SEC-001） |
| 未解放ノードの学習導線 | 無効化（前提未習得は入れない） |
| 大量ノード | 周辺フォーカスで描画負荷を抑制（§3 NFR、wants 認知負荷） |

## 5. 機能固有 NFR + 既存連携
### 5.1 NFR
- 初期表示は周辺フォーカスで体感速い（全ノード一括描画を避ける）。状態が一目で分かる配色（design §2.1）。
### 5.2 連携
- 依存: _shared/db, _shared/types(TechTreeGraph), _shared/ui(nodeStyle/Katex), _shared/auth(owner), learning-workbook（習得連動）, curriculum-generation（配信）。被依存: なし（葉に近い UI）。

## 6. タグ別追加項目
### 6.1 認可
- progress は owner scoped（SEC-001）。
### 6.2 状態遷移
- ノード: 未解放 → (前提習得で) 解放済 → (習得で) 習得済。確定的解放のみ（charter §2.2、煽らない）。

## 7. スコープ外
- ロマンノードの実学習（遠景表示のみ、concept §1.2）。全体俯瞰一括描画（認知負荷回避）。

## 8. 未決事項
- 現時点で論点なし（2026-06-20）。周辺フォーカスのホップ数（1〜2）は実装で調整。

## 9. 更新履歴
| 2026-06-20 | 初版作成 | /flow:feature |

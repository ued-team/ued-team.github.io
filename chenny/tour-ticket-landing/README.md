# KKday UI — 入口流量整合

KKday 2026 Q1 Tour & Ticket 入口流量整合首頁與門票/體驗 landing page，依 Figma 設計稿實作。

## 預覽

- [`index.html`](index.html) — 首頁（Homepage）
- [`tour-ticket.html`](tour-ticket.html) — 門票/體驗 landing page

開啟其中一個 HTML 檔案即可在瀏覽器預覽。首頁點擊「門票/體驗」tab 會跳到 `tour-ticket.html`。

## 設計來源

依以下 Figma 節點實作：

- 首頁：[`2283-23734`](https://www.figma.com/design/HgI7v0GK4DPaRH7sJ81cCr/2026-q1-Tour---Ticket-入口流量整合?node-id=2283-23734)
- 門票/體驗：[`2283-23928`](https://www.figma.com/design/HgI7v0GK4DPaRH7sJ81cCr/2026-q1-Tour---Ticket-入口流量整合?node-id=2283-23928)

## Design tokens

`tokens.css` 對應 [`kkday-style-dictionary`](https://github.com/kkday/kkday-style-dictionary) `pnpm build` 產出的 web token，prefix 為 `--kk-`：

- **Color** — text / background / border / loyalty silver（含 lighter→darker 與 KV 五階）
- **Spacing** — `--kk-spacing-025` … `--kk-spacing-600`（2/4/6/8/12/16/20/24/32/40/48 px）
- **Radius** — `--kk-radius-{xs|sm|md|lg|xl|circle}`
- **Elevation** — `action / card / fixed`
- **Typography** — PingFang TC stack + Body / Subtitle / H1–H5

當 `kkday-style-dictionary` 更新時，重新 `pnpm build` 後將 `build/web/css/_design_tokens.css` 內容覆蓋到 `tokens.css` 即可。

## Assets

`assets/` 內所有 icon 與 pictogram 直接複製自 [`kkday-style-dictionary`](https://github.com/kkday/kkday-style-dictionary) 的 `icon/` 與 `pictogram/`。

- `assets/icons/` — 16 個 line/color SVG icons（搜尋、箭頭、地點、購物車、KKday Points、星等、愛心、信賴商家、Loyalty Silver 徽章…）
- `assets/pictograms/` — 11 組 1x + 2x PNG 分類插畫（親子好玩、觀光行程、戶外運動…）

## Stack

純靜態 HTML + CSS（無 build step、無框架）。圖片使用 Figma MCP asset URL（7 天有效）。

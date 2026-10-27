import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from "lucide-react";
import { moveItem, setSortMode } from "@/app/admin/actions";
import { SORT_MODES, type SortBoard, type SortMode } from "@/lib/sorting";
import { inputCls, secondaryBtn } from "./ui";

/** 게시판 정렬 방식 선택 — 관리자 목록과 사이트에 똑같이 적용됩니다. */
export function SortControls({ board, mode, note }: { board: SortBoard; mode: SortMode; note?: string }) {
  return (
    <form action={setSortMode} className="mb-6 flex flex-wrap items-center gap-3 border border-line bg-white px-5 py-4">
      <input type="hidden" name="board" value={board} />
      <label htmlFor={`sort-${board}`} className="text-[14px] font-semibold">
        정렬 방식
      </label>
      <select id={`sort-${board}`} name="mode" defaultValue={mode} className={`${inputCls} w-auto min-w-[140px] py-2`}>
        {SORT_MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <button type="submit" className={`${secondaryBtn} min-h-[38px] px-4`}>
        적용
      </button>
      <p className="text-[13px] text-muted">
        {mode === "manual" ? "목록의 화살표로 순서를 바꾸면 사이트에 바로 반영됩니다. 새 글은 맨 앞에 추가됩니다." : "작성일 기준으로 자동 정렬됩니다."}
        {note && <span className="ml-1">{note}</span>}
      </p>
    </form>
  );
}

const moveBtn =
  "inline-flex h-8 w-8 items-center justify-center border border-line bg-white text-ink/70 transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line";

const MOVES = [
  { dir: "top", label: "맨 위로", icon: ChevronsUp, atStart: true },
  { dir: "up", label: "위로", icon: ChevronUp, atStart: true },
  { dir: "down", label: "아래로", icon: ChevronDown, atStart: false },
  { dir: "bottom", label: "맨 아래로", icon: ChevronsDown, atStart: false },
] as const;

/**
 * '직접 지정'일 때 글 하나를 맨 위·위·아래·맨 아래로 옮기는 버튼
 * 방향마다 Form을 따로 두어, 눌린 버튼의 방향이 hidden 값으로 확실히 전달되게 합니다.
 */
export function MoveButtons({ board, id, isFirst, isLast, title }: { board: SortBoard; id: string | number; isFirst: boolean; isLast: boolean; title: string }) {
  return (
    <span className="inline-flex gap-1">
      {MOVES.map(({ dir, label, icon: Icon, atStart }) => (
        <form key={dir} action={moveItem}>
          <input type="hidden" name="board" value={board} />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="dir" value={dir} />
          <button type="submit" disabled={atStart ? isFirst : isLast} aria-label={`'${title}' ${label}`} title={label} className={moveBtn}>
            <Icon aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>
      ))}
    </span>
  );
}

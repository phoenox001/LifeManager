/**
 * The "…" sheet shared by every tier-2 list. Actions adapt to the item's kind and status;
 * Delete always offers Archive first, and completing a Project offers to archive it.
 */
import { useApp, type AppState } from '../store/appStore';
import type { RowSheetTarget } from '../domain/types';
import { GhostButton, Grabber, OutlineButton, PrimaryButton, Sheet, Toggle, z } from '../components/ui';

interface Action {
  label: string;
  sub: string;
  run: () => void;
}

const KIND_LABEL = { project: 'Project', focus: 'Focus', note: 'Note', doc: 'AI document', archived: 'Archived' } as const;

function actionsFor(st: AppState, t: RowSheetTarget): Action[] {
  const done = (msg?: string) => { st.closeRowSheet(); if (msg) st.showToast(msg.replace('%s', t.name)); };
  const archive = () => {
    st.closeRowSheet();
    if (t.kind === 'project' || t.kind === 'focus') st.archiveContainer(t.kind, t.id);
    else if (t.kind === 'note') st.archiveNote(t.id);
    else if (t.kind === 'doc') st.archiveDoc(t.id);
  };

  if (t.kind === 'archived') {
    return [{ label: 'Restore to active', sub: 'Puts it back where it was', run: () => { st.closeRowSheet(); st.restoreArchived(t.id); } }];
  }

  const list: Action[] = [];
  if (t.kind === 'project' || t.kind === 'focus') {
    const kind = t.kind;
    const pinned = kind === 'project' ? st.projects.find(p => p.id === t.id)?.pinned : st.focuses.find(f => f.id === t.id)?.pinned;
    list.push(pinned
      ? { label: 'Unpin from overview', sub: 'Keeps it in this list only', run: () => { st.togglePin(kind, t.id); done('%s unpinned'); } }
      : { label: 'Pin to overview', sub: 'Show it on the section overview', run: () => { st.togglePin(kind, t.id); done('%s pinned to the overview'); } });
  } else if (t.kind === 'doc') {
    list.push({ label: 'Pin to overview', sub: 'Show it on the section overview', run: () => done('%s pinned to the overview') });
  }

  if (t.kind === 'project') {
    const status = st.projects.find(p => p.id === t.id)?.status ?? 'active';
    const complete = { label: 'Mark complete', sub: 'Wraps it up — you choose what happens next', run: () => st.setRowSheetStep('complete') };
    if (status === 'active') {
      list.push({ label: 'Pause', sub: 'Keeps it out of your active list — resume whenever', run: () => { st.setProjectStatus(t.id, 'paused'); done('%s paused'); } }, complete);
    } else if (status === 'paused') {
      list.push({ label: 'Resume', sub: 'Back into your active projects', run: () => { st.setProjectStatus(t.id, 'active'); done('%s resumed'); } }, complete);
    } else {
      list.push({ label: 'Reopen', sub: 'Back into your active projects', run: () => { st.setProjectStatus(t.id, 'active'); done('%s reopened'); } });
    }
  }

  if (t.kind === 'focus') {
    const paused = !!st.focuses.find(f => f.id === t.id)?.paused;
    list.push(paused
      ? { label: 'Resume', sub: 'Start logging it again — the score picks up, it never reset', run: () => { st.setFocusPaused(t.id, false); done('%s resumed'); } }
      : { label: 'Pause', sub: 'Stops logging and scoring, keeps the history', run: () => { st.setFocusPaused(t.id, true); done('%s paused'); } });
  }

  list.push(t.kind === 'note'
    ? { label: 'File under another topic', sub: 'A note can sit in several places', run: () => { st.closeRowSheet(); st.openDetail('note', t.id); st.toggleDetailEdit(); } }
    : { label: 'Add a note to this', sub: 'Goes straight into its notes', run: () => done('Note started on %s') });

  if (!isBuiltIn(st, t)) list.push({ label: 'Archive', sub: 'Keeps everything, hides it from here', run: archive });
  return list;
}

const isBuiltIn = (st: AppState, t: RowSheetTarget) => t.kind === 'focus' && !!st.focuses.find(f => f.id === t.id)?.builtIn;

export function RowActionSheet() {
  const st = useApp();
  const t = st.rowSheet;
  if (!t) return null;

  const archiveThenClose = () => {
    st.closeRowSheet();
    if (t.kind === 'project' || t.kind === 'focus') st.archiveContainer(t.kind, t.id);
    else if (t.kind === 'note') st.archiveNote(t.id);
    else if (t.kind === 'doc') st.archiveDoc(t.id);
  };
  const aiKey = t.kind + ':' + t.id;
  const showAi = t.kind === 'project' || t.kind === 'focus' || t.kind === 'note';
  const showDelete = t.kind !== 'archived' && !isBuiltIn(st, t);

  return (
    <Sheet zIndex={z.rowSheet} onDismiss={st.closeRowSheet}>
      <Grabber />

      {st.rowSheetStep === 'actions' && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-ter)', marginBottom: 4 }}>{KIND_LABEL[t.kind]}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t.name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actionsFor(st, t).map(a => (
              <div key={a.label} style={{ background: 'var(--surface2)', borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }} onClick={a.run}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{a.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 2 }}>{a.sub}</div>
              </div>
            ))}
          </div>
          {showAi && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--surface2)', borderRadius: 16, padding: '14px 16px', marginTop: 8, cursor: 'pointer' }} onClick={() => st.toggleAiExclude(aiKey)}>
              <div style={{ minWidth: 0 }}>
                {/* Fixed label: on means hidden, off means visible. */}
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>Hide from the AI</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 2 }}>Excluding it hides this item from every AI action</div>
              </div>
              <Toggle on={!!st.aiExcluded[aiKey]} onColor="var(--urgent)" />
            </div>
          )}
          {showDelete && <OutlineButton color="var(--urgent)" style={{ marginTop: 14 }} onClick={() => st.setRowSheetStep('confirmDelete')}>Delete</OutlineButton>}
          <GhostButton style={{ marginTop: 6 }} onClick={st.closeRowSheet}>Cancel</GhostButton>
        </>
      )}

      {st.rowSheetStep === 'complete' && (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{t.name} is complete</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.5, marginBottom: 18 }}>Send it to the Archive to clear it out of Projects, or leave it in Completed for a while. Either way nothing is lost.</div>
          <PrimaryButton color="var(--accent2)" onClick={() => { st.setProjectStatus(t.id, 'completed'); archiveThenClose(); }}>Send to Archive</PrimaryButton>
          <OutlineButton style={{ marginTop: 8 }} onClick={() => { st.setProjectStatus(t.id, 'completed'); st.closeRowSheet(); st.showToast(t.name + ' marked complete'); }}>Keep it in Completed</OutlineButton>
          <GhostButton style={{ marginTop: 4 }} onClick={st.closeRowSheet}>Cancel</GhostButton>
        </>
      )}

      {st.rowSheetStep === 'confirmDelete' && (
        <>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Delete {t.name}?</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-sec)', lineHeight: 1.5, marginBottom: 18 }}>Archiving keeps everything and you can bring it back any time. Deleting cannot be undone.</div>
          <PrimaryButton color="var(--accent2)" onClick={archiveThenClose}>Archive instead</PrimaryButton>
          <OutlineButton color="var(--urgent)" style={{ marginTop: 8 }} onClick={() => { st.closeRowSheet(); st.deleteItem(t); }}>Delete permanently</OutlineButton>
          <GhostButton style={{ marginTop: 4 }} onClick={st.closeRowSheet}>Keep it</GhostButton>
        </>
      )}
    </Sheet>
  );
}

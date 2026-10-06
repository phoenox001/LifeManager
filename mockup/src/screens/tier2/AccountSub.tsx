import { useApp, topicsOf, type AccountSub, type AiTone } from '../../store/appStore';
import { USER, automations } from '../../data/seed';
import { noteFeed } from '../../domain/logic';
import { isProjectName } from '../../domain/selectors';
import type { CrudLetter, PermissionBucket } from '../../domain/types';
import { ChevronDown, ChevronRight } from '../../components/icons';
import {
  BackLink, Card, Empty, FilterChips, MetaRowCard, MoreButton, Overlay, PageTitle, RowCardHead, RowSection, SearchButton,
  SearchField, Segmented, Stack, Toggle, z,
} from '../../components/ui';
import t2 from './tier2.module.css';

const TITLES: Record<AccountSub, string> = {
  ai: 'AI settings', docs: 'Stored AI documents', auto: 'Automations', info: 'Account info', archive: 'Archive', notes: 'Notes',
};

const BODIES: Record<AccountSub, () => React.JSX.Element> = {
  ai: AiSettings, docs: StoredDocs, auto: Automations, info: AccountInfo, archive: Archive, notes: Notes,
};

export function AccountSubScreen() {
  const sub = useApp(s => s.accountSub);
  const close = useApp(s => s.closeAccountSub);
  if (!sub) return null;
  const Body = BODIES[sub];
  return (
    <Overlay zIndex={z.accountSub}>
      <BackLink label="Account" onClick={close} />
      <PageTitle style={{ marginBottom: 18 }}>{TITLES[sub]}</PageTitle>
      <Body />
    </Overlay>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <div className={t2.leadRow}>
      <div className={t2.lead}>{children}</div>
      <SearchButton />
    </div>
  );
}

/* ---------- AI settings ---------- */

function AiSettings() {
  const st = useApp();
  const buckets: PermissionBucket[] = ['Projects', 'Focuses'];
  const letters: CrudLetter[] = ['C', 'R', 'U', 'D'];
  return (
    <>
      <div className={t2.sectionCaps}>Permissions</div>
      <Card style={{ padding: '14px 16px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-ter)', marginBottom: 10 }}>
          <div style={{ width: 70 }} />
          <div style={{ display: 'flex', gap: 14 }}>{letters.map(l => <span key={l}>{l}</span>)}</div>
        </div>
        {buckets.map(b => (
          <div key={b} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>{b}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {letters.map(l => {
                const on = st.permissions[b][l];
                return (
                  <div
                    key={l}
                    onClick={() => st.togglePermission(b, l)}
                    style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, cursor: 'pointer', background: on ? 'var(--accent2)' : 'var(--surface2)', color: on ? '#fff' : 'var(--text-ter)' }}
                  >
                    {l}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Card>
      <div className={t2.settingRow} style={{ marginBottom: 18 }} onClick={st.toggleConfirmWrites}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
          <div style={{ fontSize: 14.5, fontWeight: 500 }}>Confirm before AI writes</div>
          <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 1 }}>Separate from permissions — can be overridden per automation</div>
        </div>
        <Toggle on={st.confirmWrites} />
      </div>
      <div className={t2.sectionCaps}>Tone</div>
      <Segmented<AiTone>
        value={st.aiTone}
        onChange={st.setAiTone}
        options={[{ value: 'warm', label: 'Warmer' }, { value: 'balanced', label: 'Balanced' }, { value: 'direct', label: 'Direct' }]}
        style={{ gap: 6 }}
        segmentStyle={{ padding: '8px 2px', fontSize: 12.5 }}
      />
      <div style={{ fontSize: 12, color: 'var(--text-ter)', marginTop: 8, lineHeight: 1.45 }}>Same assistant either way — only how it speaks changes.</div>
    </>
  );
}

/* ---------- stored AI documents ---------- */

function StoredDocs() {
  const st = useApp();
  const q = st.search.query.trim().toLowerCase();
  const docs = st.docs.filter(d => !q || d.title.toLowerCase().includes(q));
  const name = (id: string, title: string) => st.nameOverrides['doc:' + id] || title;
  return (
    <>
      <Lead>Content the AI wrote and keeps up to date with you. Newest first.</Lead>
      <SearchField placeholder="Search documents" marginBottom={14} />
      <Stack>
        {docs.map(d => (
          <Card key={d.id}>
            <RowCardHead name={name(d.id, d.title)} dotColor="var(--accent2)" titleSize={15} onOpen={() => st.openDetail('doc', d.id)} onMore={() => st.openRowSheet({ kind: 'doc', id: d.id, name: name(d.id, d.title) })} />
            <RowSection style={{ padding: '11px 16px 12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div className={t2.label} style={{ padding: '3px 7px', background: 'var(--accent2-soft)', color: 'var(--accent2)', flexShrink: 0 }}>{d.kind}</div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: 'var(--text-ter)', lineHeight: 1.4 }}>{d.meta}</div>
            </RowSection>
          </Card>
        ))}
      </Stack>
      {docs.length === 0 && <Empty>Nothing matches that search.</Empty>}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '14px 16px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }}
        onClick={() => { st.closeAccountSub(); st.openAiChat(); }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Build a new one together</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 2 }}>Opens a chat — nothing is written without you</div>
        </div>
        <ChevronRight size={11} />
      </div>
    </>
  );
}

/* ---------- automations ---------- */

function Automations() {
  const showToast = useApp(s => s.showToast);
  return (
    <>
      <div style={{ fontSize: 13.5, color: 'var(--text-sec)', marginBottom: 16 }}>Prompts the AI runs on a schedule. You or it can create them.</div>
      <Stack gap={10} style={{ marginBottom: 14 }}>
        {automations.map(a => (
          <Card key={a.id} style={{ padding: '15px 16px' }} onClick={() => showToast('Edit “' + a.title + '”')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 5 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{a.title}</div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-sec)', flexShrink: 0, paddingTop: 2 }}>{a.when}</div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-sec)', lineHeight: 1.45, marginBottom: 10 }}>{a.prompt}</div>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 9, background: a.confirm ? 'var(--accent2-soft)' : 'var(--surface2)', color: a.confirm ? 'var(--accent2)' : 'var(--text-sec)' }}>
              {a.confirm ? 'Asks before writing' : 'Runs without asking'}
            </div>
          </Card>
        ))}
      </Stack>
      <div style={{ textAlign: 'center', padding: 14, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }} onClick={() => showToast('New scheduled trigger')}>
        New trigger
      </div>
    </>
  );
}

/* ---------- account info ---------- */

function AccountInfo() {
  const rows = [['Name', USER.name], ['Email', USER.email], ['Notes stored', USER.notesStored]];
  return (
    <>
      <Card style={{ marginBottom: 14 }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', fontSize: 14, borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : undefined }}>
            <div style={{ color: 'var(--text-sec)' }}>{k}</div>
            <div style={{ fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </Card>
      <Card style={{ padding: '15px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>On this device</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-sec)', lineHeight: 1.45 }}>Active Projects and Focuses are kept locally so they open instantly. Everything else lives in the cloud and comes back the moment you touch it.</div>
      </Card>
    </>
  );
}

/* ---------- archive ---------- */

function Archive() {
  const st = useApp();
  const q = st.search.query.trim().toLowerCase();
  const hit = (s: string) => !q || s.toLowerCase().includes(q);
  type Row = { id: string; name: string; meta: string; open?: () => void };
  const groups: { id: string; label: string; rows: Row[] }[] = [
    { id: 'projects', label: 'Projects', rows: st.projects.filter(p => p.archived).map(p => ({ id: p.id, name: p.name, meta: 'Completed · archived ' + p.archivedOn, open: () => st.openDetail('project', p.id) })) },
    { id: 'focuses', label: 'Focuses', rows: st.focuses.filter(f => f.archived).map(f => ({ id: f.id, name: f.name, meta: 'Paused · archived ' + f.archivedOn, open: () => st.openDetail('focus', f.id) })) },
    { id: 'resources', label: 'Resources', rows: st.archivedResources },
    { id: 'notes', label: 'Notes', rows: st.archivedNotes },
  ].map(g => ({ ...g, rows: g.rows.filter(r => hit(r.name)) })).filter(g => g.rows.length > 0);

  return (
    <>
      <Lead>Nothing here is deleted. Grouped by kind — “…” to restore.</Lead>
      <SearchField placeholder="Search the archive" marginBottom={14} />
      {groups.map(g => {
        // A search reveals every group so results cannot hide in a collapsed one.
        const open = !st.archiveClosed[g.id] || !!q;
        return (
          <div key={g.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0 8px', padding: '6px 2px', cursor: 'pointer' }} onClick={() => st.toggleArchiveGroup(g.id)}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-sec)' }}>{g.label}</div>
              <div style={{ flex: 1, fontSize: 11.5, color: 'var(--text-ter)' }}>{g.rows.length}</div>
              <ChevronDown up={open} />
            </div>
            {open && (
              <Stack>
                {g.rows.map(r => (
                  <MetaRowCard
                    key={r.id}
                    name={r.name}
                    meta={r.meta}
                    opacity={0.85}
                    onOpen={r.open ?? (() => st.showToast('Opening ' + r.name))}
                    onMore={() => st.openRowSheet({ kind: 'archived', id: r.id, name: r.name })}
                  />
                ))}
              </Stack>
            )}
          </div>
        );
      })}
      {groups.length === 0 && <Empty>Nothing matches that search.</Empty>}
    </>
  );
}

/* ---------- notes ---------- */

function Notes() {
  const st = useApp();
  const feed = noteFeed(st.notes, n => topicsOf(st, n.id), st.noteFilters, st.search.query);
  const allTopics = Array.from(new Set(st.notes.flatMap(n => topicsOf(st, n.id))));
  const chipColors = (t: string) => isProjectName(t, st.projects)
    ? { background: 'var(--proj-soft)', color: 'var(--proj)' }
    : { background: 'var(--focus-soft)', color: 'var(--focus)' };

  return (
    <>
      <div className={t2.leadRow} style={{ marginBottom: 12 }}>
        <div className={t2.lead}>Everything you have dumped, newest first. A note can sit under several topics.</div>
        <SearchButton />
      </div>
      <SearchField placeholder="Search notes" marginBottom={12} />
      <FilterChips style={{ marginBottom: 10 }} options={allTopics.map(t => ({ value: t, label: t }))} isActive={t => st.noteFilters.includes(t)} onPick={st.toggleNoteFilter} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, color: 'var(--text-ter)' }}>{feed.length + (feed.length === 1 ? ' note' : ' notes')}</div>
        {st.noteFilters.length > 0 && (
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', cursor: 'pointer', padding: '6px 0' }} onClick={st.clearNoteFilters}>Clear filters</div>
        )}
      </div>
      <Stack>
        {feed.map(e => (
          <Card key={e.key}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px 9px 16px' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                {e.labels.map(l => <div key={l} className={t2.label} style={chipColors(l)}>{l}</div>)}
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)' }}>{e.note.when}</div>
              </div>
              <MoreButton onClick={() => st.openRowSheet({ kind: 'note', id: e.note.id, name: 'This note' })} />
            </div>
            <RowSection style={{ padding: '12px 16px 13px', cursor: 'pointer' }}>
              <div onClick={() => st.openDetail('note', e.note.id)}>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{e.note.text}</div>
                {e.dupNote && <div style={{ fontSize: 11, color: 'var(--text-ter)', marginTop: 8 }}>{e.dupNote}</div>}
              </div>
            </RowSection>
          </Card>
        ))}
      </Stack>
      {feed.length === 0 && <Empty>No notes match that. Clearing a filter or two usually helps.</Empty>}
    </>
  );
}

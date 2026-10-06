/**
 * Tier 3 — one detail screen for every entry point: Project, Focus (scored or not),
 * Note and Stored AI document. Archived items render on a tinted background but stay editable.
 */
import { useRef } from 'react';
import { displayName, moduleList, topicsOf, useApp, type AppState } from '../../store/appStore';
import {
  detailCopy, docBodies, milestonesMap, moduleCatalog, noteAttachmentsMap, noteBacklinksMap, resourcesMap, weekEvents,
} from '../../data/seed';
import { ringColorFor } from '../../domain/logic';
import { isProjectName } from '../../domain/selectors';
import type { Focus, ModuleId, Project } from '../../domain/types';
import { ArchivedBannerIcon, ChevronLeft, Cross, DocIcon, DocStar, DragHandle, FolderIcon, SmallPlus, Sparkle, TargetIcon } from '../../components/icons';
import { Caps, Card, ProgressBar, Ring, SectionHeader, Toggle, z } from '../../components/ui';
import { MiniBar } from '../../components/nav/BottomNav';
import { ModuleStack } from './modules';
import s from './detail.module.css';

export function Detail() {
  const st = useApp();
  const d = st.detail;
  if (!d) return null;

  const container = d.kind === 'project' ? st.projects.find(p => p.id === d.id)
    : d.kind === 'focus' ? st.focuses.find(f => f.id === d.id) : undefined;
  const archived = !!container?.archived;

  return (
    <div className={s.screen} style={{ zIndex: z.detail, background: archived ? 'var(--archived-bg)' : 'var(--bg)' }}>
      <div className={s.scroll}>
        <div style={{ height: 58 }} />
        <div className={s.page}>
          <div className={s.topRow}>
            <div className={s.back} onClick={st.closeDetail} role="button" aria-label="Back">
              <ChevronLeft />
              <div className="ellipsis">{BACK_LABEL[d.kind]}</div>
            </div>
            <div className={s.edit} style={{ color: st.detailEdit ? 'var(--accent1)' : 'var(--text-sec)' }} onClick={st.toggleDetailEdit}>
              {st.detailEdit ? 'Done' : 'Edit'}
            </div>
          </div>
          {d.kind === 'note' && <NoteDetail id={d.id} />}
          {d.kind === 'doc' && <DocDetail id={d.id} />}
          {container && d.kind === 'project' && <ContainerDetail kind="project" item={container as Project} />}
          {container && d.kind === 'focus' && <ContainerDetail kind="focus" item={container as Focus} />}
        </div>
      </div>
      <div className={s.bar}>
        <MiniBar
          lead={<ChevronLeft />}
          leadLabel="Close"
          onLead={st.closeDetail}
          onAi={() => st.openAiChat(container ? 'About ' + displayName(st, d.kind, d.id, container.name) + ' — ' : undefined)}
          onPlus={st.openQuickAdd}
        />
      </div>
    </div>
  );
}

const BACK_LABEL = { project: 'Projects', focus: 'Focuses', note: 'Notes', doc: 'Stored documents' } as const;

/* ---------- shared header pieces ---------- */

function Hero({ visual, type, chipBg, chipFg, name, sub }: { visual: React.ReactNode; type: string; chipBg: string; chipFg: string; name: string; sub: string }) {
  const st = useApp();
  return (
    <div className={s.hero}>
      <div style={{ width: 84, height: 84, flexShrink: 0 }}>{visual}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className={s.typeChip} style={{ background: chipBg, color: chipFg }}>{type}</div>
        {st.detailEdit && st.detail?.kind !== 'note' ? (
          <input className={s.renameInput} value={st.renameDraft ?? name} onChange={e => st.setRenameDraft(e.target.value)} />
        ) : (
          <div className={s.name}>{name}</div>
        )}
        <div className={s.sub}>{sub}</div>
      </div>
    </div>
  );
}

function IconHero({ bg, children }: { bg: string; children: React.ReactNode }) {
  return <div className={s.iconHero} style={{ background: bg }}>{children}</div>;
}

function AiExcludeRow({ exKey, note }: { exKey: string; note: string }) {
  const st = useApp();
  const on = !!st.aiExcluded[exKey];
  return (
    <div className={s.settingCard} onClick={() => st.toggleAiExclude(exKey)}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>Exclude from AI access</div>
        <div style={{ fontSize: 12, color: 'var(--text-sec)', marginTop: 1, lineHeight: 1.35 }}>{note}</div>
      </div>
      <Toggle on={on} onColor="var(--accent1)" />
    </div>
  );
}

function DestroyButtons({ archiveLabel, onArchive }: { archiveLabel: string; onArchive: () => void }) {
  const showToast = useApp(st => st.showToast);
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div className={s.destroyButton} onClick={onArchive}>{archiveLabel}</div>
      <div className={s.destroyButton} style={{ color: 'var(--text-sec)' }} onClick={() => showToast('Archive instead? Archiving keeps everything.')}>Delete…</div>
    </div>
  );
}

/* ---------- project / focus ---------- */

function ContainerDetail({ kind, item }: { kind: 'project' | 'focus'; item: Project | Focus }) {
  const st = useApp();
  const isProject = kind === 'project';
  const focus = isProject ? null : (item as Focus);
  const name = displayName(st, kind, item.id, item.name);
  const accent = isProject ? 'var(--proj)' : 'var(--focus)';
  const accentSoft = isProject ? 'var(--proj-soft)' : 'var(--focus-soft)';
  const copy = detailCopy[item.id] ?? { short: 'No activity recorded yet.', long: 'No activity recorded yet.' };
  const editing = st.detailEdit;
  const isGeneral = !!focus?.builtIn;
  const order = moduleList(st, item.id);
  const enabled = order.filter(mid => !st.moduleOff[item.id + ':' + mid]);

  let visual: React.ReactNode;
  let sub: string;
  if (focus?.scored) {
    visual = <Ring pct={focus.score ?? 0} color={ringColorFor(focus.score ?? 0)} size={84} viewBox={100} r={44} stroke={9} label={focus.score} labelSize={23} />;
    sub = focus.trend === 'up' ? 'Trending up' : focus.trend === 'down' ? 'Easing off — it recovers on its own' : 'Holding steady';
  } else {
    visual = <IconHero bg={accentSoft}>{isProject ? <FolderIcon color={accent} size={34} strokeWidth={1.7} /> : <TargetIcon color={accent} size={34} strokeWidth={1.7} />}</IconHero>;
    sub = isProject
      ? (item as Project).goal || 'No goal set — tracked by feel'
      : isGeneral ? 'Built in — the default home for anything untethered' : 'Not scored — the log only builds context';
  }

  return (
    <>
      {item.archived && (
        <div className={s.archivedBanner}>
          <ArchivedBannerIcon />
          <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: 'var(--text-sec)', lineHeight: 1.4 }}>Archived — everything still works, it just lives in the Archive.</div>
          <div className={s.restore} onClick={() => { st.closeDetail(); st.restoreContainer(kind, item.id); }}>Restore</div>
        </div>
      )}

      <Hero
        visual={visual}
        type={isProject ? 'Project' : focus?.scored ? 'Scored focus' : 'Focus'}
        chipBg={accentSoft}
        chipFg={isProject ? 'var(--proj)' : 'var(--focus-fill)'}
        name={name}
        sub={sub}
      />

      {isProject && <ProjectBar project={item as Project} milestonesOn={enabled.includes('milestones')} />}

      <Card style={{ padding: '14px 16px', marginBottom: 24 }}>
        <div className={s.aiText}>{st.detailMore ? copy.long : copy.short}</div>
        <div className={s.more} onClick={st.toggleDetailMore}>{st.detailMore ? 'Less' : 'More'}</div>
      </Card>

      {editing ? (
        <EditPanel kind={kind} item={item} name={name} order={order} isGeneral={isGeneral} accent={accent} />
      ) : (
        <ModuleStack kind={kind} item={item} name={name} modules={enabled} accent={accent} accentSoft={accentSoft} />
      )}
    </>
  );
}

/** Projects use a bar, never a ring: milestones when there are any, else todo completion. */
function ProjectBar({ project, milestonesOn }: { project: Project; milestonesOn: boolean }) {
  const todos = useApp(st => st.todos).filter(t => t.project === project.id);
  const ms = milestonesMap[project.id] ?? [];
  let pct: number, caption: string, value: string, line: string;
  if (milestonesOn && ms.length) {
    const done = ms.filter(m => m.done).length;
    const next = ms.find(m => !m.done);
    pct = Math.round((done / ms.length) * 100);
    caption = 'Milestones';
    value = done + ' of ' + ms.length;
    line = next ? 'Next — ' + next.title + ' · ' + next.when : 'Every milestone is done.';
  } else {
    const done = todos.filter(t => t.done).length;
    pct = todos.length ? Math.round((done / todos.length) * 100) : 0;
    caption = 'Todos complete';
    value = todos.length ? done + ' of ' + todos.length : 'None yet';
    line = todos.length ? 'No milestones on this one — progress is read from its todos.' : 'No milestones and no todos yet, so there is nothing to measure.';
  }
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
        <div style={{ fontSize: 12.5, color: 'var(--text-sec)', fontWeight: 600 }}>{caption}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-ter)' }}>{value}</div>
      </div>
      <ProgressBar pct={pct} color="var(--proj)" height={7} />
      <div style={{ fontSize: 12.5, color: 'var(--text-ter)', marginTop: 7, lineHeight: 1.4 }}>{line}</div>
    </div>
  );
}

/** Module counts shown in edit mode. */
function moduleCount(st: AppState, mid: ModuleId, item: Project | Focus, isProject: boolean): number {
  switch (mid) {
    case 'todos': return st.todos.filter(t => (isProject ? t.project === item.id : t.owner === item.name)).length;
    case 'milestones': return (milestonesMap[item.id] ?? []).length;
    case 'notes': return st.notes.filter(n => topicsOf(st, n.id).includes(item.name)).length;
    case 'events': return weekEvents.flat().filter(e => e.linked === item.name).length;
    case 'subitems': return (st.subitems[item.id] ?? []).length;
    case 'resources': return (resourcesMap[item.id] ?? []).length;
    default: return 0;
  }
}

const labelOf = (mid: ModuleId) => moduleCatalog.find(m => m.id === mid)?.label ?? mid;

function EditPanel({ kind, item, name, order, isGeneral, accent }: {
  kind: 'project' | 'focus'; item: Project | Focus; name: string; order: ModuleId[]; isGeneral: boolean; accent: string;
}) {
  const st = useApp();
  const drag = useRef<{ mid: ModuleId; y: number } | null>(null);
  const scored = kind === 'focus' && (item as Focus).scored;
  const addable = moduleCatalog.filter(m => !order.includes(m.id));

  const onDragMove = (e: React.PointerEvent) => {
    const dg = drag.current;
    if (!dg) return;
    const dy = e.clientY - dg.y;
    // One row is ~46px tall: crossing it swaps with the neighbour.
    if (Math.abs(dy) >= 46) {
      st.moveModule(item.id, dg.mid, dy > 0 ? 1 : -1);
      dg.y = e.clientY;
    }
  };

  return (
    <>
      <Caps style={{ marginBottom: 9 }}>Modules · drag to reorder</Caps>
      <Card style={{ marginBottom: 14 }}>
        {order.map(mid => {
          const on = !st.moduleOff[item.id + ':' + mid];
          const n = moduleCount(st, mid, item, kind === 'project');
          const countLabel = mid === 'log'
            ? (scored ? 'Scored · 14 days of history' : 'Engagement only, not scored')
            : n ? n + (n === 1 ? ' item' : ' items') : 'Empty — shows an add card';
          return (
            <div key={mid} className={s.editRow} style={{ background: drag.current?.mid === mid ? 'var(--surface2)' : 'var(--surface)' }}>
              <div
                className={s.handle}
                onPointerDown={e => { drag.current = { mid, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
                onPointerMove={onDragMove}
                onPointerUp={() => { drag.current = null; }}
                onPointerCancel={() => { drag.current = null; }}
              >
                <DragHandle />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500, color: on ? 'var(--text)' : 'var(--text-ter)' }}>{labelOf(mid)}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 1 }}>{countLabel}</div>
              </div>
              <Toggle on={on} onColor={accent} onClick={() => st.toggleModule(item.id, mid)} />
            </div>
          );
        })}
        {addable.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', cursor: 'pointer' }} onClick={st.toggleAddModule}>
            <div style={{ width: 20, height: 20, borderRadius: 10, border: '1.5px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SmallPlus size={10} strokeWidth={3} />
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-sec)' }}>{st.addModuleOpen ? 'Close' : 'Add a module'}</div>
          </div>
        )}
      </Card>

      {st.addModuleOpen && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {addable.map(m => (
            <div key={m.id} className={s.addChip} onClick={() => st.addModule(item.id, m.id)}>+ {m.label}</div>
          ))}
        </div>
      )}

      <AiExcludeRow exKey={kind + ':' + item.id} note={'Overrides the ' + (kind === 'project' ? 'Projects' : 'Focuses') + ' permission for this item only'} />

      {isGeneral ? (
        <div style={{ background: 'var(--surface2)', borderRadius: 16, padding: '13px 15px', fontSize: 12.5, color: 'var(--text-sec)', lineHeight: 1.45 }}>
          General is built in — it can be renamed and rearranged, but not archived or deleted.
        </div>
      ) : (
        <DestroyButtons
          archiveLabel={item.archived ? 'Already archived' : 'Archive this'}
          onArchive={() => {
            if (item.archived) { st.showToast(name + ' is already in the Archive'); return; }
            st.closeDetail();
            st.archiveContainer(kind, item.id);
          }}
        />
      )}
    </>
  );
}

/* ---------- note ---------- */

function NoteDetail({ id }: { id: string }) {
  const st = useApp();
  const note = st.notes.find(n => n.id === id);
  if (!note) return null;
  const topics = topicsOf(st, id);
  const editing = st.detailEdit;
  const known = [...st.focuses.filter(f => !f.archived).map(f => f.name), ...st.projects.filter(p => !p.archived).map(p => p.name)];
  const backlinks = noteBacklinksMap[id] ?? [];
  const attachments = noteAttachmentsMap[id] ?? [];

  return (
    <>
      <Hero
        visual={<IconHero bg="var(--surface2)"><DocIcon color="var(--text-sec)" size={32} strokeWidth={1.7} /></IconHero>}
        type="Note" chipBg="var(--surface2)" chipFg="var(--text-sec)"
        name={note.text.split(/[.—]/)[0].slice(0, 34).trim()}
        sub={note.when + ' · ' + topics.length + (topics.length === 1 ? ' link' : ' links')}
      />

      {editing && (
        <div style={{ marginBottom: 22 }}>
          <AiExcludeRow exKey={'note:' + id} note="Keeps this note out of the knowledge base the assistant reads." />
          <DestroyButtons archiveLabel="Archive note" onArchive={() => { st.closeDetail(); st.archiveNote(id); }} />
        </div>
      )}

      <Card style={{ padding: 16, marginBottom: 22 }}>
        <div style={{ fontSize: 15, lineHeight: 1.55, textWrap: 'pretty' }}>{note.text}</div>
      </Card>

      <SectionHeader title="Linked to" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {topics.map(t => {
          const proj = isProjectName(t, st.projects);
          const fg = proj ? 'var(--proj)' : 'var(--focus)';
          return (
            <div
              key={t}
              className={s.linkChip}
              style={{ background: proj ? 'var(--proj-soft)' : 'var(--focus-soft)', color: fg, cursor: editing ? 'pointer' : 'default' }}
              onClick={() => { if (editing) st.removeNoteLink(id, t); }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 3, background: fg }} />
              <div>{t}</div>
              {editing && <Cross color={fg} />}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginBottom: 22, lineHeight: 1.4 }}>
        {editing ? 'Tap a link to remove it, or re-file below.' : 'Links are set in edit mode.'}
      </div>

      {editing && (
        <>
          <SectionHeader title="Re-file to" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {known.filter(k => !topics.includes(k)).slice(0, 6).map(k => (
              <div key={k} className={s.addChip} onClick={() => st.addNoteLink(id, k)}>+ {k}</div>
            ))}
          </div>
        </>
      )}

      {backlinks.length > 0 && (
        <>
          <SectionHeader title="Also references this" />
          <Card style={{ marginBottom: 22 }}>
            {backlinks.map(b => (
              <div key={b.label} className={s.listRow}>
                <div style={{ width: 7, height: 7, borderRadius: 4, flexShrink: 0, background: b.meta === 'Project' ? 'var(--proj)' : b.meta === 'Focus' ? 'var(--focus)' : 'var(--accent2)' }} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 14 }}>{b.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', flexShrink: 0 }}>{b.meta}</div>
              </div>
            ))}
          </Card>
        </>
      )}

      {attachments.length > 0 && (
        <>
          <SectionHeader title="Attachments" />
          <Card>
            {attachments.map(a => (
              <div key={a.title} className={s.listRow}>
                <div className={s.fileIcon}><DocIcon color="var(--text-sec)" size={13} lines={false} /></div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-ter)', flexShrink: 0 }}>{a.meta}</div>
              </div>
            ))}
          </Card>
        </>
      )}

    </>
  );
}

/* ---------- stored AI document ---------- */

function DocDetail({ id }: { id: string }) {
  const st = useApp();
  const doc = st.docs.find(x => x.id === id);
  if (!doc) return null;
  const draft = st.docDrafts[id];
  return (
    <>
      <Hero
        visual={<IconHero bg="var(--accent2-soft)"><DocStar color="var(--accent2)" /></IconHero>}
        type={doc.kind} chipBg="var(--surface2)" chipFg="var(--text-sec)"
        name={displayName(st, 'doc', id, doc.title)}
        sub={doc.meta}
      />
      {st.detailEdit && (
        <div style={{ marginBottom: 22 }}>
          <AiExcludeRow exKey={'doc:' + id} note="Stops the assistant revising this document any further." />
          <DestroyButtons archiveLabel="Archive document" onArchive={() => { st.closeDetail(); st.archiveDoc(id); }} />
        </div>
      )}
      <>
          <div className={s.docBanner}>
            <Sparkle size={14} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, lineHeight: 1.4 }}>
              {draft !== undefined ? 'You have edited this. The assistant will revise around your changes.' : 'Written by the assistant, kept up to date after each planning session.'}
            </div>
          </div>
          <SectionHeader title="Your copy" />
          <textarea className={s.docText} value={draft ?? docBodies[id] ?? ''} onChange={e => st.setDocDraft(id, e.target.value)} />
          <div style={{ fontSize: 11.5, color: 'var(--text-ter)', marginTop: 9, lineHeight: 1.45 }}>Edit it directly — the assistant revises around your changes rather than overwriting them.</div>
      </>
    </>
  );
}

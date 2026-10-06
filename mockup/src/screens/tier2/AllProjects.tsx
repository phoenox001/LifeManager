import { useApp } from '../../store/appStore';
import { dueLabel } from '../../domain/logic';
import { openTodosOf } from '../../domain/selectors';
import type { Project, ProjectStatus } from '../../domain/types';
import { ChevronRight } from '../../components/icons';
import {
  BackLink, Card, CheckCircle, CollapseHeader, Empty, GroupHeader, MetaRowCard, Overlay, ProgressBar, RowCardHead,
  RowSection, SearchField, SearchTitleRow, Stack, z,
} from '../../components/ui';
import t2 from './tier2.module.css';

const STATUS_LABEL: Record<ProjectStatus, string> = { active: 'Active', paused: 'Paused', completed: 'Completed' };

export function AllProjects() {
  const st = useApp();
  if (st.seeAll !== 'projects') return null;

  const q = st.search.query.trim().toLowerCase();
  const hit = (s: string) => !q || s.toLowerCase().includes(q);
  const name = (p: Project) => st.nameOverrides['project:' + p.id] || p.name;
  const live = st.projects.filter(p => !p.archived && hit(name(p)));
  const archived = st.projects.filter(p => p.archived && hit(name(p)));
  // Status is a hard first sort; inside each block the seed order is newest activity first.
  const blocks = (['active', 'paused', 'completed'] as const)
    .map(status => ({ status, rows: live.filter(p => p.status === status) }))
    .filter(b => b.rows.length > 0);

  return (
    <Overlay zIndex={z.seeAll}>
      <BackLink label="Projects" onClick={st.closeSeeAll} style={{ marginBottom: 14 }} />
      <SearchTitleRow title="All Projects" />
      <div className={t2.intro}>Grouped by status, newest activity first. Tap a title to open it, “…” to manage.</div>
      <SearchField placeholder="Search projects" />

      {blocks.map(b => (
        <div key={b.status}>
          <GroupHeader label={STATUS_LABEL[b.status]} count={b.rows.length} color={b.status === 'active' ? 'var(--text)' : 'var(--text-ter)'} />
          <Stack>{b.rows.map(p => <ProjectCard key={p.id} project={p} name={name(p)} />)}</Stack>
        </div>
      ))}

      {blocks.length === 0 && archived.length === 0 && <Empty>Nothing matches that search.</Empty>}

      {archived.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <CollapseHeader label="Archived" count={archived.length} open={st.showArchived} onToggle={st.toggleArchived} />
          {st.showArchived && (
            <Stack style={{ marginTop: 8 }}>
              {archived.map(p => (
                <MetaRowCard
                  key={p.id}
                  name={name(p)}
                  meta={'Completed · archived ' + (p.archivedOn ?? p.lastWhen)}
                  dotColor="var(--text-ter)"
                  onOpen={() => st.openDetail('project', p.id)}
                  onMore={() => st.openRowSheet({ kind: 'archived', id: p.id, name: name(p) })}
                />
              ))}
              <div className={t2.fullArchive} onClick={st.openFullArchive}>
                <div>Open the full Archive</div>
                <ChevronRight size={11} />
              </div>
            </Stack>
          )}
        </div>
      )}
    </Overlay>
  );
}

/** Three sections: header · completion info with bar · next todos (or last interaction). */
function ProjectCard({ project: p, name }: { project: Project; name: string }) {
  const st = useApp();
  const active = p.status === 'active';
  const open = openTodosOf(p.id, st.todos);
  const items = active ? open.slice(0, 3) : [];
  const statusLine = active
    ? 'Active · ' + open.length + (open.length === 1 ? ' open todo · moved ' : ' open todos · moved ') + p.touched
    : p.status === 'paused' ? 'Paused · last moved ' + p.touched : 'Completed · ' + p.touched;
  const caption = p.status === 'paused' ? 'On hold' : p.status === 'completed' ? 'Wrapped up' : 'Last interaction';

  return (
    <Card style={{ opacity: active ? 1 : 0.8 }}>
      <RowCardHead name={name} dotColor="var(--proj)" onOpen={() => st.openDetail('project', p.id)} onMore={() => st.openRowSheet({ kind: 'project', id: p.id, name })} />
      <RowSection style={{ padding: '11px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className={t2.score} style={{ color: 'var(--proj)' }}>{p.progress}%</div>
          <div className={t2.status}>{statusLine}</div>
        </div>
        <ProgressBar pct={p.progress} color="var(--proj)" height={4} style={{ marginTop: 9 }} />
      </RowSection>
      {items.length > 0 ? (
        <RowSection style={{ padding: '8px 16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '6px 0', cursor: 'pointer' }} onClick={() => st.toggleTodo(t.id)}>
              <CheckCircle done={false} size={19} />
              <div className="ellipsis" style={{ flex: 1, minWidth: 0, fontSize: 13 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-ter)', flexShrink: 0 }}>{dueLabel(t)}</div>
            </div>
          ))}
        </RowSection>
      ) : (
        <RowSection style={{ padding: '11px 16px 13px' }}>
          <div className={t2.contentCaption}>{caption}</div>
          <div className={t2.contentText}>{p.last + ' · ' + p.lastWhen}</div>
        </RowSection>
      )}
    </Card>
  );
}

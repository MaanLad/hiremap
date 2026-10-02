import { ExternalLink, GitFork, Star, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const REPOSITORY = 'MaanLad/hiremap';
const REPOSITORY_URL = `https://github.com/${REPOSITORY}`;
const API_URL = `https://api.github.com/repos/${REPOSITORY}`;
const CONTRIBUTORS_URL = `${API_URL}/contributors?per_page=3`;
const ALL_CONTRIBUTORS_URL = `${REPOSITORY_URL}/graphs/contributors`;

const initialStats = {
  contributors: null,
  stars: null,
  forks: null,
  topContributors: [],
};

function getContributorCount(response, contributors) {
  const link = response.headers.get('Link');
  const lastPage = link?.match(/[?&]page=(\d+)>; rel="last"/)?.[1];

  return lastPage ? Number(lastPage) : contributors.length;
}

function formatCount(value) {
  return value === null ? '—' : value.toLocaleString();
}

export function SocialPanel() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!open || status !== 'idle') return undefined;

    let cancelled = false;

    Promise.all([
      fetch(API_URL).then((response) => {
        if (!response.ok) throw new Error('Repository details could not be loaded.');
        return response.json();
      }),
      fetch(CONTRIBUTORS_URL).then((response) => {
        if (!response.ok) throw new Error('Contributor details could not be loaded.');
        return response.json().then((topContributors) => [
          getContributorCount(response, topContributors),
          topContributors,
        ]);
      }),
    ])
      .then(([repository, [contributors, topContributors]]) => {
        if (cancelled) return;
        setStats({
          contributors,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          topContributors,
        });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [open, status]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Close community panel' : 'Open community panel'}
        title="GitHub community"
        className="inline-flex h-9 w-9 items-center justify-center rounded-node
                   border border-border bg-surface-1 text-ink-muted transition-colors
                   hover:border-route-border hover:text-route"
      >
        {open ? <X size={16} /> : <GithubIcon size={17} />}
      </button>

      <div
        aria-hidden={!open}
        className={`absolute right-0 top-11 w-72 origin-top-right overflow-hidden rounded-panel
                    border border-border bg-surface-1 shadow-panel dark:shadow-panel-dark
                    ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          maxHeight: open ? '28rem' : '0px',
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-8px)',
          transition: 'max-height 180ms ease, opacity 180ms ease, transform 180ms ease',
        }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-node bg-surface-2 p-2 text-ink">
              <GithubIcon size={19} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-ink">Build the map together</div>
              <p className="mt-1 text-xs leading-5 text-ink-muted">
                Share hiring paths, improve the experience, or help newcomers find their next step.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat icon={<Users size={13} />} label="Contributors" value={formatCount(stats.contributors)} />
            <Stat icon={<Star size={13} />} label="Stars" value={formatCount(stats.stars)} />
            <Stat icon={<GitFork size={13} />} label="Forks" value={formatCount(stats.forks)} />
          </div>

          {open && status === 'idle' && (
            <p className="mt-3 text-xs text-ink-faint">Loading GitHub community data…</p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-xs text-ink-faint">
              GitHub stats are unavailable right now. The repository links still work.
            </p>
          )}

          {stats.topContributors.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-xs font-medium text-ink">People building HireMap</div>
              <div className="space-y-1.5">
                {stats.topContributors.map((contributor, index) => (
                  <ContributorRow
                    key={contributor.id ?? contributor.login}
                    contributor={contributor}
                    rank={index + 1}
                  />
                ))}
              </div>
              <a
                href={ALL_CONTRIBUTORS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-route hover:text-route-hover"
              >
                View all contributors
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-node
                         bg-route px-3 py-2 text-xs font-medium text-white transition-colors
                         hover:bg-route-hover"
            >
              View on GitHub
              <ExternalLink size={13} />
            </a>
            <a
              href={`${REPOSITORY_URL}/issues/new`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-node border border-border
                         px-3 py-2 text-xs font-medium text-ink-muted transition-colors
                         hover:border-route-border hover:text-route"
            >
              Contribute
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-node bg-surface-2 px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-ink-faint">{icon}</div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
      <div className="text-[10px] text-ink-faint">{label}</div>
    </div>
  );
}

function ContributorRow({ contributor, rank }) {
  const profileUrl = contributor.html_url ?? `https://github.com/${contributor.login}`;
  const name = contributor.login ?? 'GitHub contributor';

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-node px-2 py-1.5 transition-colors hover:bg-surface-2"
    >
      <span className="w-3 text-center text-xs font-medium text-ink-faint">{rank}</span>
      <img
        src={contributor.avatar_url}
        alt=""
        width="28"
        height="28"
        className="h-7 w-7 rounded-full bg-surface-2"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-ink">{name}</span>
        <span className="block text-[10px] text-ink-faint">
          GitHub · {contributor.contributions.toLocaleString()} contributions
        </span>
      </span>
      <ExternalLink size={12} className="shrink-0 text-ink-faint" />
    </a>
  );
}

function GithubIcon({ size = 16 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.76.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

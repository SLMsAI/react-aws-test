const steps = [
  {
    title: '1) Install & run locally',
    detail: 'npm install && npm run dev — make sure the app works before you connect Amplify.'
  },
  {
    title: '2) Push to Git',
    detail: 'Commit your code and push to GitHub/GitLab/CodeCommit; Amplify will watch your repo.'
  },
  {
    title: '3) Connect in Amplify',
    detail: 'In the Amplify console choose “Host web app”, select your repo/branch, and accept the default build settings.'
  },
  {
    title: '4) Ship',
    detail: 'Amplify will provision hosting, run `npm ci && npm run build`, and deploy the static site from `dist/`.'
  }
];

const quickChecks = [
  'npm run build completes locally',
  'dist/ outputs your static bundle',
  'Environment variables are set in Amplify → App settings → Environment variables',
  'Custom domain added in Amplify if you need one'
];

function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">AWS Amplify · React</p>
        <h1>Launch a React app in minutes (This is a test)</h1>
        <p className="lede">
          Minimal Vite + React starter ready for AWS Amplify static hosting. Edit the copy, push to your
          repo, and Amplify will build and deploy automatically.
        </p>
        <div className="cta-row">
          <a className="button primary" href="#getting-started">View local steps</a>
          <a
            className="button ghost"
            href="https://console.aws.amazon.com/amplify/home"
            target="_blank"
            rel="noreferrer"
          >
            Open Amplify Console
          </a>
        </div>
        <div className="meta">
          <div className="pill">Build: npm run build</div>
          <div className="pill">Output: dist/</div>
          <div className="pill">Framework: Vite + React 18</div>
        </div>
      </header>

      <main className="content">
        <section id="getting-started" className="panel">
          <div className="panel-header">
            <p className="eyebrow">Workflow</p>
            <h2>Deploy flow</h2>
            <p className="muted">Follow these steps to connect the repo and trigger the first build.</p>
          </div>
          <div className="grid">
            {steps.map((step) => (
              <article className="card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Local commands</p>
            <h2>Quick start</h2>
            <p className="muted">Run these locally before wiring Amplify.</p>
          </div>
          <div className="command-block">
            <code>npm install</code>
            <code>npm run dev</code>
            <code>npm run build</code>
          </div>
          <p className="muted small">Need a package manager swap? Replace npm with pnpm or yarn in Amplify’s build settings.</p>
        </section>

        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Pre-flight</p>
            <h2>Amplify checklist</h2>
          </div>
          <ul className="checklist">
            {quickChecks.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-header">
            <p className="eyebrow">Next</p>
            <h2>Customize</h2>
          </div>
          <p className="muted">
            Replace the text, add routes, or wire APIs. Amplify rebuilds on every commit so you can iterate quickly.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;

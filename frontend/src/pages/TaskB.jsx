import "./TaskB.css";

const risks = [
  {
    priority: "Critical",
    issue: "Secrets stored in the repository",
    action:
      "Remove exposed secrets immediately, rotate all credentials, and move them to environment variables or a secure secret manager.",
    risk:
      "Attackers may gain access to the database, customer information, cloud services, or production systems.",
  },
  {
    priority: "Critical",
    issue: "Frontend makes direct database calls",
    action:
      "Introduce a secure backend API and prevent the frontend from connecting directly to the database.",
    risk:
      "Users may bypass validation, access unauthorised records, modify sensitive data, or expose database credentials.",
  },
  {
    priority: "High",
    issue: "No automated tests",
    action:
      "Add tests around authentication, permissions, payment or customer-critical flows, and the most frequently used features.",
    risk:
      "Changes can introduce production bugs without being detected before deployment.",
  },
  {
    priority: "High",
    issue: "Business logic inside route handlers",
    action:
      "Move business rules into service classes and keep route handlers responsible only for request and response handling.",
    risk:
      "Code becomes difficult to test, reuse, maintain, and safely modify.",
  },
  {
    priority: "High",
    issue: "Insufficient authentication and authorisation controls",
    action:
      "Audit every endpoint, introduce role-based access control, and validate permissions on the server.",
    risk:
      "Users may access or modify data that does not belong to them.",
  },
  {
    priority: "High",
    issue: "No reliable backup and recovery process",
    action:
      "Verify automated backups, practise restoring data, and document recovery procedures.",
    risk:
      "A database failure or accidental deletion may cause permanent customer data loss.",
  },
  {
    priority: "Medium",
    issue: "Weak logging and monitoring",
    action:
      "Add structured logs, error tracking, health checks, uptime monitoring, and alerts.",
    risk:
      "Production problems may remain unnoticed or take too long to diagnose.",
  },
  {
    priority: "Medium",
    issue: "No controlled deployment process",
    action:
      "Introduce CI/CD checks, staging deployment, rollback procedures, and small production releases.",
    risk:
      "A failed deployment may cause downtime or make recovery slow and risky.",
  },
  {
    priority: "Medium",
    issue: "No input validation or consistent error handling",
    action:
      "Add server-side validation, sanitisation, standard error responses, and safe exception handling.",
    risk:
      "Invalid or malicious input may corrupt data or expose internal system details.",
  },
  {
    priority: "Low",
    issue: "Inconsistent code structure and documentation",
    action:
      "Introduce coding conventions, architecture documentation, and clear ownership of important modules.",
    risk:
      "New developers take longer to understand the system and changes become less predictable.",
  },
];

const badCode = `app.post("/api/leads", async (req, res) => {
  const { name, email, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const db = await mysql.createConnection({
    host: "production-db.company.com",
    user: "admin",
    password: "admin123",
    database: "customers"
  });

  const existing = await db.query(
    "SELECT * FROM leads WHERE email = '" + email + "'"
  );

  if (existing[0].length > 0) {
    return res.status(409).json({
      message: "Lead already exists"
    });
  }

  await db.query(
    "INSERT INTO leads (name, email, status) VALUES (?, ?, ?)",
    [name, email, status || "NEW"]
  );

  await sendWelcomeEmail(email);

  return res.status(201).json({
    message: "Lead created successfully"
  });
});`;

const improvedCode = `// lead.routes.js
router.post(
  "/leads",
  authenticate,
  validate(createLeadSchema),
  leadController.createLead
);

// lead.controller.js
export async function createLead(req, res, next) {
  try {
    const lead = await leadService.createLead(
      req.body,
      req.user
    );

    return res.status(201).json({
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

// lead.service.js
export async function createLead(input, currentUser) {
  const existingLead =
    await leadRepository.findByEmail(input.email);

  if (existingLead) {
    throw new ConflictError("Lead already exists");
  }

  const lead = await leadRepository.create({
    ...input,
    status: input.status ?? "NEW",
    createdBy: currentUser.id
  });

  await eventPublisher.publish("lead.created", {
    leadId: lead.id,
    email: lead.email
  });

  return lead;
}

// lead.repository.js
export async function findByEmail(email) {
  return database.lead.findUnique({
    where: { email }
  });
}`;

function TaskB() {
  return (
    <div className="taskb-page">
      <section className="taskb-hero">
        <p className="taskb-label">Technical Improvement Proposal</p>

        <h1>Task B – Inherit and Improve</h1>

        <p className="taskb-intro">
          This proposal explains how I would improve a working but poorly
          structured production codebase without introducing a risky big-bang
          rewrite or causing downtime for existing customers.
        </p>
      </section>

      <section className="taskb-section">
        <div className="section-heading">
          <span>Part A</span>
          <h2>Assessment and Prioritisation</h2>
        </div>

        <p>
          The first objective is not to redesign the entire application. The
          immediate objective is to reduce the highest business and security
          risks while keeping the system available to customers.
        </p>

        <p>
          I would begin by creating a production safety baseline: protect
          credentials, secure data access, confirm backups, improve visibility,
          and place tests around the most critical customer journeys. Only
          after these protections are in place would I gradually improve the
          internal architecture.
        </p>
      </section>

      <section className="taskb-section">
        <div className="section-heading">
          <span>Risk Matrix</span>
          <h2>What I Would Fix and in What Order</h2>
        </div>

        <div className="risk-table-wrapper">
          <table className="risk-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Problem</th>
                <th>Recommended action</th>
                <th>Risk if left unresolved</th>
              </tr>
            </thead>

            <tbody>
              {risks.map((item) => (
                <tr key={item.issue}>
                  <td>
                    <span
                      className={`priority-badge ${item.priority.toLowerCase()}`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td>{item.issue}</td>
                  <td>{item.action}</td>
                  <td>{item.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="taskb-section">
        <div className="section-heading">
          <span>Initial Approach</span>
          <h2>First Actions Before Refactoring</h2>
        </div>

        <div className="assessment-grid">
          <article className="assessment-card">
            <h3>1. Stabilise production</h3>
            <p>
              Confirm that backups work, document the current deployment
              process, add health checks, and establish a tested rollback
              procedure.
            </p>
          </article>

          <article className="assessment-card">
            <h3>2. Contain security risks</h3>
            <p>
              Rotate exposed credentials, remove secrets from Git history,
              restrict database access, and audit authentication and
              authorisation.
            </p>
          </article>

          <article className="assessment-card">
            <h3>3. Protect critical flows</h3>
            <p>
              Add automated tests around login, customer data access, record
              creation, updates, and any transaction that affects customer
              accounts.
            </p>
          </article>

          <article className="assessment-card">
            <h3>4. Create architectural boundaries</h3>
            <p>
              Move database access and business logic behind service and
              repository layers without replacing the entire application.
            </p>
          </article>

          <article className="assessment-card">
            <h3>5. Improve visibility</h3>
            <p>
              Introduce structured logs, centralised error tracking, production
              alerts, and dashboards for application health.
            </p>
          </article>

          <article className="assessment-card">
            <h3>6. Refactor incrementally</h3>
            <p>
              Improve one module at a time behind stable interfaces, verify it
              with tests, release it gradually, and monitor the result.
            </p>
          </article>
        </div>
      </section>

      <section className="taskb-section taskb-summary">
        <div className="section-heading">
          <span>Decision Principle</span>
          <h2>How Priorities Are Chosen</h2>
        </div>

        <p>
          Priority is based on customer impact, security exposure, likelihood
          of failure, recovery difficulty, and how safely the fix can be
          introduced. Security incidents and permanent data loss are treated
          as more urgent than code cleanliness because they can cause immediate
          business damage.
        </p>

        <p>
          Every improvement should be small, reversible, observable, and
          protected by tests. This allows the team to modernise the system
          without stopping normal feature delivery.
        </p>
      </section>

      <section className="taskb-section">
        <div className="section-heading">
          <span>Part B</span>
          <h2>Phased Migration Plan</h2>
        </div>

        <p>
          Since the application already serves real customers, replacing the
          entire system at once would introduce unnecessary business risk.
          Instead, improvements should be delivered incrementally while the
          existing system remains operational.
        </p>

        <div className="timeline">
          <div className="timeline-card">
            <h3>Week 1 – Stabilise Production</h3>

            <ul>
              <li>
                Remove secrets from the repository and rotate all exposed
                credentials.
              </li>
              <li>Move configuration into environment variables.</li>
              <li>Verify automated database backups and restore procedures.</li>
              <li>Add application logging, monitoring and error tracking.</li>
              <li>Create health-check endpoints.</li>
              <li>
                Add automated tests for authentication and critical customer
                flows.
              </li>
              <li>Document deployment and rollback procedures.</li>
            </ul>

            <p className="timeline-result">
              <strong>Outcome:</strong> Production becomes more secure,
              observable and recoverable without changing existing customer
              functionality.
            </p>
          </div>

          <div className="timeline-card">
            <h3>Month 1 – Improve Architecture</h3>

            <ul>
              <li>Move business logic into service classes.</li>
              <li>Introduce repository and service layers.</li>
              <li>
                Replace direct frontend database access with secure REST APIs.
              </li>
              <li>Improve input validation and exception handling.</li>
              <li>Increase automated unit and integration test coverage.</li>
              <li>Introduce CI/CD checks and a staging environment.</li>
              <li>Begin refactoring one customer-facing module at a time.</li>
            </ul>

            <p className="timeline-result">
              <strong>Outcome:</strong> The application becomes easier and
              safer to maintain while customers continue using the existing
              system.
            </p>
          </div>

          <div className="timeline-card">
            <h3>Quarter 1 – Modernise the Platform</h3>

            <ul>
              <li>Complete migration towards a layered architecture.</li>
              <li>Add caching only where measurements show it is useful.</li>
              <li>Improve database indexing and query performance.</li>
              <li>
                Add comprehensive integration and end-to-end test coverage.
              </li>
              <li>Introduce API versioning for future compatibility.</li>
              <li>
                Improve scalability with containerisation and managed cloud
                services where appropriate.
              </li>
              <li>
                Establish production service-level indicators and reliability
                reviews.
              </li>
            </ul>

            <p className="timeline-result">
              <strong>Outcome:</strong> A secure, scalable and maintainable
              platform delivered through gradual releases with minimal customer
              disruption.
            </p>
          </div>
        </div>
      </section>

      <section className="taskb-section">
        <div className="section-heading">
          <span>Part C</span>
          <h2>Before and After Refactor</h2>
        </div>

        <p>
          The example below represents a common legacy route handler. It mixes
          HTTP handling, validation, database access, business rules,
          credentials and external side effects in one function.
        </p>

        <div className="refactor-grid">
          <article className="code-card code-card-bad">
            <div className="code-card-header">
              <span className="code-status bad-status">Before</span>
              <h3>Poorly structured route handler</h3>
            </div>

            <pre>
              <code>{badCode}</code>
            </pre>
          </article>

          <article className="code-card code-card-good">
            <div className="code-card-header">
              <span className="code-status good-status">After</span>
              <h3>Layered and testable implementation</h3>
            </div>

            <pre>
              <code>{improvedCode}</code>
            </pre>
          </article>
        </div>
      </section>

      <section className="taskb-section">
        <div className="section-heading">
          <span>Refactor Commentary</span>
          <h2>What Improved</h2>
        </div>

        <div className="improvement-grid">
          <article className="improvement-card">
            <h3>Separation of concerns</h3>
            <p>
              The route only defines middleware and delegates the request. The
              controller handles HTTP concerns, the service owns business rules
              and the repository owns database access.
            </p>
          </article>

          <article className="improvement-card">
            <h3>Improved security</h3>
            <p>
              Database credentials are no longer hard-coded. Input is validated
              before entering the service, and database access no longer uses
              unsafe SQL string concatenation.
            </p>
          </article>

          <article className="improvement-card">
            <h3>Better testability</h3>
            <p>
              The lead service can be unit-tested by replacing the repository
              and event publisher with test doubles. Tests no longer require a
              real HTTP server or production database.
            </p>
          </article>

          <article className="improvement-card">
            <h3>Consistent error handling</h3>
            <p>
              Domain errors such as duplicate leads are represented by typed
              errors and handled by central error middleware instead of
              returning inconsistent responses throughout the application.
            </p>
          </article>

          <article className="improvement-card">
            <h3>Reliable side effects</h3>
            <p>
              Email delivery is triggered through an event rather than blocking
              the request. In production, the event can be processed by a queue
              with retry and failure handling.
            </p>
          </article>

          <article className="improvement-card">
            <h3>Safer incremental migration</h3>
            <p>
              The existing endpoint and response contract can remain available
              while the internal implementation is replaced one layer at a
              time. This avoids a big-bang rewrite.
            </p>
          </article>
        </div>
      </section>

      <section className="taskb-section taskb-summary">
        <div className="section-heading">
          <span>Refactor Safety</span>
          <h2>How This Would Ship Without Downtime</h2>
        </div>

        <p>
          Before changing the implementation, I would add characterisation
          tests that capture the current endpoint behaviour. The refactored
          service would then be introduced behind the existing route,
          preserving the public API contract.
        </p>

        <p>
          The change would be released to a staging environment, verified with
          automated integration tests and deployed as a small reversible
          release. Logs, error rates and response times would be monitored
          after deployment. If problems appeared, the team could immediately
          roll back to the previous version.
        </p>
      </section>

      <section className="taskb-section">
  <div className="section-heading">
    <span>Part D</span>
    <h2>Engineering Standards Proposal</h2>
  </div>

  <p>
    The goal of engineering standards is not to create unnecessary process.
    The goal is to make changes safer, easier to review, easier to maintain and
    less likely to cause customer-facing incidents.
  </p>

  <div className="standards-grid">
    <article className="standard-card">
      <h3>1. Code structure</h3>
      <ul>
        <li>Keep route handlers thin and move business logic into services.</li>
        <li>Place database access behind repository interfaces.</li>
        <li>Use consistent naming, folder structure and module boundaries.</li>
        <li>Avoid duplicated logic by extracting reusable components.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>2. Testing</h3>
      <ul>
        <li>Require tests for new business logic and bug fixes.</li>
        <li>Protect authentication, authorisation and critical customer flows.</li>
        <li>Use unit tests for services and integration tests for APIs.</li>
        <li>Run tests automatically on every pull request.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>3. Security</h3>
      <ul>
        <li>Never commit secrets, passwords or production credentials.</li>
        <li>Use environment variables or a managed secret store.</li>
        <li>Validate all input on the server.</li>
        <li>Apply least-privilege access to databases and cloud services.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>4. API design</h3>
      <ul>
        <li>Use consistent status codes and response formats.</li>
        <li>Document public endpoints and expected error responses.</li>
        <li>Use API versioning when breaking changes are unavoidable.</li>
        <li>Preserve backward compatibility during migrations.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>5. Pull requests and reviews</h3>
      <ul>
        <li>Keep pull requests small and focused.</li>
        <li>Require at least one reviewer for production changes.</li>
        <li>Include testing evidence and rollback notes.</li>
        <li>Use automated formatting, linting and security checks.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>6. Deployment and reliability</h3>
      <ul>
        <li>Use staging before production deployment.</li>
        <li>Prefer small, reversible releases.</li>
        <li>Maintain documented rollback procedures.</li>
        <li>Monitor errors, latency, uptime and failed jobs.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>7. Documentation</h3>
      <ul>
        <li>Maintain setup instructions and architecture documentation.</li>
        <li>Record important technical decisions.</li>
        <li>Document ownership of critical services.</li>
        <li>Keep runbooks for common production incidents.</li>
      </ul>
    </article>

    <article className="standard-card">
      <h3>8. Database changes</h3>
      <ul>
        <li>Use version-controlled database migrations.</li>
        <li>Make schema changes backward compatible.</li>
        <li>Avoid destructive changes in the same release as application changes.</li>
        <li>Verify backups before high-risk migrations.</li>
      </ul>
    </article>
  </div>
</section>

<section className="taskb-section">
  <div className="section-heading">
    <span>Team Adoption</span>
    <h2>How I Would Work With a Resistant Team</h2>
  </div>

  <p>
    A team may resist new standards if they believe the changes will slow down
    delivery or create extra approval steps. I would therefore introduce the
    standards gradually and connect them directly to problems the team already
    experiences, such as production bugs, difficult deployments and repeated
    rework.
  </p>

  <div className="adoption-steps">
    <article className="adoption-card">
      <span>01</span>
      <div>
        <h3>Start with listening</h3>
        <p>
          Speak with developers, support staff and product owners to understand
          the current pain points before proposing process changes.
        </p>
      </div>
    </article>

    <article className="adoption-card">
      <span>02</span>
      <div>
        <h3>Begin with a small pilot</h3>
        <p>
          Apply the new structure, tests and review checklist to one active
          module rather than forcing a company-wide change immediately.
        </p>
      </div>
    </article>

    <article className="adoption-card">
      <span>03</span>
      <div>
        <h3>Remove manual effort</h3>
        <p>
          Automate formatting, linting, tests and security scanning so the
          standards are easy to follow and do not rely on memory.
        </p>
      </div>
    </article>

    <article className="adoption-card">
      <span>04</span>
      <div>
        <h3>Show measurable results</h3>
        <p>
          Track deployment failures, escaped defects, review time and recovery
          time to demonstrate whether the changes are improving delivery.
        </p>
      </div>
    </article>

    <article className="adoption-card">
      <span>05</span>
      <div>
        <h3>Use coaching instead of punishment</h3>
        <p>
          Pair with team members, provide examples and improve documentation
          rather than using standards as a reason to blame individuals.
        </p>
      </div>
    </article>

    <article className="adoption-card">
      <span>06</span>
      <div>
        <h3>Review and adjust</h3>
        <p>
          Revisit the standards regularly and remove any rule that adds effort
          without producing a clear improvement in quality or reliability.
        </p>
      </div>
    </article>
  </div>
</section>

<section className="taskb-section taskb-summary">
  <div className="section-heading">
    <span>Adoption Principle</span>
    <h2>Standards Should Enable Delivery</h2>
  </div>

  <p>
    I would not introduce every rule on the first day. The initial mandatory
    standards would focus on secrets, production safety, authentication,
    critical tests and controlled deployments. Broader architecture and
    documentation standards would be introduced as the team gains confidence.
  </p>

  <p>
    The best evidence for adoption is improved delivery: fewer production
    failures, faster code reviews, safer releases and less time spent fixing
    avoidable defects.
  </p>
</section>
    </div>
  );
}

export default TaskB;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  Eye,
  PhoneCall,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import axios from "../api/axios";
import "../styles/dashboard.css";

const initialSummary = {
  totalLeads: 0,
  newLeads: 0,
  contactedLeads: 0,
  qualifiedLeads: 0,
  wonLeads: 0,
  lostLeads: 0,
  conversionRate: 0,
};

const chartColours = [
  "#2563eb",
  "#f59e0b",
  "#7c3aed",
  "#16a34a",
  "#dc2626",
];

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(initialSummary);
  const [recentLeads, setRecentLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recentLeadsLoading, setRecentLeadsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setError("");

    await Promise.allSettled([
      loadSummary(),
      loadRecentLeads(),
    ]);
  };

  const loadSummary = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/dashboard/summary");
      const data = response.data || {};

      setSummary({
        totalLeads: data.totalLeads ?? 0,
        newLeads: data.newLeads ?? 0,
        contactedLeads: data.contactedLeads ?? 0,
        qualifiedLeads: data.qualifiedLeads ?? 0,
        wonLeads: data.wonLeads ?? 0,
        lostLeads: data.lostLeads ?? 0,
        conversionRate: data.conversionRate ?? 0,
      });
    } catch (err) {
      console.error("Unable to load dashboard summary:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load dashboard summary."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadRecentLeads = async () => {
    try {
      setRecentLeadsLoading(true);

      const response = await axios.get("/leads", {
        params: {
          page: 0,
          size: 5,
        },
      });

      const responseData = response.data;

      let leads = [];

      if (Array.isArray(responseData)) {
        leads = responseData;
      } else if (Array.isArray(responseData?.content)) {
        leads = responseData.content;
      } else if (Array.isArray(responseData?.leads)) {
        leads = responseData.leads;
      }

      const sortedLeads = [...leads]
        .sort((firstLead, secondLead) => {
          const firstDate = firstLead.createdAt
            ? new Date(firstLead.createdAt).getTime()
            : 0;

          const secondDate = secondLead.createdAt
            ? new Date(secondLead.createdAt).getTime()
            : 0;

          return secondDate - firstDate;
        })
        .slice(0, 5);

      setRecentLeads(sortedLeads);
    } catch (err) {
      console.error("Unable to load recent leads:", err);

      setRecentLeads([]);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load recent leads."
      );
    } finally {
      setRecentLeadsLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatEnumValue = (value) => {
    if (!value) {
      return "Not available";
    }

    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const statusData = [
    {
      name: "New",
      value: summary.newLeads,
    },
    {
      name: "Contacted",
      value: summary.contactedLeads,
    },
    {
      name: "Qualified",
      value: summary.qualifiedLeads,
    },
    {
      name: "Won",
      value: summary.wonLeads,
    },
    {
      name: "Lost",
      value: summary.lostLeads,
    },
  ];

  const hasChartData = statusData.some(
    (item) => Number(item.value) > 0
  );

  const cards = [
    {
      title: "Total Leads",
      value: summary.totalLeads,
      icon: BriefcaseBusiness,
      className: "total-card",
    },
    {
      title: "New Leads",
      value: summary.newLeads,
      icon: CircleDot,
      className: "new-card",
    },
    {
      title: "Contacted",
      value: summary.contactedLeads,
      icon: PhoneCall,
      className: "contacted-card",
    },
    {
      title: "Qualified",
      value: summary.qualifiedLeads,
      icon: Target,
      className: "qualified-card",
    },
    {
      title: "Won",
      value: summary.wonLeads,
      icon: Trophy,
      className: "won-card",
    },
    {
      title: "Lost",
      value: summary.lostLeads,
      icon: XCircle,
      className: "lost-card",
    },
  ];

  if (loading) {
    return (
      <p className="dashboard-message">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of your lead management performance.
          </p>
        </div>

        <button
          type="button"
          className="refresh-dashboard-button"
          onClick={loadDashboard}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="dashboard-cards">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className={`dashboard-stat-card ${card.className}`}
              key={card.title}
            >
              <div>
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>

              <div className="dashboard-card-icon">
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-analytics-grid">
        <section className="dashboard-chart-card">
          <div className="chart-heading">
            <div>
              <h2>Lead Status Overview</h2>
              <p>Number of leads in each stage.</p>
            </div>
          </div>

          {hasChartData ? (
            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={statusData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Leads"
                    radius={[7, 7, 0, 0]}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          chartColours[
                            index % chartColours.length
                          ]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="chart-empty-message">
              Create leads to display the chart.
            </p>
          )}
        </section>

        <section className="dashboard-chart-card">
          <div className="chart-heading">
            <div>
              <h2>Lead Distribution</h2>
              <p>Percentage breakdown by status.</p>
            </div>
          </div>

          {hasChartData ? (
            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={95}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          chartColours[
                            index % chartColours.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="chart-empty-message">
              No lead distribution data available.
            </p>
          )}
        </section>
      </div>

      <section className="conversion-summary-card">
        <div className="conversion-icon">
          <CheckCircle2 size={30} />
        </div>

        <div>
          <p>Lead Conversion Rate</p>

          <h2>
            {Number(
              summary.conversionRate || 0
            ).toFixed(2)}
            <span>%</span>
          </h2>

          <small>
            Percentage of total leads successfully
            converted to Won.
          </small>
        </div>
      </section>

      <section className="recent-leads-card">
        <div className="recent-leads-heading">
          <div>
            <h2>Recent Leads</h2>
            <p>
              Your five most recently created leads.
            </p>
          </div>

          <button
            type="button"
            className="view-all-leads-button"
            onClick={() => navigate("/leads")}
          >
            View All Leads
          </button>
        </div>

        {recentLeadsLoading ? (
          <p className="recent-leads-message">
            Loading recent leads...
          </p>
        ) : recentLeads.length === 0 ? (
          <p className="recent-leads-message">
            No leads available. Create your first lead.
          </p>
        ) : (
          <div className="recent-leads-table-wrapper">
            <table className="recent-leads-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="recent-lead-person">
                        <div className="recent-lead-avatar">
                          {lead.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "L"}
                        </div>

                        <div>
                          <strong>
                            {lead.fullName || "Unnamed Lead"}
                          </strong>

                          <span>
                            {lead.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {lead.company || "Not available"}
                    </td>

                    <td>
                      <span
                        className={`recent-status-badge recent-status-${lead.status?.toLowerCase()}`}
                      >
                        {formatEnumValue(lead.status)}
                      </span>
                    </td>

                    <td>
                      {formatEnumValue(lead.source)}
                    </td>

                    <td>
                      {formatDate(lead.createdAt)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="recent-lead-view-button"
                        onClick={() =>
                          navigate(`/leads/${lead.id}`)
                        }
                        title="View lead"
                      >
                        <Eye size={17} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
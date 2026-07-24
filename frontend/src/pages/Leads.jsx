import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import axios from "../api/axios";
import "../styles/leads.css";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/leads", {
        params: {
          page,
          size: 5,
          search: keyword || undefined,
          status: status || undefined,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      const data = response.data;

      if (Array.isArray(data)) {
        setLeads(data);
        setTotalPages(1);
      } else {
        setLeads(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (err) {
      console.error("Unable to load leads:", err);
      setError("Unable to load leads. Please check the backend.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [page, status]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(0);
    loadLeads();
  };

  const handleClear = () => {
    setKeyword("");
    setStatus("");
    setPage(0);

    setTimeout(() => {
      loadLeads();
    }, 0);
  };

  const getStatusClass = (leadStatus) => {
    return `lead-status status-${leadStatus?.toLowerCase()}`;
  };

  return (
    <div className="leads-page">
      <div className="leads-header">
        <div>
          <h1>Leads</h1>
          <p>Manage and track all customer leads.</p>
        </div>

        <Link to="/leads/new" className="add-lead-button">
          <Plus size={18} />
          Add Lead
        </Link>
      </div>

      <div className="leads-toolbar">
        <form className="lead-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email or company"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </select>

          <button type="submit" className="search-button">
            Search
          </button>

          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>
      </div>

      <div className="leads-table-card">
        {loading && <p className="table-message">Loading leads...</p>}

        {!loading && error && (
          <p className="table-message error-message">{error}</p>
        )}

        {!loading && !error && leads.length === 0 && (
          <p className="table-message">No leads found.</p>
        )}

        {!loading && !error && leads.length > 0 && (
          <div className="table-wrapper">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.name || lead.fullName || "—"}</strong>
                    </td>

                    <td>{lead.email || "—"}</td>

                    <td>{lead.phone || "—"}</td>

                    <td>{lead.company || "—"}</td>

                    <td>
                      <span className={getStatusClass(lead.status)}>
                        {lead.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td>{lead.source || "—"}</td>

                    <td>
                      {lead.assignedTo?.name ||
                        lead.assignedToName ||
                        "Unassigned"}
                    </td>

                    <td>
                      <div className="lead-actions">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="action-button view-button"
                          title="View lead"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/leads/${lead.id}/edit`}
                          className="action-button edit-button"
                          title="Edit lead"
                        >
                          <Pencil size={17} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 0}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leads;
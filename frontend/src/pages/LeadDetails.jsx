import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react";

import api from "../api/axios";
import Toast from "../components/Toast";
import "../styles/lead-details.css";

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);

  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingNote, setAddingNote] = useState(false);
  const [deletingLead, setDeletingLead] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.message]);

  const fetchLead = async () => {
    const response = await api.get(`/leads/${id}`);
    setLead(response.data);
  };

  const fetchNotes = async () => {
    const response = await api.get(`/leads/${id}/notes`);

    setNotes(
      Array.isArray(response.data)
        ? response.data
        : response.data?.content || []
    );
  };

  const fetchActivities = async () => {
    const response = await api.get(`/leads/${id}/activities`);

    setActivities(
      Array.isArray(response.data)
        ? response.data
        : response.data?.content || []
    );
  };

  const loadLeadDetails = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchLead(),
        fetchNotes(),
        fetchActivities(),
      ]);
    } catch (error) {
      console.error("Load lead details error:", error);

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to load lead details",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeadDetails();
  }, [id]);

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (!noteText.trim()) {
      showToast("Please enter a note", "error");
      return;
    }

    try {
      setAddingNote(true);

      await api.post(`/leads/${id}/notes`, {
        content: noteText.trim(),
      });

      setNoteText("");
      await fetchNotes();
      await fetchActivities();

      showToast("Note added successfully", "success");
    } catch (error) {
      console.error("Add note error:", error);

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to add note",
        "error"
      );
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingNoteId(noteId);

      await api.delete(`/leads/${id}/notes/${noteId}`);

      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== noteId)
      );

      await fetchActivities();

      showToast("Note deleted successfully", "success");
    } catch (error) {
      console.error("Delete note error:", error);

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to delete note",
        "error"
      );
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleDeleteLead = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        lead?.fullName || "this lead"
      }? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingLead(true);

      await api.delete(`/leads/${id}`);

      showToast("Lead deleted successfully", "success");

      setTimeout(() => {
        navigate("/leads");
      }, 1000);
    } catch (error) {
      console.error("Delete lead error:", error);

      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to delete lead",
        "error"
      );

      setDeletingLead(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getNoteContent = (note) => {
    return note.content || note.note || note.text || "";
  };

  const getActivityDescription = (activity) => {
    return (
      activity.description ||
      activity.message ||
      formatEnumValue(activity.activityType)
    );
  };

  if (loading) {
    return (
      <div className="lead-details-page">
        <div className="details-card">
          <p>Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="lead-details-page">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({
              message: "",
              type: "success",
            })
          }
        />

        <div className="details-card">
          <h2>Lead not found</h2>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/leads")}
          >
            <ArrowLeft size={18} />
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-details-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <div className="lead-details-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/leads")}
          >
            <ArrowLeft size={18} />
            Back to Leads
          </button>

          <h1>{lead.fullName}</h1>
          <p>View lead information, notes and activity history.</p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="edit-button"
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            <Edit size={18} />
            Edit Lead
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteLead}
            disabled={deletingLead}
          >
            <Trash2 size={18} />
            {deletingLead ? "Deleting..." : "Delete Lead"}
          </button>
        </div>
      </div>

      <div className="lead-details-grid">
        <section className="details-card lead-information-card">
          <div className="section-heading">
            <User size={21} />
            <h2>Lead Information</h2>
          </div>

          <div className="lead-information-grid">
            <div className="information-item">
              <span className="information-icon">
                <User size={18} />
              </span>

              <div>
                <p className="information-label">Full Name</p>
                <p className="information-value">{lead.fullName}</p>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                <Mail size={18} />
              </span>

              <div>
                <p className="information-label">Email</p>
                <p className="information-value">
                  {lead.email || "Not available"}
                </p>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                <Phone size={18} />
              </span>

              <div>
                <p className="information-label">Phone</p>
                <p className="information-value">
                  {lead.phone || "Not available"}
                </p>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                <Building2 size={18} />
              </span>

              <div>
                <p className="information-label">Company</p>
                <p className="information-value">
                  {lead.company || "Not available"}
                </p>
              </div>
            </div>

            <div className="information-item">
              <div>
                <p className="information-label">Status</p>

                <span
                  className={`status-badge status-${lead.status?.toLowerCase()}`}
                >
                  {formatEnumValue(lead.status)}
                </span>
              </div>
            </div>

            <div className="information-item">
              <div>
                <p className="information-label">Source</p>
                <p className="information-value">
                  {formatEnumValue(lead.source)}
                </p>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                <Calendar size={18} />
              </span>

              <div>
                <p className="information-label">Created At</p>
                <p className="information-value">
                  {formatDate(lead.createdAt)}
                </p>
              </div>
            </div>

            <div className="information-item">
              <span className="information-icon">
                <Calendar size={18} />
              </span>

              <div>
                <p className="information-label">Last Updated</p>
                <p className="information-value">
                  {formatDate(lead.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="details-card notes-card">
          <div className="section-heading">
            <MessageSquare size={21} />
            <h2>Notes</h2>
          </div>

          <form className="note-form" onSubmit={handleAddNote}>
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Write a note about this lead..."
              rows={4}
              maxLength={1000}
            />

            <button
              type="submit"
              className="primary-button"
              disabled={addingNote}
            >
              <Plus size={18} />
              {addingNote ? "Adding..." : "Add Note"}
            </button>
          </form>

          <div className="notes-list">
            {notes.length === 0 ? (
              <p className="empty-message">No notes added yet.</p>
            ) : (
              notes.map((note) => (
                <article className="note-item" key={note.id}>
                  <div className="note-content">
                    <p>{getNoteContent(note)}</p>

                    <span>
                      {formatDate(note.createdAt)}
                      {note.createdBy?.name
                        ? ` • ${note.createdBy.name}`
                        : ""}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="icon-delete-button"
                    title="Delete note"
                    aria-label="Delete note"
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={deletingNoteId === note.id}
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="details-card activities-card">
          <div className="section-heading">
            <Calendar size={21} />
            <h2>Activity Timeline</h2>
          </div>

          <div className="activity-list">
            {activities.length === 0 ? (
              <p className="empty-message">No activities available.</p>
            ) : (
              activities.map((activity) => (
                <article className="activity-item" key={activity.id}>
                  <div className="activity-dot" />

                  <div className="activity-content">
                    <h3>{formatEnumValue(activity.activityType)}</h3>

                    <p>{getActivityDescription(activity)}</p>

                    <span>
                      {formatDate(activity.createdAt)}
                      {activity.performedBy?.name
                        ? ` • ${activity.performedBy.name}`
                        : ""}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LeadDetails;
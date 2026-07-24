import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import api from "../api/axios";
import Toast from "../components/Toast";
import "../styles/lead-form.css";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  status: "NEW",
  source: "WEBSITE",
  assignedToId: null,
};

function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetchingLead, setFetchingLead] = useState(isEditMode);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchLead = async () => {
      try {
        setFetchingLead(true);

        const response = await api.get(`/leads/${id}`);
        const lead = response.data;

        setFormData({
          fullName: lead.fullName || "",
          email: lead.email || "",
          phone: lead.phone || "",
          company: lead.company || "",
          status: lead.status || "NEW",
          source: lead.source || "WEBSITE",
          assignedToId:
            lead.assignedToId ||
            lead.assignedTo?.id ||
            null,
        });
      } catch (error) {
        showToast(
          error.response?.data?.message || "Unable to load lead details",
          "error"
        );
      } finally {
        setFetchingLead(false);
      }
    };

    fetchLead();
  }, [id, isEditMode]);

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

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showToast("Full name is required", "error");
      return false;
    }

    if (!formData.email.trim()) {
      showToast("Email is required", "error");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      showToast("Enter a valid email address", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      status: formData.status,
      source: formData.source,
      assignedToId: formData.assignedToId || null,
    };

    try {
      setLoading(true);

      if (isEditMode) {
        await api.put(`/leads/${id}`, requestData);
        showToast("Lead updated successfully", "success");
      } else {
        await api.post("/leads", requestData);
        showToast("Lead created successfully", "success");
      }

      setTimeout(() => {
        navigate("/leads");
      }, 1000);
    } catch (error) {
      console.error("Save lead error:", error);

      const validationErrors = error.response?.data?.errors;

      if (validationErrors && typeof validationErrors === "object") {
        const firstError = Object.values(validationErrors)[0];

        showToast(firstError || "Please check the form details", "error");
      } else {
        showToast(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Unable to save lead",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingLead) {
    return (
      <div className="lead-form-page">
        <div className="lead-form-card">
          <p>Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-form-page">
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

      <div className="lead-form-header">
        <div>
          <h1>{isEditMode ? "Edit Lead" : "Create Lead"}</h1>
          <p>
            {isEditMode
              ? "Update the lead information below."
              : "Enter the information to create a new lead."}
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/leads")}
        >
          <ArrowLeft size={18} />
          Back to Leads
        </button>
      </div>

      <form className="lead-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span>*</span>
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span>*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>

            <input
              id="company"
              name="company"
              type="text"
              placeholder="Enter company name"
              value={formData.company}
              onChange={handleChange}
              maxLength={120}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="source">Source</label>

            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="WEBSITE">Website</option>
              <option value="EMAIL">Email</option>
              <option value="REFERRAL">Referral</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/leads")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Lead"
              : "Create Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeadForm;
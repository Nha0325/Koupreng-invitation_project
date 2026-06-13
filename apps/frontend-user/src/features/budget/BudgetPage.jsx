import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import budgetService from "./api/budgetApi";
import BudgetItemForm from "./BudgetItemForm";
import BudgetItemTable from "./BudgetItemTable";
import BudgetSummaryCards from "./BudgetSummaryCards";
import "./BudgetPages.css";
import "../dashboard/DashboardPages.css";

export default function BudgetPage() {
  const { invitationId } = useParams();
  const [budget, setBudget] = useState(null);
  const [budgetForm, setBudgetForm] = useState({ totalBudget: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await budgetService.getBudget(invitationId);
      setBudget(data);
      setBudgetForm({
        totalBudget: data?.totalBudget ?? "",
        notes: data?.notes || "",
      });
    } catch (err) {
      setError(err?.message || "Could not load budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    budgetService
      .getBudget(invitationId)
      .then((data) => {
        if (active) {
          setBudget(data);
          setBudgetForm({
            totalBudget: data?.totalBudget ?? "",
            notes: data?.notes || "",
          });
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err?.message || "Could not load budget");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [invitationId]);

  const saveBudget = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = await budgetService.updateBudget(invitationId, {
        totalBudget: budgetForm.totalBudget === "" ? 0 : Number(budgetForm.totalBudget),
        notes: budgetForm.notes,
      });
      setBudget(data);
      setNotice("Budget saved.");
    } catch (err) {
      setError(err?.message || "Could not save budget");
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (payload) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      setBudget(await budgetService.addItem(invitationId, payload));
      setNotice("Budget item added.");
    } catch (err) {
      setError(err?.message || "Could not add budget item");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (itemId, payload) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      setBudget(await budgetService.updateItem(invitationId, itemId, payload));
      setNotice("Budget item updated.");
    } catch (err) {
      setError(err?.message || "Could not update budget item");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Delete this budget item?")) {
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await budgetService.deleteItem(invitationId, itemId);
      await load();
      setNotice("Budget item deleted.");
    } catch (err) {
      setError(err?.message || "Could not delete budget item");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = async () => {
    setSaving(true);
    setError("");
    try {
      await budgetService.exportBudget(invitationId);
    } catch (err) {
      setError(err?.message || "Could not export budget");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="dash-main report-page"><div className="report-state">កំពុងផ្ទុក...</div></main>;
  }

  if (error && !budget) {
    return (
      <main className="dash-main report-page">
        <div className="report-state is-error">
          <p>{error}</p>
          <button type="button" className="dash-btn" onClick={load}>Retry</button>
        </div>
      </main>
    );
  }

  return (
    <main className="dash-main report-page budget-page">
      <header className="dash-page-header report-header">
        <div>
          <span className="dash-kicker">Budget</span>
          <h1>ថវិកាកម្មវិធី</h1>
          <p>Track estimated and actual wedding costs by category.</p>
        </div>
        <div className="report-actions">
          <Link to={`/dashboard/invitations/${invitationId}`} className="dash-btn">Back to invitation</Link>
          <button type="button" className="dash-btn dash-btn-primary" onClick={exportCsv} disabled={saving}>
            Export CSV
          </button>
        </div>
      </header>

      {error && <div className="budget-alert is-error">{error}</div>}
      {notice && <div className="budget-alert">{notice}</div>}

      <BudgetSummaryCards budget={budget} />

      <section className="budget-panel">
        <div className="report-panel-head">
          <h2>Total budget</h2>
        </div>
        <form className="budget-total-form" onSubmit={saveBudget}>
          <label>
            Total budget
            <input
              type="number"
              min="0"
              step="0.01"
              value={budgetForm.totalBudget}
              onChange={(event) => setBudgetForm((current) => ({ ...current, totalBudget: event.target.value }))}
            />
          </label>
          <label>
            Notes
            <input
              value={budgetForm.notes}
              onChange={(event) => setBudgetForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Family contribution, deposit notes..."
            />
          </label>
          <button type="submit" className="dash-btn dash-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save budget"}
          </button>
        </form>
      </section>

      <section className="budget-panel">
        <div className="report-panel-head">
          <h2>Add budget item</h2>
        </div>
        <BudgetItemForm onSubmit={addItem} saving={saving} />
      </section>

      <section className="budget-panel">
        <div className="report-panel-head">
          <h2>Budget items</h2>
          <span>{budget?.items?.length || 0} items</span>
        </div>
        <BudgetItemTable
          items={budget?.items || []}
          onUpdate={updateItem}
          onDelete={deleteItem}
          saving={saving}
        />
      </section>
    </main>
  );
}

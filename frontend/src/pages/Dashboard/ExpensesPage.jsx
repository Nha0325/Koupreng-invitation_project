import Aside from "../../components/Aside";
import ExpensesFeature from "../../features/Expenses/ExpensesPage";
import "../../features/Dashboard/Dashboard.css";

function ExpensesPage() {
  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">
        <ExpensesFeature />
      </div>
    </div>
  );
}

export default ExpensesPage;

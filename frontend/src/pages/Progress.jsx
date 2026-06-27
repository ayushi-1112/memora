import { useEffect, useState } from "react";
import "./Progress.css";
import ProgressRing from "../components/ProgressRing";
import WeeklyBars from "../components/WeeklyBars";

function Progress() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    todayReviews: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [statsRes, tasksRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/stats", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/tasks", { credentials: "include" })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(prev => ({ ...prev, ...statsData }));
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        if (Array.isArray(tasksData)) setTasks(tasksData);
      }

    } catch (err) {
      console.error("Progress fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Loading progress...</p>;

  return (
    <section className="progress">
      <h2>Your Learning Progress</h2>

      <div className="stats-grid">
        <StatCard title="Total Tasks" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Reviewed Today" value={stats.todayReviews} />
        <StatCard title="Current Streak 🔥" value={`${stats.streak} days`} />
      </div>

      <div style={{ marginTop: "50px" }}>
        <ProgressRing completed={stats.completed} total={stats.total} />
      </div>

      <WeeklyBars tasks={tasks} />
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  );
}

export default Progress;

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    mg1Count: 0,
    mg2Count: 0,
    bp1Count: 0,
    fp1Count: 0,
    launchesCount: 0,
  });

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [selectedMember, filterMonth]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("owner_id");
      if (error) throw error;
      
      const uniqueOwnerIds = [...new Set(data.map(item => item.owner_id))];
      
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email')
        .in('id', uniqueOwnerIds);

      if (usersError) throw usersError;
      
      const memberList = [{ id: "", email: "All Members" }, ...users];
      setMembers(memberList);

    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Helper function to create a date query
      const createDateQuery = (dateColumn) => {
        let query = supabase.from("candidates").select("*", { count: "exact", head: true });
        if (selectedMember) {
          query = query.eq("owner_id", selectedMember);
        }
        if (filterMonth) {
          const [year, month] = filterMonth.split('-');
          const startDate = new Date(year, month - 1, 1).toISOString();
          const nextMonth = parseInt(month, 10);
          const nextMonthYear = parseInt(year, 10);
          const endBoundary = new Date(nextMonthYear, nextMonth, 1).toISOString();
          query = query.filter(dateColumn, 'gte', startDate).filter(dateColumn, 'lt', endBoundary);
        }
        return query;
      };

      const { count: mg1Count, error: mg1Error } = await createDateQuery("mg1").not("mg1", "is", null);
      if (mg1Error) throw mg1Error;
      
      const { count: mg2Count, error: mg2Error } = await createDateQuery("mg2").not("mg2", "is", null);
      if (mg2Error) throw mg2Error;
      
      const { count: bp1Count, error: bp1Error } = await createDateQuery("bp1").not("bp1", "is", null);
      if (bp1Error) throw bp1Error;

      const { count: fp1Count, error: fp1Error } = await createDateQuery("fp1").not("fp1", "is", null);
      if (fp1Error) throw fp1Error;

      const { count: launchesCount, error: launchesError } = await createDateQuery("prelaunch").not("prelaunch", "is", null);
      if (launchesError) throw launchesError;

      setMetrics({
        mg1Count,
        mg2Count,
        bp1Count,
        fp1Count,
        launchesCount
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonths = () => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      months.push(
        new Date(date.getFullYear(), date.getMonth() - i, 1).toISOString().slice(0, 7)
      );
    }
    return months;
  };
  
  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <div className="form-field">
            <label htmlFor="memberFilter" className="label sr-only">Filter by Member</label>
            <select id="memberFilter" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.email}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="monthFilter" className="label sr-only">Filter by Month</label>
            <select id="monthFilter" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              {getMonths().map(month => (
                <option key={month} value={month}>{getMonthYear(month)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-blue-600">{metrics.mg1Count}</div>
          <div className="text-lg text-gray-500">MG1</div>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-green-600">{metrics.mg2Count}</div>
          <div className="text-lg text-gray-500">MG2</div>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-yellow-600">{metrics.bp1Count}</div>
          <div className="text-lg text-gray-500">BP1</div>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-red-600">{metrics.fp1Count}</div>
          <div className="text-lg text-gray-500">FP1</div>
        </div>
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl font-bold text-purple-600">{metrics.launchesCount}</div>
          <div className="text-lg text-gray-500">Launches</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
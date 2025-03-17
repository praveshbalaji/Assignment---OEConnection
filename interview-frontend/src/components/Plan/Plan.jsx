import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addProcedureToPlan,
  getPlanProcedures,
  getProcedures,
  getUsers,
} from "../../api/api";
import Layout from '../Layout/Layout';
import ProcedureItem from "./ProcedureItem/ProcedureItem";
import PlanProcedureItem from "./PlanProcedureItem/PlanProcedureItem";

const Plan = () => {
  let { id } = useParams();
  const [procedures, setProcedures] = useState([]);
  const [planProcedures, setPlanProcedures] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsersMap, setSelectedUsersMap] = useState({});

  useEffect(() => {
    (async () => {
      const procedures = await getProcedures();
      const planProcedures = await getPlanProcedures(id);
      const users = await getUsers();

      const userOptions = users.map((u) => ({ label: u.name, value: u.userId }));

      setUsers(userOptions);
      setProcedures(procedures);
      setPlanProcedures(planProcedures);

      // Load selected users for each procedure from sessionStorage
      let storedUsersMap = {};
      planProcedures.forEach(p => {
        const storedUsers = sessionStorage.getItem(`selectedUsers-${p.procedure.procedureId}`);
        storedUsersMap[p.procedure.procedureId] = storedUsers ? JSON.parse(storedUsers) : [];
      });

      setSelectedUsersMap(storedUsersMap);
    })();
  }, [id]);

  const handleAddProcedureToPlan = async (procedure) => {
    const hasProcedureInPlan = planProcedures.some((p) => p.procedureId === procedure.procedureId);
    if (hasProcedureInPlan) return;

    await addProcedureToPlan(id, procedure.procedureId);
    setPlanProcedures((prevState) => [
      ...prevState,
      {
        planId: id,
        procedureId: procedure.procedureId,
        procedure: {
          procedureId: procedure.procedureId,
          procedureTitle: procedure.procedureTitle,
        },
      },
    ]);
  };

  const updateSelectedUsers = (procedureId, selectedUsers) => {
    setSelectedUsersMap(prevState => ({
      ...prevState,
      [procedureId]: selectedUsers
    }));
  };

  return (
    <Layout>
      <div className="container pt-4">
        <div className="d-flex justify-content-center">
          <h2>OEC Interview Frontend</h2>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="card shadow">
              <h5 className="card-header">Repair Plan</h5>
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <h4>Procedures</h4>
                    <div>
                      {procedures.map((p) => (
                        <ProcedureItem
                          key={p.procedureId}
                          procedure={p}
                          users={users}
                          handleAddProcedureToPlan={handleAddProcedureToPlan}
                          planProcedures={planProcedures}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col">
                    <h4>Added to Plan</h4>
                    <div>
                      {planProcedures.map((p) => (
                        <PlanProcedureItem
                          key={p.procedure.procedureId}
                          procedure={p.procedure}
                          users={users}
                          selectedUsersMap={selectedUsersMap}
                          updateSelectedUsers={updateSelectedUsers}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Plan;

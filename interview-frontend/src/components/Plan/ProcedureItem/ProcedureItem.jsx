import React, { useState, useEffect } from "react";

const ProcedureItem = ({ procedure, users, handleAddProcedureToPlan, planProcedures }) => {
    const [availableUsers, setAvailableUsers] = useState([]);

    // Retrieve availableUsers from sessionStorage when component mounts
    useEffect(() => {
        const storedUsers = sessionStorage.getItem(`availableUsers-${procedure.procedureId}`);
        if (storedUsers) {
            setAvailableUsers(JSON.parse(storedUsers));
        }
    }, [procedure.procedureId]);

    // Disable if no users are available
    const isDisabled = availableUsers.length === 0;

    const handleCheckboxChange = () => {
        const selectedUsers = JSON.parse(sessionStorage.getItem(`selectedUsers-${procedure.procedureId}`)) || [];
        const maxEngineersAllowed = users.length; // Max engineers allowed

        if (selectedUsers.length >= maxEngineersAllowed) {
            alert("OEConnection: No engineers available to assign.");
            return; // Stop execution if no engineers are available
        }

        handleAddProcedureToPlan(procedure);
    };

    return (
        <div className="py-2">
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id={`procedureCheckbox-${procedure.procedureId}`}
                    checked={planProcedures.some((p) => p.procedureId === procedure.procedureId)}
                    onChange={handleCheckboxChange}
                   
                />
                <label className="form-check-label" htmlFor={`procedureCheckbox-${procedure.procedureId}`}>
                    {procedure.procedureTitle}
                </label>
            </div>
        </div>
    );
};

export default ProcedureItem;

import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";

const PlanProcedureItem = ({ procedure, users, selectedUsersMap, updateSelectedUsers }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    // Load stored users from sessionStorage on mount
    useEffect(() => {
        const storedUsers = sessionStorage.getItem(`selectedUsers-${procedure.procedureId}`);
        if (storedUsers) {
            setSelectedUsers(JSON.parse(storedUsers));
        }
    }, [procedure.procedureId]);

    const handleAssignUserToProcedure = (selectedOptions) => {
        const updatedUsers = selectedOptions || [];
        setSelectedUsers(updatedUsers);

        // Store selected users in sessionStorage
        sessionStorage.setItem(`selectedUsers-${procedure.procedureId}`, JSON.stringify(updatedUsers));

        // Update the global selectedUsersMap
        updateSelectedUsers(procedure.procedureId, updatedUsers);
    };

    // Allow selection of all users in every dropdown
    const availableUsers = users.map(user => ({
        value: user.value,
        label: user.label
    }));

    return (
        <div className="py-2">
            <div className="form-check">
                <label className="form-check-label" htmlFor={`procedureCheckbox-${procedure.procedureId}`}>
                    {procedure.procedureTitle}
                </label>
            </div>

            <ReactSelect
                className="mt-2"
                placeholder="Select User to Assign"
                isMulti
                options={availableUsers}
                value={selectedUsers}
                onChange={handleAssignUserToProcedure}
            />
        </div>
    );
};

export default PlanProcedureItem;

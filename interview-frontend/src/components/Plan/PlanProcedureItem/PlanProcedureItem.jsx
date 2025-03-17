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
    sessionStorage.setItem(`selectedUsers-${users.usersId}`, JSON.stringify(availableUsers.length));

        // Update the global selectedUsersMap
        updateSelectedUsers(procedure.procedureId, updatedUsers);
    };

    // Dynamically calculate max engineers allowed based on total selected users
    const totalAssignedUsers = Object.values(selectedUsersMap).flat().length;
    const maxEngineersAllowed = users.length > 0 ? users.length : 4; // Default to 4 if users list is empty

    // Filter users: Exclude users already assigned to other procedures
    const assignedUserIds = Object.values(selectedUsersMap).flat().map(user => user.value);
    const availableUsers = users.filter(user => !assignedUserIds.includes(user.value) || selectedUsers.some(u => u.value === user.value));


   

    if (availableUsers.length === 0) {
       
        return null;
    }

    // Disable checkbox if all engineers are assigned
    const isDisabled = totalAssignedUsers >= maxEngineersAllowed;

    const handleCheckboxClick = (e) => {
        if (isDisabled) {
            e.preventDefault();
            alert("OEConnection: All engineers are assigned to other procedures.");
        }
    };

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

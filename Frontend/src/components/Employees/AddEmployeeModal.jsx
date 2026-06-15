import {
    useState,
    useEffect,
} from "react"; import "./AddEmployeeModal.css";

function AddEmployeeModal({
    isOpen,
    onClose,
    onSave,
    employees,
    initialData = null,
    mode = "add",
}) {
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            email: "",
            role: "",
            department: "",
            phone: "",
            reportingManager: "",
            status: "active",
            joinedDate: new Date()
                .toISOString()
                .split("T")[0],
        }
    );

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        onSave({
            ...formData,
            id:
                formData.id ||
                Date.now(),

            totalLeave: 20,
            usedLeave: 0,
            remainingLeave: 20,

            attendance: {
                present: 1,
                absent: 0,
                late: 0,
            },
        });
        useEffect(() => {
            if (initialData) {
                setFormData(initialData);
            }
        }, [initialData]);
        onClose();
    };

    return (
        <div className="modal-overlay">

            <div className="employee-modal">

                <h2>
                    {mode === "edit"
                        ? "Edit Employee"
                        : "Add Employee"}
                </h2>

                <div className="modal-grid">

                    <div>
                        <label>Name *</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Employee name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Email *</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="employee@company.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Role *</label>

                        <input
                            type="text"
                            name="role"
                            placeholder="Developer"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Department *</label>

                        <input
                            type="text"
                            name="department"
                            placeholder="IT Department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Phone Number</label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="1234567890"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Reporting Manager</label>

                        <select
                            name="reportingManager"
                            value={formData.reportingManager}
                            onChange={handleChange}
                        >
                            <option value="">
                                None
                            </option>

                            {employees.map((employee) => (
                                <option
                                    key={employee.id}
                                    value={employee.name}
                                >
                                    {employee.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>

                    <div>
                        <label>Joined Date</label>

                        <input
                            type="date"
                            name="joinedDate"
                            value={formData.joinedDate}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="modal-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="save-btn"
                        onClick={handleSubmit}
                    >
                        {mode === "edit"
                            ? "Save Changes"
                            : "Add Employee"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AddEmployeeModal;
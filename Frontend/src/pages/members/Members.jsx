import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import "./Members.css";
import { fetchMembers, deactivateUser, activateUser } from "../../services/userService";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const handleDeactivate = async (
    userId
  ) => {
    const result =
      await deactivateUser(userId);

    if (!result.success) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === userId
          ? {
            ...member,
            is_active: false,
          }
          : member
      )
    );
  };
  const handleActivate = async (
    userId
  ) => {
    const result =
      await activateUser(userId);

    if (!result.success) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === userId
          ? {
            ...member,
            is_active: true,
          }
          : member
      )
    );
  };
  useEffect(() => {
    const loadMembers = async () => {
      const result = await fetchMembers(selectedCompany);

      if (result.success) {
        setMembers(result.data);
      }

      setLoading(false);
    };

    loadMembers();
  }, [selectedCompany]);
  if (loading) {
    return (
      <MainLayout
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      >
        <div className="members-card">
          <h2>Loading members...</h2>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout
      selectedCompany={selectedCompany}
      setSelectedCompany={setSelectedCompany}
    >
      <div className="members-card">

        <div className="members-header">
          <h2>Members</h2>
        </div>

        <table className="members-table">

          <thead>
            <tr>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.fullname}</td>

                <td>{member.email}</td>

                <td>{member.role}</td>

                <td>
                  <span className={member.is_active ? "status-active" : "status-inactive"}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>
                  {member.is_active ? (
                    <button
                      className="deactivate-btn"
                      onClick={() =>
                        handleDeactivate(member.id)
                      }
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="activate-btn"
                      onClick={() =>
                        handleActivate(member.id)
                      }
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </MainLayout>
  );
}

export default Members;
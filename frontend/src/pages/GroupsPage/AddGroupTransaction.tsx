import React, { useEffect, useState } from "react";
import { groupsApi } from "../../api/groupsApi";
import styles from "./Group.module.scss";
import { useBalance } from "../../components/BalanceBar/useBalance";

interface Props {
  groupId: number;
  onTransactionAdded: () => void;
}

interface Member {
  userId: number;
  userEmail: string;
}

const AddGroupTransaction: React.FC<Props> = ({
  groupId,
  onTransactionAdded,
}) => {
  const [newDebtTitle, setNewDebtTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const { refreshBalance } = useBalance();

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await groupsApi.getGroupMembers(groupId);
      setMembers(data);
    };
    fetchMembers();
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || selectedUserIds.length === 0) return;

    try {
      await groupsApi.addGroupTransaction(
        groupId,
        parseFloat(amount),
        type,
        newDebtTitle,
        selectedUserIds
      );

      setAmount("");
      setNewDebtTitle("");
      setType("EXPENSE");
      setSelectedUserIds([]);
      onTransactionAdded();
      refreshBalance(null); // ⬅️ odświeżenie bilansu
    } catch (error) {
      console.error("Błąd dodawania transakcji grupowej:", error);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.formTitle}>
        Dodaj nowy {type === "EXPENSE" ? "wydatek" : "przychód"}
      </h3>
      <div className={styles.inputGroup}>
        <div className={styles.flex}>
          <input
            type="text"
            placeholder="Tytuł"
            value={newDebtTitle}
            onChange={(e) => setNewDebtTitle(e.target.value)}
            className={styles.input}
          />

          <input
            type="number"
            placeholder="Kwota"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as "EXPENSE" | "INCOME")}
            className={styles.input}
          >
            <option value="EXPENSE">Wydatek</option>
            <option value="INCOME">Przychód</option>
          </select>
        </div>
        <button
          type="button"
          className={styles.button}
          onClick={() => setShowUserModal(true)}
        >
          Wybierz użytkowników
        </button>

        {selectedUserIds.length > 0 && (
          <div className={styles.selectedUsers}>
            <strong>Wybrani użytkownicy:</strong>
            <ul>
              {members
                .filter((member) => selectedUserIds.includes(member.userId))
                .map((member) => (
                  <li key={member.userId}>{member.userEmail}</li>
                ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={selectedUserIds.length === 0 || newDebtTitle.length < 3}
        >
          Dodaj
        </button>
      </div>

      {showUserModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h4 className={styles.modalTitle}>
              Wybierz użytkowników do transakcji
            </h4>
            <ul className={styles.userList}>
              {members.map((member) => (
                <li key={member.userId} className={styles.userListItem}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(member.userId)}
                      onChange={() => toggleUserSelection(member.userId)}
                    />
                    {member.userEmail}
                  </label>
                </li>
              ))}
            </ul>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={() => setShowUserModal(false)}
              >
                Zatwierdź
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowUserModal(false)}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddGroupTransaction;
